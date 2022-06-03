import { cloneDeep, last, shuffle } from "lodash";
import { AudioEventTrigger, ServerEvent, ServerIO } from "../../../client/src/types/event.types";
import {
  GameNotification,
  NotificationForPlayer,
  NotificationType,
} from "../../../client/src/types/notification.types";
import { INITIAL_DECK_NON_ROYAL } from "../../../client/src/utils/deck-utils";
import {
  Card,
  CardPass,
  Game,
  GamePhase,
  GameStatus,
  Player,
} from "../../../client/src/types/game.types";
import { PlayerManager } from "../player/manager";
import { SERVER_IO } from "../server";
import { generateRandomGameId } from "../../../client/src/utils/data-utils";

const GAMES_DB: Record<Game["id"], Game> = {};

export interface OperationBase<T = void> {
  status: "success" | "error";
  result?: T;
}

export interface OperationSuccess<T = void> extends OperationBase<T> {
  status: "success";
  result: T;
}

export interface OperationError<T = void> extends OperationBase<T> {
  status: "error";
  result?: never;
}

export type Operation<T = void> = OperationSuccess<T> | OperationError<T>;

/** Map of all game managers - to avoid creating new ones */
const gameManagerMap = new Map<string, GameManager>();

export class GameManager {
  _playerManagerMap = new Map<string, PlayerManager>();

  constructor(
    public gameId: string,
    public gamesStore: Record<string, Game> = GAMES_DB,
    public io: ServerIO = SERVER_IO
  ) {}

  static for(gameId: string): GameManager {
    const existingManager = gameManagerMap.get(gameId);
    if (existingManager) {
      return existingManager;
    } else {
      const newManager = new this(gameId);
      gameManagerMap.set(gameId, newManager);
      return newManager;
    }
  }

  static hostNew(socketId: string, playerName?: string): GameManager {
    const gameId = generateRandomGameId();
    const game: Game = {
      id: gameId,
      active: {
        playerId: socketId,
        passHistory: [],
        phase: GamePhase.PASS_SELECTION,
      },
      players: {
        [socketId]: {
          name: playerName,
          socketId,
          isHost: true,
          gameId,
          cards: {
            hand: [],
            area: [],
          },
        },
      },
      status: GameStatus.LOBBY,
      settings: { royalVariant: false },
    };
    const gameManager = GameManager.for(gameId);
    gameManager.set(game);
    return gameManager;
  }

  _broadcast(): void {
    this._withPointer((pointer) => {
      this.io.emit(ServerEvent.GAME_UPDATED, this.gameId, pointer);
    });
  }

  _mutate(mutativeCb: (game: Game) => void): void {
    this._withPointer(mutativeCb);
    this._broadcast();
  }

  _pointer(): Game | undefined {
    return this.gamesStore[this.gameId];
  }

  _set(game: Game): void {
    this.gamesStore[this.gameId] = game;
    this._broadcast();
  }

  _withPointer<T = void>(cb: (gamePointer: Game) => T): Operation<T> {
    const pointer = this._pointer();
    if (pointer) {
      const result = cb(pointer);
      return { status: "success", result };
    } else {
      return { status: "error" };
    }
  }

  public activeCard(): Card | undefined {
    return this.snapshot()?.active.card;
  }

  public activePlayer(): Player {
    const snapshot = this.snapshot();
    if (!snapshot) throw new Error("Couldn't find data");

    const player = this.players()[snapshot.active.playerId];
    if (!player) throw new Error("Couldn't find active player");

    return player;
  }

  private currentClaim(): CardPass {
    const lastPass = last(this.snapshot()?.active.passHistory);
    if (!lastPass) throw new Error("No claims found");
    return lastPass;
  }

  public dealInitialHands(): void {
    const deck = shuffle(INITIAL_DECK_NON_ROYAL);
    const playerIds = shuffle(Object.keys(this.players()));
    const dealtCards: Record<string, Card[]> = Object.fromEntries(
      playerIds.map((id) => [id, []])
    );

    for (let deckIdx = 0; deckIdx < deck.length; deckIdx++) {
      const playerIdx = deckIdx % playerIds.length;
      const playerId = playerIds[playerIdx];
      dealtCards[playerId].push(deck[deckIdx]);
    }

    this.updateEachPlayer((player) => {
      player.cards.hand = dealtCards[player.socketId];
    });

    this.update((game) => {
      game.active.playerId = playerIds[0];
    });
  }

  public declareLoser(loserId?: string): void {
    const loserPlayerId = loserId ?? this.loserId();
    if (loserPlayerId) {
      const completedSuit =
        this.managePlayer(loserPlayerId).completedSetIfExists();
      this.update((game) => {
        game.loser = {
          id: loserPlayerId,
          suit: completedSuit,
        };
        delete game.active.card;
        game.active.phase = GamePhase.DECLARE_LOSER;
      });

      this.pushGameNotificationToAll({
        type: NotificationType.GENERAL,
        message: "Game over!",
      });
    }
  }

  public getHostPlayer(): Player | undefined {
    const host = Object.values(this.players()).find((player) => player.isHost);
    return host;
  }

  public getPlayer(playerId: string): Player | undefined {
    return this.managePlayer(playerId).snapshot();
  }

  public getPlayerOrFail(playerId: string) {
    const player = this.getPlayer(playerId);
    if (player) {
      return player;
    } else {
      throw new Error(`Couldn't find player with id ${playerId}`);
    }
  }

  private isCurrentClaimTruthful(): boolean {
    const { claim } = this.currentClaim();
    const actual = this.activeCard();

    return actual?.suit === claim;
  }

  public loserId(): string | undefined {
    for (const playerId of this.playerIds()) {
      if (this.managePlayer(playerId).hasLost()) return playerId;
    }
  }

  public manageEachPlayer(cb: (playerManager: PlayerManager) => void) {
    for (const playerId in this.players()) {
      const playerManager = this.managePlayer(playerId);
      cb(playerManager);
    }
  }

  public managePlayer(
    playerId: string,
    aliasIds: string[] = []
  ): PlayerManager {
    const extantPlayerManager = this._playerManagerMap.get(playerId);
    if (extantPlayerManager) {
      return extantPlayerManager;
    } else {
      const newPlayerManager = new PlayerManager(this, playerId, aliasIds);
      this._playerManagerMap.set(playerId, newPlayerManager);
      return newPlayerManager;
    }
  }

  public playerIds(): string[] {
    return Object.keys(this.players());
  }

  public players(): Readonly<Record<string, Player>> {
    const snapshot = this.snapshot();
    if (snapshot) {
      return snapshot.players;
    } else {
      throw new Error("Could not find game to locate players for");
    }
  }

  public pushGameNotificationToAll(notification: GameNotification): void {
    this.io.emit(ServerEvent.GAME_NOTIFICATION, this.gameId, notification);
  }

  public pushPlayerNotificationById(
    playerId: string,
    notification: NotificationForPlayer
  ): void {
    this.managePlayer(playerId).pushNotification(notification);
  }

  public pushPlayersNotification(
    notification: NotificationForPlayer,
    where: (player: Player) => boolean = () => true
  ): void {
    const playersToNotify = Object.values(this.players()).filter(where);
    for (const player of playersToNotify) {
      this.managePlayer(player.socketId).pushNotification(notification);
    }
  }

  public resetGame(): void {
    this.update((game) => {
      game.status = GameStatus.LOBBY;
      game.active = {
        playerId: this.getHostPlayer()?.socketId ?? this.playerIds()[0],
        passHistory: [],
        phase: GamePhase.PASS_SELECTION,
      };
    });

    this.updateEachPlayer((player) => {
      player.cards = {
        hand: [],
        area: [],
      };
    });
  }

  public resolveCardPrediction(prediction: boolean): void {
    const gainedCard = this.activeCard();
    if (!gainedCard) return;

    const isPredictionAccurate = this.isCurrentClaimTruthful() === prediction;
    const { to, from } = this.currentClaim();
    const gainingPlayerId = isPredictionAccurate ? from : to;

    this.managePlayer(gainingPlayerId).update((player) => {
      gainedCard && player.cards.area.push(gainedCard);
    });

    this.pushPlayersNotification((player) => ({
      type: NotificationType.GENERAL,
      message: `${
        to === player.socketId ? "You" : this.getPlayerOrFail(to).name
      } ${isPredictionAccurate ? "correctly" : "incorrectly"} predicted ${
        from === player.socketId
          ? "your"
          : `${this.getPlayerOrFail(from).name}'s`
      } claim, so ${
        player.socketId === gainingPlayerId
          ? "you collect"
          : `${this.getPlayerOrFail(gainingPlayerId).name} collects`
      } the card`,
    }));

    // If there is a losing player, it will always be the player
    //  who has just gained a card (so no other players need checking)
    if (this.managePlayer(gainingPlayerId).hasLost()) {
      this.declareLoser(gainingPlayerId);
    } else {
      this.startNewCardPass(gainingPlayerId);
    }
  }

  public revealCardPredictionResult(prediction: boolean): void {
    const gainedCard = this.activeCard();
    const pass = this.currentClaim();
    if (!gainedCard && !pass)
      throw new Error("No card or claim to reveal for prediction");

    this.update((game) => {
      game.active.prediction = prediction;
      game.active.phase = GamePhase.CARD_REVEAL;
    });
  }

  public set(game: Game): void {
    this._set(game);
  }

  public setWithPointer(cb: (gamePointer: Game) => Game): void {
    this._withPointer((pointer) => {
      this.set(cb(pointer));
    });
  }

  public snapshot(): Game | undefined {
    const operation = this._withPointer((pointer) => cloneDeep(pointer));
    if (operation.status === "success") {
      return operation.result;
    }
  }

  public startNewCardPass(playerId: string): void {
    this.update((game) => {
      delete game.active.card;
      game.active.passHistory = [];
      game.active.phase = GamePhase.PASS_SELECTION;
      game.active.playerId = playerId;
    });
  }

  public triggerAudio(audioEventTrigger: AudioEventTrigger): void {
    this.io.emit(ServerEvent.AUDIO_EVENT_TRIGGERED, audioEventTrigger)
  }

  /**
   * Updates a game, by applying a callback function,
   *  and broadcasts the update to sockets
   * @param mutativeCb - mutative callback function for the game data
   */
  public update(mutativeCb: (game: Game) => void) {
    this._mutate(mutativeCb);
  }

  public updateEachPlayer(mutativeCb: (player: Player) => void): void {
    for (const playerId in this.players()) {
      this.managePlayer(playerId).update(mutativeCb);
    }
  }

  public updatePlayer(playerId: string, mutativeCb: (player: Player) => void) {
    this.managePlayer(playerId).update(mutativeCb);
  }
}

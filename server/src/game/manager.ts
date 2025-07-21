import * as _ from "lodash";
import {
  AudioEventTrigger,
  ServerEvent,
  ServerIO,
} from "../../../client/src/types/event.types";
import {
  GameNotification,
  NotificationForPlayer,
  NotificationType,
} from "../../../client/src/types/notification.types";
import {
  Card,
  CardPass,
  CardSuit,
  Game,
  GamePhase,
  GameStatus,
  Player,
  GameSettings,
} from "../../../client/src/types/game.types";
import { PlayerManager } from "../player/manager";
import { SERVER_IO } from "../server";
import { generateRandomGameId } from "../../../client/src/utils/data-utils";
import { INITIAL_DECK } from "../../../client/src/utils/deck-utils";

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
      settings: { royalVariant: true },
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
    const lastPass = _.last(this.snapshot()?.active.passHistory);
    if (!lastPass) throw new Error("No claims found");
    return lastPass;
  }

  public dealInitialHands(): void {
    const game = this.snapshot();
    if (!game) throw new Error("could not find game");

    const deck = game.settings.royalVariant
      ? INITIAL_DECK
      : INITIAL_DECK.filter((c) => c.variant !== "Royal");

    const shuffledDeck = _.shuffle(deck);
    const punishmentPile = shuffledDeck.splice(0, 7);
    const revealedCard = punishmentPile.pop();

    if (!revealedCard) {
      throw new Error("Could not create punishment pile");
    }

    const playerIds = _.shuffle(Object.keys(this.players()));
    const dealtCards: Record<string, Card[]> = Object.fromEntries(
      playerIds.map((id) => [id, []])
    );

    for (let deckIdx = 0; deckIdx < shuffledDeck.length; deckIdx++) {
      const playerIdx = deckIdx % playerIds.length;
      const playerId = playerIds[playerIdx];
      dealtCards[playerId].push(shuffledDeck[deckIdx]);
    }

    this.updateEachPlayer((player) => {
      player.cards.hand = dealtCards[player.socketId];
    });

    this.update((game) => {
      game.active.playerId = playerIds[0];
      game.punishmentCards = {
        pile: punishmentPile,
        revealedCard,
      };
    });
  }

  private drawPenaltyCard(gainingPlayerId: string) {
    let cardToDraw: Card | undefined;

    this.update(game => {
      const gainingPlayer = game.players[gainingPlayerId];
      if (!gainingPlayer) return;

      if (game.punishmentCards) {
        cardToDraw = game.punishmentCards.revealedCard;
        gainingPlayer.cards.area.push(cardToDraw);

        this.pushPlayerNotificationById(gainingPlayerId, (player) => {
          const language = player.language || 'en';
          if (language === 'zh') {
            return {
              type: NotificationType.GENERAL,
              message: `作为惩罚，你从惩罚牌堆中抽取了一张牌。`
            };
          }
          return {
            type: NotificationType.GENERAL,
            message: `As a penalty, you drew a card from the punishment pile.`
          };
        });

        const nextCardInPile = game.punishmentCards.pile.pop();
        if (nextCardInPile) {
          game.punishmentCards.revealedCard = nextCardInPile;
        } else {
          delete game.punishmentCards;
        }
      } else {
        if (gainingPlayer.cards.hand.length > 0) {
          const cardSample = _.sample(gainingPlayer.cards.hand);
          if (cardSample) {
            cardToDraw = cardSample;
            gainingPlayer.cards.hand = gainingPlayer.cards.hand.filter(c => c.id !== cardToDraw!.id);
            gainingPlayer.cards.area.push(cardToDraw);

            this.pushPlayerNotificationById(gainingPlayerId, (player) => {
              const language = player.language || 'en';
              if (language === 'zh') {
                return {
                  type: NotificationType.GENERAL,
                  message: `作为惩罚，你从自己的手牌中抽取了一张牌。`
                };
              }
              return {
                type: NotificationType.GENERAL,
                message: `As a penalty, you drew a card from your own hand.`
              };
            });
          }
        }
      }
    });

    if (cardToDraw?.variant === "Royal") {
      this.drawPenaltyCard(gainingPlayerId);
    }
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

      this.pushPlayersNotification((player) => {
        const language = player.language || 'en';

        if (language === 'zh') {
          return {
            type: NotificationType.GENERAL,
            message: "游戏结束！",
          };
        } else {
          return {
            type: NotificationType.GENERAL,
            message: "Game over!",
          };
        }
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
    if (player) return player;
    else throw new Error(`Could not find player by id ${playerId}`);
  }

  private isCurrentClaimTruthful(): boolean {
    const activeCard = this.activeCard();
    if (!activeCard) throw new Error("Could not find active card");

    const { claim } = this.currentClaim();

    if (activeCard.suit === CardSuit.JOKER) {
      return claim !== "Royal";
    }

    if (claim === "Royal") {
      return activeCard.variant === "Royal";
    }

    return activeCard.suit === claim;
  }

  public loserId(): string | undefined {
    return this.snapshot()?.loser?.id;
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
    notification: NotificationForPlayer | ((player: Player) => NotificationForPlayer)
  ): void {
    const player = this.getPlayer(playerId);
    if (!player) return;

    const finalNotification = typeof notification === 'function'
      ? notification(player)
      : notification;

    this.managePlayer(playerId).pushNotification(finalNotification);
  }

  public pushPlayersNotification(
    notification: NotificationForPlayer | ((player: Player) => NotificationForPlayer),
    where: (player: Player) => boolean = () => true
  ): void {
    const playersToNotify = Object.values(this.players()).filter(where);
    for (const player of playersToNotify) {
      const finalNotification = typeof notification === 'function'
        ? notification(player)
        : notification;

      this.managePlayer(player.socketId).pushNotification(finalNotification);
    }
  }

  public resetGame(): void {
    this.update((game) => {
      // Preserve players and their properties
      for (const pId in game.players) {
        const player = game.players[pId];
        player.cards = { area: [], hand: [] };
      }

      delete game.loser;

      game.status = GameStatus.LOBBY;
      game.active = {
        playerId: game.active.playerId,
        passHistory: [],
        phase: GamePhase.PASS_SELECTION,
      };
    });
  }

  public resolveCardPrediction(prediction: boolean): void {
    const activeCard = this.activeCard();

    if (!activeCard) {
      return;
    }
    const { from: passerId, to: activePlayerId } = this.currentClaim();

    let isCorrect: boolean;

    if (activeCard.suit === CardSuit.NOTHING) {
      isCorrect = false;
    } else {
      const isTruthful = this.isCurrentClaimTruthful();
      isCorrect = prediction === isTruthful;
    }

    const penaltyReceiverId = isCorrect ? passerId : activePlayerId;

    // 特殊牌与皇冠牌才进行额外惩罚
    if(["Royal","SPECIAL"].includes(activeCard.variant)){
      this.drawPenaltyCard(penaltyReceiverId);
    }
    this.triggerAudio(
      isCorrect
        ? AudioEventTrigger.PREDICTION_CORRECT
        : AudioEventTrigger.PREDICTION_INCORRECT
    );

    const loser = this.players()[penaltyReceiverId];
    const passer = this.players()[passerId];
    const activePlayer = this.players()[activePlayerId];

    this.pushPlayersNotification((player) => {
      const language = player.language || "en";
      if (language === "zh") {
        return {
          type: NotificationType.GENERAL,
          message: `${activePlayer.name} ${
            isCorrect ? "正确地" : "错误地"
          } 猜测了 ${passer.name} 传递的卡片. ${
            loser.name
          } 抽了一张惩罚牌.`,
        };
      } else {
        return {
          type: NotificationType.GENERAL,
          message: `${activePlayer.name} guessed ${
            isCorrect ? "correctly" : "incorrectly"
          } about the card from ${passer.name}. ${
            loser.name
          } drew a penalty card.`,
        };
      }
    });

    this.managePlayer(penaltyReceiverId).update(player => {
        player.cards.area.push(activeCard);
    });

    const { area: loserArea } = this.players()[penaltyReceiverId].cards;

    // 按花色分组统计，检查任意花色是否达到4张
    const suitCounts = _.groupBy(loserArea, 'suit');
    const hasFourOfAnySuit = Object.values(suitCounts).some(cards => cards.length >= 4);

    if (hasFourOfAnySuit ) {
      this.declareLoser(penaltyReceiverId);
    } else {
      this.startNewCardPass(penaltyReceiverId);
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
    const operation = this._withPointer((pointer) => _.cloneDeep(pointer));
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
    this.io.emit(ServerEvent.AUDIO_EVENT_TRIGGERED, audioEventTrigger);
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

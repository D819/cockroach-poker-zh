import { cloneDeep } from "lodash";
import { ServerEvent } from "../../../client/src/types/event.types";
import { Card, CardId, CardSuit, Player } from "../../../client/src/types/game.types";
import { GameManager, Operation } from "../game/manager";
import { NotificationForPlayer } from "../../../client/src/types/notification.types";

export class PlayerManager {
  constructor(
    public gameManager: GameManager,
    public socketId: string,
    public aliasSocketIds: string[] = []
  ) {}

  _broadcast(): void {
    this._withPointer((pointer) => {
      this.gameManager.io.emit(
        ServerEvent.PLAYER_UPDATED,
        this.socketId,
        pointer
      );
    });
    this.gameManager._broadcast();
  }

  _mutate(mutativeCb: (player: Player) => void) {
    this._withPointer((pointer) => {
      mutativeCb(pointer);
      this._broadcast();
    });
  }

  _pointer(): Player | undefined {
    const operation = this.gameManager._withPointer((pointer) => {
      const canonicalId = [this.socketId, ...this.aliasSocketIds].find(
        (id) => pointer.players[id]
      );
      return canonicalId ? pointer.players[canonicalId] : undefined;
    });
    if (operation.status === "success") {
      return operation.result;
    }
  }

  _set(player: Player): void {
    this.gameManager.setWithPointer((gamePointer) => ({
      ...gamePointer,
      players: {
        ...gamePointer.players,
        [this.socketId]: player,
      },
    }));

    this._broadcast();
  }

  _withPointer<T = void>(cb: (playerPointer: Player) => T): Operation<T> {
    const pointer = this._pointer();
    if (pointer) {
      const result = cb(pointer);
      return { status: "success", result };
    } else {
      return { status: "error" };
    }
  }

  public cardsInHand(): Card[] {
    const cards = this.snapshot()?.cards.hand;
    if (!cards) return [];
    return cards;
  }

  public completedSetIfExists(): CardSuit | undefined {
    const suitCount = Object.entries(this.countEachSuit()) as [
      CardSuit,
      number
    ][];

    for (const [suit, total] of suitCount) {
      if (total === 4) {
        return suit;
      }
    }
  }

  private countEachSuit(): Partial<Record<CardSuit, number>> {
    const snapshot = this.snapshot();
    if (!snapshot) throw new Error("Couldn't find underlying player data");

    const collectedCards = Object.values(snapshot.cards.area);

    const totals = collectedCards.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.suit]: (acc[curr.suit] ?? 0) + 1,
      }),
      {} as Partial<Record<CardSuit, number>>
    );

    return totals;
  }

  public dropCard(cardId: CardId): void {
    this.update((player) => {
      player.cards.hand = player.cards.hand.filter(
        (card) => card.id !== cardId
      );
    });
  }

  public getNameOrFail(): string {
    const name = this._pointer()?.name;
    if (!name) throw new Error("Couldn't find a name");
    return name;
  }

  /**
   * Checks whether a player has lost.
   * 
   * This should only be called when a player has just gained a card.
   * 
   * It will not report the right results otherwise - e.g. it is
   *  possible for a player to have 0 cards but not be the loser.
   * 
   * (They are only the loser if they have 0 cards in hand and are
   *  also due to start a new card pass, but can't.)
   * 
   */
  public hasLost(): boolean {
    if (this.cardsInHand().length === 0) return true;
    if (this.completedSetIfExists()) return true;
    return false;
  }

  public pushNotification(playerNotification: NotificationForPlayer): void {
    this._withPointer((player) => {
      const notification =
        typeof playerNotification === "function"
          ? playerNotification(player)
          : playerNotification;

      this.gameManager.io.emit(
        ServerEvent.PLAYER_NOTIFICATION,
        { [this.socketId]: true },
        notification
      );
    });
  }

  public set(player: Player): void {
    this._set(player);
  }

  public snapshot(): Player | undefined {
    const operation = this._withPointer((pointer) => cloneDeep(pointer));
    if (operation.status === "success") {
      return operation.result;
    }
  }

  public update(mutativeCb: (player: Player) => void) {
    this._mutate(mutativeCb);
  }
}

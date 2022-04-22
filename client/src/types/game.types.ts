export interface Game {
  id: string;
  players: {
    [playerSocketId: string]: Player;
  };
  status: GameStatus;
  settings: GameSettings;
}

export interface Card<Suit extends CardSuit = CardSuit> {
  id: `${Suit} ${CardVariant}`;
  suit: Suit;
  variant: CardVariant;
}

export enum CardSuit {
  BAT = "bat",
  COCKROACH = "cockroach",
  FLY = "fly",
  RAT = "rat",
  SCORPION = "scorpion",
  SPIDER = "spider",
  STINK_BUG = "stink bug",
  TOAD = "toad"
}

export type CardVariant = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "Royal";

export enum GameStatus {
  LOBBY = "LOBBY",
  ONGOING = "ONGOING",
  COMPLETE = "COMPLETE",
}

export interface Player {
  socketId: string;
  gameId?: string;
  name?: string;
  isHost?: boolean;
  cards: {
    hand: Card[];
    area: Card[];
  }
}

export interface GameSettings {
  royalVariant?: boolean;
}

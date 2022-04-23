export interface Game {
  id: string;
  active: {
    playerId: string;
    card?: Card;
    passHistory: CardPass[];
    phase: GamePhase;
  };
  players: {
    [playerSocketId: string]: Player;
  };
  status: GameStatus;
  settings: GameSettings;
}

export interface Card<Suit extends CardSuit = CardSuit, Variant extends CardVariant = CardVariant> {
  id: `${Suit} ${Variant}`;
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
  STINK_BUG = "stink-bug",
  TOAD = "toad"
}

export type CardVariant = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "Royal";

type InitialCardSuitNonRoyal<Suit extends CardSuit> = [Card<Suit, "1">, Card<Suit, "2">, Card<Suit, "3">, Card<Suit, "4">, Card<Suit, "5">, Card<Suit, "6">, Card<Suit, "7">, Card<Suit, "8">]

export type InitialCardSuit<Suit extends CardSuit, IsRoyal extends boolean = false> = IsRoyal extends false ? InitialCardSuitNonRoyal<Suit> : [...InitialCardSuitNonRoyal<Suit>, Card<Suit, "Royal">]

export interface CardPass {
  from: string;
  to: string;
  claim: CardSuit;
}

export enum GameStatus {
  LOBBY = "LOBBY",
  ONGOING = "ONGOING",
}

export enum GamePhase {
  CARD_BEING_PICKED = 'card-being-picked',
  PREDICT_OR_PASS = 'predict-or-pass'
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

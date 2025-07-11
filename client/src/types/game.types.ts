export interface Game {
  id: string;
  active: {
    playerId: string;
    card?: Card;
    passHistory: CardPass[];
    phase: GamePhase;
    /* Whether the prediction is 'true' or 'false' */
    prediction?: boolean;
    showFlip?: boolean;
  };
  punishmentCards?: PunishmentCards;
  loser?: {
    id: string;
    suit?: CardSuit;
  };
  players: {
    [playerSocketId: string]: Player;
  };
  status: GameStatus;
  settings: GameSettings;
}

export interface PunishmentCards {
  pile: Card[];
  revealedCard: Card;
}

export type CardId<
  Suit extends CardSuit = CardSuit,
  Variant extends CardVariant = CardVariant
> = `${Suit} ${Variant}`;

export interface Card<
  Suit extends CardSuit = CardSuit,
  Variant extends CardVariant = CardVariant
> {
  id: CardId<Suit, Variant>;
  suit: Suit;
  variant: CardVariant;
}

export enum CardSuit {
  BAT = "Bat",
  COCKROACH = "Cockroach",
  FLY = "Fly",
  RAT = "Rat",
  SCORPION = "Scorpion",
  SPIDER = "Spider",
  STINK_BUG = "Stink bug",
  TOAD = "Toad",
}

export type CardVariant =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "Royal";

export type Claim = CardSuit | "Royal";

export interface CardPass {
  from: string;
  to: string;
  claim: Claim;
}

export enum GameStatus {
  LOBBY = "LOBBY",
  ONGOING = "ONGOING",
}

export enum GamePhase {
  CARD_REVEAL = "card-reveal",
  DECLARE_LOSER = "declare-loser",
  PASS_SELECTION = "pass-selection",
  PREDICT_OR_PASS = "predict-or-pass",
}

export interface Player {
  socketId: string;
  gameId?: string;
  name?: string;
  isHost?: boolean;
  language?: string;
  cards: {
    hand: Card[];
    area: Card[];
  };
}

export interface GameSettings {
  royalVariant?: boolean;
}

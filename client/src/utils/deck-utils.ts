import {
  Card,
  CardSuit,
  CardVariant,
  InitialCardSuit,
} from "../types/game.types";

const createCard = <Suit extends CardSuit, Variant extends CardVariant>(
  suit: Suit,
  variant: Variant
): Card<Suit, Variant> => ({
  id: `${suit} ${variant}`,
  suit,
  variant,
});

const createNonRoyalDeck = <Suit extends CardSuit>(
  suit: Suit
): InitialCardSuit<Suit> => [
  createCard(suit, "1"),
  createCard(suit, "2"),
  createCard(suit, "3"),
  createCard(suit, "4"),
  createCard(suit, "5"),
  createCard(suit, "6"),
  createCard(suit, "7"),
  createCard(suit, "8"),
];

export const INITIAL_DECK_NON_ROYAL: Card[] = [
  ...createNonRoyalDeck(CardSuit.BAT),
  ...createNonRoyalDeck(CardSuit.COCKROACH),
  ...createNonRoyalDeck(CardSuit.FLY),
  ...createNonRoyalDeck(CardSuit.RAT),
  ...createNonRoyalDeck(CardSuit.SCORPION),
  ...createNonRoyalDeck(CardSuit.SPIDER),
  ...createNonRoyalDeck(CardSuit.STINK_BUG),
  ...createNonRoyalDeck(CardSuit.TOAD),
];

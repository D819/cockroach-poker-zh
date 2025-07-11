import {
  Card,
  CardSuit,
  CardVariant,
} from "../types/game.types";

const createCard = <Suit extends CardSuit, Variant extends CardVariant>(
  suit: Suit,
  variant: Variant
): Card<Suit, Variant> => ({
  id: `${suit} ${variant}`,
  suit,
  variant,
});

const createSuitDeck = <Suit extends CardSuit>(
  suit: Suit
): Card<Suit, CardVariant>[] => [
  createCard(suit, "1"),
  createCard(suit, "2"),
  createCard(suit, "3"),
  createCard(suit, "4"),
  createCard(suit, "5"),
  createCard(suit, "6"),
  createCard(suit, "7"),
  createCard(suit, "Royal"),
];

export const INITIAL_DECK: Card[] = [
  ...createSuitDeck(CardSuit.BAT),
  ...createSuitDeck(CardSuit.COCKROACH),
  ...createSuitDeck(CardSuit.FLY),
  ...createSuitDeck(CardSuit.RAT),
  ...createSuitDeck(CardSuit.SCORPION),
  ...createSuitDeck(CardSuit.SPIDER),
  ...createSuitDeck(CardSuit.STINK_BUG),
  ...createSuitDeck(CardSuit.TOAD),
];

import { Card, CardSuit } from "../types/game.types";

export const countEachSuit = (cards: Card[]): Record<CardSuit, number> => cards.reduce((accCount, curr) => ({
    ...accCount,
    [curr.suit]: accCount[curr.suit] + 1,
  }),
  Object.fromEntries(
    Object.values(CardSuit).map((suit) => [suit, 0])
  ) as Record<CardSuit, number>)
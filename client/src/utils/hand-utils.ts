import { Card, CardSuit } from "../types/game.types";

export interface HandCard {
  id: string;
  suit: CardSuit;
  variant: "Royal" | "Normal";
  card: Card;
  count: number;
}

export const groupHandByCardType = (cards: Card[]): HandCard[] => {
  const cardMap = new Map<string, HandCard>();

  for (const card of cards) {
    const variantType = card.variant === "Royal" ? "Royal" : "Normal";
    const id = `${card.suit}-${variantType}`;

    if (cardMap.has(id)) {
      const existing = cardMap.get(id) as HandCard;
      existing.count++;
    } else {
      cardMap.set(id, {
        id,
        suit: card.suit,
        variant: variantType,
        card,
        count: 1,
      });
    }
  }

  return Array.from(cardMap.values());
};

export const countEachSuit = (cards: Card[]): Record<CardSuit, number> =>
  cards.reduce(
    (accCount, curr) => ({
      ...accCount,
      [curr.suit]: accCount[curr.suit] + 1,
    }),
    Object.fromEntries(
      Object.values(CardSuit).map((suit) => [suit, 0])
    ) as Record<CardSuit, number>
  );

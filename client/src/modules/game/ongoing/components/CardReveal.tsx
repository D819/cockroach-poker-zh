import { useEffect, useState } from "react";
import { config } from "react-spring";
import CardFlip from "../../../../lib/card-flip/CardFlip";
import {Card, CardSuit} from "../../../../types/game.types";

interface Props {
  className?: string;
  style?: React.CSSProperties;
  card: Card;
  onFlip?(): void;
}

function CardReveal({ className, style, card, onFlip }: Props): JSX.Element {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (!isFlipped) {
      setTimeout(() => {
        setIsFlipped(true);
      }, 500);
    }
  }, [isFlipped, setIsFlipped]);
  const suitName = card.suit.toLowerCase().replaceAll(" ", "-");
  let imageName = "";
  if (card.suit === CardSuit.JOKER) {
    imageName = "special-joker";
  } else if (card.suit === CardSuit.NOTHING) {
    imageName = "special-nothing";
  } else if (card.variant === "Royal") {
    imageName = `${suitName}-royal`;
  } else {
    imageName = `${suitName}-1`;
  }

  return (
    <CardFlip
      {...{ className, style }}
      styles={{
        cardFrame: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          maxHeight: "100%",
          minHeight: 0,
        },
      }}
      front={
        <img
          alt="card-front"
          src={`/assets/card-fronts/${imageName}.jpg`}
        />
      }
      back={<img alt="card-back" src="/assets/card-back.jpg" />}
      isFlippedUp={isFlipped}
      onFlip={onFlip}
      springConfig={{ ...config.molasses, clamp: true }}
    />
  );
}

export default CardReveal;

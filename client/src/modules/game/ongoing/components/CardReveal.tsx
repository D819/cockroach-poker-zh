import { useEffect, useState } from "react";
import { config } from "react-spring";
import CardFlip from "../../../../lib/card-flip/CardFlip";
import { Card } from "../../../../types/game.types";

interface Props {
  className?: string;
  style?: React.CSSProperties;
  card: Card;
}

function CardReveal({ className, style, card }: Props): JSX.Element {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (!isFlipped) {
      setTimeout(() => {
        setIsFlipped(true);
      }, 500);
    }
  }, [isFlipped, setIsFlipped])

  return (
    <CardFlip
      {...{ className, style }}
      styles={{ cardFrame: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: "center",
        maxHeight: '100%',
        minHeight: 0
        }}}
      front={<img alt='card-front' src={`/assets/card-fronts/${card.id.toLowerCase().replaceAll(' ', '-')}.jpg`}  />}
      back={<img alt='card-back' src="/assets/card-back.jpg"  />}
      isFlippedUp={isFlipped}
      springConfig={{ ...config.molasses, clamp: true }}
    />
  )
}

export default CardReveal;
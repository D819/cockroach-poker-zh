import { Image, ImageProps } from "@mantine/core";
import { CardSuit } from "../../../../types/game.types";
import { CSSProperties } from "react";

interface Props extends ImageProps {
  className?: string;
  style?: React.CSSProperties;
  suit: CardSuit;
  isRoyal?: boolean;
  selected?: boolean;
}

function SuitIcon({
  className,
  style,
  suit,
  isRoyal,
  selected,
  height = "25px",
  ...rest
}: Props): JSX.Element | null {
  if (!suit) return null;

  const suitName = suit.toLowerCase().replaceAll(" ", "-");
  const selectedStyles: CSSProperties = selected ? {
    boxSizing: 'border-box',
    border: "3px solid #FF69B4",
    borderRadius: '8px',
    transform: "scale(1.1)",
  } : {};

  let imageName = suitName;
  if (!isRoyal) {
    // Non-royal cards need a number, let's just pick one for display
    imageName = `${suitName}-1`
  }else{
    imageName = `${suitName}-royal`
  }

  return (
    <Image
      {...{ className, ...rest }}
      style={{
        ...style,
        ...selectedStyles,
        transition: "all 0.2s ease-in-out",
      }}
      height={height}
      src={`/assets/card-fronts/${imageName}.jpg`}
    />
  );
}

export default SuitIcon;

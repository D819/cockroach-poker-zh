import { Image, ImageProps } from "@mantine/core";
import { CardSuit } from "../../../../types/game.types";

interface Props extends ImageProps {
  className?: string;
  style?: React.CSSProperties;
  suit: CardSuit;
}

function SuitIcon({
  className,
  style,
  suit,
  height = "25px",
  ...rest
}: Props): JSX.Element {
  return (
    <Image
      {...{ className, style, height, ...rest }}
      src={`/assets/icons/${suit.toLowerCase().replaceAll(" ", "-")}.jpg`}
    />
  );
}

export default SuitIcon;

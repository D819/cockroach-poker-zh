import styled from "styled-components";
import { CardSuit } from "../../../../types/game.types";
import { Fragment } from "react";
import SuitIcon from "./SuitIcon";

interface Props {
  className?: string;
  style?: React.CSSProperties;
  filter?: (suit: CardSuit) => boolean;
  renderSuit?: (suit: CardSuit, icon: JSX.Element) => JSX.Element;
}

const Container = styled.div`
  display: flex;
`;

function SuitIcons({
  className,
  style,
  filter,
  renderSuit = defaultRenderSuit,
}: Props): JSX.Element {
  const suitsToShow = filter
    ? Object.values(CardSuit).filter(filter)
    : Object.values(CardSuit);

  return (
    <Container {...{ className, style }}>
      {suitsToShow.map((suit) => (
        <Fragment key={suit}>
          {renderSuit(suit, <SuitIcon suit={suit} />)}
        </Fragment>
      ))}
    </Container>
  );
}

const defaultRenderSuit = (suit: CardSuit, icon: JSX.Element): JSX.Element =>
  icon;

export default SuitIcons;

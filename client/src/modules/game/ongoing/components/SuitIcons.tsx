import styled from 'styled-components';
import { CardSuit } from "../../../../types/game.types";
import { Image } from '@mantine/core';
import { Fragment } from 'react';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  filter?: (suit: CardSuit) => boolean;
  renderSuit?: (suit: CardSuit, icon: JSX.Element) => JSX.Element;
}

const Container = styled.div`
  display: flex;
`

function SuitIcons({
  className,
  style, 
  filter,
  renderSuit = defaultRenderSuit
}: Props): JSX.Element {
  const suitsToShow = filter ? Object.values(CardSuit).filter(filter) : Object.values(CardSuit);


  return (
    <Container {...{ className, style }}>
      {suitsToShow.map((suit) => (
        <Fragment key={suit}>
          {renderSuit(
            suit,
            <Image
              src={`/assets/icons/${suit.toLowerCase().replaceAll(' ', '-')}.jpg`}
              height="25px"
            />
          )}
        </Fragment>
      ))}
    </Container>
  );
}

const defaultRenderSuit = (suit: CardSuit, icon: JSX.Element): JSX.Element => icon;

export default SuitIcons;
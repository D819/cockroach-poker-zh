import styled from 'styled-components';
import { Image } from '@mantine/core';
import { CardSuit } from "../../../../types/game.types";

interface Props {
  className?: string;
  style?: React.CSSProperties;
  count: Record<CardSuit, number>;
}

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  row-gap: 5px;
`

const SuitCount = styled.div`
  display: grid;
  grid-template-areas:
    "icon count";
  grid-column-gap: 5px;

  .icon {
    grid-area: icon;
    margin: auto;
  }

  .count {
    grid-area: count;
  }
`

function CollectedCards({  className, style, count}: Props): JSX.Element {
  return (
    <Container>
      {Object.entries(count).map(([suit, count], idx) => (
        <SuitCount
          key={suit}
          style={{
            gridRowStart: idx < 4 ? 1 : 2,
            gridColumnStart: (idx % 4) + 1
          }}
        >
          <Image
            className='icon'
            src={`/assets/icons/${suit.toLowerCase()}.jpg`}
            height='25px'
          />
          {/* <p className='icon'>{suit[0]}</p> */}
          <p className='count'>{count}</p>
        </SuitCount>
      ))}
    </Container>
  )
}

export default CollectedCards;
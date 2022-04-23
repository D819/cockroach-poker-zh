import styled from 'styled-components';
import { Image } from '@mantine/core';
import { CardSuit } from "../../../../types/game.types";

interface Props {
  className?: string;
  style?: React.CSSProperties;
  count: Record<CardSuit, number>;
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const SuitCount = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 2px;
  margin: 2px;
`

function CollectedCards({  className, style, count}: Props): JSX.Element {
  return (
    <Container {...{ className, style }}>
      {Object.entries(count).map(([suit, count], idx) => (
        <SuitCount
          key={suit}
          style={{
            gridRowStart: idx < 4 ? 1 : 2,
          }}
        >
          <Image
            src={`/assets/icons/${suit.toLowerCase()}.jpg`}
            height='25px'
          />
          {/* <p className='icon'>{suit[0]}</p> */}
          <p>{count}</p>
        </SuitCount>
      ))}
    </Container>
  )
}

export default CollectedCards;
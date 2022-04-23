import styled from 'styled-components';
import { CardSuit } from "../../../../types/game.types";
import { Image } from '@mantine/core';
import SuitIcons from './SuitIcons';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  count: Record<CardSuit, number>;
  filterEmpty?: boolean;
}

const Container = styled.div`
  display: flex;
`

const SuitCount = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2px;
`;

function CardCount({ className, style, count, filterEmpty }: Props): JSX.Element {
  const countToShow = filterEmpty
    ? Object.entries(count).filter(([_, n]) => n > 0)
    : Object.entries(count);


  return (
    <SuitIcons
      {...{ className, style }}
      filter={filterEmpty ? (suit) => count[suit] > 0 : undefined}
      renderSuit={(suit) => (
        <SuitCount>
          <Image
            className="icon"
            src={`/assets/icons/${suit.toLowerCase().replaceAll(' ', '-')}.jpg`}
            height="25px"
          />
          <p>{count[suit]}</p>
        </SuitCount>
      )}
    />
  );

  // return (
  //   <Container {...{ className, style }}>
  //     {countToShow.map(
  //       ([suit, count]) => (
          // <SuitCount key={suit}>
          //   <Image
          //     className="icon"
          //     src={`/assets/icons/${suit.toLowerCase()}.jpg`}
          //     height="25px"
          //   />
          //   <p>{count}</p>
          // </SuitCount>
  //       )
  //     )}
  //   </Container>
  // );
}

export default CardCount;
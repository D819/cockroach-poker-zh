import styled from 'styled-components';
import { CardSuit } from "../../../../types/game.types";
import { Image } from '@mantine/core';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  count: Record<CardSuit, number>;
}

const Container = styled.div`
  display: flex;
`

function HandDetails({ className, style, count }: Props): JSX.Element {
  return (
    <Container {...{ className, style }}>
      {Object.entries(count).map(
        ([suit, count]) => (
          <div key={suit}>
            <Image
              className="icon"
              src={`/assets/icons/${suit.toLowerCase()}.jpg`}
              height="25px"
            />
            <p>{count}</p>
          </div>
        )
      )}
    </Container>
  );
}

export default HandDetails;
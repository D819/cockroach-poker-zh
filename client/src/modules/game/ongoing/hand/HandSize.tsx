import styled from 'styled-components';
import { Image } from '@mantine/core';

const HandSizeContainer = styled.div`
  display: grid;
  grid-template-areas: "hand-size";

  p {
    font-size: 20px;
    grid-area: hand-size;
    color: white;
    z-index: 1;
    margin: auto;
  }
`;

export default function HandSize({ handSize }: { handSize: number }): JSX.Element {
  return (
    <HandSizeContainer>
      <Image
        src="/assets/card-back.jpg"
        height="50px"
        style={{ gridArea: "hand-size" }}
      />
      <p>{handSize}</p>
    </HandSizeContainer>
  );
}

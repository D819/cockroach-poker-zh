import styled from 'styled-components';
import { Image } from '@mantine/core';

interface Props {
  className?: string;
  handSize: number;
  style?: React.CSSProperties;
}

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

export default function HandSize({ className, handSize, style }: Props): JSX.Element {
  return (
    <HandSizeContainer {...{ className, style }}>
      <Image
        src="/assets/card-back.jpg"
        height="50px"
        width="auto"
        style={{ gridArea: "hand-size" }}
      />
      <p>{handSize}</p>
    </HandSizeContainer>
  );
}

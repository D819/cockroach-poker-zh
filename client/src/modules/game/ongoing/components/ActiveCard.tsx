import styled from "styled-components";
import { Image } from "@mantine/core";
import { Card } from "../../../../types/game.types";

interface Props {
  className?: string;
  style?: React.CSSProperties;
  card: Card;
  isFaceUp?: boolean;
}

const Container = styled.div`
  display: grid;
  grid-template-areas: "card";

  .card {
    grid-area: card;
    color: white;
    margin: auto;
  }

  p {
    z-index: 1;
    font-size: 2rem;
  }
`;

function ActiveCard({ className, style, card, isFaceUp }: Props): JSX.Element {
  return (
    <Container {...{ className, style }}>
      <Image
        className="card"
        src={`/assets/card-back.jpg`}
        height="50px"
        width="auto"
      />
      <p className="card">?</p>
    </Container>
  );
}

export default ActiveCard;

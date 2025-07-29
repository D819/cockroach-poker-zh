import styled from "styled-components";
import {Group, Image, Text} from "@mantine/core";
import {Card, Claim, Game} from "../../../../types/game.types";
import {FaArrowRight} from "react-icons/fa";
import {selectCurrentPassRecord} from "../../../../selectors/game-selectors";
import {useTranslation} from "react-i18next";

interface Props {
  className?: string;
  style?: React.CSSProperties;
  card: Card;
  isFaceUp?: boolean;
  game?: Game;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  .card-container {
    position: relative;
    display: grid;
    grid-template-areas: "card";
  }

  .card {
    grid-area: card;
    color: white;
    margin: auto;
  }

  p {
    z-index: 1;
    font-size: 2rem;
  }
  
  .arrow {
    color: #FF69B4;
    animation: pulse 1.5s infinite;
  }
  
  .claim-text {
    font-weight: bold;
    color: #FF69B4;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
`;

function getSuitImagePath(suit: Claim): string {
  const suitName = suit.toLowerCase().replace(/\s+/g, '-');
  return `/assets/icons/${suitName}.jpg`;
}

function ActiveCard({ className, style, card, isFaceUp, game }: Props): JSX.Element {
  const { t } = useTranslation();
  // 获取当前宣称的类型
  let claimedSuit: Claim = card.suit; // 默认与实际相同

  if (game) {
    const currentPass = selectCurrentPassRecord(game);
    if (currentPass) {
      claimedSuit = currentPass.claim;
    }
  }

  return (
    <Container {...{ className, style }}>
      <div className="card-container">
        <Image
          className="card"
          src={`/assets/card-back.jpg`}
          height="50px"
          width="auto"
          radius="sm"
        />
        <p className="card">?</p>
      </div>

      <FaArrowRight className="arrow" size={20} />

      <Group spacing="xs">
        <Text size="sm" className="claim-text">{t(`suits.${claimedSuit}`, claimedSuit)}</Text>
        <Image
          src={getSuitImagePath(claimedSuit)}
          height="40px"
          width="auto"
          radius="sm"
        />
      </Group>
    </Container>
  );
}

export default ActiveCard;

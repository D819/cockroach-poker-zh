import { ActionIcon, Alert, Popover, keyframes } from "@mantine/core";
import { useState, useEffect } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import { Game, Player } from "../../../../types/game.types";
import { countEachSuit } from "../../../../utils/hand-utils";
import CardCount from "./CardCount";
import {
  getGameHeadlineMarkdown,
  getGameInfoMarkdown,
} from "../../../../utils/game-utils";
import { useTranslation } from "react-i18next";

interface KeyInfoProps {
  className?: string;
  style?: React.CSSProperties;
  game: Game;
  player: Player;
}

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
  }
  
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(0, 123, 255, 0);
  }
  
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PlayerHand = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 5px;
  animation: ${fadeIn} 0.5s ease-in-out;

  .hand {
    font-weight: bold;
  }
`;

const AnimatedAlert = styled(Alert)`
  transition: all 0.3s ease;
  
  &.highlight {
    animation: ${pulse} 1.5s ease-in-out;
  }
  
  .headline {
    transition: all 0.3s ease;
  }
`;

function KeyInfo({
  className,
  style,
  game,
  player,
}: KeyInfoProps): JSX.Element {
  const { t } = useTranslation();
  const [highlight, setHighlight] = useState(false);
  const [prevGamePhase, setPrevGamePhase] = useState(game.active.phase);

  // 当游戏阶段变化时触发动画
  useEffect(() => {
    if (prevGamePhase !== game.active.phase) {
      setHighlight(true);
      const timer = setTimeout(() => setHighlight(false), 1500);
      setPrevGamePhase(game.active.phase);
      return () => clearTimeout(timer);
    }
  }, [game.active.phase, prevGamePhase]);

  return (
      <AnimatedAlert
        className={highlight ? "highlight" : ""}
        icon={<GameInfoPopover {...{ game, player }} />}
        styles={{
          root: {
            padding: "10px 5px",
            overflowX: "scroll",
            transition: "background-color 0.3s ease",
          },
          message: {
            marginRight: "5px",
            display: "inline-block",
            transition: "transform 0.3s ease",
          },
        }}
      >
        <ReactMarkdown className="headline">
          {getGameHeadlineMarkdown(game, player)}
        </ReactMarkdown>
      </AnimatedAlert>
  );
}

interface GameInfoPopoverProps {
  game: Game;
  player: Player;
}

function GameInfoPopover({ game, player }: GameInfoPopoverProps) {
  const [opened, setOpened] = useState(false);

  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      position="bottom"
      // placement="center"
      // withArrow
      // transition="pop-top-left"
      target={
        <ActionIcon
          onClick={() => {
            setOpened((prev) => !prev);
          }}
          variant="transparent"
          sx={{
            transition: "transform 0.2s ease",
            '&:hover': {
              transform: 'scale(1.2)',
            }
          }}
        >
          <AiOutlineInfoCircle size={16} />
        </ActionIcon>
      }
    >
      <ReactMarkdown>{getGameInfoMarkdown(game, player)}</ReactMarkdown>
    </Popover>
  );
}

export default KeyInfo;

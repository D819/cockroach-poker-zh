import { ActionIcon, Alert, Popover } from '@mantine/core';
import { useState } from 'react';
import { AiOutlineInfoCircle } from "react-icons/ai";
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { Game, Player } from '../../../../types/game.types';
import { countEachSuit } from '../../../../utils/hand-utils';
import CardCount from './CardCount';
import { getGameHeadlineMarkdown, getGameInfoMarkdown } from '../../../../utils/game-utils';

interface KeyInfoProps {
  className?: string;
  style?: React.CSSProperties;
  game: Game;
  player: Player;
}

const PlayerHand = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 5px;

  .hand {
    font-weight: bold;
  }
`;

function KeyInfo({ className, style, game, player }: KeyInfoProps): JSX.Element {
  return (
    <>
      <PlayerHand>
        <p className="hand">Your hand:</p>
        <CardCount count={countEachSuit(player.cards.hand)} />
      </PlayerHand>
      <Alert icon={<GameInfoPopover {...{ game, player }} />}>
        <ReactMarkdown className="headline">
          {getGameHeadlineMarkdown(game, player)}
        </ReactMarkdown>
      </Alert>
    </>
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
          variant='transparent'
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
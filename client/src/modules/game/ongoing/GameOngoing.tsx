import styled from "styled-components";
import { Image } from '@mantine/core';
import PlayerList from "../../../lib/atoms/PlayerList";
import {
  Game,
  Player,
} from "../../../types/game.types";
import HandSize from "./hand/HandSize";

interface Props {
  game: Game;
  player: Player;
  players: Player[];
}

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

const StyledPlayerList = styled(PlayerList)`
  overflow-y: scroll;
  padding-inline-start: 20px;
`;

const PlayerListItemContents = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  font-size: 1.2rem;
  justify-content: space-between;
  padding-bottom: 10px;

  .player-name {
    margin: 0;
    margin-left: 10px;
  }
`;

function GameOngoing({
  game,
  player,
  players
}: Props): JSX.Element {

  return (
    <Container className="active-contents">
      <StyledPlayerList
        players={players}
        ownPlayerId={player.socketId}
        renderPlayer={(playerToRender, idx, ownPlayerId) => {
          return (
            <PlayerListItemContents>
              <p className='player-name'>
                {playerToRender.name}
              </p>
              <HandSize handSize={playerToRender.cards.hand.length} />
            </PlayerListItemContents>
          );
        }}
      />
    </Container>
  );
}

export default GameOngoing;

import styled from "styled-components";
import { Fragment } from 'react';
import {
  CardSuit,
  Game,
  Player,
} from "../../../types/game.types";
import HandSize from "./components/HandSize";
import CollectedCards from "./components/CollectedCards";
import ActiveCard from "./components/ActiveCard";
import { countEachSuit } from '../../../utils/hand-utils';
import { Image } from '@mantine/core';
import HandDetails from "./components/HandDetails";

interface Props {
  game: Game;
  player: Player;
  players: Player[];
}

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

const PlayerGrid = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: min-content 1fr;
  grid-row-gap: 10px;
  grid-column-gap: 10px;
`;

const PlayerArea = styled.div`
  display: grid;
  align-items: center;
  grid-template-areas:
    "hand-count collected pass"
    "hand-details hand-details hand-details";
  grid-template-columns: min-content auto 50px;
  grid-template-rows: auto min-content;
  grid-row-gap: 10px;
  grid-column-gap: 10px;

  .hand-count {
    grid-area: hand-count;
  }

  .collected-cards {
    grid-area: collected;
  }

  .passed-card {
    grid-area: pass;
  }

  .hand-details {
    grid-area: hand-details;
  }
`

function GameOngoing({
  game,
  player,
  players
}: Props): JSX.Element {

  return (
    <Container className="active-contents">
      <PlayerGrid>
        {players.map((listPlayer, idx) => (
          <Fragment key={listPlayer.socketId}>
            <p
              style={{
                gridColumnStart: 1,
                gridRowStart: idx + 1,
              }}
            >
              {listPlayer.name}
            </p>
            <PlayerArea
              style={{
                gridColumnStart: 2,
                gridRowStart: idx + 1,
              }}
            >
              <HandSize
                className="hand-count"
                handSize={listPlayer.cards.hand.length}
              />
              <div className="collected-cards">
                <CollectedCards count={countEachSuit(listPlayer.cards.area)} />
              </div>
              {game.active.card &&
                game.active.playerId === listPlayer.socketId && (
                  <ActiveCard className="passed-card" card={game.active.card} />
                )}
              {player.socketId === listPlayer.socketId && (
                <HandDetails className='hand-details' count={countEachSuit(listPlayer.cards.hand)} />
              )}
            </PlayerArea>
          </Fragment>
        ))}
      </PlayerGrid>
    </Container>
  );
}

export default GameOngoing;

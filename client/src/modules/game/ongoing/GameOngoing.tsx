import styled from "styled-components";
import { Fragment } from 'react';
import {
  Game,
  Player,
} from "../../../types/game.types";
import HandSize from "./components/HandSize";
import CollectedCards from "./components/CollectedCards";
import ActiveCard from "./components/ActiveCard";
import { countEachSuit } from '../../../utils/hand-utils';
import CardCount from "./components/CardCount";

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
    "hand-count collected pass";
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
`

const PlayerHand = styled.div`
  display: flex;
  align-items: center;
  column-gap: 5px;

  .hand {
    font-weight: bold;
  }
`

function GameOngoing({
  game,
  player,
  players
}: Props): JSX.Element {

  return (
    <Container className="active-contents">
      <PlayerHand>
        <p className='hand'>Your hand:</p>
        <CardCount count={countEachSuit(player.cards.hand)}/>
      </PlayerHand>
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
              <CollectedCards
                className="collected-cards"
                count={countEachSuit(listPlayer.cards.area)}
              />
              {game.active.card &&
                game.active.playerId === listPlayer.socketId && (
                  <ActiveCard className="passed-card" card={game.active.card} />
                )}
            </PlayerArea>
          </Fragment>
        ))}
      </PlayerGrid>
    </Container>
  );
}

export default GameOngoing;

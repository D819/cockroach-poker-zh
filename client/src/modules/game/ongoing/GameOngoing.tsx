import styled from "styled-components";
import { Fragment } from 'react';
import { Alert, Divider, Paper, Text } from '@mantine/core';
import {
  Game,
  Player,
} from "../../../types/game.types";
import HandSize from "./components/HandSize";
import ActiveCard from "./components/ActiveCard";
import { countEachSuit } from '../../../utils/hand-utils';
import CardCount from "./components/CardCount";
import { selectActivePlayer } from '../../../selectors/game-selectors';

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
  justify-content: space-around;

  .hand {
    font-weight: bold;
  }
`

function GameOngoing({
  game,
  player,
  players
}: Props): JSX.Element {

  const activePlayer = selectActivePlayer(game)

  return (
    <Container className="active-contents">
      <Paper shadow="sm" withBorder p={2}>
        <PlayerHand>
          <p className="hand">Your hand:</p>
          <CardCount count={countEachSuit(player.cards.hand)} />
        </PlayerHand>
      </Paper>
      <Divider m="md" />
      <Alert title="hi" m="sm">
        <Text>{activePlayer.socketId === player.socketId ? "You are" : `${activePlayer.name} is`} active player</Text>
      </Alert>
      <PlayerGrid>
        {players.map((listPlayer, idx) => (
          <Fragment key={listPlayer.socketId}>
            <p
              style={{
                gridColumnStart: 1,
                gridRowStart: idx + 1,
                textAlign: 'right'
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
              <CardCount
                count={countEachSuit(listPlayer.cards.area)}
                filterEmpty
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

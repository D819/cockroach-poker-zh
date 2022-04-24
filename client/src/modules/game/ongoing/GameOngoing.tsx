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
import { GameHandlers } from "../GamePage";
import ActiveDecision from "./components/ActiveDecision";
import GameInfo from "./components/GameInfo";
import { getGameHeadline } from "../../../utils/game-utils";

interface Props extends Pick<GameHandlers, 'onCardPass' | 'onCardPeek' | 'onCardPredict'> {
  game: Game;
  player: Player;
  players: Player[];
}

const Container = styled.div`
  height: 100%;
  width: 100%;

  display: grid;
  grid-template-areas:
    "data"
    "actions";
  grid-template-rows: auto 1fr;

  .data {
    grid-area: data;
  }

  .actions {
    grid-area: actions;
    align-self: end;
  }
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
  justify-content: center;
  column-gap: 5px;

  .hand {
    font-weight: bold;
  }
`

function GameOngoing({
  game,
  player,
  players,
  onCardPass,
  onCardPeek,
  onCardPredict
}: Props): JSX.Element {

  const activePlayer = selectActivePlayer(game);
  const isActivePlayer = activePlayer.socketId === player.socketId;

  return (
    <Container className="active-contents">
      <div className="data">
        <Paper shadow="sm" withBorder>
          <PlayerHand>
            <p className="hand">Your hand:</p>
            <CardCount count={countEachSuit(player.cards.hand)} />
          </PlayerHand>
          <Alert>
            <Text>{getGameHeadline(game, player)}</Text>
          </Alert>
        </Paper>
        <Divider m="md" />
        <PlayerGrid className="player-areas">
          {players.map((listPlayer, idx) => (
            <Fragment key={listPlayer.socketId}>
              <p
                style={{
                  gridColumnStart: 1,
                  gridRowStart: idx + 1,
                  textAlign: "right",
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
                  listPlayer.socketId === game.active.playerId && (
                    <ActiveCard
                      className="passed-card"
                      card={game.active.card}
                    />
                  )}
              </PlayerArea>
            </Fragment>
          ))}
        </PlayerGrid>
      </div>
      {isActivePlayer && (
        <ActiveDecision
          className="actions"
          {...{ game, player, players, onCardPass, onCardPeek, onCardPredict }}
        />
      )}
    </Container>
  );
}

export default GameOngoing;

import styled from "styled-components";
import { Fragment } from 'react';
import { Box, Divider, Image, Overlay, Paper, Stack } from '@mantine/core';
import {
  Game,
  GamePhase,
  Player,
} from "../../../types/game.types";
import HandSize from "./components/HandSize";
import ActiveCard from "./components/ActiveCard";
import { countEachSuit } from '../../../utils/hand-utils';
import CardCount from "./components/CardCount";
import { selectActivePlayer } from '../../../selectors/game-selectors';
import { GameHandlers } from "../GamePage";
import ActiveDecision from "./components/ActiveDecision";
import KeyInfo from "./components/KeyInfo";

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
    "play-area"
    "actions";
  grid-template-rows: auto 1fr auto;

  .data {
    grid-area: data;
  }

  .play-area {
    grid-area: play-area;
    position: relative;
  }

  .card-flip {
    z-index: 201;
    opacity: 1;
  }

  .actions {
    grid-area: actions;
    align-self: end;
  }

  .headline {
    max-width: 100%;
    overflow-x: auto;
    white-space: nowrap;
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
          <KeyInfo {...{ game, player }} />
        </Paper>
        <Divider m="md" />
      </div>
      <Box className="play-area">
        {game.active.phase === GamePhase.CARD_REVEAL && (
          <Overlay opacity={0.9} color="gray" blur={2} />
        )}
        <PlayerGrid>
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
      </Box>
      {game.active.phase === GamePhase.CARD_REVEAL && (
        <Stack className="play-area card-flip">
          <Image src="/assets/card-back.jpg" />
        </Stack>
      )}
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

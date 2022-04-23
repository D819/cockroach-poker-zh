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
        {players.map((player, idx) => (
          <Fragment key={player.socketId}>
            <p
              style={{
                gridColumnStart: 1,
                gridRowStart: idx + 1,
              }}
            >
              {player.name}
            </p>
            <PlayerArea
              style={{
                gridColumnStart: 2,
                gridRowStart: idx + 1
              }}
            >
              <HandSize
                className='hand-count'
                handSize={player.cards.hand.length}
              />
              <div className='collected-cards'>
                <CollectedCards
                  count={player.cards.area.reduce(
                    (accCount, curr) => ({
                      ...accCount,
                      [curr.suit]: accCount[curr.suit] + 1,
                    }),
                    Object.fromEntries(
                      Object.keys(CardSuit).map((suit) => [suit, 0])
                    ) as Record<CardSuit, number>
                  )}
                />
              </div>
              {game.active.card && game.active.playerId === player.socketId && (
                <ActiveCard
                  className='passed-card'
                  card={game.active.card}
                />
              )}
            </PlayerArea>
          </Fragment>
        ))}
      </PlayerGrid>
    </Container>
  );
}

export default GameOngoing;

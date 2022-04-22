import styled from "styled-components";
import { Image } from '@mantine/core';
import PlayerList from "../../../lib/atoms/PlayerList";
import {
  CardSuit,
  Game,
  Player,
} from "../../../types/game.types";
import HandSize from "./components/HandSize";
import CollectedCards from "./components/CollectedCards";

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
  grid-template-columns: min-content min-content auto auto;
  grid-row-gap: 10px;
  grid-column-gap: 10px;
`;

function GameOngoing({
  game,
  player,
  players
}: Props): JSX.Element {

  return (
    <Container className="active-contents">
      <PlayerGrid>
        {players.map((player, idx) => (
          <>
            <p style={{
              gridColumnStart: 1,
              gridRowStart: idx + 1
            }}>{player.name}</p>
            <HandSize
              style={{
                gridColumnStart: 2,
                gridRowStart: idx + 1
              }}
              handSize={player.cards.hand.length}
            />
            <div
              style={{
                gridColumnStart: 3,
                gridRowStart: idx + 1
              }}
            >
              <CollectedCards
                count={player.cards.area.reduce(
                  (accCount, curr) => ({
                    ...accCount,
                    [curr.suit]: accCount[curr.suit] + 1
                  }),
                  Object.fromEntries(Object.keys(CardSuit).map(suit => [suit, 0])) as Record<CardSuit, number>
                )}
              />
            </div>
          </>
        ))}
      </PlayerGrid>
    </Container>
  );
}

export default GameOngoing;

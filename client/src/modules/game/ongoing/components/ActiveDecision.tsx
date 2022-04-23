import { Button, Divider } from '@mantine/core';
import styled from 'styled-components';
import { Game, GamePhase, Player } from "../../../../types/game.types";
import CardPassPicker from "./CardPassPicker";
import { GameHandlers } from "../../GamePage";

interface Props extends Pick<GameHandlers, 'onCardPass'> {
  className?: string;
  style?: React.CSSProperties;
  game: Game;
  player: Player;
  players: Player[];
}

const Container = styled.div``

const PredictOrPass = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: min-content min-content;
  grid-gap: 5px;
`

function ActiveDecision({ className, style, game, player, players, onCardPass }: Props): JSX.Element {
  const { active: { card, phase, passHistory } } = game

  switch (phase) {
    case GamePhase.CARD_BEING_PICKED:
      return (
        <Container {...{ className, style }}>
          <Divider label="Your turn to pass" p="sm" />
          <CardPassPicker
            pickCard={!card}
            players={players.filter((p) => p.socketId !== player.socketId)}
            isPlayerDisabled={(p) =>
              !!passHistory.find((pass) =>
                [pass.from, pass.to].includes(p.socketId)
              )
            }
            onSubmit={onCardPass}
          />
        </Container>
      );
    
    case GamePhase.PREDICT_OR_PASS:
      return (
        <Container {...{ className, style }}>
          <Divider label="Your turn to predict or pass" p="sm" />
          <PredictOrPass>
            <Button color='green' fullWidth>Truth</Button>
            <Button color='red' fullWidth>Lie</Button>
            <Button style={{ gridColumnEnd: 'span 2' }} fullWidth>Peek and pass</Button>
          </PredictOrPass>
        </Container>
      );
  }
}

export default ActiveDecision;
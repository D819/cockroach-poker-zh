import { Button, Divider, Text } from "@mantine/core";
import styled from "styled-components";
import { Game, GamePhase, Player } from "../../../../types/game.types";
import CardPassPicker from "./CardPassPicker";
import { GameHandlers } from "../../GamePage";
import {
  selectIsFurtherPassPossible,
  selectPlayersAlreadyInvolvedInPass,
} from "../../../../selectors/game-selectors";

interface Props
  extends Pick<GameHandlers, "onCardPass" | "onCardPeek" | "onCardPredict"> {
  className?: string;
  style?: React.CSSProperties;
  game: Game;
  player: Player;
  players: Player[];
}

const Container = styled.div``;

const PredictOrPass = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: min-content min-content;
  grid-gap: 5px;

  .full-button {
    grid-column-end: span 2;
  }
`;

function ActiveDecision({
  className,
  style,
  game,
  player,
  players,
  onCardPass,
  onCardPeek,
  onCardPredict,
}: Props): JSX.Element {
  const {
    active: { phase },
  } = game;

  const playersInvolved = selectPlayersAlreadyInvolvedInPass(game);
  const isFurtherPassPossible = selectIsFurtherPassPossible(game);

  switch (phase) {
    case GamePhase.CARD_REVEAL:
      return <></>;

    case GamePhase.PASS_SELECTION:
      return (
        <Container {...{ className, style }}>
          <Divider label="Pass selection" p="sm" />
          <CardPassPicker
            game={game}
            player={player}
            players={players.filter((p) => p.socketId !== player.socketId)}
            isPlayerDisabled={(p) => playersInvolved.includes(p.socketId)}
            onSubmit={onCardPass}
          />
        </Container>
      );

    case GamePhase.PREDICT_OR_PASS: {
      const makePredictionHandler = (truth: boolean) => () => {
        onCardPredict && onCardPredict(truth);
      };

      return (
        <Container {...{ className, style }}>
          <Divider label="Predict / Pass" p="sm" />
          {!isFurtherPassPossible && (
            <Text mb="md">
              There are no players left to pass to, so you must make a
              prediction.
            </Text>
          )}
          <PredictOrPass>
            <Button
              color="green"
              fullWidth
              onClick={makePredictionHandler(true)}
            >
              Truth
            </Button>
            <Button
              color="red"
              fullWidth
              onClick={makePredictionHandler(false)}
            >
              Lie
            </Button>
            <Button
              className="full-button"
              fullWidth
              onClick={onCardPeek}
              disabled={!isFurtherPassPossible}
            >
              Peek and pass
            </Button>
          </PredictOrPass>
        </Container>
      );
    }
  }
}

export default ActiveDecision;

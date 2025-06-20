import { Button, Divider, Text, Stack, Grid } from "@mantine/core";
import { Game, GamePhase, Player } from "../../../../types/game.types";
import CardPassPicker from "./CardPassPicker";
import { GameHandlers } from "../../GamePage";
import {
  selectIsFurtherPassPossible,
  selectPlayersAlreadyInvolvedInPass,
} from "../../../../selectors/game-selectors";
import { useTranslation } from "react-i18next";

interface Props
  extends Pick<
    GameHandlers,
    "onCardPass" | "onCardPeek" | "onCardPredict" | "onGameReset"
  > {
  game: Game;
  player: Player;
  players: Player[];
}

function ActiveDecision({
  game,
  player,
  players,
  onCardPass,
  onCardPeek,
  onCardPredict,
  onGameReset,
}: Props): JSX.Element {
  const { t } = useTranslation();
  const {
    active: { phase },
  } = game;

  const playersInvolved = selectPlayersAlreadyInvolvedInPass(game);
  const isFurtherPassPossible = selectIsFurtherPassPossible(game);

  switch (phase) {
    case GamePhase.DECLARE_LOSER:
      return (
        <Stack align="center">
          <Divider
            labelPosition="center"
            label={String(t("game.declare_loser_phase"))}
            my="md"
          />
          {player.isHost ? (
            <Button fullWidth onClick={onGameReset}>
              {String(t("game.restart_game"))}
            </Button>
          ) : (
            <Text>{String(t("game.host_can_restart"))}</Text>
          )}
        </Stack>
      );

    case GamePhase.CARD_REVEAL:
      return <></>;

    case GamePhase.PASS_SELECTION:
      return (
        <Stack>
          <Divider
            labelPosition="center"
            label={String(t("game.pass_selection_phase"))}
            my="md"
          />
          <CardPassPicker
            game={game}
            player={player}
            players={players.filter((p) => p.socketId !== player.socketId)}
            isPlayerDisabled={(p) => playersInvolved.includes(p.socketId)}
            onSubmit={onCardPass}
          />
        </Stack>
      );

    case GamePhase.PREDICT_OR_PASS: {
      const makePredictionHandler = (truth: boolean) => () => {
        onCardPredict?.(truth);
      };

      return (
        <Stack>
          <Divider
            labelPosition="center"
            label={String(t("game.predict_or_pass_phase"))}
            my="md"
          />
          {!isFurtherPassPossible && (
            <Text mb="md" align="center" color="dimmed" size="sm">
              {String(t("game.no_one_to_pass_to"))}
            </Text>
          )}
          <Grid>
            <Grid.Col span={6}>
              <Button
                color="green"
                fullWidth
                onClick={makePredictionHandler(true)}
              >
                {String(t("game.truth"))}
              </Button>
            </Grid.Col>
            <Grid.Col span={6}>
              <Button
                color="red"
                fullWidth
                onClick={makePredictionHandler(false)}
              >
                {String(t("game.lie"))}
              </Button>
            </Grid.Col>
            <Grid.Col span={12}>
              <Button
                fullWidth
                onClick={onCardPeek}
                disabled={!isFurtherPassPossible}
                variant="outline"
              >
                {String(t("game.peek_and_pass"))}
              </Button>
            </Grid.Col>
          </Grid>
        </Stack>
      );
    }
    default:
      return <></>;
  }
}

export default ActiveDecision;

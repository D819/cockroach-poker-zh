import { selectActiveGamePhase, selectActivePlayer, selectCurrentPassRecord, selectPassingPlayer } from "../selectors/game-selectors";
import { Game, GamePhase, Player } from "../types/game.types";

export const getGameHeadline = (game: Game, player: Player): string => {
  const phase = selectActiveGamePhase(game);
  const pass = selectCurrentPassRecord(game);
  const passer = selectPassingPlayer(game);
  const activePlayer = selectActivePlayer(game);
  const isActivePlayer = activePlayer.socketId === player.socketId;

  switch (phase) {
    case GamePhase.PREDICT_OR_PASS:
      return `${passer?.name} passes a "${pass?.claim}" to ${activePlayer.name}`;

    case GamePhase.PASS_SELECTION:
      return pass
        ? `${activePlayer.name} is peeking at ${passer?.name}'s "${pass?.claim}"`
        : `${
            isActivePlayer ? "You are" : `${activePlayer.name} is`
          } starting a new pass`;
  }
}
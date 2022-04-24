import { selectActiveGamePhase, selectActivePlayer, selectCurrentPassRecord, selectPassingPlayer } from "../selectors/game-selectors";
import { Game, GamePhase, Player } from "../types/game.types";

export const getGameHeadlineMarkdown = (game: Game, player: Player): string => {
  const phase = selectActiveGamePhase(game);
  const pass = selectCurrentPassRecord(game);
  const passer = selectPassingPlayer(game);
  const activePlayer = selectActivePlayer(game);
  const isActivePlayer = activePlayer.socketId === player.socketId;
  const isPasser = passer?.socketId === player.socketId;
  const passerName = isPasser ? "you" : passer?.name

  switch (phase) {
    case GamePhase.PREDICT_OR_PASS:
      return `**${isPasser ? "*You*" : passer?.name}** pass${isPasser ? "" : "es"} a **"${pass?.claim}"** to **${isActivePlayer ? "*you*" : activePlayer.name}**`;

    case GamePhase.PASS_SELECTION:
      return pass
        ? `${isActivePlayer ? "***You*** are" : `**${activePlayer.name}** is`} peeking at ${isPasser ? "your" : `${passerName}'s`} **"${pass?.claim}"**`
        : `${
            isActivePlayer ? "***You*** are" : `**${activePlayer.name}** is`
          } starting a new pass`;
  }
}
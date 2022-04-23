import { createSelector } from "reselect";
import { Game, Player } from "../types/game.types";

const selectActiveGameInfo = (game: Game): Game['active'] => game.active;
const selectGamePlayers = (game: Game): Game['players'] => game.players;

export const selectActivePlayer = createSelector(
  selectActiveGameInfo,
  selectGamePlayers,
  (active, players): Player => players[active.playerId]
)
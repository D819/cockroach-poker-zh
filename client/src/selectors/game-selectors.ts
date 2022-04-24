import { createSelector } from "reselect";
import { Game, Player } from "../types/game.types";
import { last } from 'lodash';

const selectActiveGameInfo = (game: Game): Game['active'] => game.active;
const selectGamePlayers = (game: Game): Game['players'] => game.players;

export const selectActivePlayer = createSelector(
  selectActiveGameInfo,
  selectGamePlayers,
  (active, players): Player => players[active.playerId]
)

export const selectActiveGamePhase = createSelector(
  selectActiveGameInfo,
  (active) => active.phase
)

const selectCurrentPassHistory = createSelector(
  selectActiveGameInfo,
  (active) => active.passHistory
)

export const selectIsFirstPass = createSelector(
  selectCurrentPassHistory,
  (passHistory) => passHistory.length === 1
)

export const selectCurrentPassRecord = createSelector(
  selectCurrentPassHistory,
  (passHistory) => last(passHistory)
)

export const selectPassingPlayer = createSelector(
  selectCurrentPassRecord,
  selectGamePlayers,
  (pass, players) => pass ? players[pass.from] : undefined
)

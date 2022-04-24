import { createSelector } from "reselect";
import { Game, Player } from "../types/game.types";
import { last } from "lodash";

const selectActiveGameInfo = (game: Game): Game["active"] => game.active;
const selectGamePlayers = (game: Game): Game["players"] => game.players;

export const selectActivePlayer = createSelector(
  selectActiveGameInfo,
  selectGamePlayers,
  (active, players): Player => players[active.playerId]
);

export const selectActiveGamePhase = createSelector(
  selectActiveGameInfo,
  (active) => active.phase
);

const selectCurrentPassHistory = createSelector(
  selectActiveGameInfo,
  (active) => active.passHistory
);

const selectPlayerDictionaryOfPassActivity = createSelector(
  selectCurrentPassHistory,
  (passHistory): Record<string, boolean> =>
    passHistory.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.from]: true,
        [curr.to]: true,
      }),
      {}
    )
);

export const selectPlayersAlreadyInvolvedInPass = createSelector(
  selectPlayerDictionaryOfPassActivity,
  (dict) => Object.keys(dict)
);

export const selectIsFurtherPassPossible = createSelector(
  selectPlayersAlreadyInvolvedInPass,
  selectGamePlayers,
  (playerIds, players) => playerIds.length < Object.keys(players).length
);

export const selectIsFirstPass = createSelector(
  selectCurrentPassHistory,
  (passHistory) => passHistory.length === 1
);

export const selectCurrentPassRecord = createSelector(
  selectCurrentPassHistory,
  (passHistory) => last(passHistory)
);

export const selectPassingPlayer = createSelector(
  selectCurrentPassRecord,
  selectGamePlayers,
  (pass, players) => (pass ? players[pass.from] : undefined)
);

export const selectCardPrediction = createSelector(
  selectActiveGameInfo,
  (active) => active.prediction
);

export const selectActiveCard = createSelector(
  selectActiveGameInfo,
  (active) => active.card
);

export const selectIsFlipShow = createSelector(
  selectActiveGameInfo,
  (active) => active.showFlip
);

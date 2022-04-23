import {
  ClientEvent,
  ClientEventListeners,
  ServerEvent,
} from "../../../client/src/types/event.types";
import {
  GamePhase,
  GameStatus,
} from "../../../client/src/types/game.types";
import { GameManager } from "./manager";

export const kickPlayer: ClientEventListeners[ClientEvent.KICK_PLAYER] = (
  gameId,
  playerIdToKick
) => {
  const gameManager = GameManager.for(gameId);
  gameManager.io.emit(ServerEvent.PLAYER_KICKED, gameId, playerIdToKick);
  gameManager.update((game) => {
    delete game.players[playerIdToKick];
  });
};

export const passCard: ClientEventListeners[ClientEvent.PASS_CARD] = (
  gameId,
  { from, to, claim, card }
) => {
  const gameManager = GameManager.for(gameId);

  gameManager.update(game => {
    game.active.playerId = to;
    game.active.passHistory.push({ from, to, claim });
    if (card) {
      game.active.card = card;
    }
    game.active.phase = GamePhase.PREDICT_OR_PASS
  })
}

export const peekAtCard: ClientEventListeners[ClientEvent.PEEK_AT_CARD] = (
  gameId
) => {
  GameManager.for(gameId).update(game => {
    game.active.phase = GamePhase.PASS_SELECTION
  })
}

export const predictCard: ClientEventListeners[ClientEvent.PREDICT_CARD] = (
  gameId, prediction
) => {
  GameManager.for(gameId).resolveCardPrediction(prediction);
}

export const resetGame: ClientEventListeners[ClientEvent.RESET_GAME] = (
  gameId
) => {
  const gameManager = GameManager.for(gameId);
  gameManager.resetGame();
};

export const startGame: ClientEventListeners[ClientEvent.START_GAME] = (
  gameId: string
): void => {
  const gameManager = GameManager.for(gameId);
  gameManager.dealInitialHands();
  gameManager.update((game) => {
    game.status = GameStatus.ONGOING;
  });
};

export const updateGameSettings: ClientEventListeners[ClientEvent.UPDATE_GAME_SETTINGS] =
  (gameId, newSettings) => {
    GameManager.for(gameId).update((game) => ({
      ...game,
      settings: Object.assign(game.settings, newSettings),
    }));
  };

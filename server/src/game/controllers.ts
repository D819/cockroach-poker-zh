import {
  AudioEventTrigger,
  ClientEvent,
  ClientEventListeners,
  ServerEvent,
} from "../../../client/src/types/event.types";
import { GamePhase, GameStatus } from "../../../client/src/types/game.types";
import { NotificationType } from "../../../client/src/types/notification.types";
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

  gameManager.update((game) => {
    game.active.playerId = to;
    game.active.passHistory.push({ from, to, claim });
    if (card) {
      game.active.card = card;
      gameManager.managePlayer(from).dropCard(card.id);
    }
    game.active.phase = GamePhase.PREDICT_OR_PASS;
  });

  gameManager.pushPlayerNotificationById(to, {
    type: NotificationType.GENERAL,
    message: "You're up!",
  });

  gameManager.triggerAudio(AudioEventTrigger.PASS);
};

export const peekAtCard: ClientEventListeners[ClientEvent.PEEK_AT_CARD] = (
  gameId
) => {
  const gameManager = GameManager.for(gameId);
  gameManager.update((game) => {
    game.active.phase = GamePhase.PASS_SELECTION;
  });
  gameManager.triggerAudio(AudioEventTrigger.PEEK);
};

export const predictCard: ClientEventListeners[ClientEvent.PREDICT_CARD] = (
  gameId,
  prediction
) => {
  const gameManager = GameManager.for(gameId);
  gameManager.revealCardPredictionResult(prediction);
  gameManager.triggerAudio(AudioEventTrigger.PREDICT);
};

export const resetGame: ClientEventListeners[ClientEvent.RESET_GAME] = (
  gameId
) => {
  const gameManager = GameManager.for(gameId);
  gameManager.resetGame();
};

export const resolveFlip: ClientEventListeners[ClientEvent.RESOLVE_FLIP] = (
  gameId
) => {
  const gameManager = GameManager.for(gameId);

  const prediction = gameManager.snapshot()?.active.prediction;
  if (typeof prediction !== "boolean") return; // might be multiple clients asking to resolve flip

  gameManager.resolveCardPrediction(prediction);
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

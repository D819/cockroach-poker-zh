import {
  ClientEvent,
  ClientEventListeners,
  ServerEvent,
  ServerSocket,
} from "../../client/src/types/event.types";
import {
  startGame,
  resetGame,
  updateGameSettings,
  kickPlayer,
  passCard,
} from "./game/controllers";
import { joinPlayerToGame, updatePlayer } from "./player/controllers";
import { GameManager } from "./game/manager";

export const addListeners = (socket: ServerSocket): void => {
  const listeners: ClientEventListeners = {
    [ClientEvent.CREATE_GAME]: (socketId, playerName) => {
      const gameManager = GameManager.hostNew(socketId, playerName);
      const createdData = gameManager._pointer();
      if (createdData) {
        socket.emit(ServerEvent.GAME_CREATED, createdData);
      }
    },
    [ClientEvent.GET_GAME]: (gameId) => {
      const game = GameManager.for(gameId)._pointer();
      game
        ? socket.emit(ServerEvent.GAME_GOTTEN, game.id, game)
        : socket.emit(ServerEvent.GAME_NOT_FOUND);
    },
    [ClientEvent.GET_PLAYER]: (gameId, playerId, aliasIds) => {
      const player = GameManager.for(gameId)
        .managePlayer(playerId, aliasIds)
        ._pointer();
      player
        ? socket.emit(ServerEvent.PLAYER_GOTTEN, player.socketId, player)
        : socket.emit(ServerEvent.PLAYER_NOT_FOUND);
    },
    [ClientEvent.JOIN_GAME]: joinPlayerToGame,
    [ClientEvent.KICK_PLAYER]: kickPlayer,
    [ClientEvent.PASS_CARD]: passCard,
    [ClientEvent.RESET_GAME]: resetGame,
    [ClientEvent.START_GAME]: startGame,
    [ClientEvent.UPDATE_PLAYER]: updatePlayer,
    [ClientEvent.UPDATE_GAME_SETTINGS]: updateGameSettings,
  };

  for (const [event, listener] of Object.entries(listeners) as [
    ClientEvent,
    ClientEventListeners[ClientEvent]
  ][]) {
    socket.on(event, listener);
  }
};

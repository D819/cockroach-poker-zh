import { Socket as TClientSocket } from "socket.io-client";
import { Socket as TServerSocket, Server as TServer } from "socket.io";
import { Game, GameSettings, Player } from "./game.types";
import { GameNotification, PlayerNotification } from "./notification.types";

export type ClientSocket = TClientSocket<
  ServerEventListeners,
  ClientEventListeners
>;

export type ServerSocket = TServerSocket<
  ClientEventListeners,
  ServerEventListeners
>;

export type ServerIO = TServer<ClientEventListeners, ServerEventListeners>;

export enum ClientEvent {
  CREATE_GAME = "create-game",
  GET_GAME = "get-game",
  GET_PLAYER = "get-player",
  JOIN_GAME = "join",
  KICK_PLAYER = "kick-player",
  RESET_GAME = "reset-game",
  START_GAME = "start-game",
  UPDATE_PLAYER = "update-player",
  UPDATE_GAME_SETTINGS = "update-game-setting",
}

export enum ServerEvent {
  GAME_CREATED = "game-created",
  GAME_GOTTEN = "game-gotten",
  GAME_JOINED = "game-joined",
  GAME_NOTIFICATION = "game-notification",
  GAME_NOT_FOUND = "game-not-found",
  GAME_OVER = "game-over",
  GAME_UPDATED = "game-updated",
  PLAYER_GOTTEN = "player-gotten",
  PLAYER_KICKED = "player-kicked",
  PLAYER_NOTIFICATION = "player-notification",
  PLAYER_NOT_FOUND = "player-not-found",
  PLAYER_UPDATED = "player-updated",
  REDIRECT_TO_LOBBY = "redirect-to-lobby",
}

/**
 * Listeners for `ClientEvent`s
 */
export type ClientEventListeners = {
  [ClientEvent.CREATE_GAME]: (socketId: string, playerName?: string) => void;

  [ClientEvent.GET_GAME]: (gameId: string) => void;

  [ClientEvent.GET_PLAYER]: (
    gameId: string,
    playerId: string,
    aliasIds: string[]
  ) => void;

  [ClientEvent.JOIN_GAME]: (gameId: string, player: Player) => void;

  [ClientEvent.KICK_PLAYER]: (gameId: string, playerId: string) => void;

  [ClientEvent.RESET_GAME]: (gameId: string) => void;

  [ClientEvent.START_GAME]: (gameId: string) => void;

  [ClientEvent.UPDATE_PLAYER]: (gameId: string, player: Player) => void;

  [ClientEvent.UPDATE_GAME_SETTINGS]: (
    gameId: string,
    newSettings: Partial<GameSettings>
  ) => void;
};

/**
 * Listeners for `ServerEvent`s
 */
export type ServerEventListeners = {
  [ServerEvent.GAME_CREATED]: (game: Game) => void;
  [ServerEvent.GAME_OVER]: (gameId: string, game: Game) => void;
  [ServerEvent.GAME_GOTTEN]: (gameId: string, game: Game) => void;
  [ServerEvent.GAME_JOINED]: (game: Game) => void;
  [ServerEvent.GAME_NOTIFICATION]: (
    gameId: string,
    notification: GameNotification
  ) => void;
  [ServerEvent.GAME_NOT_FOUND]: () => void;
  [ServerEvent.GAME_UPDATED]: (gameId: string, game: Game) => void;
  [ServerEvent.PLAYER_GOTTEN]: (playerId: string, player: Player) => void;
  [ServerEvent.PLAYER_KICKED]: (gameId: string, playerId: string) => void;
  [ServerEvent.PLAYER_UPDATED]: (playerId: string, player: Player) => void;
  [ServerEvent.PLAYER_NOTIFICATION]: (
    playersToNotify: Record<string, true>,
    notification: PlayerNotification
  ) => void;
  [ServerEvent.PLAYER_NOT_FOUND]: () => void;
  [ServerEvent.REDIRECT_TO_LOBBY]: () => void;
};

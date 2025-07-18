import { useEffect } from "react";
import { useParams } from "react-router";
import { bundle, useRiducer } from "riduce";
import { useSocket } from "../socket";
import { ClientEvent, ServerEvent } from "../types/event.types";
import { Player } from "../types/game.types";
import useSocketListener from "./useSocketListener";
import { useHistory } from "react-router-dom";
import { showNotification } from "@mantine/notifications";

interface UsePlayerResult {
  data: Player | undefined;
  loading: boolean;
  error: string | undefined;
}

const initialState: UsePlayerResult = {
  loading: true,
  data: undefined,
  error: undefined,
};

export default function usePlayer(
  playerId?: Player["socketId"],
  aliasIds: string[] = []
): UsePlayerResult {
  const socket = useSocket();
  const history = useHistory();
  const { state, dispatch, actions } = useRiducer(initialState);
  const { gameId } = useParams<{ gameId: string }>();
  const playerSocketId = playerId ?? socket.id;

  const setPlayer = (player: Player) =>
    dispatch(
      bundle([
        actions.data.create.update(player),
        actions.loading.create.off(),
        actions.error.create.reset(),
      ])
    );

  useEffect(() => {
    const aliases = Array.isArray(aliasIds) ? aliasIds : [];
    
    gameId &&
      playerSocketId &&
      socket.emit(ClientEvent.GET_PLAYER, gameId, playerSocketId, aliases);
  }, [socket, gameId, playerSocketId, aliasIds]);

  useSocketListener(ServerEvent.PLAYER_GOTTEN, (id, player) => {
    const aliases = Array.isArray(aliasIds) ? aliasIds : [];
    
    if (playerId) {
      if (id === playerId || aliases.includes(id)) {
        setPlayer(player);
      }
    } else {
      if (aliases.includes(id)) {
        setPlayer(player);
      }
    }
  });

  useSocketListener(ServerEvent.PLAYER_KICKED, (fromGameId, kickedPlayerId) => {
    if (fromGameId === gameId && state.data?.socketId === kickedPlayerId) {
      history.push("/");
      window.alert("You have been kicked from the game by the host!");
    }
  });

  useSocketListener(ServerEvent.PLAYER_UPDATED, (id, player) => {
    const aliases = Array.isArray(aliasIds) ? aliasIds : [];
    
    if (playerId) {
      if (id === playerId || aliases.includes(id)) {
        setPlayer(player);
      }
    } else {
      if (aliases.includes(id)) {
        setPlayer(player);
      }
    }
  });

  useSocketListener(ServerEvent.PLAYER_NOT_FOUND, () => {
    dispatch(
      bundle([
        actions.error.create.update("Player not found"),
        actions.loading.create.off(),
      ])
    );
  });

  useSocketListener(
    ServerEvent.PLAYER_NOTIFICATION,
    (playersToNotify, notification) => {
      if (playerId && playersToNotify[playerId]) {
        showNotification({
          message: notification.message,
          autoClose: 5000,
        });
      }
    }
  );

  return state;
}

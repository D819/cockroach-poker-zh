import { useStorageState } from "react-storage-hooks";
import { useSocket } from "../socket";
import { useEffect, useState } from "react";
import { ClientEvent, ServerEvent } from "../types/event.types";

export interface SocketAliasesHook {
  socketAliases: string[];
  createRoom: (callback: (roomId: string) => void) => void;
  isCreatingRoom: boolean;
}

export function useSocketAliases(): SocketAliasesHook {
  const socket = useSocket();
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  const [socketAliases, setSocketAliases] = useStorageState(
    sessionStorage,
    "socketAliases",
    [] as string[]
  );

  useEffect(() => {
    if (socket && !socketAliases.includes(socket.id)) {
      setSocketAliases([...socketAliases, socket.id]);
    }
  }, [socket, socketAliases, setSocketAliases]);

  const createRoom = (callback: (roomId: string) => void) => {
    if (!socket) return;
    
    setIsCreatingRoom(true);
    
    // 监听游戏创建成功事件
    const handleGameCreated = (data: { id: string }) => {
      setIsCreatingRoom(false);
      callback(data.id);
      socket.off(ServerEvent.GAME_CREATED, handleGameCreated);
    };
    
    socket.on(ServerEvent.GAME_CREATED, handleGameCreated);
    socket.emit(ClientEvent.CREATE_GAME, socket.id);
  };

  return { socketAliases, createRoom, isCreatingRoom };
}

export default useSocketAliases;

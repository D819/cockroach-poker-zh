import {
  Game,
  GameSettings,
  GameStatus,
  Player,
} from "../../types/game.types";
import GameLobby from "./lobby/GameLobby";
import GameOngoing from "./ongoing/GameOngoing";

interface Props extends GameHandlers {
  game: Game;
  players: Player[];
  player: Player;
}

export interface GameHandlers {
  onGameStart(): void;
  onGameReset(): void;
  onPlayerKick(playerIdToKick: string): void;
  onSettingsUpdate(newSettings: Partial<GameSettings>): void;
}

function GamePage({
  game,
  onGameReset,
  onGameStart,
  onPlayerKick,
  onSettingsUpdate,
  players,
  player,
}: Props): JSX.Element {

  if (game.status === GameStatus.LOBBY) {
    return (
      <GameLobby
        {...{
          game,
          onGameStart,
          onPlayerKick,
          onSettingsUpdate,
          players,
          player,
        }}
      />
    );
  } else if (game.status === GameStatus.ONGOING) {
    return (
      <GameOngoing
        {...{
          game,
          player,
          players,
        }}
      />
    );
  } else {
    return <p>Something weird has happened</p>;
  }
}

export default GamePage;

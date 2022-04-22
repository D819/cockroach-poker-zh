import {
  Game,
  Player,
} from "../../../types/game.types";

interface Props {
  game: Game;
  player: Player;
}

function GameOngoing({
  game,
  player,
}: Props): JSX.Element {

  return (
    <p>Game is ongoing</p>
  )
}

export default GameOngoing;

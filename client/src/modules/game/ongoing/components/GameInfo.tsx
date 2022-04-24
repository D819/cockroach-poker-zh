import { Alert, Text } from '@mantine/core';
import { selectActiveGamePhase, selectActivePlayer, selectCurrentPassRecord, selectIsFirstPass, selectPassingPlayer } from '../../../../selectors/game-selectors';
import { Game, GamePhase, Player } from '../../../../types/game.types';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  game: Game;
  player: Player;
}

function GameInfo({ className, style, game, player }: Props): JSX.Element {
  const phase = selectActiveGamePhase(game);
  const pass = selectCurrentPassRecord(game);
  const isFirstPass = selectIsFirstPass(game);
  const passer = selectPassingPlayer(game);
  const activePlayer = selectActivePlayer(game);
  const isActivePlayer = activePlayer.socketId === player.socketId;

  if (pass && phase === GamePhase.PREDICT_OR_PASS) {
    const claimTitle = `Pass: "${pass.claim}" (${passer?.name} ➝ ${activePlayer.name})`;
    const passMessage = `${passer?.name} has passed ${isFirstPass ? "a" : "the"} card onto ${activePlayer.name} with a claim of "${pass.claim}".`

    const claimMessage = `${isActivePlayer ? "You need" : `${activePlayer.name} needs`} to predict the claim's truthfulness, or peek and pass it on.`

    return (
      <Alert title={claimTitle} m="sm">
        <Text size='sm' mb='xs'>{passMessage}</Text>
        <Text size='sm'>{claimMessage}</Text>
      </Alert>
    );
  }

  if (phase === GamePhase.PASS_SELECTION) {
    const peekTitle = `Peek: "${pass?.claim}" (${passer?.name} ➝ ${activePlayer.name})`;
    const newPassTitle = isActivePlayer ? "You are starting a new pass" : `${activePlayer.name} is starting a new pass`;

    const peekMessage = `${isActivePlayer ? "You are" : activePlayer.name + " is"} peeking at ${passer?.name}'s claimed "${pass?.claim}".`

    const message = isActivePlayer
      ? `You are need to pass ${pass ? "the" : "a"} card on with a claim.`
      : `${activePlayer.name} needs to pass ${pass ? "the" : "a"} card on with a claim.`;

    return (
      <Alert title={pass ? peekTitle : newPassTitle} m="sm">
        {pass && <Text size='sm' mb='xs'>{peekMessage}</Text>}
        <Text size='sm'>{message}</Text>
      </Alert>
    );
  }

  return (
    <Alert title="hi" m="sm">
      <Text>
        {isActivePlayer ? "You are" : `${activePlayer.name} is`} active player
      </Text>
    </Alert>
  );
}

export default GameInfo;
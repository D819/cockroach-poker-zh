import { Alert, Text } from '@mantine/core';
import { selectActiveGamePhase, selectActivePlayer, selectCurrentPassRecord, selectIsFirstPass, selectIsFurtherPassPossible, selectPassingPlayer } from '../../../../selectors/game-selectors';
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
  const isFurtherPassPossible = selectIsFurtherPassPossible(game);
  const passer = selectPassingPlayer(game);
  const activePlayer = selectActivePlayer(game);
  const isActivePlayer = activePlayer.socketId === player.socketId;

  if (pass && phase === GamePhase.PREDICT_OR_PASS) {
    const claimTitle = `Claim: "${pass.claim}" (${passer?.name} ➝ ${activePlayer.name})`;
    const passMessage = `${passer?.name} has passed ${isFirstPass ? "a" : "the"} card onto ${activePlayer.name} with a claim of "${pass.claim}".`

    const peekOrPassMessage = `${isActivePlayer ? "You need" : `${activePlayer.name} needs`} to predict the claim's truthfulness, or peek and pass it on.`

    const mustPassMessage = `Since all other players have seen the card, ${isActivePlayer ? "you" : activePlayer.name} must predict the claim's truthfulness.`

    return (
      <Alert title={claimTitle} m="sm">
        <Text size='sm' mb='xs'>{passMessage}</Text>
        <Text size='sm'>{isFurtherPassPossible ? peekOrPassMessage : mustPassMessage}</Text>
      </Alert>
    );
  }

  if (phase === GamePhase.PASS_SELECTION) {
    const peekTitle = `Peek: "${pass?.claim}" (${passer?.name} ➝ ${activePlayer.name})`;
    const newPassTitle = isActivePlayer ? "You are starting a new pass" : `${activePlayer.name} is starting a new pass`;

    const peekMessage = `${isActivePlayer ? "You are" : activePlayer.name + " is"} peeking at ${passer?.name}'s claimed "${pass?.claim}".`

    const message = `${
      isActivePlayer ? "You need" : `${activePlayer.name} needs`
    } to ${
      pass ? "pass the card on" : `pick a card from ${isActivePlayer ? "your" : "their"} hand and pass it on`
    } with a claim.`;

    return (
      <Alert {...{ className, style }} title={pass ? peekTitle : newPassTitle} m="sm">
        {pass && <Text size='sm' mb='xs'>{peekMessage}</Text>}
        <Text size='sm'>{message}</Text>
      </Alert>
    );
  }

  return (
    <Alert {...{ className, style }} title="hi" m="sm">
      <Text>
        {isActivePlayer ? "You are" : `${activePlayer.name} is`} active player
      </Text>
    </Alert>
  );
}

export default GameInfo;
import { Button, Select, Text } from '@mantine/core';
import { useState } from 'react';
import styled from 'styled-components';
import { CardSuit, Player } from '../../../../types/game.types';
import SuitSelector from './SuitSelector';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  pickCard?: boolean;
  players: Player[];
  disabledPlayerIds: string[];
}

const PlayerPickChoice = styled.div`
  display: grid;
  grid-template-columns: "auto auto";
  grid-template-rows: auto auto;
  grid-row-gap: 10px;

  .submit-button {
    grid-column-end: span 2;
  }
`;

interface SelectionState {
  card?: CardSuit;
  claim?: CardSuit;
  playerId?: string;
}

function CardPassPicker({ className, style, pickCard, players, disabledPlayerIds }: Props): JSX.Element {

  const [selected, setSelected] = useState<SelectionState>({})
  
  const isSubmitDisabled = !(selected.claim && selected.playerId && (!pickCard || selected.card))

  return (
    <PlayerPickChoice {...{ className, style }}>
      {pickCard && (
        <>
          <Text>Pick a card</Text>
          <SuitSelector onSelect={(suit) => setSelected((prev) => ({ ...prev, card: suit }))} value={selected.card} />
        </>
      )}
      <Text>Pick a claim</Text>
      <SuitSelector onSelect={(suit) => setSelected((prev) => ({ ...prev, claim: suit }))} value={selected.claim} />
      <Text>Pick a player</Text>
      <Select
        data={players.map((player) => ({
          label: player.name,
          value: player.socketId,
          disabled: disabledPlayerIds.includes(player.socketId),
        }))}
        required
        onChange={(playerId) => playerId && setSelected((prev) => ({ ...prev, playerId }))}
        value={selected.playerId}
      />
      <Button className='submit-button' disabled={isSubmitDisabled} fullWidth>Submit pass</Button>
    </PlayerPickChoice>
  );
}


export default CardPassPicker;
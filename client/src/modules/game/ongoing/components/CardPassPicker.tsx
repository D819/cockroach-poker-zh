import { Select } from '@mantine/core';
import styled from 'styled-components';
import { Player } from '../../../../types/game.types';
import SuitSelector from './SuitSelector';

interface Props {
  className?: string;
  style?: React.CSSProperties
  pickCard?: boolean;
  players: Player[];
  disabledPlayerIds: string[];
}

const PlayerPickChoice = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
`;

function CardPassPicker({ className, style, pickCard, players, disabledPlayerIds }: Props): JSX.Element {
  return (
    <PlayerPickChoice {...{ className, style }}>
      {pickCard && <SuitSelector label="Pick a card" required />}
      <SuitSelector label="Pick a claim" required />
      <Select
        label="Pick a player"
        data={players.map(player => ({
          label: player.name,
          value: player.socketId,
          disabled: disabledPlayerIds.includes(player.socketId)
        }))}
        required
      />
    </PlayerPickChoice>
  );
}


export default CardPassPicker;
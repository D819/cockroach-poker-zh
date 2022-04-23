import { Button, Select, Text } from '@mantine/core';
import styled from 'styled-components';
import { Player } from '../../../../types/game.types';
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

function CardPassPicker({ className, style, pickCard, players, disabledPlayerIds }: Props): JSX.Element {
  return (
    <PlayerPickChoice {...{ className, style }}>
      {pickCard && (
        <>
          <Text>Pick a card</Text>
          <SuitSelector />
        </>
      )}
      <Text>Pick a claim</Text>
      <SuitSelector />
      <Text>Pick a player</Text>
      <Select
        data={players.map((player) => ({
          label: player.name,
          value: player.socketId,
          disabled: disabledPlayerIds.includes(player.socketId),
        }))}
        required
      />
      <Button className='submit-button' fullWidth>Submit pass</Button>
    </PlayerPickChoice>
  );
}


export default CardPassPicker;
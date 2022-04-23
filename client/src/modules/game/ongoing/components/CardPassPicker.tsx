import { Select, Text } from '@mantine/core';
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
  display: grid;
  grid-template-areas:
    "card-label card-select"
    "claim-label claim-select"
    "player-label player-select";
  grid-template-columns: "auto auto";
  grid-template-rows: repeat(3, min-content);
  grid-row-gap: 10px;
`;

function CardPassPicker({ className, style, pickCard, players, disabledPlayerIds }: Props): JSX.Element {
  return (
    <PlayerPickChoice {...{ className, style }}>
      {pickCard && (
        <>
          <Text className="card-label">Pick a card</Text>
          <SuitSelector className="card-select" />
        </>
      )}
      <Text className="claim-label">Pick a claim</Text>
      <SuitSelector className="claim-select" />
      <Text className="player-label">Pick a player</Text>
      <Select
        className="player-select"
        data={players.map((player) => ({
          label: player.name,
          value: player.socketId,
          disabled: disabledPlayerIds.includes(player.socketId),
        }))}
        required
      />
    </PlayerPickChoice>
  );
}


export default CardPassPicker;
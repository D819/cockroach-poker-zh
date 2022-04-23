import styled from 'styled-components';
import { CardSuit } from "../../../../types/game.types";
import SuitIcons from './SuitIcons';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  count: Record<CardSuit, number>;
  filterEmpty?: boolean;
}

const SuitCount = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2px;
`;

function CardCount({ className, style, count, filterEmpty }: Props): JSX.Element {
  return (
    <SuitIcons
      {...{ className, style }}
      filter={filterEmpty ? (suit) => count[suit] > 0 : undefined}
      renderSuit={(suit, icon) => (
        <SuitCount>
          {icon}
          <p>{count[suit]}</p>
        </SuitCount>
      )}
    />
  );
}

export default CardCount;
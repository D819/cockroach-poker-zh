import { Button, Group, Select, Text } from "@mantine/core";
import { useState } from "react";
import styled from "styled-components";
import { CardSuit, Game, Player } from "../../../../types/game.types";
import SuitIcon from "./SuitIcon";
import SuitSelector from "./SuitSelector";
import { selectCurrentPassRecord } from "../../../../selectors/game-selectors";

interface Props {
  className?: string;
  style?: React.CSSProperties;
  game: Game;
  player: Player;
  players: Player[];
  isPlayerDisabled?(player: Player): boolean;
  onSubmit?(selection: CardPassSelection): void;
}

export interface CardPassSelection {
  card?: CardSuit;
  claim: CardSuit;
  playerId: string;
}

const PlayerPickChoice = styled.div`
  display: grid;
  grid-template-columns: "auto auto";
  grid-template-rows: auto auto;
  grid-row-gap: 10px;

  .full-grid-width {
    grid-column-end: span 2;
  }

  .bold {
    font-weight: bold;
  }
`;

function CardPassPicker({
  className,
  style,
  game,
  player,
  players,
  isPlayerDisabled = () => false,
  onSubmit,
}: Props): JSX.Element {
  const pass = selectCurrentPassRecord(game);

  const [selected, setSelected] = useState<Partial<CardPassSelection>>({});
  const { card: activeCard } = game.active;

  const isSubmitDisabled = !(
    selected.claim &&
    selected.playerId &&
    (!!activeCard || selected.card)
  );

  return (
    <PlayerPickChoice {...{ className, style }}>
      {activeCard ? (
        <>
          <Group className="full-grid-width bold">
            <Text>
              The claimed "{pass?.claim}" is... a {activeCard.suit}{" "}
              {pass?.claim === activeCard.suit ? "😅" : "😱"}
            </Text>
            <SuitIcon suit={activeCard.suit} />
          </Group>
          <Text className="full-grid-width" mb="sm">
            It's your turn to pass it on!
          </Text>
        </>
      ) : (
        <>
          <Text>Pick a card</Text>
          <SuitSelector
            onSelect={(suit) =>
              setSelected((prev) => ({ ...prev, card: suit }))
            }
            value={selected.card}
            isSuitDisabled={(suit) =>
              !player.cards.hand.find((card) => card.suit === suit)
            }
          />
        </>
      )}
      <Text>Pick a claim</Text>
      <SuitSelector
        onSelect={(suit) => setSelected((prev) => ({ ...prev, claim: suit }))}
        value={selected.claim}
      />
      <Text>Pick a player</Text>
      <Select
        data={players.map((player) => ({
          label: player.name,
          value: player.socketId,
          disabled: isPlayerDisabled(player),
        }))}
        required
        onChange={(playerId) =>
          playerId && setSelected((prev) => ({ ...prev, playerId }))
        }
        value={selected.playerId}
      />
      <Button
        className="full-grid-width"
        disabled={isSubmitDisabled}
        fullWidth
        onClick={() => {
          if (onSubmit && selected.claim && selected.playerId) {
            // ugly to get TS compiler to accept present selected.claim and selected.playerId
            onSubmit({
              ...selected,
              claim: selected.claim,
              playerId: selected.playerId,
            });
          }
        }}
      >
        Submit pass
      </Button>
    </PlayerPickChoice>
  );
}

export default CardPassPicker;

import { Avatar, Group, Select, Text } from '@mantine/core';
import { forwardRef } from 'react';
import { CardSuit } from '../../../../types/game.types';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  onSelect?(suit: CardSuit): void;
  isSuitDisabled?(suit: CardSuit): boolean;
  required?: boolean;
  value?: CardSuit;
}

function SuitSelector({ className, style, label, required, value, onSelect, isSuitDisabled = () => false }: Props): JSX.Element {
  return (
    <Select
      {...{ className, style, label, required }}
      data={Object.values(CardSuit).map((suit) => ({
        value: suit,
        image: `/assets/icons/${suit.toLowerCase().replaceAll(" ", "-")}.jpg`,
        label: suit,
        disabled: isSuitDisabled(suit)
      }))}
      value={value}
      onChange={(value) => {
        // cast from string | null to do a check
        const prospectiveSuit = value as CardSuit
        if (onSelect && Object.values(CardSuit).includes(prospectiveSuit)) {
          onSelect(prospectiveSuit)
        }
      }}
      itemComponent={SelectItem}
      styles={{
        label: {
          padding: "2px",
        },
      }}
    />
  );
}

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  description: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image} />
        <div>
          <Text size="sm">{label}</Text>
        </div>
      </Group>
    </div>
  )
);

export default SuitSelector;
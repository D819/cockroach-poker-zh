import { Group, Stack, Text, Avatar, Button } from "@mantine/core";
import { CardSuit } from "../../../../types/game.types";
import { useTranslation } from "react-i18next";

interface Props {
  value?: CardSuit;
  onSelect(suit: CardSuit): void;
  isSuitDisabled?(suit: CardSuit): boolean;
  label?: string;
}

function SuitSelector({
  value,
  onSelect,
  isSuitDisabled = () => false,
  label,
}: Props): JSX.Element {
  const { t } = useTranslation();
  
  return (
    <Stack>
      {label && (
        <Text size="sm" weight={500} align="center">
          {label}
        </Text>
      )}
      <Group position="center" mt="xs">
        {Object.values(CardSuit).map((suit) => (
          <Button
            key={suit}
            variant={value === suit ? "filled" : "outline"}
            onClick={() => onSelect(suit)}
            disabled={isSuitDisabled(suit)}
            size="sm"
          >
            <Group spacing="xs">
              <Avatar
                src={`/assets/icons/${suit
                  .toLowerCase()
                  .replaceAll(" ", "-")}.jpg`}
                size="sm"
                radius="xl"
              />
              <Text>{t(`suits.${suit}`)}</Text>
            </Group>
          </Button>
        ))}
      </Group>
    </Stack>
  );
}

export default SuitSelector;

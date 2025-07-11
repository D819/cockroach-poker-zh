import { Group, Stack, Text, Avatar, Button } from "@mantine/core";
import { CardSuit, Claim } from "../../../../types/game.types";
import { useTranslation } from "react-i18next";

interface Props {
  value?: Claim;
  onSelect(claim: Claim): void;
  isSuitDisabled?(suit: CardSuit): boolean;
  label?: string;
}

const ALL_CLAIMS: Claim[] = [...Object.values(CardSuit), "Royal"];

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
      <Group position="center" mt="xs" sx={{ flexWrap: 'wrap' }}>
        {ALL_CLAIMS.map((claim) => (
          <Button
            key={claim}
            variant={value === claim ? "filled" : "outline"}
            onClick={() => onSelect(claim)}
            disabled={claim !== "Royal" && isSuitDisabled(claim)}
            size="sm"
          >
            <Group spacing="xs">
              <Avatar
                src={`/assets/icons/${claim
                  .toLowerCase()
                  .replaceAll(" ", "-")}.jpg`}
                size="sm"
                radius="xl"
              />
              <Text>{t(`suits.${claim}`)}</Text>
            </Group>
          </Button>
        ))}
      </Group>
    </Stack>
  );
}

export default SuitSelector;

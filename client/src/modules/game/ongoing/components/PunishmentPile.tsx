import { Badge, Group, Paper, Text, Image } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { Card, PunishmentCards } from "../../../../types/game.types";

function getCardImagePath(card: Card): string {
    const suit = card.suit.toLowerCase().replace(/\s+/g, '-');
    const variant = card.variant.toString().toLowerCase();
    return `/assets/card-fronts/${suit}-${variant}.jpg`;
}

interface Props {
  punishmentCards: PunishmentCards;
}

export function PunishmentPile({ punishmentCards }: Props): JSX.Element {
  const { t } = useTranslation();
  
  return (
    <Paper shadow="sm" withBorder p="xs">
      <Group position="apart">
        <Text size="sm" weight={500}>
          {t("game.punishment_pile")}
        </Text>
        <Group>
          <Badge variant="filled" color="gray">{`x ${punishmentCards.pile.length}`}</Badge>
          <Image
            src={getCardImagePath(punishmentCards.revealedCard)}
            height="50px"
            width="auto"
            radius="sm"
            alt={`${punishmentCards.revealedCard.suit} ${punishmentCards.revealedCard.variant}`}
          />
        </Group>
      </Group>
    </Paper>
  );
}

export default PunishmentPile; 
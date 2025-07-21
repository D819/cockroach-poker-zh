import {
  Button,
  Group,
  Select,
  Text,
  Stack,
  Stepper,
  Box,
  Badge,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { Card, CardSuit, Claim, Game, Player } from "../../../../types/game.types";
import SuitIcon from "./SuitIcon";
import SuitSelector from "./SuitSelector";
import { selectCurrentPassRecord } from "../../../../selectors/game-selectors";
import { useTranslation } from "react-i18next";
import { groupHandByCardType } from "../../../../utils/hand-utils";

interface Props {
  game: Game;
  player: Player;
  players: Player[];
  isPlayerDisabled?(player: Player): boolean;
  onSubmit?(selection: CardPassSelection): void;
  activeCard?: Card;
}

export interface CardPassSelection {
  card?: Card;
  claim: Claim;
  playerId: string;
}

function CardPassPicker({
  game,
  player,
  players,
  isPlayerDisabled = () => false,
  onSubmit,
}: Props): JSX.Element {
  const { t } = useTranslation();
  const pass = selectCurrentPassRecord(game);
  const { card: activeCardInGame } = game.active;
  const groupedHand = groupHandByCardType(player.cards.hand);
  const [activeStep, setActiveStep] = useState(0);
  const [selection, setSelection] = useState<Partial<CardPassSelection>>({});

  useEffect(() => {
    setSelection({
      card: undefined,
      claim: undefined,
      playerId: undefined,
    });
    setActiveStep(0);
  }, [activeCardInGame]);

  const handleStepChange = (step: number) => {
    if (step > activeStep && isStepDisabled(activeStep)) {
      return;
    }
    setActiveStep(step);
  };

  const isStepDisabled = (step: number): boolean => {
    if (activeCardInGame) {
      switch (step) {
        case 0:
          return !selection.claim;
        case 1:
          return !selection.playerId;
        default:
          return false;
      }
    } else {
      switch (step) {
        case 0:
          return !selection.card;
        case 1:
          return !selection.claim;
        case 2:
          return !selection.playerId;
        default:
          return false;
      }
    }
  };

  const nextStep = () =>
    handleStepChange(Math.min(activeStep + 1, activeCardInGame ? 2 : 3));
  const prevStep = () => handleStepChange(Math.max(activeStep - 1, 0));

  const handleSubmit = () => {
    if (!onSubmit || !selection.claim || !selection.playerId) return;

    if (activeCardInGame) {
      onSubmit({
        claim: selection.claim,
        playerId: selection.playerId,
      });
    } else if (selection.card) {
      onSubmit({
        claim: selection.claim,
        playerId: selection.playerId,
        ...selection,
      });
    }
  };

  const isSubmitDisabled = activeCardInGame
    ? !selection.claim || !selection.playerId
    : !selection.card || !selection.claim || !selection.playerId;

  return (
    <Stack>
      {activeCardInGame && (
        <Box my="md">
          <Group>
            <Text>{String(t('game.received_card_info_part1', 'Claimed:'))}</Text>
            {pass?.claim && <Badge size="lg">{String(t(`suits.${pass.claim}`, pass.claim))}</Badge>}
            <Text>{String(t('game.received_card_info_part2', 'Actual:'))}</Text>
            <SuitIcon suit={activeCardInGame.suit} variant={activeCardInGame.variant} />
            <Text>{String(t(`suits.${activeCardInGame.suit}`, activeCardInGame.suit))}</Text>
          </Group>
          <Text color="dimmed" size="sm">
            {String(t('game.pass_it_on'))}
          </Text>
        </Box>
      )}
      <Stepper
        active={activeStep}
        onStepClick={setActiveStep}
        breakpoint="xs"
      >
        {!activeCardInGame && (
          <Stepper.Step label={String(t('game.step_pick_card', 'Pick card'))} description={selection.card ? `${t(`suits.${selection.card.suit}`)} ${t(`suits.${selection.card.variant}`,selection.card.variant)}`: ''}>
            <Group position="center" spacing="sm" sx={{ flexWrap: 'wrap' }}>
              {groupedHand.map((handCard) => (
                <Box key={handCard.id} sx={{ position: 'relative', cursor: 'pointer' }} onClick={() => setSelection((prev) => ({ ...prev, card: handCard.card }))}>
                  <SuitIcon height="80px" suit={handCard.suit} variant={handCard.card.variant} selected={selection.card?.id === handCard.card.id} />
                  <Badge
                    color="pink"
                    variant="filled"
                    size="sm"
                    sx={{
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                    }}
                  >
                    {handCard.count}
                  </Badge>
                </Box>
              ))}
            </Group>
          </Stepper.Step>
        )}
        <Stepper.Step label={String(t('game.step_pick_claim', 'Pick claim'))} description={`${t(`suits.${selection.claim ?? ''}`,'')}` }>
          <SuitSelector
            onSelect={(claim) =>
              setSelection((prev) => {
                return { ...prev, claim: claim }})
            }
            value={selection.claim}
          />
        </Stepper.Step>
        <Stepper.Step label={String(t('game.step_pick_player', 'Pick player'))} description={selection.playerId ? players.find(p => p.socketId === selection.playerId)?.name : ''}>
          <Select
            label={String(t('game.pass_to', 'Pass to'))}
            data={players.map((p) => ({
              label: p.name ?? p.socketId,
              value: p.socketId,
              disabled: isPlayerDisabled(p),
            }))}
            required
            onChange={(playerId) =>
              playerId && setSelection((prev) => ({ ...prev, playerId }))
            }
            value={selection.playerId}
          />
        </Stepper.Step>
        <Stepper.Completed>
            <Text align="center">{String(t('game.confirm_pass', 'Ready to pass. Click submit to confirm.'))}</Text>
        </Stepper.Completed>
      </Stepper>
      <Group position="center" mt="sm">
        {activeStep !== 0 && <Button variant="default" onClick={prevStep}>{String(t('common.back', 'Back'))}</Button>}
        {activeStep !== (activeCardInGame ? 1 : 2) && <Button onClick={nextStep} disabled={isStepDisabled(activeStep)}>{String(t('common.next', 'Next'))}</Button>}
        {activeStep === (activeCardInGame ? 1 : 2) && <Button onClick={handleSubmit} disabled={isSubmitDisabled}>{String(t('game.submit_pass', 'Submit Pass'))}</Button>}
      </Group>
    </Stack>
  );
}

export default CardPassPicker;

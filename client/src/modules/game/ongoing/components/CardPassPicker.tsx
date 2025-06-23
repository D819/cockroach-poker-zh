import {
  Button,
  Group,
  Select,
  Text,
  Stack,
  Stepper,
  Box,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { CardSuit, Game, Player } from "../../../../types/game.types";
import SuitIcon from "./SuitIcon";
import SuitSelector from "./SuitSelector";
import { selectCurrentPassRecord } from "../../../../selectors/game-selectors";
import { useTranslation } from "react-i18next";

interface Props {
  game: Game;
  player: Player;
  players: Player[];
  isPlayerDisabled?(player: Player): boolean;
  onSubmit?(selection: CardPassSelection): void;
  activeCard?: CardSuit;
}

export interface CardPassSelection {
  card?: CardSuit;
  claim: CardSuit;
  playerId: string;
}

function CardPassPicker({
  game,
  player,
  players,
  isPlayerDisabled = () => false,
  onSubmit,
  activeCard,
}: Props): JSX.Element {
  const { t } = useTranslation();
  const pass = selectCurrentPassRecord(game);
  const { card: activeCardInGame } = game.active;

  const [activeStep, setActiveStep] = useState(0);
  const [selection, setSelection] = useState<Partial<CardPassSelection>>({
    card: activeCard,
  });

  useEffect(() => {
    setSelection({
      card: activeCard,
      claim: undefined,
      playerId: undefined,
    });
    setActiveStep(0);
  }, [activeCard]);

  const handleStepChange = (step: number) => {
    if (step > activeStep && isStepDisabled(activeStep)) {
      return;
    }
    setActiveStep(step);
  };

  const isStepDisabled = (step: number): boolean => {
    if (activeCard) {
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
    handleStepChange(Math.min(activeStep + 1, 3));
  const prevStep = () => handleStepChange(Math.max(activeStep - 1, 0));

  const handleSubmit = () => {
    if (onSubmit && selection.claim && selection.playerId) {
      onSubmit({
        ...selection,
        claim: selection.claim,
        playerId: selection.playerId,
      });
    }
  };

  return (
    <Stack>
      {activeCardInGame && (
        <Box my="md">
          <Group>
            <Text>
              {String(t('game.received_card_info', { claim: pass?.claim, suit: activeCardInGame.suit }))}
            </Text>
            <SuitIcon suit={activeCardInGame.suit} />
          </Group>
          <Text color="dimmed" size="sm">
            {String(t('game.pass_it_on'))}
          </Text>
        </Box>
      )}
      <Stepper
        active={activeStep}
        onStepClick={setActiveStep}
        breakpoint="sm"
      >
        {!activeCard && (
          <Stepper.Step label={String(t('game.step_pick_card', 'Pick card'))} description={selection.card ?? ''}>
            <SuitSelector
              onSelect={(suit) =>
                setSelection((prev) => ({ ...prev, card: suit }))
              }
              value={selection.card}
              isSuitDisabled={(suit) =>
                !player.cards.hand.find((card) => card.suit === suit)
              }
            />
          </Stepper.Step>
        )}
        <Stepper.Step label={String(t('game.step_pick_claim', 'Pick claim'))} description={selection.claim ?? ''}>
          <SuitSelector
            onSelect={(suit) =>
              setSelection((prev) => ({ ...prev, claim: suit }))
            }
            value={selection.claim}
          />
        </Stepper.Step>
        <Stepper.Step label={String(t('game.step_pick_player', 'Pick player'))}>
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
      <Group position="center" mt="xl">
        {activeStep !== 0 && <Button variant="default" onClick={prevStep}>{String(t('common.back', 'Back'))}</Button>}
        {activeStep !== 2 + (activeCard ? 0 : 1) && <Button onClick={nextStep} disabled={isStepDisabled(activeStep)}>{String(t('common.next', 'Next'))}</Button>}
        {activeStep === 2 + (activeCard ? 0 : 1) && <Button onClick={handleSubmit}>{String(t('game.submit_pass', 'Submit Pass'))}</Button>}
      </Group>
    </Stack>
  );
}

export default CardPassPicker;

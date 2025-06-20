import {
  Box,
  Overlay,
  Paper,
  Stack,
  Grid,
  Text,
  Avatar,
  Group,
  Badge,
  keyframes,
} from "@mantine/core";
import { Game, GamePhase, Player } from "../../../types/game.types";
import ActiveCard from "./components/ActiveCard";
import { countEachSuit } from "../../../utils/hand-utils";
import CardCount from "./components/CardCount";
import {
  selectActiveCard,
  selectActivePlayer,
} from "../../../selectors/game-selectors";
import { GameHandlers } from "../GamePage";
import ActiveDecision from "./components/ActiveDecision";
import KeyInfo from "./components/KeyInfo";
import CardReveal from "./components/CardReveal";
import { useTranslation } from "react-i18next";

interface Props
  extends Pick<
    GameHandlers,
    "onCardFlip" | "onCardPass" | "onCardPeek" | "onCardPredict" | "onGameReset"
  > {
  game: Game;
  player: Player;
  players: Player[];
}

const pulseBorder = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 105, 180, 0.7);
  }
  
  70% {
    box-shadow: 0 0 0 10px rgba(255, 105, 180, 0);
  }
  
  100% {
    box-shadow: 0 0 0 0 rgba(255, 105, 180, 0);
  }
`;

function GameOngoing({
  game,
  player,
  players,
  onCardFlip,
  onCardPass,
  onCardPeek,
  onCardPredict,
  onGameReset,
}: Props): JSX.Element {
  const { t } = useTranslation();
  const activePlayer = selectActivePlayer(game);
  const activeCard = selectActiveCard(game);
  const isActivePlayer = activePlayer.socketId === player.socketId;

  return (
    <Stack style={{ height: "100%", width: "100%" }} spacing="xs">
      <Paper shadow="sm" withBorder p="xs">
        <KeyInfo {...{ game, player }} />
      </Paper>
      <Box style={{ position: "relative", flex: 1, overflowY: "auto" }}>
        {game.active.phase === GamePhase.CARD_REVEAL && <Overlay blur={1} />}
        <Stack spacing="md">
          {players.map((listPlayer) => {
            const isCurrentlyActive = listPlayer.socketId === activePlayer.socketId;
            return (
            <Paper
              key={listPlayer.socketId}
              withBorder
              p="xs"
              radius="md"
              sx={isCurrentlyActive ? {
                animation: `${pulseBorder} 1.5s infinite`,
                border: '2px solid #FF69B4',
                background: 'rgba(255, 192, 203, 0.05)',
                transform: 'translateZ(0)'
              } : {}}
            >
              <Grid align="center">
                <Grid.Col span={4}>
                  <Group>
                    <Avatar
                      size="md"
                      radius="xl"
                      sx={isCurrentlyActive ? {
                        border: '2px solid #FF69B4',
                        transform: 'scale(1.05)',
                        transition: 'transform 0.3s ease'
                      } : {}}
                    >
                      {(listPlayer.name ?? listPlayer.socketId).substring(0, 2)}
                    </Avatar>
                    <Stack spacing={0}>
                      <Text
                        size="sm"
                        weight={500}
                        sx={isCurrentlyActive ? { color: '#FF69B4' } : {}}
                      >
                        {listPlayer.name}
                        {isCurrentlyActive && ' 🎮'}
                      </Text>
                      {listPlayer.socketId === player.socketId && (
                        <Text color="dimmed" size="xs">
                          ({t("lobby.you")})
                        </Text>
                      )}
                    </Stack>
                  </Group>
                </Grid.Col>
                <Grid.Col span={8}>
                  <Group position="apart">
                    <Group spacing="xs">
                      <Badge variant="outline">{`${t("game.hand_size")}: ${
                        listPlayer.cards.hand.length
                      }`}</Badge>
                      <CardCount
                        count={countEachSuit(listPlayer.cards.area)}
                        filterEmpty
                      />
                    </Group>
                    {game.active.card &&
                      listPlayer.socketId === game.active.playerId && (
                        <ActiveCard card={game.active.card} game={game} />
                      )}
                  </Group>
                </Grid.Col>
              </Grid>
            </Paper>
          )})}
        </Stack>
      </Box>
      {game.active.phase === GamePhase.CARD_REVEAL && activeCard && (
        <CardReveal
          className="play-area over-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 201,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          card={activeCard}
          onFlip={onCardFlip}
        />
      )}
      {isActivePlayer && (
        <Paper
          withBorder
          p="xs"
          radius="md"
          sx={{}}
        >
          <ActiveDecision
            {...{
              game,
              player,
              players,
              onCardPass,
              onCardPeek,
              onCardPredict,
              onGameReset,
            }}
          />
        </Paper>
      )}
    </Stack>
  );
}

export default GameOngoing;

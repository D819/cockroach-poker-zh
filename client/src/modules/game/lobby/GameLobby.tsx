import {
  Game,
  Player
} from "../../../types/game.types";
import {
  GameHandlers
} from "../GamePage";
import {
  Alert,
  Button,
  Card,
  Container,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
  ActionIcon,
  List,
  ThemeIcon,
  Avatar,
  Box,
} from "@mantine/core";
import { FaCrown } from "react-icons/fa";
import { FiAlertCircle, FiCheck, FiCopy, FiX } from "react-icons/fi";
import {
  useTranslation
} from "react-i18next";
import { useState } from "react";

interface Props
  extends Pick <
  GameHandlers,
  "onGameStart" | "onPlayerKick" | "onSettingsUpdate" > {
  game: Game;
  player: Player;
  players: Player[];
}

function GameLobby({
  game,
  onGameStart,
  onPlayerKick,
  player,
  players,
}: Props): JSX.Element {
  const {
    t
  } = useTranslation();
  const [copied, setCopied] = useState(false);
  const isAtMinimumPlayerCount = players.length >= 3;

  const handleCopy = () => {
    const textArea = document.createElement("textarea");
    textArea.value = window.location.href;

    // Prevent scrolling to bottom
    textArea.style.position = "fixed";
    textArea.style.top = "0px";
    textArea.style.left = "0px";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    } catch (err) {
      console.error("Unable to copy", err);
    }

    document.body.removeChild(textArea);
  };

  return (
    <Container size="sm" py="xl" style={{ height: "100%" }}>
      <Card
        shadow="sm"
        p="lg"
        radius="md"
        withBorder
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Stack spacing="md" style={{
          flex: "1 1 auto",
          overflow: "hidden"
        }}>
          <Stack align="center" spacing={5}>
            <Title order={2}>{String(t("lobby.title"))}</Title>
            <Group spacing="xs">
              <Text color="dimmed" size="sm">
                {String(t("lobby.game_id"))}: {game.id}
              </Text>
              <Tooltip
                label={copied ? String(t("lobby.copied")) : String(t("lobby.copy"))}
                withArrow
                position="right"
              >
                <ActionIcon
                  color={copied ? "teal" : "gray"}
                  onClick={handleCopy}
                >
                  {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            </Group>
          </Stack>

          {!isAtMinimumPlayerCount && (
            <Alert
              icon={<FiAlertCircle size={16} />}
              title={String(t("lobby.invite_title"))}
              color="yellow"
            >
              {String(t("lobby.invite_body"))}
            </Alert>
          )}

          <Box style={{
            flex: "1 1 auto",
            overflowY: "auto"
          }}>
            <List spacing="sm" size="sm" center>
              {players.map((p) => (
                <List.Item
                  key={p.socketId}
                  icon={
                    <Avatar size="md" radius="xl">
                      {(p.name ?? p.socketId).substring(0, 2)}
                    </Avatar>
                  }
                >
                  <Group position="apart">
                    <Group>
                      <Text weight={500}>{p.name ?? p.socketId}</Text>
                      {p.socketId === player.socketId && (
                        <Text color="dimmed" size="xs">
                          ({String(t("lobby.you"))})
                        </Text>
                      )}
                      {p.isHost && (
                        <Tooltip label={String(t("lobby.host"))} withArrow>
                          <ThemeIcon
                            color="yellow"
                            variant="light"
                            size="sm"
                            radius="xl"
                          >
                            <FaCrown size={12} />
                          </ThemeIcon>
                        </Tooltip>
                      )}
                    </Group>
                    {player.isHost && p.socketId !== player.socketId && (
                      <ActionIcon
                        color="red"
                        variant="light"
                        onClick={() => onPlayerKick(p.socketId)}
                      >
                        <FiX size={16} />
                      </ActionIcon>
                    )}
                  </Group>
                </List.Item>
              ))}
            </List>
          </Box>
        </Stack>

        <Box mt="md">
          {player.isHost && (
            <Button
              fullWidth
              disabled={!isAtMinimumPlayerCount}
              onClick={onGameStart}
              size="lg"
              uppercase
            >
              {String(t("lobby.start_game"))}
            </Button>
          )}
        </Box>
      </Card>
    </Container>
  );
}

export default GameLobby;

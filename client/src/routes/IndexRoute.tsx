import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Container,
  Image,
  Stack,
  Text,
  Title,
  Alert,
  Group,
  SegmentedControl,
} from "@mantine/core";
import { useSocketAliases } from "../hooks/useSocketAliases";
import { useTranslation } from "react-i18next";
import { FiAlertCircle } from "react-icons/fi";
import { useSocket } from "../socket";
import { ClientEvent } from "../types/event.types";
import usePlayer from "../hooks/usePlayer";

function IndexRoute(): JSX.Element {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { createRoom, isCreatingRoom } = useSocketAliases();
  const [language, setLanguage] = useState(i18n.language);
  const socket = useSocket();
  const player = usePlayer(socket.id, []);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    i18n.changeLanguage(value);
    
    // 如果玩家已经登录，更新语言设置
    if (player.data && player.data.gameId) {
      socket.emit(ClientEvent.UPDATE_PLAYER, player.data.gameId, {
        ...player.data,
        language: value
      });
    }
  };

  const handleCreateRoom = () => {
    createRoom((roomId: string) => {
      navigate(`/game/${roomId}`);
    });
  };

  return (
    <Container
      size="xs"
      py="xl"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Card
        shadow="sm"
        p="lg"
        radius="md"
        withBorder
        style={{
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        <Stack spacing="md" align="center">
          <Box
            style={{
              width: "100%",
              maxWidth: "300px",
              margin: "0 auto",
            }}
          >
            <Image
              src="/assets/text-logo.png"
              alt="Cockroach Poker"
              fit="contain"
            />
          </Box>

          <Title order={1} align="center">
            {String(t("title"))}
          </Title>

          <Text align="center" color="dimmed" size="sm">
            {String(t("tagline"))}
          </Text>

          <Group position="center">
            <SegmentedControl
              value={language}
              onChange={handleLanguageChange}
              data={[
                { label: String(t("english")), value: "en" },
                { label: String(t("chinese")), value: "zh" },
              ]}
            />
          </Group>

          {isCreatingRoom ? (
            <Alert
              icon={<FiAlertCircle size={16} />}
              title={String(t("loading"))}
              color="blue"
            >
              {String(t("loading_info"))}
            </Alert>
          ) : null}

          <Button
            fullWidth
            onClick={handleCreateRoom}
            disabled={isCreatingRoom}
            size="lg"
            uppercase
          >
            {String(t("new_game"))}
          </Button>
        </Stack>
      </Card>
    </Container>
  );
}

export default IndexRoute;

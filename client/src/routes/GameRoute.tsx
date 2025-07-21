import { Navigate, useParams } from "react-router-dom";
import usePlayer from "../hooks/usePlayer";
import GamePage from "../modules/game/GamePage";
import useGame from "../hooks/useGame";
import { GameStatus, Player } from "../types/game.types";
import PlayerNamer from "../ui/atoms/PlayerNamer";
import { useSocket } from "../socket";
import { ClientEvent } from "../types/event.types";
import { useTranslation } from "react-i18next";
import useGameSounds from "../hooks/useGameSounds";
import {
  selectActivePlayer,
  selectIsPredictionCorrect,
} from "../selectors/game-selectors";

function GameRouteContent({ gameId }: { gameId: string }) {
  const player = usePlayer(gameId);
  const game = useGame(gameId);
  const socket = useSocket();
  const { t } = useTranslation();
  const { playPredictionCorrectSound, playPredictionIncorrectSound } =
    useGameSounds();

  if (game.loading) {
    return <p>{String(t("loading"))}</p>;
  }

  if (game.error) {
    return <Navigate to="/" replace />;
  }

  if (game.data?.status === GameStatus.ONGOING && !player.data) {
    return <p>Can't join a game that is underway - sorry</p>;
  }

  if (!player.loading && !player.data?.name) {
    const takenNames = Object.values(game.data?.players ?? {})
      .map((p: Player) => p.name)
      .filter((name): name is string => !!name);
    return (
      <PlayerNamer
        handleSetName={(name) =>
          socket.emit(ClientEvent.JOIN_GAME, gameId, {
            socketId: socket.id,
            name,
            cards: {
              hand: [],
              area: [],
            },
          })
        }
        takenNames={takenNames}
      />
    );
  }

  if (game.data && player.data) {
    return (
      <GamePage
        game={game.data}
        onCardFlip={() => {
          if (!game.data || !player.data) return;

          selectIsPredictionCorrect(game.data)
            ? playPredictionCorrectSound()
            : playPredictionIncorrectSound();

          socket.emit(ClientEvent.RESOLVE_FLIP, game.data.id);
        }}
        onCardPass={(selection) => {
          if (!game.data || !player.data) return;
          const cardPassed = selection.card
            ? selectActivePlayer(game.data).cards.hand.find(
                (card) => card.id === selection.card?.id
              )
            : undefined;
          console.log("ClientEvent.PASS_CARD", ClientEvent.PASS_CARD);
          socket.emit(ClientEvent.PASS_CARD, game.data.id, {
            from: game.data.active.playerId,
            to: selection.playerId,
            claim: selection.claim,
            card: cardPassed,
          });
        }}
        onCardPeek={() => {
          if (!game.data) return;
          socket.emit(ClientEvent.PEEK_AT_CARD, game.data.id);
        }}
        onCardPredict={(prediction) => {
          if (!game.data) return;
          socket.emit(ClientEvent.PREDICT_CARD, game.data.id, prediction);
        }}
        onGameReset={() => {
          game.data && socket.emit(ClientEvent.RESET_GAME, game.data.id);
        }}
        onGameStart={() => {
          game.data && socket.emit(ClientEvent.START_GAME, game.data.id);
        }}
        onPlayerKick={(playerId) => {
          game.data &&
            socket.emit(ClientEvent.KICK_PLAYER, game.data.id, playerId);
        }}
        onSettingsUpdate={(newSettings) => {
          game.data &&
            socket.emit(
              ClientEvent.UPDATE_GAME_SETTINGS,
              game.data.id,
              newSettings
            );
        }}
        players={Object.values(game.data.players)}
        player={player.data}
      />
    );
  }

  return <p>{String(t("loading"))}</p>;
}

export default function GameRoute() {
  const { gameId } = useParams<{ gameId: string }>();

  if (!gameId) {
    return <Navigate to="/" replace />;
  }

  return <GameRouteContent gameId={gameId} />;
}

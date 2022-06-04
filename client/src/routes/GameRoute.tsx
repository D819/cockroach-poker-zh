import { Redirect, useParams } from "react-router-dom";
import PlayerNamer from "../ui/atoms/PlayerNamer";
import GamePage from "../modules/game/GamePage";
import useGame from "../hooks/useGame";
import usePlayer from "../hooks/usePlayer";
import useSocketAliases from "../hooks/useSocketAliases";
import { useSocket } from "../socket";
import { ClientEvent } from "../types/event.types";
import { GameStatus } from "../types/game.types";
import { selectActivePlayer, selectIsPredictionCorrect } from "../selectors/game-selectors";
import useGameSounds from "../hooks/useGameSounds";

function GameRoute(): JSX.Element {
  const { gameId } = useParams<{ gameId: string }>();
  const socket = useSocket();
  const socketAliases = useSocketAliases();
  const { playPredictionCorrectSound, playPredictionIncorrectSound } = useGameSounds();


  const game = useGame(gameId);
  const player = usePlayer(socket.id, socketAliases);

  const takenNames = Object.values(game.data?.players ?? {}).map(
    (player) => player.name ?? player.socketId
  );

  if (game.loading) {
    return <p>Loading...</p>;
  } else if (game.error) {
    return <Redirect to="/" />;
  } else if (game.data?.status === GameStatus.ONGOING && !player.data) {
    return <p>Can't join a game that is underway - sorry</p>;
  } else if (!player.loading && !player.data?.name) {
    return (
      <>
        <p>
          To {player.data?.isHost ? "host" : "join"} the game, please choose a
          player name first:
        </p>
        <PlayerNamer
          handleSetName={(name) => {
            if (player.data) {
              // player is in game, so update
              socket.emit(ClientEvent.UPDATE_PLAYER, gameId, {
                socketId: socket.id,
                name,
                gameId,
                cards: {
                  hand: [],
                  area: [],
                },
              });
            } else {
              // player not in game, so join
              socket.emit(ClientEvent.JOIN_GAME, gameId, {
                socketId: socket.id,
                name,
                gameId,
                cards: {
                  hand: [],
                  area: [],
                },
              });
            }
          }}
          takenNames={takenNames}
        />
      </>
    );
  } else {
    return (
      <>
        {game.loading && <p>Loading...</p>}
        {game.data && player.data && (
          <GamePage
            game={game.data}
            onCardFlip={() => {
              if (!game.data || !player.data) return;

              selectIsPredictionCorrect(game.data)
                ? playPredictionCorrectSound()
                : playPredictionIncorrectSound()
              
              socket.emit(ClientEvent.RESOLVE_FLIP, game.data.id);
            }}
            onCardPass={(selection) => {
              if (!game.data) return;

              const cardPassed = selection.card
                ? selectActivePlayer(game.data).cards.hand.find(
                    (card) => card.suit === selection.card
                  )
                : undefined;

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
        )}
      </>
    );
  }
}

export default GameRoute;

import useSound from "use-sound";
import { AudioEventTrigger, ServerEvent } from "../types/event.types";
import useSocketListener from "./useSocketListener";

// Howler.js: https://github.com/goldfire/howler.js

interface GameSounds {
  playPredictionCorrectSound(): void;
  playPredictionIncorrectSound(): void;
}

export default function useGameSounds(): GameSounds {
  const [playPassSound] = useSound("/assets/audio/pass.mp3");
  const [playPeekSound] = useSound("/assets/audio/peek.mp3");
  const [playPredictSound] = useSound("/assets/audio/predict.mp3");
  const [playPredictionCorrectSound] = useSound(
    "/assets/audio/prediction-correct.mp3"
  );
  const [playPredictionIncorrectSound] = useSound(
    "/assets/audio/prediction-incorrect.mp3"
  );
  const [playPlayerJoinedSound] = useSound(
    "/assets/audio/player-joined.mp3"
  );
  const [playPlayerKickedSound] = useSound(
    "/assets/audio/player-kicked.mp3"
  );

  useSocketListener(ServerEvent.AUDIO_EVENT_TRIGGERED, (audioEventTrigger) => {
    switch (audioEventTrigger) {
      case AudioEventTrigger.PASS:
        return playPassSound();
      case AudioEventTrigger.PEEK:
        return playPeekSound();
      case AudioEventTrigger.PREDICT:
        return playPredictSound();
      case AudioEventTrigger.PLAYER_JOINED:
        return playPlayerJoinedSound();
      case AudioEventTrigger.PLAYER_KICKED:
        return playPlayerKickedSound();
    }
  });

  return {
    playPredictionCorrectSound,
    playPredictionIncorrectSound
  };
}

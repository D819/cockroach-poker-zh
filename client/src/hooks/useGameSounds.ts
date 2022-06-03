import useSound from "use-sound";
import { AudioEventTrigger, ServerEvent } from "../types/event.types";
import useSocketListener from "./useSocketListener";

// Howler.js: https://github.com/goldfire/howler.js

export default function useGameSounds(): void {
  const [playPassSound] = useSound('/assets/audio/pass.mp3');
  const [playPeekSound] = useSound("/assets/audio/peek.mp3");
  const [playPredictSound] = useSound("/assets/audio/predict.mp3");

  useSocketListener(ServerEvent.AUDIO_EVENT_TRIGGERED, (audioEventTrigger) => {
    switch (audioEventTrigger) {
      case AudioEventTrigger.PASS:
        return playPassSound();
      case AudioEventTrigger.PEEK:
        return playPeekSound();
      case AudioEventTrigger.PREDICT:
        return playPredictSound()
    }
  })
}
import useSound from "use-sound";
import { AudioEventTrigger, ServerEvent } from "../types/event.types";
import useSocketListener from "./useSocketListener";


export default function useGameSounds(): void {
  const [playPassSound] = useSound('/assets/pass.wav');
  const [playPeekSound] = useSound("/assets/peek.wav");
  const [playPredictSound] = useSound("/assets/predict.wav");

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
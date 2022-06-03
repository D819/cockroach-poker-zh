import useSound from "use-sound";
import { ServerEvent } from "../types/event.types";
import useSocketListener from "./useSocketListener";


export default function useGameSounds(): void {
  const [playPassSound] = useSound('/assets/pass.wav');
  const [playPeekSound] = useSound("/assets/peek.wav");
  const [playPredictSound] = useSound("/assets/predict.wav");

  useSocketListener(ServerEvent.AUDIO_PASS_TRIGGERED, () => {
    playPassSound();
  }) 

  useSocketListener(ServerEvent.AUDIO_PEEK_TRIGGERED, () => {
    playPeekSound();
  }); 

  useSocketListener(ServerEvent.AUDIO_PREDICT_TRIGGERED, () => {
    playPredictSound();
  }); 
}
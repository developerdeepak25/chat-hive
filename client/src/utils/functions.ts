import soundUrl from "@/assets/audo/pop.mp3";
export const playSound = () => {
  // Create an audio element
  const audio = new Audio(soundUrl);

  // Play the audio
  audio.play();
};

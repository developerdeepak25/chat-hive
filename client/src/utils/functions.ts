import callSound from "@/assets/audio/callTune.mp3";
import notificationSound from "@/assets/audio/notificationTune.mp3";
// export const playSound = () => {
//   // Create an audio element
//   const audio = new Audio(soundUrl);

//   // Play the audio
//   audio.play();
// };

// sound function is modified in association with claude ai
type SoundType = "notification" | "call";

// Create a map of pre-loaded Audio objects
const audioMap: Record<SoundType, HTMLAudioElement> = {
  notification: new Audio(notificationSound),
  call: new Audio(callSound),
};

interface PlaySoundOptions {
  loop?: boolean;
  type?: SoundType;
}

export const playSound = (
  options?: PlaySoundOptions
): HTMLAudioElement | undefined => {
  const { loop = false, type = "notification" } = options || {};

  const audio = audioMap[type];

  if (!audio) {
    console.error(`Invalid sound type: ${type}`);
    return;
  }

  // Reset the audio to the beginning if it's already playing
  audio.currentTime = 0;
  audio.loop = loop;

  // Play the audio and handle any errors
  audio.play().catch((error) => {
    console.error("Error playing audio:", error);
  });

  return audio;
};

// Function to stop a specific sound
export const stopSound = (type: SoundType): void => {
  const audio = audioMap[type];
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
};

//  function to check whether a array has other elems except for the given one ( passed as argument)
export const hasOtherElements = (
  arr: (string | number)[],
  element: string | number
) => {
  if (!arr || !element) return false;
  // Filter the array to get all elements that are not equal to the provided element
  const otherElements = arr.filter((item) => item !== element);

  // If the filtered array has any elements, return true, else return false
  return otherElements.length > 0;
};

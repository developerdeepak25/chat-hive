import soundUrl from "@/assets/audo/pop.mp3";
export const playSound = () => {
  // Create an audio element
  const audio = new Audio(soundUrl);

  // Play the audio
  audio.play();
};

export const hasOtherElements = (
  arr: (string | number)[],
  element: string | number
) => {
  if (!arr || !element) return false
  // Filter the array to get all elements that are not equal to the provided element
  const otherElements = arr.filter((item) => item !== element);

  // If the filtered array has any elements, return true, else return false
  return otherElements.length > 0;
};

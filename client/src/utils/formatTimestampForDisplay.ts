import dayjs from "dayjs";

export const formatTimestampForDisplay = (timestamp:string) => {
  const difference = dayjs().diff(dayjs(timestamp), "day");

  let formattedTime;
  if (difference === 0) {
    formattedTime = dayjs(timestamp).format("hh:mm A");
  } else if (difference === 1) {
    formattedTime = "Yesterday";
  } else if (difference > 1) {
    formattedTime = dayjs(timestamp).format("DD/MM/YY");
  } else {
    formattedTime = "";
  }

  return formattedTime;
};

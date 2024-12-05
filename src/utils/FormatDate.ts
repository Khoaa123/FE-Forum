import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const formatDate = (date: string) => {
  const parsedDate = dayjs(date);

  const formattedDate = parsedDate.format("DD/MM/YYYY HH:mm");
  return formattedDate;
};

export const formatDateLastActivity = (date: string) => {
  const parsedDate = dayjs(date);
  const now = dayjs();

  const diffInMinutes = now.diff(parsedDate, "minute");
  const diffInHours = now.diff(parsedDate, "hour");
  const diffInDays = now.diff(parsedDate, "day");

  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  } else if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  } else {
    return `${diffInDays} ngày trước`;
  }
};

export const calculateTimeDifference = (startTime, endTime) => {
  let date1 = new Date(`1970-01-01T${startTime}:00`);
  let date2 = new Date(`1970-01-01T${endTime}:00`);

  let diff = date2 - date1;

  if (diff < 0) {
    date2.setDate(date2.getDate() + 1);
    diff = date2 - date1;
  }

  let hours = Math.floor(diff / 3600000);
  let minutes = Math.floor((diff % 3600000) / 60000);

  return { hours, minutes };
};

export const calculateTimeDifferenceForReports = (startTime, endTime) => {
  if (startTime && endTime) {
    let date1 = new Date(`1970-01-01T${startTime}:00`);
    let date2 = new Date(`1970-01-01T${endTime}:00`);

    let diff = date2 - date1;

    if (diff < 0) {
      date2.setDate(date2.getDate() + 1);
      diff = date2 - date1;
    }

    let hours = Math.floor(diff / 3600000);
    let minutes = Math.floor((diff % 3600000) / 60000);

    return `${hours}h ${minutes}m`;
  }
};

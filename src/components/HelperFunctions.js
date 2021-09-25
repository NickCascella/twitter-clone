const formatDate = (format) => {
  const date = new Date();
  let weekday = date.getDay();
  switch (weekday) {
    case 0:
      weekday = "Sun";
      break;
    case 1:
      weekday = "Mon";
      break;
    case 2:
      weekday = "Tue";
      break;
    case 3:
      weekday = "Wed";
      break;
    case 4:
      weekday = "Thur";
      break;
    case 5:
      weekday = "Fri";
      break;
    case 6:
      weekday = "Sat";
      break;
    default:
      weekday = "Cannot get date";
  }
  let month = date.getMonth();
  switch (month) {
    case 0:
      month = "Jan";
      break;
    case 1:
      month = "Feb";
      break;
    case 2:
      month = "Mar";
      break;
    case 3:
      month = "Apr";
      break;
    case 4:
      month = "May";
      break;
    case 5:
      month = "Jun";
      break;
    case 6:
      month = "Jul";
      break;
    case 7:
      month = "Aug";
      break;
    case 8:
      month = "Sep";
      break;
    case 9:
      month = "Oct";
      break;
    case 10:
      month = "Nov";
      break;
    case 11:
      month = "Dec";
      break;
    default:
      month = "N/A";
  }
  if (format === "Standard") {
    return `${weekday} ${month} ${date.getDate()}`;
  } else {
    return `Joined ${month} ${date.getFullYear()}`;
  }
};

export { formatDate };

// Time formatter hh:mm PM EST
export function formatToEST(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/New_York'
  }).format(date);
}

export function getCurrentESTTime() {
  // Get the current time in HH:MM:SS format in EST
  const timeOptions = { 
    timeZone: "America/New_York", 
    hour: "2-digit", 
    minute: "2-digit", 
    second: "2-digit", 
    hour12: false 
  };

  const timeFormatter = new Intl.DateTimeFormat("en-CA", timeOptions);
  const timeParts = timeFormatter.formatToParts(new Date());

  // Extract hours, minutes, and seconds
  const hours = timeParts.find(part => part.type === "hour").value.padStart(2, "0");
  const minutes = timeParts.find(part => part.type === "minute").value.padStart(2, "0");
  const seconds = timeParts.find(part => part.type === "second").value.padStart(2, "0");

  // Construct the fixed date with extracted time in ISO format
  const estISOTime = `1900-01-01T${hours}:${minutes}:${seconds}Z`;

  return estISOTime; // Example Output: "1900-01-01T20:00:00Z"
}

export function parseTimeToDate(timeString) {
  const [time, period] = timeString.split(" ");
  const [hours, minutes, seconds] = time.split(":").map(num => parseInt(num) || 0);

  let hours24 = hours % 12; // Convert 12-hour to 24-hour format
  if (period.toUpperCase() === "PM") hours24 += 12;

  // Create a Date object with today's date and the given time
  const date = new Date();
  date.setHours(hours24, minutes, seconds, 0);

  return date;
}

export function getCurrentESTDate() {

  // Check if game has started (compare gameDate with today)
  const options = { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" };
  const formatter = new Intl.DateTimeFormat("en-CA", options); // "en-CA" ensures YYYY-MM-DD format
  const parts = formatter.formatToParts(new Date());
  const currentDateEST = `${parts[0].value}-${parts[2].value}-${parts[4].value}`;

  return currentDateEST
}

export function toDateTime(dateStr, timeStr) {

  // Extract the time part from the ISO string
  const time = new Date(timeStr).toISOString().split("T")[1]; // "20:00:00Z"
  
  // Convert to a single DateTime string
  const combinedDateTimeStr = `${dateStr}T${time}`;
  const combinedDateTime = new Date(combinedDateTimeStr);

  // Timestamp for comparison
  const timestamp = combinedDateTime.getTime();

  return timestamp;
}
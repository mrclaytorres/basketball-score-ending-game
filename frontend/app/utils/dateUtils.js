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
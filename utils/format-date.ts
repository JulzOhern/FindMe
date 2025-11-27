import { format, formatDistanceToNow, differenceInYears } from 'date-fns';

export function formatSmartDate(date: Date | string) {
  const d = new Date(date);

  // Check if it's 1 year or more ago
  const yearsAgo = differenceInYears(new Date(), d);

  if (yearsAgo >= 1) {
    // Show full date
    return format(d, 'MM/dd/yyyy'); // e.g., 07/04/2002
  } else {
    // Show relative time
    return formatDistanceToNow(d, { addSuffix: true }); // e.g., "3 months ago"
  }
}
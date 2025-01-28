import { format } from "date-fns";

// Utility Functions
export const formatDeadline = (
  deadline: { seconds: number; nanoseconds: number } | null
): string => {
  if (!deadline || typeof deadline.seconds !== "number") {
    return "No deadline";
  }
  const date = new Date(deadline.seconds * 1000);
  return format(date, "dd MMM yyyy");
};

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

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    // Use the Clipboard API to copy text
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error("Failed to copy text to clipboard:", error);
  }
};

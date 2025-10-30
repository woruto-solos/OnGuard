
export const sanitizeMessage = (text: string): string => {
  let sanitizedText = text;

  // Remove email addresses
  sanitizedText = sanitizedText.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[email redacted]');

  // Remove URLs
  sanitizedText = sanitizedText.replace(/(https?:\/\/[^\s]+)/g, '[link redacted]');

  // Remove phone numbers (basic patterns)
  sanitizedText = sanitizedText.replace(/(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g, '[phone number redacted]');

  return sanitizedText;
};

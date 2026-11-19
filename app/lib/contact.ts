// Contact form rules, shared by the form (instant feedback) and the API route (the check that counts).

export type ContactInput = { name: string; email: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

// One "@", a dotted domain with a 2+ letter TLD, no spaces, no leading/trailing or doubled dots.
const EMAIL_RE =
  /^(?!\.)(?!.*\.\.)[A-Za-z0-9._%+'-]+(?<!\.)@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/;

export const LIMITS = { name: 100, email: 254, message: 5000, messageMin: 10 };

export function isValidEmail(email: string) {
  return email.length <= LIMITS.email && EMAIL_RE.test(email);
}

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  if (!name) errors.name = "Please enter your name.";
  else if (name.length > LIMITS.name) errors.name = `Keep your name under ${LIMITS.name} characters.`;
  if (!email) errors.email = "Please enter your email address.";
  else if (!isValidEmail(email)) errors.email = "That doesn’t look like a valid email address.";
  if (message.length < LIMITS.messageMin) errors.message = `Please write at least ${LIMITS.messageMin} characters.`;
  else if (message.length > LIMITS.message) errors.message = `Keep it under ${LIMITS.message} characters.`;
  return errors;
}

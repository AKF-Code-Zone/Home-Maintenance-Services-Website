export const regEmailTest = (data) => {
  // Step 1: Validate type and sanitize base cases
  if (typeof data !== "string") return 0;
 
  // Step 2: Trim whitespace and normalize
  const email = data.trim().toLowerCase();
 
  // Step 3: Basic checks
  if (email.length === 0 || email.length > 250) {
    // Reject empty or overly long emails
    return 0;
  }
 
  /**
   * Step 4: Practical email validation pattern (RFC 5322-inspired)
   * - Local part: letters, digits, dots, underscores, and hyphens
   * - Domain: allows subdomains
   * - TLD: at least two letters
   * - No consecutive dots or leading/trailing dots
   */
  const emailPattern =
    /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,63}[a-zA-Z0-9])?@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[A-Za-z]{2,}$/i;
 
  // Step 5: Apply pattern test and return result
  return emailPattern.test(email) ? 1 : 0;
};
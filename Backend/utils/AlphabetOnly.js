/**
 * Validates whether the input is a valid alphabetic name.
 * Only letters and a single space between words are allowed.
 * 
 * @param {any} data - User-provided name input.
 * @returns {number} - 1 if valid name, 0 if invalid.
 */
 
const AlphabetOnly = (data) => {
    // Ensure input is a string
    if (typeof data !== "string") return 0;
 
    // Trim and normalize
    const name = data.trim();
 
    /**
     * Regex Explanation
     * ^[A-Za-z]+            → must start with letters only
     * (?:\s[A-Za-z]+)?$     → allows only one space and another word (optional)
     * No digits, no multiple spaces, no symbols
     * Examples: "Abo", "Abo Bakar"
     */
    const namePattern = /^[A-Za-z]+(?:\s[A-Za-z]+)?$/;
 
    // Step 5: Validate pattern
    return namePattern.test(name) ? 1 : 0;
};
 
export default AlphabetOnly;
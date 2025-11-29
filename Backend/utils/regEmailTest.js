/* File: regEmailTest.js located in Backend/utils/ */

/**
 * Validates an email format according to standard patterns.
 * 
 * @param {any} data - User-provided email input.
 * @returns {number} - 1 if valid email, 0 if invalid.
 */
const regEmailTest = (data) => {
    if (typeof data !== "string") return 0;

    const email = data.trim().toLowerCase();

    if (email.length === 0 || email.length > 250) return 0;

    const emailPattern =
        /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,63}[a-zA-Z0-9])?@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[A-Za-z]{2,}$/i;

    return emailPattern.test(email) ? 1 : 0;
};

export default regEmailTest;

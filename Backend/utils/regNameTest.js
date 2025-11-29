/* File: regNameTest.js located in Backend/utils/ */

/**
 * Validates if a name contains only letters and at most one space.
 * 
 * @param {any} data - User-provided name.
 * @returns {number} - 1 if valid, 0 if invalid.
 */
const regNameTest = (data) => {
    if (typeof data !== "string") return 0;

    const name = data.trim();
    const namePattern = /^[A-Za-z]+(?:\s[A-Za-z]+)?$/;

    return namePattern.test(name) ? 1 : 0;
};

export default regNameTest;

/* File: charLength.js located in Backend/utils/ */

/**
 * Checks if the given string's length falls within a defined range.
 * 
 * @param {any} data - Input value.
 * @param {number} min - Minimum length allowed.
 * @param {number} max - Maximum length allowed.
 * @returns {number} - 1 if within range, 0 otherwise.
 */
const charLength = (data, min, max) => {
    if (data === null || data === undefined) return 0;

    const str = String(data).trim();

    if (typeof min !== "number" || typeof max !== "number" || min < 0 || max < min) {
        console.error("Invalid min or max values passed to charLength()");
        return 0;
    }

    const len = str.length;
    return len >= min && len <= max ? 1 : 0;
};

export default charLength;

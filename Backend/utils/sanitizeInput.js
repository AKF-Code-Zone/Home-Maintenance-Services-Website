/* File: sanitizeInput.js located in Backend/utils/ */

/**
 * Recursively sanitizes any type of input.
 * Removes scripts, dangerous patterns, and escapes HTML.
 * 
 * @param {any} input - Any user input (string, object, array).
 * @returns {any} - Sanitized safe value.
 */
const sanitizeInput = (input) => {
    if (input === null || input === undefined) return "";

    if (typeof input === "number" || typeof input === "boolean") return input;

    if (Array.isArray(input)) {
        return input.map((item) => sanitizeInput(item));
    }

    if (typeof input === "object") {
        const sanitizedObject = {};
        for (const key in input) {
            if (Object.prototype.hasOwnProperty.call(input, key)) {
                sanitizedObject[key] = sanitizeInput(input[key]);
            }
        }
        return sanitizedObject;
    }

    if (typeof input === "string") {
        let sanitized = input.trim();

        const blacklistPatterns = [
            /<script.*?>.*?<\/script>/gi,
            /javascript:/gi,
            /on\w+=".*?"/gi,
            /--/g,
            /;/g,
        ];

        blacklistPatterns.forEach((pattern) => {
            sanitized = sanitized.replace(pattern, "");
        });

        sanitized = sanitized
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "'")
            .replace(/\\/g, "");

        return sanitized;
    }

    return String(input);
};

export default sanitizeInput;

export const sanitizeInput = (input) => {
    // --- Handle null or undefined safely
    // convert null and undefined to string-null
    if (input === null || input === undefined) return "";
 
    // --- Handle primitive types (numbers, strings, booleans)
    // return them as they are, because they are save
    if (typeof input === "number") return input;
    if (typeof input === "boolean") return input;
 
    // --- Recursively sanitize arrays
    // again and again call this function for each element of array
    if (Array.isArray(input)) {
        return input.map((item) => sanitizeInput(item));
    }
 
    // --- Recursively sanitize objects
    // again and again call this function for each field of object
    if (typeof input === "object") {
        const sanitizedObject = {};
        for (const key in input) {
            if (Object.prototype.hasOwnProperty.call(input, key)) {
                sanitizedObject[key] = sanitizeInput(input[key]);
            }
        }
        return sanitizedObject;
    }
 
    // --- Handle strings safely
    // detect string-characters and convert them to save-character if needed.
    if (typeof input === "string") {
        let sanitized = input.trim();
 
        // Remove risky patterns (script tags, event handlers, SQL-like input)
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
 
        // Escape special HTML entities
        sanitized = sanitized
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "'")
            .replace(/\\/g, "");
 
        return sanitized;
    }
 
    // --- Fallback: Convert anything else to string ---
    return String(input);
};
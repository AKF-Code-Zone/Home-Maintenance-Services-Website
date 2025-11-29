export const charLength = (data, min, max) => {
    // Step 1: Ensure data is a string (convert safely)
    if (data === null || data === undefined) return 0;
 
    const str = String(data).trim();
 
    // Step 2: Validate that min and max are numbers
    if (typeof min !== "number" || typeof max !== "number" || min < 0 || max < min) {
        console.error("Invalid min or max values passed to charLength()");
        return 0;
    }
 
    // Step 3: Check length boundaries
    const len = str.length;
 
    return len >= min && len <= max ? 1 : 0;
};
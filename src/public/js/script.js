/**
 * Copies the given text to the clipboard.
 * @param {string} text - The text to copy.
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (error) {
        console.error(error.message);
    }
}

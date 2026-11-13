/**
 * Logs the time in milliseconds it takes to execute a function, capturing the return value
 * 
 * @param {string} msg - The message that should be added to the beginning of the log.
 * @param {Function} f - The called function.
 * @returns {Any} The return value of the passed function.
 */
export function logTime(msg, f) {
    const t = performance.now();
    const result = f();
    console.log(`${msg}: ${performance.now() - t}ms`);

    return result;
}
/**
 * Utility function to chunk an array into smaller arrays
 * @param arr - The array to chunk
 * @param size - The size of each chunk
 * @returns Array of chunked arrays
 */
export function chunkArray<T>(arr: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
    );
}

/**
 * Utility function to generate a random integer between min and max
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (exclusive)
 * @returns Random integer between min and max
 */
export function getRandomInt(min: number, max: number): number {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled)) + minCeiled;
}

/**
 * Helper function for any `THREE.Loader` to load async.
 *
 * Ignores the onProgress callback
 * @param {string} url The url to get
 */
export declare function loadAync(url: string): Promise<any>;
export declare function maybeToArray<T>(maybe: T | T[]): T[];

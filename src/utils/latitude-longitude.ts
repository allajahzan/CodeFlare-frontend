/**
 * Retrieves the latitude and longitude of the user's current location.
 *
 * @returns {Promise} A promise that resolves to an object containing the latitude and longitude of the user's current location.
 * @throws {Error} If the browser does not support geolocation, or if the user refuses to share their location.
 */
export const getLatitudeAndLongitude = (): Promise<{
    latitude: number;
    longitude: number;
}> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by this browser."));
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                resolve({ latitude, longitude });
            },
            () => {
                reject(new Error("Failed to get user location."));
            }
        );
    });
};

/**
 * Given a latitude and longitude, returns a human-readable string
 * representing the location.
 * @param latitude The latitude of the location.
 * @param longitude The longitude of the location.
 * @returns A string representing the location.
 */
export const getReadableLocation = async (
    latitude: number,
    longitude: number
): Promise<string> => {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
    );

    if (!response.ok) throw new Error("Failed to fetch location data.");

    const data = await response.json();

    return data.display_name;
};

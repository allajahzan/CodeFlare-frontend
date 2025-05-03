import { getLatitudeAndLongitude } from "@/utils/latitude-longitude";
import { getReadableLocation } from "@/utils/readable-location";
import axios from "axios";
import { useEffect, useState } from "react";
import weatherImg from "@/assets/images/weather.png"

// Weather card Component
function WeatherCard() {
    const [weather, setWeather] = useState<{
        text: string;
        windSpeed: string;
        humidity: string;
    }>({ text: "", windSpeed: "", humidity: "" });

    // Fetch weather
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const { latitude, longitude } = await getLatitudeAndLongitude(); // Get latitude and longitude

                // Get readable location
                const location = await getReadableLocation(latitude, longitude);

                // Send request
                const resp = await axios.get(
                    `http://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_WEATHER_API_KEY
                    }&q=${location}&aqi=yes`
                );

                // Success response
                if (resp.status === 200) {
                    const data = resp.data;

                    setWeather({
                        text: data.current.condition.text,
                        windSpeed: data.current.wind_kph,
                        humidity: data.current.humidity,
                    });
                }
            } catch (error) {
                console.error("Weather fetch error:", error);
                return null;
            }
        };

        fetchWeather();
    }, []);

    return (
        <div className="flex items-center">
            <img className="h-20 w-20" src={weatherImg} alt="" />
            <p>{weather.text}</p>
        </div>
    );
}

export default WeatherCard;

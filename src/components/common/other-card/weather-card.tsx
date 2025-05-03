import { getLatitudeAndLongitude } from "@/utils/latitude-longitude";
import { getReadableLocation } from "@/utils/readable-location";
import axios from "axios";
import { useEffect, useState } from "react";
import weatherImg from "@/assets/images/weather.png";
import { motion } from "framer-motion";
import { Loader, MapPin } from "lucide-react";
import CardHeader from "../data-toolbar/header";

// Weather card Component
function WeatherCard() {
    const [weather, setWeather] = useState<{
        text: string;
        location: string;
        celcius: string;
    } | null>(null);

    // Fetch weather
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const { latitude, longitude } = await getLatitudeAndLongitude();
                const location = await getReadableLocation(latitude, longitude);

                const resp = await axios.get(
                    `http://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_WEATHER_API_KEY
                    }&q=${location}&aqi=yes`
                );

                if (resp.status === 200) {
                    const data = resp.data;

                    setWeather({
                        text: data.current.condition.text,
                        location: data.location.name,
                        celcius: data.current.temp_c,
                    });
                }
            } catch (error) {
                console.error("Weather fetch error:", error);
            }
        };

        fetchWeather();
    }, []);

    if (!weather)
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader className="w-5 h-5 animate-spin text-foreground" />
            </div>
        );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full flex flex-col justify-between"
        >
            <CardHeader heading="Weather" />
            <div className="flex items-start gap-2">
                <img className="self-start w-16 h-16 object-contain" src={weatherImg} />

                <div className="h-full flex flex-col justify-between">
                    <p className="font-bold text-3xl text-foreground">
                        {weather.celcius}
                        <sup className="text-xl font-medium">°C</sup>
                    </p>
                    <p className="font-semibold text-sm capitalize text-foreground">
                        {weather.text.split(" ").filter((_,i)=>i<=1).join(" ")}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 flex-shrink-0 text-foreground" />
                <p className="font-medium text-foreground">{weather.location}</p>
            </div>
        </motion.div>
    );
}

export default WeatherCard;

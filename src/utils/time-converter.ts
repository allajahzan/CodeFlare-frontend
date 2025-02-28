// Time converter
export const convertTo12HourFormat = (time: string) => {
    const [hours, minutes] = time.split(":"); 
    return new Date(0, 0, 0, Number(hours), Number(minutes))
        .toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};


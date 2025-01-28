function Wings() {
    return (
        <div>
            <div
                className={`absolute w-[20%] h-full transition-all duration-300 left-[0%] transform -translate-x-[50%] bg-black bg-opacity-5 rounded-tr-[300%] z-[0] 
                    animate-slideUp`}
            ></div>

            <div
                className={`absolute w-[20%] h-full transition-all duration-300 right-[0%] transform translate-x-[50%] bg-black bg-opacity-5 rounded-tl-[300%] z-[0] 
                animate-slideUp`}
            ></div>
        </div>
    );
}

export default Wings;

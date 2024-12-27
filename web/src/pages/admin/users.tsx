import image from "../../assets/images/allaj.jpeg";

function Admins() {
    return (
        <div className="grid grid-cols-3 gap-4 p-5">
            {/* admins list  */}
            <div className="p-5 w-full h-[calc(100vh-322px)] md:h-[calc(100vh-130px)] bg-white rounded-2xl shadow-custom">
                <div className="flex flex-col items-center">
                    <div>
                        <input type="search" />
                    </div>
                    <div className="p-3 w-full h-[80px] flex gap-2 items-center">
                        <div className="flex flex-shrink-0">
                            <img
                                className="rounded-full h-14 w-14 object-cover"
                                src={image}
                                alt=""
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="font-medium text-base">Ahsan allaj pk</p>
                            <p className="text-zinc-400 text-xs">Added on 12th june 2024</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admins;

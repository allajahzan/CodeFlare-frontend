import { useEffect } from "react";
import { Copyright, Mail } from "lucide-react";

function Login() {
    useEffect(() => { }, []);

    return (
        <div
            id="allaj"
            key={1}
            className="h-screen w-full flex flex-col items-center justify-between"
        >
            <div className="p-5 flex flex-col items-center justify-center gap-5">
                {/* <img className='w-40' src={logo} alt="" /> */}
                <h1
                    style={{ fontFamily: '"Dancing Script", cursive' }}
                    className="text-3xl"
                >
                    CodeFlare
                </h1>
                {/* <p className='text-sm font-extrabold'>Igniting passion and excellence in coding</p> */}
            </div>
            <div className="flex flex-col 2 items-center justify-center space-y-6 relative -top-10 w-full px-5">
                <p className="font-extrabold tracking-wider text-lg">Student login</p>
                <form
                    action=""
                    className="w-full sm:w-[400px] relative flex flex-col space-y-4 transition-all duration-300 ease-in-out"
                >
                    <div className="flex relative items-center">
                        <Mail className="absolute left-3 top-3"/>
                        <input
                            type="text"
                            placeholder="Email"
                            className="font-extrabold p-3 pl-14 px-4 w-full rounded-lg border-2 border-black border-opacity-10 outline-none"
                        />
                    </div>
                    <button className="w-full p-3 px-8 rounded-md bg-black text-white shadow-lg font-extrabold tracking-wider">
                        Login
                    </button>
                </form>
            </div>
            <div className="p-2 pb-5 sm:p-5 flex items-center gap-2">
                <Copyright className="w-5 h-5" />
                <p className="font-extrabold tracking-wide text-sm text-center">
                    CodeFlare | 2025
                </p>
            </div>
        </div>
    );
}

export default Login;

import { useEffect, useState } from "react";

function Login() {

    const [style, setStyle] = useState<React.CSSProperties>({})
    const [toggle, setToggle] = useState<boolean>(false)

    useEffect(()=>{
        setStyle({
            height : toggle? '100px' : '0px',
            width : toggle? '100px' : '0px',
            transform : toggle? 'translate(0%)' : 'translate(-500%)',
            transition: 'all .3s ease-in-out'
        })
    },[toggle])

    const handle = ()=>{
        setToggle(!toggle)
    }

    return (
        <div
            id="allaj"
            key={1}
            className="h-screen w-full flex flex-col items-center justify-between"
        >
            <div onClick={handle} className="p-5 flex flex-col items-center justify-center gap-5">
                {/* <img className='w-40' src={logo} alt="" /> */}
                <em className="text-xl font-medium">
                    CodeFlare
                </em>
                {/* <p className='text-sm font-extrabold'>Igniting passion and excellence in coding</p> */}
            </div> 
            <div className="flex flex-col 2 items-center justify-center space-y-6 relative w-full px-5 h-full">
               <div style={style} className="bg-black">
                
               </div>
            </div>
            <div className="p-2 pb-5 sm:p-5 flex items-center gap-2">
                <p>Copyright | </p>
                <p className="text-center">
                    CodeFlare | 2025
                </p>
            </div>
        </div>
    );
}

export default Login;

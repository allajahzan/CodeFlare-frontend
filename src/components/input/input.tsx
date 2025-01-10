interface PropsType {
    id: string;
    type: string;
    label: string;
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    color?: string;
}

function Input({ id, input, setInput, label, type, color }: PropsType) {
    const style: React.CSSProperties = {
        color: color,
    };

    return (
        <div className="relative w-full">
            <input
                onChange={(event) => setInput(event.target.value)}
                value={input}
                type={type}
                id={id}
                className="block p-5 pb-2 px-0 w-full text-black text-base font-medium bg-transparent focus:outline-none border-b-[1px]"
                placeholder=" "
                autoComplete="off"
                required
            />
            <label
                style={style}
                htmlFor={id}
                className="absolute cursor-text text-sm font-medium text-muted-foreground top-0 left-0 transition-all duration-300"
            >
                {label}
            </label>
        </div>
    );
}

export default Input;

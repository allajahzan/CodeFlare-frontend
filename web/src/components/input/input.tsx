interface Type {
    id: string;
    type: string;
    label: string;
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    color?: string;
}

function Input({ id, input, setInput, label, type, color }: Type) {
    const style: React.CSSProperties = {
        color: color,
    };

    return (
        <div className="relative w-full">
            <input
                style={{
                    ...style,
                    borderBottomWidth: "1px",
                    borderColor: color,
                    borderStyle: "solid",
                }}
                onChange={(event) => setInput(event.target.value)}
                value={input}
                type={type}
                id={id}
                className="block p-6 pb-2 px-0 w-full font-medium bg-transparent focus:outline-none peer"
                placeholder=" "
                autoComplete="off"
                required
            />
            <label
                style={style}
                htmlFor={id}
                className="absolute cursor-text font-medium text-zinc-400 top-0 left-0 transition-all duration-300"
            >
                {label}
            </label>
        </div>
    );
}

export default Input;

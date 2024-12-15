interface propType {
    text: string;
    className: string;
}

function Heading({ text, className }: propType) {
    return (
        <div className="flex items-center">
            <p className={className}>{text}</p>
        </div>
    );
}

export default Heading;

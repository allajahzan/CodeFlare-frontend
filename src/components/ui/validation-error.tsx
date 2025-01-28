// Interface for Props
interface PropsType {
    message: string;
}

// Validation error Component
function ValidationError({ message }: PropsType) {
    return <p className="text-xs text-red-600 font-semibold">{message}</p>;
}

export default ValidationError;

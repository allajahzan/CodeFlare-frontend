import { useSelector } from "react-redux";
import { stateType } from "../../../redux/store";
interface propTypes {
    image: JSX.Element;
    text: string;
    handleSideBarItems?: (event: React.MouseEvent<HTMLLIElement>) => void;
    color?: string;
}

function SideBarItem({ image, text, handleSideBarItems, color }: propTypes) {
    const isShrinkSideBarStudent = useSelector(
        (state: stateType) => state.isShrinkSideBarStudent
    );

    return (
        <li
            title={isShrinkSideBarStudent ? text : ""}
            onClick={handleSideBarItems}
            className={`${color === "" ? "" : color
                } hover:bg-gray-100 cursor-pointer`}
        >
            <div className={`flex items-center gap-4 p-2`}>
                <div>{image}</div>
                {!isShrinkSideBarStudent && (
                    <p
                        style={{ position: "relative", top: "1.5px" }}
                        className="font-extrabold tracking-wide text-nowrap"
                    >
                        {text}
                    </p>
                )}
            </div>
        </li>
    );
}

export default SideBarItem;

import { useContext, useEffect, useState } from "react";
import { IUserContext, UserContext } from "@/context/user-context";
import { IBatch } from "../admin/batch/batches";
import { Loader2, ScanEye, UsersRound } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { fetchData } from "@/service/api-service";
import ApiEndpoints from "@/constants/api-endpoints";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import { handleCustomError } from "@/utils/error";
import { IStudent } from "@/types/student";

// Interface for Props
interface PropsType {
    view: "table-view" | "calender-view";
    setView: React.Dispatch<React.SetStateAction<"table-view" | "calender-view">>;
}

// Filter students
function FilterAttendence({ view, setView }: PropsType) {
    // State to store the selected batch
    const [selectedBatch, setSelectedBatch] = useState<IBatch | null>(null);

    // Studebt related states
    const [students, setStudents] = useState<IStudent[] | []>([]);
    const [fetchingStudents, setFetchingStudents] = useState<boolean>(false);
    const [selectedStudent, setSelectedStudent] = useState<string>("");

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // Fetch students based on batch
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Clear states
                setFetchingStudents(true);
                setStudents([]);
                setSelectedStudent("");

                // Fetch data
                const resp = await fetchData(
                    ApiEndpoints.SEARCH_USER +
                    `?category=student&batchId=${selectedBatch?._id}`,
                    role
                );

                if (resp?.status === 200) {
                    setStudents(resp.data.data); // Update students list
                }
            } catch (err) {
                handleCustomError(err);
            } finally {
                setFetchingStudents(false); // Always set fetching to false after request
            }
        };

        if (selectedBatch) fetchUsers();
    }, [selectedBatch]);

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 p-5 pb-0">
            {/* Select a batch */}
            <div className="relative w-full">
                <Select
                    key={"batches"}
                    required
                    value={selectedBatch?._id || ""}
                    onValueChange={(value) => {
                        const batch = user?.batches?.find((b) => b._id === value);
                        setSelectedBatch(batch || null);
                    }}
                >
                    <SelectTrigger
                        id="batches"
                        className="text-foreground font-medium p-5 pl-9 relative w-full bg-background"
                    >
                        <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                        {user?.batches?.map((batch) => (
                            <SelectItem key={batch._id} value={batch._id}>
                                {batch.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <UsersRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
            </div>

            {/* Select a student */}
            <div className="relative w-full">
                <Select
                    key="students"
                    required
                    disabled={!students.length || fetchingStudents}
                    value={selectedStudent}
                    onValueChange={(value) => {
                        setSelectedStudent(value);
                    }}
                >
                    {/* Select Trigger */}
                    <SelectTrigger
                        id="students"
                        className="text-foreground font-medium p-5 pl-9 relative bg-background"
                    >
                        <SelectValue
                            placeholder={
                                fetchingStudents
                                    ? "Fetching students..."
                                    : students.length === 0
                                        ? "No students available"
                                        : "Select student"
                            }
                            className="relative transition-opacity duration-200"
                        />
                    </SelectTrigger>

                    {/* Student List */}
                    {!fetchingStudents && students.length > 0 && (
                        <SelectContent className="max-h-[200px]">
                            {students.map((student) => (
                                <SelectItem key={student._id} value={student._id}>
                                    {student.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    )}
                </Select>

                {/* Loader Icon */}
                {fetchingStudents && (
                    <Loader2 className="w-4 h-4 absolute left-3 top-[13px] text-foreground animate-spin" />
                )}

                {/* Default User Icon (Only Show When Not Fetching) */}
                {!fetchingStudents && (
                    <UsersRound className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                )}
            </div>

            {/* Select a batch */}
            <div className="relative w-full sm:col-span-2 lg:col-span-1">
                <Select 
                    key={"batches"}
                    required
                    value={view}
                    onValueChange={(value: "calender-view" | "table-view") => {
                        setView(value);
                    }}
                >
                    <SelectTrigger
                        id="batches"
                        className="text-foreground font-medium p-5 pl-9 relative w-full bg-background"
                    >
                        <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                        <SelectItem value={"calender-view"}>Calender view</SelectItem>
                        <SelectItem value={"table-view"}>Table view</SelectItem>
                    </SelectContent>
                </Select>

                <ScanEye className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
            </div>
        </div>
    );
}

export default FilterAttendence;

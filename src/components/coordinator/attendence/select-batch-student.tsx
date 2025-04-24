import { useContext } from "react";
import { IUserContext, UserContext } from "@/context/user-context";
import { Loader2, School, UsersRound, X } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { IStudent } from "@/types/student";
import { IBatch } from "@/types/batch";

// Interface for Props
interface propsType {
    selectedBatch: IBatch | null;
    setSelectedBatch: React.Dispatch<React.SetStateAction<IBatch | null>>;
    selectedStudent: string | "";
    setSelectedStudent: React.Dispatch<React.SetStateAction<string | "">>;
    students: [] | IStudent[];
    setStudents: React.Dispatch<React.SetStateAction<[] | IStudent[]>>;
    fetchingStudents: boolean;
}

// Selects batch student Component
function SelectBatchStudent({
    selectedBatch,
    setSelectedBatch,
    selectedStudent,
    setSelectedStudent,
    setStudents,
    students,
    fetchingStudents,
}: propsType) {
    // Student related states

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    return (
        <div className="w-full grid grid-cols-1 p-0">
            {/* Select a batch */}
            <div className="relative w-full">
                <Select
                    key={"batches"}
                    required
                    value={selectedBatch?._id || ""}
                    onValueChange={(value) => {
                        const batch = user?.batches?.find((b) => b._id === value);
                        setSelectedBatch((prevBatch: IBatch | null) =>
                            prevBatch !== batch ? (batch as IBatch) : null
                        );
                    }}
                >
                    <SelectTrigger
                        id="batches"
                        className="text-foreground font-medium p-4 pl-9 relative w-full bg-transparent shadow-none hover:bg-muted border-none"
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

                <School className="w-4 h-4 absolute left-3 top-[9px] text-muted-foreground" />
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
                        className="text-foreground font-medium p-4 pl-9 relative bg-transparent shadow-none hover:bg-muted border-none"
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
                    <Loader2 className="w-4 h-4 absolute left-3 top-[9px] text-foreground animate-spin" />
                )}

                {/* Default User Icon (Only Show When Not Fetching) */}
                {!fetchingStudents && (
                    <UsersRound className="w-4 h-4 absolute left-3 top-[9px] text-muted-foreground" />
                )}
            </div>

            {/* Clear */}
            <div className="relative w-full">
                <div
                    onClick={() => {
                        setSelectedBatch(null);
                        setSelectedStudent("");
                        setStudents([]);
                    }}
                    className="text-foreground font-medium p-2 pl-9 relative w-full bg-transparent shadow-none hover:bg-muted border-none rounded-lg"
                >
                    <p>Clear</p>
                </div>

                <X className="w-4 h-4 absolute left-3 top-[10px] text-muted-foreground" />
            </div>
        </div>
    );
}

export default SelectBatchStudent;

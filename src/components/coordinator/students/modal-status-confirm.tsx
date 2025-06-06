import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ApiEndpoints from "@/constants/api-endpoints";
import { toast } from "@/hooks/use-toast";
import { stateType } from "@/redux/store";
import { updateData } from "@/service/api-service";
import { IStudent } from "@/types/IStudent";
import { IStudentCategory, IUser } from "@codeflare/common";
import { FileSpreadsheetIcon, Loader2 } from "lucide-react";
import { ReactNode, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";

// Interface for Props
interface PropsType {
  studentId: string;
  student: IStudent;
  setStudents: React.Dispatch<React.SetStateAction<[] | IStudent[]>>;
  setSelectedStudent: React.Dispatch<
    React.SetStateAction<IStudent | IUser | null>
  >;
  category: string;
  selectedCategory: IStudentCategory;
  children: ReactNode;
}

// Status confirm modal Component
function StatusConfirmModal({
  studentId,
  student,
  setStudents,
  setSelectedStudent,
  category,
  selectedCategory,
  children,
}: PropsType) {
  // Modal state
  const [open, setOpen] = useState<boolean>(false);

  // Submitting state
  const [submiting, setSubmiting] = useState<boolean>(false);

  const role = useSelector((state: stateType) => state.role);

  // Handle submit
  const handleSubmit = async () => {
    setSubmiting(true);

    // Send request
    const resp = await updateData(
      ApiEndpoints.USER + `/${studentId}`,
      {
        category: selectedCategory,
      },
      role
    );

    // Sucess response
    if (resp && resp.status === 200) {
      // Update students list
      setStudents((prev) => {
        return prev.map((student) => {
          if (student._id === studentId) {
            return {
              ...student,
              category: selectedCategory,
            };
          }
          return student;
        });
      });

      // Update selected student
      setSelectedStudent((prevStudent: IStudent | IUser | null) => {
        if (!prevStudent) return null;
        if (prevStudent?._id === studentId) {
          return {
            ...prevStudent,
            category: selectedCategory,
          };
        }
        return prevStudent;
      });

      // Update list
      setStudents((prevUsers: IStudent[]) => {
        return prevUsers.filter((u) => u.category === category);
      });

      toast({
        title: `Changed status of ${student.name
          } to ${selectedCategory.toLowerCase()}.`,
      });

      setSubmiting(false);
      setOpen(false);
    }
  };

  // Controle modal
  useLayoutEffect(() => {
    if (open && selectedCategory === student.category) {
      setOpen(false);
    } else {
      document.body.style.pointerEvents = "auto";
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="flex flex-col gap-10 dark:bg-sidebar-background max-h-[calc(100vh-10vh)] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-3">
            <div className="p-2 bg-muted rounded-full">
              <FileSpreadsheetIcon className="w-4 h-4" />
            </div>
            <span>
              Do you wanna change status to {selectedCategory.toLowerCase()}
            </span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium">
            Changing the status of student to {selectedCategory.toLowerCase()}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button
            onClick={() => setOpen(false)}
            className="w-full h-11 transition-all duration-200 disabled:cursor-not-allowed"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submiting}
            className="w-full h-11 transition-all duration-200 disabled:cursor-not-allowed"
            onClick={handleSubmit}
          >
            {submiting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </div>
            ) : (
              "Yes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default StatusConfirmModal;

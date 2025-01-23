import Students from "@/components/coordinator/students/students";

// Interface for Props
interface PropsType {
    isDrawerOpen: boolean;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Students Component
function StudentsPage({ isDrawerOpen, setDrawerOpen }: PropsType) {
    return <Students isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />;
}

export default StudentsPage;

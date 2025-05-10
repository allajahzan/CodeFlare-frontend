import Curriculums from "@/components/admin/batch/curriculums";

// Inteface for Props
interface PropsType {
    setDrawerOpen : React.Dispatch<React.SetStateAction<boolean>>
}

// Batch page Component
function CurriculumsPage({setDrawerOpen}:PropsType) {
    return <Curriculums setDrawerOpen={setDrawerOpen} />;
}

export default CurriculumsPage;

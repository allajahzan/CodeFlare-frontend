import Batches from "@/components/admin/batch/batches";

// Inteface for Props
interface PropsType {
    setDrawerOpen : React.Dispatch<React.SetStateAction<boolean>>
}

// Batch page Component
function BatchesPage({setDrawerOpen}:PropsType) {
    return <Batches setDrawerOpen={setDrawerOpen} />;
}

export default BatchesPage;

import { useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const PaginationComponent = ({ totalPages }: { totalPages: number }) => {
    const [currentPage, setCurrentPage] = useState(1);

    // const handlePageChange = (page: number) => {
    //     if (page >= 1 && page <= totalPages) {
    //         setCurrentPage(page);
    //     }
    // };
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <Pagination>
            <PaginationContent className="flex items-end justify-center">
                {/* Previous Button */}
                <PaginationItem className="p-0">
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            prevPage();
                        }}
                        className={cn(currentPage === 1 ? "pointer-events-none opacity-50" : "")}
                    />
                </PaginationItem>

                {/* Page Numbers */}
                <PaginationItem className="p-0">
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                        }}
                        className="bg-muted text-foreground"
                    >
                        {currentPage}
                    </PaginationLink>
                </PaginationItem>

                {/* Next Button */}
                <PaginationItem className="p-0">
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            nextPage();
                        }}
                    className={currentPage === totalPages? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default PaginationComponent;

import { PageShell, PageLoading, PageError } from "@/components/PageShell";
import { HeaderContainer, HeaderSubtitle, HeaderTitle } from "../../../components/Header";
import { TableCell, TableContainer, TableHeader, TableRow } from "../../../components/Table";
import { Input } from "@/components/ui/input";
import { useGetAllGiftCardsQuery } from "@/redux/api/giftcard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const GiftCardsScreen = (): JSX.Element => {
    const { data: giftCards, isLoading, error } = useGetAllGiftCardsQuery();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    if (isLoading) {
        return <PageLoading />;
    }

    if (error) {
        return <PageError />;
    }

    const filteredGiftCards = giftCards?.filter(card =>
        card.giftCardId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.expiration.toLocaleDateString().includes(searchTerm)
    );

    const totalItems = filteredGiftCards?.length || 0;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = filteredGiftCards?.slice(startIndex, endIndex);

    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return <PageShell>
        <HeaderContainer >
            <div>
                <HeaderTitle>Cartes cadeaux</HeaderTitle>
                <HeaderSubtitle>Liste des cartes cadeaux disponibles sur la plateforme</HeaderSubtitle>
            </div>
            <div className="flex flex-row gap-4 justify-center items-center">
                <Input
                    type="text"
                    placeholder="Rechercher une carte cadeau"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </HeaderContainer>
        <TableContainer>
            <TableRow className="bg-brand-green-light/50">
                <TableHeader>ID</TableHeader>
                <TableHeader>UTILISATEUR</TableHeader>
                <TableHeader>EXPIRATION</TableHeader>
                <TableHeader>STATUT</TableHeader>
            </TableRow>
            {currentItems?.map((card) => (
                <TableRow
                    key={card.giftCardId}
                    className="cursor-pointer hover:bg-slate-50"
                >
                    <TableCell>{card.giftCardId.slice(0, 8)}</TableCell>
                    <TableCell>{card.userId ? card.userId.slice(0, 8) : 'N/A'}</TableCell>
                    <TableCell>{new Date(card.expiration).toLocaleDateString()}</TableCell>
                    <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                            card.status === 'IDLE' 
                                ? 'bg-blue-100 text-blue-800'
                                : card.status === 'USED'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-red-100 text-red-800' // EXPIRED
                        }`}>
                            {card.status === 'IDLE' 
                                ? 'Disponible'
                                : card.status === 'USED'
                                ? 'Utilisée'
                                : 'Expirée'}
                        </span>
                    </TableCell>
                </TableRow>
            ))}
        </TableContainer>
        
        {/* Pagination Controls */}
        <div className="flex justify-between items-center px-8 py-4 w-full border-t">
            <div className="flex justify-start items-center text-sm w-fit text-muted-foreground">
                Page {currentPage} sur {totalPages}
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden p-0 w-8 h-8 lg:flex"
                        onClick={() => handlePageChange(1)}
                        disabled={!canGoPrevious}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="p-0 w-8 h-8"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!canGoPrevious}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="p-0 w-8 h-8"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!canGoNext}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden p-0 w-8 h-8 lg:flex"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={!canGoNext}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <div className="flex w-[100px] items-center justify-end text-sm text-muted-foreground">
                {startIndex + 1}-{Math.min(endIndex, totalItems)} sur {totalItems}
            </div>
        </div>
    </PageShell>
}

export default GiftCardsScreen;
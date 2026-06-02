import { useState } from "react";
import { PageShell, PageLoading, PageError } from "@/components/PageShell";
import { HeaderContainer, HeaderSubtitle, HeaderTitle } from "@/components/Header";
import { TableCell, TableContainer, TableHeader, TableRow } from "@/components/Table";
import { Input } from "@/components/ui/input";
import { useGetAllPromoCodesQuery } from "@/redux/api/promocode";
import PromoCodeCreateDialog from "../components/PromoCodeCreateDialog";
import PromoCodeEditDialog from "../components/PromoCodeEditDialog";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10;

const PromoCodesScreen = (): JSX.Element => {
    const { data: promoCodes, isLoading, error } = useGetAllPromoCodesQuery();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    if (isLoading) {
        return <PageLoading />;
    }

    if (error) {
        return <PageError />;
    }

    const filteredPromoCodes = promoCodes?.filter(promoCode =>
        promoCode.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promoCode.amount.toString().includes(searchTerm)
    );

    const totalItems = filteredPromoCodes?.length || 0;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = filteredPromoCodes?.slice(startIndex, endIndex);

    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const formatDiscount = (amount: number, type: string) => {
        return type === 'PERCENTAGE' ? `${amount}%` : `${amount} FCFA`;
    };

    return <PageShell>
        <HeaderContainer>
            <div>
                <HeaderTitle>Codes Promo</HeaderTitle>
                <HeaderSubtitle>Liste des codes promo disponibles sur la plateforme et informations</HeaderSubtitle>
            </div>
            <div className="flex flex-row gap-4 justify-center items-center">
                <Input
                    type="text"
                    placeholder="Rechercher un code promo"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <PromoCodeCreateDialog />
            </div>
        </HeaderContainer>
        <TableContainer>
            <TableRow className="bg-brand-green-light/50">
                <TableHeader>CODE</TableHeader>
                <TableHeader>RÉDUCTION</TableHeader>
                <TableHeader>TYPE</TableHeader>
                <TableHeader>EXPIRATION</TableHeader>
                <TableHeader>ACTIONS</TableHeader>
            </TableRow>
            {currentItems?.map((promoCode) => (
                <TableRow
                    key={promoCode.promoCodeId}
                    className="hover:bg-slate-50"
                >
                    <TableCell>{promoCode.code}</TableCell>
                    <TableCell>{formatDiscount(promoCode.amount, promoCode.discountType)}</TableCell>
                    <TableCell>{promoCode.discountType === 'PERCENTAGE' ? 'Pourcentage' : 'Montant fixe'}</TableCell>
                    <TableCell>{new Date(promoCode.expiration).toLocaleDateString()}</TableCell>
                    <TableCell className="flex flex-row gap-4 justify-start items-center">
                        <PromoCodeEditDialog promoCode={promoCode} />
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
                        className="h-8 w-8 p-0"
                        onClick={() => handlePageChange(1)}
                        disabled={!canGoPrevious}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!canGoPrevious}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!canGoNext}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={!canGoNext}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    </PageShell>
}

export default PromoCodesScreen; 
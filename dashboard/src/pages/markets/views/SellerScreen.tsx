import { PageShell, PageLoading, PageError } from "@/components/PageShell";
import { HeaderContainer, HeaderSubtitle, HeaderTitle } from "../../../components/Header";
import { useGetSellerByIdQuery, useGetSellerProductsQuery } from "@/redux/api/seller";
import { useParams } from "react-router-dom";
import { useState } from "react";
import SellerEditDialog from "../components/SellerEditDialog";
import ProductCreateDialog from "../components/ProductCreateDialog";
import ProductEditDialog from "../components/ProductEditDialog";
import { TableCell, TableContainer, TableHeader, TableRow } from "@/components/Table";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10;

const SellerScreen = (): JSX.Element => {
    const { sellerId, marketId } = useParams();
    const { data: seller, isLoading: sellerLoading, error: sellerError } = useGetSellerByIdQuery(sellerId!);
    const { data: products, isLoading: productsLoading } = useGetSellerProductsQuery(sellerId!);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    if (sellerLoading || productsLoading) {
        return <PageLoading />;
    }

    if (sellerError || !seller) {
        return <PageError />;
    }

    const filteredProducts = products?.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.price.toString().includes(searchTerm) ||
        product.amount.toString().includes(searchTerm)
    );

    const totalItems = filteredProducts?.length || 0;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = filteredProducts?.slice(startIndex, endIndex);

    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <PageShell>
            <HeaderContainer>
                <div>
                    <HeaderTitle>{seller.firstName} {seller.lastName}</HeaderTitle>
                    <HeaderSubtitle>Informations détaillées du vendeur</HeaderSubtitle>
                </div>
                <div className="flex flex-row gap-4 justify-center items-center">
                    <SellerEditDialog seller={seller} />
                </div>
            </HeaderContainer>

            <div className="flex flex-col gap-4 p-8 w-full">
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-medium">Informations générales</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <span className="text-sm text-gray-500">Status:</span>
                            <span className={`px-2 py-1 rounded-full w-fit text-xs ${seller.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {seller.isActive ? "Actif" : "Inactif"}
                            </span>
                            <span className="text-sm text-gray-500">Genre:</span>
                            <span className="text-sm">{seller.gender === "M" ? "Homme" : "Femme"}</span>
                            <span className="text-sm text-gray-500">Table №:</span>
                            <span className="text-sm">{seller.tableNumber}</span>
                        </div>
                    </div>
                    {seller.pictureUrl && (
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-medium">Image</h3>
                            <img
                                src={seller.pictureUrl}
                                alt={`${seller.firstName} ${seller.lastName}`}
                                className="object-cover w-full h-48 rounded-lg"
                            />
                        </div>
                    )}
                </div>

                <div className="mt-8 w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Liste des produits</h3>
                        <div className="flex gap-4 items-center">
                            <Input
                                type="text"
                                placeholder="Rechercher un produit"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <ProductCreateDialog marketId={marketId!} sellerId={sellerId!} />
                        </div>
                    </div>
                    <TableContainer>
                        <TableRow className="bg-brand-green-light/50">
                            <TableHeader>NOM</TableHeader>
                            <TableHeader>CATÉGORIE</TableHeader>
                            <TableHeader>PRIX</TableHeader>
                            <TableHeader>QUANTITÉ</TableHeader>
                            <TableHeader>UNITÉ</TableHeader>
                            <TableHeader>ACTIF</TableHeader>
                            <TableHeader>ACTIONS</TableHeader>
                        </TableRow>
                        {currentItems?.map((product) => (
                            <TableRow key={product.productId}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell>{product.amount}</TableCell>
                                <TableCell>{product.unit}</TableCell>
                                <TableCell>{product.isInStock ? "Oui" : "Non"}</TableCell>
                                <TableCell>
                                    <ProductEditDialog product={product} />
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
                </div>
            </div>
        </PageShell>
    );
};

export default SellerScreen; 
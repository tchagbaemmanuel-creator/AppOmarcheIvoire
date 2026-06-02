import { HeaderContainer, HeaderSubtitle, HeaderTitle } from "../../../components/Header";
import { TableCell, TableContainer, TableHeader, TableRow } from "../../../components/Table";
import { Input } from "@/components/ui/input";
import { useGetAllOrdersQuery } from "@/redux/api/order";
import { useState } from "react";
import OrderCreateDialog from "../components/OrderCreateDialog";
import OrderEditDialog from "../components/OrderEditDialog";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/slices/authSlice";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell, PageLoading, PageError } from "@/components/PageShell";
import { StatusBadge, orderStatusVariant } from "@/components/StatusBadge";

const ITEMS_PER_PAGE = 10;

const OrdersScreen = (): JSX.Element => {
    const user = useSelector(selectCurrentUser)!;
    const { data: orders, isLoading, error } = useGetAllOrdersQuery(user.areaCode ?? undefined);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    if (isLoading) {
        return <PageLoading />;
    }

    if (error) {
        return <PageError message="Impossible de charger les commandes." />;
    }

    const filteredOrders = orders?.filter(order =>
        order.order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalItems = filteredOrders?.length || 0;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = filteredOrders?.slice(startIndex, endIndex);

    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleOrderClick = (orderId: string) => {
        navigate(`/orders/${orderId}`);
    };

    return <PageShell>
        <HeaderContainer >
            <div>
                <HeaderTitle>Commandes</HeaderTitle>
                <HeaderSubtitle>Liste des commandes disponibles sur la plateforme et informations</HeaderSubtitle>
            </div>
            <div className="flex flex-row gap-4 justify-center items-center">
                <Input
                    type="text"
                    placeholder="Rechercher une commande"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <OrderCreateDialog />
            </div>
        </HeaderContainer>
        <TableContainer>
            <TableRow className="bg-brand-green-light/50">
                <TableHeader>ID</TableHeader>
                <TableHeader>UTILISATEUR</TableHeader>
                <TableHeader>ADRESSE</TableHeader>
                <TableHeader>HEURE DE LIVRAISON</TableHeader>
                <TableHeader>STATUT</TableHeader>
                <TableHeader>MARCHÉ</TableHeader>
                <TableHeader>ACTIONS</TableHeader>
            </TableRow>
            {currentItems?.map((order) => (
                <TableRow
                    key={order.order.orderId}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => handleOrderClick(order.order.orderId)}
                >
                    <TableCell>{order.order.orderId.slice(0, 8)}</TableCell>
                    <TableCell>{order.order.userId.slice(0, 8)}</TableCell>
                    <TableCell>{order.order.address}</TableCell>
                    <TableCell>{order.order.deliveryTime}</TableCell>
                    <TableCell>
                        <StatusBadge variant={orderStatusVariant(order.order.status)}>
                            {order.order.status}
                        </StatusBadge>
                    </TableCell>
                    <TableCell>{order.marketName}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                        <OrderEditDialog order={order.order} />
                    </TableCell>
                </TableRow>
            ))}
        </TableContainer>
        {/* Pagination Controls */}
        <div className="flex justify-between items-center border-t border-border/60 bg-muted/20 px-6 py-4 w-full">
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

export default OrdersScreen;
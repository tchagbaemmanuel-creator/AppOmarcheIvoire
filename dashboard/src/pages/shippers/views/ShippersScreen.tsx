import { PageShell, PageLoading, PageError } from "@/components/PageShell";
import {
  HeaderContainer,
  HeaderSubtitle,
  HeaderTitle,
} from "@/components/Header";
import {
  TableCell,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { Input } from "@/components/ui/input";
import { useGetAllShippersQuery } from "@/redux/api/shipper";
import { useGetAllMarketsQuery } from "@/redux/api/market";
import { useState } from "react";
import ShipperCreateDialog from "../components/ShipperCreateDialog";
import { useNavigate } from "react-router-dom";
import { ShipperEditDialog } from "../components/ShipperEditDialog";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/slices/authSlice";

const ITEMS_PER_PAGE = 10;

const ShippersScreen = (): JSX.Element => {
  const user = useSelector(selectCurrentUser)!;
  const {
    data: shippers,
    isLoading: shippersLoading,
    error: shippersError,
  } = useGetAllShippersQuery();
  const { data: markets, isLoading: marketsLoading } = useGetAllMarketsQuery(
    user.areaCode ?? undefined
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  if (shippersLoading || marketsLoading) {
    return <PageLoading />;
  }

  if (shippersError) {
    return <PageError />;
  }

  const marketMap = markets?.reduce((acc, market) => {
    acc[market.marketId] = market.name;
    return acc;
  }, {} as { [key: string]: string });

  const filteredShippers = shippers?.filter(
    (shipper) =>
      shipper.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipper.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipper.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipper.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredShippers?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredShippers?.slice(startIndex, endIndex);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleShipperClick = (shipperId: string) => {
    navigate(`/shippers/${shipperId}`);
  };

  return (
    <PageShell>
      <HeaderContainer>
        <div>
          <HeaderTitle>Livreurs</HeaderTitle>
          <HeaderSubtitle>
            Liste des livreurs disponibles sur la plateforme
          </HeaderSubtitle>
        </div>
        <div className="flex flex-row gap-4 justify-center items-center">
          <Input
            type="text"
            placeholder="Rechercher un livreur"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ShipperCreateDialog />
        </div>
      </HeaderContainer>

      <TableContainer>
        <TableRow className="bg-brand-green-light/50">
          <TableHeader>NOM</TableHeader>
          <TableHeader>PRÉNOM</TableHeader>
          <TableHeader>EMAIL</TableHeader>
          <TableHeader>TÉLÉPHONE</TableHeader>
          <TableHeader>MARCHÉ</TableHeader>
          <TableHeader>STATUT</TableHeader>
          <TableHeader>ACTIONS</TableHeader>
        </TableRow>
        {currentItems?.map((shipper) => (
          <TableRow
            key={shipper.shipperId}
            className="cursor-pointer hover:bg-slate-50"
            onClick={() => handleShipperClick(shipper.shipperId)}
          >
            <TableCell>{shipper.lastName}</TableCell>
            <TableCell>{shipper.firstName}</TableCell>
            <TableCell>{shipper.email}</TableCell>
            <TableCell>{shipper.phone}</TableCell>
            <TableCell>{marketMap?.[shipper.marketId] || "N/A"}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  shipper.isOnline
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {shipper.isOnline ? "En ligne" : "Hors ligne"}
              </span>
            </TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <ShipperEditDialog shipper={shipper} />
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
  );
};

export default ShippersScreen;

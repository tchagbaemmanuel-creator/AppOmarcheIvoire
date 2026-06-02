import {
  HeaderContainer,
  HeaderSubtitle,
  HeaderTitle,
} from "../../../components/Header";
import {
  TableCell,
  TableContainer,
  TableHeader,
  TableRow,
} from "../../../components/Table";
import MarketEditDialog from "../components/MarketEditDialog";
import { Input } from "@/components/ui/input";
import { useGetAllMarketsQuery } from "@/redux/api/market";
import MarketCreateDialog from "../components/MarketCreateDialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser } from "@/redux/slices/authSlice";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell, PageLoading, PageError } from "@/components/PageShell";
import { StatusBadge } from "@/components/StatusBadge";

export const getAreaLabel = (code: string) => {
  const areaLabels: Record<string, string> = {
    ABOBO: "Abobo",
    ADJAME: "Adjamé",
    ATTECOUBE: "Attécoubé",
    COCODY: "Cocody",
    KOUMASSI: "Koumassi",
    MARCORY: "Marcory",
    PLATEAU: "Plateau",
    TREICHVILLE: "Treichville",
    YOPOUGON: "Yopougon",
    BROFODOUME: "Brofodoumé",
    BINGERVILLE: "Bingerville",
    PORT_BOUET: "Port-Bouët",
    ANYAMA: "Anyama",
    SONGON: "Songon",
  };
  return areaLabels[code] || code;
};

const ITEMS_PER_PAGE = 10;

const MarketsScreen = (): JSX.Element => {
  const user = useSelector(selectCurrentUser)!;
  // On affiche tous les marchés. Le filtre par zone peut être appliqué plus tard côté UI si nécessaire.
  const { data: markets, isLoading, error } = useGetAllMarketsQuery(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  if (isLoading) {
    return <PageLoading />;
  }

  if (error) {
    return <PageError message="Impossible de charger les marchés." />;
  }

  const filteredMarkets = markets?.filter(
    (market) =>
      market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      market.latitude.toString().includes(searchTerm) ||
      market.longitude.toString().includes(searchTerm) ||
      getAreaLabel(market.areaCode)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredMarkets?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredMarkets?.slice(startIndex, endIndex);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <PageShell>
      <HeaderContainer>
        <div>
          <HeaderTitle>Marchés</HeaderTitle>
          <HeaderSubtitle>
            Liste des marchés disponibles sur la plateforme et informations
          </HeaderSubtitle>
        </div>
        <div className="flex flex-row gap-4 justify-center items-center">
          <Input
            type="text"
            placeholder="Rechercher un marché"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MarketCreateDialog />
        </div>
      </HeaderContainer>
      <TableContainer>
        <TableRow className="bg-brand-green-light/50">
          <TableHeader>NOM</TableHeader>
          <TableHeader>ZONE</TableHeader>
          <TableHeader>LATITUDE</TableHeader>
          <TableHeader>LONGITUDE</TableHeader>
          <TableHeader>ACTIF</TableHeader>
          <TableHeader>ACTIONS</TableHeader>
        </TableRow>
        {currentItems?.map((market) => (
          <TableRow
            key={market.marketId}
            className="cursor-pointer hover:bg-slate-50"
            onClick={() => navigate(`/markets/${market.marketId}`)}
          >
            <TableCell>{market.name}</TableCell>
            <TableCell>{getAreaLabel(market.areaCode)}</TableCell>
            <TableCell>{market.latitude}</TableCell>
            <TableCell>{market.longitude}</TableCell>
            <TableCell>
              <StatusBadge variant={market.isActive ? "success" : "danger"}>
                {market.isActive ? "Actif" : "Inactif"}
              </StatusBadge>
            </TableCell>
            <TableCell className="flex flex-row gap-4 justify-start items-center">
              <MarketEditDialog market={market} />
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
  );
};

export default MarketsScreen;

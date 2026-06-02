import { useState } from "react";
import { PageShell, PageLoading } from "@/components/PageShell";
import { HeaderContainer, HeaderSubtitle, HeaderTitle } from "@/components/Header";
import { TableCell, TableContainer, TableHeader, TableRow } from "@/components/Table";
import { Input } from "@/components/ui/input";
import { useGetAllAgentsQuery } from "@/redux/api/agent";
import { useGetAllMarketsQuery } from "@/redux/api/market";
import AgentCreateDialog from "../components/AgentCreateDialog";
import AgentEditDialog from "../components/AgentEditDialog";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser } from "@/redux/slices/authSlice";
import { useSelector } from "react-redux";
import { getAreaLabel } from "@/pages/markets/views/MarketsScreen";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10;

const AgentsScreen = (): JSX.Element => {
    const user = useSelector(selectCurrentUser)!;
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const { data: agents, isLoading: agentsLoading, error: agentsError } = useGetAllAgentsQuery(user.areaCode ?? undefined);
    const { data: markets, isLoading: marketsLoading } = useGetAllMarketsQuery(user.areaCode ?? undefined);
    const navigate = useNavigate();

    if (agentsLoading || marketsLoading) {
        return <PageLoading />;
    }

    if (agentsError) {
        return <div>Erreur lors du chargement des vendeurs</div>;
    }

    const marketMap = markets?.reduce((acc, market) => {
        acc[market.marketId] = market.name;
        return acc;
    }, {} as { [key: string]: string });

    const filteredAgents = agents?.filter((agent) =>
        `${agent.firstName} ${agent.lastName} ${agent.email} ${agent.phone}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const totalItems = filteredAgents?.length || 0;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = filteredAgents?.slice(startIndex, endIndex);

    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <PageShell>
            <HeaderContainer>
                <div>
                    <HeaderTitle>Vendeur</HeaderTitle>
                    <HeaderSubtitle>
                        {user.areaCode ? `Vendeur de ${getAreaLabel(user.areaCode)}` : 'Gérez les gestionnaires de commande'}
                    </HeaderSubtitle>
                </div>
                <div className="flex flex-row gap-4 justify-center items-center">
                    <Input
                        type="text"
                        placeholder="Rechercher un vendeur"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <AgentCreateDialog />
                </div>
            </HeaderContainer>
            <TableContainer>
                <TableRow className="bg-brand-green-light/50">
                    <TableHeader>NOM</TableHeader>
                    <TableHeader>EMAIL</TableHeader>
                    <TableHeader>TÉLÉPHONE</TableHeader>
                    <TableHeader>MARCHÉ</TableHeader>
                    <TableHeader>ACTIONS</TableHeader>
                </TableRow>
                {currentItems?.map((agent) => (
                    <TableRow 
                        key={agent.agentId}
                        className="cursor-pointer hover:bg-slate-50"
                        onClick={() => navigate(`/agents/${agent.agentId}`)}
                    >
                        <TableCell>{`${agent.firstName} ${agent.lastName}`}</TableCell>
                        <TableCell>{agent.email}</TableCell>
                        <TableCell>{agent.phone}</TableCell>
                        <TableCell>{marketMap?.[agent.marketId] || "N/A"}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                            <AgentEditDialog agent={agent} />
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
    );
};

export default AgentsScreen;
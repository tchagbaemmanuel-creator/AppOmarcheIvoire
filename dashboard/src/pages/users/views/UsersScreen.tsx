import { PageShell, PageLoading, PageError } from "@/components/PageShell";
import { HeaderContainer, HeaderSubtitle, HeaderTitle } from "../../../components/Header";
import { TableCell, TableContainer, TableHeader, TableRow } from "../../../components/Table";
import { Input } from "@/components/ui/input";
import { User, useGetAllUsersQuery } from "@/redux/api/user";
import { useState } from "react";
import UserCreateDialog from "../components/UserCreateDialog";
import UserEditDialog from "../components/UserEditDialog";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const UsersScreen = (): JSX.Element => {
    const { data: users, isLoading, error } = useGetAllUsersQuery();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    if (isLoading) {
        return <PageLoading />;
    }

    if (error) {
        return <PageError />;
    }

    const normalizedSearchTerm = (searchTerm ?? "").toLowerCase();

    const filteredUsers = (users ?? []).filter((user) => {
        const userId = (user.userId ?? "").toLowerCase();
        const email = (user.email ?? "").toLowerCase();
        const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.toLowerCase();
        const city = (user.city ?? "").toLowerCase();
        const phone = (user.phone ?? "").toLowerCase();

        return (
            userId.includes(normalizedSearchTerm) ||
            email.includes(normalizedSearchTerm) ||
            fullName.includes(normalizedSearchTerm) ||
            city.includes(normalizedSearchTerm) ||
            phone.includes(normalizedSearchTerm)
        );
    });

    const totalItems = filteredUsers?.length || 0;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = filteredUsers?.slice(startIndex, endIndex);

    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleUserClick = (userId: string) => {
        navigate(`/users/${userId}`);
    };

    return <PageShell>
        <HeaderContainer>
            <div>
                <HeaderTitle>Utilisateurs</HeaderTitle>
                <HeaderSubtitle>Liste des utilisateurs enregistrés sur la plateforme</HeaderSubtitle>
            </div>
            <div className="flex flex-row gap-4 justify-center items-center">
                <Input
                    type="text"
                    placeholder="Rechercher un utilisateur"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <UserCreateDialog />
            </div>
        </HeaderContainer>
        <TableContainer>
            <TableRow className="bg-brand-green-light/50">
                <TableHeader>ID</TableHeader>
                <TableHeader>NOM</TableHeader>
                <TableHeader>EMAIL</TableHeader>
                <TableHeader>VILLE</TableHeader>
                <TableHeader>TÉLÉPHONE</TableHeader>
                <TableHeader>ACTIONS</TableHeader>
            </TableRow>
            {currentItems?.map((user: User) => (
                <TableRow
                    key={user.userId}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => handleUserClick(user.userId)}
                >
                    <TableCell>{user.userId.slice(0, 8)}</TableCell>
                    <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.city || '-'}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                        <UserEditDialog user={user} />
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

export default UsersScreen;

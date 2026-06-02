import { PageShell, PageLoading, PageError } from "@/components/PageShell";
import { HeaderContainer, HeaderSubtitle, HeaderTitle } from "@/components/Header";
import { useGetUserByIdQuery, useGetUserOrdersQuery } from "@/redux/api/user";
import { useParams } from "react-router-dom";
import { useState } from "react";
import UserEditDialog from "../components/UserEditDialog";
import { TableCell, TableContainer, TableHeader, TableRow } from "@/components/Table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import * as Tabs from "@radix-ui/react-tabs";
import { OrderStatus } from "@/redux/api/order";

const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
        case "IDLE":
            return "bg-gray-100 text-gray-800";
        case "PROCESSING":
        case "PROCESSED":
            return "bg-blue-100 text-blue-800";
        case "COLLECTING":
            return "bg-yellow-100 text-yellow-800";
        case "DELIVERING":
            return "bg-purple-100 text-purple-800";
        case "DELIVERED":
            return "bg-green-100 text-green-800";
        case "CANCELED":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
        case "IDLE":
            return "En attente";
        case "PROCESSING":
            return "En cours";
        case "PROCESSED":
            return "Traité";
        case "COLLECTING":
            return "En collecte";
        case "DELIVERING":
            return "En livraison";
        case "DELIVERED":
            return "Livré";
        case "CANCELED":
            return "Annulé";
        default:
            return status;
    }
};

const UserScreen = (): JSX.Element => {
    const { userId } = useParams();
    const { data: user, isLoading: userLoading, error: userError } = useGetUserByIdQuery(userId!);
    const { data: orders, isLoading: ordersLoading } = useGetUserOrdersQuery(userId!);
    const [searchTerm, setSearchTerm] = useState("");

    if (userLoading || ordersLoading) {
        return <PageLoading />;
    }

    if (userError || !user) {
        return <PageError />;
    }

    const filteredOrders = orders?.filter(order =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getStatusLabel(order.status).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePrint = () => {
        const printContent = `
            <div style="padding: 20px;">
                <h1 style="margin-bottom: 20px;">${user.firstName} ${user.lastName}</h1>
                <div style="margin-bottom: 20px;">
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Téléphone:</strong> ${user.phone || 'Non renseigné'}</p>
                    <p><strong>Adresse:</strong> ${user.address || 'Non renseignée'}</p>
                    <p><strong>Ville:</strong> ${user.city || 'Non renseignée'}</p>
                </div>
                <h2>Commandes</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid black; padding: 8px;">ID</th>
                            <th style="border: 1px solid black; padding: 8px;">Date</th>
                            <th style="border: 1px solid black; padding: 8px;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders?.map(order => `
                            <tr>
                                <td style="border: 1px solid black; padding: 8px;">${order.orderId}</td>
                                <td style="border: 1px solid black; padding: 8px;">${order.createdAt ? format(new Date(order.createdAt), 'PPP', { locale: fr }) : 'N/A'}</td>
                                <td style="border: 1px solid black; padding: 8px;">${getStatusLabel(order.status)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.print();
        } else {
            toast.error("Impossible d'ouvrir la fenêtre d'impression");
        }
    };

    return (
        <PageShell>
            <HeaderContainer>
                <div>
                    <HeaderTitle>{user.firstName} {user.lastName}</HeaderTitle>
                    <HeaderSubtitle>Informations détaillées de l'utilisateur</HeaderSubtitle>
                </div>
                <div className="flex flex-row gap-4 justify-center items-center">
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 w-4 h-4" />
                        Imprimer
                    </Button>
                    <UserEditDialog user={user} />
                </div>
            </HeaderContainer>

            <div className="flex flex-col gap-4 p-8 w-full">
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-medium">Informations générales</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <span className="text-sm text-gray-500">Email:</span>
                            <span className="text-sm">{user.email}</span>
                            <span className="text-sm text-gray-500">Téléphone:</span>
                            <span className="text-sm">{user.phone || 'Non renseigné'}</span>
                            <span className="text-sm text-gray-500">Adresse:</span>
                            <span className="text-sm">{user.address || 'Non renseignée'}</span>
                            <span className="text-sm text-gray-500">Ville:</span>
                            <span className="text-sm">{user.city || 'Non renseignée'}</span>
                            <span className="text-sm text-gray-500">Créé le:</span>
                            <span className="text-sm">{format(new Date(user.createdAt), 'PPP', { locale: fr })}</span>
                            <span className="text-sm text-gray-500">Modifié le:</span>
                            <span className="text-sm">{format(new Date(user.updatedAt), 'PPP', { locale: fr })}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <Tabs.Root defaultValue="orders" className="w-full">
                    <Tabs.List className="flex border-b border-slate-200">
                        <Tabs.Trigger
                            value="orders"
                            className="px-4 py-2 -mb-px text-sm font-medium text-slate-600 border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:text-slate-900"
                        >
                            Commandes ({orders?.length || 0})
                        </Tabs.Trigger>
                    </Tabs.List>

                    <div className="p-4">
                        <Tabs.Content value="orders" className="w-full">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">Liste des commandes</h3>
                                <Input
                                    type="text"
                                    placeholder="Rechercher une commande"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="max-w-xs"
                                />
                            </div>
                            <TableContainer>
                                <TableRow className="bg-brand-green-light/50">
                                    <TableHeader>ID</TableHeader>
                                    <TableHeader>DATE</TableHeader>
                                    <TableHeader>STATUS</TableHeader>
                                    <TableHeader>ADRESSE</TableHeader>
                                </TableRow>
                                {filteredOrders?.map((order) => (
                                    <TableRow
                                        key={order.orderId}
                                        className="cursor-pointer hover:bg-slate-50"
                                    >
                                        <TableCell>{order.orderId}</TableCell>
                                        <TableCell>{order.createdAt ? format(new Date(order.createdAt), 'PPP', { locale: fr }) : 'N/A'}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(order.status)}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </TableCell>
                                        <TableCell>{order.address}</TableCell>
                                    </TableRow>
                                ))}
                            </TableContainer>
                        </Tabs.Content>
                    </div>
                </Tabs.Root>
            </div>
        </PageShell>
    );
};

export default UserScreen;

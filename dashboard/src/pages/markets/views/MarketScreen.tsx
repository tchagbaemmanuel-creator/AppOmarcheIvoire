import { PageShell, PageLoading, PageError } from "@/components/PageShell";
import { HeaderContainer, HeaderSubtitle, HeaderTitle } from "../../../components/Header";
import { useGetMarketByIdQuery, useGetSellersFromMarketQuery, useGetOrdersFromMarketQuery, useDeleteMarketMutation } from "@/redux/api/market";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import MarketEditDialog from "../components/MarketEditDialog";
import SellerCreateDialog from "../components/SellerCreateDialog";
import SellerEditDialog from "../components/SellerEditDialog";
import OrderCreateDialog from "../components/OrderCreateDialog";
import OrderEditDialog from "../components/OrderEditDialog";
import { TableCell, TableContainer, TableHeader, TableRow } from "@/components/Table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import * as Tabs from "@radix-ui/react-tabs";
import { getAreaLabel } from "./MarketsScreen";

const MarketScreen = (): JSX.Element => {
    const { marketId } = useParams();
    const navigate = useNavigate();
    const [deleteMarket] = useDeleteMarketMutation();
    const { data: market, isLoading: marketLoading, error: marketError } = useGetMarketByIdQuery(marketId!);
    const { data: sellers, isLoading: sellersLoading } = useGetSellersFromMarketQuery(marketId!);
    const { data: orders, isLoading: ordersLoading } = useGetOrdersFromMarketQuery(marketId!);
    const [sellerSearchTerm, setSellerSearchTerm] = useState("");
    const [orderSearchTerm, setOrderSearchTerm] = useState("");

    if (marketLoading || sellersLoading || ordersLoading) {
        return <PageLoading />;
    }

    if (marketError || !market) {
        return <PageError />;
    }

    const filteredSellers = sellers?.filter(seller =>
        seller.firstName.toLowerCase().includes(sellerSearchTerm.toLowerCase()) ||
        seller.lastName.toLowerCase().includes(sellerSearchTerm.toLowerCase()) ||
        seller.tableNumber.toString().includes(sellerSearchTerm)
    );

    const filteredOrders = orders?.filter(order =>
        order.orderId.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
        order.userId.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
        order.address.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(orderSearchTerm.toLowerCase())
    );

    const handleSellerClick = (sellerId: string) => {
        navigate(`/sellers/${sellerId}`);
    };

    const handleDelete = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce marché ? Cette action est irréversible.")) {
            try {
                await deleteMarket(marketId!).unwrap();
                toast.success("Marché supprimé avec succès");
                navigate("/markets");
            } catch (error) {
                console.error("Failed to delete market:", error);
                toast.error("Erreur lors de la suppression du marché");
            }
        }
    };

    return (
        <PageShell>
            <HeaderContainer>
                <div>
                    <HeaderTitle>{market.name}</HeaderTitle>
                    <HeaderSubtitle>Informations détaillées du marché</HeaderSubtitle>
                </div>
                <div className="flex flex-row gap-4 justify-center items-center">
                    <MarketEditDialog market={market} />
                    <Button
                        variant="destructive"
                        size="icon"
                        onClick={handleDelete}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </HeaderContainer>

            <div className="flex flex-col gap-4 p-8 w-full">
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-medium">Informations générales</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <span className="text-sm text-gray-500">Status:</span>
                            <span className={`px-2 w-fit py-1 rounded-full text-xs ${market.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {market.isActive ? "Actif" : "Inactif"}
                            </span>
                            <span className="text-sm text-gray-500">Latitude:</span>
                            <span className="text-sm">{market.latitude}</span>
                            <span className="text-sm text-gray-500">Longitude:</span>
                            <span className="text-sm">{market.longitude}</span>
                            <span className="text-sm text-gray-500">Créé le:</span>
                            <span className="text-sm">{new Date(market.createdAt!).toLocaleDateString()}</span>
                            <span className="text-sm text-gray-500">Mis à jour le:</span>
                            <span className="text-sm">{new Date(market.updatedAt!).toLocaleDateString()}</span>
                            <span className="text-sm text-gray-500">Zone:</span>
                            <span className="text-sm">{getAreaLabel(market.areaCode)}</span>
                        </div>
                    </div>
                    {market.pictureUrl && (
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-medium">Image</h3>
                            <img
                                src={market.pictureUrl}
                                alt={market.name}
                                className="object-cover w-full h-48 rounded-lg"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full">
                <Tabs.Root defaultValue="sellers" className="w-full">
                    <Tabs.List className="flex border-b border-slate-200">
                        <Tabs.Trigger
                            value="sellers"
                            className="px-4 py-2 -mb-px text-sm font-medium text-slate-600 border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:text-slate-900"
                        >
                            Vendeurs ({sellers?.length || 0})
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="orders"
                            className="px-4 py-2 -mb-px text-sm font-medium text-slate-600 border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:text-slate-900"
                        >
                            Commandes ({orders?.length || 0})
                        </Tabs.Trigger>
                    </Tabs.List>

                    <div className="p-4">
                        <Tabs.Content value="sellers" className="w-full">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">Liste des vendeurs</h3>
                                <div className="flex gap-4 items-center">
                                    <Input
                                        type="text"
                                        placeholder="Rechercher un vendeur"
                                        value={sellerSearchTerm}
                                        onChange={(e) => setSellerSearchTerm(e.target.value)}
                                    />
                                    <SellerCreateDialog marketId={marketId!} />
                                </div>
                            </div>
                            <TableContainer>
                                <TableRow className="bg-brand-green-light/50">
                                    <TableHeader>NOM</TableHeader>
                                    <TableHeader>PRÉNOM</TableHeader>
                                    <TableHeader>NUMÉRO DE TABLE</TableHeader>
                                    <TableHeader>GENRE</TableHeader>
                                    <TableHeader>ACTIF</TableHeader>
                                    <TableHeader>ACTIONS</TableHeader>
                                </TableRow>
                                {filteredSellers?.map((seller) => (
                                    <TableRow
                                        key={seller.sellerId}
                                        className="cursor-pointer hover:bg-slate-50"
                                        onClick={() => handleSellerClick(seller.sellerId)}
                                    >
                                        <TableCell>{seller.lastName}</TableCell>
                                        <TableCell>{seller.firstName}</TableCell>
                                        <TableCell>{seller.tableNumber}</TableCell>
                                        <TableCell>{seller.gender === "M" ? "Homme" : "Femme"}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${seller.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {seller.isActive ? "Actif" : "Inactif"}
                                            </span>
                                        </TableCell>
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <SellerEditDialog seller={seller} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableContainer>
                        </Tabs.Content>

                        <Tabs.Content value="orders" className="w-full">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">Liste des commandes</h3>
                                <div className="flex gap-4 items-center">
                                    <Input
                                        type="text"
                                        placeholder="Rechercher une commande"
                                        value={orderSearchTerm}
                                        onChange={(e) => setOrderSearchTerm(e.target.value)}
                                    />
                                    <OrderCreateDialog marketId={marketId!} />
                                </div>
                            </div>
                            <TableContainer>
                                <TableRow className="bg-brand-green-light/50">
                                    <TableHeader>ID</TableHeader>
                                    <TableHeader>UTILISATEUR</TableHeader>
                                    <TableHeader>ADRESSE</TableHeader>
                                    <TableHeader>HEURE DE LIVRAISON</TableHeader>
                                    <TableHeader>STATUT</TableHeader>
                                    <TableHeader>ACTIONS</TableHeader>
                                </TableRow>
                                {filteredOrders?.map((order) => (
                                    <TableRow key={order.orderId}>
                                        <TableCell>{order.orderId.slice(0, 8)}</TableCell>
                                        <TableCell>{order.userId.slice(0, 8)}</TableCell>
                                        <TableCell>{order.address}</TableCell>
                                        <TableCell>{order.deliveryTime}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${order.status === "IDLE" ? 'bg-gray-100 text-gray-800' :
                                                    order.status === "PROCESSING" || order.status === "PROCESSED" ? 'bg-blue-100 text-blue-800' :
                                                        order.status === "COLLECTING" ? 'bg-yellow-100 text-yellow-800' :
                                                            order.status === "DELIVERING" ? 'bg-purple-100 text-purple-800' :
                                                                order.status === "DELIVERED" ? 'bg-green-100 text-green-800' :
                                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <OrderEditDialog order={order} />
                                        </TableCell>
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

export default MarketScreen;
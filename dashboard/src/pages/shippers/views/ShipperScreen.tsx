import { PageShell, PageLoading, PageError } from "@/components/PageShell";
import { HeaderContainer, HeaderSubtitle, HeaderTitle } from "../../../components/Header";
import { useGetShipperByIdQuery } from "@/redux/api/shipper";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { TableCell, TableContainer, TableHeader, TableRow } from "@/components/Table";
import { Input } from "@/components/ui/input";
import { ShipperEditDialog } from "../components/ShipperEditDialog";

const ShipperScreen = (): JSX.Element => {
    const { shipperId } = useParams();
    const { data: shipper, isLoading: shipperLoading, error: shipperError } = useGetShipperByIdQuery(shipperId!);
    const [searchTerm, setSearchTerm] = useState("");

    if (shipperLoading) {
        return <PageLoading />;
    }

    if (shipperError || !shipper) {
        return <PageError />;
    }

    return (
        <PageShell>
            <HeaderContainer>
                <div>
                    <HeaderTitle>{shipper.firstName} {shipper.lastName}</HeaderTitle>
                    <HeaderSubtitle>Informations détaillées du livreur</HeaderSubtitle>
                </div>
                <div className="flex flex-row gap-4 justify-center items-center">
                    <ShipperEditDialog shipper={shipper} />
                </div>
            </HeaderContainer>

            <div className="flex flex-col gap-4 p-8 w-full">
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-medium">Informations générales</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <span className="text-sm text-gray-500">Email:</span>
                            <span className="text-sm">{shipper.email}</span>
                            <span className="text-sm text-gray-500">Téléphone:</span>
                            <span className="text-sm">{shipper.phone}</span>
                            <span className="text-sm text-gray-500">Marché:</span>
                            <span className="text-sm">{shipper.marketId}</span>
                            <span className="text-sm text-gray-500">Status:</span>
                            <span className={`px-2 w-fit py-1 rounded-full text-xs ${shipper.isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {shipper.isOnline ? "En ligne" : "Hors ligne"}
                            </span>
                            <span className="text-sm text-gray-500">Date de création:</span>
                            <span className="text-sm">{shipper.createdAt ? new Date(shipper.createdAt).toLocaleDateString() : 'N/A'}</span>
                            <span className="text-sm text-gray-500">Dernière mise à jour:</span>
                            <span className="text-sm">{new Date(shipper.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {shipper.pictureUrl && (
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-medium">Photo de profil</h3>
                            <img
                                src={shipper.pictureUrl}
                                alt={`${shipper.firstName} ${shipper.lastName}`}
                                className="object-cover w-full h-48 rounded-lg"
                            />
                        </div>
                    )}
                </div>

                {shipper.orders && shipper.orders.length > 0 && (
                    <div className="flex flex-col gap-2 mt-8">
                        <h3 className="text-lg font-medium">Commandes</h3>
                        <Input
                            placeholder="Rechercher une commande..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                        />
                        <TableContainer>
                            <TableHeader>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHeader>
                            <tbody>
                                {shipper.orders
                                    .filter(order => 
                                        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        order.status.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map((order) => (
                                        <TableRow key={order.orderId}>
                                            <TableCell>{order.orderId}</TableCell>
                                            <TableCell>{new Date(order.createdAt ?? new Date()).toLocaleDateString()}</TableCell>
                                            <TableCell>{order.status}</TableCell>
                                        </TableRow>
                                    ))}
                            </tbody>
                        </TableContainer>
                    </div>
                )}
            </div>
        </PageShell>
    );
};

export default ShipperScreen;

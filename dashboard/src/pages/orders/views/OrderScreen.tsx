import { PageShell, PageLoading, PageError } from "@/components/PageShell";
import { StatusBadge, orderStatusVariant } from "@/components/StatusBadge";
import {
  HeaderContainer,
  HeaderSubtitle,
  HeaderTitle,
} from "../../../components/Header";
import { useParams } from "react-router-dom";
import { useGetOrderByIdQuery } from "@/redux/api/order";
import OrderEditDialog from "../components/OrderEditDialog";
import {
  TableCell,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

const OrderScreen = (): JSX.Element => {
  const { orderId } = useParams();
  const { data: order, isLoading, error } = useGetOrderByIdQuery(orderId!);
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) {
    return <PageLoading />;
  }

  if (error || !order) {
    return <PageError />;
  }

  const filteredProducts = order.orderProducts?.filter(
    (product) =>
      product.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product.price.toString().includes(searchTerm) ||
      product.quantity.toString().includes(searchTerm)
  );

  const generateOrderHTML = () => {
    const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Détails de la commande</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1, h2 { color: #333; }
                    .order-info { margin-bottom: 20px; }
                    .product-list { border-top: 1px solid #ccc; padding-top: 10px; }
                    .product-item { margin-bottom: 20px; }
                    .status-badge {
                        display: inline-block;
                        padding: 4px 8px;
                        border-radius: 9999px;
                        font-size: 12px;
                        font-weight: 500;
                    }
                    .status-idle { background: #f3f4f6; color: #1f2937; }
                    .status-processing, .status-processed { background: #dbeafe; color: #1e40af; }
                    .status-collecting { background: #fef3c7; color: #92400e; }
                    .status-delivering { background: #f3e8ff; color: #6b21a8; }
                    .status-delivered { background: #dcfce7; color: #166534; }
                    .status-canceled { background: #fee2e2; color: #991b1b; }
                </style>
            </head>
            <body>
                <h1>Détails de la commande #${order.order.orderId.slice(
                  0,
                  8
                )}</h1>
                <div class="order-info">
                    <p><strong>Status:</strong> <span class="status-badge status-${order.order.status.toLowerCase()}">${
      order.order.status
    }</span></p>
                    <p><strong>Client ID:</strong> ${order.order.userId}</p>
                    <p><strong>Client No.:</strong> ${
                      order.order.users.phone
                    }</p>
                    <p><strong>ID vendeur:</strong> ${
                      order.order.agentId || "N/A"
                    }</p>
                    <p><strong>Livreur ID:</strong> ${
                      order.order.shipperId || "N/A"
                    }</p>
                    <p><strong>Adresse:</strong> ${order.order.address}</p>
                    <p><strong>Heure de livraison:</strong> ${
                      order.order.deliveryTime
                    }</p>
                    <p><strong>Date de commande:</strong> ${
                      order.order.createdAt
                    }</p>
                    <p><strong>Méthode de paiement:</strong> ${
                      order.order.paymentMethod
                    }</p>
                    ${
                      order.order.promoCode
                        ? `<p><strong>Code promo:</strong> ${order.order.promoCode.code}</p>`
                        : ""
                    }
                    ${
                      order.order.cancellationReason
                        ? `<p><strong>Raison d'annulation:</strong> ${order.order.cancellationReason}</p>`
                        : ""
                    }
                </div>
                <div class="product-list">
                    <h2>Produits</h2>
                    ${order.orderProducts
                      .map(
                        (op) => `
                        <div class="product-item">
                            <h3>${op.product.name}</h3>
                            <p><strong>Quantité:</strong> ${op.quantity}</p>
                            <p><strong>Prix:</strong> ${
                              op.product.price
                            } CFA</p>
                            <p><strong>Unité:</strong> ${op.product.unit}</p>
                            <p><strong>Catégorie:</strong> ${
                              op.product.category
                            }</p>
                            ${
                              op.product.description
                                ? `<p><strong>Description:</strong> ${op.product.description}</p>`
                                : ""
                            }
                            <p><strong>En stock:</strong> ${
                              op.product.isInStock ? "Oui" : "Non"
                            }</p>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </body>
            </html>
        `;
    return html;
  };

  const handlePrint = () => {
    const html = generateOrderHTML();
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <PageShell>
      <HeaderContainer>
        <div>
          <HeaderTitle>Commande #{order.order.orderId.slice(0, 8)}</HeaderTitle>
          <HeaderSubtitle>
            Informations détaillées de la commande
          </HeaderSubtitle>
        </div>
        <div className="flex flex-row gap-4 justify-center items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrint}
            className="w-10 h-10"
          >
            <Printer className="w-4 h-4" />
          </Button>
          <OrderEditDialog order={order.order} />
        </div>
      </HeaderContainer>

      <div className="flex flex-col gap-4 p-8 w-full">
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">Informations générales</h3>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-sm text-gray-500">Status:</span>
              <StatusBadge variant={orderStatusVariant(order.order.status)}>
                {order.order.status}
              </StatusBadge>
              <span className="text-sm text-gray-500">Client ID:</span>
              <span className="text-sm">{order.order.userId}</span>
              <span className="text-sm text-gray-500">ID vendeur:</span>
              <span className="text-sm">
                {order.order.agentId ? order.order.agentId : "N/A"}
              </span>
              <span className="text-sm text-gray-500">Livreur ID:</span>
              <span className="text-sm">
                {order.order.shipperId ? order.order.shipperId : "N/A"}
              </span>
              <span className="text-sm text-gray-500">Adresse:</span>
              <span className="text-sm">{order.order.address}</span>
              <span className="text-sm text-gray-500">Heure de livraison:</span>
              <span className="text-sm">{order.order.deliveryTime}</span>
              <span className="text-sm text-gray-500">
                Méthode de paiement:
              </span>
              <span className="text-sm">{order.order.paymentMethod}</span>
              {order.order.promoCode && (
                <>
                  <span className="text-sm text-gray-500">Code promo:</span>
                  <span className="text-sm">{order.order.promoCode.code}</span>
                </>
              )}
              {order.order.cancellationReason && (
                <>
                  <span className="text-sm text-gray-500">
                    Raison d'annulation:
                  </span>
                  <span className="text-sm">
                    {order.order.cancellationReason}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">Localisation</h3>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-sm text-gray-500">Latitude:</span>
              <span className="text-sm">{order.order.locationX}</span>
              <span className="text-sm text-gray-500">Longitude:</span>
              <span className="text-sm">{order.order.locationY}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Produits commandés</h3>
            <div className="flex gap-4 items-center">
              <Input
                type="text"
                placeholder="Rechercher un produit"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <TableContainer>
            <TableRow className="bg-brand-green-light/50">
              <TableHeader>NOM</TableHeader>
              <TableHeader>PRIX UNITAIRE</TableHeader>
              <TableHeader>QUANTITÉ</TableHeader>
              <TableHeader>TOTAL</TableHeader>
              <TableHeader>VENDEUR</TableHeader>
            </TableRow>
            {filteredProducts?.map((product) => (
              <TableRow key={product.product.productId}>
                <TableCell>{product.product.name}</TableCell>
                <TableCell>{product.product.price} XOF</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  {(product.product.price * product.quantity).toFixed(2)} XOF
                </TableCell>
                <TableCell>{product.sellerName}</TableCell>
              </TableRow>
            ))}
          </TableContainer>
        </div>
      </div>
    </PageShell>
  );
};

export default OrderScreen;

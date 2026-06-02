import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import * as React from "react";

export interface OrderCreatedTemplateProps {
  orderNumber: string;
  customerName: string;
  deliveryAddress: string;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
    unit: string;
  }>;
  totalAmount: number;
  paymentMethod: string;
  expectedDeliveryDate: string;
  areaCode: string;
}

export function OrderCreatedTemplate({
  orderNumber,
  customerName,
  deliveryAddress,
  products,
  totalAmount,
  paymentMethod,
  expectedDeliveryDate,
  areaCode,
}: OrderCreatedTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Notification de Commande - O'MARCHÉ Ivoire</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={header}>Notification de Commande</Heading>

          <Text style={paragraph}>Bonjour,</Text>

          <Text style={paragraph}>
            Une nouvelle commande vient d'être enregistrée dans la zone de{" "}
            {areaCode}. Voici les détails :
          </Text>

          <Section style={detailsSection}>
            <Text style={detailLine}>• Réf. Commande : {orderNumber}</Text>
            <Text style={detailLine}>• Client : {customerName}</Text>
            <Text style={detailLine}>
              • Adresse de livraison : {deliveryAddress}
            </Text>
            <Text style={detailLine}>
              • Produits :{" "}
              {products
                .map(
                  (product) =>
                    `${product.name} x ${product.quantity} ${product.unit} (${product.price.toLocaleString()} FCFA)`
                )
                .join(", ")}
            </Text>
            <Text style={detailLine}>
              • Montant total : {totalAmount.toLocaleString()} FCFA
            </Text>
            <Text style={detailLine}>• Mode de paiement : {paymentMethod}</Text>
            <Text style={detailLine}>
              • Date et heure de livraison prévues : {expectedDeliveryDate}
            </Text>
          </Section>

          <Text style={paragraph}>
            Merci de coordonner avec l'équipe pour assurer une livraison rapide
            et efficace.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            O'MARCHÉ Ivoire – La qualité à portée de main !
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const header = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  textAlign: "center" as const,
  margin: "30px 0",
};

const paragraph = {
  color: "#525252",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
  margin: "16px 0",
};

const detailsSection = {
  margin: "24px 0",
  padding: "0 24px",
};

const detailLine = {
  color: "#525252",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "8px 0",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#525252",
  fontSize: "14px",
  fontStyle: "italic",
  textAlign: "center" as const,
  margin: "32px 0 0",
};

export default OrderCreatedTemplate;

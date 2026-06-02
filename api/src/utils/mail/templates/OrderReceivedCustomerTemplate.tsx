import { Body, Container, Head, Heading, Html, Preview, Section, Text, Hr } from "@react-email/components";
import * as React from "react";

export interface OrderReceivedCustomerTemplateProps {
	customerName: string;
	orderNumber: string;
}

export function OrderReceivedCustomerTemplate({
	customerName,
	orderNumber,
}: OrderReceivedCustomerTemplateProps) {
	return (
		<Html>
			<Head />
			<Preview>Votre commande a bien été reçue</Preview>
			<Body style={main}>
				<Container style={container}>
					<Heading style={header}>Commande reçue</Heading>

					<Text style={paragraph}>Bonjour {customerName},</Text>

					<Section style={detailsSection}>
						<Text style={detailLine}>
							Nous avons bien reçu votre commande.
						</Text>
						<Text style={detailLine}>Référence : {orderNumber}</Text>
					</Section>

					<Text style={paragraph}>
						Vous recevrez des mises à jour au fur et à mesure du traitement.
					</Text>

					<Hr style={hr} />
					<Text style={footer}>
						O&apos;MARCHÉ Ivoire – La qualité à portée de main !
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

export default OrderReceivedCustomerTemplate;


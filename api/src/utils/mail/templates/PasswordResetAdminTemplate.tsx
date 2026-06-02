import {
	Body,
	Button,
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

export interface PasswordResetAdminTemplateProps {
	roleLabel: string;
	phoneLastDigits: string;
	approveUrl: string;
}

export function PasswordResetAdminTemplate({
	roleLabel,
	phoneLastDigits,
	approveUrl,
}: PasswordResetAdminTemplateProps) {
	return (
		<Html>
			<Head />
			<Preview>Réinitialisation mot de passe — action requise</Preview>
			<Body style={main}>
				<Container style={container}>
					<Heading style={header}>Demande de réinitialisation</Heading>
					<Text style={paragraph}>
						Un utilisateur a demandé la réinitialisation de son mot de passe.
					</Text>
					<Section style={detailsSection}>
						<Text style={detailLine}>Profil : {roleLabel}</Text>
						<Text style={detailLine}>
							Téléphone (fin) : …{phoneLastDigits}
						</Text>
					</Section>
					<Section style={{ textAlign: "center" as const, margin: "32px 0" }}>
						<Button href={approveUrl} style={btn}>
							Réinitialiser
						</Button>
					</Section>
					<Text style={small}>
						Si vous n&apos;êtes pas à l&apos;origine de cette demande ou si elle
						vous semble suspecte, ignorez cet e-mail.
					</Text>
					<Hr style={hr} />
					<Text style={footer}>O&apos;MARCHÉ Ivoire</Text>
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
	fontSize: "22px",
	fontWeight: "600" as const,
	textAlign: "center" as const,
	margin: "30px 0",
};

const paragraph = {
	color: "#525252",
	fontSize: "16px",
	lineHeight: "24px",
	textAlign: "left" as const,
	margin: "16px 24px",
};

const detailsSection = {
	margin: "16px 24px",
	padding: "16px",
	backgroundColor: "#f4f4f5",
	borderRadius: "8px",
};

const detailLine = {
	color: "#3f3f46",
	fontSize: "14px",
	lineHeight: "22px",
	margin: "4px 0",
};

const btn = {
	backgroundColor: "#ea580c",
	color: "#ffffff",
	padding: "12px 28px",
	borderRadius: "8px",
	fontWeight: "600" as const,
	fontSize: "16px",
	textDecoration: "none",
};

const small = {
	color: "#71717a",
	fontSize: "13px",
	lineHeight: "20px",
	margin: "24px 24px 0",
	textAlign: "left" as const,
};

const hr = {
	borderColor: "#e4e4e7",
	margin: "32px 24px 16px",
};

const footer = {
	color: "#a1a1aa",
	fontSize: "12px",
	textAlign: "center" as const,
	margin: "0 24px",
};

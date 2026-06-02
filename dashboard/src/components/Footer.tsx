import { Link } from 'react-router-dom';

const Footer = (): JSX.Element => {
    return (
        <footer className="mt-auto w-full border-t border-border/60 bg-card/80">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-center gap-8 px-4 sm:px-6">
                <FooterLink to="https://app.omarcheivoire.ci/public/PRESENTATION-OMARCHE.pdf">
                    Notre entreprise
                </FooterLink>
                <span className="hidden h-4 w-px bg-border sm:block" aria-hidden />
                <FooterLink to="https://app.omarcheivoire.ci/public/NUMERO-DE-TABLES.pdf">
                    Pour les épiceries
                </FooterLink>
            </div>
        </footer>
    );
};

interface FooterLinkProps {
    children: React.ReactNode;
    to: string;
}

const FooterLink = ({ children, to }: FooterLinkProps): JSX.Element => {
    return (
        <Link
            target="_blank"
            rel="noopener noreferrer"
            to={to}
            className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-brand-green-dark"
        >
            {children}
        </Link>
    );
};

export default Footer;

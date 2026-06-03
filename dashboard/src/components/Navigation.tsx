import { ButtonHTMLAttributes } from 'react';
import { LinkProps, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/redux/slices/authSlice';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import clsx from 'clsx';
import { PUBLIC_WEBSITE_URL } from '@/config/site';

const LOGO_SRC = '/logo-omarche-ivoire.png';

const NavigationBar = ({ children }: { children: React.ReactNode }): JSX.Element => {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/80 bg-card/95 shadow-sm backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-1 px-4 sm:px-6">
                {children}
            </div>
        </nav>
    );
};

export const NavigationLogo = (): JSX.Element => {
    return (
        <NavLink
            to="/"
            className="group mr-2 flex shrink-0 items-center gap-2 rounded-lg pr-2 transition-colors hover:bg-muted/60 sm:mr-4 sm:gap-3 sm:pr-3"
        >
            <img
                src={LOGO_SRC}
                alt="O'Marché Ivoire"
                className="h-9 w-auto max-w-[120px] object-contain sm:h-10 sm:max-w-[140px]"
            />
            <div className="hidden flex-col lg:flex">
                <span className="text-sm font-semibold leading-tight text-foreground">
                    O&apos;Marché Ivoire
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-brand-green">
                    SGI
                </span>
            </div>
        </NavLink>
    );
};

export const NavigationWebsiteLink = (): JSX.Element => {
    return (
        <a
            href={PUBLIC_WEBSITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mr-1 flex items-center gap-2 rounded-lg border border-brand-green/25 bg-brand-green-light/50 px-2.5 py-2 text-sm font-medium text-brand-green-dark transition-colors hover:bg-brand-green-light sm:px-3"
            title="Ouvrir le site vitrine O'Marché Ivoire"
        >
            <FaArrowUpRightFromSquare className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>Site web</span>
        </a>
    );
};

export const NavigationLink = ({ children }: { children: React.ReactNode }): JSX.Element => {
    return <span className="text-sm font-medium">{children}</span>;
};

interface NavigationLinkContainerProps extends LinkProps {
    children: React.ReactNode;
    hideForAreaAdmin?: boolean;
}

export const NavigationLinkContainer = ({
    hideForAreaAdmin = false,
    ...props
}: NavigationLinkContainerProps): JSX.Element | null => {
    const user = useSelector(selectCurrentUser);

    if (hideForAreaAdmin && user?.areaCode) {
        return null;
    }

    return (
        <NavLink
            {...props}
            className={({ isActive }) =>
                clsx(
                    'flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                    isActive
                        ? 'bg-brand-green text-white shadow-sm'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
            }
        >
            {props.children}
        </NavLink>
    );
};

interface NavigationButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const NavigationButton = (props: NavigationButtonProps): JSX.Element => {
    return (
        <button
            {...props}
            className="ml-auto flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
        >
            {props.children}
        </button>
    );
};

export default NavigationBar;

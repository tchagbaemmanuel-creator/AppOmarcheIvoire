import { ButtonHTMLAttributes } from 'react';
import { LinkProps, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/redux/slices/authSlice';
import { FaBasketShopping } from 'react-icons/fa6';
import clsx from 'clsx';

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
            className="group mr-4 flex shrink-0 items-center gap-3 rounded-lg pr-3 transition-colors hover:bg-muted/60"
        >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-green shadow-sm">
                <FaBasketShopping className="h-4 w-4 text-white" aria-hidden />
            </div>
            <div className="hidden flex-col sm:flex">
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

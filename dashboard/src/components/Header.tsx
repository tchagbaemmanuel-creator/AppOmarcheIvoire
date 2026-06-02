import clsx from "clsx";

export const HeaderContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}): JSX.Element => {
    return (
        <div
            className={clsx(
                "flex flex-col gap-4 border-b border-border/60 bg-muted/30 p-6 sm:flex-row sm:items-end sm:justify-between",
                className
            )}
        >
            {children}
        </div>
    );
};

export const HeaderTitle = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}): JSX.Element => {
    return (
        <h1
            className={clsx(
                "text-xl font-semibold tracking-tight text-foreground",
                className
            )}
        >
            {children}
        </h1>
    );
};

export const HeaderSubtitle = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}): JSX.Element => {
    return (
        <p className={clsx("mt-1 text-sm text-muted-foreground", className)}>
            {children}
        </p>
    );
};

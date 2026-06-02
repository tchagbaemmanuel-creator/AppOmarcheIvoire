import clsx from "clsx";

export const TableContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}): JSX.Element => {
    return (
        <div className="w-full overflow-x-auto">
            <table className={clsx("w-full text-left", className)}>{children}</table>
        </div>
    );
};

export const TableRow = ({
    children,
    className,
    onClick,
}: {
    children: React.ReactNode;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLTableRowElement>) => void;
}): JSX.Element => {
    return (
        <tr
            className={clsx(
                "border-b border-border/50 transition-colors duration-150 last:border-0",
                onClick && "cursor-pointer hover:bg-brand-green-light/40",
                className
            )}
            onClick={onClick}
        >
            {children}
        </tr>
    );
};

export const TableCell = ({
    children,
    className,
    onClick,
}: {
    children: React.ReactNode;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLTableCellElement>) => void;
}): JSX.Element => {
    return (
        <td
            className={clsx("px-6 py-3 text-sm text-foreground/90", className)}
            onClick={onClick}
        >
            {children}
        </td>
    );
};

export const TableHeader = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}): JSX.Element => {
    return (
        <th
            className={clsx(
                "px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brand-green-dark",
                className
            )}
        >
            {children}
        </th>
    );
};

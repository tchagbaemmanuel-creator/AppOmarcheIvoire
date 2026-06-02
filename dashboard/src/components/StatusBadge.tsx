import clsx from "clsx";

type BadgeVariant = "success" | "warning" | "danger" | "neutral" | "info" | "purple";

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-brand-green-light text-brand-green-dark",
  warning: "bg-brand-orange-light text-brand-orange-dark",
  danger: "bg-red-100 text-red-800",
  neutral: "bg-slate-100 text-slate-700",
  info: "bg-blue-100 text-blue-800",
  purple: "bg-purple-100 text-purple-800",
};

export const StatusBadge = ({
  children,
  variant = "neutral",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}): JSX.Element => (
  <span
    className={clsx(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      variantStyles[variant],
      className
    )}
  >
    {children}
  </span>
);

export const orderStatusVariant = (status: string): BadgeVariant => {
  switch (status) {
    case "DELIVERED":
      return "success";
    case "COLLECTING":
      return "warning";
    case "DELIVERING":
      return "purple";
    case "PROCESSING":
    case "PROCESSED":
      return "info";
    case "IDLE":
      return "neutral";
    default:
      return "danger";
  }
};

import { LoaderCircle, type LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

import { Button } from "@/components/legal/Button";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  icon?: LucideIcon;
  variant?: "primary" | "outline";
};

export function AuthButton({
  loading,
  icon: Icon,
  children,
  variant = "primary",
  disabled,
  ...props
}: Props) {
  return (
    <Button variant={variant} className="w-full" disabled={disabled || loading} {...props}>
      {loading ? (
        <LoaderCircle className="animate-spin" size={18} />
      ) : Icon ? (
        <Icon size={18} />
      ) : null}
      {children}
    </Button>
  );
}

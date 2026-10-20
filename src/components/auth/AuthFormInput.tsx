import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { forwardRef, useState, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: LucideIcon;
  error?: string;
  helperText?: string;
};

export const AuthFormInput = forwardRef<HTMLInputElement, Props>(function AuthFormInput(
  { label, icon: Icon, error, helperText, type, id, className, ...props },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const password = type === "password";
  const describedBy = error ? `${id}-error` : helperText ? `${id}-helper` : undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label}
        {props.required && <span className="text-destructive"> *</span>}
      </label>
      <div className="relative">
        <Icon
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <input
          ref={ref}
          id={id}
          type={password && visible ? "text" : type}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            "h-12 w-full rounded-md border border-input bg-background pl-11 pr-11 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15",
            error && "border-destructive focus:border-destructive focus:ring-destructive/15",
            className,
          )}
          {...props}
        />
        {password && (
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${id}-helper`} className="mt-1.5 text-xs text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  );
});

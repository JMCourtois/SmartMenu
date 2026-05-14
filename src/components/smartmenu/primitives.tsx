import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { RestaurantThemeView } from "@/types/menu";

export function getSmartMenuThemeStyle(theme: RestaurantThemeView): CSSProperties {
  return {
    "--accent": theme.accent,
    "--accent-dark": theme.accentDark,
    "--accent-soft": theme.accentSoft,
    "--secondary": theme.secondary,
    "--secondary-soft": theme.secondarySoft,
    "--theme-ink": theme.ink,
    "--paper": theme.paper,
    "--menu-accent": theme.accent,
    "--menu-accent-dark": theme.accentDark,
    "--menu-accent-soft": theme.accentSoft,
    "--menu-secondary": theme.secondary,
    "--menu-secondary-soft": theme.secondarySoft,
    "--menu-ink": theme.ink,
    "--menu-paper": theme.paper,
    "--menu-muted": theme.muted,
  } as CSSProperties;
}

export function SmartMenuMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={cn("size-9 shrink-0", className)}
    >
      <rect width="64" height="64" rx="16" fill="#263B2E" />
      <g
        transform="translate(14 14)"
        stroke="#FBF8EF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 22h24v6H6z" />
        <path d="M30 22V12a6 6 0 0 0-12 0 6 6 0 0 0-12 0v10" />
        <path d="M6 28h24" />
        <path d="M12 16v6M24 16v6M18 12v10" />
      </g>
    </svg>
  );
}

export function SmartMenuLogo({
  label = "SmartMenu",
  sublabel,
  className,
}: {
  label?: string;
  sublabel?: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <SmartMenuMark />
      <span className="grid gap-0.5">
        <span className="font-display text-xl font-semibold leading-none text-[var(--ink)]">
          {label}
        </span>
        {sublabel ? (
          <span className="smart-eyebrow text-[9px] text-[var(--muted)]">
            {sublabel}
          </span>
        ) : null}
      </span>
    </span>
  );
}

export function SmartEyebrow({
  children,
  className,
  count,
}: {
  children: ReactNode;
  className?: string;
  count?: number;
}) {
  return (
    <p className={cn("smart-eyebrow m-0 text-[var(--secondary)]", className)}>
      {children}
      {count !== undefined ? (
        <span className="ml-2 text-[var(--muted)]">
          · {String(count).padStart(2, "0")}
        </span>
      ) : null}
    </p>
  );
}

export function SmartPrice({
  children,
  className,
  size = "md",
}: {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span
      className={cn(
        "font-price whitespace-nowrap font-medium leading-none text-[var(--accent-dark)]",
        size === "sm" && "text-xs",
        size === "md" && "text-[15px]",
        size === "lg" && "text-xl",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function DotLeader({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("dot-leader", className)} />;
}

export function SmartBadge({
  children,
  variant = "paper",
  className,
}: {
  children: ReactNode;
  variant?: "paper" | "accent" | "secondary" | "danger" | "outline";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-fit shrink-0 items-center gap-1 rounded-full px-2.5 text-[11px] font-medium leading-none",
        variant === "paper" && "bg-[var(--paper-warm)] text-[var(--ink)] shadow-[var(--ring-hairline)]",
        variant === "accent" && "bg-[var(--accent)] text-white",
        variant === "secondary" && "bg-[var(--secondary-soft)] text-[var(--accent-dark)]",
        variant === "danger" &&
          "bg-[var(--danger-soft)] text-[var(--danger)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--danger)_18%,transparent)]",
        variant === "outline" && "bg-[var(--white)] text-[var(--ink)] shadow-[var(--ring-hairline)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SmartSurface({
  children,
  className,
  as = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "article" | "div" | "aside";
}) {
  const Component = as;

  return (
    <Component
      className={cn("surface-card rounded-[var(--radius-lg)]", className)}
    >
      {children}
    </Component>
  );
}

export function SmartHairline({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("block h-px flex-1 bg-[var(--hairline)]", className)}
    />
  );
}

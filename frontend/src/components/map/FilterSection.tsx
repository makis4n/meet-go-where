import type { ReactNode } from "react";

interface FilterSectionProps {
  label: string;
  children: ReactNode;
  noBorder?: boolean;
}

export function FilterSection({ label, children, noBorder }: FilterSectionProps) {
  return (
    <div
      style={{
        marginBottom: noBorder ? 0 : 22,
        paddingBottom: noBorder ? 0 : 22,
        borderBottom: noBorder ? "none" : "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <p
        style={{
          fontFamily: "monospace",
          fontSize: 10,
          color: "#94a3b8",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

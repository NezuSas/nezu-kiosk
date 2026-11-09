import type { SVGProps } from "react";

/** Iconos de trazo del kiosko, 24×24, heredan el color del texto. */
export type IconName =
  | "arrow-left"
  | "arrow-right"
  | "chevron-right"
  | "plus"
  | "minus"
  | "check"
  | "close"
  | "trash"
  | "list"
  | "home"
  | "phone"
  | "mail"
  | "pin"
  | "clock"
  | "printer"
  | "qr"
  | "whatsapp";

const paths: Record<IconName, string> = {
  "arrow-left": "M19 12H5m7-7-7 7 7 7",
  "arrow-right": "M5 12h14m-7-7 7 7-7 7",
  "chevron-right": "m9 6 6 6-6 6",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  check: "m5 12 5 5L20 7",
  close: "M6 6l12 12M18 6 6 18",
  trash: "M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3",
  list: "M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01",
  home: "M3 11 12 3l9 8v10h-6v-6H9v6H3z",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  mail: "M4 6h16v12H4zm0 0 8 7 8-7",
  pin: "M12 21s-7-6.5-7-11.5a7 7 0 0 1 14 0C19 14.5 12 21 12 21zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-13v5l3 2",
  printer: "M7 8V3h10v5M7 17H4v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6h-3M7 14h10v7H7z",
  qr: "M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h2v2h-2zm4 0h2v2h-2zm-4 4h2v2h-2zm4 0h2v2h-2z",
  whatsapp:
    "M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3zm4.2 12.4c-.2.5-1 1-1.5 1-.4 0-.9.2-3-.7-2.5-1-4.1-3.6-4.2-3.8-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.1.1.3 0 .5l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3.1.2.1.8-.1 1.2z",
};

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  /** Tamaño en píxeles CSS; por defecto 1.2em para seguir al texto. */
  size?: number | string;
}

export const Icon = ({ name, size = "1.2em", ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={name === "whatsapp" ? "currentColor" : "none"}
    stroke={name === "whatsapp" ? "none" : "currentColor"}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path d={paths[name]} />
  </svg>
);

/** Une nombres de clase, ignorando los falsos. */
export const cn = (...classes: Array<string | false | null | undefined>): string => classes.filter(Boolean).join(" ");

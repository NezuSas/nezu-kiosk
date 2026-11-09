export interface Currency {
  /** Código ISO 4217, por ejemplo `USD`. */
  code: string;
  /** Configuración regional para el formato, por ejemplo `es-EC`. */
  locale: string;
}

/** Devuelve un formateador de precios para la moneda indicada. */
export const priceFormatter = (currency: Currency) => {
  const format = new Intl.NumberFormat(currency.locale, { style: "currency", currency: currency.code });
  return (amount: number): string => format.format(amount);
};

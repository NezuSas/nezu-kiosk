import { useKiosk } from "@/app/kiosk";
import { Footer } from "@/ui/layout";

/** El pie del kiosko con los datos de contacto de la configuración. */
export const KioskFooter = () => {
  const { config } = useKiosk();
  const { business, credit } = config;
  return (
    <Footer
      phone={business.phoneDisplay}
      email={business.email}
      address={business.address}
      hours={business.hours}
      credit={credit.show ? { label: credit.label, url: credit.url } : undefined}
    />
  );
};

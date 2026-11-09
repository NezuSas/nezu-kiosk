import { useImagePreloader } from "@/hooks/useImagePreloader";
import { asset } from "@/utils/asset";
import { kioskConfig } from "@/kiosk.config";
import { CATEGORIES } from "@/pages/Categories/Categories.constants";

/** Warms the browser cache with the images every screen needs: background, logos and the category covers. */
const GlobalImagePreloader = () => {
  const { theme, business } = kioskConfig;
  useImagePreloader([
    ...(theme.backgroundImage ? [asset(theme.backgroundImage)] : []),
    asset(business.logo),
    asset(business.logoColor),
    ...CATEGORIES.map((category) => category.imageUrl),
  ]);
  return null;
};

export default GlobalImagePreloader;

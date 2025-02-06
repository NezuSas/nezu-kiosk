import { useNavigate } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { PlayIcon } from "@/components/common/PlayIcon";
import styles from "./Home.module.css";

const LOGO_PATH = "/images/logo.avif";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <img
        src={LOGO_PATH}
        alt="Nezu"
        className={styles.logo}
        width={400}
        height={400}
        loading="eager"
        decoding="async"
        sizes="(max-width: 768px) 200px, 400px"
      />
      <div className={styles.buttonContainer}>
        <Button
          width="100%"
          onClick={() => navigate("/categories")}
        >
          <PlayIcon />
          <span>Iniciar</span>
        </Button>
      </div>
    </div>
  );
};

export default Home;

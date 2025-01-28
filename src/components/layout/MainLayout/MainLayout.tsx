import { type MainLayoutProps } from './MainLayout.types';
import styles from './MainLayout.module.css';

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};
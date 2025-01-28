import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/Card/Card';
import { CATEGORIES } from './Categories.constants';
import styles from './Categories.module.css';
import { PRINTER_T20III_VM } from '../../integrations/printer/PrinterConstants';

export const Categories = () => {
  const navigate = useNavigate();

  const handlePrinterClick = () => {
    navigate(`/printers/${PRINTER_T20III_VM.id}`);
  };

  return (
    <div className={styles.container}>
      {CATEGORIES.map(category => (
        <Card
          key={category.id}
          title={category.title}
          imageUrl={category.imageUrl}
          onClick={() => navigate(`/categories/${category.id}`)}
        />
      ))}
      <Card
        title={PRINTER_T20III_VM.name}
        imageUrl={PRINTER_T20III_VM.imageUrl}
        onClick={handlePrinterClick} // Redirige a la ruta de la impresora
      />
    </div>
  );
};
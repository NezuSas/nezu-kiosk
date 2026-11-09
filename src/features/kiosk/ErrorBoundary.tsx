import { Component, type ErrorInfo, type ReactNode } from "react";
import type { EventSink } from "@/domain/analytics";
import type { KioskTexts } from "@/config/texts";
import { Button } from "@/ui/primitives";
import styles from "./ErrorBoundary.module.css";

interface ErrorBoundaryProps {
  texts: KioskTexts["kiosk"];
  events: EventSink;
  /** Ruta base a la que volver; recarga la aplicación entera para empezar limpio. */
  homeHref: string;
  children: ReactNode;
}

interface ErrorBoundaryState {
  failed: boolean;
}

/** Si una pantalla lanza un error, el tótem muestra una salida clara en vez de quedarse en blanco. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.events.track({ name: "error", ref: `${error.name}: ${error.message}`.slice(0, 120), screen: info.componentStack?.slice(0, 80) });
    void this.props.events.flush();
  }

  render() {
    if (!this.state.failed) return this.props.children;
    const { texts, homeHref } = this.props;
    return (
      <div className={styles.wrap} role="alert">
        <h1 className={styles.title}>{texts.errorTitle}</h1>
        <p className={styles.body}>{texts.errorBody}</p>
        <Button size="large" icon="home" onClick={() => window.location.assign(homeHref)}>
          {texts.errorAction}
        </Button>
      </div>
    );
  }
}

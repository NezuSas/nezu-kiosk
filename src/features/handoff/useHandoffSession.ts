import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useKiosk } from "@/app/kiosk";
import { phoneUrl, summarizeSelection } from "@/domain/request";
import { useSelectionStore } from "@/state/selectionStore";
import { useHandoffStore } from "@/state/handoffStore";

const newSessionId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

/**
 * Abre una sesión de traspaso mientras `active` sea verdadero: genera el identificador, escucha el canal y, cuando
 * el teléfono responde, lleva al kiosko a la pantalla que corresponde al modo y al método de pago.
 */
export const useHandoffSession = (active: boolean): { url: string | null } => {
  const navigate = useNavigate();
  const { config, handoff, phoneUrl: base } = useKiosk();
  const selection = useSelectionStore((state) => state.selection);
  const sessionId = useHandoffStore((state) => state.sessionId);
  const open = useHandoffStore((state) => state.open);
  const receive = useHandoffStore((state) => state.receive);

  useEffect(() => {
    if (active && !sessionId) open(newSessionId());
  }, [active, sessionId, open]);

  useEffect(() => {
    if (!active || !sessionId) return;
    return handoff.listen(sessionId, (submission) => {
      receive(submission);
      if (config.mode === "quote") navigate("/thanks");
      else navigate(submission.paymentMethod === "card" ? "/card" : "/payment");
    });
  }, [active, sessionId, handoff, receive, navigate, config.mode]);

  const url = useMemo(
    () => (active && sessionId ? phoneUrl(base, sessionId, summarizeSelection(selection)) : null),
    [active, sessionId, base, selection]
  );

  return { url };
};

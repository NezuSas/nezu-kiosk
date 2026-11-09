import { appendFile, mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Registro de solicitudes en disco: un archivo por día en formato JSON Lines (`leads-AAAA-MM-DD.jsonl`), una
 * solicitud por línea. Es la copia de seguridad de lo que entra, independiente de que el correo o el webhook
 * funcionen; se lee con cualquier herramienta de texto.
 */
export class JsonlLeadStore {
  #dir;

  constructor(dir) {
    this.#dir = dir;
  }

  fileFor(date) {
    return join(this.#dir, `leads-${date.toISOString().slice(0, 10)}.jsonl`);
  }

  async save(lead) {
    await mkdir(this.#dir, { recursive: true });
    await appendFile(this.fileFor(new Date(lead.receivedAt)), `${JSON.stringify(lead)}\n`, "utf8");
  }

  /** Solicitudes de un día, en orden de llegada; vacío si no hay archivo. */
  async list(date) {
    try {
      const raw = await readFile(this.fileFor(date), "utf8");
      return raw
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line));
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw error;
    }
  }
}

/** Almacén nulo para cuando no se configura carpeta: no guarda nada y lo dice una vez. */
export class NoopLeadStore {
  async save() {}
  async list() {
    return [];
  }
}

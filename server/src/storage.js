import { appendFile, mkdir, readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Registro en disco por días en formato JSON Lines (`<prefijo>-AAAA-MM-DD.jsonl`), un registro por línea. Es la
 * copia de seguridad de lo que entra, independiente de correos o webhooks, y se lee con cualquier herramienta de
 * texto. Se usa para solicitudes, eventos de uso y confirmaciones de pago.
 */
export class JsonlStore {
  #dir;
  #prefix;

  constructor(dir, prefix) {
    this.#dir = dir;
    this.#prefix = prefix;
  }

  fileFor(date) {
    return join(this.#dir, `${this.#prefix}-${date.toISOString().slice(0, 10)}.jsonl`);
  }

  /** Añade un registro; `at` decide el archivo del día (por defecto, `receivedAt` o ahora). */
  async save(record, at = record.receivedAt ? new Date(record.receivedAt) : new Date()) {
    await mkdir(this.#dir, { recursive: true });
    await appendFile(this.fileFor(at), `${JSON.stringify(record)}\n`, "utf8");
  }

  /** Registros de un día, en orden de llegada; vacío si no hay archivo. */
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

  /** Cuántos registros hay por día (`{ "AAAA-MM-DD": n }`), leyendo solo los archivos de este prefijo. */
  async countByDay() {
    let names;
    try {
      names = await readdir(this.#dir);
    } catch (error) {
      if (error.code === "ENOENT") return {};
      throw error;
    }
    const counts = {};
    for (const name of names) {
      const match = name.match(new RegExp(`^${this.#prefix}-(\\d{4}-\\d{2}-\\d{2})\\.jsonl$`));
      if (!match) continue;
      const raw = await readFile(join(this.#dir, name), "utf8");
      counts[match[1]] = raw.split("\n").filter(Boolean).length;
    }
    return counts;
  }
}

/** Almacén nulo para cuando no se configura carpeta: no guarda nada. */
export class NoopStore {
  async save() {}
  async list() {
    return [];
  }
  async countByDay() {
    return {};
  }
}

export const JsonlLeadStore = class extends JsonlStore {
  constructor(dir) {
    super(dir, "leads");
  }
};

export const NoopLeadStore = NoopStore;

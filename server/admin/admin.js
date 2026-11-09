/*
 * Administración del kiosko: caja (pagos a la espera) y panel (estadísticas). Habla con /api/* del mismo servidor
 * usando el token de administración, que se guarda solo en la pestaña (sessionStorage).
 */
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const api = (path, options = {}) =>
    fetch(path, {
      ...options,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionStorage.getItem("kiosk-admin-token") ?? ""}`, ...(options.headers ?? {}) },
    }).then(async (response) => {
      if (response.status === 401 || response.status === 503) throw new Error(response.status === 401 ? "Token incorrecto." : "El servidor no tiene ADMIN_TOKEN configurado.");
      if (!response.ok) throw new Error(`El servidor respondió ${response.status}.`);
      return response.json();
    });

  const money = new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" });
  const when = (iso) => new Date(iso).toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" });
  const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const EVENT_LABELS = {
    screen_view: "Pantallas vistas",
    service_added: "Servicios añadidos",
    service_removed: "Servicios quitados",
    selection_opened: "Solicitudes abiertas",
    handoff_opened: "Códigos QR mostrados",
    idle_reset: "Vueltas al inicio por reposo",
    language_changed: "Cambios de idioma",
    payment_confirmed: "Pagos confirmados en pantalla",
    error: "Errores en pantalla",
  };

  const setStatus = (text, error = false) => {
    const status = $("#status");
    status.textContent = text;
    status.className = error ? "flash error" : "muted";
  };

  const flash = (container, text, error = false) => {
    const note = document.createElement("div");
    note.className = `flash${error ? " error" : ""}`;
    note.textContent = text;
    container.prepend(note);
    setTimeout(() => note.remove(), 4000);
  };

  // ── Caja ────────────────────────────────────────────────────────────────────────────────────────────────────
  const renderPending = (entries) => {
    const list = $("#pending");
    if (!entries.length) {
      list.innerHTML = '<div class="empty">Nadie está esperando un cobro ahora mismo.</div>';
      return;
    }
    list.innerHTML = entries
      .map(
        (entry) => `
      <article class="pending" data-session="${escape(entry.sessionId)}">
        <div>
          <div class="who">${escape(entry.customer)} <span class="badge">${entry.paymentMethod === "card" ? "tarjeta" : "QR"}</span></div>
          <div class="meta">${when(entry.receivedAt)} · sesión <code>${escape(entry.sessionId.slice(0, 8))}</code>${entry.taxId ? ` · RUC ${escape(entry.taxId)}` : ""}</div>
        </div>
        <div class="total">${entry.total === undefined ? "" : money.format(entry.total)}</div>
        <div class="items">${entry.items.map((item) => `${escape(item.name)}${item.quantity > 1 ? ` ×${item.quantity}` : ""}`).join(" · ") || "sin detalle"}</div>
        <form>
          <input name="reference" placeholder="Referencia del cobro" />
          <input name="amount" type="number" step="0.01" min="0" placeholder="Importe" value="${entry.total === undefined ? "" : entry.total.toFixed(2)}" />
          <button type="submit" class="button">Confirmar cobro</button>
        </form>
      </article>`
      )
      .join("");
    list.querySelectorAll("article form").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const article = form.closest("article");
        const entry = entries.find((item) => item.sessionId === article.dataset.session);
        confirm({
          sessionId: entry.sessionId,
          method: entry.paymentMethod,
          reference: form.reference.value.trim(),
          amount: form.amount.value === "" ? undefined : Number(form.amount.value),
          confirmedBy: "caja",
        }, form.querySelector("button"));
      });
    });
  };

  const loadPending = () =>
    api("/api/payments/pending")
      .then((data) => renderPending(data.pending))
      .catch((error) => setStatus(error.message, true));

  const confirm = (payload, button) => {
    if (button) button.disabled = true;
    return api("/api/payments/confirm", { method: "POST", body: JSON.stringify(payload) })
      .then((data) => {
        flash($("#pending").parentElement, data.kioskNotified ? "Cobro confirmado; la pantalla del kiosko avanzó." : "Cobro registrado. El kiosko ya no estaba a la espera.");
        return Promise.all([loadPending(), loadStats()]);
      })
      .catch((error) => flash($("#pending").parentElement, error.message, true))
      .finally(() => {
        if (button) button.disabled = false;
      });
  };

  $("#manual-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    confirm({
      sessionId: form.sessionId.value.trim(),
      method: form.method.value,
      reference: form.reference.value.trim(),
      amount: form.amount.value === "" ? undefined : Number(form.amount.value),
      confirmedBy: "caja",
    }, form.querySelector("button")).then(() => form.reset());
  });

  // ── Panel ───────────────────────────────────────────────────────────────────────────────────────────────────
  const renderStats = (stats) => {
    const sum = (key) => stats.days.reduce((total, day) => total + day[key], 0);
    $("#tiles").innerHTML = [
      ["Solicitudes", sum("leads")],
      ["Pagos confirmados", sum("payments")],
      ["Servicios añadidos", stats.events.service_added ?? 0],
      ["Códigos QR mostrados", stats.events.handoff_opened ?? 0],
    ]
      .map(([label, value]) => `<div class="tile"><div class="n">${value}</div><div class="l">${label}</div></div>`)
      .join("");

    const max = Math.max(1, ...stats.days.map((day) => day.events));
    $("#days tbody").innerHTML = stats.days
      .map(
        (day) => `<tr>
          <td>${new Date(`${day.day}T12:00:00Z`).toLocaleDateString("es-EC", { weekday: "short", day: "2-digit", month: "short" })}</td>
          <td class="num">${day.leads}</td><td class="num">${day.payments}</td><td class="num">${day.events}</td>
          <td style="width:30%"><div class="bar" style="width:${Math.round((day.events / max) * 100)}%"></div></td>
        </tr>`
      )
      .join("");

    $("#top").innerHTML = stats.topServices.length
      ? stats.topServices.map((item) => `<li><span>${escape(item.ref)}</span><span class="n">${item.count}</span></li>`).join("")
      : '<li class="muted">Todavía no hay servicios añadidos esta semana.</li>';

    const events = Object.entries(stats.events).sort((a, b) => b[1] - a[1]);
    $("#events tbody").innerHTML = events.length
      ? events.map(([name, count]) => `<tr><td>${EVENT_LABELS[name] ?? escape(name)}</td><td class="num">${count}</td></tr>`).join("")
      : '<tr><td class="muted">Sin eventos esta semana.</td></tr>';
  };

  const loadStats = () =>
    api("/api/stats")
      .then(renderStats)
      .catch((error) => setStatus(error.message, true));

  // ── Arranque ────────────────────────────────────────────────────────────────────────────────────────────────
  const start = () =>
    Promise.all([loadPending(), loadStats()]).then(() => {
      $("#app").hidden = false;
      setStatus("Conectado. La caja se actualiza sola cada 15 segundos.");
      clearInterval(start.timer);
      start.timer = setInterval(loadPending, 15000);
    });

  $("#token-form").addEventListener("submit", (event) => {
    event.preventDefault();
    sessionStorage.setItem("kiosk-admin-token", $("#token").value.trim());
    start();
  });
  $("#refresh-pending").addEventListener("click", loadPending);
  $("#refresh-stats").addEventListener("click", loadStats);

  if (sessionStorage.getItem("kiosk-admin-token")) {
    $("#token").value = sessionStorage.getItem("kiosk-admin-token");
    start();
  }
})();

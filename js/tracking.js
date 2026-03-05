/**
 * Tracking: envía eventos a Google Sheets vía Apps Script (Web App).
 * Configura window.CuadernoMagicoConfig.trackingUrl con la URL /exec de tu Web App.
 * Las fechas se envían en hora local del equipo/navegador.
 */

function formatLocalTime(dateOrIso) {
  var d = dateOrIso ? new Date(dateOrIso) : new Date();
  if (isNaN(d.getTime())) return null;
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) +
    " " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
}

var Tracking = {
  send: function (eventType, data) {
    try {
      var cfg = window.CuadernoMagicoConfig || {};
      if (!cfg.trackingUrl) return;

      var payload = {
        type: eventType,
        sessionId: data.sessionId || null,
        user: data.user || null,
        grade: data.grade || null,
        subject: data.subject || null,
        topic: data.topic || null,
        topicName: data.topicName || null,
        startedAt: data.startedAt ? formatLocalTime(data.startedAt) : null,
        endedAt: data.endedAt ? formatLocalTime(data.endedAt) : null,
        seconds: data.seconds != null ? data.seconds : null,
        reason: data.reason || null,
        extra: data.extra || null,
        clientTime: formatLocalTime()
      };

      fetch(cfg.trackingUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (res.ok) console.log("[CuadernoMagico] Tracking OK:", eventType, res.status);
          else console.warn("[CuadernoMagico] Tracking respuesta:", res.status, res.statusText);
        })
        .catch(function (err) {
          console.warn("[CuadernoMagico] Tracking error:", err && err.message ? err.message : err);
        });
    } catch (e) {}
  },

  sendBeacon: function (eventType, data) {
    try {
      var cfg = window.CuadernoMagicoConfig || {};
      if (!cfg.trackingUrl || !navigator.sendBeacon) return;
      var payload = {
        type: eventType,
        sessionId: data.sessionId || null,
        user: data.user || null,
        grade: data.grade || null,
        subject: data.subject || null,
        topic: data.topic || null,
        topicName: data.topicName || null,
        startedAt: data.startedAt ? formatLocalTime(data.startedAt) : null,
        endedAt: data.endedAt ? formatLocalTime(data.endedAt) : null,
        seconds: data.seconds != null ? data.seconds : null,
        reason: data.reason || null,
        extra: data.extra || null,
        clientTime: formatLocalTime()
      };
      var blob = new Blob([JSON.stringify(payload)], { type: "text/plain" });
      navigator.sendBeacon(cfg.trackingUrl, blob);
    } catch (e) {}
  }
};

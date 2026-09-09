/**
 * Servicio de Gemini API para pistas y generación de contenido.
 */
const GeminiAPI = {
  MODEL: "gemini-2.5-flash", // Modelo estable (como en santiagotracker). No usar IDs con -preview/fecha.

  getApiKey() {
    return (window.CuadernoMagicoConfig && window.CuadernoMagicoConfig.apiKey) || "";
  },

  isConfigured() {
    return !!this.getApiKey();
  },

  _url() {
    return "https://generativelanguage.googleapis.com/v1beta/models/" + this.MODEL + ":generateContent?key=" + encodeURIComponent(this.getApiKey());
  },

  async fetchText(prompt) {
    const payload = {
      contents: [{ parts: [{ text: prompt }] }]
    };
    return this._doFetch(this._url(), payload);
  },

  async fetchJSON(prompt) {
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    };
    const responseText = await this._doFetch(this._url(), payload);
    return JSON.parse(responseText);
  },

  /**
   * Reintenta solo cuando tiene sentido (cuota 429 o error 5xx / red).
   * Sin API key, o con un 400/403 (clave inválida o restringida), falla de
   * inmediato para que el juego muestre su respaldo sin hacer esperar a la niña.
   */
  async _doFetch(url, payload) {
    if (!this.isConfigured()) {
      throw new Error("Gemini sin API key");
    }
    const delays = [1000, 2000, 4000];
    let lastError = null;
    for (let attempt = 0; attempt <= delays.length; attempt++) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const err = new Error("HTTP error! status: " + res.status);
          err.status = res.status;
          throw err;
        }
        const data = await res.json();
        const text = data && data.candidates && data.candidates[0] &&
          data.candidates[0].content && data.candidates[0].content.parts &&
          data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
        if (typeof text !== "string" || !text.trim()) {
          throw new Error("Respuesta vacía de Gemini");
        }
        return text;
      } catch (error) {
        lastError = error;
        const status = error && error.status;
        const retryable = !status || status === 429 || status >= 500;
        if (!retryable || attempt === delays.length) throw error;
        await new Promise(function (resolve) { setTimeout(resolve, delays[attempt]); });
      }
    }
    throw lastError || new Error("Gemini falló");
  }
};

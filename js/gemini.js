/**
 * Servicio de Gemini API para pistas y generación de contenido.
 */
const GeminiAPI = {
  getApiKey() {
    return (window.CuadernoMagicoConfig && window.CuadernoMagicoConfig.apiKey) || "";
  },

  async fetchText(prompt) {
    const apiKey = this.getApiKey();
    // Modelo estable (como en santiagotracker). No usar IDs con -preview/fecha.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{ parts: [{ text: prompt }] }]
    };
    return this._doFetch(url, payload);
  },

  async fetchJSON(prompt) {
    const apiKey = this.getApiKey();
    // Modelo estable (como en santiagotracker). No usar IDs con -preview/fecha.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    };
    const responseText = await this._doFetch(url, payload);
    return JSON.parse(responseText);
  },

  async _doFetch(url, payload) {
    let retries = 0;
    const delays = [1000, 2000, 4000, 8000, 16000];
    while (retries < 5) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("HTTP error! status: " + res.status);
        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
      } catch (error) {
        if (retries === 4) throw error;
        await new Promise(function (resolve) { setTimeout(resolve, delays[retries]); });
        retries++;
      }
    }
  }
};

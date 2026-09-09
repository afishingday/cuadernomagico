/**
 * Juego de Vocabulario en Inglés (5º Grado) con generación por IA.
 * Si la IA no está disponible (sin clave, sin internet o respuesta rara),
 * se usa el banco de respaldo del cuaderno, por nivel, sin hacer esperar.
 */
var EnglishGame = {
  // Banco de respaldo por nivel (mismos temas que se le piden a la IA).
  fallbackVocab: {
    facil: [
      { en: "Cat", es: "Gato" }, { en: "Dog", es: "Perro" }, { en: "Sun", es: "Sol" },
      { en: "Apple", es: "Manzana" }, { en: "Water", es: "Agua" }, { en: "House", es: "Casa" },
      { en: "Red", es: "Rojo" }, { en: "Blue", es: "Azul" }, { en: "Green", es: "Verde" },
      { en: "Bird", es: "Pájaro" }, { en: "Fish", es: "Pez" }, { en: "Horse", es: "Caballo" },
      { en: "Three", es: "Tres" }, { en: "Ten", es: "Diez" }, { en: "Moon", es: "Luna" }
    ],
    medio: [
      { en: "Table", es: "Mesa" }, { en: "Chair", es: "Silla" }, { en: "Window", es: "Ventana" },
      { en: "Kitchen", es: "Cocina" }, { en: "Bed", es: "Cama" }, { en: "Shoes", es: "Zapatos" },
      { en: "Dress", es: "Vestido" }, { en: "Hat", es: "Sombrero" }, { en: "Bread", es: "Pan" },
      { en: "Milk", es: "Leche" }, { en: "Cheese", es: "Queso" }, { en: "Egg", es: "Huevo" },
      { en: "Spoon", es: "Cuchara" }, { en: "Door", es: "Puerta" }, { en: "Socks", es: "Medias" }
    ],
    dificil: [
      { en: "Run", es: "Correr" }, { en: "Jump", es: "Saltar" }, { en: "Read", es: "Leer" },
      { en: "Write", es: "Escribir" }, { en: "Happy", es: "Feliz" }, { en: "Sad", es: "Triste" },
      { en: "Angry", es: "Enojada" }, { en: "Scared", es: "Asustada" }, { en: "School", es: "Colegio" },
      { en: "Hospital", es: "Hospital" }, { en: "Park", es: "Parque" }, { en: "Library", es: "Biblioteca" },
      { en: "Bakery", es: "Panadería" }, { en: "Sing", es: "Cantar" }, { en: "Tired", es: "Cansada" }
    ]
  },
  currentWord: null,
  level: "facil",
  _reqId: 0,
  _lastEn: null,

  start: function (level) {
    this.level = level;
    this.currentWord = null;
    var reqId = ++this._reqId;
    var self = this;

    if (!GeminiAPI.isConfigured()) {
      // Sin IA: directo al banco del cuaderno, sin esperas ni mensajes de "magia".
      this._startFallback("Hoy practicamos con las palabras del cuaderno: la IA no está conectada.");
      return;
    }

    App.updateTeacher("✨ Invocando magia...", "Gemini está creando una nueva palabra secreta para ti...", "⏳");
    document.getElementById("lines-container").innerHTML =
      "<div class=\"flex flex-col items-center justify-center mt-10 gap-4\">" +
      "<span class=\"text-6xl animate-spin\">✨</span>" +
      "<p class=\"text-xl font-bold text-indigo-500 animate-pulse\">Consultando a la IA...</p>" +
      "</div>";

    var temaDificultad = "animales, colores o números básicos";
    if (level === "medio") temaDificultad = "objetos de la casa, ropa o comida";
    if (level === "dificil") temaDificultad = "verbos de acción, emociones o lugares de la ciudad";

    var prompt =
      "Genera un reto de vocabulario en inglés para una niña de 5º grado de primaria en Colombia. " +
      "Tema de las palabras: " + temaDificultad + ". " +
      "Debes devolver estrictamente un objeto JSON con la siguiente estructura: " +
      "{\"en\": \"Una sola palabra en inglés\", \"es\": \"La traducción correcta al español\", \"distractores\": [\"palabra falsa 1\", \"palabra falsa 2\", \"palabra falsa 3\", \"palabra falsa 4\"]} " +
      "Los distractores deben ser palabras reales en español, de la misma categoría, todas distintas entre sí y distintas de la traducción correcta. " +
      (this._lastEn ? "No uses la palabra \"" + this._lastEn + "\". " : "");

    GeminiAPI.fetchJSON(prompt)
      .then(function (data) {
        if (reqId !== self._reqId) return; // la niña ya cambió de tema/nivel
        var parsed = self._validateAI(data);
        if (!parsed) {
          self._startFallback("La IA respondió algo raro; practicamos con las palabras del cuaderno.");
          return;
        }
        self.currentWord = { en: parsed.en, es: parsed.es };
        self._lastEn = parsed.en;
        document.getElementById("lines-container").innerHTML = "";
        App.updateTeacher("Paso 1: ¡A Traducir!", "¿Qué significa la palabra <b>\"" + self.currentWord.en + "\"</b> en español? Elige la opción correcta.", "🌎");
        self.renderRow(parsed.options);
      })
      .catch(function (error) {
        if (reqId !== self._reqId) return;
        console.warn("[CuadernoMagico] Gemini vocabulario:", error && error.message ? error.message : error);
        self._startFallback("La IA no respondió; practicamos con las palabras del cuaderno.");
      });
  },

  // Comprueba que lo que devolvió la IA sirve: textos no vacíos, 3 a 4
  // distractores distintos y distintos de la respuesta.
  _validateAI: function (data) {
    if (!data || typeof data !== "object") return null;
    var en = typeof data.en === "string" ? data.en.trim() : "";
    var es = typeof data.es === "string" ? data.es.trim() : "";
    if (!en || !es || en.length > 30 || es.length > 30) return null;
    var raw = Array.isArray(data.distractores) ? data.distractores : [];
    var seen = {};
    seen[es.toLowerCase()] = true;
    var distractors = [];
    raw.forEach(function (d) {
      if (typeof d !== "string") return;
      var t = d.trim();
      if (!t || t.length > 30 || seen[t.toLowerCase()]) return;
      seen[t.toLowerCase()] = true;
      distractors.push(t);
    });
    if (distractors.length < 3) return null;
    return { en: en, es: es, options: [es].concat(distractors.slice(0, 4)) };
  },

  _startFallback: function (note) {
    var pool = this.fallbackVocab[this.level] || this.fallbackVocab.facil;
    var self = this;
    var candidates = pool.filter(function (w) { return w.en !== self._lastEn; });
    if (!candidates.length) candidates = pool;
    this.currentWord = candidates[Math.floor(Math.random() * candidates.length)];
    this._lastEn = this.currentWord.en;
    document.getElementById("lines-container").innerHTML = "";
    App.updateTeacher("Paso 1: ¡A Traducir!", "¿Qué significa la palabra <b>\"" + this.currentWord.en + "\"</b> en español? Elige la opción correcta." + (note ? " <span class=\"text-slate-400 text-sm\">(" + note + ")</span>" : ""), "🌎");
    this.renderRow();
  },

  showExample: function (container) {
    container.innerHTML =
      "<div class=\"p-4 md:p-6 bg-indigo-50 rounded-xl border-2 border-indigo-200\">" +
      "<p class=\"font-bold text-indigo-800 mb-4 border-b-2 border-indigo-200 pb-2 text-xl\">Ejemplo de ayuda</p>" +
      "<ul class=\"list-decimal pl-6 space-y-3 font-sans text-base\">" +
      "<li>Imagina que la palabra en pantalla es: <b>\"Apple\"</b>.</li>" +
      "<li>La traducción correcta y exacta al español sería: <span class=\"bg-white border px-2 rounded font-black text-green-600\">\"Manzana\"</span>.</li>" +
      "<li><b>Por descarte:</b> si no la conoces, elimina primero las opciones que seguro NO son (por ejemplo, las que no tienen nada que ver con el tema).</li>" +
      "<li>Si no la conocías, anótala en tu cuaderno para la próxima vez.</li>" +
      "</ul>" +
      "</div>";
  },

  renderRow: function (customOptions) {
    var container = document.getElementById("lines-container");
    var row = document.createElement("div");
    row.className = "flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 font-sans text-slate-700 w-full animate-fade-in mb-4";
    row.innerHTML =
      "<div class=\"flex items-center justify-center gap-3 bg-white border-4 border-emerald-300 px-4 md:px-6 py-2 rounded-2xl shadow-sm relative\">" +
      "<span class=\"absolute -top-3 -right-3 text-2xl animate-bounce\">✨</span>" +
      "<span class=\"text-xs md:text-sm font-black text-white bg-emerald-500 rounded-lg px-2 py-1 tracking-widest\">EN</span>" +
      "<span class=\"font-bold text-3xl md:text-4xl text-emerald-800 tracking-wide\">" + this.currentWord.en + "</span>" +
      "</div>" +
      "<div class=\"text-4xl font-bold text-slate-400 rotate-90 md:rotate-0\">=</div>" +
      "<div id=\"english-answer-slot\" class=\"flex items-center justify-center min-w-[150px] h-[50px] md:h-[60px] border-4 border-dashed border-slate-300 rounded-2xl text-slate-400 text-xl md:text-2xl bg-white/50\">?</div>";
    container.appendChild(row);
    this.generateEnglishOptions(customOptions || null);
  },

  generateEnglishOptions: function (customOptions) {
    var options = [];
    if (customOptions) {
      options = customOptions.slice();
    } else {
      var pool = this.fallbackVocab[this.level] || this.fallbackVocab.facil;
      var seen = {};
      seen[this.currentWord.es] = true;
      options = [this.currentWord.es];
      var guard = 0;
      while (options.length < 5 && guard < 100) {
        guard++;
        var w = pool[Math.floor(Math.random() * pool.length)].es;
        if (!seen[w]) { seen[w] = true; options.push(w); }
      }
    }
    for (var i = options.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = options[i]; options[i] = options[j]; options[j] = t;
    }

    var container = document.createElement("div");
    container.className = "flex flex-wrap justify-center gap-2 md:gap-3 mt-4 md:mt-8 animate-fade-in";
    container.id = "options-container";
    var self = this;

    options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "font-sans bg-white border-4 border-indigo-200 hover:border-indigo-400 text-indigo-700 font-bold text-lg md:text-2xl py-2 px-4 md:px-5 rounded-2xl shadow-[0_4px_0_#c7d2fe] active:translate-y-1 active:shadow-none transition-all";
      btn.innerText = opt;
      btn.onclick = function () { self.verify(opt, btn, container); };
      container.appendChild(btn);
    });
    document.getElementById("lines-container").appendChild(container);
  },

  verify: function (opt, btn, container) {
    var self = this;
    if (opt === this.currentWord.es) {
      btn.classList.replace("border-indigo-200", "border-green-500");
      btn.classList.replace("text-indigo-700", "text-white");
      btn.classList.add("bg-green-500");
      container.classList.add("pointer-events-none", "opacity-50");
      setTimeout(function () {
        if (document.getElementById("options-container") !== container) return;
        container.remove();
        var slot = document.getElementById("english-answer-slot");
        if (slot) {
          slot.className = "flex items-center justify-center gap-2 bg-green-100 border-4 border-green-400 px-4 md:px-6 py-2 rounded-2xl shadow-sm relative";
          slot.innerHTML = "<span class=\"font-bold text-2xl md:text-4xl text-green-700\">" + self.currentWord.es + "</span><span class=\"text-xs md:text-sm font-black text-white bg-green-600 rounded-lg px-2 py-1 tracking-widest\">ES</span><span class=\"text-red-500 text-3xl md:text-4xl rotate-12 font-bold absolute -right-4 -top-4\">✓</span>";
        }
        App.updateTeacher("¡Completado! 🎉", "¡Excelente traducción! <b>\"" + self.currentWord.en + "\"</b> significa <b>\"" + self.currentWord.es + "\"</b>.", "🌟");
        document.getElementById("success-area").classList.remove("hidden-el");
        App.triggerConfetti();
        if (typeof awardExercisePoints === "function") awardExercisePoints();
      }, 500);
    } else {
      var isSofia = typeof App !== "undefined" && App.user && App.user.id === "zorro";
      var eBorder = isSofia ? "border-amber-400" : "border-red-400";
      var eBg = isSofia ? "bg-amber-50" : "bg-red-50";
      var eText = isSofia ? "text-amber-700" : "text-red-600";
      btn.classList.replace("border-indigo-200", eBorder);
      btn.classList.add(eBg, eText, "animate-shake");
      App.updateTeacher("¡Casi!", "Elegiste <b>\"" + opt + "\"</b>, pero esa no es la traducción. Intenta descartar las opciones que seguro no son.", "🤔");
      if (typeof registerWrongAttempt === "function") registerWrongAttempt();
      setTimeout(function () {
        btn.classList.remove(eBg, eText, "animate-shake");
        btn.classList.replace(eBorder, "border-indigo-200");
      }, 800);
    }
  },

  cleanup: function () {
    // Invalida cualquier respuesta de la IA que llegue tarde.
    this._reqId++;
  }
};

/**
 * Juego de Vocabulario en Inglés (5º Grado) con generación por IA.
 */
var EnglishGame = {
  fallbackVocab: [
    { en: "Cat", es: "Gato" },
    { en: "Dog", es: "Perro" },
    { en: "Sun", es: "Sol" },
    { en: "Apple", es: "Manzana" },
    { en: "Water", es: "Agua" },
    { en: "House", es: "Casa" }
  ],
  currentWord: null,

  start: function (level) {
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
      "Genera un reto de vocabulario en inglés para un niño. " +
      "Tema de las palabras: " + temaDificultad + ". " +
      "Debes devolver estrictamente un objeto JSON con la siguiente estructura: " +
      "{\"en\": \"Una sola palabra en inglés\", \"es\": \"La traducción correcta al español\", \"distractores\": [\"palabra falsa 1\", \"palabra falsa 2\", \"palabra falsa 3\", \"palabra falsa 4\"]} " +
      "Asegúrate de que los distractores sean palabras reales en español pero de la misma categoría.";

    var self = this;
    GeminiAPI.fetchJSON(prompt)
      .then(function (data) {
        self.currentWord = { en: data.en, es: data.es };
        var customOptions = [data.es].concat(data.distractores);
        document.getElementById("lines-container").innerHTML = "";
        App.updateTeacher("Paso 1: ¡A Traducir!", "¿Qué significa la palabra <b>\"" + self.currentWord.en + "\"</b> en español? Elige la opción correcta.", "🌎");
        self.renderRow(customOptions);
      })
      .catch(function (error) {
        console.error("Gemini Error:", error);
        document.getElementById("lines-container").innerHTML = "";
        self.currentWord = self.fallbackVocab[Math.floor(Math.random() * self.fallbackVocab.length)];
        App.updateTeacher("Paso 1: ¡A Traducir!", "¿Qué significa la palabra <b>\"" + self.currentWord.en + "\"</b> en español? Elige la opción correcta.", "🌎");
        self.renderRow();
      });
  },

  renderRow: function (customOptions) {
    var container = document.getElementById("lines-container");
    var row = document.createElement("div");
    row.className = "flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 math-font text-slate-700 w-full animate-fade-in mb-4";
    row.innerHTML =
      "<div class=\"flex items-center justify-center gap-3 bg-white border-4 border-emerald-300 px-4 md:px-6 py-2 rounded-2xl shadow-sm relative\">" +
      "<span class=\"absolute -top-3 -right-3 text-2xl animate-bounce\">✨</span>" +
      "<span class=\"text-3xl md:text-4xl\">🇬🇧</span>" +
      "<span class=\"font-bold text-3xl md:text-4xl text-emerald-800\">" + this.currentWord.en + "</span>" +
      "</div>" +
      "<div class=\"text-4xl font-bold text-slate-400 rotate-90 md:rotate-0\">=</div>" +
      "<div id=\"english-answer-slot\" class=\"flex items-center justify-center min-w-[150px] h-[50px] md:h-[60px] border-4 border-dashed border-slate-300 rounded-2xl text-slate-400 text-xl md:text-2xl bg-white/50\">?</div>";
    container.appendChild(row);
    this.generateEnglishOptions(customOptions || null);
  },

  generateEnglishOptions: function (customOptions) {
    var options = [];
    if (customOptions) {
      options = customOptions.slice().sort(function () { return Math.random() - 0.5; });
    } else {
      var optionsSet = new Set([this.currentWord.es]);
      while (optionsSet.size < 5) {
        optionsSet.add(this.fallbackVocab[Math.floor(Math.random() * this.fallbackVocab.length)].es);
      }
      options = Array.from(optionsSet).sort(function () { return Math.random() - 0.5; });
    }

    var container = document.createElement("div");
    container.className = "flex flex-wrap justify-center gap-2 md:gap-3 mt-4 md:mt-8 animate-fade-in";
    container.id = "options-container";
    var self = this;

    options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.className = "font-sans bg-white border-4 border-indigo-200 hover:border-indigo-400 text-indigo-700 font-bold text-lg md:text-2xl py-2 px-4 md:px-5 rounded-2xl shadow-[0_4px_0_#c7d2fe] active:translate-y-1 active:shadow-none transition-all";
      btn.innerText = opt;
      btn.onclick = function () {
        if (opt === self.currentWord.es) {
          btn.classList.replace("border-indigo-200", "border-green-500");
          btn.classList.replace("text-indigo-700", "text-white");
          btn.classList.add("bg-green-500");
          document.getElementById("options-container").classList.add("pointer-events-none", "opacity-50");
          setTimeout(function () {
            document.getElementById("options-container").remove();
            var slot = document.getElementById("english-answer-slot");
            slot.className = "flex items-center justify-center gap-2 bg-green-100 border-4 border-green-400 px-4 md:px-6 py-2 rounded-2xl shadow-sm relative";
                                slot.innerHTML = "<span class=\"font-bold text-2xl md:text-4xl text-green-700\">" + self.currentWord.es + "</span><span class=\"text-2xl md:text-3xl\">🇪🇸</span><span class=\"text-red-500 text-3xl md:text-4xl rotate-12 font-bold absolute -right-4 -top-4\">✓</span>";
                                App.updateTeacher("¡Completado! 🎉", "¡Excelente traducción! <b>\"" + self.currentWord.en + "\"</b> significa exactamente <b>\"" + self.currentWord.es + "\"</b>.", "🌟");
            document.getElementById("success-area").classList.remove("hidden-el");
            App.triggerConfetti();
          }, 500);
        } else {
          btn.classList.replace("border-indigo-200", "border-red-400");
          btn.classList.add("bg-red-50", "text-red-600", "animate-shake");
                            App.updateTeacher("¡Ups!", "Elegiste <b>\"" + opt + "\"</b>, pero esa no es la traducción para <b>\"" + self.currentWord.en + "\"</b>. ¡Concéntrate e intenta descartar otras opciones!", "🫣");
          setTimeout(function () {
            btn.classList.remove("bg-red-50", "text-red-600", "animate-shake");
            btn.classList.replace("border-red-400", "border-indigo-200");
          }, 800);
        }
      };
      container.appendChild(btn);
    });
    document.getElementById("lines-container").appendChild(container);
  }
};

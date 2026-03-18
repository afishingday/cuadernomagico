/**
 * Juego: Mis Favoritos (Inglés 5º Grado).
 * Entrena My / His / Her usando una traducción tipo "favorite".
 */
var FavoritesGame = {
  eq: null,

  start: function (level) {
    this.generateValues(level);
    App.updateTeacher(
      "Paso 1: Construye la oración",
      "Observa el contexto de la caja y elige la traducción correcta para: <b>\"" + this.eq.es + "\"</b>.",
      "⭐"
    );
    this.renderRow();
  },

  generateValues: function (level) {
    var subjects = [
      { id: "I", context: "Estás hablando de <b>TI MISMO</b>", pos: "My", emoji: "🙋" },
      { id: "M", context: "Hablas de <b>un niño</b>", pos: "His", emoji: "👦" },
      { id: "F", context: "Hablas de <b>una niña</b>", pos: "Her", emoji: "👧" }
    ];

    var categories = [
      {
        es: "color",
        en: "color",
        items: [
          { es: "rojo", en: "red" },
          { es: "azul", en: "blue" },
          { es: "amarillo", en: "yellow" },
          { es: "verde", en: "green" }
        ]
      },
      {
        es: "animal",
        en: "animal",
        items: [
          { es: "perro", en: "dog" },
          { es: "gato", en: "cat" },
          { es: "caballo", en: "horse" },
          { es: "león", en: "lion" }
        ]
      },
      {
        es: "comida",
        en: "food",
        items: [
          { es: "pizza", en: "pizza" },
          { es: "manzana", en: "apple" },
          { es: "hamburguesa", en: "hamburger" },
          { es: "pollo", en: "chicken" }
        ]
      },
      {
        es: "deporte",
        en: "sport",
        items: [
          { es: "fútbol", en: "soccer" },
          { es: "baloncesto", en: "basketball" },
          { es: "tenis", en: "tennis" },
          { es: "natación", en: "swimming" }
        ]
      }
    ];

    var subj = subjects[Math.floor(Math.random() * subjects.length)];
    var cat = categories[Math.floor(Math.random() * categories.length)];
    var item = cat.items[Math.floor(Math.random() * cat.items.length)];

    var pronounEs = subj.id === "I" ? "Mi" : "Su";
    var esSentence = pronounEs + " " + cat.es + " favorito(a) es: " + item.es + ".";
    var enSentence = subj.pos + " favorite " + cat.en + " is " + item.en + ".";

    this.eq = { subj: subj, cat: cat, item: item, es: esSentence, en: enSentence, level: level };
  },

  showExample: function (container) {
    container.innerHTML =
      "<div class=\"p-4 md:p-6 bg-blue-50 rounded-xl border-2 border-blue-200\">" +
      "<p class=\"font-bold text-blue-800 mb-4 border-b-2 border-blue-200 pb-2 text-xl\">Ejemplo: My / His / Her</p>" +
      "<ul class=\"list-decimal pl-6 space-y-3 font-sans text-base\">" +
      "<li><span class=\"bg-white px-2 py-1 rounded shadow-sm border font-bold text-blue-600\">MY</span> se usa para hablar de <b>ti</b>: <i>My favorite color is red.</i></li>" +
      "<li><span class=\"bg-white px-2 py-1 rounded shadow-sm border font-bold text-blue-600\">HIS</span> se usa para <b>un niño</b>: <i>His favorite animal is a cat.</i></li>" +
      "<li><span class=\"bg-white px-2 py-1 rounded shadow-sm border font-bold text-blue-600\">HER</span> se usa para <b>una niña</b>: <i>Her favorite food is pizza.</i></li>" +
      "<li><b>Recuerda el orden:</b> <i>favorite</i> va antes de la categoría: <i>favorite color</i>, no <i>color favorite</i>.</li>" +
      "</ul>" +
      "</div>";
  },

  renderRow: function () {
    var container = document.getElementById("lines-container");
    var row = document.createElement("div");
    row.className = "flex flex-col items-center justify-center gap-4 w-full animate-fade-in mb-4";

    row.innerHTML =
      "<div class=\"bg-white border-4 border-blue-200 p-6 rounded-3xl w-full max-w-lg shadow-sm relative text-center mt-6\">" +
      "<div class=\"absolute -top-10 left-1/2 transform -translate-x-1/2 text-5xl bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center border-4 border-white shadow-sm\">" +
      this.eq.subj.emoji +
      "</div>" +
      "<p class=\"text-slate-500 font-bold mt-6 mb-2 uppercase tracking-wide text-sm md:text-base\">" + this.eq.subj.context + "</p>" +
      "<p class=\"text-2xl md:text-3xl font-black text-slate-800 mb-2\">&quot;" + this.eq.es + "&quot;</p>" +
      "</div>";

    container.appendChild(row);
    this.generateOptions();
  },

  generateOptions: function () {
    var options = [this.eq.en];

    var pronouns = ["My", "His", "Her"];
    var wrongPronouns = pronouns.filter(function (p) { return p !== this.eq.subj.pos; }.bind(this));
    var wrongPos1 = wrongPronouns[0];
    var wrongPos2 = wrongPronouns[1];

    var otherItems = this.eq.cat.items.filter(function (it) { return it.en !== this.eq.item.en; }.bind(this));
    var badItem = otherItems[Math.floor(Math.random() * otherItems.length)];

    if (this.eq.level === "facil") {
      options.push(wrongPos1 + " favorite " + this.eq.cat.en + " is " + this.eq.item.en + ".");
      options.push(wrongPos2 + " favorite " + this.eq.cat.en + " is " + this.eq.item.en + ".");
    } else if (this.eq.level === "medio") {
      options.push(wrongPos1 + " favorite " + this.eq.cat.en + " is " + this.eq.item.en + ".");
      options.push(wrongPos2 + " favorite " + this.eq.cat.en + " is " + this.eq.item.en + ".");
      options.push(this.eq.subj.pos + " favorite " + this.eq.cat.en + " is " + badItem.en + ".");
      options.push(wrongPos1 + " favorite " + this.eq.cat.en + " is " + badItem.en + ".");
    } else {
      // dificultad: errores de orden y gramática (sin inventar traducciones raras)
      options.push(wrongPos1 + " favorite " + this.eq.cat.en + " is " + this.eq.item.en + ".");
      options.push(wrongPos1 + " " + this.eq.cat.en + " favorite is " + this.eq.item.en + ".");
      options.push(this.eq.subj.pos + " favorite " + this.eq.cat.en + " is " + badItem.en + ".");
      options.push(wrongPos2 + " favorite " + this.eq.cat.en + " is " + badItem.en + ".");
    }

    // Si por algún motivo se repitió algo (por ejemplo en facil), deduplicamos para llegar a 5
    var set = new Set(options);
    options = Array.from(set);
    options = options.sort(function () { return Math.random() - 0.5; });

    var container = document.createElement("div");
    container.className = "flex flex-col w-full max-w-lg mx-auto gap-3 mt-4 animate-fade-in";
    container.id = "options-container";

    var self = this;
    options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.className =
        "font-sans text-left md:text-center w-full bg-white border-4 border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-700 font-bold text-lg md:text-xl py-4 px-6 rounded-2xl shadow-[0_4px_0_#bfdbfe] active:translate-y-1 active:shadow-none transition-all";
      btn.innerHTML = opt;
      btn.onclick = function () { self.verify(opt, btn); };
      container.appendChild(btn);
    });

    document.getElementById("lines-container").appendChild(container);
  },

  verify: function (selectedVal, btn) {
    var isCorrect = selectedVal === this.eq.en;

    if (isCorrect) {
      btn.classList.replace("border-blue-200", "border-green-500");
      btn.classList.add("bg-green-500");
      btn.classList.replace("text-blue-700", "text-white");
      document.getElementById("options-container").classList.add("pointer-events-none", "opacity-50");

      var self = this;
      setTimeout(function () {
        document.getElementById("options-container").remove();

        var resultRow = document.createElement("div");
        resultRow.className =
          "w-full max-w-lg mx-auto mt-4 bg-green-100 border-4 border-green-500 p-4 rounded-2xl text-center shadow-sm animate-fade-in";
        resultRow.innerHTML = "<span class=\"text-xl md:text-3xl font-black text-green-700\">✅ " + self.eq.en + "</span>";
        document.getElementById("lines-container").appendChild(resultRow);

        App.updateTeacher("¡Completado! 🎉", "¡Excelente traducción! <b>\"" + self.eq.en + "\"</b>.", "🌟");
        document.getElementById("success-area").classList.remove("hidden-el");
        App.triggerConfetti();
      }, 500);
      return;
    }

    // Incorrecto: tips según el tipo de error
    btn.classList.replace("border-blue-200", "border-red-400");
    btn.classList.add("bg-red-50", "text-red-600", "animate-shake");

    var catEn = this.eq.cat.en;
    var tip = "";
    if (!selectedVal.startsWith(this.eq.subj.pos)) {
      tip = "Recuerda que <b>My/His/Her</b> depende de quién es el dueño del 'favorite'. Revisa el pronombre del contexto.";
    } else if (selectedVal.indexOf(" favorite ") === -1 || selectedVal.includes(" " + catEn + " favorite ")) {
      tip = "En inglés el orden es <b>favorite " + catEn + "</b>. Evita escribirlo como <b>" + catEn + " favorite</b>.";
    } else {
      tip = "Fíjate en el vocabulario: la categoría y el objeto deben coincidir exactamente con la caja de contexto.";
    }

    App.updateTeacher("¡Ups, casi lo tienes!", "Elegiste una opción incorrecta. 💡 Tip: " + tip, "🫣");

    var btnRef = btn;
    setTimeout(function () {
      btnRef.classList.remove("bg-red-50", "text-red-600", "animate-shake");
      btnRef.classList.replace("border-red-400", "border-blue-200");
    }, 800);
  },

  cleanup: function () {
    // Al cambiar de ejercicio, App limpia #lines-container; aun así, quitamos restos por seguridad
    var opts = document.getElementById("options-container");
    if (opts) opts.remove();
  }
};


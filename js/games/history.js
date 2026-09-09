/**
 * Juego: Culturas Precolombinas (Historia 5º Grado).
 * Muestra un dato histórico y la niña elige entre Mayas / Incas / Aztecas.
 * Cada dato tiene un "ancla" (ciudad, nombre propio, región) que solo aplica a
 * una de las tres culturas, para que nunca haya dos respuestas defendibles.
 */
var HistoryGame = {
  eq: null,
  _lastFact: null,

  start: function (level) {
    this.generateValues(level);
    App.updateTeacher(
      "Paso 1: Identifica la civilización",
      "Lee el dato histórico en la tarjeta y descubre a qué cultura pertenece. ¿Fueron los Mayas, los Incas o los Aztecas?",
      "🗺️"
    );
    this.renderRow();
  },

  generateValues: function (level) {
    var facts = {
      facil: [
        {
          fact: "Construyeron la ciudad sagrada de Machu Picchu en lo alto de las montañas.",
          ans: "Incas",
          hint: "Vivían en las montañas de los Andes en Sudamérica."
        },
        {
          fact: "Su gran capital era Tenochtitlán, construida sobre un inmenso lago donde hoy es Ciudad de México.",
          ans: "Aztecas",
          hint: "Fueron un gran imperio militar ubicado en el centro de México."
        },
        {
          fact: "Construyeron la famosa pirámide escalonada de Chichén Itzá.",
          ans: "Mayas",
          hint: "Se ubicaron en las zonas selváticas de Centroamérica y el sur de México."
        },
        {
          fact: "El líder máximo de este gran imperio en Sudamérica era llamado el 'Hijo del Sol'.",
          ans: "Incas",
          hint: "Su capital principal era el Cusco (actual Perú)."
        },
        {
          fact: "Fueron guerreros que fundaron su ciudad justo donde vieron un águila devorando una serpiente.",
          ans: "Aztecas",
          hint: "Este evento es tan importante que es el símbolo que aparece hoy en la bandera de México."
        }
      ],
      medio: [
        {
          fact: "Fueron grandes matemáticos: usaban el número cero mucho antes que en Europa y escribían los números con puntos y rayas.",
          ans: "Mayas",
          hint: "Eran grandes astrónomos y matemáticos de Centroamérica y el sur de México."
        },
        {
          fact: "Para poder cultivar comida sobre el lago de su capital, construyeron islas artificiales llamadas 'Chinampas'.",
          ans: "Aztecas",
          hint: "Eran muy ingeniosos para sobrevivir y expandir su capital rodeada de agua."
        },
        {
          fact: "No tenían escritura con letras, sino que usaban cuerdas con nudos llamadas 'Quipus' para contar.",
          ans: "Incas",
          hint: "Usaban estos nudos para llevar mensajes y contar con precisión."
        },
        {
          fact: "Desde observatorios como 'El Caracol', en Chichén Itzá, seguían el Sol, la Luna y Venus, y con eso crearon calendarios muy exactos.",
          ans: "Mayas",
          hint: "Eran conocidos por su gran conocimiento de astronomía, en la península de Yucatán."
        },
        {
          fact: "Hablaban el idioma 'Náhuatl' y su emperador más famoso fue Moctezuma.",
          ans: "Aztecas",
          hint: "Este imperio enfrentó directamente la llegada de Hernán Cortés."
        }
      ],
      dificil: [
        {
          fact: "Su inmenso imperio se extendía por una larga red de caminos de piedra llamada 'Qhapaq Ñan'.",
          ans: "Incas",
          hint: "Eran excelentes ingenieros que conectaron montañas enormes en Sudamérica."
        },
        {
          fact: "En el Templo Mayor de Tenochtitlán adoraban a Huitzilopochtli, dios de la guerra y del Sol, y a Quetzalcóatl, la serpiente emplumada.",
          ans: "Aztecas",
          hint: "Eran un imperio guerrero dominante del centro de México."
        },
        {
          fact: "Usaban un sistema de escritura complejo con jeroglíficos que tallaban en piedras llamadas 'Estelas'.",
          ans: "Mayas",
          hint: "Estaban organizados en ciudades-estado independientes."
        },
        {
          fact: "Criaban animales como llamas y alpacas para transportar cargas y obtener lana en el clima frío.",
          ans: "Incas",
          hint: "Estaban ubicados en zonas altas y frías."
        },
        {
          fact: "Practicaban un juego de pelota sagrado en canchas de piedra de sus ciudades en la selva, como Tikal (Guatemala) y Copán (Honduras).",
          ans: "Mayas",
          hint: "Era una cultura milenaria de la región de Guatemala y Yucatán."
        }
      ]
    };

    var list = facts[level] || facts.facil;
    var candidates = list.filter(function (f) { return f.fact !== HistoryGame._lastFact; });
    if (!candidates.length) candidates = list;
    this.eq = candidates[Math.floor(Math.random() * candidates.length)];
    this._lastFact = this.eq.fact;
  },

  showExample: function (container) {
    // El ejemplo usa una cultura distinta a la del ejercicio, para no regalar la respuesta.
    var ex = (this.eq && this.eq.ans === "Incas")
      ? { fact: "Construyeron la pirámide de Chichén Itzá en la selva de Yucatán", keys: "<b>Chichén Itzá</b> y <b>Yucatán</b>", who: "Mayas", where: "los Incas en los Andes, los Aztecas en el centro de México… y los de las selvas de Yucatán y Centroamérica eran" }
      : { fact: "Construyeron Machu Picchu en las montañas", keys: "<b>Machu Picchu</b> y <b>montañas</b>", who: "Incas", where: "los Mayas en selvas, los Aztecas en México… y los que vivían en montañas de los Andes en Perú eran" };
    container.innerHTML =
      "<div class=\"p-4 md:p-6 bg-amber-50 rounded-xl border-2 border-amber-200\">" +
      "<p class=\"font-bold text-amber-800 mb-4 border-b-2 border-amber-200 pb-2 text-xl\">Ejemplo: ¿Cómo identificar la cultura?</p>" +
      "<ul class=\"list-decimal pl-6 space-y-3 font-sans text-base text-slate-700\">" +
      "<li><b>El Dato:</b> Imagina que el cuaderno dice: <i>\"" + ex.fact + "\"</i>.</li>" +
      "<li><b>Palabras Clave:</b> Las palabras " + ex.keys + " son tus pistas.</li>" +
      "<li><b>La deducción:</b> Si recuerdas tus clases: " + ex.where + " <b>" + ex.who + "</b>.</li>" +
      "<li><b>Mapa mental:</b> Mayas → selvas de Yucatán y Centroamérica (Chichén Itzá, Tikal). Aztecas → centro de México (Tenochtitlán, hoy Ciudad de México). Incas → montañas de los Andes (Cusco, Machu Picchu).</li>" +
      "<li>¡Haz lo mismo con tu ejercicio! Busca pistas sobre ubicación, inventos o ciudades.</li>" +
      "</ul>" +
      "</div>";
  },

  renderRow: function () {
    var container = document.getElementById("lines-container");
    var row = document.createElement("div");
    row.className = "flex flex-col items-center justify-center gap-4 w-full animate-fade-in mb-4";

    row.innerHTML =
      "<div class=\"bg-white border-4 border-amber-200 p-6 md:p-8 rounded-3xl w-full max-w-2xl shadow-md text-center mt-4\">" +
      "<p class=\"text-amber-600 font-bold mb-4 uppercase tracking-wider text-sm md:text-base border-b-2 border-amber-100 pb-2 inline-block\">Dato Histórico</p>" +
      "<p class=\"text-xl md:text-3xl font-bold text-slate-800 font-sans leading-relaxed\">\"" + this.eq.fact + "\"</p>" +
      "</div>";

    container.appendChild(row);
    this.generateOptions();
  },

  generateOptions: function () {
    var optionsContainer = document.createElement("div");
    optionsContainer.className = "flex flex-wrap justify-center gap-4 mt-6 animate-fade-in w-full max-w-2xl mx-auto";
    optionsContainer.id = "options-container";

    var cultures = [
      { name: "Mayas", emoji: "🌽", color: "border-emerald-300 text-emerald-700 hover:bg-emerald-50" },
      { name: "Incas", emoji: "🦙", color: "border-orange-300 text-orange-700 hover:bg-orange-50" },
      { name: "Aztecas", emoji: "🦅", color: "border-red-300 text-red-700 hover:bg-red-50" }
    ];

    var shuffled = cultures.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = shuffled[i]; shuffled[i] = shuffled[j]; shuffled[j] = t;
    }

    shuffled.forEach(function (c) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "font-sans bg-white border-4 " + c.color +
        " font-black text-lg md:text-2xl py-4 px-6 md:px-8 rounded-2xl shadow-sm active:translate-y-1 active:shadow-none transition-all flex flex-col items-center justify-center min-w-[120px] md:min-w-[160px]";

      btn.innerHTML = "<span class=\"text-4xl md:text-5xl mb-2\">" + c.emoji + "</span><span>" + c.name + "</span>";
      btn.onclick = function () { HistoryGame.verify(c.name, btn); };
      optionsContainer.appendChild(btn);
    });

    document.getElementById("lines-container").appendChild(optionsContainer);
  },

  verify: function (selectedVal, btn) {
    if (selectedVal === this.eq.ans) {
      btn.classList.add("bg-green-500", "text-white", "border-green-600");
      btn.classList.remove("hover:bg-emerald-50", "hover:bg-orange-50", "hover:bg-red-50");

      var opts = document.getElementById("options-container");
      if (opts) opts.classList.add("pointer-events-none", "opacity-50");

      setTimeout(function () {
        var opts2 = document.getElementById("options-container");
        if (opts && opts2 !== opts) return;
        if (opts2) opts2.remove();

        App.updateTeacher(
          "¡Respuesta Correcta! 🎉",
          "¡Excelente memoria histórica! Ese dato pertenece exactamente a los <b>" + HistoryGame.eq.ans + "</b>.",
          "🌟"
        );

        var resultRow = document.createElement("div");
        resultRow.className = "w-full max-w-lg mx-auto mt-4 bg-green-100 border-4 border-green-500 p-4 rounded-2xl text-center shadow-sm animate-fade-in";
        resultRow.innerHTML = "<span class=\"text-2xl md:text-4xl font-black text-green-700\">✅ ¡Fueron los " + HistoryGame.eq.ans + "!</span>";
        document.getElementById("lines-container").appendChild(resultRow);

        document.getElementById("success-area").classList.remove("hidden-el");
        App.triggerConfetti();
        if (typeof awardExercisePoints === "function") awardExercisePoints();
      }, 500);
    } else {
      btn.classList.add("bg-slate-100", "animate-shake", "opacity-70");
      App.updateTeacher(
        "¡Casi! Busca más pistas en el dato",
        "Elegiste <b>" + selectedVal + "</b>, pero no fueron ellos. <br><br>💡 <b>Tip de oro:</b> " + this.eq.hint,
        "🫣"
      );
      if (typeof registerWrongAttempt === "function") registerWrongAttempt();

      setTimeout(function () {
        btn.classList.remove("bg-slate-100", "animate-shake", "opacity-70");
      }, 800);
    }
  },

  cleanup: function () {
    var opts = document.getElementById("options-container");
    if (opts) opts.remove();
  }
};


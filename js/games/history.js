/**
 * Juego: Culturas Precolombinas (Historia 5º Grado).
 * Muestra un dato histórico y el niño elige entre Mayas / Incas / Aztecas.
 */
var HistoryGame = {
  eq: null,

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
          fact: "Fueron auténticos genios matemáticos que inventaron el uso del número cero.",
          ans: "Mayas",
          hint: "Eran grandes astrónomos y matemáticos de Centroamérica."
        },
        {
          fact: "Para poder cultivar comida encima del lago, inventaron islas flotantes llamadas 'Chinampas'.",
          ans: "Aztecas",
          hint: "Eran muy ingeniosos para sobrevivir y expandir su capital rodeada de agua."
        },
        {
          fact: "No tenían escritura con letras, sino que usaban cuerdas con nudos llamadas 'Quipus' para contar.",
          ans: "Incas",
          hint: "Usaban estos nudos para llevar mensajes y contar con precisión."
        },
        {
          fact: "Crearon un calendario súper exacto de 365 días basado en sus observaciones de las estrellas y planetas.",
          ans: "Mayas",
          hint: "Eran conocidos por su gran conocimiento de astronomía."
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
          fact: "Adoraban y creían en el dios serpiente emplumada llamado 'Quetzalcóatl'.",
          ans: "Aztecas",
          hint: "Eran un imperio guerrero dominante de Mesoamérica."
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
          fact: "Practican un ritual sagrado conocido como 'Pok-ta-pok', un juego de pelota mesoamericano.",
          ans: "Mayas",
          hint: "Era una cultura milenaria de la región de Guatemala y Yucatán."
        }
      ]
    };

    var list = facts[level] || facts.facil;
    this.eq = list[Math.floor(Math.random() * list.length)];
  },

  showExample: function (container) {
    container.innerHTML =
      "<div class=\"p-4 md:p-6 bg-amber-50 rounded-xl border-2 border-amber-200\">" +
      "<p class=\"font-bold text-amber-800 mb-4 border-b-2 border-amber-200 pb-2 text-xl\">Ejemplo: ¿Cómo identificar la cultura?</p>" +
      "<ul class=\"list-decimal pl-6 space-y-3 font-sans text-base text-slate-700\">" +
      "<li><b>El Dato:</b> Imagina que el cuaderno dice: <i>\"Construyeron Machu Picchu en las montañas\"</i>.</li>" +
      "<li><b>Palabras Clave:</b> Las palabras <b>Machu Picchu</b> y <b>montañas</b> son tus pistas.</li>" +
      "<li><b>La deducción:</b> Si recuerdas tus clases: los Mayas en selvas, los Aztecas en México… y los que vivían en montañas de los Andes en Perú eran <b>Incas</b>.</li>" +
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

    var shuffled = cultures.slice().sort(function () { return Math.random() - 0.5; });

    shuffled.forEach(function (c) {
      var btn = document.createElement("button");
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
      }, 500);
    } else {
      btn.classList.add("bg-slate-100", "animate-shake", "opacity-70");
      App.updateTeacher(
        "¡Ups, viaje en el tiempo equivocado!",
        "Elegiste <b>" + selectedVal + "</b>, pero no fueron ellos. <br><br>💡 <b>Tip de oro:</b> " + this.eq.hint,
        "🫣"
      );

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


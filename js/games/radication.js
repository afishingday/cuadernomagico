/**
 * Juego de Radicación (Matemáticas 5º). Es el truco inverso de Potencias:
 * en vez de dar base y exponente, se da el radicando y hay que encontrar
 * la raíz (la base). Usa una cuadrícula visual para raíz cuadrada, apoyada
 * en lo que ya sabe de Geometría (área = lado × lado).
 * Rangos de 5º: raíces cuadradas hasta √400 y cúbicas hasta ∛1000.
 */
var RadicationGame = {
  eq: null,

  start: function (level) {
    this.generateValues(level);
    var isCube = this.eq.index === 3;
    App.updateTeacher(
      "Paso 1: Encuentra la Raíz",
      isCube
        ? "La raíz cúbica pregunta: ¿qué número multiplicado <b>3 veces</b> por sí mismo da el radicando (el número de adentro)?"
        : "La raíz es el truco al revés de la Potencia: busca qué número multiplicado <b>por sí mismo</b> da el radicando (el número de adentro).",
      "🔍"
    );
    this.renderRow();
  },

  GRID_MAX_ROOT: 15,

  _rand: function (min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },

  generateValues: function (level) {
    var root, index;
    if (level === "facil") {
      // Raíz cuadrada de cuadrados perfectos chicos (√4 a √144), siempre con cuadrícula.
      root = this._rand(2, 12);
      index = 2;
    } else if (level === "medio") {
      // Raíces cuadradas más grandes (√169 a √400): ya sin cuadrícula, pensando en Potencias.
      root = this._rand(13, 20);
      index = 2;
    } else {
      // Raíz cúbica — concepto nuevo, espejo de Potencias (∛8 a ∛1000).
      root = this._rand(2, 10);
      index = 3;
    }
    this.eq = { root: root, index: index, radicand: Math.pow(root, index) };
  },

  _radicalHtml: function (index, radicand, sizeClass) {
    return (
      "<div class=\"flex items-start\">" +
      (index !== 2 ? "<sup class=\"text-2xl md:text-4xl text-pink-500 -mr-1 mt-0\">" + index + "</sup>" : "") +
      "<span class=\"" + sizeClass + " leading-none\">√</span>" +
      "<span class=\"border-t-4 border-slate-700 pt-1 md:pt-2 " + sizeClass + "\">" + radicand + "</span>" +
      "</div>"
    );
  },

  showExample: function (container) {
    var eq = this.eq || { root: 6, index: 2, radicand: 36 };
    var isCube = eq.index === 3;
    // Con el ejercicio actual si es una raíz cuadrada dibujable; si no, con 36.
    var exRoot = (!isCube && eq.root <= 12) ? eq.root : 6;
    var exRadicand = exRoot * exRoot;
    var cells = "";
    for (var i = 0; i < exRoot * exRoot; i++) {
      cells += "<div class=\"bg-pink-300 border border-pink-400 rounded-sm\" style=\"aspect-ratio:1\"></div>";
    }
    var cubeLine = isCube
      ? "<li><b>Tu ejercicio (raíz cúbica):</b> buscas un número multiplicado <b>3 veces</b> por sí mismo que dé " + eq.radicand + ". Prueba de a uno: 2 × 2 × 2 = 8, 3 × 3 × 3 = 27, 4 × 4 × 4 = 64, 5 × 5 × 5 = 125... hasta llegar a <b>" + eq.root + " × " + eq.root + " × " + eq.root + " = " + eq.radicand + "</b>. La raíz cúbica de " + eq.radicand + " es <b>" + eq.root + "</b>.</li>"
      : "<li><b>Raíz cúbica (índice 3):</b> Funciona igual, pero buscas un número multiplicado <b>3 veces</b> por sí mismo. Ej: 2 × 2 × 2 = 8, entonces la raíz cúbica de 8 es 2.</li>";
    container.innerHTML =
      "<div class=\"p-4 md:p-6 bg-indigo-50 rounded-xl border-2 border-indigo-200\">" +
      "<p class=\"font-bold text-indigo-800 mb-4 border-b-2 border-indigo-200 pb-2\">Ejemplo de guía: <br>" +
      "<span class=\"text-3xl text-slate-800 math-font ml-4 inline-flex items-start\">" +
      this._radicalHtml(2, exRadicand, "text-3xl") +
      "</span></p>" +
      "<ul class=\"list-decimal pl-6 mt-2 space-y-3\">" +
      "<li><b>El Radicando:</b> El número de adentro es <b>" + exRadicand + "</b>. Es el número que salió de una potencia y ahora queremos saber de cuál.</li>" +
      "<li><b>El Índice:</b> El número chiquito (aquí es <b>2</b>, casi nunca se escribe) te dice cuántas veces se multiplicó el número por sí mismo.</li>" +
      "<li><b>La pregunta clave:</b> ¿Qué número multiplicado por SÍ MISMO da " + exRadicand + "? Como sabes de Potencias que <b>" + exRoot + " × " + exRoot + " = " + exRadicand + "</b> (o " + exRoot + "²), entonces la raíz es <b>" + exRoot + "</b>.</li>" +
      "<li><b>Míralo como un cuadrado:</b> Si armas un cuadrado de área " + exRadicand + " (como en Geometría), cada lado mide exactamente " + exRoot + ". ¡Cuenta las filas!" +
      "<div class=\"grid gap-[2px] mt-2 mx-auto\" style=\"grid-template-columns:repeat(" + exRoot + ",minmax(0,1fr));max-width:220px\">" + cells + "</div>" +
      "</li>" +
      "<li><b>¡Ojo!</b> La raíz NO es dividir: √" + exRadicand + " no es " + exRadicand + " ÷ 2. Es preguntarse qué número por sí mismo da " + exRadicand + ".</li>" +
      cubeLine +
      "</ul>" +
      "</div>";
  },

  renderRow: function () {
    var container = document.getElementById("lines-container");
    var eq = this.eq;

    var row = document.createElement("div");
    row.className = "flex items-center justify-center gap-2 md:gap-4 math-font text-slate-700 w-full animate-fade-in mb-2";
    row.innerHTML = this._radicalHtml(eq.index, eq.radicand, "text-5xl md:text-7xl font-bold") +
      "<div class=\"text-4xl md:text-5xl ml-2\">=</div>";
    container.appendChild(row);

    var visualRow = document.createElement("div");
    visualRow.className = "flex flex-col items-center w-full mb-6 animate-fade-in";

    if (eq.index === 2 && eq.root <= this.GRID_MAX_ROOT) {
      var cells = "";
      for (var i = 0; i < eq.root * eq.root; i++) {
        cells += "<div class=\"bg-indigo-300 border border-indigo-400 rounded-sm\" style=\"aspect-ratio:1\"></div>";
      }
      var maxWidth = Math.min(eq.root * 26, 280);
      visualRow.innerHTML =
        "<div class=\"text-slate-400 text-sm md:text-base font-sans mb-2 text-center px-2\">Si armas un cuadrado con esta área, ¿cuánto mide cada lado? Cuenta una fila 👀</div>" +
        "<div class=\"grid gap-[2px] mx-auto\" style=\"grid-template-columns:repeat(" + eq.root + ",minmax(0,1fr));max-width:" + maxWidth + "px\">" + cells + "</div>";
    } else if (eq.index === 2) {
      visualRow.innerHTML =
        "<div class=\"bg-indigo-50/80 border-2 border-indigo-200 text-indigo-700 px-4 py-2 rounded-xl text-2xl md:text-3xl math-font shadow-inner flex items-center justify-center text-center flex-wrap\">" +
        "<span class=\"text-slate-400 text-lg mr-2 font-sans tracking-tight\">¿Qué número por sí mismo da " + eq.radicand + "?</span> ? <span class=\"text-pink-400 mx-1\">×</span> ? " +
        "<span class=\"text-slate-400 text-lg mx-2 font-sans\">= " + eq.radicand + "</span></div>";
    } else {
      visualRow.innerHTML =
        "<div class=\"bg-indigo-50/80 border-2 border-indigo-200 text-indigo-700 px-4 py-2 rounded-xl text-2xl md:text-3xl math-font shadow-inner flex items-center justify-center text-center flex-wrap\">" +
        "<span class=\"text-slate-400 text-lg mr-2 font-sans tracking-tight\">¿Qué número, 3 veces, da " + eq.radicand + "?</span> ? <span class=\"text-pink-400 mx-1\">×</span> ? <span class=\"text-pink-400 mx-1\">×</span> ? " +
        "<span class=\"text-slate-400 text-lg mx-2 font-sans\">= " + eq.radicand + "</span></div>";
    }
    container.appendChild(visualRow);

    var self = this;
    // Distractores con sentido: dividir el radicando entre el índice (error
    // clásico), la raíz ± 1, el doble de la raíz, la mitad del radicando.
    var divided = Math.floor(eq.radicand / eq.index);
    var preferred = [
      divided,
      eq.root + 1,
      eq.root - 1,
      eq.root * 2,
      eq.index === 3 ? eq.root * eq.root : Math.floor(eq.radicand / 10)
    ];
    generateOptionsUI(
      eq.root,
      function (val, btn) { self.verify(val, btn); },
      "¿Cuál es la raíz?",
      preferred
    );
  },

  verify: function (val, btn) {
    var eq = this.eq;
    if (val === eq.root) {
      handleCorrectOption(btn, function () {
        App.updateTeacher(
          "¡Excelente! 🎉",
          "¡Lo tienes! <b>" + eq.root + "</b> multiplicado por sí mismo" + (eq.index === 3 ? " 3 veces" : "") + " es igual a <b>" + eq.radicand + "</b>, así que esa es la raíz.",
          "🌟"
        );
        document.getElementById("success-area").classList.remove("hidden-el");
        App.triggerConfetti();
      });
    } else {
      var errExtra = "";
      var dividedGuess = Math.floor(eq.radicand / eq.index);
      var times = eq.index === 3 ? "3 veces" : "por sí mismo";
      if (val === dividedGuess) {
        errExtra =
          "<br><br>💡 <b>Tip de oro:</b> Parece que dividiste el radicando entre " + eq.index +
          " (" + eq.radicand + " ÷ " + eq.index + "). ¡Cuidado! La raíz no es una división: busca qué número multiplicado " + times + " te da " + eq.radicand + ".";
      } else {
        var test = Math.pow(val, eq.index);
        errExtra = "<br><br>💡 <b>Tip de oro:</b> Compruébalo: " + val + (eq.index === 3 ? " × " + val + " × " + val : " × " + val) + " = " + test +
          ", y tú necesitas " + eq.radicand + ". " + (test < eq.radicand ? "Prueba con un número más grande." : "Prueba con un número más pequeño.");
      }
      handleWrongOption(btn, function () {
        App.updateTeacher(
          "¡Casi! Recuerda el proceso",
          "Elegiste <b>" + val + "</b>, pero esa no es la raíz. " + errExtra,
          "🤔"
        );
      });
    }
  },

  cleanup: function () {}
};

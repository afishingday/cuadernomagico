/**
 * Juego de Estadística (Matemáticas 5º): tabla de frecuencias, diagrama de
 * barras y medidas (moda, media, mediana). Los tres son la misma unidad —
 * una encuesta se organiza en tabla, se dibuja en diagrama y se resume con
 * medidas — así que se enseñan conectados, con encuestas sobre temas que le
 * gustan a Sofía (paletas, animales, frutas).
 */
var StatGame = {
  eq: null,

  // "variado" (por defecto) deja rotar al azar entre todo lo de TYPES_BY_LEVEL.
  // Si Sofía elige un tema puntual en el selector, se fija aquí y generateValues
  // lo respeta en vez de sortear entre los 4.
  typeFilter: "variado",

  CATEGORY_SETS: [
    { label: "sabores de paletas", icons: ["🍓", "🍋", "🍫", "🥭"] },
    { label: "animales favoritos", icons: ["🐶", "🐱", "🐰", "🐹"] },
    { label: "frutas favoritas", icons: ["🍎", "🍌", "🍇", "🍉"] }
  ],

  // Moda/Media/Mediana y Frecuencia activas juntas — Sofía ya vio ambos temas en
  // el colegio y el selector de tema (#stat-type-selector) le deja variar entre
  // ellos. Diagrama sigue implementado pero pausado (no se ha visto en clase).
  // Las 3 medidas están disponibles en todos los niveles: el nivel no cambia el
  // concepto (eso confundiría más), solo el tamaño de los números — ver MEASURE_RANGES.
  TYPES_BY_LEVEL: {
    facil: ["moda", "media", "mediana", "frecuencia"],
    medio: ["moda", "media", "mediana", "frecuencia"],
    dificil: ["moda", "media", "mediana", "frecuencia"]
  },

  // Rango de números por nivel para moda/media/mediana. mediaStep controla el
  // "salto" entre los 5 valores de Media (mean±step, mean±2*step) — el resultado
  // siempre es un número entero exacto, sin importar el nivel.
  MEASURE_RANGES: {
    facil: { modaMax: 9, modaDistractorMax: 9, mediaMin: 5, mediaMax: 12, mediaStep: 1, medianaMax: 15 },
    medio: { modaMax: 20, modaDistractorMax: 20, mediaMin: 10, mediaMax: 25, mediaStep: 2, medianaMax: 30 },
    dificil: { modaMax: 30, modaDistractorMax: 30, mediaMin: 20, mediaMax: 45, mediaStep: 3, medianaMax: 50 }
  },

  // Totales "redondos" (solo factores 2 y 5) para que Frecuencia Relativa y
  // Porcentual siempre den decimales/porcentajes limpios (sin cifras periódicas).
  FREQ_TOTALS_BY_LEVEL: {
    facil: [10],
    medio: [20, 25],
    dificil: [25, 50]
  },

  // Relativa/Porcentual dominan a propósito (ver comentario arriba). Porcentual
  // se reserva para medio/dificil porque depende conceptualmente de Relativa.
  ASK_TYPES_BY_LEVEL: {
    facil: ["absoluta", "relativa", "relativa"],
    medio: ["relativa", "relativa", "porcentual", "porcentual"],
    dificil: ["relativa", "porcentual", "porcentual"]
  },

  start: function (level) {
    this.generateValues(level);
    var eq = this.eq;
    var title, msg, emoji;
    if (eq.kind === "medida") {
      if (eq.type === "moda") {
        title = "Paso 1: Encuentra la Moda";
        msg = "La Moda es el número que <b>MÁS se repite</b> en la lista. Cuenta cuántas veces aparece cada uno.";
      } else if (eq.type === "media") {
        title = "Paso 1: Encuentra la Media";
        msg = "La Media (promedio) se calcula <b>sumando todos</b> los números y <b>dividiendo</b> entre la cantidad de números que sumaste.";
      } else {
        title = "Paso 1: Encuentra la Mediana";
        msg = "La Mediana es el número que queda <b>justo en el medio</b> cuando ordenas la lista de menor a mayor. ¡Primero hay que ordenar!";
      }
      emoji = "📊";
    } else if (eq.kind === "frecuencia") {
      if (eq.askType === "absoluta") {
        title = "Paso 1: Frecuencia Absoluta";
        msg = "Es contar cuántas veces se repite un símbolo en la encuesta. Cuenta uno por uno y completa el espacio que falta.";
      } else if (eq.askType === "relativa") {
        title = "Paso 1: Frecuencia Relativa";
        msg = "Se calcula dividiendo la Frecuencia Absoluta entre el Total de encuestados: <b>fr = fa ÷ total</b>.";
      } else {
        title = "Paso 1: Frecuencia Porcentual";
        msg = "Se calcula multiplicando la Frecuencia Relativa por 100 (o Absoluta ÷ Total × 100): <b>fp = fr × 100</b>.";
      }
      emoji = "🔢";
    } else {
      title = "Paso 1: Lee el Diagrama";
      msg = "Observa la altura de cada barra: entre más alta, más votos tiene esa opción.";
      emoji = "📈";
    }
    App.updateTeacher(title, msg, emoji);
    this.renderRow();
  },

  // Botones del selector "Elige el tema" — mueve el resaltado y regenera el ejercicio.
  setTypeFilter: function (type) {
    this.typeFilter = type;
    this.renderTypeSelectorState();
    App.generateContent();
  },

  // Decimales con coma, como en el colegio (0,40 y no 0.40).
  _fmtRel: function (fr) { return Number(fr).toFixed(2).replace(".", ","); },
  _fmtVal: function (askType, v) {
    if (askType === "relativa") return this._fmtRel(v);
    if (askType === "porcentual") return v + "%";
    return String(v);
  },

  renderTypeSelectorState: function () {
    var current = this.typeFilter || "variado";
    ["variado", "moda", "media", "mediana", "frecuencia"].forEach(function (t) {
      var btn = document.getElementById("stat-type-" + t);
      if (!btn) return;
      var isActive = current === t;
      btn.className = "stat-type-btn font-bold py-2 px-3 min-h-[40px] text-sm rounded-full shadow-sm transition-all border-2 " +
        (isActive
          ? "bg-orange-400 border-orange-400 text-white ring-4 ring-white scale-110"
          : "bg-white border-orange-200 text-orange-700 hover:bg-orange-50");
    });
  },

  generateValues: function (level) {
    var types = this.TYPES_BY_LEVEL[level] || this.TYPES_BY_LEVEL.facil;
    if (this.typeFilter && this.typeFilter !== "variado" && types.indexOf(this.typeFilter) !== -1) {
      types = [this.typeFilter];
    }
    var type = types[Math.floor(Math.random() * types.length)];
    if (type === "moda" || type === "media" || type === "mediana") {
      this._generateMeasure(type, level);
    } else {
      this._generateSurvey(type, level);
    }
  },

  _generateMeasure: function (type, level) {
    var r = this.MEASURE_RANGES[level] || this.MEASURE_RANGES.facil;
    var nums, res;
    if (type === "moda") {
      var mode = Math.floor(Math.random() * r.modaMax) + 1;
      var d1 = Math.floor(Math.random() * r.modaDistractorMax) + 1;
      var d2 = Math.floor(Math.random() * r.modaDistractorMax) + 1;
      nums = [mode, mode, mode, d1, d2];
      nums.sort(function () { return Math.random() - 0.5; });
      res = mode;
    } else if (type === "media") {
      var step = r.mediaStep;
      var mean = Math.floor(Math.random() * (r.mediaMax - r.mediaMin + 1)) + r.mediaMin;
      // Listas que suman exactamente 5 × media pero NO son simétricas: así la
      // mediana (el del centro) es distinta de la media y no se pueden confundir.
      var templates = [
        [-4, -1, 1, 2, 2],
        [-3, 0, 1, 1, 1],
        [-1, -1, -1, 1, 2],
        [-2, -1, 1, 1, 1]
      ];
      var tpl = templates[Math.floor(Math.random() * templates.length)];
      nums = tpl.map(function (k) { return mean + k * step; });
      nums.sort(function () { return Math.random() - 0.5; });
      res = mean;
    } else {
      var set = new Set();
      while (set.size < 5) set.add(Math.floor(Math.random() * r.medianaMax) + 1);
      nums = Array.from(set);
      var sorted = nums.slice().sort(function (a, b) { return a - b; });
      res = sorted[2];
      nums.sort(function () { return Math.random() - 0.5; });
    }
    this.eq = { kind: "medida", type: type, nums: nums, res: res };
  },

  // Desglosa moda/media/mediana paso a paso usando los números REALES del
  // ejercicio actual (no un ejemplo genérico) — mismo patrón que las frecuencias.
  _measureStepsHtml: function (type, nums) {
    var html = "";
    if (type === "moda") {
      var counts = {};
      nums.forEach(function (n) { counts[n] = (counts[n] || 0) + 1; });
      var tally = Object.keys(counts)
        .map(function (k) { return "el <b>" + k + "</b> aparece " + counts[k] + " vez" + (counts[k] > 1 ? "es" : ""); })
        .join(", ");
      var modeVal = Object.keys(counts).reduce(function (a, b) { return counts[a] >= counts[b] ? a : b; });
      html += "<li><b>Cuenta cada número:</b> " + tally + ".</li>";
      html += "<li><b>Busca el que más se repite:</b> el <b>" + modeVal + "</b> aparece más veces que los demás — esa es la Moda.</li>";
    } else if (type === "media") {
      var sum = nums.reduce(function (a, b) { return a + b; }, 0);
      html += "<li><b>Suma todos los números:</b> " + nums.join(" + ") + " = <b>" + sum + "</b>.</li>";
      html += "<li><b>Cuenta cuántos números hay:</b> son <b>" + nums.length + "</b> números en la lista.</li>";
      html += "<li><b>Divide:</b> " + sum + " ÷ " + nums.length + " = <b>" + (sum / nums.length) + "</b>. Ese es el promedio (Media).</li>";
    } else {
      var sorted = nums.slice().sort(function (a, b) { return a - b; });
      var mid = Math.floor(sorted.length / 2);
      html += "<li><b>Ordena de menor a mayor:</b> " + sorted.join(", ") + ".</li>";
      html += "<li><b>Cuenta cuántos hay:</b> son <b>" + sorted.length + "</b> números (impar, así que hay uno justo en el centro).</li>";
      html += "<li><b>Busca el del centro:</b> con la misma cantidad de números a cada lado, el del medio es <b>" + sorted[mid] + "</b> — esa es la Mediana.</li>";
    }
    return html;
  },

  _generateSurvey: function (type, level) {
    if (type === "frecuencia") {
      this._generateFrequencyTable(level);
      return;
    }

    var set = this.CATEGORY_SETS[Math.floor(Math.random() * this.CATEGORY_SETS.length)];
    var iconCount = level === "facil" ? 3 : 4;
    var icons = set.icons.slice(0, iconCount);
    var minCount = level === "facil" ? 1 : 2;
    var maxCount = level === "facil" ? 4 : (level === "medio" ? 6 : 8);
    var counts = icons.map(function () {
      return Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
    });

    var askTotal = Math.random() < 0.4;
    if (askTotal) {
      var total = counts.reduce(function (a, b) { return a + b; }, 0);
      this.eq = { kind: "diagrama", label: set.label, icons: icons, counts: counts, askTotal: true, res: total };
    } else {
      var idx = Math.floor(Math.random() * icons.length);
      this.eq = { kind: "diagrama", label: set.label, icons: icons, counts: counts, askTotal: false, askIdx: idx, res: counts[idx] };
    }
  },

  // Reparte `total` en `parts` enteros positivos aleatorios que suman exactamente `total`.
  _partitionTotal: function (total, parts) {
    var seen = {};
    var cuts = [];
    while (cuts.length < parts - 1) {
      var c = 1 + Math.floor(Math.random() * (total - 1));
      if (!seen[c]) { seen[c] = true; cuts.push(c); }
    }
    cuts.sort(function (a, b) { return a - b; });
    cuts.unshift(0);
    cuts.push(total);
    var counts = [];
    for (var i = 0; i < parts; i++) counts.push(cuts[i + 1] - cuts[i]);
    return counts;
  },

  _round2: function (x) { return Math.round(x * 100) / 100; },

  // Desglosa fa ÷ total como una división larga con decimales (dividendo < divisor),
  // paso a paso: "bajar un cero", dividir, anotar el dígito, repetir.
  _frequencyStepsHtml: function (fa, total, askType) {
    var html = "";
    html += "<li><b>Compara:</b> El dividendo (<b>" + fa + "</b>) es más chico que el divisor (<b>" + total + "</b>). Como " + fa + " no cabe ni una vez completa dentro de " + total + ", el resultado empieza en <b>0,</b> (cero coma).</li>";

    var remainder = fa;
    var digits = "";
    for (var i = 0; i < 2; i++) {
      var working = remainder * 10;
      var d = Math.floor(working / total);
      var newRemainder = working - d * total;
      html += "<li><b>Baja un cero:</b> Al " + remainder + " le agregamos un cero: se convierte en <b>" + working + "</b>. Divide: " + working + " ÷ " + total + " = <b>" + d + "</b>" +
        (newRemainder > 0 ? " (sobran " + newRemainder + ")" : " (exacto, sin residuo)") +
        ". Ese <b>" + d + "</b> es el siguiente número después de la coma.</li>";
      digits += String(d);
      remainder = newRemainder;
    }
    var frStr = "0," + digits;
    html += "<li><b>Frecuencia Relativa:</b> Uniendo los números que sacaste: <b>" + frStr + "</b>.</li>";

    if (askType === "porcentual") {
      var fp = Math.round(parseInt(digits, 10));
      html += "<li><b>Multiplica por 100:</b> Para pasar de Relativa a Porcentual, la coma salta DOS lugares a la derecha:" +
        "<div class=\"flex items-center justify-center gap-3 font-mono text-2xl bg-white rounded-lg p-3 my-2 border border-pink-200 flex-wrap\">" +
        "<span>0<span class=\"text-pink-500 font-black\">,</span>" + digits + "</span>" +
        "<span class=\"text-slate-400 text-sm\">× 100 =</span>" +
        "<span>" + fp + "<span class=\"text-pink-500 font-black\">,</span>0</span>" +
        "<span class=\"text-slate-400 text-sm\">→</span>" +
        "<span class=\"font-black\">" + fp + "%</span>" +
        "</div>" +
        "Entonces <b>" + frStr + "</b> se convierte en <b>" + fp + "%</b>.</li>";
    }
    return html;
  },

  _generateFrequencyTable: function (level) {
    var set = this.CATEGORY_SETS[Math.floor(Math.random() * this.CATEGORY_SETS.length)];
    var iconCount = level === "facil" ? 3 : 4;
    var icons = set.icons.slice(0, iconCount);

    var totals = this.FREQ_TOTALS_BY_LEVEL[level] || this.FREQ_TOTALS_BY_LEVEL.facil;
    var total = totals[Math.floor(Math.random() * totals.length)];
    var counts = this._partitionTotal(total, icons.length);

    var raw = [];
    icons.forEach(function (icon, i) {
      for (var k = 0; k < counts[i]; k++) raw.push(icon);
    });
    raw.sort(function () { return Math.random() - 0.5; });

    var askTypes = this.ASK_TYPES_BY_LEVEL[level] || this.ASK_TYPES_BY_LEVEL.facil;
    var askType = askTypes[Math.floor(Math.random() * askTypes.length)];
    var blankIdx = Math.floor(Math.random() * icons.length);

    var fa = counts[blankIdx];
    var fr = this._round2(fa / total);
    var fp = Math.round(fr * 100);
    var res = askType === "absoluta" ? fa : (askType === "relativa" ? fr : fp);

    this.eq = {
      kind: "frecuencia", label: set.label, icons: icons, counts: counts,
      total: total, raw: raw, blankIdx: blankIdx, askType: askType, res: res
    };
  },

  showExample: function (container) {
    var eq = this.eq || { kind: "medida", type: "moda" };
    var html;
    if (eq.kind === "frecuencia" || eq.kind === "diagrama") {
      html =
        "<div class=\"p-4 md:p-6 bg-indigo-50 rounded-xl border-2 border-indigo-200\">" +
        "<p class=\"font-bold text-indigo-800 mb-4 border-b-2 border-indigo-200 pb-2 text-xl\">Ejemplo: Frecuencia Absoluta, Relativa y Porcentual</p>" +
        "<ul class=\"list-decimal pl-6 space-y-3\">" +
        "<li><b>La encuesta:</b> Le preguntamos a 10 personas su sabor de paleta favorito: <span class=\"bg-white border px-2 rounded font-bold\">🍓 🍫 🍓 🍋 🍫 🍓 🍫 🍓 🍫 🍋</span> (10 respuestas en total).</li>" +
        "<li><b>Frecuencia Absoluta (fa):</b> Cuenta uno por uno cuántas veces se repite cada sabor. 🍓 → <b>4</b>, 🍫 → <b>4</b>, 🍋 → <b>2</b>. (4 + 4 + 2 = 10, ¡debe dar el total de encuestados!).</li>" +
        "<li><b>Frecuencia Relativa (fr):</b> Es la Absoluta <b>DIVIDIDA</b> entre el Total: fr = fa ÷ total. Para 🍓: <b>4 ÷ 10 = 0,40</b>. Para 🍋: <b>2 ÷ 10 = 0,20</b>. (Las relativas de todas las filas siempre suman 1,00).</li>" +
        "<li><b>Frecuencia Porcentual (fp):</b> Es la Relativa <b>MULTIPLICADA por 100</b> (o Absoluta ÷ Total × 100): fp = fr × 100. Para 🍓: <b>0,40 × 100 = 40%</b>. Para 🍋: <b>0,20 × 100 = 20%</b>. (Las porcentuales siempre suman 100%).</li>" +
        "</ul></div>";

      if (eq.kind === "frecuencia" && (eq.askType === "relativa" || eq.askType === "porcentual")) {
        var fa = eq.counts[eq.blankIdx];
        html +=
          "<div class=\"p-4 md:p-6 bg-pink-50 rounded-xl border-2 border-pink-200 mt-4\">" +
          "<p class=\"font-bold text-pink-800 mb-4 border-b-2 border-pink-200 pb-2 text-xl\">👉 Paso a paso con TU ejercicio actual</p>" +
          "<p class=\"mb-3 font-sans text-slate-600\">Para " + eq.icons[eq.blankIdx] + " necesitas dividir <b>" + fa + " ÷ " + eq.total + "</b>. Como " + fa + " es más chico que " + eq.total + ", así se hace paso a paso:</p>" +
          "<ol class=\"list-decimal pl-6 space-y-3\">" +
          this._frequencyStepsHtml(fa, eq.total, eq.askType) +
          "</ol></div>";
      }
    } else if (eq.type === "mediana") {
      html =
        "<div class=\"p-4 md:p-6 bg-indigo-50 rounded-xl border-2 border-indigo-200\">" +
        "<p class=\"font-bold text-indigo-800 mb-4 border-b-2 border-indigo-200 pb-2 text-xl\">Ejemplo: Encontrar la Mediana</p>" +
        "<ul class=\"list-decimal pl-6 space-y-3\">" +
        "<li><b>Datos de ejemplo:</b> Imagina que tenemos: <span class=\"bg-white border px-2 rounded font-bold\">9, 2, 7, 4, 5</span> (sin ordenar).</li>" +
        "<li><b>Paso 1 — Ordena:</b> De menor a mayor: <b>2, 4, 5, 7, 9</b>.</li>" +
        "<li><b>Paso 2 — Busca el centro:</b> Como son 5 números, el del MEDIO (con la misma cantidad a cada lado) es el 3º: <b>5</b>.</li>" +
        "<li><b>Resultado:</b> La mediana es <b>5</b>. ¡Ojo! No es un promedio: es literalmente el que quedó en el centro después de ordenar.</li>" +
        "</ul></div>";
      if (eq.nums) {
        html +=
          "<div class=\"p-4 md:p-6 bg-pink-50 rounded-xl border-2 border-pink-200 mt-4\">" +
          "<p class=\"font-bold text-pink-800 mb-4 border-b-2 border-pink-200 pb-2 text-xl\">👉 Paso a paso con TU ejercicio actual</p>" +
          "<ol class=\"list-decimal pl-6 space-y-3\">" + this._measureStepsHtml("mediana", eq.nums) + "</ol></div>";
      }
    } else {
      var isModa = eq.type !== "media";
      html =
        "<div class=\"p-4 md:p-6 bg-indigo-50 rounded-xl border-2 border-indigo-200\">" +
        "<p class=\"font-bold text-indigo-800 mb-4 border-b-2 border-indigo-200 pb-2 text-xl\">Ejemplo: Encontrar la " + (isModa ? "Moda" : "Media") + "</p>" +
        "<ul class=\"list-decimal pl-6 space-y-3\">" +
        (isModa
          ? "<li><b>Datos de ejemplo:</b> Imagina que tenemos: <span class=\"bg-white border px-2 rounded font-bold\">2, 5, 5, 8, 9</span>.</li>" +
            "<li><b>Regla:</b> La Moda es simplemente el número que más se repite (el que está 'de moda' en el grupo).</li>" +
            "<li><b>Observa:</b> El número <b>5</b> aparece más veces que los demás. Esa es la respuesta.</li>"
          : "<li><b>Datos de ejemplo:</b> Imagina que tenemos: <span class=\"bg-white border px-2 rounded font-bold\">4, 6, 8, 10</span>.</li>" +
            "<li><b>Regla:</b> La Media (Promedio) requiere que sumes todos los números y dividas ese total entre la cantidad de números.</li>" +
            "<li><b>Suma total:</b> 4 + 6 + 8 + 10 = <b>28</b>.</li>" +
            "<li><b>División:</b> Dividimos entre 4 (cuántos números sumamos). 28 ÷ 4 = <b>7</b>.</li>"
        ) +
        "</ul></div>";
      if (eq.nums) {
        html +=
          "<div class=\"p-4 md:p-6 bg-pink-50 rounded-xl border-2 border-pink-200 mt-4\">" +
          "<p class=\"font-bold text-pink-800 mb-4 border-b-2 border-pink-200 pb-2 text-xl\">👉 Paso a paso con TU ejercicio actual</p>" +
          "<ol class=\"list-decimal pl-6 space-y-3\">" + this._measureStepsHtml(eq.type, eq.nums) + "</ol></div>";
      }
    }
    container.innerHTML = html;
  },

  renderRow: function () {
    var container = document.getElementById("lines-container");
    var eq = this.eq;
    if (eq.kind === "medida") this._renderMedida(container, eq);
    else if (eq.kind === "frecuencia") this._renderFrecuencia(container, eq);
    else this._renderDiagrama(container, eq);
  },

  _renderMedida: function (container, eq) {
    var row = document.createElement("div");
    row.className = "flex flex-col items-center justify-center gap-4 math-font text-slate-700 w-full animate-fade-in mb-4";
    var numsHTML = eq.nums
      .map(function (n) {
        return "<div class=\"bg-yellow-100 border-4 border-yellow-400 text-yellow-700 px-4 py-2 rounded-2xl text-3xl font-black shadow-sm\">" + n + "</div>";
      })
      .join("");
    row.innerHTML =
      "<p class=\"text-xl md:text-2xl text-slate-500 mb-2\">Datos recopilados:</p>" +
      "<div class=\"flex flex-wrap justify-center gap-3\">" + numsHTML + "</div>";
    container.appendChild(row);

    var self = this;
    // Distractores con sentido: los otros números de la lista (para que no se
    // pueda acertar "por descarte"), el del centro SIN ordenar (error clásico de
    // mediana) y la media/mediana cruzadas (para no confundirlas).
    var sorted = eq.nums.slice().sort(function (a, b) { return a - b; });
    var sum = eq.nums.reduce(function (a, b) { return a + b; }, 0);
    var preferred = [];
    if (eq.type === "mediana") preferred.push(eq.nums[2]);
    if (sum % eq.nums.length === 0) preferred.push(sum / eq.nums.length);
    preferred.push(sorted[2]);
    eq.nums.forEach(function (n) { preferred.push(n); });
    generateOptionsUI(eq.res, function (val, btn) { self.verify(val, btn); }, "¿Cuál es la <b>" + eq.type.toUpperCase() + "</b> de estos datos?", preferred);
  },

  _renderFrecuencia: function (container, eq) {
    var self = this;
    var row = document.createElement("div");
    row.className = "flex flex-col items-center w-full animate-fade-in mb-4";

    var rawHTML = eq.raw
      .map(function (icon) { return "<span class=\"inline-block text-2xl md:text-3xl mx-1\">" + icon + "</span>"; })
      .join("");

    // En la fila preguntada se ocultan también las celdas que "regalan" la
    // respuesta: si piden la Relativa, no se muestra la Porcentual de esa fila
    // (y viceversa); si piden la Absoluta, se ocultan las tres.
    var blank = "<span class=\"text-pink-500 font-black\">?</span>";
    var dash = "<span class=\"text-slate-300\">—</span>";
    var tableRows = eq.icons
      .map(function (icon, i) {
        var fa = eq.counts[i];
        var fr = self._round2(fa / eq.total);
        var fp = Math.round(fr * 100);
        var isRow = i === eq.blankIdx;
        var faCell = String(fa), frCell = self._fmtRel(fr), fpCell = fp + "%";
        if (isRow && eq.askType === "absoluta") { faCell = blank; frCell = dash; fpCell = dash; }
        if (isRow && eq.askType === "relativa") { frCell = blank; fpCell = dash; }
        if (isRow && eq.askType === "porcentual") { fpCell = blank; }
        var td = "px-2 md:px-3 py-2 text-center";
        return "<tr class=\"border-b border-indigo-100\">" +
          "<td class=\"" + td + " text-2xl\">" + icon + "</td>" +
          "<td class=\"" + td + "\">" + faCell + "</td>" +
          "<td class=\"" + td + "\">" + frCell + "</td>" +
          "<td class=\"" + td + "\">" + fpCell + "</td>" +
          "</tr>";
      })
      .join("");

    var totalsRow =
      "<tr class=\"bg-indigo-50 font-black\">" +
      "<td class=\"px-2 md:px-3 py-2 text-center\">Total</td>" +
      "<td class=\"px-2 md:px-3 py-2 text-center\">" + eq.total + "</td>" +
      "<td class=\"px-2 md:px-3 py-2 text-center\">1,00</td>" +
      "<td class=\"px-2 md:px-3 py-2 text-center\">100%</td>" +
      "</tr>";

    var askLabel = eq.askType === "absoluta" ? "Absoluta" : (eq.askType === "relativa" ? "Relativa" : "Porcentual");

    row.innerHTML =
      "<p class=\"text-lg md:text-xl text-slate-500 mb-2 font-sans text-center\">Encuesta: " + eq.label + " (Total encuestados: " + eq.total + ")</p>" +
      "<div class=\"flex flex-wrap justify-center max-w-md mb-4 bg-indigo-50/60 border-2 border-indigo-100 rounded-2xl px-3 py-2\">" + rawHTML + "</div>" +
      "<p class=\"text-xs md:text-sm text-slate-400 font-sans mb-1\">Tabla de frecuencias</p>" +
      "<div class=\"overflow-x-auto max-w-full\">" +
      "<table class=\"bg-white border-2 border-indigo-200 rounded-2xl overflow-hidden text-xs md:text-base font-sans\">" +
      "<thead><tr class=\"bg-indigo-100 text-indigo-700 font-black\">" +
      "<td class=\"px-2 md:px-3 py-2 text-center\">Símbolo</td><td class=\"px-2 md:px-3 py-2 text-center\">Absoluta</td><td class=\"px-2 md:px-3 py-2 text-center\">Relativa</td><td class=\"px-2 md:px-3 py-2 text-center\">Porcentual</td>" +
      "</tr></thead><tbody>" + tableRows + totalsRow + "</tbody></table></div>";
    container.appendChild(row);

    var question = "¿Cuál es la Frecuencia " + askLabel + " de " + eq.icons[eq.blankIdx] + "?";
    if (eq.askType === "absoluta") {
      generateOptionsUI(eq.res, function (val, btn) { self.verify(val, btn); }, question);
    } else {
      this._renderFreqCustomOptions(eq, question);
    }
  },

  // Distractores plausibles para Frecuencia Relativa/Porcentual: los valores reales de
  // las OTRAS filas, más pequeñas variaciones de +/-1..4 sobre el conteo real.
  _relFreqOptionValues: function (eq) {
    var self = this;
    function valueFor(count) {
      var fr = self._round2(count / eq.total);
      return eq.askType === "relativa" ? fr : Math.round(fr * 100);
    }
    var vals = [eq.res];
    eq.counts.forEach(function (c, i) {
      if (i === eq.blankIdx) return;
      var v = valueFor(c);
      if (vals.indexOf(v) === -1) vals.push(v);
    });
    var count = eq.counts[eq.blankIdx];
    var deltas = [1, -1, 2, -2, 3, -3, 4, -4];
    var di = 0;
    while (vals.length < 5 && di < deltas.length) {
      var c2 = count + deltas[di]; di++;
      if (c2 < 0 || c2 > eq.total) continue;
      var v2 = valueFor(c2);
      if (vals.indexOf(v2) === -1) vals.push(v2);
    }
    return vals;
  },

  _renderFreqCustomOptions: function (eq, questionText) {
    var self = this;
    var values = this._relFreqOptionValues(eq).slice();
    values.sort(function () { return Math.random() - 0.5; });

    var container = document.createElement("div");
    container.className = "flex flex-col items-center w-full mt-4 md:mt-6 animate-fade-in";
    container.id = "options-container";

    var prefix = document.createElement("div");
    prefix.className = "text-xl md:text-2xl text-slate-500 mb-3 math-font text-center";
    prefix.innerHTML = questionText;
    container.appendChild(prefix);

    var btnsDiv = document.createElement("div");
    btnsDiv.className = "flex flex-wrap justify-center gap-2 md:gap-3";

    values.forEach(function (v) {
      var btn = document.createElement("button");
      btn.className = "font-sans bg-white border-4 border-indigo-200 hover:border-indigo-400 text-indigo-700 font-bold text-xl md:text-2xl py-2 px-4 md:px-5 rounded-2xl shadow-[0_4px_0_#c7d2fe] active:translate-y-1 active:shadow-none transition-all tracking-wider";
      btn.type = "button";
      btn.innerText = self._fmtVal(eq.askType, v);
      btn.onclick = function () { self.verify(v, btn); };
      btnsDiv.appendChild(btn);
    });
    container.appendChild(btnsDiv);
    document.getElementById("lines-container").appendChild(container);
  },

  _renderDiagrama: function (container, eq) {
    var row = document.createElement("div");
    row.className = "flex flex-col items-center w-full animate-fade-in mb-4";

    var maxCount = Math.max.apply(null, eq.counts);
    var maxBarHeight = 150;
    var bars = eq.icons
      .map(function (icon, i) {
        var h = Math.max(14, Math.round((eq.counts[i] / maxCount) * maxBarHeight));
        return "<div class=\"flex flex-col items-center justify-end mx-2\" style=\"height:" + maxBarHeight + "px\">" +
          "<div class=\"bg-indigo-300 border-2 border-indigo-400 rounded-t-lg w-10 md:w-14\" style=\"height:" + h + "px\"></div>" +
          "<div class=\"text-2xl md:text-3xl mt-1\">" + icon + "</div>" +
          "</div>";
      })
      .join("");

    var question = eq.askTotal
      ? "¿Cuántos encuestados respondieron en total?"
      : "¿Cuántos votos tiene " + eq.icons[eq.askIdx] + "?";

    row.innerHTML =
      "<p class=\"text-lg md:text-xl text-slate-500 mb-3 font-sans text-center\">Diagrama: " + eq.label + "</p>" +
      "<div class=\"flex items-end justify-center gap-1 bg-indigo-50/60 border-2 border-indigo-100 rounded-2xl px-4 pt-4 pb-2\">" + bars + "</div>";
    container.appendChild(row);

    var self = this;
    generateOptionsUI(eq.res, function (val, btn) { self.verify(val, btn); }, question);
  },

  verify: function (val, btn) {
    var self = this;
    var eq = this.eq;
    if (val === eq.res) {
      handleCorrectOption(btn, function () {
        var msg;
        if (eq.kind === "medida") {
          msg = "¡Genial! La " + eq.type + " de estos datos es exactamente <b>" + eq.res + "</b>.";
        } else if (eq.kind === "frecuencia") {
          var okLabel = eq.askType === "absoluta" ? "Absoluta" : (eq.askType === "relativa" ? "Relativa" : "Porcentual");
          var okVal = self._fmtVal(eq.askType, eq.res);
          var faOk = eq.counts[eq.blankIdx];
          var how = eq.askType === "absoluta" ? "" : (eq.askType === "relativa"
            ? " (" + faOk + " ÷ " + eq.total + " = " + okVal + ")"
            : " (" + faOk + " ÷ " + eq.total + " × 100 = " + okVal + ")");
          msg = "¡Correcto! La Frecuencia " + okLabel + " de " + eq.icons[eq.blankIdx] + " es <b>" + okVal + "</b>" + how + ".";
        } else {
          msg = "¡Correcto! Leíste bien el diagrama: la respuesta es <b>" + eq.res + "</b>.";
        }
        App.updateTeacher("¡Análisis perfecto! 🎉", msg, "🌟");
        document.getElementById("success-area").classList.remove("hidden-el");
        App.triggerConfetti();
      });
    } else {
      var errExtra = "";
      if (eq.kind === "medida") {
        if (eq.type === "moda") {
          errExtra = "<br><br>💡 <b>Tip de oro:</b> La MODA es el número que <b>más se repite</b> en el grupo. Fíjate bien cuál aparece más veces.";
        } else if (eq.type === "media") {
          errExtra = "<br><br>💡 <b>Tip de oro:</b> La MEDIA (Promedio) se calcula <b>sumando todos los números</b> y dividiendo el resultado entre la cantidad total (5).";
        } else {
          errExtra = "<br><br>💡 <b>Tip de oro:</b> Para la MEDIANA, primero <b>ordena</b> los números de menor a mayor. Luego busca el que quedó justo en el <b>medio</b>.";
        }
      } else if (eq.kind === "frecuencia") {
        var fa = eq.counts[eq.blankIdx];
        if (eq.askType === "absoluta") {
          errExtra = "<br><br>💡 <b>Tip de oro:</b> Cuenta uno por uno cuántas veces aparece " + eq.icons[eq.blankIdx] + " en la fila de arriba. Puedes ir tachándolos mentalmente mientras cuentas.";
        } else if (eq.askType === "relativa") {
          errExtra = "<br><br>💡 <b>Tip de oro:</b> La Frecuencia Relativa es la Absoluta <b>DIVIDIDA</b> entre el Total. Aquí sería " + fa + " ÷ " + eq.total + ".";
        } else {
          errExtra = "<br><br>💡 <b>Tip de oro:</b> La Frecuencia Porcentual es la Relativa <b>× 100</b> (o Absoluta ÷ Total × 100). Aquí sería (" + fa + " ÷ " + eq.total + ") × 100.";
        }
      } else {
        errExtra = eq.askTotal
          ? "<br><br>💡 <b>Tip de oro:</b> Para el total, suma la altura (los votos) de TODAS las barras, una por una."
          : "<br><br>💡 <b>Tip de oro:</b> Busca la barra de " + eq.icons[eq.askIdx] + " y fíjate qué tan alta es comparada con las demás.";
      }
      var shown = eq.kind === "frecuencia" ? self._fmtVal(eq.askType, val) : val;
      handleWrongOption(btn, function () {
        App.updateTeacher("¡Casi! Revisa los datos", "Elegiste <b>" + shown + "</b>, pero algo salió distinto. " + errExtra, "🫣");
      });
    }
  },

  cleanup: function () {}
};

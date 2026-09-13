/**
 * Juego de Regla de 3 (Matemáticas 5º): directa, inversa y porcentajes.
 *
 * El nivel controla el tamaño de los números y, en "Variado", qué tipos entran:
 * fácil = solo directa; medio = directa + inversa; difícil = directa + inversa +
 * porcentajes (decisión de Luis, 2026-09-13: los porcentajes van en la
 * dificultad alta). Si Sofía elige un tipo en el selector (#regla-type-selector)
 * se practica ese tipo en cualquier nivel, con los números de ese nivel.
 *
 * Todos los problemas se arman para que el resultado sea un entero positivo
 * (5º: sin decimales ni negativos) y la tabla siempre deja el "?" abajo a la
 * derecha, que es como se enseña en el colegio.
 */
var ReglaGame = {
  eq: null,
  typeFilter: "variado",

  // Tipos que sortea "Variado" en cada nivel (repetidos = más probables).
  TYPES_BY_LEVEL: {
    facil: ["directa"],
    medio: ["directa", "directa", "inversa"],
    dificil: ["directa", "inversa", "porcentaje", "porcentaje"]
  },

  // --- Regla de 3 DIRECTA -------------------------------------------------
  // a = magnitud de la columna izquierda, b = derecha. kind decide el "valor
  // unitario" k (precio por unidad, galletas por taza, km por hora...).
  // flip = la cantidad conocida es el dinero y se pregunta por unidades.
  DIRECT_CONTEXTS: [
    { a: { sing: "cupcake", plur: "cupcakes" }, b: { money: true, name: "dinero" }, kind: "money", min: "facil",
      story: "Si {A1} cuestan {B1}, ¿cuánto cuestan {A2}?" },
    { a: { sing: "paleta", plur: "paletas" }, b: { money: true, name: "dinero" }, kind: "money", min: "facil",
      story: "En la tienda, {A1} cuestan {B1}. ¿Cuánto pagas por {A2}?" },
    { a: { sing: "taza de harina", plur: "tazas de harina" }, b: { sing: "galleta", plur: "galletas" }, kind: "count", min: "facil",
      story: "Con {A1} salen {B1}. ¿Cuántas galletas salen con {A2}?" },
    { a: { sing: "caja", plur: "cajas" }, b: { sing: "lápiz", plur: "lápices" }, kind: "count", min: "facil",
      story: "En {A1} caben {B1}. ¿Cuántos lápices caben en {A2}?" },
    { a: { sing: "vaso de limonada", plur: "vasos de limonada" }, b: { sing: "limón", plur: "limones" }, kind: "count", min: "facil",
      story: "Para preparar {A1} se necesitan {B1}. ¿Cuántos limones necesitas para {A2}?" },
    { a: { sing: "hora", plur: "horas" }, b: { sing: "km", plur: "km" }, kind: "km", min: "medio",
      story: "Un carro recorre {B1} en {A1}. Si va siempre a la misma velocidad, ¿cuántos km recorre en {A2}?" },
    { a: { sing: "día", plur: "días" }, b: { sing: "página", plur: "páginas" }, kind: "count", min: "medio",
      story: "Ana lee {B1} en {A1}. Si sigue al mismo ritmo, ¿cuántas páginas lee en {A2}?" },
    { a: { sing: "minuto", plur: "minutos" }, b: { sing: "litro", plur: "litros" }, kind: "count", min: "medio",
      story: "Una llave llena {B1} en {A1}. ¿Cuántos litros llena en {A2}?" },
    { a: { money: true, name: "dinero" }, b: { sing: "cupcake", plur: "cupcakes" }, kind: "money", min: "medio", flip: true,
      story: "Con {A1} compras {B1}. ¿Cuántos cupcakes compras con {A2}?" },
    { a: { money: true, name: "dinero" }, b: { sing: "empanada", plur: "empanadas" }, kind: "money", min: "dificil", flip: true,
      story: "Con {A1} alcanza para {B1}. ¿Para cuántas empanadas alcanza con {A2}?" }
  ],
  K_BY_KIND: {
    money: { facil: [500, 1000, 2000, 3000], medio: [500, 1500, 2500, 3500, 4000, 5000], dificil: [750, 1200, 2300, 4500, 6500, 8000] },
    count: { facil: [2, 3, 4, 5, 6], medio: [3, 4, 5, 6, 7, 8, 9, 12], dificil: [4, 6, 7, 9, 11, 12, 15, 18, 25] },
    km: { facil: [30, 40, 50, 60], medio: [40, 45, 60, 70, 80, 90], dificil: [55, 65, 72, 85, 95, 110] }
  },
  N_BY_LEVEL: {
    facil: { n1: [2, 4], n2: [2, 8] },
    medio: { n1: [2, 6], n2: [3, 12] },
    dificil: { n1: [3, 9], n2: [4, 20] }
  },

  // --- Regla de 3 INVERSA -------------------------------------------------
  // Más de "a" → menos de "b". El producto a × b se mantiene.
  INVERSE_CONTEXTS: [
    { a: { sing: "pintor", plur: "pintores" }, b: { sing: "día", plur: "días" },
      story: "{A1} pintan una casa en {B1}. Si trabajan {A2} al mismo ritmo, ¿en cuántos días la pintan?" },
    { a: { sing: "grifo", plur: "grifos" }, b: { sing: "hora", plur: "horas" },
      story: "Con {A1} abiertos, la piscina se llena en {B1}. ¿En cuántas horas se llena con {A2}?" },
    { a: { sing: "amiga", plur: "amigas" }, b: { sing: "galleta", plur: "galletas" },
      story: "Si {A1} se reparten una bolsa de galletas, le tocan {B1} a cada una. Si en vez de eso fueran {A2}, ¿cuántas galletas le tocan a cada una?" },
    { a: { sing: "máquina", plur: "máquinas" }, b: { sing: "hora", plur: "horas" },
      story: "{A1} terminan un pedido de camisetas en {B1}. ¿Cuántas horas tardan {A2} iguales?" },
    { a: { suffix: " km/h", name: "velocidad" }, b: { sing: "hora", plur: "horas" }, aVals: [30, 40, 45, 50, 60, 80, 90, 100, 120],
      story: "Un bus que va a {A1} tarda {B1} en llegar a la finca. Si fuera a {A2}, ¿cuántas horas tardaría?" },
    { a: { sing: "cupcake en cada caja", plur: "cupcakes en cada caja" }, b: { sing: "caja", plur: "cajas" },
      story: "Si pones {A1}, necesitas {B1}. Si pones {A2}, ¿cuántas cajas necesitas?" }
  ],
  INV_RANGES: {
    facil: { a: [2, 4], b: [2, 10], aMax: 8 },
    medio: { a: [2, 6], b: [2, 12], aMax: 12 },
    dificil: { a: [2, 12], b: [3, 24], aMax: 24 }
  },

  // --- PORCENTAJES (una regla de 3 directa donde el total es el 100%) -------
  // sub "parte": ¿cuánto es el P% de T?  sub "porcentaje": ¿qué % es N de T?
  // sub "total": si N es el P%, ¿cuánto es el 100%?
  PCT_CONTEXTS: {
    parte: [
      { unit: { sing: "estudiante", plur: "estudiantes" }, story: "De los {T} del salón, el {P} usan gafas. ¿Cuántos usan gafas?" },
      { unit: { money: true, name: "dinero" }, money: true, story: "Un juguete cuesta {T} y tiene un descuento del {P}. ¿Cuánto dinero te descuentan?" },
      { unit: { sing: "cupcake", plur: "cupcakes" }, story: "En la vitrina hay {T} y el {P} son de chocolate. ¿Cuántos son de chocolate?" },
      { unit: { sing: "litro", plur: "litros" }, story: "El tanque tiene {T} de agua y ya se usó el {P}. ¿Cuántos litros se usaron?" }
    ],
    porcentaje: [
      { unit: { sing: "pregunta", plur: "preguntas" }, story: "Contestaste bien {N} de las {T} del examen. ¿Qué porcentaje acertaste?" },
      { unit: { sing: "paleta", plur: "paletas" }, story: "De {T} que preparaste, vendiste {N}. ¿Qué porcentaje vendiste?" },
      { unit: { sing: "jugador", plur: "jugadores" }, story: "En el equipo hay {T} y {N} son niñas. ¿Qué porcentaje del equipo son niñas?" }
    ],
    total: [
      { unit: { sing: "cupcake", plur: "cupcakes" }, story: "El {P} de los cupcakes son de vainilla y son {N}. ¿Cuántos cupcakes hay en total?" },
      { unit: { money: true, name: "dinero" }, money: true, story: "Ya ahorraste {N} y eso es el {P} del precio de la bicicleta. ¿Cuánto cuesta la bicicleta?" },
      { unit: { sing: "estudiante", plur: "estudiantes" }, story: "El {P} de los estudiantes del colegio van en bus y son {N}. ¿Cuántos estudiantes hay en total?" }
    ]
  },
  PCT_MAG: { pct: true, name: "porcentaje" },
  PCT_BY_LEVEL: {
    facil: [10, 20, 25, 50],
    medio: [10, 20, 25, 30, 40, 50, 60, 75, 80],
    dificil: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 65, 70, 75, 80, 85, 90, 95]
  },
  PCT_SUBS_BY_LEVEL: { facil: ["parte"], medio: ["parte", "porcentaje"], dificil: ["parte", "porcentaje", "total"] },
  PCT_TOTAL_RANGE: { facil: [8, 40], medio: [10, 80], dificil: [20, 200] },
  PCT_MONEY_RANGE: { facil: [10, 50], medio: [10, 80], dificil: [12, 250] },   // en miles de pesos
  // Sin 100: "37 de 100 preguntas" ya trae la respuesta escrita (37%).
  PCT_FIND_TOTALS: { facil: [10, 20, 50], medio: [10, 20, 25, 50], dificil: [20, 25, 40, 50, 80, 200, 250, 500] },

  // --- Utilidades ---------------------------------------------------------
  _rand: function (min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },
  _pick: function (arr) { return arr[Math.floor(Math.random() * arr.length)]; },
  _range: function (min, max) { var r = []; for (var i = min; i <= max; i++) r.push(i); return r; },
  _gcd: function (a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; },
  // Separador de miles con punto, como en Colombia: 10000 → "10.000".
  _miles: function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "."); },
  _money: function (n) { return "$" + this._miles(n); },
  // Valor con su unidad según la magnitud: "$6.000", "25%", "60 km/h", "3 cupcakes".
  _fmt: function (mag, n) {
    if (mag.money) return this._money(n);
    if (mag.pct) return n + "%";
    if (mag.suffix) return this._miles(n) + mag.suffix;
    return this._miles(n) + " " + (n === 1 ? mag.sing : mag.plur);
  },
  // Nombre de la magnitud para hablar de ella ("más cupcakes → más dinero").
  _name: function (mag) { return mag.name || mag.plur; },
  _cap: function (s) { return s.charAt(0).toUpperCase() + s.slice(1); },

  // --- Selector "Elige el tipo" (botones en index.html) --------------------
  setTypeFilter: function (type) {
    this.typeFilter = type;
    this.renderTypeSelectorState();
    App.generateContent();
  },

  renderTypeSelectorState: function () {
    var self = this;
    var current = this.typeFilter || "variado";
    ["variado", "directa", "inversa", "porcentaje"].forEach(function (t) {
      var btn = document.getElementById("regla-type-" + t);
      if (!btn) return;
      var isActive = current === t;
      btn.onclick = function () { self.setTypeFilter(t); };
      btn.className = "regla-type-btn font-bold py-2 px-3 min-h-[40px] text-sm rounded-full shadow-sm transition-all border-2 " +
        (isActive
          ? "bg-emerald-500 border-emerald-500 text-white ring-4 ring-white scale-110"
          : "bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50");
    });
  },

  start: function (level) {
    this.generateValues(level);
    var eq = this.eq;
    var title, msg;
    if (eq.type === "porcentaje") {
      title = "Paso 1: El total es el 100%";
      msg = "Los porcentajes se resuelven con una regla de 3 directa: escribe <b>100%</b> frente al total y arma la tabla. Luego multiplica en cruz y divide.";
    } else if (this.typeFilter === "variado") {
      // En Variado no se dice si es directa o inversa: descubrirlo es parte del reto.
      title = "Paso 1: ¿Directa o inversa?";
      msg = "Pregúntate: si hay <b>más " + this._name(eq.magA) + "</b>, ¿hay <b>más</b> o <b>menos</b> " + this._name(eq.magB) + "? Más → más es <b>directa</b> (en cruz). Más → menos es <b>inversa</b> (en línea).";
    } else if (eq.type === "directa") {
      title = "Paso 1: Regla de 3 directa";
      msg = "Más " + this._name(eq.magA) + " → más " + this._name(eq.magB) + ". Multiplica <b>en cruz</b> los dos números que quedan en diagonal frente al ? y divide entre el que sobra.";
    } else {
      title = "Paso 1: Regla de 3 inversa";
      msg = "Más " + this._name(eq.magA) + " → menos " + this._name(eq.magB) + ". Multiplica <b>en línea</b> los dos números de la primera fila y divide entre el que sobra.";
    }
    App.updateTeacher(title, msg, "3️⃣");
    this.renderRow();
  },

  generateValues: function (level) {
    var lvl = this.TYPES_BY_LEVEL[level] ? level : "facil";
    var type = (this.typeFilter && this.typeFilter !== "variado") ? this.typeFilter : this._pick(this.TYPES_BY_LEVEL[lvl]);
    // Los cuatro números de la tabla deben ser distintos: si se repite uno, el
    // ejercicio parece un truco ("2 → 5, 5 → ?" con respuesta 2) o la respuesta
    // ya está escrita en el enunciado (25% de 100 = 25), y eso confunde en vez de enseñar.
    var guard = 0;
    do {
      if (type === "inversa") this._genInversa(lvl);
      else if (type === "porcentaje") this._genPorcentaje(lvl);
      else this._genDirecta(lvl);
      guard++;
    } while (!this._allDistinct(this.eq) && guard < 60);
    this.eq.level = lvl;
  },

  _allDistinct: function (eq) {
    var v = [eq.a1, eq.b1, eq.a2, eq.res];
    for (var i = 0; i < v.length; i++) for (var j = i + 1; j < v.length; j++) if (v[i] === v[j]) return false;
    return true;
  },

  _genDirecta: function (level) {
    var order = ["facil", "medio", "dificil"];
    var lvlIdx = order.indexOf(level);
    var ctxs = this.DIRECT_CONTEXTS.filter(function (c) { return order.indexOf(c.min) <= lvlIdx; });
    var ctx = this._pick(ctxs);
    var nr = this.N_BY_LEVEL[level];
    var n1 = this._rand(nr.n1[0], nr.n1[1]);
    var n2 = this._rand(nr.n2[0], nr.n2[1]);
    var guard = 0;
    while (n2 === n1 && guard++ < 20) n2 = this._rand(nr.n2[0], nr.n2[1]);
    if (n2 === n1) n2 = n1 + 1;
    var k = this._pick(this.K_BY_KIND[ctx.kind][level]);
    var eq = { type: "directa", ctx: ctx, k: k, magA: ctx.a, magB: ctx.b };
    if (ctx.flip) { eq.a1 = n1 * k; eq.a2 = n2 * k; eq.b1 = n1; eq.res = n2; }
    else { eq.a1 = n1; eq.a2 = n2; eq.b1 = n1 * k; eq.res = n2 * k; }
    this.eq = eq;
  },

  _genInversa: function (level) {
    var r = this.INV_RANGES[level];
    var ctx, a1, b1, P, cands, guard = 0;
    do {
      ctx = this._pick(this.INVERSE_CONTEXTS);
      a1 = ctx.aVals ? this._pick(ctx.aVals) : this._rand(r.a[0], r.a[1]);
      b1 = this._rand(r.b[0], r.b[1]);
      P = a1 * b1;
      var pool = ctx.aVals ? ctx.aVals : this._range(2, r.aMax);
      // a2 debe dividir exactamente al producto para que el resultado sea entero,
      // y dar un resultado distinto de b1 (si no, el problema no tiene gracia).
      cands = pool.filter(function (v) { return v !== a1 && P % v === 0 && P / v >= 1 && P / v !== b1; });
      guard++;
    } while (!cands.length && guard < 60);
    if (!cands.length) { ctx = this.INVERSE_CONTEXTS[0]; a1 = 4; b1 = 6; P = 24; cands = [8]; }
    var a2 = this._pick(cands);
    this.eq = { type: "inversa", ctx: ctx, a1: a1, a2: a2, b1: b1, prod: P, res: P / a2, magA: ctx.a, magB: ctx.b };
  },

  _genPorcentaje: function (level) {
    var sub = this._pick(this.PCT_SUBS_BY_LEVEL[level]);
    var ctx = this._pick(this.PCT_CONTEXTS[sub]);
    var pct, total, part, guard = 0;
    if (sub === "porcentaje") {
      // Se busca el %: el total es "redondo" y la parte se elige para que el % sea entero.
      do {
        total = this._pick(this.PCT_FIND_TOTALS[level]);
        part = this._rand(1, total - 1);
        guard++;
      } while ((part * 100) % total !== 0 && guard < 200);
      if ((part * 100) % total !== 0) { total = 20; part = 15; }
      pct = part * 100 / total;
    } else {
      pct = this._pick(this.PCT_BY_LEVEL[level]);
      var step = 100 / this._gcd(pct, 100);   // el total debe ser múltiplo de esto para que la parte sea entera
      if (ctx.money) {
        var mr = this.PCT_MONEY_RANGE[level];  // en miles: cualquier múltiplo de 1.000 da una parte entera
        total = this._rand(mr[0], mr[1]) * 1000;
      } else {
        var tr = this.PCT_TOTAL_RANGE[level];
        var lo = Math.ceil(tr[0] / step), hi = Math.floor(tr[1] / step);
        if (hi < lo) hi = lo;
        total = this._rand(lo, hi) * step;
      }
      part = total * pct / 100;
    }
    var unit = ctx.unit;
    var eq = { type: "porcentaje", sub: sub, ctx: ctx, unitMag: unit, total: total, pct: pct, part: part };
    // Tabla: el ? siempre abajo a la derecha, así que las columnas cambian según lo que se busca.
    if (sub === "parte") { eq.magA = this.PCT_MAG; eq.magB = unit; eq.a1 = 100; eq.b1 = total; eq.a2 = pct; eq.res = part; }
    else if (sub === "porcentaje") { eq.magA = unit; eq.magB = this.PCT_MAG; eq.a1 = total; eq.b1 = 100; eq.a2 = part; eq.res = pct; }
    else { eq.magA = this.PCT_MAG; eq.magB = unit; eq.a1 = pct; eq.b1 = part; eq.a2 = 100; eq.res = total; }
    this.eq = eq;
  },

  // --- Enunciado, tabla y opciones ----------------------------------------
  _storyText: function () {
    var eq = this.eq;
    var s = eq.ctx.story;
    if (eq.type === "porcentaje") {
      var nTxt = eq.ctx.money ? this._money(eq.part) : this._miles(eq.part);
      return s.replace("{T}", this._fmt(eq.unitMag, eq.total)).replace("{P}", eq.pct + "%").replace("{N}", nTxt);
    }
    return s.replace("{A1}", this._fmt(eq.magA, eq.a1)).replace("{B1}", this._fmt(eq.magB, eq.b1)).replace("{A2}", this._fmt(eq.magA, eq.a2));
  },

  // La tabla clásica de dos columnas y dos filas, con el ? abajo a la derecha.
  // opts.small = versión compacta para el Paso a Paso; opts.answer = muestra la respuesta en vez del ?.
  _tableHtml: function (opts) {
    opts = opts || {};
    var eq = this.eq;
    var size = opts.small ? "text-lg md:text-xl px-3 py-1 min-w-[5rem]" : "text-xl md:text-3xl px-3 md:px-5 py-2 min-w-[7rem]";
    var cell = function (txt, cls) {
      return "<div class=\"" + cls + " " + size + " rounded-2xl font-black shadow-sm border-4 text-center whitespace-nowrap\">" + txt + "</div>";
    };
    var known = "bg-yellow-100 border-yellow-400 text-yellow-800";
    var unknown = "bg-pink-100 border-pink-400 border-dashed text-pink-600" + (opts.small ? "" : " animate-pulse");
    var arrow = "<span class=\"" + (opts.small ? "text-xl" : "text-2xl md:text-3xl") + " text-pink-500 font-black text-center\">➜</span>";
    var head = function (t) { return "<div class=\"text-xs uppercase tracking-wide text-slate-400 font-bold text-center font-sans\">" + t + "</div>"; };
    var hasAnswer = opts.answer !== undefined;
    var last = hasAnswer ? cell(this._fmt(eq.magB, opts.answer), "bg-green-100 border-green-500 text-green-700") : cell("?", unknown);
    return "<div class=\"math-font\" style=\"display:grid;grid-template-columns:auto auto auto;align-items:center;column-gap:.75rem;row-gap:.5rem\">" +
      head(this._cap(this._name(eq.magA))) + "<span></span>" + head(this._cap(this._name(eq.magB))) +
      cell(this._fmt(eq.magA, eq.a1), known) + arrow + cell(this._fmt(eq.magB, eq.b1), known) +
      cell(this._fmt(eq.magA, eq.a2), known) + arrow + last +
      "</div>";
  },

  renderRow: function () {
    var container = document.getElementById("lines-container");
    var wrap = document.createElement("div");
    wrap.className = "flex flex-col items-center w-full animate-fade-in mb-4";
    wrap.innerHTML =
      "<p class=\"font-sans text-lg md:text-xl text-slate-700 text-center max-w-xl mb-4 leading-snug\">" + this._storyText() + "</p>" +
      this._tableHtml();
    container.appendChild(wrap);
    this._renderOptions();
  },

  // Distractores con sentido: los errores típicos de cada tipo (olvidar
  // dividir, aplicar directa cuando es inversa, sumar en vez de multiplicar,
  // confundir el % con una cantidad...) y luego vecinos con el "paso" de la
  // unidad (de a 500/1.000 en pesos, de a 5 en porcentajes).
  _buildOptions: function () {
    var eq = this.eq, self = this, res = eq.res;
    var pref = [];
    // Sumar/restar la diferencia solo tiene sentido cuando las dos columnas son
    // cantidades (15 lápices + 1); con pesos daría cosas raras como $5.997.
    var hayDinero = !!(eq.magA.money || eq.magB.money);
    if (eq.type === "directa") {
      pref.push({ v: eq.a2 * eq.b1, tag: "sin_dividir" });
      pref.push({ v: eq.a1 * eq.b1 / eq.a2, tag: "inversa_por_error" });
      if (!hayDinero) pref.push({ v: eq.b1 + (eq.a2 - eq.a1), tag: "sumo" });
      pref.push({ v: eq.a1 * eq.a2 / eq.b1, tag: "cruz_mal" });
    } else if (eq.type === "inversa") {
      pref.push({ v: eq.a2 * eq.b1 / eq.a1, tag: "directa_por_error" });
      pref.push({ v: eq.a1 * eq.b1, tag: "sin_dividir" });
      pref.push({ v: eq.b1 + (eq.a2 - eq.a1), tag: "sumo" });
      pref.push({ v: eq.b1 - (eq.a2 - eq.a1), tag: "resto" });
    } else if (eq.sub === "parte") {
      // Errores típicos: tomar el % como cantidad, calcular el resto, o aplicar otro %.
      if (!hayDinero) pref.push({ v: eq.pct, tag: "pct_suelto" });
      pref.push({ v: eq.total - eq.part, tag: "complemento" });
      pref.push({ v: eq.total * (eq.pct + 10) / 100, tag: "otro_pct" });
      pref.push({ v: eq.total * (eq.pct - 10) / 100, tag: "otro_pct" });
      pref.push({ v: eq.total * (eq.pct + 5) / 100, tag: "otro_pct" });
      pref.push({ v: eq.part * 2, tag: "vecino" });
    } else if (eq.sub === "porcentaje") {
      pref.push({ v: 100 - eq.pct, tag: "complemento" });
      if (eq.part < 100) pref.push({ v: eq.part, tag: "parte_suelta" });
      if (eq.total - eq.part < 100) pref.push({ v: eq.total - eq.part, tag: "resto_cantidad" });
      pref.push({ v: eq.pct + 10, tag: "vecino" });
      pref.push({ v: eq.pct - 10, tag: "vecino" });
    } else {
      pref.push({ v: eq.part * 100 / (eq.pct + 10), tag: "otro_pct" });
      pref.push({ v: eq.part * 100 / (eq.pct - 10), tag: "otro_pct" });
      if (!hayDinero) pref.push({ v: eq.part + eq.pct, tag: "sumo" });
      pref.push({ v: eq.part, tag: "parte_suelta" });
      pref.push({ v: eq.total * 2, tag: "vecino" });
    }
    var opts = [{ v: res, tag: "ok", correct: true }];
    var seen = {}; seen[res] = true;
    var valid = function (v) {
      return typeof v === "number" && isFinite(v) && v === Math.round(v) && v > 0 && !seen[v] && (!eq.magB.pct || v < 100);
    };
    pref.sort(function () { return Math.random() - 0.5; });
    pref.forEach(function (p) { if (opts.length < 5 && valid(p.v)) { seen[p.v] = true; opts.push(p); } });
    var step = eq.magB.money ? (res >= 10000 ? 1000 : 500) : (eq.magB.pct ? 5 : (res > 60 ? 10 : (res > 20 ? 2 : 1)));
    var guard = 0;
    while (opts.length < 5 && guard++ < 100) {
      var v = res + step * self._rand(1, 4) * (Math.random() > 0.5 ? 1 : -1);
      if (valid(v)) { seen[v] = true; opts.push({ v: v, tag: "vecino" }); }
    }
    var up = res + step * 5;
    while (opts.length < 5) { if (valid(up)) { seen[up] = true; opts.push({ v: up, tag: "vecino" }); } up += step; if (up > res + step * 60) break; }
    return opts;
  },

  _renderOptions: function () {
    var self = this, eq = this.eq;
    var opts = this._buildOptions();
    var byLabel = {};
    var labels = opts.map(function (o) { var l = self._fmt(eq.magB, o.v); byLabel[l] = o; return l; });
    var q = (eq.type === "porcentaje" && eq.sub === "porcentaje") ? "¿Qué porcentaje es?" : "¿Cuál es el valor que falta (?)";
    renderOptionsUI(labels, function (label, btn) { self.verify(byLabel[label], btn); }, q);
  },

  // Texto exacto del botón correcto (lo usa scripts/prueba-funcional.py).
  correctText: function () { return this._fmt(this.eq.magB, this.eq.res); },

  _opText: function () {
    var eq = this.eq, m = this._miles.bind(this);
    if (eq.type === "inversa") return m(eq.a1) + " × " + m(eq.b1) + " ÷ " + m(eq.a2) + " = " + m(eq.res);
    return m(eq.a2) + " × " + m(eq.b1) + " ÷ " + m(eq.a1) + " = " + m(eq.res);
  },

  _successMsg: function () {
    var eq = this.eq;
    var A = this._name(eq.magA), B = this._name(eq.magB);
    var ans = "<b>" + this._fmt(eq.magB, eq.res) + "</b>";
    if (eq.type === "directa") return "Era <b>DIRECTA</b> (más " + A + " → más " + B + "): en cruz, " + this._opText() + ". La respuesta es " + ans + ".";
    if (eq.type === "inversa") return "Era <b>INVERSA</b> (más " + A + " → menos " + B + "): en línea, " + this._opText() + ". La respuesta es " + ans + ".";
    return "El total es el <b>100%</b>: en cruz, " + this._opText() + ". La respuesta es " + ans + ".";
  },

  _errorTip: function (tag) {
    var eq = this.eq, m = this._miles.bind(this);
    var A = this._name(eq.magA), B = this._name(eq.magB);
    var tip;
    if (tag === "sin_dividir") tip = "Multiplicaste bien, pero falta el último paso: <b>dividir</b> entre el número que sobra.";
    else if (tag === "inversa_por_error") tip = "Aquí más " + A + " también significa <b>más</b> " + B + ": es <b>directa</b>. Multiplica en cruz (" + m(eq.a2) + " × " + m(eq.b1) + ") y divide entre " + m(eq.a1) + ".";
    else if (tag === "directa_por_error") tip = "¡Ojo! Más " + A + " significa <b>menos</b> " + B + ": es <b>inversa</b>. No multipliques en cruz: multiplica en línea (" + m(eq.a1) + " × " + m(eq.b1) + ") y divide entre " + m(eq.a2) + ".";
    else if (tag === "sumo" || tag === "resto") tip = "La regla de 3 no se resuelve sumando ni restando: hay que <b>multiplicar y dividir</b>.";
    else if (tag === "cruz_mal") tip = "Multiplicaste los números que no van juntos. En cruz se multiplican los dos que quedan en diagonal frente al ?: " + m(eq.a2) + " × " + m(eq.b1) + ".";
    else if (tag === "pct_suelto") tip = "El " + eq.pct + "% no son " + eq.pct + " " + B + ": significa " + eq.pct + " de cada 100. Escribe 100% frente al total y arma la tabla.";
    else if (tag === "complemento") tip = eq.sub === "porcentaje" ? "Ese es el porcentaje que falta para llegar al 100%, no el que preguntan." : "Ese es el resto, lo que NO cumple la condición. El problema pregunta por la parte que sí la cumple.";
    else if (tag === "parte_suelta") tip = "Ese número ya lo da el problema. Lo que falta es " + (eq.sub === "porcentaje" ? "el porcentaje" : "el total, es decir el 100%") + ".";
    else if (tag === "resto_cantidad") tip = "Restaste " + m(eq.total) + " − " + m(eq.part) + ", pero eso es una cantidad, no un porcentaje. Para hallar el %: " + m(eq.part) + " × 100 ÷ " + m(eq.total) + ".";
    else if (tag === "otro_pct") tip = "Ese sería el resultado con otro porcentaje. Fíjate bien: el problema habla del <b>" + eq.pct + "%</b>. Escribe " + eq.pct + " en la tabla frente al " + (eq.sub === "parte" ? "?" : "número que te dan") + " y multiplica en cruz.";
    else tip = eq.type === "inversa"
      ? "Revisa la tabla: es inversa, multiplica en línea (" + m(eq.a1) + " × " + m(eq.b1) + ") y divide entre " + m(eq.a2) + "."
      : "Revisa la tabla: multiplica en cruz (" + m(eq.a2) + " × " + m(eq.b1) + ") y divide entre " + m(eq.a1) + ".";
    return "<br><br>💡 <b>Tip de oro:</b> " + tip;
  },

  verify: function (opt, btn) {
    var self = this, eq = this.eq;
    if (opt && opt.correct) {
      handleCorrectOption(btn, function () {
        App.updateTeacher("¡Regla de 3 perfecta! 🎉", self._successMsg(), "🌟");
        document.getElementById("success-area").classList.remove("hidden-el");
        App.triggerConfetti();
      });
    } else {
      var tip = this._errorTip(opt ? opt.tag : "vecino");
      var shown = opt ? this._fmt(eq.magB, opt.v) : "";
      handleWrongOption(btn, function () {
        App.updateTeacher("¡Casi! Revisa tu regla de 3", "Elegiste <b>" + shown + "</b>, pero no es el valor que falta." + tip, "🤔");
      });
    }
  },

  // --- Paso a paso ----------------------------------------------------------
  // Un ejemplo genérico del tipo actual (con números fijos y fáciles) y luego
  // el desglose con los números REALES del ejercicio, como en Estadística.
  showExample: function (container) {
    var eq = this.eq;
    var type = eq ? eq.type : "directa";
    var html = type === "inversa" ? this._exampleInversaHtml() : (type === "porcentaje" ? this._examplePorcentajeHtml() : this._exampleDirectaHtml());
    if (eq) html += this._liveStepsHtml();
    container.innerHTML = html;
  },

  _miniTable: function (a1, b1, a2, b2) {
    var c = function (t, cls) { return "<span class=\"inline-block border-2 rounded-lg px-2 py-0.5 font-bold " + cls + "\">" + t + "</span>"; };
    var k = "bg-white border-yellow-400 text-yellow-800", u = "bg-pink-100 border-pink-400 text-pink-600 border-dashed";
    return "<div class=\"my-2 math-font text-lg leading-8\">" +
      c(a1, k) + " ➜ " + c(b1, k) + "<br>" + c(a2, k) + " ➜ " + c(b2, b2 === "?" ? u : k) + "</div>";
  },

  _exampleDirectaHtml: function () {
    return "<div class=\"p-4 md:p-6 bg-indigo-50 rounded-xl border-2 border-indigo-200\">" +
      "<p class=\"font-bold text-indigo-800 mb-4 border-b-2 border-indigo-200 pb-2 text-xl\">Ejemplo: Regla de 3 directa</p>" +
      "<p class=\"mb-3 bg-white px-4 py-2 rounded shadow-sm border font-semibold\">3 cupcakes cuestan $6.000. ¿Cuánto cuestan 5 cupcakes?</p>" +
      "<ul class=\"list-decimal pl-6 space-y-3\">" +
      "<li><b>Las dos magnitudes:</b> cupcakes y dinero.</li>" +
      "<li><b>¿Directa o inversa?</b> Si compro MÁS cupcakes, pago MÁS dinero. Más → más: es <b>DIRECTA</b>.</li>" +
      "<li><b>La tabla:</b> cada fila junta los datos que van juntos. El ? va abajo a la derecha." + this._miniTable("3 cupcakes", "$6.000", "5 cupcakes", "?") + "</li>" +
      "<li><b>En cruz ✖️:</b> multiplica los dos números que quedan en diagonal frente al ?: <span class=\"bg-blue-100 text-blue-700 px-2 rounded\"><b>5 × 6.000 = 30.000</b></span>.</li>" +
      "<li><b>Divide entre el que sobra</b> (el que quedó solo en diagonal con el ?): <span class=\"bg-red-100 text-red-700 px-2 rounded\"><b>30.000 ÷ 3 = 10.000</b></span>.</li>" +
      "<li><b>Respuesta:</b> 5 cupcakes cuestan <b>$10.000</b>. ¿Tiene sentido? Más cupcakes, más dinero. ✔️</li>" +
      "<li><b>Atajo (reducción a la unidad):</b> primero averigua cuánto vale UNO: 6.000 ÷ 3 = 2.000 cada cupcake. Luego multiplica: 2.000 × 5 = 10.000. ¡Mismo resultado!</li>" +
      "</ul>" +
      "<p class=\"mt-4 pt-3 border-t border-indigo-200 text-slate-600\"><b>Otro ejemplo (receta):</b> con 2 tazas de harina salen 12 galletas; ¿con 5 tazas? En cruz: 5 × 12 = 60, y 60 ÷ 2 = <b>30 galletas</b>.</p>" +
      "</div>";
  },

  _exampleInversaHtml: function () {
    return "<div class=\"p-4 md:p-6 bg-indigo-50 rounded-xl border-2 border-indigo-200\">" +
      "<p class=\"font-bold text-indigo-800 mb-4 border-b-2 border-indigo-200 pb-2 text-xl\">Ejemplo: Regla de 3 inversa</p>" +
      "<p class=\"mb-3 bg-white px-4 py-2 rounded shadow-sm border font-semibold\">4 pintores pintan una casa en 6 días. ¿Cuántos días tardan 8 pintores?</p>" +
      "<ul class=\"list-decimal pl-6 space-y-3\">" +
      "<li><b>Las dos magnitudes:</b> pintores y días.</li>" +
      "<li><b>¿Directa o inversa?</b> Si hay MÁS pintores, se reparten el trabajo y tardan MENOS días. Más → menos: es <b>INVERSA</b>.</li>" +
      "<li><b>La tabla:</b> igual que siempre, el ? abajo a la derecha." + this._miniTable("4 pintores", "6 días", "8 pintores", "?") + "</li>" +
      "<li><b>En línea ➡️ (¡no en cruz!):</b> multiplica los dos números de la PRIMERA fila: <span class=\"bg-blue-100 text-blue-700 px-2 rounded\"><b>4 × 6 = 24</b></span>. Ese es el trabajo total (24 días de un solo pintor).</li>" +
      "<li><b>Divide entre el que sobra:</b> <span class=\"bg-red-100 text-red-700 px-2 rounded\"><b>24 ÷ 8 = 3</b></span>.</li>" +
      "<li><b>Respuesta:</b> 8 pintores tardan <b>3 días</b>. Comprobación: el doble de pintores, la mitad de días. ✔️</li>" +
      "<li><b>¿Por qué no en cruz?</b> Si multiplicaras en cruz saldría 8 × 6 ÷ 4 = 12 días: ¡más días con más pintores! Eso no tiene sentido, por eso la inversa se hace en línea.</li>" +
      "</ul>" +
      "<p class=\"mt-4 pt-3 border-t border-indigo-200 text-slate-600\"><b>Otro ejemplo (velocidad):</b> un bus a 60 km/h tarda 4 horas; ¿a 80 km/h? Más velocidad, menos tiempo. En línea: 60 × 4 = 240, y 240 ÷ 80 = <b>3 horas</b>.</p>" +
      "</div>";
  },

  _examplePorcentajeHtml: function () {
    return "<div class=\"p-4 md:p-6 bg-indigo-50 rounded-xl border-2 border-indigo-200\">" +
      "<p class=\"font-bold text-indigo-800 mb-4 border-b-2 border-indigo-200 pb-2 text-xl\">Ejemplo: Porcentajes con regla de 3</p>" +
      "<p class=\"mb-3 text-slate-700\">Un porcentaje es una parte <b>de cada 100</b>. Por eso el <b>total siempre es el 100%</b> y se resuelve como una regla de 3 <b>directa</b> (en cruz).</p>" +
      "<p class=\"font-bold text-indigo-700 mt-4\">1) ¿Cuánto es el 25% de $20.000? (un descuento)</p>" +
      this._miniTable("100%", "$20.000", "25%", "?") +
      "<p>En cruz: 25 × 20.000 = 500.000. Divide entre 100: 500.000 ÷ 100 = <b>$5.000</b> de descuento.</p>" +
      "<p class=\"font-bold text-indigo-700 mt-4\">2) Acertaste 18 de 20 preguntas. ¿Qué porcentaje?</p>" +
      this._miniTable("20 preguntas", "100%", "18 preguntas", "?") +
      "<p>En cruz: 18 × 100 = 1.800. Divide entre 20: 1.800 ÷ 20 = <b>90%</b>.</p>" +
      "<p class=\"font-bold text-indigo-700 mt-4\">3) 6 cupcakes son el 20% de la caja. ¿Cuántos hay en total?</p>" +
      this._miniTable("20%", "6 cupcakes", "100%", "?") +
      "<p>En cruz: 100 × 6 = 600. Divide entre 20: 600 ÷ 20 = <b>30 cupcakes</b>.</p>" +
      "<p class=\"mt-4 pt-3 border-t border-indigo-200 text-slate-600\"><b>Atajos:</b> 50% es la mitad (÷ 2), 25% es la cuarta parte (÷ 4), 10% es dividir entre 10 y 20% es dividir entre 5.</p>" +
      "</div>";
  },

  _liveStepsHtml: function () {
    var eq = this.eq, m = this._miles.bind(this);
    var A = this._name(eq.magA), B = this._name(eq.magB);
    var li = function (t) { return "<li>" + t + "</li>"; };
    var steps = li("<b>El problema:</b> " + this._storyText());
    if (eq.type === "porcentaje") {
      steps += li("<b>El total es el 100%:</b> " + (eq.sub === "total"
        ? "aquí el total es justo lo que buscamos, así que el 100% va en la fila del ?."
        : "el total es " + this._fmt(eq.unitMag, eq.total) + " y frente a él escribimos 100%."));
    } else {
      steps += li("<b>Las dos magnitudes:</b> " + A + " y " + B + ".");
      steps += eq.type === "directa"
        ? li("<b>¿Directa o inversa?</b> Si hay más " + A + ", hay <b>más</b> " + B + ". Es <b>DIRECTA</b>: se multiplica en cruz.")
        : li("<b>¿Directa o inversa?</b> Si hay más " + A + ", hay <b>menos</b> " + B + ". Es <b>INVERSA</b>: se multiplica en línea.");
    }
    steps += li("<b>La tabla:</b><div class=\"mt-2\">" + this._tableHtml({ small: true }) + "</div>");
    if (eq.type === "inversa") {
      steps += li("<b>Multiplica en línea ➡️</b> (los dos de la primera fila): " + m(eq.a1) + " × " + m(eq.b1) + " = <b>" + m(eq.prod) + "</b>.");
      steps += li("<b>Divide entre el que sobra:</b> " + m(eq.prod) + " ÷ " + m(eq.a2) + " = <b>" + m(eq.res) + "</b>.");
    } else {
      steps += li("<b>Multiplica en cruz ✖️</b> (los dos que quedan en diagonal frente al ?): " + m(eq.a2) + " × " + m(eq.b1) + " = <b>" + m(eq.a2 * eq.b1) + "</b>.");
      steps += li("<b>Divide entre el que sobra:</b> " + m(eq.a2 * eq.b1) + " ÷ " + m(eq.a1) + " = <b>" + m(eq.res) + "</b>.");
    }
    var sense = eq.type === "porcentaje" ? "" : " ¿Tiene sentido? Más " + A + " → " + (eq.type === "directa" ? "más" : "menos") + " " + B + ". ✔️";
    steps += li("<b>Respuesta:</b> <span class=\"bg-green-100 text-green-800 px-2 rounded font-bold\">" + this._fmt(eq.magB, eq.res) + "</span>." + sense);
    if (eq.type === "directa" && !eq.ctx.flip && eq.b1 % eq.a1 === 0) {
      var k = eq.b1 / eq.a1;
      steps += li("<b>Atajo (reducción a la unidad):</b> 1 " + eq.magA.sing + " → " + this._fmt(eq.magB, k) + " (porque " + m(eq.b1) + " ÷ " + m(eq.a1) + " = " + m(k) + "). Entonces " + m(eq.a2) + " × " + m(k) + " = " + m(eq.res) + ". ¡Mismo resultado!");
    }
    if (eq.type === "porcentaje" && eq.sub === "parte") {
      var atajo = { 50: "el 50% es la mitad: " + m(eq.total) + " ÷ 2", 25: "el 25% es la cuarta parte: " + m(eq.total) + " ÷ 4", 10: "el 10% es dividir entre 10: " + m(eq.total) + " ÷ 10", 20: "el 20% es dividir entre 5: " + m(eq.total) + " ÷ 5" }[eq.pct];
      if (atajo) steps += li("<b>Atajo:</b> " + atajo + " = " + m(eq.res) + ".");
    }
    return "<div class=\"p-4 md:p-6 bg-pink-50 rounded-xl border-2 border-pink-200 mt-4\">" +
      "<p class=\"font-bold text-pink-800 mb-4 border-b-2 border-pink-200 pb-2 text-xl\">👉 Paso a paso con TU ejercicio actual</p>" +
      "<ol class=\"list-decimal pl-6 space-y-3\">" + steps + "</ol></div>";
  },

  cleanup: function () {}
};

/**
 * Juego: Oraciones simples y compuestas (Español 5º Grado) — "Produzco textos
 * orales y escritos". Basado en el taller del colegio: leer un texto (Tío Conejo),
 * clasificar cada oración como simple (1 verbo) o compuesta (2 o más verbos unidos
 * por un nexo), encerrar los verbos y completar oraciones para volverlas compuestas.
 *
 * El tipo "ordenar" (ordenar oraciones de un texto) queda implementado pero fuera
 * de la rotación — no corresponde a lo que evalúa el taller actual.
 */
var TextGame = {
  eq: null,

  // Oraciones del taller (Tío Conejo y ejercicio 2) más otras del mismo estilo.
  SENTENCES: [
    { text: "Tío Conejo tenía hambre.", type: "simple", verbs: ["tenía"], level: "facil" },
    { text: "El hortelano encontró su sembrado destruido.", type: "simple", verbs: ["encontró"], level: "facil" },
    { text: "Martín enviará un mensaje a su amigo.", type: "simple", verbs: ["enviará"], level: "facil" },
    { text: "Sofía vende paletas en el parque.", type: "simple", verbs: ["vende"], level: "facil" },
    { text: "El gato duerme en el sofá.", type: "simple", verbs: ["duerme"], level: "facil" },
    { text: "Los niños juegan en el patio.", type: "simple", verbs: ["juegan"], level: "facil" },
    { text: "Camila leyó un cuento.", type: "simple", verbs: ["leyó"], level: "facil" },
    { text: "El profesor llega temprano y saluda a los niños.", type: "compuesta", verbs: ["llega", "saluda"], nexo: "y", level: "facil" },
    { text: "El conejo se dirigió hacia allí y devoró casi todo el sembrado.", type: "compuesta", verbs: ["se dirigió", "devoró"], nexo: "y", level: "facil" },
    { text: "Sofía prepara las paletas y su papá la ayuda con la venta.", type: "compuesta", verbs: ["prepara", "ayuda"], nexo: "y", level: "facil" },
    { text: "Camila leyó un cuento y luego escribió un resumen.", type: "compuesta", verbs: ["leyó", "escribió"], nexo: "y", level: "facil" },
    { text: "La brujita subió a su escoba y voló sobre el pueblo.", type: "compuesta", verbs: ["subió", "voló"], nexo: "y", level: "facil" },

    { text: "El zorro corrió por el bosque.", type: "simple", verbs: ["corrió"], level: "medio" },
    { text: "Las paletas de fresa se vendieron rápido.", type: "simple", verbs: ["se vendieron"], level: "medio" },
    { text: "La lluvia cayó fuerte durante toda la tarde.", type: "simple", verbs: ["cayó"], level: "medio" },
    { text: "Los niños del colegio jugaron fútbol en el parque durante toda la tarde.", type: "simple", verbs: ["jugaron"], level: "medio" },
    { text: "La abuela de Sofía prepara un delicioso arroz con pollo los domingos.", type: "simple", verbs: ["prepara"], level: "medio" },
    { text: "Mi hermana mayor colecciona estampillas de muchos países del mundo.", type: "simple", verbs: ["colecciona"], level: "medio" },
    { text: "Sofía llegó a casa, saludó a su mamá y guardó la maleta.", type: "compuesta", verbs: ["llegó", "saludó", "guardó"], nexo: "y", level: "medio" },
    { text: "El campesino se enojó y lanzó toda clase de amenazas contra Tío Conejo.", type: "compuesta", verbs: ["se enojó", "lanzó"], nexo: "y", level: "medio" },
    { text: "Se lamentó profundamente y decidió cercarlo.", type: "compuesta", verbs: ["se lamentó", "decidió"], nexo: "y", level: "medio" },
    { text: "El perro ladró porque escuchó un ruido en la calle.", type: "compuesta", verbs: ["ladró", "escuchó"], nexo: "porque", level: "medio" },
    { text: "Mi abuela cocina mientras yo pongo la mesa.", type: "compuesta", verbs: ["cocina", "pongo"], nexo: "mientras", level: "medio" },
    { text: "Quería ir al parque, pero empezó a llover.", type: "compuesta", verbs: ["quería", "empezó"], nexo: "pero", level: "medio" },
    { text: "El abuelo entraba mientras yo salía.", type: "compuesta", verbs: ["entraba", "salía"], nexo: "mientras", level: "medio" },
    { text: "Mi hermano estudia porque tiene examen mañana.", type: "compuesta", verbs: ["estudia", "tiene"], nexo: "porque", level: "medio" },

    { text: "El animalito sacó su cabeza de su madriguera y miró nerviosamente para todos los lados.", type: "compuesta", verbs: ["sacó", "miró"], nexo: "y", level: "dificil" },
    { text: "Sus ojillos traviesos brillaron cuando vieron un hermoso huerto de zanahorias.", type: "compuesta", verbs: ["brillaron", "vieron"], nexo: "cuando", level: "dificil" },
    { text: "Tío Conejo miró la cerca detenidamente, sonrió y no hizo caso alguno.", type: "compuesta", verbs: ["miró", "sonrió", "hizo"], nexo: "y", level: "dificil" },
    { text: "Luego, cavó un túnel debajo de la cerca por donde entró a devorar las hortalizas.", type: "compuesta", verbs: ["cavó", "entró"], nexo: "por donde", level: "dificil" },
    { text: "Sembró nuevamente y pensó en una nueva trampa más eficaz para atrapar al pícaro roedor.", type: "compuesta", verbs: ["sembró", "pensó"], nexo: "y", level: "dificil" },
    { text: "La princesa lucía el prendedor que le regaló el hada.", type: "compuesta", verbs: ["lucía", "regaló"], nexo: "que", level: "dificil" },
    { text: "Juanito quedó muy contento con el juguete que le regalaron.", type: "compuesta", verbs: ["quedó", "regalaron"], nexo: "que", level: "dificil" },
    { text: "Mamá arregló el carro, pues ella lo llevó al mecánico.", type: "compuesta", verbs: ["arregló", "llevó"], nexo: "pues", level: "dificil" },
    { text: "Aunque estaba cansada, Sofía terminó su tarea.", type: "compuesta", verbs: ["estaba", "terminó"], nexo: "aunque", level: "dificil" },
    { text: "El zorro corrió por el bosque hasta que encontró su madriguera.", type: "compuesta", verbs: ["corrió", "encontró"], nexo: "hasta que", level: "dificil" },
    { text: "El hortelano sembró zanahorias en su huerto.", type: "simple", verbs: ["sembró"], level: "dificil" },
    { text: "El pícaro roedor devoró las hortalizas del campesino.", type: "simple", verbs: ["devoró"], level: "dificil" },
    { text: "En las noches de diciembre, toda la familia se reúne alrededor del pesebre.", type: "simple", verbs: ["se reúne"], level: "dificil" },
    { text: "Los duendes trabajaron en silencio durante toda la noche en el taller del zapatero.", type: "simple", verbs: ["trabajaron"], level: "dificil" },
    { text: "Después de la tormenta, los vecinos del barrio limpiaron las calles llenas de hojas.", type: "simple", verbs: ["limpiaron"], level: "dificil" },
    { text: "El río Magdalena atraviesa gran parte del territorio colombiano de sur a norte.", type: "simple", verbs: ["atraviesa"], level: "dificil" },
    { text: "El zapatero cortó el cuero, se acostó temprano y durmió tranquilo.", type: "compuesta", verbs: ["cortó", "se acostó", "durmió"], nexo: "y", level: "dificil" }
  ],

  // Verbos en infinitivo (terminan en -ar, -er, -ir) que acompañan a otro verbo
  // y NO se cuentan como una acción aparte: "decidió cercarlo" es una sola acción.
  // Se muestran en la explicación para que no parezca que se "olvidaron".
  INFINITIVE_NOTES: {
    "Se lamentó profundamente y decidió cercarlo.": "cercarlo",
    "Quería ir al parque, pero empezó a llover.": "ir, llover",
    "Luego, cavó un túnel debajo de la cerca por donde entró a devorar las hortalizas.": "devorar",
    "Sembró nuevamente y pensó en una nueva trampa más eficaz para atrapar al pícaro roedor.": "atrapar"
  },

  // Tipo "convertir": la opción correcta agrega OTRO verbo (vuelve la oración compuesta);
  // las falsas no tienen verbo, así que la oración seguiría siendo simple.
  CONVERT: [
    { inicio: "La pequeña brujita subió a su escoba y", correct: "voló sobre el pueblo.", verb: "voló", wrong: ["muy rápido.", "con su gato negro."] },
    { inicio: "El abuelo entraba mientras yo", correct: "salía al patio.", verb: "salía", wrong: ["en la sala.", "con mi mochila."] },
    { inicio: "Juanito quedó muy contento con el juguete", correct: "que le regaló su tía.", verb: "regaló", wrong: ["de color azul.", "más grande de todos."] },
    { inicio: "Sofía vende paletas y", correct: "sus amigas la ayudan.", verb: "ayudan", wrong: ["mazapanes también.", "de muchos sabores."] },
    { inicio: "El gato se escondió porque", correct: "escuchó un ruido fuerte.", verb: "escuchó", wrong: ["debajo de la cama.", "muy asustado."] },
    { inicio: "Tío Conejo cavó un túnel y", correct: "entró al huerto.", verb: "entró", wrong: ["muy profundo.", "debajo de la cerca."] },
    { inicio: "Los niños corrieron al parque cuando", correct: "paró la lluvia.", verb: "paró", wrong: ["por la tarde.", "con sus balones."] },
    { inicio: "El campesino se enojó y", correct: "puso una trampa.", verb: "puso", wrong: ["muchísimo.", "con el conejo."] }
  ],

  // Sin "ordenar": no corresponde al taller actual (ver comentario de arriba).
  TYPES_BY_LEVEL: {
    facil: ["clasificar", "clasificar", "verbos"],
    medio: ["clasificar", "verbos", "convertir"],
    dificil: ["clasificar", "verbos", "convertir"]
  },

  // Banco del tipo "ordenar" (pausado): oraciones en orden correcto.
  ORDER_BANK: [
    { sentences: ["Primero, corta las frutas en pedacitos pequeños.", "Después, mezcla la fruta con jugo y ponla en los moldes.", "Finalmente, congela las paletas por varias horas antes de comerlas."] },
    { sentences: ["El perrito tenía mucha hambre esa mañana.", "Corrió hacia su plato de comida en la cocina.", "Después de comer, se quedó dormido en su cama favorita."] },
    { sentences: ["Sofía quería aprender a hacer mazapanes para vender.", "Buscó una receta fácil en internet con ayuda de su papá.", "Compró los ingredientes: leche condensada, azúcar y colorante.", "Siguió cada paso con cuidado hasta que quedaron perfectos."] },
    { sentences: ["Sofía tenía la idea de vender paletas en su barrio.", "Sus amigas se ofrecieron a ayudarla con la venta.", "Diseñaron carteles coloridos para anunciar el negocio.", "El primer día vendieron más de lo que esperaban.", "Decidieron ahorrar el dinero para comprar más ingredientes."] }
  ],

  _lastText: null,
  level: "facil",

  start: function (level) {
    this.level = level;
    this.generateValues(level);
    var eq = this.eq;
    if (eq.kind === "clasificar") {
      App.updateTeacher("Paso 1: ¿Simple o compuesta?", "Busca los <b>verbos conjugados</b> (las acciones con su tiempo: corre, tenía, saludó). Si hay <b>un solo verbo</b> es <b>simple</b>; si hay <b>dos o más</b> (unidos por y, pero, porque, mientras, que...) es <b>compuesta</b>.", "✍️");
    } else if (eq.kind === "verbos") {
      App.updateTeacher("Paso 1: Cuenta los verbos", "El verbo es la palabra que dice <b>qué hace</b> alguien o algo (corre, tenía, saluda...). Cuenta los <b>conjugados</b>; los que terminan en -ar, -er, -ir y acompañan a otro (\"decidió <i>cercar</i>\") no se cuentan aparte.", "🔎");
    } else if (eq.kind === "convertir") {
      App.updateTeacher("Paso 1: Vuélvela compuesta", "Una oración se vuelve <b>compuesta</b> cuando le agregas <b>otro verbo</b> (otra acción). Elige el final que tenga un verbo.", "🧩");
    } else {
      App.updateTeacher("Paso 1: Ordena las oraciones", "Haz clic en las oraciones en el orden correcto para armar un texto con sentido.", "📝");
    }
    this.renderRow();
  },

  _shuffle: function (a) {
    var arr = a.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  },

  // Elige un ítem del pool evitando repetir el anterior.
  _pickNoRepeat: function (pool, keyFn) {
    var self = this;
    var candidates = pool.filter(function (x) { return keyFn(x) !== self._lastText; });
    if (!candidates.length) candidates = pool;
    var chosen = candidates[Math.floor(Math.random() * candidates.length)];
    this._lastText = keyFn(chosen);
    return chosen;
  },

  generateValues: function (level) {
    var types = this.TYPES_BY_LEVEL[level] || this.TYPES_BY_LEVEL.facil;
    var kind = types[Math.floor(Math.random() * types.length)];
    var shuffle = this._shuffle;

    if (kind === "convertir") {
      var c = this._pickNoRepeat(this.CONVERT, function (x) { return x.inicio; });
      this.eq = { kind: "convertir", item: c, options: shuffle([c.correct].concat(c.wrong)), correct: c.correct };
      return;
    }
    if (kind === "ordenar") {
      var o = this.ORDER_BANK[Math.floor(Math.random() * this.ORDER_BANK.length)];
      var indices = o.sentences.map(function (_, i) { return i; });
      var shuffled;
      do { shuffled = shuffle(indices.slice()); } while (shuffled.join(",") === indices.join(","));
      this.eq = { kind: "ordenar", sentences: o.sentences, shuffledIndices: shuffled, userOrder: [] };
      return;
    }
    var pool = this.SENTENCES.filter(function (s) { return s.level === level; });
    if (!pool.length) pool = this.SENTENCES;
    var s = this._pickNoRepeat(pool, function (x) { return x.text; });
    if (kind === "verbos") {
      this.eq = { kind: "verbos", item: s, correct: s.verbs.length };
    } else {
      this.eq = { kind: "clasificar", item: s, correct: s.type };
    }
  },

  _whyHtml: function (s) {
    var n = s.verbs.length;
    var bold = s.verbs.map(function (v) { return "<b>" + v + "</b>"; });
    var list = n <= 2 ? bold.join(" y ") : bold.slice(0, -1).join(", ") + " y " + bold[n - 1];
    var inf = this.INFINITIVE_NOTES[s.text];
    var infNote = inf ? " (<i>" + inf + "</i> está en infinitivo y acompaña a otro verbo, por eso no se cuenta aparte)" : "";
    if (s.type === "simple") return "tiene <b>un solo verbo</b> (" + list + "), es decir, una sola acción" + infNote + ".";
    return "tiene <b>" + n + " verbos</b> (" + list + ")" + (s.nexo ? " unidos por el nexo <b>\"" + s.nexo + "\"</b>" : "") + infNote + ".";
  },

  showExample: function (container) {
    container.innerHTML =
      "<div class=\"p-4 md:p-6 bg-violet-50 rounded-xl border-2 border-violet-200\">" +
      "<p class=\"font-bold text-violet-800 mb-4 border-b-2 border-violet-200 pb-2 text-xl\">Ejemplo: Oraciones simples y compuestas</p>" +
      "<ul class=\"list-decimal pl-6 space-y-3\">" +
      "<li><b>El verbo</b> es la palabra que dice qué hace alguien o algo: <i>tenía, miró, saluda, corre</i>. Para clasificar una oración, lo primero es <b>encerrar los verbos</b>.</li>" +
      "<li><b>Oración simple = 1 verbo.</b> <span class=\"bg-white border px-2 rounded\">\"Tío Conejo <b>tenía</b> hambre.\"</span> → un solo verbo (<i>tenía</i>) → <b>simple</b>.</li>" +
      "<li><b>Oración compuesta = 2 o más verbos.</b> <span class=\"bg-white border px-2 rounded\">\"El profesor <b>llega</b> temprano y <b>saluda</b> a los niños.\"</span> → dos verbos (<i>llega, saluda</i>) unidos por <b>\"y\"</b> → <b>compuesta</b>.</li>" +
      "<li><b>Los nexos</b> son las palabras que unen las partes de una compuesta: <b>y, pero, porque, mientras, que, pues, cuando, aunque, hasta que, por donde</b>. Si ves uno de estos, sospecha que hay otro verbo cerca.</li>" +
      "<li><b>Para convertir una simple en compuesta</b>, agrégale otra acción: \"La brujita subió a su escoba\" (simple) → \"La brujita subió a su escoba <b>y voló</b> sobre el pueblo\" (compuesta).</li>" +
      "<li><b>¡Ojo!</b> Una oración larga NO es compuesta por ser larga: \"La lluvia cayó fuerte durante toda la tarde\" es larga pero tiene un solo verbo (<i>cayó</i>) → simple.</li>" +
      "<li><b>¡Ojo 2!</b> Solo se cuentan los verbos <b>conjugados</b> (con su tiempo: <i>decidió, empezó</i>). Los infinitivos (terminan en -ar, -er, -ir) que acompañan a otro verbo no se cuentan aparte: \"decidió <i>cercarlo</i>\" y \"empezó a <i>llover</i>\" son una sola acción cada una.</li>" +
      "</ul></div>" +
      "<div class=\"p-4 md:p-6 bg-pink-50 rounded-xl border-2 border-pink-200 mt-4\">" +
      "<p class=\"font-bold text-pink-800 mb-3 border-b-2 border-pink-200 pb-2 text-xl\">🗣️ Para sustentar (explicarlo con tus palabras)</p>" +
      "<ol class=\"list-decimal pl-6 space-y-2\">" +
      "<li>Lee la oración y <b>señala los verbos</b>: \"Los verbos son <i>llega</i> y <i>saluda</i>\".</li>" +
      "<li>Di cuántos hay: \"Tiene <b>dos verbos</b>\".</li>" +
      "<li>Concluye con la regla: \"Por eso es <b>compuesta</b>, porque tiene más de un verbo, unidos por el nexo <i>y</i>\". (O: \"Tiene un solo verbo, por eso es <b>simple</b>\").</li>" +
      "</ol></div>";
  },

  renderRow: function () {
    var container = document.getElementById("lines-container");
    var eq = this.eq;
    var self = this;

    if (eq.kind === "ordenar") { this._renderOrder(container); return; }

    var row = document.createElement("div");
    row.className = "flex flex-col items-center w-full animate-fade-in mb-4";

    var card = function (label, text) {
      return "<div class=\"bg-white border-4 border-violet-200 p-6 rounded-3xl w-full max-w-xl shadow-sm text-center mb-4\">" +
        "<p class=\"text-violet-500 font-bold uppercase tracking-wide text-xs md:text-sm mb-2\">" + label + "</p>" +
        "<p class=\"text-xl md:text-2xl font-black text-slate-800 font-sans\">" + text + "</p></div>";
    };

    var options, question, format;
    if (eq.kind === "clasificar") {
      row.innerHTML = card("Oración", "\"" + eq.item.text + "\"");
      question = "¿Es simple o compuesta?";
      var isFacil = this.level === "facil";
      options = [
        { value: "simple", label: isFacil ? "Simple (1 verbo)" : "Simple" },
        { value: "compuesta", label: isFacil ? "Compuesta (2 o más verbos)" : "Compuesta" }
      ];
    } else if (eq.kind === "verbos") {
      row.innerHTML = card("Oración", "\"" + eq.item.text + "\"");
      question = "¿Cuántos verbos tiene?";
      options = [1, 2, 3].map(function (n) { return { value: n, label: n + (n === 1 ? " verbo" : " verbos") }; });
    } else {
      row.innerHTML = card("Completa la oración", "\"" + eq.item.inicio + " <span class=\"text-pink-500\">______</span>\"");
      question = "¿Cuál final la convierte en COMPUESTA (agrega otro verbo)?";
      options = eq.options.map(function (o) { return { value: o, label: "... " + o }; });
    }
    row.innerHTML += "<p class=\"text-slate-500 font-sans text-sm md:text-base mb-2 text-center\">" + question + "</p>";
    container.appendChild(row);

    var optsWrap = document.createElement("div");
    optsWrap.className = "flex flex-col w-full max-w-xl mx-auto gap-3 animate-fade-in";
    optsWrap.id = "options-container";
    options.forEach(function (o) {
      var btn = document.createElement("button");
      btn.className = "font-sans text-left w-full bg-white border-4 border-violet-200 hover:border-violet-400 hover:bg-violet-50 text-violet-700 font-bold text-base md:text-lg py-3 px-5 rounded-2xl shadow-[0_4px_0_#ddd6fe] active:translate-y-1 active:shadow-none transition-all";
      btn.textContent = o.label;
      btn.onclick = function () { self.verify(o.value, btn); };
      optsWrap.appendChild(btn);
    });
    container.appendChild(optsWrap);
  },

  verify: function (val, btn) {
    var eq = this.eq;
    var self = this;

    if (val === eq.correct) {
      btn.classList.replace("border-violet-200", "border-green-500");
      btn.classList.replace("text-violet-700", "text-white");
      btn.classList.add("bg-green-500");
      var opts = document.getElementById("options-container");
      if (opts) opts.classList.add("pointer-events-none", "opacity-50");

      setTimeout(function () {
        if (opts && document.getElementById("options-container") !== opts) return;
        var msg;
        if (eq.kind === "clasificar") {
          msg = "¡Correcto! Es <b>" + eq.item.type.toUpperCase() + "</b> porque " + self._whyHtml(eq.item);
        } else if (eq.kind === "verbos") {
          msg = "¡Correcto! " + self._whyHtml(eq.item).charAt(0).toUpperCase() + self._whyHtml(eq.item).slice(1) + " Por eso es una oración <b>" + eq.item.type + "</b>.";
        } else {
          msg = "¡Correcto! \"" + eq.item.correct + "\" tiene el verbo <b>" + eq.item.verb + "</b>, así que la oración queda con <b>dos verbos</b>: ahora es <b>compuesta</b>.";
        }
        App.updateTeacher("¡Muy bien! 🎉", msg, "🌟");
        document.getElementById("success-area").classList.remove("hidden-el");
        App.triggerConfetti();
        if (typeof awardExercisePoints === "function") awardExercisePoints();
      }, 400);
    } else {
      var isSofia = typeof App !== "undefined" && App.user && App.user.id === "zorro";
      var fBorder = isSofia ? "border-amber-400" : "border-red-400";
      var fBg = isSofia ? "bg-amber-50" : "bg-red-50";
      var fText = isSofia ? "text-amber-700" : "text-red-600";
      btn.classList.replace("border-violet-200", fBorder);
      btn.classList.add(fBg, fText, "animate-shake");

      var tip;
      if (eq.kind === "convertir") {
        tip = "Fíjate cuál de los finales tiene una <b>acción</b> (un verbo). Los otros solo agregan detalles (cómo, dónde, con qué), pero no otra acción.";
      } else {
        tip = "Busca las palabras que dicen <b>qué hace</b> alguien (las acciones conjugadas) y cuéntalas. Si encuentras un nexo como <b>y, porque, mientras, que</b>, casi seguro hay otro verbo cerca. Los infinitivos (-ar, -er, -ir) que acompañan a otro verbo no se cuentan aparte.";
      }
      App.updateTeacher("¡Casi! Revisa los verbos", "No es correcto. 💡 <b>Pista:</b> " + tip, "🤔");
      if (typeof registerWrongAttempt === "function") registerWrongAttempt();

      setTimeout(function () {
        btn.classList.remove(fBg, fText, "animate-shake");
        btn.classList.replace(fBorder, "border-violet-200");
      }, 900);
    }
  },

  // ---------- Tipo "ordenar" (pausado) ----------
  _renderOrder: function (container) {
    var eq = this.eq;
    var self = this;
    var wrap = document.createElement("div");
    wrap.className = "flex flex-col items-center w-full animate-fade-in mb-4";
    var cardsHtml = "<div id=\"text-cards\" class=\"flex flex-col gap-3 w-full max-w-xl\">";
    eq.shuffledIndices.forEach(function (origIdx) {
      cardsHtml +=
        "<button type=\"button\" class=\"text-order-card font-sans text-left bg-white border-4 border-violet-200 hover:border-violet-400 rounded-2xl px-4 py-3 text-base md:text-lg text-slate-700 shadow-sm transition-all\" data-idx=\"" + origIdx + "\">" +
        "<span class=\"text-order-badge inline-flex items-center justify-center w-7 h-7 rounded-full bg-violet-500 text-white font-black text-sm mr-2 hidden-el\"></span>" +
        eq.sentences[origIdx] + "</button>";
    });
    cardsHtml += "</div>";
    wrap.innerHTML =
      "<p class=\"text-slate-500 font-sans text-sm md:text-base mb-3 text-center\">Haz clic en las oraciones en el orden correcto (1º, 2º, 3º...):</p>" +
      cardsHtml +
      "<button type=\"button\" id=\"text-reset-btn\" class=\"mt-4 text-sm font-bold text-violet-500 hover:text-violet-700 underline\">↺ Reiniciar orden</button>";
    container.appendChild(wrap);
    container.querySelectorAll(".text-order-card").forEach(function (card) {
      card.addEventListener("click", function () { self._selectCard(card); });
    });
    var resetBtn = document.getElementById("text-reset-btn");
    if (resetBtn) resetBtn.addEventListener("click", function () { self._resetOrder(); });
  },

  _selectCard: function (card) {
    var eq = this.eq;
    var idx = parseInt(card.getAttribute("data-idx"), 10);
    if (eq.userOrder.indexOf(idx) !== -1) return;
    eq.userOrder.push(idx);
    var badge = card.querySelector(".text-order-badge");
    badge.textContent = eq.userOrder.length;
    badge.classList.remove("hidden-el");
    card.classList.add("bg-violet-50", "border-violet-400", "pointer-events-none");
    if (eq.userOrder.length === eq.sentences.length) this._verifyOrder();
  },

  _resetOrder: function () {
    this.eq.userOrder = [];
    var cardsWrap = document.getElementById("text-cards");
    if (!cardsWrap) return;
    cardsWrap.querySelectorAll(".text-order-card").forEach(function (card) {
      card.classList.remove("bg-violet-50", "border-violet-400", "pointer-events-none");
      var badge = card.querySelector(".text-order-badge");
      badge.classList.add("hidden-el");
      badge.textContent = "";
    });
  },

  _verifyOrder: function () {
    var self = this;
    var isCorrect = this.eq.userOrder.every(function (v, i) { return v === i; });
    var cardsWrap = document.getElementById("text-cards");
    if (isCorrect) {
      if (cardsWrap) cardsWrap.classList.add("pointer-events-none", "opacity-80");
      setTimeout(function () {
        App.updateTeacher("¡Texto Ordenado! 🎉", "¡Excelente! Organizaste las ideas en el orden correcto.", "🌟");
        document.getElementById("success-area").classList.remove("hidden-el");
        App.triggerConfetti();
        if (typeof awardExercisePoints === "function") awardExercisePoints();
      }, 400);
    } else {
      if (cardsWrap) cardsWrap.classList.add("animate-shake");
      App.updateTeacher("¡Casi! Ese orden no tiene sentido todavía", "Repasa las pistas de orden (primero, después, finalmente) o piensa qué tendría que pasar antes. 💡", "🤔");
      setTimeout(function () {
        if (cardsWrap) cardsWrap.classList.remove("animate-shake");
        self._resetOrder();
      }, 1200);
    }
  },

  cleanup: function () {}
};

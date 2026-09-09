/**
 * Juego: El Guion Teatral (Español 5º Grado) — "Relaciono hipótesis de textos literarios".
 * Basado en el taller del colegio (Los duendes y el zapatero): reconocer las partes de
 * un libreto (título, escena, narrador, diálogo, acotación), entender para qué sirve
 * cada una y convertir un cuento narrado en diálogos de teatro.
 */
var GuionGame = {
  eq: null,

  ELEMENTS: [
    { id: "Diálogo", why: "son las palabras que dice el personaje en voz alta, escritas después de su nombre y dos puntos." },
    { id: "Acotación", why: "va entre paréntesis (o describe el escenario) y dice cómo actúa el personaje o cómo es el lugar; los actores la hacen, no la dicen." },
    { id: "Narrador", why: "cuenta lo que pasa en la historia sin ser uno de los personajes de la escena." },
    { id: "Título", why: "es el nombre de la obra y va al principio de todo." },
    { id: "Escena", why: "marca cada parte en que se divide la obra; cambia cuando cambia el lugar o el momento." }
  ],

  FRAGMENTS: [
    { text: "(Sonriendo.)", answer: "Acotación", level: "facil" },
    { text: "Zapatero: Claro, podría cortar el cuero con menos cuidado.", answer: "Diálogo", level: "facil" },
    { text: "Narrador: La mujer del zapatero pidió inquieta a su marido que trabajara más rápido.", answer: "Narrador", level: "facil" },
    { text: "Los duendes y el zapatero", answer: "Título", level: "facil" },
    { text: "Mujer: Viejo, ¿no puedes trabajar más rápido?", answer: "Diálogo", level: "facil" },
    { text: "Escena No. 2", answer: "Escena", level: "facil" },
    { text: "(Se acerca a su esposo y le acaricia la espalda.)", answer: "Acotación", level: "medio" },
    { text: "Se observa una escena de la sala de una casa; al fondo, la chimenea prendida y, en primer plano, una mesa de trabajo de zapatero.", answer: "Acotación", level: "medio" },
    { text: "Caperucita: ¡Abuelita, qué ojos tan grandes tienes!", answer: "Diálogo", level: "medio" },
    { text: "Narrador: Caperucita caminaba tranquila por el bosque cuando el lobo la vio.", answer: "Narrador", level: "medio" },
    { text: "Escena No. 3", answer: "Escena", level: "medio" },
    { text: "Los tres cerditos", answer: "Título", level: "medio" },
    { text: "(Con voz temblorosa.)", answer: "Acotación", level: "dificil" },
    { text: "Un bosque oscuro. Se escuchan pájaros a lo lejos.", answer: "Acotación", level: "dificil" },
    { text: "Cerdito menor: ¡Corran, el lobo ya viene!", answer: "Diálogo", level: "dificil" },
    { text: "Narrador: Esa noche, mientras el zapatero dormía, dos duendes entraron al taller.", answer: "Narrador", level: "dificil" },
    { text: "Zapatero: Bueno, vamos, deja ya, que el Señor proveerá.", answer: "Diálogo", level: "dificil" },
    { text: "(El lobo sopla con todas sus fuerzas.)", answer: "Acotación", level: "dificil" }
  ],

  // Los distractores tienen un largo parecido al de la respuesta correcta, para
  // que no se pueda acertar eligiendo "la opción más larga".
  CONCEPTS: [
    { q: "¿Qué es una acotación?", correct: "Una indicación (casi siempre entre paréntesis) que dice cómo actúan los personajes o cómo es el escenario; no se dice en voz alta.",
      wrong: ["Las palabras que un personaje dice en voz alta frente al público, escritas después de su nombre y dos puntos.", "El nombre de la obra de teatro, que va al principio de todo y resume de qué trata la historia.", "La persona que cuenta las partes de la historia que no se ven en escena, sin ser uno de los personajes.", "Cada una de las partes en que se divide la obra, que cambia cuando cambia el lugar o el momento."], level: "facil" },
    { q: "¿Qué es un diálogo en un guion teatral?", correct: "Las palabras que dice cada personaje, escritas después de su nombre y dos puntos.",
      wrong: ["Las instrucciones entre paréntesis que dicen a los actores cómo moverse o actuar.", "La descripción del lugar y del momento donde pasa la historia, antes de los diálogos.", "El resumen de toda la obra que el narrador lee al final de la última escena.", "La lista de personajes con sus características, que va al principio del libreto."], level: "facil" },
    { q: "¿Qué hace el narrador en un libreto?", correct: "Cuenta partes de la historia que no se ven en escena, sin ser uno de los personajes.",
      wrong: ["Actúa como el personaje principal y dice todos los diálogos más importantes de la obra.", "Dibuja y arma el escenario donde los actores van a representar cada una de las escenas.", "Escribe las acotaciones entre paréntesis para indicarles a los actores cómo actuar.", "Se encarga de aplaudir y de dar las gracias al público al final de cada escena."], level: "facil" },
    { q: "¿Qué es un guion o libreto teatral?", correct: "Un texto escrito para ser representado por actores, con diálogos y acotaciones.",
      wrong: ["Un cuento largo, escrito para leerlo en silencio, sin diálogos ni instrucciones para actores.", "Un poema con versos que riman, escrito para recitarlo de memoria frente a la clase.", "Una lista de pasos e instrucciones, como una receta, para preparar algo en la cocina.", "Un resumen corto de una película, con los personajes y lo que pasa al final."], level: "facil" },
    { q: "¿Qué es una escena?", correct: "Cada una de las partes en que se divide la obra; suele cambiar cuando cambia el lugar o el momento.",
      wrong: ["El nombre del actor principal, que se escribe en mayúsculas al inicio de cada página del libreto.", "Lo que dice el narrador al inicio de la obra para presentar a los personajes y el lugar.", "El aplauso del público al final de la obra, cuando todos los actores salen a saludar.", "Un tipo de acotación que va entre paréntesis y explica cómo debe moverse cada actor."], level: "medio" },
    { q: "¿Cómo se escribe el nombre del personaje que habla?", correct: "Al inicio de la línea, seguido de dos puntos: \"Zapatero: ...\".",
      wrong: ["Al final de la línea y entre paréntesis: \"... (Zapatero)\".", "No se escribe en ninguna parte; el actor adivina cuándo le toca hablar.", "En mayúsculas y solo al final de la obra, en la lista de personajes.", "Solo una vez, en la primera escena, y después ya no se repite más."], level: "medio" },
    { q: "¿Qué describe el ambiente de una obra?", correct: "La época, el clima, el lugar y las características del paisaje donde ocurre la historia.",
      wrong: ["Solo el nombre de cada uno de los personajes y la ropa que llevan puesta en la obra.", "Los aplausos del público, las luces del teatro y la música que suena entre las escenas.", "El final de la historia, es decir, cómo termina cada personaje después de la última escena.", "Lo que dice el narrador en voz alta cuando presenta la obra y a los personajes."], level: "medio" },
    { q: "¿Cuál es el orden correcto para escribir un libreto?", correct: "Elegir la historia, describir el ambiente, identificar los personajes, dividir en escenas y escribir los diálogos.",
      wrong: ["Escribir primero todos los diálogos, luego inventar los personajes y elegir la historia al final.", "Escribir solo el título y las acotaciones, porque los diálogos los inventan los actores en escena.", "Dividir la obra en escenas antes de saber cuál es la historia, y después describir el ambiente.", "Copiar el cuento tal cual, sin cambiar nada, y leerlo en voz alta frente al público."], level: "medio" },
    { q: "Al dividir una historia en escenas, ¿qué se indica de cada escena?", correct: "Las acciones principales y en dónde sucede cada una.",
      wrong: ["Solo cuántos minutos dura cada una en el escenario.", "El nombre del narrador y el de los actores que participan.", "Cuántos aplausos recibe del público al terminar.", "El color del vestuario que usa cada personaje."], level: "dificil" },
    { q: "¿En qué se parece y en qué se diferencia un cuento de un guion teatral?", correct: "Los dos cuentan una historia, pero el guion la escribe en diálogos y acotaciones para ser actuada, no solo leída.",
      wrong: ["Son exactamente lo mismo: cuentan la misma historia de la misma forma y solo cambia el título que llevan.", "El cuento tiene personajes que hablan y hacen cosas, mientras que el guion no tiene personajes, solo narrador.", "El guion no cuenta ninguna historia; solo trae instrucciones para los actores, sin personajes ni diálogos.", "El cuento se escribe para actuarlo frente al público y el guion se escribe para leerlo en silencio."], level: "dificil" },
    { q: "Si en el libreto aparece \"(Asustado.)\" antes de lo que dice un personaje, ¿qué debe hacer el actor?", correct: "Actuar con miedo mientras dice su diálogo, sin leer la palabra \"asustado\" en voz alta.",
      wrong: ["Decir la palabra \"asustado\" en voz alta, antes de su diálogo, para que el público la escuche.", "Saltarse esa línea completa, porque lo que va entre paréntesis no se actúa ni se dice.", "Cambiar de escena en ese momento, porque los paréntesis indican que termina una parte de la obra.", "Pedirle al narrador que diga \"asustado\" en voz alta mientras el actor espera en silencio."], level: "dificil" }
  ],

  // Convertir un cuento narrado a formato de guion (personaje + acotación + diálogo).
  CONVERT: [
    { narrative: "El zapatero sonrió y dijo que quería ofrecer lo mejor a sus clientes.",
      correct: "Zapatero: (Sonriendo.) Quiero ofrecer a mis clientes lo mejor.",
      wrong: ["Zapatero sonrió: quiero ofrecer lo mejor.", "Narrador: Quiero ofrecer a mis clientes lo mejor.", "(Zapatero) Quiero ofrecer lo mejor, dijo sonriendo."], level: "medio" },
    { narrative: "La mujer, preocupada, le dijo a su esposo que ya no tenían dinero para comprar cuero.",
      correct: "Mujer: (Preocupada.) Ya no nos queda plata para comprar más cuero.",
      wrong: ["Mujer: Preocupada, ya no nos queda plata para comprar más cuero.", "Narrador: (Preocupada.) Ya no nos queda plata.", "La mujer preocupada: no hay plata para cuero."], level: "medio" },
    { narrative: "Caperucita, asustada, le preguntó a la abuela por qué tenía los ojos tan grandes.",
      correct: "Caperucita: (Asustada.) Abuelita, ¿por qué tienes los ojos tan grandes?",
      wrong: ["Caperucita: Asustada, ¿por qué tienes los ojos tan grandes?", "Narrador: Abuelita, ¿por qué tienes los ojos tan grandes?", "(Caperucita, asustada) por qué tienes los ojos tan grandes."], level: "medio" },
    { narrative: "El cerdito menor gritó con miedo que el lobo se estaba acercando.",
      correct: "Cerdito menor: (Con miedo.) ¡El lobo se está acercando!",
      wrong: ["Cerdito menor: Con miedo, el lobo se está acercando.", "Narrador: ¡El lobo se está acercando!", "El cerdito gritó (con miedo) que el lobo venía."], level: "dificil" },
    { narrative: "Sofía, emocionada, les anunció a sus amigas que ya tenían las paletas listas.",
      correct: "Sofía: (Emocionada.) ¡Amigas, ya tenemos las paletas listas!",
      wrong: ["Sofía: Emocionada, ya tenemos las paletas listas.", "Narrador: ¡Ya tenemos las paletas listas!", "(Sofía) les dijo emocionada que las paletas estaban listas."], level: "dificil" },
    { narrative: "El zapatero, sorprendido, exclamó que los zapatos estaban terminados y eran perfectos.",
      correct: "Zapatero: (Sorprendido.) ¡Los zapatos están terminados y son perfectos!",
      wrong: ["Zapatero: Sorprendido, los zapatos están terminados.", "Narrador: (Sorprendido.) ¡Los zapatos están perfectos!", "El zapatero exclamó sorprendido: zapatos perfectos."], level: "dificil" }
  ],

  TYPES_BY_LEVEL: {
    facil: ["elemento", "elemento", "concepto"],
    medio: ["elemento", "concepto", "convertir"],
    dificil: ["elemento", "concepto", "convertir"]
  },
  OPTIONS_BY_LEVEL: { facil: 3, medio: 4, dificil: 5 },

  _lastKey: null,

  _pickRandom: function (arr, n) {
    var pool = arr.slice();
    var out = [];
    while (out.length < n && pool.length) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    return out;
  },

  _shuffle: function (a) {
    var arr = a.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  },

  // Elige del pool sin repetir el ítem anterior.
  _pickNoRepeat: function (pool, keyFn) {
    var self = this;
    var candidates = pool.filter(function (x) { return keyFn(x) !== self._lastKey; });
    if (!candidates.length) candidates = pool;
    var chosen = candidates[Math.floor(Math.random() * candidates.length)];
    this._lastKey = keyFn(chosen);
    return chosen;
  },

  start: function (level) {
    this.generateValues(level);
    var eq = this.eq;
    if (eq.kind === "elemento") {
      App.updateTeacher("Paso 1: ¿Qué parte del guion es?", "Pistas: <b>paréntesis</b> o una <b>descripción del lugar</b> sin nombre de personaje = acotación · <b>Nombre:</b> = diálogo · <b>Narrador:</b> = narrador · <b>Escena No.</b> = escena · el <b>nombre de la obra</b> = título.", "🎭");
    } else if (eq.kind === "concepto") {
      App.updateTeacher("Paso 1: Piensa en la definición", "Recuerda para qué sirve cada parte del libreto y elige la explicación correcta.", "📖");
    } else {
      App.updateTeacher("Paso 1: Del cuento al libreto", "En un guion, el personaje va primero con dos puntos, la <b>acotación</b> entre paréntesis y luego lo que <b>dice</b>, en primera persona.", "🎬");
    }
    this.renderRow();
  },

  generateValues: function (level) {
    var types = this.TYPES_BY_LEVEL[level] || this.TYPES_BY_LEVEL.facil;
    var kind = types[Math.floor(Math.random() * types.length)];
    var numOptions = this.OPTIONS_BY_LEVEL[level] || 3;
    var shuffle = this._shuffle;

    if (kind === "elemento") {
      var fPool = this.FRAGMENTS.filter(function (f) { return f.level === level; });
      if (!fPool.length) fPool = this.FRAGMENTS;
      var f = this._pickNoRepeat(fPool, function (x) { return x.text; });
      var otherEls = this.ELEMENTS.map(function (e) { return e.id; }).filter(function (id) { return id !== f.answer; });
      this.eq = { kind: "elemento", item: f, options: shuffle([f.answer].concat(this._pickRandom(otherEls, numOptions - 1))), correct: f.answer };
    } else if (kind === "concepto") {
      var cPool = this.CONCEPTS.filter(function (c) { return c.level === level; });
      if (!cPool.length) cPool = this.CONCEPTS;
      var c = this._pickNoRepeat(cPool, function (x) { return x.q; });
      this.eq = { kind: "concepto", item: c, options: shuffle([c.correct].concat(this._pickRandom(c.wrong, numOptions - 1))), correct: c.correct };
    } else {
      var vPool = this.CONVERT.filter(function (v) { return v.level === level; });
      if (!vPool.length) vPool = this.CONVERT;
      var v = this._pickNoRepeat(vPool, function (x) { return x.narrative; });
      this.eq = { kind: "convertir", item: v, options: shuffle([v.correct].concat(this._pickRandom(v.wrong, Math.min(3, numOptions - 1)))), correct: v.correct };
    }
  },

  showExample: function (container) {
    container.innerHTML =
      "<div class=\"p-4 md:p-6 bg-violet-50 rounded-xl border-2 border-violet-200\">" +
      "<p class=\"font-bold text-violet-800 mb-4 border-b-2 border-violet-200 pb-2 text-xl\">Ejemplo: Las partes de un guion teatral</p>" +
      "<div class=\"bg-white border-2 border-violet-200 rounded-xl p-4 mb-4 font-sans text-sm md:text-base space-y-1\">" +
      "<p class=\"text-center font-black text-lg\">Los duendes y el zapatero <span class=\"text-violet-500 text-xs font-bold\">← TÍTULO</span></p>" +
      "<p class=\"font-black text-violet-700\">Escena No. 1 <span class=\"text-violet-500 text-xs font-bold\">← ESCENA</span></p>" +
      "<p class=\"italic text-slate-500\">Se observa la sala de una casa; al fondo, la chimenea prendida. <span class=\"text-violet-500 text-xs font-bold not-italic\">← ACOTACIÓN (describe el escenario)</span></p>" +
      "<p><b>Narrador:</b> La mujer del zapatero pidió inquieta a su marido que trabajara más rápido. <span class=\"text-violet-500 text-xs font-bold\">← NARRADOR</span></p>" +
      "<p><b>Mujer:</b> Viejo, ¿no puedes trabajar más rápido? <span class=\"text-violet-500 text-xs font-bold\">← DIÁLOGO</span></p>" +
      "<p><b>Zapatero:</b> <i>(Sonriendo.)</i> Quiero ofrecer a mis clientes lo mejor. <span class=\"text-violet-500 text-xs font-bold\">← ACOTACIÓN + DIÁLOGO</span></p>" +
      "</div>" +
      "<ul class=\"list-decimal pl-6 space-y-3\">" +
      "<li><b>Diálogo:</b> lo que dice el personaje. Se escribe <b>Nombre:</b> y luego sus palabras, como si él hablara (en primera persona).</li>" +
      "<li><b>Acotación:</b> va entre <b>paréntesis</b> o describe el lugar. Le dice al actor <b>cómo</b> actuar (sonriendo, asustado) o cómo es la escena. <b>No se lee en voz alta.</b></li>" +
      "<li><b>Narrador:</b> cuenta lo que pasa sin ser un personaje de la escena.</li>" +
      "<li><b>Escena:</b> cada parte de la obra. Cambia cuando cambia el <b>lugar</b> o el <b>momento</b>. El taller pide dividir la historia en <b>3 escenas</b>.</li>" +
      "<li><b>Ambiente:</b> antes de escribir, se describe la <b>época, el clima, el lugar y el paisaje</b>, y se identifican los <b>personajes</b> con sus características.</li>" +
      "<li><b>Del cuento al guion:</b> \"El zapatero sonrió y dijo que quería lo mejor para sus clientes\" se convierte en → <b>Zapatero:</b> <i>(Sonriendo.)</i> Quiero ofrecer a mis clientes lo mejor.</li>" +
      "</ul></div>" +
      "<div class=\"p-4 md:p-6 bg-pink-50 rounded-xl border-2 border-pink-200 mt-4\">" +
      "<p class=\"font-bold text-pink-800 mb-3 border-b-2 border-pink-200 pb-2 text-xl\">🗣️ Para sustentar (explicarlo con tus palabras)</p>" +
      "<ol class=\"list-decimal pl-6 space-y-2\">" +
      "<li>\"Un guion teatral es un texto escrito <b>para ser actuado</b>, no solo leído.\"</li>" +
      "<li>\"Tiene <b>diálogos</b> (lo que dicen los personajes) y <b>acotaciones</b> (instrucciones entre paréntesis para los actores, que no se dicen en voz alta).\"</li>" +
      "<li>\"El <b>narrador</b> cuenta lo que no se ve, y la obra se divide en <b>escenas</b> según el lugar o el momento.\"</li>" +
      "<li>\"Para escribirlo: elijo la historia, describo el ambiente, identifico los personajes, la divido en 3 escenas y escribo los diálogos.\"</li>" +
      "</ol></div>";
  },

  renderRow: function () {
    var container = document.getElementById("lines-container");
    var eq = this.eq;
    var self = this;
    var row = document.createElement("div");
    row.className = "flex flex-col items-center w-full animate-fade-in mb-4";

    var card = function (label, text, mono) {
      return "<div class=\"bg-white border-4 border-violet-200 p-6 rounded-3xl w-full max-w-xl shadow-sm text-center mb-4\">" +
        "<p class=\"text-violet-500 font-bold uppercase tracking-wide text-xs md:text-sm mb-2\">" + label + "</p>" +
        "<p class=\"" + (mono ? "text-lg md:text-xl font-bold italic" : "text-lg md:text-xl font-bold") + " text-slate-800 font-sans\">" + text + "</p></div>";
    };

    var question;
    if (eq.kind === "elemento") {
      row.innerHTML = card("Fragmento del libreto", eq.item.text, true);
      question = "¿Qué parte del guion es?";
    } else if (eq.kind === "concepto") {
      row.innerHTML = card("Pregunta", eq.item.q, false);
      question = "Elige la explicación correcta:";
    } else {
      row.innerHTML = card("Así lo cuenta el cuento", "\"" + eq.item.narrative + "\"", false);
      question = "¿Cómo se escribe correctamente en el guion teatral?";
    }
    row.innerHTML += "<p class=\"text-slate-500 font-sans text-sm md:text-base mb-2 text-center\">" + question + "</p>";
    container.appendChild(row);

    var optsWrap = document.createElement("div");
    optsWrap.className = (eq.kind === "elemento" ? "flex flex-wrap justify-center" : "flex flex-col") + " w-full max-w-xl mx-auto gap-3 animate-fade-in";
    optsWrap.id = "options-container";
    eq.options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.className = "font-sans text-left bg-white border-4 border-violet-200 hover:border-violet-400 hover:bg-violet-50 text-violet-700 font-bold text-base md:text-lg py-3 px-5 rounded-2xl shadow-[0_4px_0_#ddd6fe] active:translate-y-1 active:shadow-none transition-all " +
        (eq.kind === "elemento" ? "min-w-[130px] text-center" : "w-full");
      btn.textContent = opt;
      btn.onclick = function () { self.verify(opt, btn); };
      optsWrap.appendChild(btn);
    });
    container.appendChild(optsWrap);
  },

  verify: function (val, btn) {
    var eq = this.eq;
    if (val === eq.correct) {
      btn.classList.replace("border-violet-200", "border-green-500");
      btn.classList.replace("text-violet-700", "text-white");
      btn.classList.add("bg-green-500");
      var opts = document.getElementById("options-container");
      if (opts) opts.classList.add("pointer-events-none", "opacity-50");

      setTimeout(function () {
        if (opts && document.getElementById("options-container") !== opts) return;
        var msg;
        if (eq.kind === "elemento") {
          var el = GuionGame.ELEMENTS.filter(function (e) { return e.id === eq.correct; })[0];
          msg = "¡Correcto! Es <b>" + eq.correct + "</b> porque " + el.why;
        } else if (eq.kind === "concepto") {
          msg = "¡Correcto! " + eq.correct;
        } else {
          msg = "¡Correcto! Personaje con dos puntos, la acotación <b>entre paréntesis</b> (cómo lo dice) y luego sus palabras <b>en primera persona</b>, como si hablara.";
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
      if (eq.kind === "elemento") {
        tip = "Mira la forma del fragmento: ¿está entre <b>paréntesis</b> o describe el <b>lugar</b> sin nombre de personaje (acotación)? ¿Empieza con un <b>nombre y dos puntos</b> (diálogo)? ¿Dice <b>Narrador</b>? ¿Dice <b>Escena</b>? ¿Es solo el <b>nombre de la obra</b> (título)?";
      } else if (eq.kind === "concepto") {
        tip = "Piensa en el ejemplo del zapatero: <i>(Sonriendo.)</i> es acotación, <b>Zapatero:</b> es diálogo, <b>Narrador:</b> cuenta la historia.";
      } else {
        tip = "En el guion el personaje va <b>primero con dos puntos</b>, lo que siente va <b>entre paréntesis</b>, y habla <b>en primera persona</b> (\"quiero\", no \"quería\").";
      }
      App.updateTeacher("¡Casi! Fíjate en las pistas", "No es correcto. 💡 <b>Pista:</b> " + tip, "🤔");
      if (typeof registerWrongAttempt === "function") registerWrongAttempt();

      setTimeout(function () {
        btn.classList.remove(fBg, fText, "animate-shake");
        btn.classList.replace(fBorder, "border-violet-200");
      }, 900);
    }
  },

  cleanup: function () {}
};

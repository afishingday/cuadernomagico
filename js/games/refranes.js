/**
 * Juego: Refranes y Dichos (Español 5º Grado) — "Establezco diferencias y semejanzas".
 * Basado en el taller del colegio "El Sabio Mundo de los Refranes": relacionar el
 * refrán con su significado real (no literal), completar el refrán y saber en qué
 * situación de la vida diaria se usaría.
 */
var RefranGame = {
  eq: null,

  // inicio/final: para el tipo "completar". wrongEndings: finales falsos al estilo del taller.
  // family: refranes con una enseñanza parecida (esfuerzo, no meterse en lo ajeno,
  // prevenir...) NO se usan como distractores entre sí, para que nunca haya dos
  // opciones que "también podrían ser".
  BANK: [
    { inicio: "Camarón que se duerme,", final: "se lo lleva la corriente.", level: "facil", family: "esfuerzo",
      wrongEndings: ["nada muy despacio.", "se queda en la playa."],
      meaning: "Si nos descuidamos o somos perezosos, podemos perder las oportunidades de la vida.",
      situacion: "Juan se distrajo jugando y no entregó su tarea a tiempo; perdió la oportunidad de subir su nota.",
      hint: "Piensa: ¿qué le pasa a un camarón de verdad si se queda dormido en el mar con la corriente?" },
    { inicio: "Al que madruga,", final: "Dios le ayuda.", level: "facil", family: "esfuerzo",
      wrongEndings: ["se le pasa el bus.", "le da mucho sueño."],
      meaning: "Quien se esfuerza y hace sus tareas temprano tendrá éxito y buenos resultados.",
      situacion: "Sofía se levantó temprano a estudiar y por eso le fue muy bien en el examen.",
      hint: "No es solo sobre despertarse temprano: habla de esforzarse a tiempo, antes de que sea tarde." },
    { inicio: "Perro que ladra", final: "no muerde.", level: "facil",
      wrongEndings: ["muerde muy fuerte.", "corre rápido."],
      meaning: "Alguien que amenaza mucho, en realidad no suele hacer daño.",
      situacion: "El niño gritaba muy fuerte que se iba a enojar, pero al final nunca hizo nada.",
      hint: "Piensa en un perro que ladra fuerte: ¿siempre muerde?" },
    { inicio: "Más vale tarde", final: "que nunca.", level: "facil",
      wrongEndings: ["que temprano.", "que a tiempo."],
      meaning: "Es mejor hacer algo tarde que no hacerlo nunca.",
      situacion: "Un estudiante entrega una tarea atrasada pero bien hecha, en lugar de no entregar nada.",
      hint: "Compara las dos opciones: llegar tarde frente a no llegar nunca. ¿Cuál es mejor?" },
    { inicio: "No dejes para mañana", final: "lo que puedas hacer hoy.", level: "facil", family: "esfuerzo",
      wrongEndings: ["lo que puedas comer hoy.", "nada de nada."],
      meaning: "Es mejor hacer las tareas y deberes de inmediato en lugar de acumular pereza.",
      situacion: "Sofía tenía tarea para el lunes, pero la dejó para el domingo en la noche y casi no la termina.",
      hint: "Es un consejo directo contra dejar todo para después." },
    { inicio: "A mal tiempo,", final: "buena cara.", level: "facil",
      wrongEndings: ["sombrilla en mano.", "abrigarse mucho."],
      meaning: "Hay que enfrentar los problemas con una actitud positiva y sin rendirse.",
      situacion: "Tu amigo está triste porque le fue mal en un examen y cree que no vale la pena volver a intentarlo.",
      hint: "\"Mal tiempo\" aquí significa un momento difícil, no el clima." },
    { inicio: "No todo lo que brilla", final: "es oro.", level: "facil",
      wrongEndings: ["es de plata.", "es un diamante."],
      meaning: "Las apariencias engañan; lo que brilla o se ve bonito no siempre es valioso.",
      situacion: "Camila compró un juguete que se veía increíble en la caja, pero se rompió el primer día.",
      hint: "Piensa en algo que brilla como el oro pero en realidad no lo es." },
    { inicio: "De tal palo,", final: "tal astilla.", level: "facil",
      wrongEndings: ["tal árbol.", "tal fogata."],
      meaning: "Los hijos suelen parecerse en comportamiento o gustos a sus padres.",
      situacion: "Mateo es tan bueno para la cocina como su mamá, que es chef.",
      hint: "Una astilla sale del mismo palo — piensa en hijos y padres." },
    { inicio: "Quien siembra,", final: "recoge.", level: "facil", family: "esfuerzo",
      wrongEndings: ["descansa.", "se moja."],
      meaning: "Si te esfuerzas y trabajas con constancia, después recibes los buenos resultados de ese esfuerzo.",
      situacion: "Sofía practicó todos los días y en el examen le fue excelente.",
      hint: "Lo que sembraste es lo que vas a recoger después." },
    { inicio: "Quien guarda,", final: "siempre tiene.", level: "facil", family: "prevenir",
      wrongEndings: ["nunca gasta.", "se aburre."],
      meaning: "Ahorrar hoy te asegura tener algo cuando lo necesites.",
      situacion: "Tu hermano menor se gasta todo el dinero de su merienda el lunes y el viernes no tiene nada.",
      hint: "Es un consejo sobre ahorrar." },

    { inicio: "A caballo regalado", final: "no se le mira el colmillo.", level: "medio",
      wrongEndings: ["se le da zanahoria.", "se le pone silla."],
      meaning: "Si recibes un regalo, acéptalo con gratitud sin criticar sus defectos.",
      situacion: "A Ana le regalaron una mochila que no era de su color favorito, pero igual la usó agradecida sin quejarse.",
      hint: "Antes se miraban los dientes de un caballo para saber su edad — pero si es un regalo, ¿para qué revisarlo?" },
    { inicio: "En boca cerrada", final: "no entran moscas.", level: "medio", family: "ajeno",
      wrongEndings: ["no entra comida.", "hay que cepillar los dientes."],
      meaning: "Es mejor actuar con prudencia y callar antes de decir algo que cause problemas.",
      situacion: "Sofía prefirió no opinar en la discusión de sus amigas para no meterse en un problema que no era suyo.",
      hint: "Piensa en lo que le puede pasar a alguien que habla demasiado sin pensar." },
    { inicio: "Zapatero,", final: "a tus zapatos.", level: "medio", family: "ajeno",
      wrongEndings: ["a tu sombrero.", "a dormir temprano."],
      meaning: "Cada quien debe ocuparse de lo que sabe hacer y no meterse en lo ajeno.",
      situacion: "El profesor de matemáticas no opinó sobre la clase de música porque no era su especialidad.",
      hint: "Un zapatero es experto en zapatos — ¿debería opinar sobre algo que no es su oficio?" },
    { inicio: "Más vale pájaro en mano", final: "que ciento volando.", level: "medio",
      wrongEndings: ["que gato encerrado.", "que pluma en el aire."],
      meaning: "Es mejor tener algo seguro que arriesgarlo todo por conseguir más.",
      situacion: "Le ofrecieron cambiar su premio seguro por la posibilidad de ganar uno mejor, pero prefirió quedarse con el que ya tenía.",
      hint: "Compara: un pájaro que ya tienes en la mano frente a cien pájaros volando que quizás nunca atrapes." },
    { inicio: "Donde manda capitán,", final: "no manda marinero.", level: "medio",
      wrongEndings: ["manda el barco.", "todos descansan."],
      meaning: "Hay que respetar y seguir las reglas de quien está a cargo.",
      situacion: "Aunque algunos niños querían jugar otra cosa, siguieron las reglas que puso el profesor a cargo del grupo.",
      hint: "En un barco, el capitán manda y el marinero obedece." },
    { inicio: "Agua que no has de beber,", final: "déjala correr.", level: "medio", family: "ajeno",
      wrongEndings: ["guárdala en la nevera.", "échala al río."],
      meaning: "No debes meterte en asuntos que no te importan o no te incumben.",
      situacion: "Sofía escuchó un chisme sobre otra familia y decidió no comentarlo ni meterse en ese tema.",
      hint: "Si no vas a usar esa agua, ¿para qué te metes a controlarla? Piensa en \"asuntos ajenos\"." },
    { inicio: "El que tiene tienda,", final: "que la atienda.", level: "medio",
      wrongEndings: ["que la venda.", "que la cierre temprano."],
      meaning: "Uno debe hacerse responsable y cuidar de sus propios deberes o negocios.",
      situacion: "Sofía quería que sus amigas le cuidaran el puesto de paletas mientras ella jugaba, pero el puesto es su responsabilidad.",
      hint: "Si la tienda es tuya, ¿quién debería cuidarla?" },
    { inicio: "Ojos que no ven,", final: "corazón que no siente.", level: "medio",
      wrongEndings: ["tropiezan en la calle.", "necesitan gafas nuevas."],
      meaning: "Lo que no sabemos o no vemos, no nos duele ni nos preocupa.",
      situacion: "Ana no se enteró de que su equipo perdió el partido, así que no se puso triste.",
      hint: "Si no ves algo, ¿te puede doler?" },
    { inicio: "A lo hecho,", final: "pecho.", level: "medio",
      wrongEndings: ["lecho.", "techo."],
      meaning: "Hay que asumir con valentía las consecuencias de lo que ya hicimos, sin lamentarse.",
      situacion: "Pedro rompió el florero sin querer y, en vez de esconderlo, fue a contarle a su mamá.",
      hint: "Cuando algo ya está hecho, hay que enfrentarlo \"con el pecho\" (con valentía)." },

    { inicio: "No hay mal", final: "que por bien no venga.", level: "dificil",
      wrongEndings: ["que se cure con sopa.", "que dure un ratico."],
      meaning: "Hasta las cosas malas pueden traer algo bueno o una lección de aprendizaje.",
      situacion: "Se le dañó la bicicleta y por eso caminó al colegio, descubriendo un atajo mucho más bonito.",
      hint: "Busca cómo algo que empezó mal terminó trayendo un resultado positivo." },
    { inicio: "Quien mucho abarca,", final: "poco aprieta.", level: "dificil",
      wrongEndings: ["mucho gana.", "se cansa poco."],
      meaning: "Si intentas hacer demasiadas cosas a la vez, no harás ninguna bien.",
      situacion: "Sofía quiso hacer tres tareas y dos proyectos el mismo día, y terminó ninguno completo.",
      hint: "\"Abarcar\" es tratar de agarrar mucho de una vez — ¿qué pasa cuando agarras demasiado?" },
    { inicio: "Dime con quién andas", final: "y te diré quién eres.", level: "dificil",
      wrongEndings: ["y te diré a dónde vas.", "y te diré qué comes."],
      meaning: "Las personas con las que te juntas influyen en cómo eres o cómo te ven.",
      situacion: "Los papás de Camila le sugirieron elegir bien a sus amigas, porque eso también dice mucho de ella.",
      hint: "Piensa en cómo los amigos pueden influir en cómo se comporta alguien." },
    { inicio: "Cuando el río suena,", final: "es porque piedras trae.", level: "dificil",
      wrongEndings: ["es porque hay peces.", "hay que taparse los oídos."],
      meaning: "Si hay muchos rumores sobre algo, probablemente hay algo de verdad detrás.",
      situacion: "Todos en el salón comentaban lo mismo sobre el examen sorpresa, y al final sí era cierto.",
      hint: "Un río hace ruido cuando el agua choca contra piedras — no suena \"porque sí\"." },
    { inicio: "Más vale prevenir", final: "que lamentar.", level: "dificil", family: "prevenir",
      wrongEndings: ["que dormir tarde.", "que olvidar."],
      meaning: "Es mejor cuidarse y tomar precauciones antes de que algo malo pase.",
      situacion: "Antes de salir en bicicleta, Sofía se puso el casco para no lastimarse si se caía.",
      hint: "Compara \"prevenir\" (cuidarse antes) con \"lamentar\" (arrepentirse después)." },
    { inicio: "El que no arriesga,", final: "no gana.", level: "dificil",
      wrongEndings: ["no pierde.", "descansa más."],
      meaning: "Si no te atreves a intentar algo, no puedes lograr grandes resultados.",
      situacion: "Sofía tenía miedo de ofrecer sus paletas en la feria, pero se animó a intentarlo y le fue muy bien.",
      hint: "Piensa en lo que NUNCA puede pasar si alguien nunca se atreve a intentar nada." },
    { inicio: "Cae más rápido un mentiroso", final: "que un cojo.", level: "dificil",
      wrongEndings: ["que un conejo.", "que una hoja."],
      meaning: "Las mentiras se descubren muy pronto; al mentiroso lo atrapan fácilmente.",
      situacion: "Luis dijo que había hecho la tarea, pero la profesora le pidió verla y se descubrió la mentira.",
      hint: "¿Quién \"cae\" (lo atrapan) más fácil: alguien que cojea o alguien que miente?" },
    { inicio: "Quien mucha cuerda da al loco, por cuerdo se tiene", final: "poco.", level: "dificil",
      wrongEndings: ["mucho.", "loco."],
      meaning: "Quien le sigue la corriente a alguien imprudente, también actúa con poco juicio.",
      situacion: "Daniel le siguió el juego a su amigo que quería saltar la reja, y los dos terminaron castigados.",
      hint: "Busca la palabra que rime con \"loco\" y que tenga sentido: si le das cuerda al loco, de cuerdo te queda..." },
    { inicio: "El que siembra vientos,", final: "cosecha tempestades.", level: "dificil", family: "consecuencias",
      wrongEndings: ["cosecha frutas.", "recoge flores."],
      meaning: "Quien causa problemas o hace daño, recibe de vuelta problemas más grandes.",
      situacion: "Unos niños inventaron historias falsas sobre un compañero y terminaron en coordinación con sus papás.",
      hint: "Si siembras algo pequeño y malo (viento), ¿qué cosechas? Algo más grande y peor (tempestad)." }
  ],

  TYPES: ["significado", "significado", "completar", "situacion"],
  OPTIONS_BY_LEVEL: { facil: 3, medio: 4, dificil: 5 },

  refranText: function (item) { return item.inicio + " " + item.final; },

  start: function (level) {
    this.generateValues(level);
    var eq = this.eq;
    if (eq.kind === "significado") {
      App.updateTeacher("Paso 1: Descubre el significado", "Los refranes casi nunca son literales. Piensa qué quieren decir realmente, no palabra por palabra.", "💬");
    } else if (eq.kind === "completar") {
      App.updateTeacher("Paso 1: Completa el refrán", "Lee el inicio y busca el final que le corresponde. Pista: casi siempre rima o tiene sentido con la primera parte.", "✍️");
    } else {
      App.updateTeacher("Paso 1: Compara y elige el refrán", "Lee la situación y piensa cuál de los refranes describe mejor lo que está pasando.", "🔎");
    }
    this.renderRow();
  },

  _pickRandom: function (arr, n) {
    var pool = arr.slice();
    var out = [];
    while (out.length < n && pool.length) {
      var i = Math.floor(Math.random() * pool.length);
      out.push(pool.splice(i, 1)[0]);
    }
    return out;
  },

  _lastInicio: null,

  _shuffle: function (a) {
    var arr = a.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  },

  generateValues: function (level) {
    var self = this;
    var pool = this.BANK.filter(function (r) { return r.level === level; });
    if (!pool.length) pool = this.BANK;
    // Sin repetir el refrán anterior.
    var candidates = pool.filter(function (r) { return r.inicio !== self._lastInicio; });
    if (!candidates.length) candidates = pool;
    var item = candidates[Math.floor(Math.random() * candidates.length)];
    this._lastInicio = item.inicio;
    var numOptions = this.OPTIONS_BY_LEVEL[level] || 3;
    var kind = this.TYPES[Math.floor(Math.random() * this.TYPES.length)];
    // Distractores: nunca de la misma "familia" de enseñanza (ver BANK).
    var others = this.BANK.filter(function (r) {
      return r !== item && !(item.family && r.family === item.family);
    });
    var shuffle = this._shuffle;

    if (kind === "completar") {
      var wrong = item.wrongEndings.slice();
      while (wrong.length < numOptions - 1) {
        var extra = this._pickRandom(others, 1)[0].final;
        if (wrong.indexOf(extra) === -1 && extra !== item.final) wrong.push(extra);
      }
      wrong = wrong.slice(0, numOptions - 1);
      this.eq = { kind: "completar", item: item, options: shuffle([item.final].concat(wrong)), correct: item.final };
    } else if (kind === "situacion") {
      var wrongR = this._pickRandom(others, numOptions - 1).map(function (r) { return self.refranText(r); });
      this.eq = { kind: "situacion", item: item, options: shuffle([this.refranText(item)].concat(wrongR)), correct: this.refranText(item) };
    } else {
      var wrongM = this._pickRandom(others, numOptions - 1).map(function (r) { return r.meaning; });
      this.eq = { kind: "significado", item: item, options: shuffle([item.meaning].concat(wrongM)), correct: item.meaning };
    }
  },

  showExample: function (container) {
    container.innerHTML =
      "<div class=\"p-4 md:p-6 bg-violet-50 rounded-xl border-2 border-violet-200\">" +
      "<p class=\"font-bold text-violet-800 mb-4 border-b-2 border-violet-200 pb-2 text-xl\">Ejemplo: Cómo entender un refrán</p>" +
      "<ul class=\"list-decimal pl-6 space-y-3\">" +
      "<li><b>El refrán:</b> <span class=\"bg-white border px-2 rounded font-bold\">\"Camarón que se duerme, se lo lleva la corriente\"</span>.</li>" +
      "<li><b>No es literal:</b> No habla de camarones de verdad — es una imagen para explicar una idea.</li>" +
      "<li><b>El significado real (la moraleja):</b> Si nos descuidamos o somos perezosos, <b>perdemos oportunidades</b>.</li>" +
      "<li><b>Una situación donde aplica:</b> Un compañero no entregó su tarea a tiempo por estar jugando, y perdió la oportunidad de subir su nota.</li>" +
      "<li><b>Para completarlo:</b> Los refranes tienen dos partes que riman o se conectan: \"Perro que ladra...\" → \"no muerde\". Busca el final que tenga sentido con el inicio.</li>" +
      "<li><b>Diferencias y semejanzas:</b> Compara refranes entre sí — \"Al que madruga, Dios le ayuda\" y \"No dejes para mañana lo que puedas hacer hoy\" se parecen (los dos hablan de esforzarse a tiempo), pero \"Perro que ladra no muerde\" habla de otra cosa (las amenazas).</li>" +
      "</ul></div>" +
      "<div class=\"p-4 md:p-6 bg-pink-50 rounded-xl border-2 border-pink-200 mt-4\">" +
      "<p class=\"font-bold text-pink-800 mb-3 border-b-2 border-pink-200 pb-2 text-xl\">🗣️ Para sustentar (explicarlo con tus palabras)</p>" +
      "<ol class=\"list-decimal pl-6 space-y-2\">" +
      "<li>Di el refrán completo.</li>" +
      "<li>Aclara que <b>no es literal</b>: \"No habla de un camarón de verdad...\".</li>" +
      "<li>Di la enseñanza: \"<b>Significa que</b> si te descuidas, pierdes oportunidades\".</li>" +
      "<li>Da un ejemplo de la vida real: \"Por ejemplo, si no hago la tarea a tiempo...\".</li>" +
      "</ol></div>";
  },

  renderRow: function () {
    var container = document.getElementById("lines-container");
    var eq = this.eq;
    var row = document.createElement("div");
    row.className = "flex flex-col items-center w-full animate-fade-in mb-4";

    var card = function (label, text, big) {
      return "<div class=\"bg-white border-4 border-violet-200 p-6 rounded-3xl w-full max-w-xl shadow-sm text-center mb-4\">" +
        "<p class=\"text-violet-500 font-bold uppercase tracking-wide text-xs md:text-sm mb-2\">" + label + "</p>" +
        "<p class=\"" + (big ? "text-xl md:text-2xl font-black" : "text-lg md:text-xl font-bold") + " text-slate-800 font-sans\">" + text + "</p></div>";
    };

    if (eq.kind === "significado") {
      row.innerHTML = card("Refrán", "\"" + this.refranText(eq.item) + "\"", true) +
        "<p class=\"text-slate-500 font-sans text-sm md:text-base mb-2 text-center\">¿Qué significa este refrán?</p>";
    } else if (eq.kind === "completar") {
      row.innerHTML = card("Completa el refrán", "\"" + eq.item.inicio + " <span class=\"text-pink-500\">______</span>\"", true) +
        "<p class=\"text-slate-500 font-sans text-sm md:text-base mb-2 text-center\">¿Cómo termina?</p>";
    } else {
      row.innerHTML = card("Situación", eq.item.situacion, false) +
        "<p class=\"text-slate-500 font-sans text-sm md:text-base mb-2 text-center\">¿Qué refrán aplica aquí?</p>";
    }
    container.appendChild(row);
    this.renderOptions();
  },

  renderOptions: function () {
    var self = this;
    var eq = this.eq;
    var container = document.createElement("div");
    container.className = "flex flex-col w-full max-w-xl mx-auto gap-3 animate-fade-in";
    container.id = "options-container";

    eq.options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.className = "font-sans text-left w-full bg-white border-4 border-violet-200 hover:border-violet-400 hover:bg-violet-50 text-violet-700 font-bold text-base md:text-lg py-3 px-5 rounded-2xl shadow-[0_4px_0_#ddd6fe] active:translate-y-1 active:shadow-none transition-all";
      btn.textContent = eq.kind === "situacion" ? "\"" + opt + "\"" : (eq.kind === "completar" ? "... " + opt : opt);
      btn.onclick = function () { self.verify(opt, btn); };
      container.appendChild(btn);
    });
    document.getElementById("lines-container").appendChild(container);
  },

  verify: function (val, btn) {
    var eq = this.eq;
    var item = eq.item;
    var full = this.refranText(item);

    if (val === eq.correct) {
      btn.classList.replace("border-violet-200", "border-green-500");
      btn.classList.replace("text-violet-700", "text-white");
      btn.classList.add("bg-green-500");
      var opts = document.getElementById("options-container");
      if (opts) opts.classList.add("pointer-events-none", "opacity-50");

      setTimeout(function () {
        if (opts && document.getElementById("options-container") !== opts) return;
        var msg;
        var meaningNoDot = item.meaning.replace(/\.\s*$/, "");
        if (eq.kind === "significado") {
          msg = "¡Correcto! \"" + full + "\" significa: <b>" + meaningNoDot + "</b>.";
        } else if (eq.kind === "completar") {
          msg = "¡Correcto! El refrán completo es <b>\"" + full + "\"</b>, y su enseñanza es: " + item.meaning;
        } else {
          msg = "¡Correcto! <b>\"" + full + "\"</b> aplica aquí porque " + item.meaning.charAt(0).toLowerCase() + item.meaning.slice(1);
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

      // La pista del refrán solo se muestra cuando la pregunta es el significado;
      // en "completar" y "situación" las opciones son los refranes mismos y la
      // pista regalaría la respuesta.
      var hintText;
      if (eq.kind === "significado") {
        hintText = item.hint;
      } else if (eq.kind === "completar") {
        hintText = "Lee el inicio en voz alta y prueba cada final: ¿cuál suena a refrán y tiene sentido con la primera parte? Muchas veces rima.";
      } else {
        hintText = "Piensa de qué trata la situación (esfuerzo, ahorro, prudencia, apariencias, valentía...) y busca el refrán que hable justo de eso.";
      }
      App.updateTeacher("¡Casi! No es ese", "No es correcto. 💡 <b>Pista:</b> " + hintText, "🤔");
      if (typeof registerWrongAttempt === "function") registerWrongAttempt();

      setTimeout(function () {
        btn.classList.remove(fBg, fText, "animate-shake");
        btn.classList.replace(fBorder, "border-violet-200");
      }, 900);
    }
  },

  cleanup: function () {}
};

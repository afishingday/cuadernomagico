/**
 * Controlador principal: vistas, currículo, teorías y Tutor Mágico (Gemini).
 */
var App = {
  view: "landing",
  grade: "5",
  subject: "matematicas",
  topic: "",
  level: "facil",

  curriculum: {
    "5": {
      matematicas: [
        { id: "ecuaciones", name: "Ecuaciones", icon: "⚖️", desc: "Descubre el valor oculto de X" },
        { id: "polinomios", name: "Polinomios", icon: "🎢", desc: "Jerarquía de operaciones" }
      ],
      ingles: [
        { id: "vocabulario", name: "Vocabulario IA", icon: "✨", desc: "Aprende palabras generadas por IA" }
      ]
    },
    "11": {
      matematicas: [
        { id: "inecuaciones", name: "Inecuaciones", icon: "🐊", desc: "Desigualdades e Intervalos Reales" }
      ],
      tecnologia: [
        { id: "circuitos", name: "Circuitos Digitales", icon: "🔌", desc: "Álgebra de Boole y Lógica" }
      ],
      quimica: [
        { id: "balanceo", name: "Balanceo de Ecuaciones", icon: "⚖️", desc: "Conservación de la materia" }
      ]
    }
  },

  // theme y headerColor con clases completas para que Tailwind CDN no las purgue al añadir nuevas materias
  subjectStyles: {
    matematicas: { icon: "🧮", name: "Matemáticas", theme: "bg-white border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 text-emerald-600", headerColor: "text-emerald-700" },
    tecnologia: { icon: "🤖", name: "Tecnología", theme: "bg-white border-cyan-200 hover:border-cyan-300 hover:bg-cyan-50 text-cyan-600", headerColor: "text-cyan-700" },
    ingles: { icon: "🇬🇧", name: "Inglés", theme: "bg-white border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-600", headerColor: "text-blue-700" },
    quimica: { icon: "🧪", name: "Química", theme: "bg-white border-fuchsia-200 hover:border-fuchsia-300 hover:bg-fuchsia-50 text-fuchsia-600", headerColor: "text-fuchsia-700" }
  },

  theories: {
    ecuaciones: {
      title: "💡 Ecuaciones (5º Grado)",
      desc: "Una ecuación es como una balanza perfectamente equilibrada. Tu misión es descubrir cuánto vale la letra X dejándola completamente sola.",
      tips: [
        "<b>Mueve al intruso:</b> Pasa los números que acompañan a la X al otro lado del puente mágico (=).",
        "<b>El Puente Mágico:</b> ¡Recuerda! Cuando un número cruza el igual, cambia a su <b>operación contraria</b> (+ pasa a -, × pasa a ÷).",
        "<b>Comprueba:</b> Al final, resuelve la cuenta para encontrar el valor exacto de X."
      ]
    },
    polinomios: {
      title: "💡 Jerarquía de Operaciones (5º Grado)",
      desc: "Son conjuntos de varias operaciones. Existe un <b>orden estricto</b> para resolverlas para que no haya confusiones.",
      tips: [
        "<b>1º Paréntesis ( ) :</b> ¡Son los reyes! Resuelve siempre lo que está adentro primero.",
        "<b>2º Multiplicación × y División ÷ :</b> Son más fuertes que las sumas y restas.",
        "<b>3º Sumas + y Restas - :</b> Se dejan para el final.",
        "<b>Tip:</b> Si hay varias del mismo nivel, resuélvelas de <b>izquierda a derecha</b>."
      ]
    },
    inecuaciones: {
      title: "💡 Inecuaciones y Desigualdades (11º Grado)",
      desc: "A diferencia de las ecuaciones, las inecuaciones no tienen un solo resultado, ¡tienen infinitos! Por eso representamos sus respuestas usando <b>Intervalos</b>.",
      tips: [
        "<b>Los Símbolos:</b> <b><</b> (menor que), <b>></b> (mayor que), <b>≤</b> (menor o igual que), <b>≥</b> (mayor o igual que).",
        "<b>Regla de Oro:</b> Si pasas multiplicando o dividiendo una cantidad <b>NEGATIVA</b> a ambos lados, la desigualdad <b>SE INVIERTE</b> (ej: de < a >).",
        "<b>Abiertos ( ) :</b> Usan <b>></b> ó <b><</b>. En la gráfica es una bolita vacía. El número <b>NO</b> se incluye.",
        "<b>Cerrados [ ] :</b> Usan <b>≥</b> ó <b>≤</b>. En la gráfica es una bolita llena. El número <b>SÍ</b> se incluye.",
        "<b>Infinitos (∞):</b> Los extremos de la recta numérica siempre son <b>Abiertos ( )</b>."
      ]
    },
    circuitos: {
      title: "💡 Álgebra de Boole y Circuitos (11º Grado)",
      desc: "En tecnología y electrónica computacional, las máquinas no procesan operaciones aritméticas convencionales, sino <b>lógica booleana</b> binaria (1 y 0).",
      tips: [
        "<b>Compuerta AND (Y):</b> Representa la multiplicación booleana (A · B). Solo da como resultado <b>1</b> si ambas entradas son <b>1</b> (Verdaderas).",
        "<b>Compuerta OR (O):</b> Representa la suma booleana (A + B). Da como resultado <b>1</b> si al menos una de las entradas es <b>1</b>.",
        "<b>Compuerta NOT (NO):</b> Actúa como un inversor lógico (A'). Transforma un 1 en 0 y viceversa.",
        "<b>Jerarquía Lógica:</b> Al igual que en aritmética, resuelve primero los paréntesis internos."
      ]
    },
    balanceo: {
      title: "💡 Balanceo de Ecuaciones Químicas (11º Grado)",
      desc: "La materia no se crea ni se destruye, solo se transforma (Ley de Lavoisier). ¡Debe haber la misma cantidad de átomos a ambos lados de la flecha!",
      tips: [
        "<b>Coeficientes:</b> Solo puedes cambiar los números grandes que van ANTES de la molécula. ¡No toques los subíndices (números pequeños)!",
        "<b>Orden mágico:</b> Intenta balancear primero los <b>Metales</b>, luego <b>No Metales</b>, después el <b>Hidrógeno (H)</b> y deja siempre el <b>Oxígeno (O)</b> para el final.",
        "<b>Multiplicación:</b> El coeficiente multiplica a TODOS los átomos de esa molécula (Ej: 2 H₂O significa 4 H y 2 O)."
      ]
    },
    vocabulario: {
      title: "💡 Vocabulario Básico Mágico (5º Grado)",
      desc: "Aprende palabras nuevas generadas infinitamente por nuestra Inteligencia Artificial Gemini.",
      tips: [
        "<b>Lee despacio:</b> Observa bien cómo se escribe la palabra en inglés.",
        "<b>Pide Pistas:</b> Si no sabes la palabra, presiona el botón ✨ de arriba para que el Tutor Mágico te ayude.",
        "<b>Por descarte:</b> Elimina primero las opciones que sepas que son incorrectas."
      ]
    }
  },

  init: function () {
    this.setView("landing");
  },

  setView: function (viewName) {
    this.view = viewName;
    document.getElementById("view-landing").classList.add("hidden-el");
    document.getElementById("view-subjects").classList.add("hidden-el");
    if (document.getElementById("view-topics")) document.getElementById("view-topics").classList.add("hidden-el");
    document.getElementById("view-game").classList.add("hidden-el");

    var viewEl = document.getElementById("view-" + viewName);
    if (viewEl) {
      viewEl.classList.remove("hidden-el");
      viewEl.classList.remove("animate-fade-in");
      void viewEl.offsetWidth;
      viewEl.classList.add("animate-fade-in");
    }
  },

  selectGrade: function (gradeId) {
    this.grade = gradeId;
    document.getElementById("subjects-title").innerHTML = "¿Qué quieres aprender en <span class=\"text-yellow-300\">" + gradeId + "º Grado</span>?";

    var subjectsContainer = document.getElementById("subject-buttons");
    subjectsContainer.innerHTML = "";
    var availableSubjects = Object.keys(this.curriculum[gradeId] || {});

    if (availableSubjects.length === 0) {
      subjectsContainer.innerHTML = "<p class=\"text-white text-2xl font-bold bg-indigo-900/50 p-6 rounded-3xl\">Próximamente agregaremos materias para este grado. ¡Vuelve pronto!</p>";
    } else {
      var self = this;
      availableSubjects.forEach(function (subjKey) {
        var style = self.subjectStyles[subjKey];
        if (!style || !style.theme) return;
        var btn = document.createElement("button");
        btn.onclick = function () { self.selectSubject(subjKey); };
        btn.className = "flex-1 border-b-[10px] rounded-[2rem] p-4 sm:p-6 md:p-8 transition-all transform hover:-translate-y-2 active:translate-y-1 active:border-b-4 group cursor-pointer shadow-2xl flex flex-col items-center min-w-[140px] sm:min-w-[180px] max-w-[300px] w-full mx-auto " + style.theme;
        btn.innerHTML = "<div class=\"text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-3 md:mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform\">" + style.icon + "</div><h3 class=\"text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-center leading-tight w-full tracking-tight px-1\">" + style.name + "</h3>";
        subjectsContainer.appendChild(btn);
      });
    }
    this.setView("subjects");
  },

  selectSubject: function (subjectId) {
    this.subject = subjectId;
    var style = this.subjectStyles[subjectId];
    document.getElementById("topics-subtitle").innerHTML = style.icon + " " + style.name;
    this.renderTopics();
    this.setView("topics");
  },

  selectTopic: function (topicId) {
    this.topic = topicId;
    var style = this.subjectStyles[this.subject];
    var topicData = this.curriculum[this.grade][this.subject].find(function (t) { return t.id === topicId; });

    var headerEl = document.getElementById("game-header-title");
    var headerColorClass = style.headerColor || "text-slate-700";
    headerEl.className = "text-lg md:text-2xl font-black text-center flex-1 " + headerColorClass;
    headerEl.innerHTML = "<span class=\"opacity-60 hidden md:inline\">" + style.icon + " " + style.name + "</span> <span class=\"mx-1 hidden md:inline opacity-50\">👉</span> <span class=\"text-slate-800\">" + topicData.icon + " " + topicData.name + "</span>";

    this.generateContent();
    this.setView("game");
  },

  renderTopics: function () {
    var container = document.getElementById("topic-cards-container");
    container.innerHTML = "";
    var topicsList = this.curriculum[this.grade][this.subject];

    if (topicsList && topicsList.length > 0) {
      var self = this;
      topicsList.forEach(function (t) {
        var btn = document.createElement("button");
        btn.onclick = function () { self.selectTopic(t.id); };
        btn.className = "flex-1 min-w-[160px] sm:min-w-[200px] max-w-[300px] w-full bg-white border-b-[8px] border-indigo-200 hover:border-indigo-400 rounded-3xl p-4 sm:p-6 transition-all transform hover:-translate-y-2 active:translate-y-1 active:border-b-4 group cursor-pointer shadow-xl flex flex-col items-center text-center mx-auto";
        btn.innerHTML = "<div class=\"text-5xl md:text-6xl mb-3 group-hover:scale-110 transition-transform\">" + t.icon + "</div><h3 class=\"text-lg sm:text-xl md:text-2xl font-black text-indigo-700 mb-2 leading-tight w-full tracking-tight\">" + t.name + "</h3><p class=\"text-slate-500 font-bold text-xs sm:text-sm md:text-base w-full\">" + t.desc + "</p>";
        container.appendChild(btn);
      });
    } else {
      container.innerHTML =
        "<div class=\"w-full flex flex-col items-center justify-center bg-white/90 p-10 rounded-3xl shadow-xl border-4 border-slate-300 text-center backdrop-blur\">" +
        "<div class=\"text-6xl mb-4 animate-bounce\">🚧</div>" +
        "<h2 class=\"text-2xl font-black text-slate-700 mb-2\">¡Próximamente!</h2>" +
        "<p class=\"text-slate-500 font-medium\">Los temas de esta materia estarán disponibles muy pronto.</p>" +
        "</div>";
    }
  },

  setLevel: function (level) {
    this.level = level;
    document.querySelectorAll(".lvl-btn").forEach(function (b) { b.classList.remove("ring-4", "ring-white", "scale-110"); });
    document.getElementById("btn-" + level).classList.add("ring-4", "ring-white", "scale-110");
    this.generateContent();
  },

  updateTheory: function () {
    var theory = this.theories[this.topic];
    if (theory) {
      document.getElementById("theory-title").innerHTML = theory.title;
      document.getElementById("theory-desc").innerHTML = theory.desc;
      var tipsHtml = theory.tips.map(function (tip) { return "<li>" + tip + "</li>"; }).join("");
      document.getElementById("theory-tips").innerHTML = tipsHtml;
    }
  },

  generateContent: function () {
    document.getElementById("lines-container").innerHTML = "";
    document.getElementById("success-area").classList.add("hidden-el");
    this.updateTheory();

    if (typeof EqGame !== "undefined") EqGame.cleanup();
    if (typeof IneqGame !== "undefined") IneqGame.cleanup();
    if (typeof ChemGame !== "undefined") ChemGame.cleanup();

    document.getElementById("game-content").classList.remove("hidden-el");
    document.getElementById("coming-soon-area").classList.add("hidden-el");

    if (this.topic === "ecuaciones") EqGame.start(this.level);
    else if (this.topic === "polinomios") PolyGame.start(this.level);
    else if (this.topic === "inecuaciones") IneqGame.start(this.level);
    else if (this.topic === "circuitos") CircuitGame.start(this.level);
    else if (this.topic === "balanceo") ChemGame.start(this.level);
    else if (this.topic === "vocabulario") EnglishGame.start(this.level);
  },

  updateTeacher: function (title, text, emoji) {
    if (emoji === undefined) emoji = "👩‍🏫";
    document.getElementById("msg-title").innerText = title;
    document.getElementById("msg-text").innerHTML = text;
    document.getElementById("teacher-emoji").innerText = emoji;
  },

  getMagicHint: function () {
    var btn = document.getElementById("btn-magic-hint");
    if (btn.disabled) return;

    var originalTitle = document.getElementById("msg-title").innerText;
    var originalText = document.getElementById("msg-text").innerHTML;
    var originalEmoji = document.getElementById("teacher-emoji").innerText;

    this.updateTeacher("✨ Gemini pensando...", "Analizando tu misión para darte una pista mágica...", "⏳");
    btn.disabled = true;
    btn.classList.add("opacity-50", "cursor-not-allowed", "animate-pulse");

    var prompt = "";
    if (this.topic === "ecuaciones") {
      var eqStr = EqGame.eq.op + " " + EqGame.eq.val + " = " + EqGame.eq.res;
      prompt = "Eres un tutor infantil mágico de matemáticas. El niño está intentando despejar la X en la ecuación: X " + eqStr + ". Dale una pista corta (1-2 oraciones como máximo) y divertida usando analogías de equilibrio o magia, sin decirle el resultado exacto ni decirle cómo hacerlo directamente. Anímalo.";
                } else if (this.topic === "polinomios") {
      prompt = "Eres un tutor infantil mágico. El niño está resolviendo un polinomio y tiene que decidir qué operación resolver primero (según la regla PEMDAS). Dale una pequeña pista o recordatorio (máximo 2 oraciones) sobre quiénes son los \"reyes\" o las operaciones más fuertes, de forma divertida, sin resolver el problema por él.";
    } else if (this.topic === "inecuaciones") {
      var ineqStr = IneqGame.eq.op + " " + IneqGame.eq.val + " " + IneqGame.eq.sign + " " + IneqGame.eq.res;
      prompt = "Eres un profesor experto de matemáticas para grado 11. El estudiante está resolviendo la inecuación lineal: X " + ineqStr + ". Dale una pista breve (máximo 2 oraciones). Si el valor a despejar está multiplicando/dividiendo y es NEGATIVO, recuérdale sutilmente la regla de oro de invertir la boquita (desigualdad). Si ya está en la fase de elegir el intervalo, recuérdale cómo traducir los signos >, <, ≥, ≤ a paréntesis o corchetes.";
    } else if (this.topic === "circuitos") {
      prompt = "Eres un profesor de tecnología muy creativo. El estudiante (grado 11) resuelve un circuito lógico con compuertas booleanas AND, OR, NOT. Explica muy brevemente (máximo 2 oraciones) el secreto para resolver la compuerta AND u OR usando una analogía cotidiana, para que deduzca qué pasa con los unos y ceros.";
    } else if (this.topic === "balanceo") {
      prompt = "Eres un profesor de química. El estudiante está balanceando esta ecuación: " + ChemGame.getEquationString() + ". Ayúdalo con una pista muy sutil en ESPAÑOL (máximo 2 oraciones). Dile qué elemento o átomo debería revisar o ajustar primero (recuerda que el Oxígeno e Hidrógeno se dejan para el final) sin darle los coeficientes exactos de la respuesta.";
    } else if (this.topic === "vocabulario") {
      prompt = "Eres un tutor de inglés. El estudiante debe adivinar la palabra en inglés: \"" + EnglishGame.currentWord.en + "\". Dale una pista divertida en ESPAÑOL describiendo qué es, su color, un sonido que hace o dónde se encuentra, para que pueda deducir su traducción. Máximo 2 oraciones. NO uses la traducción al español explícita en tu respuesta.";
    }

    var self = this;
    GeminiAPI.fetchText(prompt)
      .then(function (hint) {
        self.updateTeacher("✨ Pista de Gemini:", hint, "🧞‍♂️");
        setTimeout(function () {
          if (document.getElementById("msg-title").innerText === "✨ Pista de Gemini:") {
            self.updateTeacher(originalTitle, originalText, originalEmoji);
          }
        }, 15000);
      })
      .catch(function () {
        self.updateTeacher("❌ Ups", "Mis poderes de IA fallaron un momento. ¡Sigue intentándolo!", "🧙‍♂️");
        setTimeout(function () { self.updateTeacher(originalTitle, originalText, originalEmoji); }, 3000);
      })
      .then(function () {
        btn.disabled = false;
        btn.classList.remove("opacity-50", "cursor-not-allowed", "animate-pulse");
      });
  },

  triggerConfetti: function () {
    if (typeof triggerConfetti === "function") triggerConfetti();
  }
};

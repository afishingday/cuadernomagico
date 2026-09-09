/**
 * Controlador principal: vistas, currículo, teorías y Tutor Mágico (Gemini).
 */
var App = {
  view: "landing",
  grade: "5",
  subject: "matematicas",
  topic: "",
  level: "facil",
  user: null,
  sessionId: null,
  sessionTopic: null,
  sessionStart: null,
  exercisePointsAwarded: false,

  curriculum: {
    "5": {
      matematicas: [
        { id: "ecuaciones", name: "Ecuaciones", icon: "⚖️", desc: "Descubre el valor oculto de X" },
        { id: "polinomios", name: "Polinomios", icon: "🎢", desc: "Jerarquía de operaciones" },
        { id: "potencias", name: "Potencias", icon: "🚀", desc: "Multiplicaciones repetidas" },
        { id: "radicacion", name: "Radicación", icon: "🔍", desc: "El truco inverso de las potencias" },
        { id: "fracciones", name: "Fracciones", icon: "🍕", desc: "Partes de un todo (Sumas/Restas)" },
        { id: "geometria", name: "Geometría", icon: "📐", desc: "Áreas y perímetros" },
        { id: "estadistica", name: "Estadística", icon: "📊", desc: "Moda, Media, Mediana y Frecuencias" }
      ],
      espanol: [
        { id: "textos", name: "Oraciones Simples y Compuestas", icon: "✍️", desc: "Produzco textos orales y escritos" },
        { id: "refranes", name: "Refranes y Dichos", icon: "💬", desc: "Establezco diferencias y semejanzas" },
        { id: "guion", name: "El Guion Teatral", icon: "🎭", desc: "Relaciono hipótesis de textos literarios" }
      ],
      ingles: [
        { id: "vocabulario", name: "Vocabulario IA", icon: "✨", desc: "Aprende palabras generadas por IA" }
        , { id: "favoritos", name: "Mis Favoritos", icon: "⭐", desc: "Usa My, His y Her correctamente" }
      ],
      historia: [
        { id: "precolombinas", name: "Culturas Precolombinas", icon: "🗿", desc: "Mayas, Incas y Aztecas" }
      ]
    },
    "11": {
      matematicas: [
        { id: "inecuaciones", name: "Inecuaciones", icon: "🐊", desc: "Desigualdades e Intervalos Reales" }
      ],
      estadistica: [
        { id: "probabilidad", name: "Probabilidad", icon: "🎲", desc: "Eventos y casos favorables" }
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
    estadistica: { icon: "📊", name: "Estadística", theme: "bg-white border-orange-200 hover:border-orange-300 hover:bg-orange-50 text-orange-600", headerColor: "text-orange-700" },
    tecnologia: { icon: "🤖", name: "Tecnología", theme: "bg-white border-cyan-200 hover:border-cyan-300 hover:bg-cyan-50 text-cyan-600", headerColor: "text-cyan-700" },
    ingles: { icon: "🔤", name: "Inglés", theme: "bg-white border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-600", headerColor: "text-blue-700" },
    quimica: { icon: "🧪", name: "Química", theme: "bg-white border-fuchsia-200 hover:border-fuchsia-300 hover:bg-fuchsia-50 text-fuchsia-600", headerColor: "text-fuchsia-700" },
    historia: { icon: "🗿", name: "Historia", theme: "bg-white border-amber-200 hover:border-amber-300 hover:bg-amber-50 text-amber-600", headerColor: "text-amber-700" },
    espanol: { icon: "📖", name: "Español", theme: "bg-white border-violet-200 hover:border-violet-300 hover:bg-violet-50 text-violet-600", headerColor: "text-violet-700" }
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
    potencias: {
      title: "💡 Potenciación (5º Grado)",
      desc: "Una potencia es una forma rápida de escribir una multiplicación que se repite muchas veces.",
      tips: [
        "<b>La Base:</b> Es el número grande. Es el número que se va a multiplicar.",
        "<b>El Exponente:</b> Es el número pequeñito arriba. ¡Te dice <b>cuántas veces</b> debes escribir la base para multiplicarla!",
        "<b>¡Ojo!</b> 3² NO es 3x2. Significa multiplicar el 3 por sí mismo dos veces: <b>3 x 3 = 9</b>.",
        "<b>Dato de cocinera:</b> Si duplicas una receta 3 veces seguidas, la cantidad final crece como una potencia de 2 (2³ = 8 veces más). ¡Las potencias también sirven para emprender! 🧁"
      ]
    },
    radicacion: {
      title: "💡 Radicación (5º Grado)",
      desc: "La raíz es el truco AL REVÉS de la potencia. En vez de darte la base y el exponente, te dan el resultado (radicando) y tú debes adivinar la base.",
      tips: [
        "<b>El Radicando:</b> Es el número de adentro del símbolo √. Es lo que salió de una potencia, y ahora queremos saber de cuál.",
        "<b>El Índice:</b> El número chiquito antes de la √ (si no aparece, es 2). Te dice cuántas veces se multiplicó la base por sí misma.",
        "<b>La Raíz (la respuesta):</b> ¿Qué número multiplicado por SÍ MISMO (no dividido, no restado) te da el radicando? Piensa en Potencias al revés.",
        "<b>Truco visual:</b> La raíz cuadrada es el lado de un cuadrado cuya área es el radicando — como en Geometría. Si puedes formar un cuadrado perfecto, cuenta cuántas filas tiene.",
        "<b>¡Ojo!</b> No es dividir el radicando entre el índice. √36 NO es 36 ÷ 2 = 18. Es: ¿qué número × sí mismo = 36? Respuesta: 6.",
        "<b>Dato de repostera:</b> Si tienes 36 mazapanes y los quieres acomodar en una bandeja cuadrada, la raíz cuadrada te dice cuántos caben por fila: 6 filas de 6. 🍬"
      ]
    },
    fracciones: {
      title: "💡 Fracciones (5º Grado)",
      desc: "Las fracciones representan partes de algo entero (como porciones de una pizza).",
      tips: [
        "<b>Homogéneas (Fáciles):</b> Si los números de abajo (denominadores) son IGUALES, solo suma o resta los de arriba y deja el mismo abajo.",
        "<b>Heterogéneas (Desafiantes):</b> Si los números de abajo son DISTINTOS, tienes que hacer la 'Carita Feliz' (multiplicar en cruz y luego los denominadores entre sí)."
      ]
    },
    geometria: {
      title: "💡 Áreas y Perímetros (5º Grado)",
      desc: "En geometría es muy importante no confundir el borde con el relleno de una figura.",
      tips: [
        "<b>Perímetro:</b> Es la medida de TODO el borde. ¡Para calcularlo debes <b>sumar</b> todos sus lados!",
        "<b>Área:</b> Es la medida del relleno interior. En cuadrados o rectángulos se calcula <b>multiplicando la Base por la Altura</b>."
      ]
    },
    estadistica: {
      title: "💡 Moda, Media, Mediana y Frecuencias (5º Grado)",
      desc: "Usa el selector \"Elige el tema\" arriba del ejercicio para practicar Moda, Media, Mediana o Frecuencia por separado, o deja \"Variado\" para que se mezclen.",
      tips: [
        "<b>Moda:</b> Piensa en 'estar a la moda'. Es simplemente el número que <b>MÁS se repite</b> en todo el grupo. No hay que sumar ni ordenar nada, solo contar repeticiones.",
        "<b>Media (Promedio):</b> Repartir en partes iguales. <b>Suma</b> todos los números y luego <b>divide</b> ese resultado entre la cantidad total de números que sumaste.",
        "<b>Mediana:</b> Primero <b>ordena</b> los números de menor a mayor (¡este paso es clave, si no ordenas te vas a equivocar!). Luego busca el que quedó justo en el <b>medio</b>.",
        "<b>¿Cómo no confundirlas?</b> Moda = el que MÁS se repite. Media = el promedio (sumar y dividir). Mediana = el que queda en el CENTRO al ordenar.",
        "<b>Frecuencia Absoluta/Relativa/Porcentual:</b> Es contar respuestas de una encuesta y expresarlas como conteo, fracción decimal (fa ÷ total) o porcentaje (× 100).",
        "<b>Dato de emprendedora:</b> Si vendieras paletas y quieres saber qué sabor pedir más, la Moda te lo dice: ¡el que más se repite en los pedidos! 🍭"
      ]
    },
    inecuaciones: {
      title: "💡 Inecuaciones y Desigualdades (11º Grado)",
      desc: "A diferencia de las ecuaciones, las inecuaciones no tienen un solo resultado, ¡tienen infinitos! Por eso representamos sus respuestas usando <b>Intervalos</b>.",
      tips: [
        "<b>Los Símbolos:</b> <b><</b> (menor que), <b>></b> (mayor que), <b>≤</b> (menor o igual que), <b>≥</b> (mayor o igual que).",
        "<b>Regla de Oro:</b> Si pasas multiplicando o dividiendo una cantidad <b>NEGATIVA</b> a ambos lados, la desigualdad <b>SE INVIERTE</b> (ej: de < a >).",
        "<b>Abiertos ( ) :</b> Usan <b>></b> o <b><</b>. En la gráfica es una bolita vacía. El número <b>NO</b> se incluye.",
        "<b>Cerrados [ ] :</b> Usan <b>≥</b> o <b>≤</b>. En la gráfica es una bolita llena. El número <b>SÍ</b> se incluye.",
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
    probabilidad: {
      title: "💡 Probabilidad Simple (11º Grado)",
      desc: "Es el estudio matemático que estima la posibilidad de que un suceso ocurra.",
      tips: [
        "<b>Fórmula principal:</b> P(A) = Casos Favorables (CF) ÷ Casos Posibles (CP).",
        "<b>Casos Favorables:</b> Es lo que buscas (Ej. sacar una bola negra).",
        "<b>Casos Posibles:</b> Es el total absoluto (Ej. TODAS las bolas en la bolsa).",
        "<b>En Porcentaje:</b> Si te piden porcentaje (%), solo debes resolver la división y luego multiplicar el resultado por 100."
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
    },
    favoritos: {
      title: "💡 My / His / Her Favorite (5º Grado)",
      desc: "Aprende a decir cuáles son tus cosas favoritas usando los posesivos correctos: My, His y Her.",
      tips: [
        "<b>My:</b> Para hablar de <b>ti</b> (yo). Ej: <i>My favorite color is red.</i>",
        "<b>His:</b> Para hablar de <b>un niño</b> o hombre. Ej: <i>His favorite animal is a cat.</i>",
        "<b>Her:</b> Para hablar de <b>una niña</b> o mujer. Ej: <i>Her favorite food is pizza.</i>",
        "<b>Orden:</b> La palabra <i>favorite</i> va antes de la categoría: <i>favorite color</i>, no <i>color favorite</i>."
      ]
    },
    precolombinas: {
      title: "💡 Culturas Precolombinas (5º Grado)",
      desc: "Antes de la llegada de Colón, América estaba habitada por grandes imperios con culturas increíbles.",
      tips: [
        "<b>Los Mayas 🌽:</b> Ubicados en Centroamérica y el sur de México. Eran grandes astrónomos y matemáticos (¡inventaron el cero!). Construyeron pirámides como Chichén Itzá.",
        "<b>Los Aztecas 🦅:</b> Vivieron en el centro de México. Grandes guerreros que cultivaban en islas flotantes (chinampas) y fundaron Tenochtitlán.",
        "<b>Los Incas 🦙:</b> Dominaron los Andes en Sudamérica. Construyeron caminos increíbles, Machu Picchu y usaban nudos (quipus) para llevar mensajes y contar."
      ]
    },
    textos: {
      title: "💡 Oraciones Simples y Compuestas (5º Grado)",
      desc: "Para saber si una oración es simple o compuesta, lo único que tienes que hacer es encontrar y contar los verbos (las acciones).",
      tips: [
        "<b>El verbo</b> es la palabra que dice qué hace alguien o algo: <i>tenía, miró, saluda, corre, vende</i>. Primero enciérralos.",
        "<b>Simple = 1 verbo:</b> \"Tío Conejo <b>tenía</b> hambre.\" Una sola acción.",
        "<b>Compuesta = 2 o más verbos:</b> \"El profesor <b>llega</b> temprano y <b>saluda</b> a los niños.\" Dos acciones unidas por un nexo.",
        "<b>Los nexos</b> unen las partes de una compuesta: <b>y, pero, porque, mientras, que, pues, cuando, aunque, hasta que, por donde</b>. Si ves uno, busca el otro verbo.",
        "<b>¡Ojo!</b> Larga no es lo mismo que compuesta: \"La lluvia cayó fuerte durante toda la tarde\" es larga pero tiene un solo verbo → simple.",
        "<b>¡Ojo 2!</b> Se cuentan los verbos <b>conjugados</b>. Un infinitivo (termina en -ar, -er, -ir) que acompaña a otro verbo no se cuenta aparte: \"decidió <i>cercarlo</i>\" es una sola acción.",
        "<b>Para sustentar:</b> \"Es compuesta porque tiene dos verbos, <i>llega</i> y <i>saluda</i>, unidos por el nexo <i>y</i>.\""
      ]
    },
    refranes: {
      title: "💡 Refranes y Dichos Populares (5º Grado)",
      desc: "Un refrán es un dicho popular y corto que enseña una lección — pero casi nunca hay que entenderlo literalmente (al pie de la letra), sino buscar su significado real.",
      tips: [
        "<b>No es literal:</b> \"Camarón que se duerme, se lo lleva la corriente\" no habla de camarones de verdad — habla de estar atento para no perder oportunidades.",
        "<b>Compáralos:</b> Cuando dudes entre dos significados parecidos, busca la diferencia clave: ¿de qué habla CADA refrán exactamente?",
        "<b>Piensa en la situación:</b> Un refrán se usa para describir algo que pasa en la vida real. Pregúntate: ¿en qué momento alguien diría esto?",
        "<b>Vienen de la tradición oral:</b> Se transmiten de generación en generación, hablando — por eso a veces cambian un poco de una región a otra.",
        "<b>Para completarlos:</b> Tienen dos partes que riman o se conectan (\"Perro que ladra... no muerde\"). Busca el final que tenga sentido con el inicio.",
        "<b>Para sustentar:</b> Di el refrán, aclara que no es literal, explica la enseñanza (\"significa que...\") y da un ejemplo de la vida real."
      ]
    },
    guion: {
      title: "💡 El Guion Teatral (5º Grado)",
      desc: "Un guion o libreto es un texto escrito para ser ACTUADO: en vez de contar la historia, la escribe en diálogos y acotaciones para los actores.",
      tips: [
        "<b>Diálogo:</b> lo que dice cada personaje. Se escribe <b>Nombre:</b> y luego sus palabras. Ej: <i>Mujer: Viejo, ¿no puedes trabajar más rápido?</i>",
        "<b>Acotación:</b> va entre <b>paréntesis</b> y le dice al actor cómo actuar o cómo es el escenario. Ej: <i>(Sonriendo.)</i> — ¡no se dice en voz alta!",
        "<b>Narrador:</b> cuenta lo que pasa sin ser un personaje de la escena.",
        "<b>Escena:</b> cada parte de la obra; cambia cuando cambia el lugar o el momento. El taller pide dividir la historia en 3.",
        "<b>Ambiente:</b> época, clima, lugar y paisaje donde ocurre la historia. Se describe antes de escribir los diálogos.",
        "<b>Para escribir un libreto:</b> 1) elige la historia, 2) describe el ambiente, 3) identifica los personajes, 4) divide en escenas, 5) escribe los diálogos."
      ]
    }
  },

  init: function () {
    this.initUser();
    this.setView("landing");
    var self = this;
    window.addEventListener("pagehide", function () {
      if (self.sessionTopic && self.sessionStart) {
        var now = Date.now();
        var seconds = Math.round((now - self.sessionStart) / 1000);
        var topicData = null;
        if (self.grade && self.subject && self.topic && self.curriculum[self.grade] && self.curriculum[self.grade][self.subject]) {
          topicData = self.curriculum[self.grade][self.subject].find(function (t) { return t.id === self.topic; }) || null;
        }
        if (typeof Tracking !== "undefined" && Tracking.sendBeacon) {
          Tracking.sendBeacon("topic_session", {
            sessionId: self.sessionId,
            user: self.user,
            grade: self.grade,
            subject: self.subject,
            topic: self.topic,
            topicName: topicData ? topicData.name : null,
            startedAt: new Date(self.sessionStart).toISOString(),
            endedAt: new Date(now).toISOString(),
            seconds: seconds,
            reason: "cerrar_pestana_o_salir"
          });
        }
      }
    });
  },

  initUser: function () {
    var modal = document.getElementById("user-modal");
    if (modal) modal.classList.remove("hidden-el");
  },

  setUser: function (id) {
    var map = {
      mapache: { name: "Valeria", avatar: "🦝" },
      zorro: { name: "Sofía", avatar: "🦊" }
    };
    var info = map[id] || { name: "Invitado", avatar: "🙂" };
    this.user = {
      id: id,
      name: info.name,
      avatar: info.avatar
    };
    this.sessionId = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
    var modal = document.getElementById("user-modal");
    if (modal) modal.classList.add("hidden-el");
    this.logEvent("login", { reason: "select_avatar" });
    // Sofía va directo a sus materias — sin pasar por el selector de grado
    if (id === "zorro") {
      var self = this;
      this.showToast("Cargando tu progreso en la nube…", "☁️", 2000);
      this.Stats.load().then(function () {
        self.selectGrade("5");
      });
    }
  },

  logEvent: function (type, extra) {
    if (typeof Tracking === "undefined" || !Tracking || typeof Tracking.send !== "function") return;
    var topicData = null;
    if (this.grade && this.subject && this.topic &&
        this.curriculum[this.grade] &&
        this.curriculum[this.grade][this.subject]) {
      topicData = this.curriculum[this.grade][this.subject].find(function (t) { return t.id === App.topic; }) || null;
    }
    Tracking.send(type, {
      sessionId: this.sessionId,
      user: this.user,
      grade: this.grade,
      subject: this.subject,
      topic: this.topic,
      topicName: topicData ? topicData.name : null,
      startedAt: extra && extra.startedAt || null,
      endedAt: extra && extra.endedAt || null,
      seconds: extra && extra.seconds != null ? extra.seconds : null,
      reason: extra && extra.reason || null,
      extra: extra || null
    });
  },

  endSession: function (reason) {
    if (!this.sessionTopic || !this.sessionStart) return;
    var now = Date.now();
    var seconds = Math.round((now - this.sessionStart) / 1000);
    this.logEvent("topic_session", {
      startedAt: new Date(this.sessionStart).toISOString(),
      endedAt: new Date(now).toISOString(),
      seconds: seconds,
      reason: reason || "end"
    });
    this.sessionTopic = null;
    this.sessionStart = null;
  },

  setView: function (viewName) {
    if (this.view === "game" && viewName !== "game") {
      this.endSession("leave_view_" + viewName);
      this.Timer.hide();
      var pistaBtn = document.getElementById("sofia-pista-btn");
      if (pistaBtn) pistaBtn.classList.add("hidden-el");
    }
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

    var isSofia = this.user && this.user.id === "zorro";
    if (isSofia && gradeId === "5") {
      document.getElementById("subjects-title").innerHTML =
        "¡Hola <span class=\"text-yellow-300\">Sofía</span>! ¿Con qué arrancamos hoy?";
    } else {
      document.getElementById("subjects-title").innerHTML =
        "¿Qué quieres aprender en <span class=\"text-yellow-300\">" + gradeId + "º Grado</span>?";
    }

    var subjectsContainer = document.getElementById("subject-buttons");
    subjectsContainer.innerHTML = "";
    var availableSubjects = Object.keys(this.curriculum[gradeId] || {});

    // Para Sofía en grado 5: orden con la materia más exigente primero
    if (isSofia && gradeId === "5") {
      var sofiaOrder = ["matematicas", "espanol", "historia", "ingles"];
      availableSubjects = sofiaOrder.filter(function (s) {
        return availableSubjects.indexOf(s) !== -1;
      }).concat(availableSubjects.filter(function (s) {
        return sofiaOrder.indexOf(s) === -1;
      }));
    }

    if (availableSubjects.length === 0) {
      subjectsContainer.innerHTML = "<p class=\"text-white text-2xl font-bold bg-indigo-900/50 p-6 rounded-3xl\">Próximamente agregaremos materias para este grado. ¡Vuelve pronto!</p>";
    } else {
      var self = this;
      availableSubjects.forEach(function (subjKey, index) {
        var style = self.subjectStyles[subjKey];
        if (!style || !style.theme) return;
        var btn = document.createElement("button");
        btn.onclick = function () { self.selectSubject(subjKey); };
        btn.className = "flex-1 border-b-[10px] rounded-[2rem] p-4 sm:p-6 md:p-8 transition-all transform hover:-translate-y-2 active:translate-y-1 active:border-b-4 group cursor-pointer shadow-2xl flex flex-col items-center min-w-[140px] sm:min-w-[180px] max-w-[300px] w-full mx-auto " + style.theme;
        btn.innerHTML = "<div class=\"text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-3 md:mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform\">" + style.icon + "</div><h3 class=\"text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-center leading-tight w-full tracking-tight px-1\">" + style.name + "</h3>";
        // Insignia "Para empezar" en la primera materia de Sofía
        if (isSofia && gradeId === "5" && index === 0) {
          btn.innerHTML += "<div class=\"mt-3 text-xs bg-yellow-400 text-yellow-900 font-black px-3 py-1 rounded-full\">⭐ Para empezar hoy</div>";
        }
        subjectsContainer.appendChild(btn);
      });
    }
    this.setView("subjects");

    // Streak, puntos y prompt de elección — solo Sofía
    var streakCard   = document.getElementById("sofia-streak-card");
    var choicePrompt = document.getElementById("sofia-choice-prompt");
    if (isSofia && gradeId === "5") {
      this.updateStreakUI();
      if (choicePrompt) choicePrompt.classList.remove("hidden-el");
    } else {
      if (streakCard)   streakCard.classList.add("hidden-el");
      if (choicePrompt) choicePrompt.classList.add("hidden-el");
    }
  },

  selectSubject: function (subjectId) {
    this.subject = subjectId;
    var style = this.subjectStyles[subjectId];
    document.getElementById("topics-subtitle").innerHTML = style.icon + " " + style.name;
    this.renderTopics();
    this.setView("topics");
  },

  selectTopic: function (topicId) {
    if (this.topic) {
      this.endSession("change_topic");
    }
    this.topic = topicId;
    var style = this.subjectStyles[this.subject];
    var topicData = this.curriculum[this.grade][this.subject].find(function (t) { return t.id === topicId; });

    var headerEl = document.getElementById("game-header-title");
    var headerColorClass = style.headerColor || "text-slate-700";
    headerEl.className = "text-lg md:text-2xl font-black text-center flex-1 " + headerColorClass;
    headerEl.innerHTML = "<span class=\"opacity-60 hidden md:inline\">" + style.icon + " " + style.name + "</span> <span class=\"mx-1 hidden md:inline opacity-50\">👉</span> <span class=\"text-slate-800\">" + topicData.icon + " " + topicData.name + "</span>";

    this.sessionTopic = {
      grade: this.grade,
      subject: this.subject,
      topic: this.topic
    };
    this.sessionStart = Date.now();
    this.logEvent("topic_open", {
      startedAt: new Date(this.sessionStart).toISOString()
    });

    // Cada tema arranca en Fácil: el nivel elegido en otro tema no se "hereda"
    // en silencio (una niña que puso Difícil en Ecuaciones no debe caer en
    // Difícil de Radicación sin darse cuenta).
    this.level = "facil";
    document.querySelectorAll(".lvl-btn").forEach(function (b) { b.classList.remove("ring-4", "ring-white", "scale-110"); });
    var facilBtn = document.getElementById("btn-facil");
    if (facilBtn) facilBtn.classList.add("ring-4", "ring-white", "scale-110");

    this.generateContent();
    this.setView("game");

    // Timer, pista, andamiaje y sesión — solo para Sofía
    if (this.user && this.user.id === "zorro") {
      this.Timer.start();
      this.Scaffold.reset();
      this.Stats.resetSessionCorrect();
      this.Stats.ensureMonth();
      this.updatePointsUI();
      var pistaBtn = document.getElementById("sofia-pista-btn");
      if (pistaBtn) pistaBtn.classList.remove("hidden-el");
      var gamePts = document.getElementById("sofia-game-points");
      if (gamePts) gamePts.classList.remove("hidden-el");
    } else {
      var gamePtsHide = document.getElementById("sofia-game-points");
      if (gamePtsHide) gamePtsHide.classList.add("hidden-el");
    }
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

  // --- Tutorial paso a paso (modal) ---
  showExample: function () {
    var container = document.getElementById("example-content");
    if (!container) {
      // Si el modal aún no existe en el DOM, no rompemos nada
      App.updateTeacher("Paso a paso en construcción", "Pronto tendrás un tutorial guiado para este tema. Mientras tanto, sigue las indicaciones del profesor mágico. ✨");
      return;
    }
    container.innerHTML = "";

    if (this.topic === "ecuaciones" && typeof EqGame !== "undefined" && typeof EqGame.showExample === "function") {
      EqGame.showExample(container);
    } else if (this.topic === "polinomios" && typeof PolyGame !== "undefined" && typeof PolyGame.showExample === "function") {
      PolyGame.showExample(container);
    } else if (this.topic === "potencias" && typeof PowerGame !== "undefined" && typeof PowerGame.showExample === "function") {
      PowerGame.showExample(container);
    } else if (this.topic === "radicacion" && typeof RadicationGame !== "undefined" && typeof RadicationGame.showExample === "function") {
      RadicationGame.showExample(container);
    } else if (this.topic === "fracciones" && typeof FracGame !== "undefined" && typeof FracGame.showExample === "function") {
      FracGame.showExample(container);
    } else if (this.topic === "geometria" && typeof GeoGame !== "undefined" && typeof GeoGame.showExample === "function") {
      GeoGame.showExample(container);
    } else if (this.topic === "estadistica" && typeof StatGame !== "undefined" && typeof StatGame.showExample === "function") {
      StatGame.showExample(container);
    } else if (this.topic === "probabilidad" && typeof ProbGame !== "undefined" && typeof ProbGame.showExample === "function") {
      ProbGame.showExample(container);
    } else if (this.topic === "inecuaciones" && typeof IneqGame !== "undefined" && typeof IneqGame.showExample === "function") {
      IneqGame.showExample(container);
    } else if (this.topic === "circuitos" && typeof CircuitGame !== "undefined" && typeof CircuitGame.showExample === "function") {
      CircuitGame.showExample(container);
    } else if (this.topic === "balanceo" && typeof ChemGame !== "undefined" && typeof ChemGame.showExample === "function") {
      ChemGame.showExample(container);
    } else if (this.topic === "vocabulario" && typeof EnglishGame !== "undefined" && typeof EnglishGame.showExample === "function") {
      EnglishGame.showExample(container);
    } else if (this.topic === "favoritos" && typeof FavoritesGame !== "undefined" && typeof FavoritesGame.showExample === "function") {
      FavoritesGame.showExample(container);
    } else if (this.topic === "precolombinas" && typeof HistoryGame !== "undefined" && typeof HistoryGame.showExample === "function") {
      HistoryGame.showExample(container);
    } else if (this.topic === "textos" && typeof TextGame !== "undefined" && typeof TextGame.showExample === "function") {
      TextGame.showExample(container);
    } else if (this.topic === "refranes" && typeof RefranGame !== "undefined" && typeof RefranGame.showExample === "function") {
      RefranGame.showExample(container);
    } else if (this.topic === "guion" && typeof GuionGame !== "undefined" && typeof GuionGame.showExample === "function") {
      GuionGame.showExample(container);
    } else {
      container.innerHTML = "<p class=\"text-slate-500\">El paso a paso para este ejercicio está en construcción.</p>";
    }

    var modal = document.getElementById("example-modal");
    if (modal) modal.classList.remove("hidden-el");
    // El modal vive DENTRO del cuaderno (posición absoluta), así que su alto es
    // el del cuaderno. En celular el cuaderno puede medir solo 350 px y el
    // tutorial quedaba en una ventanita de dos líneas: aquí se le da altura
    // suficiente mientras está abierto y se lleva a la vista.
    var notebook = document.querySelector("#view-game main.notebook");
    if (notebook) {
      notebook.style.minHeight = Math.max(notebook.offsetHeight, Math.round(window.innerHeight * 0.8)) + "px";
      try { notebook.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) { notebook.scrollIntoView(); }
    }
  },

  hideExample: function () {
    var modal = document.getElementById("example-modal");
    if (modal) modal.classList.add("hidden-el");
    var notebook = document.querySelector("#view-game main.notebook");
    if (notebook) notebook.style.minHeight = "";
  },

  generateContent: function () {
    this.exercisePointsAwarded = false;
    document.getElementById("lines-container").innerHTML = "";
    document.getElementById("success-area").classList.add("hidden-el");
    this.hideExample();
    this.updateTheory();

    if (typeof EqGame !== "undefined") EqGame.cleanup();
    if (typeof IneqGame !== "undefined") IneqGame.cleanup();
    if (typeof ChemGame !== "undefined") ChemGame.cleanup();
    if (typeof PolyGame !== "undefined") PolyGame.cleanup && PolyGame.cleanup();
    if (typeof PowerGame !== "undefined") PowerGame.cleanup && PowerGame.cleanup();
    if (typeof RadicationGame !== "undefined") RadicationGame.cleanup && RadicationGame.cleanup();
    if (typeof FracGame !== "undefined") FracGame.cleanup && FracGame.cleanup();
    if (typeof GeoGame !== "undefined") GeoGame.cleanup && GeoGame.cleanup();
    if (typeof StatGame !== "undefined") StatGame.cleanup && StatGame.cleanup();
    if (typeof ProbGame !== "undefined") ProbGame.cleanup && ProbGame.cleanup();
    if (typeof CircuitGame !== "undefined") CircuitGame.cleanup && CircuitGame.cleanup();
    if (typeof EnglishGame !== "undefined") EnglishGame.cleanup && EnglishGame.cleanup();
    if (typeof FavoritesGame !== "undefined") FavoritesGame.cleanup && FavoritesGame.cleanup();
    if (typeof HistoryGame !== "undefined") HistoryGame.cleanup && HistoryGame.cleanup();
    if (typeof TextGame !== "undefined") TextGame.cleanup && TextGame.cleanup();
    if (typeof RefranGame !== "undefined") RefranGame.cleanup && RefranGame.cleanup();
    if (typeof GuionGame !== "undefined") GuionGame.cleanup && GuionGame.cleanup();

    document.getElementById("game-content").classList.remove("hidden-el");
    document.getElementById("coming-soon-area").classList.add("hidden-el");

    var statTypeSelector = document.getElementById("stat-type-selector");
    if (statTypeSelector) {
      if (this.topic === "estadistica") {
        statTypeSelector.classList.remove("hidden-el");
        if (typeof StatGame !== "undefined" && StatGame.renderTypeSelectorState) StatGame.renderTypeSelectorState();
      } else {
        statTypeSelector.classList.add("hidden-el");
      }
    }

    if (this.topic === "ecuaciones") EqGame.start(this.level);
    else if (this.topic === "polinomios") PolyGame.start(this.level);
    else if (this.topic === "potencias") PowerGame.start(this.level);
    else if (this.topic === "radicacion") RadicationGame.start(this.level);
    else if (this.topic === "fracciones") FracGame.start(this.level);
    else if (this.topic === "geometria") GeoGame.start(this.level);
    else if (this.topic === "estadistica") StatGame.start(this.level);
    else if (this.topic === "probabilidad") ProbGame.start(this.level);
    else if (this.topic === "inecuaciones") IneqGame.start(this.level);
    else if (this.topic === "circuitos") CircuitGame.start(this.level);
    else if (this.topic === "balanceo") ChemGame.start(this.level);
    else if (this.topic === "vocabulario") EnglishGame.start(this.level);
    else if (this.topic === "favoritos") FavoritesGame.start(this.level);
    else if (this.topic === "precolombinas") HistoryGame.start(this.level);
    else if (this.topic === "textos") TextGame.start(this.level);
    else if (this.topic === "refranes") RefranGame.start(this.level);
    else if (this.topic === "guion") GuionGame.start(this.level);
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

    // Sin clave de IA no hay pista mágica: se dice claro y se sugiere el Paso a Paso,
    // sin dejar el botón bloqueado ni hacer esperar.
    if (typeof GeminiAPI !== "undefined" && GeminiAPI.isConfigured && !GeminiAPI.isConfigured()) {
      this.updateTeacher("El tutor mágico está desconectado", "Hoy no hay pista de IA, pero puedes abrir <b>📖 Ver Paso a Paso</b>: ahí está la explicación con tu ejercicio. ✨", "🧙‍♂️");
      return;
    }

    this.updateTeacher("✨ Gemini pensando...", "Analizando tu misión para darte una pista mágica...", "⏳");
    btn.disabled = true;
    btn.classList.add("opacity-50", "cursor-not-allowed", "animate-pulse");

    var self = this;
    var releaseBtn = function () {
      btn.disabled = false;
      btn.classList.remove("opacity-50", "cursor-not-allowed", "animate-pulse");
    };

    var prompt = "";
    try {
      prompt = this._buildHintPrompt();
    } catch (e) {
      // Si el juego todavía no tiene ejercicio (p. ej. Inglés esperando a la IA),
      // no se deja el botón muerto: se avisa y se libera.
      console.warn("[CuadernoMagico] pista sin ejercicio listo:", e && e.message ? e.message : e);
      prompt = "";
    }
    if (!prompt) {
      this.updateTeacher("Un momento…", "El ejercicio todavía se está preparando. Inténtalo en unos segundos. ✨", "⏳");
      releaseBtn();
      return;
    }

    GeminiAPI.fetchText(prompt)
      .then(function (hint) {
        self.updateTeacher("✨ Pista de Gemini:", hint, "🧞‍♂️");
      })
      .catch(function () {
        self.updateTeacher("❌ Ups", "Mis poderes de IA fallaron un momento. ¡Sigue intentándolo!", "🧙‍♂️");
        setTimeout(function () { self.updateTeacher(originalTitle, originalText, originalEmoji); }, 3000);
      })
      .then(releaseBtn);
  },

  // Todos los prompts hablan de "la estudiante": la app la usan niñas.
  _buildHintPrompt: function () {
    var prompt = "";
    if (this.topic === "ecuaciones") {
      var eqStr = EqGame.eq.op + " " + EqGame.eq.val + " = " + EqGame.eq.res;
      prompt = "Eres un tutor infantil mágico de matemáticas. La estudiante (una niña de 5º) está intentando despejar la X en la ecuación: X " + eqStr + ". Dale una pista corta (1-2 oraciones como máximo) y divertida usando analogías de equilibrio o magia, sin decirle el resultado exacto ni decirle cómo hacerlo directamente. Anímala, en femenino.";
    } else if (this.topic === "polinomios") {
      prompt = "Eres un tutor infantil mágico. La estudiante (una niña de 5º) está resolviendo un polinomio y tiene que decidir qué operación resolver primero según la jerarquía de operaciones (paréntesis, luego multiplicaciones y divisiones, luego sumas y restas, y de izquierda a derecha si son del mismo nivel). Dale una pequeña pista o recordatorio (máximo 2 oraciones) sobre quiénes son los \"reyes\" o las operaciones más fuertes, de forma divertida, sin resolver el problema por ella.";
    } else if (this.topic === "potencias") {
      prompt = "Eres un tutor matemático divertido. La estudiante (una niña de 5º) calcula " + PowerGame.eq.base + " elevado a la " + PowerGame.eq.exp + ". Recuérdale con una analogía que no debe multiplicar " + PowerGame.eq.base + " × " + PowerGame.eq.exp + ", sino multiplicar la base por sí misma. Máximo 2 oraciones, en femenino.";
    } else if (this.topic === "radicacion") {
      prompt = "Eres un tutor matemático divertido. La estudiante (una niña de 5º) busca la raíz de índice " + RadicationGame.eq.index + " del número " + RadicationGame.eq.radicand + " (es decir, qué número multiplicado por sí mismo " + RadicationGame.eq.index + " veces da " + RadicationGame.eq.radicand + "). Dale una pista corta (máximo 2 oraciones) recordándole que NO es una división entre el índice, sino el truco inverso de una potencia; puedes sugerirle ir probando números pequeños multiplicados por sí mismos. No des el resultado.";
    } else if (this.topic === "fracciones") {
      var fStr = FracGame.eq.n1 + "/" + FracGame.eq.d1 + " " + FracGame.eq.op + " " + FracGame.eq.n2 + "/" + FracGame.eq.d2;
      prompt = "Eres un tutor infantil matemático. El estudiante suma/resta la fracción: " + fStr + ". Dale una pista mágica (máximo 2 oraciones) indicando qué hacer con los denominadores (abajo) o numeradores (arriba). NO resuelvas la cuenta numérica.";
    } else if (this.topic === "geometria") {
      prompt = "Eres un tutor matemático mágico. La estudiante (una niña de 5º) calcula el " + GeoGame.eq.target + " de un " + GeoGame.eq.type + " de " + GeoGame.eq.w + " por " + GeoGame.eq.h + " cm. Dale una pista recordando en qué consiste el perímetro (borde) o área (relleno) sin decirle la respuesta numérica. Máximo 2 oraciones, en femenino.";
    } else if (this.topic === "estadistica") {
      var statEq = StatGame.eq;
      if (statEq.kind === "medida") {
        prompt = "Eres un tutor estadístico infantil. El estudiante debe hallar la " + statEq.type + " de los números: " + statEq.nums.join(", ") + ". Dale una pista recordando la definición de esa métrica sin darle la respuesta. Máximo 2 oraciones.";
      } else if (statEq.kind === "frecuencia") {
        var freqAskDesc = statEq.askType === "absoluta"
          ? "la Frecuencia Absoluta (contar cuántas veces aparece en la lista de respuestas)"
          : statEq.askType === "relativa"
            ? "la Frecuencia Relativa (dividir la Frecuencia Absoluta entre el Total de encuestados, que es " + statEq.total + ")"
            : "la Frecuencia Porcentual (multiplicar la Frecuencia Relativa por 100, o Absoluta ÷ Total × 100)";
        prompt = "Eres un tutor estadístico infantil. El estudiante debe hallar " + freqAskDesc + " del símbolo " + statEq.icons[statEq.blankIdx] + " en una tabla de frecuencias. Dale una pista corta recordando CÓMO se calcula (la fórmula), sin darle el número exacto. Máximo 2 oraciones.";
      } else {
        prompt = "Eres un tutor estadístico infantil. El estudiante debe leer un diagrama de barras sobre '" + statEq.label + "' y responder " + (statEq.askTotal ? "cuántos encuestados hay en total, sumando todas las barras" : "cuántos votos tiene " + statEq.icons[statEq.askIdx] + ", leyendo la altura de su barra") + ". Dale una pista sin decirle el número exacto. Máximo 2 oraciones.";
      }
    } else if (this.topic === "probabilidad") {
      prompt = "Eres un tutor de estadística. La estudiante (grado 11) calcula la probabilidad de " + ProbGame.eq.desc + ". Dale una pequeña pista recordando que la fórmula es Casos Favorables dividido entre Casos Posibles. Máximo 2 oraciones. NO des el resultado.";
    } else if (this.topic === "inecuaciones") {
      var ineqStr = IneqGame.eq.op + " " + IneqGame.eq.val + " " + IneqGame.eq.sign + " " + IneqGame.eq.res;
      var ineqPhase = IneqGame.step === 2 ? "Ya despejó y está eligiendo el intervalo: recuérdale cómo traducir los signos >, <, ≥, ≤ a paréntesis o corchetes (el infinito siempre lleva paréntesis)." : "Está en la fase de despejar. Si el valor que acompaña a la X está multiplicando y es NEGATIVO, recuérdale sutilmente la regla de oro de invertir la desigualdad.";
      prompt = "Eres un profesor experto de matemáticas para grado 11. La estudiante está resolviendo la inecuación lineal: X " + ineqStr + ". " + ineqPhase + " Dale una pista breve (máximo 2 oraciones), sin dar la respuesta.";
    } else if (this.topic === "circuitos") {
      var circuitStr = (CircuitGame.tokens || []).join(" ");
      prompt = "Eres un profesor de tecnología muy creativo. La estudiante (grado 11) resuelve este circuito lógico con compuertas booleanas (Y = AND, O = OR, NO = NOT): " + circuitStr + ". Explica muy brevemente (máximo 2 oraciones) el secreto para resolver la compuerta que aparece en ese circuito usando una analogía cotidiana, para que deduzca qué pasa con los unos y ceros. No des el resultado.";
    } else if (this.topic === "balanceo") {
      prompt = "Eres un profesor de química. La estudiante está balanceando esta ecuación: " + ChemGame.getEquationString() + ". Ayúdala con una pista muy sutil en ESPAÑOL (máximo 2 oraciones). Dile qué elemento o átomo debería revisar o ajustar primero (recuerda que el Oxígeno e Hidrógeno se dejan para el final) sin darle los coeficientes exactos de la respuesta.";
    } else if (this.topic === "vocabulario") {
      if (!EnglishGame.currentWord) return "";
      prompt = "Eres un tutor de inglés. La estudiante (una niña de 5º) debe adivinar la palabra en inglés: \"" + EnglishGame.currentWord.en + "\". Dale una pista divertida en ESPAÑOL describiendo qué es, su color, un sonido que hace o dónde se encuentra, para que pueda deducir su traducción. Máximo 2 oraciones. NO uses la traducción al español explícita en tu respuesta.";
    } else if (this.topic === "favoritos") {
      var esSentence = "";
      if (typeof FavoritesGame !== "undefined" && FavoritesGame.eq && FavoritesGame.eq.es) esSentence = FavoritesGame.eq.es;
      prompt =
        "Eres un tutor de inglés. La estudiante (una niña de 5º) intenta traducir: \"" + esSentence + "\" al inglés usando My/His/Her y la estructura correcta con 'favorite'. " +
        "Dale una pista corta (máximo 2 oraciones) sobre qué posesivo usar según el contexto (My/His/Her) y recuerda el orden de 'favorite <categoria>' sin decir la respuesta exacta.";
    } else if (this.topic === "precolombinas") {
      prompt =
        "Eres un profesor de historia divertido. La estudiante (una niña de 5º) debe adivinar si el dato \"" + HistoryGame.eq.fact + "\" pertenece a los Mayas, Incas o Aztecas. " +
        "Dale una pista corta (máximo 2 oraciones) sobre su ubicación geográfica o una característica famosa, sin decir la respuesta exacta.";
    } else if (this.topic === "textos") {
      var txtEq = TextGame.eq;
      if (txtEq.kind === "convertir") {
        prompt =
          "Eres un tutor de lenguaje para niños de 5º grado. El estudiante debe completar la oración \"" + txtEq.item.inicio + " ___\" eligiendo el final que la convierte en COMPUESTA (el que agrega otro verbo). " +
          "Dale una pista corta (máximo 2 oraciones) recordándole que una oración compuesta tiene dos o más verbos, sin decirle la respuesta.";
      } else {
        prompt =
          "Eres un tutor de lenguaje para niños de 5º grado. El estudiante debe decidir si la oración \"" + txtEq.item.text + "\" es simple (un verbo) o compuesta (dos o más verbos) y contar sus verbos. " +
          "Dale una pista corta (máximo 2 oraciones) sobre cómo encontrar los verbos (las acciones) y los nexos, sin decirle cuántos hay ni la respuesta.";
      }
    } else if (this.topic === "refranes") {
      var refEq = RefranGame.eq;
      var refFull = RefranGame.refranText(refEq.item);
      if (refEq.kind === "significado") {
        prompt =
          "Eres un tutor de lenguaje para niños. El estudiante debe descubrir el significado real (no literal) del refrán \"" + refFull + "\". " +
          "Dale una pista corta (máximo 2 oraciones) sobre la idea de fondo del refrán, sin decir el significado exacto.";
      } else if (refEq.kind === "completar") {
        prompt =
          "Eres un tutor de lenguaje para niños. El estudiante debe completar el refrán que empieza \"" + refEq.item.inicio + "\". " +
          "Dale una pista corta (máximo 2 oraciones) sobre la idea del refrán o con qué rima, sin decir el final exacto.";
      } else {
        prompt =
          "Eres un tutor de lenguaje para niños. El estudiante debe elegir qué refrán aplica a esta situación: \"" + refEq.item.situacion + "\". " +
          "Dale una pista corta (máximo 2 oraciones) sobre qué tema o lección busca (sin decir el refrán exacto).";
      }
    } else if (this.topic === "guion") {
      var gEq = GuionGame.eq;
      if (gEq.kind === "elemento") {
        prompt =
          "Eres un tutor de lenguaje para niños de 5º grado. El estudiante debe identificar qué parte de un guion teatral es este fragmento: \"" + gEq.item.text + "\" (diálogo, acotación, narrador, título o escena). " +
          "Dale una pista corta (máximo 2 oraciones) fijándote en la forma (paréntesis, nombre con dos puntos, la palabra Narrador o Escena), sin decir la respuesta.";
      } else if (gEq.kind === "concepto") {
        prompt =
          "Eres un tutor de lenguaje para niños de 5º grado. El estudiante debe responder sobre el guion teatral: \"" + gEq.item.q + "\". " +
          "Dale una pista corta (máximo 2 oraciones) usando el ejemplo de Los duendes y el zapatero, sin dar la respuesta completa.";
      } else {
        prompt =
          "Eres un tutor de lenguaje para niños de 5º grado. El estudiante debe convertir esta frase de un cuento en una línea de guion teatral: \"" + gEq.item.narrative + "\". " +
          "Dale una pista corta (máximo 2 oraciones) recordando el formato (Personaje: (acotación) diálogo en primera persona), sin escribir la línea completa.";
      }
    }
    return prompt;
  },

  triggerConfetti: function () {
    if (typeof triggerConfetti === "function") triggerConfetti();
  },

  // --- Economía de puntos (Sofía → tienda de premios, saldo acumulable) ---
  // Máx 200 pts/día con ejercicios · +1 al llegar a 100 y 200 (hasta 202/día) · canje en RewardsStore.
  PointsEconomy: {
    DAILY_CAP: 200,
    DAILY_META: 100,
    DAILY_BONUS_EVERY: 100,
    DAILY_BONUS_POINTS: 1,
    POINTS_PER_EXERCISE: 10,
    META_STREAK_DAYS_5: 5,
    META_STREAK_BONUS_5: 5,
    META_STREAK_DAYS_10: 10,
    META_STREAK_BONUS_10: 10,
    // Semana de repaso de los talleres de Español (decisión de Luis, 2026-09-07):
    // +1 extra por cada ejercicio de la materia Español y SIN tope diario de puntos,
    // ambos solo hasta el 10 de septiembre inclusive. Se apagan solos al día siguiente.
    SUBJECT_BONUS: { espanol: { pts: 1, until: "2026-09-10" } },
    UNCAPPED_UNTIL: "2026-09-10"
  },

  // --- Racha y puntos (Firestore) — exclusivo para Sofía (zorro) ---
  Stats: {
    PLAYER_ID: "zorro",
    K_SESS: "sofia_session_correct",
    _data: null,
    _loadPromise: null,
    _dirty: false,

    defaultData: function () {
      return {
        monthKey: "",
        balance: 0,
        monthEarned: 0,
        dailyPoints: 0,
        dailyDate: "",
        dailyExerciseCount: 0,
        dailyBonusesClaimed: [],
        metaDayStreak: 0,
        metaRewardMilestone: 0,
        metaAchievedDate: "",
        lastMetaStreakDate: "",
        streak: 0,
        lastDate: "",
        grace: 2,
        uncappedDate: "",
        rewardCatalog: [],
        redemptions: []
      };
    },

    _ensureData: function () {
      if (!this._data) this._data = this.defaultData();
    },

    load: function () {
      var self = this;
      if (this._loadPromise) return this._loadPromise;
      this._loadPromise = new Promise(function (resolve) {
        if (!FirebaseStats.isConfigured()) {
          self._hydrateFromLocalStorage();
          self.ensureMonth();
          resolve(self._data);
          return;
        }
        FirebaseStats.load(self.PLAYER_ID)
          .then(function (doc) {
            if (doc && (typeof doc.balance === "number" || typeof doc.monthPoints === "number")) {
              self._data = self._normalize(doc);
            } else {
              self._hydrateFromLocalStorage();
              self._dirty = true;
            }
            self.ensureMonth();
            if (typeof RewardsStore !== "undefined" && (!self._data.rewardCatalog || !self._data.rewardCatalog.length)) {
              RewardsStore.resetCatalogToDefaults();
              self._dirty = true;
            }
            return self.persist();
          })
          .then(function () {
            resolve(self._data);
          })
          .catch(function (err) {
            console.warn("[CuadernoMagico] Firestore load:", err);
            self._hydrateFromLocalStorage();
            self.ensureMonth();
            resolve(self._data);
          });
      });
      return this._loadPromise;
    },

    persist: function () {
      var self = this;
      this._ensureData();
      if (!FirebaseStats.isConfigured()) {
        this._saveToLocalStorage();
        return Promise.resolve();
      }
      if (!this._dirty) return Promise.resolve();
      return FirebaseStats.save(this.PLAYER_ID, this._data)
        .then(function () {
          self._dirty = false;
          self._clearLocalStorage();
        })
        .catch(function (err) {
          console.warn("[CuadernoMagico] Firestore save:", err);
          self._saveToLocalStorage();
        });
    },

    _normalize: function (doc) {
      var d = this.defaultData();
      d.monthKey = doc.monthKey || this.monthKey();
      d.balance = doc.balance != null ? parseInt(doc.balance, 10) || 0 : (parseInt(doc.monthPoints, 10) || 0);
      d.monthEarned = parseInt(doc.monthEarned, 10) || 0;
      d.dailyPoints = parseInt(doc.dailyPoints, 10) || 0;
      d.dailyDate = doc.dailyDate || "";
      d.dailyExerciseCount = parseInt(doc.dailyExerciseCount, 10) || 0;
      d.dailyBonusesClaimed = Array.isArray(doc.dailyBonusesClaimed)
        ? doc.dailyBonusesClaimed.map(function (x) { return parseInt(x, 10); }).filter(function (n) { return !isNaN(n); })
        : (doc.dailyTenBonusClaimed ? [100] : []);
      d.metaDayStreak = parseInt(doc.metaDayStreak, 10) || 0;
      d.metaRewardMilestone = parseInt(doc.metaRewardMilestone, 10) || 0;
      d.metaAchievedDate = doc.metaAchievedDate || "";
      d.lastMetaStreakDate = doc.lastMetaStreakDate || "";
      d.streak = parseInt(doc.streak, 10) || 0;
      d.lastDate = doc.lastDate || "";
      d.grace = doc.grace != null ? parseInt(doc.grace, 10) : 2;
      d.uncappedDate = doc.uncappedDate || "";
      d.rewardCatalog = Array.isArray(doc.rewardCatalog) ? doc.rewardCatalog : [];
      d.redemptions = Array.isArray(doc.redemptions) ? doc.redemptions : [];
      return d;
    },

    _hydrateFromLocalStorage: function () {
      var int = function (k, def) {
        var v = localStorage.getItem(k);
        return v === null ? def : parseInt(v, 10);
      };
      this._data = {
        monthKey: localStorage.getItem("sofia_month_key") || this.monthKey(),
        balance: int("sofia_balance", int("sofia_points", 0)),
        monthEarned: int("sofia_month_earned", 0),
        dailyPoints: int("sofia_daily_points", 0),
        dailyDate: localStorage.getItem("sofia_daily_date") || "",
        dailyExerciseCount: int("sofia_daily_exercise_count", 0),
        dailyBonusesClaimed: [],
        metaDayStreak: int("sofia_meta_day_streak", 0),
        metaRewardMilestone: 0,
        metaAchievedDate: "",
        lastMetaStreakDate: "",
        streak: int("sofia_streak", 0),
        lastDate: localStorage.getItem("sofia_last_date") || "",
        grace: int("sofia_grace", 2),
        uncappedDate: localStorage.getItem("sofia_uncapped_date") || "",
        rewardCatalog: [],
        redemptions: []
      };
      this._dirty = true;
    },

    _saveToLocalStorage: function () {
      var d = this._data;
      if (!d) return;
      localStorage.setItem("sofia_month_key", d.monthKey);
      localStorage.setItem("sofia_balance", String(d.balance || 0));
      localStorage.setItem("sofia_month_earned", String(d.monthEarned || 0));
      localStorage.setItem("sofia_points", String(d.balance || 0));
      localStorage.setItem("sofia_daily_points", String(d.dailyPoints));
      localStorage.setItem("sofia_daily_date", d.dailyDate);
      localStorage.setItem("sofia_daily_exercise_count", String(d.dailyExerciseCount || 0));
      localStorage.setItem("sofia_meta_day_streak", String(d.metaDayStreak || 0));
      localStorage.setItem("sofia_streak", String(d.streak));
      localStorage.setItem("sofia_last_date", d.lastDate);
      localStorage.setItem("sofia_grace", String(d.grace));
      localStorage.setItem("sofia_uncapped_date", d.uncappedDate || "");
    },

    _clearLocalStorage: function () {
      [
        "sofia_month_key", "sofia_balance", "sofia_month_earned", "sofia_points",
        "sofia_daily_points", "sofia_daily_date",
        "sofia_daily_exercise_count", "sofia_meta_day_streak", "sofia_streak",
        "sofia_last_date", "sofia_grace", "sofia_robux_delivered_month", "sofia_uncapped_date"
      ].forEach(function (k) { localStorage.removeItem(k); });
    },

    getStreak: function () {
      this._ensureData();
      return this._data.streak;
    },
    getBalance: function () {
      this._ensureData();
      this.ensureMonth();
      return this._data.balance || 0;
    },
    getPoints: function () {
      return this.getBalance();
    },
    getGrace: function () {
      this._ensureData();
      return this._data.grace;
    },

    // Quita el tope diario de puntos SOLO por hoy — se auto-desactiva mañana sin
    // que nadie tenga que acordarse de reactivar el tope (uncappedDate deja de
    // coincidir con todayStr() al cambiar el día).
    // Ventana configurada en código (PointsEconomy.UNCAPPED_UNTIL), aparte del toggle diario.
    isUncappedByWindow: function () {
      var until = App.PointsEconomy.UNCAPPED_UNTIL;
      return !!until && this.todayStr() <= until;
    },

    isUncappedToday: function () {
      this._ensureData();
      if (this.isUncappedByWindow()) return true;
      return !!this._data.uncappedDate && this._data.uncappedDate === this.todayStr();
    },

    setUncappedToday: function (enabled) {
      this._ensureData();
      this._data.uncappedDate = enabled ? this.todayStr() : "";
      this._dirty = true;
      this.persist();
    },

    monthKey: function () {
      var d = new Date();
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
    },

    ensureMonth: function () {
      this._ensureData();
      var key = this.monthKey();
      if (this._data.monthKey === key) return;
      if (this._data.monthKey) {
        this._data.monthEarned = 0;
        this._data.dailyPoints = 0;
        this._data.dailyDate = "";
        this._data.dailyExerciseCount = 0;
        this._data.dailyBonusesClaimed = [];
        this._data.metaAchievedDate = "";
        this._dirty = true;
      }
      this._data.monthKey = key;
      this._dirty = true;
    },

    yesterdayStr: function () {
      var d = new Date();
      d.setDate(d.getDate() - 1);
      return d.getFullYear() + "-" +
        String(d.getMonth() + 1).padStart(2, "0") + "-" +
        String(d.getDate()).padStart(2, "0");
    },

    _rollDailyIfNeeded: function (today) {
      this._ensureData();
      today = today || this.todayStr();
      if (this._data.dailyDate === today) return;

      var eco = App.PointsEconomy;
      if (this._data.dailyDate && (this._data.dailyPoints || 0) < eco.DAILY_META) {
        this._data.metaDayStreak = 0;
        this._data.metaRewardMilestone = 0;
        this._data.lastMetaStreakDate = "";
      }

      this._data.dailyDate = today;
      this._data.dailyPoints = 0;
      this._data.dailyExerciseCount = 0;
      this._data.dailyBonusesClaimed = [];
      this._data.metaAchievedDate = "";
      this._dirty = true;
    },

    getDailyPoints: function () {
      this._ensureData();
      this.ensureMonth();
      this._rollDailyIfNeeded();
      return this._data.dailyPoints;
    },

    getDailyExerciseCount: function () {
      this._ensureData();
      this._rollDailyIfNeeded();
      return this._data.dailyExerciseCount || 0;
    },

    addPoints: function (n, opts) {
      opts = opts || {};
      var towardCap = opts.towardCap !== false;
      this._ensureData();
      if (n <= 0) {
        return { total: this.getPoints(), added: 0, capped: false };
      }
      this.ensureMonth();
      this._rollDailyIfNeeded();

      var cap = App.PointsEconomy.DAILY_CAP;
      var daily = this._data.dailyPoints;
      var uncapped = this.isUncappedToday();
      var added;

      if (towardCap && !uncapped) {
        var room = cap - daily;
        if (room <= 0) {
          return { total: this._data.balance, added: 0, capped: true };
        }
        added = Math.min(n, room);
        this._data.dailyPoints = daily + added;
      } else {
        added = n;
        if (towardCap) this._data.dailyPoints = daily + added;
      }

      this._data.balance = (this._data.balance || 0) + added;
      this._data.monthEarned = (this._data.monthEarned || 0) + added;
      this._dirty = true;
      this.persist();
      return {
        total: this._data.balance,
        added: added,
        capped: towardCap && !uncapped && added < n
      };
    },

    _grantMetaDayStreakBonuses: function () {
      var eco = App.PointsEconomy;
      var today = this.todayStr();
      var awards = [];

      if (this._data.metaAchievedDate === today) return awards;

      var yesterday = this.yesterdayStr();
      if (this._data.lastMetaStreakDate === yesterday) {
        this._data.metaDayStreak = (this._data.metaDayStreak || 0) + 1;
      } else {
        this._data.metaDayStreak = 1;
      }
      this._data.lastMetaStreakDate = today;
      this._data.metaAchievedDate = today;
      this._dirty = true;

      var streak = this._data.metaDayStreak;
      if (streak >= eco.META_STREAK_DAYS_5 && this._data.metaRewardMilestone < 5) {
        awards.push({ pts: eco.META_STREAK_BONUS_5, label: "5 días con meta diaria" });
        this._data.metaRewardMilestone = 5;
      }
      if (streak >= eco.META_STREAK_DAYS_10 && this._data.metaRewardMilestone < 10) {
        awards.push({ pts: eco.META_STREAK_BONUS_10, label: "10 días con meta diaria" });
        this._data.metaRewardMilestone = 10;
      }
      this._dirty = true;
      return awards;
    },

    _dailyBonusMilestones: function () {
      var eco = App.PointsEconomy;
      return [eco.DAILY_BONUS_EVERY, eco.DAILY_CAP];
    },

    _grantDailyMilestoneBonuses: function () {
      var eco = App.PointsEconomy;
      var milestones = this._dailyBonusMilestones();
      var claimed = this._data.dailyBonusesClaimed || [];
      var awards = [];
      var daily = this._data.dailyPoints;

      for (var i = 0; i < milestones.length; i++) {
        var m = milestones[i];
        if (daily < m || claimed.indexOf(m) !== -1) continue;
        claimed.push(m);
        this._data.dailyBonusesClaimed = claimed;
        this._dirty = true;
        var ba = this.addPoints(eco.DAILY_BONUS_POINTS, { towardCap: false });
        awards.push({ milestone: m, added: ba.added });
      }
      return awards;
    },

    recordCorrectExercise: function () {
      this._ensureData();
      this.ensureMonth();
      this._rollDailyIfNeeded();

      var eco = App.PointsEconomy;
      var today = this.todayStr();
      this._data.dailyExerciseCount = (this._data.dailyExerciseCount || 0) + 1;
      var exCount = this._data.dailyExerciseCount;

      var award = this.addPoints(eco.POINTS_PER_EXERCISE, { towardCap: true });
      var milestoneBonuses = this._grantDailyMilestoneBonuses();

      var sb = eco.SUBJECT_BONUS && eco.SUBJECT_BONUS[App.subject];
      var bonusActive = sb && sb.pts > 0 && (!sb.until || today <= sb.until);
      var topicBonus = { pts: bonusActive ? sb.pts : 0, added: 0 };
      if (topicBonus.pts > 0) {
        topicBonus.added = this.addPoints(topicBonus.pts, { towardCap: false }).added;
      }

      var metaAwards = [];

      if (this._data.dailyPoints >= eco.DAILY_META && this._data.metaAchievedDate !== today) {
        metaAwards = this._grantMetaDayStreakBonuses();
        for (var i = 0; i < metaAwards.length; i++) {
          var ma = this.addPoints(metaAwards[i].pts, { towardCap: false });
          metaAwards[i].added = ma.added;
        }
      }

      return {
        award: award,
        milestoneBonuses: milestoneBonuses,
        topicBonus: topicBonus,
        exCount: exCount,
        metaAwards: metaAwards
      };
    },

    pointsForLevel: function () {
      return App.PointsEconomy.POINTS_PER_EXERCISE;
    },

    getSessionCorrect: function () {
      return parseInt(sessionStorage.getItem(this.K_SESS) || "0", 10);
    },
    incrementSessionCorrect: function () {
      var c = this.getSessionCorrect() + 1;
      sessionStorage.setItem(this.K_SESS, c);
      return c;
    },
    resetSessionCorrect: function () {
      sessionStorage.setItem(this.K_SESS, "0");
    },

    todayStr: function () {
      var d = new Date();
      return d.getFullYear() + "-" +
        String(d.getMonth() + 1).padStart(2, "0") + "-" +
        String(d.getDate()).padStart(2, "0");
    },

    daysBetween: function (a, b) {
      return Math.round((new Date(b + "T12:00:00") - new Date(a + "T12:00:00")) / 86400000);
    },

    checkAndUpdateStreak: function () {
      this._ensureData();
      var today = this.todayStr();
      var last = this._data.lastDate;
      var streak = this._data.streak;
      var grace = this._data.grace;
      var result;

      if (!last) {
        this._data.streak = 1;
        this._data.lastDate = today;
        this._data.grace = 2;
        this._dirty = true;
        result = { streak: 1, isFirst: true };
      } else if (last === today) {
        result = { streak: streak };
      } else {
        var diff = this.daysBetween(last, today);
        if (diff === 1) {
          streak++;
          this._data.streak = streak;
          this._data.lastDate = today;
          this._data.grace = 2;
          this._dirty = true;
          result = { streak: streak, isNew: true };
        } else if (diff <= 3 && grace > 0) {
          grace--;
          this._data.grace = grace;
          this._data.lastDate = today;
          this._dirty = true;
          result = { streak: streak, usedGrace: true, grace: grace };
        } else {
          this._data.streak = 1;
          this._data.lastDate = today;
          this._data.grace = 2;
          this._dirty = true;
          result = { streak: 1, reset: true };
        }
      }
      this.persist();
      return result;
    },

    getSnapshot: function () {
      this._ensureData();
      this.ensureMonth();
      return {
        monthKey: this._data.monthKey || this.monthKey(),
        balance: this.getBalance(),
        monthEarned: this._data.monthEarned || 0,
        monthPoints: this.getBalance(),
        dailyPoints: this.getDailyPoints(),
        dailyExerciseCount: this.getDailyExerciseCount(),
        metaDayStreak: this._data.metaDayStreak || 0,
        streak: this._data.streak,
        lastDate: this._data.lastDate,
        grace: this._data.grace,
        pendingRedemptions: typeof RewardsStore !== "undefined" ? RewardsStore.getPendingRedemptions().length : 0,
        sessionCorrect: this.getSessionCorrect(),
        cloud: FirebaseStats.isConfigured()
      };
    },

    setBalance: function (n) {
      this._ensureData();
      this.ensureMonth();
      this._data.balance = Math.max(0, n);
      this._dirty = true;
      this.persist();
    },
    setMonthPoints: function (n) {
      this.setBalance(n);
    },

    adjustBalance: function (delta) {
      this.setBalance(this.getBalance() + delta);
    },
    adjustMonthPoints: function (delta) {
      this.adjustBalance(delta);
    },

    deductBalance: function (n) {
      this._ensureData();
      var next = Math.max(0, (this._data.balance || 0) - Math.max(0, n));
      this._data.balance = next;
      this._dirty = true;
    },

    resetBalance: function () {
      this._ensureData();
      this.ensureMonth();
      this._data.balance = 0;
      this._data.dailyPoints = 0;
      this._data.dailyDate = this.todayStr();
      this._data.dailyExerciseCount = 0;
      this._data.dailyBonusesClaimed = [];
      this._data.metaAchievedDate = "";
      this._dirty = true;
      this.persist();
    },
    resetMonthPoints: function () {
      this.resetBalance();
    },

    resetDailyPoints: function () {
      this._ensureData();
      this._rollDailyIfNeeded();
      this._data.dailyPoints = 0;
      this._data.dailyExerciseCount = 0;
      this._data.dailyBonusesClaimed = [];
      this._data.metaAchievedDate = "";
      this._dirty = true;
      this.persist();
    },

    resetStreak: function () {
      this._ensureData();
      this._data.streak = 0;
      this._data.lastDate = "";
      this._data.grace = 2;
      this._dirty = true;
      this.persist();
    }
  },

  // --- Andamiaje: detecta bloqueo y ofrece ayuda automática ---
  Scaffold: {
    wrongCount: 0,

    reset: function () { this.wrongCount = 0; },

    onWrong: function () {
      this.wrongCount++;
      if (this.wrongCount === 3) {
        // Estadística tiene tutorial en vivo (con los números reales del ejercicio)
        // para frecuencia relativa/porcentual y para moda/media/mediana — es más
        // confiable que la pista genérica de IA para una mecánica precisa (dividir,
        // ordenar, contar), así que se prioriza el paso a paso ahí.
        var hasLiveTutorial = (App.topic === "estadistica" && typeof StatGame !== "undefined" && StatGame.eq && (
          (StatGame.eq.kind === "frecuencia" && StatGame.eq.askType !== "absoluta") ||
          StatGame.eq.kind === "medida"
        )) ||
          // Español: el tutorial enseña la regla (contar verbos, partes del guion) — más útil que una pista vaga
          App.topic === "textos" || App.topic === "guion";
        if (hasLiveTutorial) {
          App.updateTeacher(
            "¡Esto está difícil — es normal!",
            (App.topic === "textos" || App.topic === "guion")
              ? "Aquí tienes el paso a paso con la explicación y los ejemplos del taller. ✨"
              : "Aquí tienes el paso a paso completo con TUS números. ✨",
            "🤗"
          );
          setTimeout(function () { App.showExample(); }, 700);
        } else {
          App.updateTeacher(
            "¡Esto está difícil — es normal!",
            "Tranquila, tómate tu tiempo. Aquí viene una pista del tutor mágico. ✨",
            "🤗"
          );
          setTimeout(function () { App.getMagicHint(); }, 700);
        }
      }
      if (this.wrongCount === 5) {
        App.showLevelSuggestion();
      }
    }
  },

  showLevelSuggestion: function () {
    if (this.level === "dificil") {
      this.updateTeacher("¿Lo probamos en Medio?",
        "Este nivel es bien exigente. Puedes pasarte al <b>Medio</b> para agarrar el truco — el Difícil te espera cuando quieras.", "🤗");
      var b1 = document.getElementById("btn-medio");
      if (b1) { b1.classList.add("ring-4", "ring-yellow-400", "animate-pulse"); setTimeout(function () { b1.classList.remove("ring-4", "ring-yellow-400", "animate-pulse"); }, 5000); }
    } else if (this.level === "medio") {
      this.updateTeacher("¿Lo probamos en Fácil?",
        "Está bien tomarse un paso atrás. Practica en <b>Fácil</b> y vuelve al Medio cuando te sientas lista.", "🤗");
      var b2 = document.getElementById("btn-facil");
      if (b2) { b2.classList.add("ring-4", "ring-yellow-400", "animate-pulse"); setTimeout(function () { b2.classList.remove("ring-4", "ring-yellow-400", "animate-pulse"); }, 5000); }
    }
  },

  showToast: function (text, icon, duration) {
    var container = document.getElementById("toast-container");
    if (!container) return;
    var toast = document.createElement("div");
    toast.className = "bg-white border-2 border-indigo-100 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 font-bold text-slate-700 animate-fade-in text-sm";
    toast.innerHTML = "<span class=\"text-xl\">" + (icon || "🎉") + "</span><span>" + text + "</span>";
    container.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(110%)";
      toast.style.transition = "all 0.35s ease";
      setTimeout(function () { if (toast.parentNode) toast.remove(); }, 360);
    }, duration || 2500);
  },

  onCorrectAnswer: function () {
    if (!this.user || this.user.id !== "zorro") return;
    if (this.exercisePointsAwarded) return;
    this.exercisePointsAwarded = true;
    this.Scaffold.reset();

    var eco = this.PointsEconomy;
    var result = this.Stats.recordCorrectExercise();
    var sessionCount = this.Stats.incrementSessionCorrect();
    this.updatePointsUI();

    var ptsAdded = result.award.added;
    var mi;
    for (mi = 0; mi < result.milestoneBonuses.length; mi++) {
      ptsAdded += result.milestoneBonuses[mi].added;
    }
    var topicExtra = (result.topicBonus && result.topicBonus.added) || 0;
    ptsAdded += topicExtra;

    if (result.award.capped && result.award.added === 0 && ptsAdded === 0) {
      this.showToast(
        "Tope de hoy con ejercicios (" + eco.DAILY_CAP + " pts). Los +1 de cada 100 sí suman. ¡Mañana sigues! 🌙",
        "⭐",
        3500
      );
    } else if (ptsAdded > 0) {
      var txt = "+" + ptsAdded + " pts";
      if (topicExtra > 0) txt += " (incl. +" + topicExtra + " extra de Español ✨)";
      if (result.milestoneBonuses.length) txt += " (incl. bonus por cada 100)";
      if (result.award.capped && result.award.added < eco.POINTS_PER_EXERCISE) txt += " · tope diario";
      this.showToast(txt, "⭐", 2200);
    }

    for (mi = 0; mi < result.milestoneBonuses.length; mi++) {
      var mb = result.milestoneBonuses[mi];
      if (mb.added > 0) {
        this.showToast("¡" + mb.milestone + " pts hoy! +" + mb.added + " extra 🎯", "🎯", 2800);
      }
    }

    var i;
    for (i = 0; i < result.metaAwards.length; i++) {
      var ma = result.metaAwards[i];
      if (ma.added > 0) {
        this.showToast("+" + ma.added + " pts · racha " + ma.label + " 🔥", "🔥", 3500);
      }
    }

    var balance = this.Stats.getBalance();

    if (sessionCount === 3) this.showToast("¡3 seguidas! ¡Qué concentración!", "🔥", 3000);
    else if (sessionCount === 5) this.showToast("¡5 correctas! ¡Imparable!", "🚀", 3000);
    else if (sessionCount === 10) this.showToast("¡10 correctas en la sesión! 🏆", "🏆", 4000);

    this.logEvent("points_earned", {
      extra: {
        points: ptsAdded,
        exercisesToday: result.exCount,
        topic: this.topic,
        balance: balance
      }
    });
  },

  updatePointsUI: function () {
    if (!this.user || this.user.id !== "zorro") return;
    var eco = this.PointsEconomy;
    var balance = this.Stats.getBalance();
    var monthEarned = this.Stats._data ? this.Stats._data.monthEarned || 0 : 0;
    var daily = this.Stats.getDailyPoints();
    var exToday = this.Stats.getDailyExerciseCount();
    var metaStreak = this.Stats._data ? this.Stats._data.metaDayStreak || 0 : 0;
    var nextReward = typeof RewardsStore !== "undefined" ? RewardsStore.getNextRewardProgress() : null;

    var setText = function (id, val) {
      var el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    var uncapped = this.Stats.isUncappedToday();
    var capDisplay = uncapped ? "∞" : eco.DAILY_CAP;
    var bonusMax = eco.DAILY_CAP + eco.DAILY_BONUS_POINTS * 2;

    setText("total-points", balance);
    setText("points-month-earned", monthEarned);
    setText("points-today", daily);
    setText("points-daily-cap", capDisplay);
    setText("points-daily-meta", eco.DAILY_META);
    setText("points-exercises-today", exToday);
    setText("points-meta-streak", metaStreak);
    setText("game-balance-points", balance);
    setText("game-today-points", daily);
    setText("game-daily-cap", capDisplay);
    // La nota "hasta 202 con bonos" solo tiene sentido cuando hay tope.
    setText("points-bonus-note", uncapped ? "sin tope hoy" : "hasta " + bonusMax + " con bonos");
    setText("parent-bonus-note", uncapped ? "(sin tope hoy)" : "(+bonos hasta " + bonusMax + ")");

    var remMsg = document.getElementById("points-remaining-msg");
    if (remMsg) {
      if (uncapped) {
        var sb = eco.SUBJECT_BONUS && eco.SUBJECT_BONUS.espanol;
        var sbActive = sb && sb.pts > 0 && (!sb.until || this.Stats.todayStr() <= sb.until);
        remMsg.textContent = this.Stats.isUncappedByWindow()
          ? "🚀 ¡Hasta el " + this._fmtFecha(eco.UNCAPPED_UNTIL) + " no hay límite de puntos" + (sbActive ? " — y Español da +" + sb.pts + " extra por ejercicio!" : "!")
          : "🚀 ¡Hoy no hay límite de puntos — haz todos los ejercicios que quieras!";
        remMsg.classList.add("text-green-600");
      } else if (nextReward && nextReward.reward) {
        if (nextReward.canAfford) {
          remMsg.textContent = "¡Ya puedes pedir: " + nextReward.reward.title + "! 🎁";
          remMsg.classList.add("text-green-600");
        } else {
          remMsg.textContent = "Próximo premio: " + nextReward.reward.title + " — faltan " + nextReward.remaining + " pts";
          remMsg.classList.remove("text-green-600");
        }
      } else {
        remMsg.textContent = "Saldo acumulado: " + balance + " pts — elige un premio abajo";
        remMsg.classList.remove("text-green-600");
      }
    }

    if (typeof RewardsStore !== "undefined") RewardsStore.renderSofiaCatalog();
  },

  // "2026-09-10" → "10 de septiembre"
  _fmtFecha: function (iso) {
    var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    var p = String(iso || "").split("-");
    if (p.length !== 3) return iso || "";
    return parseInt(p[2], 10) + " de " + (meses[parseInt(p[1], 10) - 1] || p[1]);
  },

  updateStreakUI: function () {
    if (!this.user || this.user.id !== "zorro") return;
    var self = this;
    this.Stats.load().then(function () {
      self._renderStreakUI();
    });
  },

  _renderStreakUI: function () {
    if (!this.user || this.user.id !== "zorro") return;
    this.Stats.ensureMonth();
    var result = this.Stats.checkAndUpdateStreak();
    var streak = result.streak;
    var card    = document.getElementById("sofia-streak-card");
    var countEl = document.getElementById("streak-count");
    var msgEl   = document.getElementById("streak-msg");
    if (!card) return;

    if (countEl) countEl.textContent = streak;
    var unitEl = document.getElementById("streak-unit");
    if (unitEl) unitEl.textContent = streak === 1 ? "día" : "días";

    var msg = "";
    if (result.isFirst)    msg = "¡Primer día! Mañana empieza la racha 🔥";
    else if (result.isNew) msg = streak >= 7  ? "¡" + streak + " días seguidos! ¡Increíble! 🏆" :
                                 streak >= 3  ? "¡" + streak + " días seguidos! ¡Sigue así! 💪" :
                                                "¡Volviste! ¡Aquí vamos! 🙌";
    else if (result.usedGrace) msg = "Día de gracia usado (" + result.grace + " restante" + (result.grace === 1 ? "" : "s") + ") — la racha sigue 💪";
    else if (result.reset) msg = "Nueva racha — ¡este es tu nuevo comienzo! 💪";
    else                   msg = streak + " día" + (streak !== 1 ? "s" : "") + " de práctica seguida 💪";
    if (msgEl) msgEl.textContent = msg;

    card.classList.remove("hidden-el");
    this.updatePointsUI();

    if (result.isNew && streak >= 3) this.showToast("¡Racha de " + streak + " días! 🔥", "🔥", 3500);
    if (result.reset)                this.showToast("Nueva racha — ¡tú puedes! 💪", "🌟", 3000);
  },

  // --- Temporizador visual de sesión (20 min) — exclusivo para Sofía ---
  Timer: {
    DURATION: 20 * 60,
    C: 163.36, // circunferencia del círculo r=26
    remaining: 20 * 60,
    interval: null,
    running: false,
    alerted3: false,
    alerted1: false,

    start: function () {
      this.remaining = this.DURATION;
      this.alerted3 = false;
      this.alerted1 = false;
      this.running = true;
      var el = document.getElementById("sofia-timer");
      if (el) el.classList.remove("hidden-el");
      var toggleBtn = document.getElementById("timer-toggle");
      if (toggleBtn) toggleBtn.textContent = "pausa";
      clearInterval(this.interval);
      var self = this;
      this.interval = setInterval(function () { self.tick(); }, 1000);
      this.render();
    },

    tick: function () {
      if (!this.running) return;
      if (this.remaining <= 0) {
        this.stop();
        var el = document.getElementById("sofia-timer");
        if (el) el.classList.add("hidden-el");
        App.updateTeacher("¡Sesión terminada! 🎉",
          "¡Completaste 20 minutos de práctica! Toma un descanso de 3 minutos y luego volvemos.", "🌟");
        return;
      }
      this.remaining--;
      this.render();
      if (this.remaining === 3 * 60 && !this.alerted3) {
        this.alerted3 = true;
        this.flash();
        App.updateTeacher("¡En 3 minutos hacemos pausa!",
          "Vas muy bien. Termina lo que estás haciendo — en 3 minutitos descansamos.", "⏳");
      }
      if (this.remaining === 60 && !this.alerted1) {
        this.alerted1 = true;
        this.flash();
        App.updateTeacher("¡Último minuto!",
          "¡Ya casi termina la sesión! Dale con todo — después viene el descanso.", "⏰");
      }
    },

    render: function () {
      var display = document.getElementById("timer-display");
      var ring = document.getElementById("timer-ring");
      if (!display || !ring) return;
      var min = Math.floor(this.remaining / 60);
      var sec = this.remaining % 60;
      display.textContent = min + ":" + (sec < 10 ? "0" : "") + sec;
      var progress = (this.DURATION - this.remaining) / this.DURATION;
      ring.style.strokeDashoffset = (progress * this.C).toFixed(2);
      if (this.remaining <= 60) {
        ring.style.stroke = "#f97316";
        display.style.color = "#f97316";
      } else if (this.remaining <= 3 * 60) {
        ring.style.stroke = "#eab308";
        display.style.color = "#b45309";
      } else {
        ring.style.stroke = "#818cf8";
        display.style.color = "#4338ca";
      }
    },

    flash: function () {
      var el = document.getElementById("sofia-timer");
      if (!el) return;
      el.classList.add("timer-flash");
      setTimeout(function () {
        var el2 = document.getElementById("sofia-timer");
        if (el2) el2.classList.remove("timer-flash");
      }, 1600);
    },

    toggle: function () {
      this.running = !this.running;
      var toggleBtn = document.getElementById("timer-toggle");
      if (toggleBtn) toggleBtn.textContent = this.running ? "pausa" : "continuar";
    },

    stop: function () {
      clearInterval(this.interval);
      this.interval = null;
      this.running = false;
    },

    hide: function () {
      this.stop();
      var el = document.getElementById("sofia-timer");
      if (el) el.classList.add("hidden-el");
    }
  }
};

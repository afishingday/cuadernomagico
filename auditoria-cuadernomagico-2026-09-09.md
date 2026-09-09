# Auditoría — El Cuaderno Mágico — 2026-09-09

Revisión completa de la app (código, textos de los 17 temas, capturas reales en escritorio y celular) hecha el 8 y 9 de septiembre de 2026 sobre la versión que está publicada en `cuaderno-magico.web.app` (idéntica a la copia local). No es un cliente de VMM: es tu proyecto para Sofía y Valeria, así que aquí no aplican las convenciones de entregables de agencia.

A pedido tuyo, después de levantar los hallazgos se corrigió en esta misma pasada todo lo que afectaba la lógica de la app o podía confundir a las niñas en los temas. Cada hallazgo dice si ya quedó **corregido** o si **queda en tus manos**. Al final hay una lista de verificación y las órdenes pendientes.

**Estado general:** la app está muy bien pensada (andamiaje para Sofía, economía de puntos sólida, tutoriales con los números reales, arrastre que funciona en táctil) y no tiene errores de JavaScript. Las dos zonas con más oportunidades eran (1) el contenido de varios temas, donde había reglas que contradecían lo que se practica y respuestas correctas que se marcaban como error, y (2) la publicación: las claves y el PIN son públicos y todo el trabajo del 7 de septiembre sigue sin guardarse en git.

---

## Seguridad y publicación (esto sí requiere tu decisión)

- **La clave de Gemini, el PIN del panel y la URL de tracking son públicos.** `js/config.js` se descarga desde `cuaderno-magico.web.app/js/config.js` con las tres cosas en texto plano (verificado con una petición directa). Cualquiera con el enlace puede gastar tu cuota de Gemini, abrir el panel familiar y ajustar los puntos, o llenar tu hoja de Google Sheets. **Queda en tus manos:** restringir la clave de Gemini por sitio web en Google Cloud (Credenciales → clave → "Sitios web" → `cuaderno-magico.web.app/*`); con eso la clave deja de servir fuera de tu página. El PIN no se puede esconder en una app sin servidor: asume que Sofía podría encontrarlo y no lo reutilices en nada más.
- **El progreso de Sofía lo puede escribir cualquiera.** Las reglas de Firestore permiten leer y escribir `players/zorro` sin login (probado: lectura pública responde 200, `players/mapache` responde 403, o sea las reglas sí están desplegadas). Es una decisión de diseño válida para una app familiar; solo tenlo presente: quien tenga la URL podría poner el saldo en cero o en un millón. **Queda en tus manos.**
- **El repositorio de GitHub es público y los archivos de ejemplo traían el PIN real.** `.env.example` y `js/config.example.js` tenían el PIN real; la próxima vez que guardaras en git el PIN quedaba publicado. **Corregido:** los ejemplos ya no traen PIN.
- **Todo el trabajo del 7 de septiembre está sin guardar en git.** 20 archivos modificados (más de 2.000 líneas) y 9 archivos nuevos (los tres juegos de Español, panel familiar, tienda de premios, reglas de Firestore, Tailwind local) no están en ningún commit. Si el disco falla, se pierde. **Queda en tus manos:** guardar un commit hoy (orden al final).
- **Se publicaban archivos internos.** `firestore.rules`, `README.md` y `scripts/inject-env.js` se servían desde la web. **Corregido:** `firebase.json` ahora los excluye del despliegue.
- **No había favicon ni ícono para "agregar a la pantalla de inicio".** `favicon.ico` devolvía la página completa (36 KB de HTML) y en la tableta la app quedaba con un ícono genérico. **Corregido:** íconos generados desde `logo.png`, `manifest.webmanifest`, descripción y color de tema.

## Contenido de los temas (la zona con más oportunidades)

### Matemáticas 5º

- **Fracciones podía congelar la pestaña.** Al generar opciones para una resta cuyo resultado era `1/d` (por ejemplo `5/7 − 4/7`), el bucle que buscaba 4 opciones distintas nunca terminaba (~1 de cada 80 ejercicios). Además solo se aceptaba la fracción sin simplificar (`8/6` sí, `4/3` no), fácil y medio eran el mismo nivel, y los textos decían "divisores" en vez de "denominadores". **Corregido:** generación sin bucles, se acepta cualquier fracción equivalente y al acertar se muestra la simplificada; fácil = mismo denominador con fracciones propias, medio = distinto denominador con números chicos, difícil = más grandes; los distractores ahora son los errores típicos (sumar también los de abajo, operación contraria, multiplicar los de arriba) con un tip específico para cada uno.
- **Ecuaciones daba números negativos en 5º.** `x − 9 = −4` salía en fácil y `x − 39 = −24` en un tercio de las restas de medio; y cualquier error en `x + 5 = 12` mostraba una regla de signos de 7º ("signos contrarios se restan…"). **Corregido:** todo queda en naturales, el tip de error ahora habla de lo que sí pasa (cruzó el puente y cambió de signo) y el Paso a Paso usa la operación del ejercicio actual (antes siempre mostraba una suma, aunque el ejercicio fuera × o ÷).
- **Potencias y radicación estaban fuera del rango de 5º.** Salían `17⁴ = 83 521`, `13⁶ = 4 826 809`, `√8281` y `∛91125` sin apoyo visual, y el distractor que la teoría advierte (`3² ≠ 3 × 2`) nunca aparecía entre las opciones, así que el "tip de oro" era código muerto. En radicación se le decía que el radicando "es el resultado" y luego se le pedía "el resultado" para responder la raíz, y el tip de división imprimía igualdades falsas (`9 ÷ 2 = 5`). **Corregido:** cuadrados hasta 12², cubos y potencias chicas, potencias de 10; raíces cuadradas hasta √400 y cúbicas hasta ∛1000 (la cuadrícula siempre aparece en fácil); las opciones incluyen los errores típicos (base × exponente, una multiplicación de menos o de más, dividir el radicando entre el índice) con tips que los explican; la pregunta es "¿Cuál es la raíz?"; el Paso a Paso usa los números del ejercicio.
- **Jerarquía de operaciones contradecía su propia regla.** En fácil solo hay sumas y restas; si Sofía tocaba el `−` antes del `+`, el mensaje decía "las sumas y restas van de último", sin mencionar la regla que sí aplica (de izquierda a derecha). Los errores de orden tampoco contaban para el andamiaje. La teoría mencionaba `÷` pero nunca salía una división. **Corregido:** mensajes distintos para "mismo nivel, empieza por la izquierda", "la multiplicación va primero" y "el paréntesis va primero"; divisiones exactas en medio; los operadores son botones grandes (44 px); el Paso a Paso explica el ejercicio actual.
- **Geometría pedía el área "en cm".** El área va en cm²; además "AREA"/"PERIMETRO" salían sin tilde, el rectángulo a veces se dibujaba apaisado con la altura mayor que la base, y los distractores eran vecinos ±1..6 que no detectaban la confusión área/perímetro. **Corregido:** unidades correctas, tildes, base siempre mayor que altura, y las opciones incluyen la otra medida y "sumar solo dos lados", con tip específico.
- **Estadística: el tutorial más importante estaba mal.** El paso "la coma salta dos lugares" renderizaba `4,0 × 100 40,` para 0,40 (falso: 4,0 × 100 = 400), justo el tutorial que se abre solo tras tres errores. Se mezclaban coma y punto decimal (`0,` en el texto, `0.40` en la tabla), en la fila preguntada se veían las celdas vecinas que regalan la respuesta (`? | 0.40 | 40%`), la lista de la media era siempre simétrica (media = mediana, así que confundirlas no se notaba), y en moda/mediana se podía acertar por descarte (la única opción que estaba en los datos). **Corregido:** tutorial `0,40 × 100 = 40`, coma decimal en tabla, botones y mensajes, celdas vecinas ocultas en la fila preguntada, listas de media no simétricas, distractores tomados de los propios datos (incluido "el del centro sin ordenar" para mediana), preguntas con signo de apertura.

### Español 5º (semana de repaso)

- **El andamiaje nunca se disparaba en Español.** Los tres juegos pintaban su propio error y no avisaban al sistema de ayudas, así que la pista automática al tercer error y la sugerencia de bajar de nivel al quinto (que tú programaste justo para estos temas) eran código muerto. Lo mismo pasaba en Probabilidad, Circuitos, Inglés, Favoritos e Historia. **Corregido:** todos los caminos de error cuentan; el mensaje "con TUS números" ya no se usa en Español.
- **Oraciones: infinitivos que confunden.** "Se lamentó profundamente y decidió cercarlo" cuenta 2 verbos, pero la teoría definía verbo como "la palabra que dice qué hace alguien" y nunca decía que los infinitivos que acompañan a otro verbo no se cuentan; en medio/difícil 73–83 % de las oraciones eran compuestas (acertar siempre "Compuesta" funcionaba). **Corregido:** regla de infinitivos en la teoría, en el tutorial y en la explicación de cada acierto; siete oraciones simples largas nuevas para equilibrar; dos oraciones de tres verbos; nexos "hasta que" y "por donde" agregados a la lista; ya no se repite la misma oración seguida.
- **Refranes con dos respuestas válidas.** "No hay mal…" tenía como distractor "que dure cien años" (un refrán real); en modo "situación" la pista del refrán regalaba la respuesta ("Piensa en un perro que ladra…"); y refranes con la misma enseñanza salían juntos como correcta y distractor (madrugar / siembra-recoge / camarón; zapatero / agua que no has de beber / boca cerrada; prevenir / quien guarda). **Corregido:** distractores claramente falsos, familias de enseñanza que no se mezclan, pista específica solo cuando se pregunta el significado, situación de "prevenir" reescrita (casco de bicicleta), significado de "Quien siembra, recoge" enfocado en el esfuerzo, sin "VS." ni punto doble.
- **Guion: la regla enseñada llevaba a la respuesta equivocada.** El profesor decía "paréntesis = acotación", pero tres fragmentos etiquetados como acotación no tenían paréntesis (descripciones del escenario) y "Escena No. 3 (final)" sí los tenía. En "concepto", la respuesta correcta siempre era la opción más larga (128 caracteres frente a 30–44). **Corregido:** regla completa (descripción del lugar sin nombre de personaje = acotación; nombre de la obra = título), fragmento sin paréntesis, distractores reescritos con largo parecido al de la correcta, sin repetir el ítem anterior.

### Inglés e Historia 5º

- **Favoritos enseñaba inglés incorrecto.** La opción correcta era "His favorite animal is dog." / "Her favorite food is apple." (sin artículo), mientras el propio tutorial decía "is a cat"; y el español modelo era "Su comida favorito(a) es: pizza." **Corregido:** artículos en inglés (`a dog`, `an apple`), español con género y artículo ("Su comida favorita es la pizza."), "TI MISMA", nota sobre el artículo en el tutorial.
- **Vocabulario con IA no validaba la respuesta de Gemini** (un JSON incompleto producía botones "undefined" o dos opciones correctas), sin clave esperaba ~31 s reintentando antes de mostrar el respaldo, una respuesta tardía podía pintarse encima de otro tema, el botón de pista quedaba muerto si se pulsaba antes de que llegara la palabra, y el respaldo eran 6 palabras para los tres niveles con banderas que Windows no dibuja. **Corregido:** validación completa, respaldo inmediato de 45 palabras por nivel con aviso claro, cancelación de respuestas viejas, banderas reemplazadas por etiquetas EN/ES, botón de pista que siempre se libera.
- **Historia tenía datos con dos respuestas defendibles.** "Calendario exacto de 365 días" (también azteca), "juego de pelota mesoamericano" (común a toda Mesoamérica) y "Quetzalcóatl" (también maya como Kukulkán). **Corregido:** cada dato tiene un ancla única (El Caracol en Chichén Itzá, Tikal y Copán, Huitzilopochtli en el Templo Mayor); "islas flotantes" → "islas artificiales"; el ejemplo del Paso a Paso ya no coincide con la respuesta del ejercicio; sin repetir el dato anterior.

### 11º (Valeria)

- **Probabilidad marcaba como error fracciones correctas.** Los distractores podían ser equivalentes a la respuesta (`2/4` para `3/6`, `1/2` para `2/4`), así que quien simplifica quedaba "mal"; en difícil los porcentajes estaban redondeados sin decirlo (2/7 → "29%"); "sacar una limón". **Corregido:** comparación por valor (se acepta simplificada o no, y se muestra la simplificada al acertar), solo porcentajes exactos, artículos correctos, naipes reemplazados por símbolos que sí se dibujan en Android.
- **Química aceptaba coeficientes no mínimos** (`2 Zn + 4 HCl → 2 ZnCl₂ + 2 H₂` daba "¡Balanceado perfectamente!"), el `−` en 1 saltaba a 8, tras acertar se podía seguir tocando y relanzar confeti, y el error solo mencionaba el último átomo desbalanceado. **Corregido:** exige coeficientes mínimos con explicación, tope 1–8 sin dar la vuelta, bloqueo tras acertar, lista todos los átomos desbalanceados, Paso a Paso con la tabla de átomos de la ecuación actual y los coeficientes que tiene puestos, botones de 40 px.
- **Inecuaciones no ponía a prueba el corchete en la mitad de los casos** (con `>` o `≥` los distractores eran siempre `<` y `≤`), el Paso a Paso era fijo e incompleto (nunca explicaba el corchete ni la división), "**Intervalo**" salía con asteriscos literales y el signo del puente se giraba 180° al invertirse (un `>` girado se ve como `<`, lo contrario de la regla). **Corregido:** opciones con los cuatro signos más una con otro número, Paso a Paso con la inecuación real, texto en negrita, sin rotación, "menores que".
- **Circuitos:** el Paso a Paso era solo la tabla de reglas. **Corregido:** resuelve el circuito actual paso a paso (NO → paréntesis → operación final) y el tip de error distingue el caso compuesto.

## Lógica y funcionamiento

- **Cambio de tema o nivel durante el medio segundo de "acierto"** borraba las opciones del ejercicio nuevo y le acreditaba puntos sin resolverlo (en 9 juegos). **Corregido:** el helper común y todos los juegos comprueban que las opciones sigan siendo las del ejercicio acertado.
- **El nivel se heredaba en silencio entre temas**: quien ponía Difícil en Ecuaciones caía en Difícil de Radicación sin darse cuenta (visto en las capturas). **Corregido:** cada tema arranca en Fácil.
- **Gemini reintentaba con clave vacía o inválida** (5 intentos, 31 s). **Corregido:** sin clave falla al instante; solo reintenta ante cuota o error del servidor; se valida que la respuesta tenga texto.
- **Los prompts de pista decían "el niño" / "el estudiante"** y el de polinomios hablaba de "PEMDAS" (la app enseña "jerarquía"); el de probabilidad decía "divido en"; el de inecuaciones no sabía en qué fase iba. **Corregido:** todos en femenino ("la estudiante"), jerarquía explicada, fase de inecuaciones enviada, circuito actual enviado.
- **El mensaje del tope de puntos tenía la fecha escrita a mano** ("hasta el 10 de septiembre") aparte de la constante; y "hasta 202 con bonos" seguía visible cuando no había tope. **Corregido:** se calcula desde `PointsEconomy`.
- A favor: la economía de puntos está bien blindada (una sola concesión por ejercicio, doble guarda, bono de Español conectado), los generadores de estadística y polinomios nunca dan decimales ni negativos, el arrastre de ecuaciones e inecuaciones usa Pointer Events con `touch-action: none` (funciona en tableta), y el banco de química está balanceado en las seis ecuaciones.

## Experiencia en celular

- **La tabla de frecuencias perdía la columna "F. Porcentual"** en un teléfono (quedaba fuera del cuaderno sin señal de que se podía deslizar). **Corregido:** tabla compacta que cabe en 360 px.
- **El temporizador de sesión tapaba la esquina inferior derecha**, donde queda la columna derecha de botones de respuesta. **Corregido:** en celular va abajo a la izquierda, sobre el margen del cuaderno, un poco más pequeño.
- **El Paso a Paso se veía en una ventanita de dos líneas** porque vive dentro del cuaderno y el cuaderno mide 350 px en celular. **Corregido:** al abrirlo, el cuaderno crece al 80 % de la pantalla y se lleva a la vista.
- Botones pequeños para el dedo (selector de tema de estadística ≈ 32 px, operadores de polinomios ≈ 30 px, +/− de química ≈ 28 px). **Corregido:** mínimo 40–44 px.
- El ícono de Inglés era la bandera 🇬🇧, que Windows muestra como "GB". **Corregido:** 🔤.
- A favor: el diseño responde bien en general (tarjetas apiladas, tipografías legibles, opciones de Español a ancho completo).

## Textos y tono

- Preguntas sin signo de apertura y con dos puntos sobrantes en cinco juegos ("El resultado es?:", "Entonces la MODA es?:", "¿Cuál es la fracción resultante?:"), "¿qué número, por sí mismo:" que nunca cerraba, "Racha: 1 días", "TI MISMO", "¡Atento…" para una niña, "10 amigos", títulos con Mayúscula En Cada Palabra ("¡Fracción Perfecta!"). **Corregido** en todos los casos encontrados.
- Textos hardcoded de Tailwind con "capitalize" que producían "Ejemplo: Area De Un Rectangulo". **Corregido.**

## Posicionamiento en Google (SEO) — casi no aplica

Es una app familiar, no una página para atraer tráfico, así que no se evaluó posicionamiento. Lo único con efecto real (favicon, descripción, vista previa al compartir el enlace por WhatsApp) quedó agregado.

## Diseño y primera impresión

- La primera impresión es muy buena para el público al que va: colores vivos, tarjetas grandes, el cuaderno con argollas, la profe que habla, confeti. No hay que rediseñar nada.
- **Tailwind se carga como "Play CDN"** (407 KB que compilan estilos en el navegador en cada visita, con una advertencia de producción en la consola). Funciona, pero en una tableta lenta puede verse un parpadeo sin estilos al abrir. Reemplazarlo por un CSS compilado es trabajo aparte y con riesgo de perder clases que se arman dinámicamente en JS; **queda en tus manos** decidir si vale la pena.
- **La experiencia de Valeria es mucho más delgada**: 4 temas, sin puntos, sin racha, sin temporizador, y cada vez debe elegir "11º" aunque la app ya sabe quién es. El modal inicial promete "registrar tu progreso" y para ella no se registra nada (salvo el tracking a Sheets, si está activo). **Queda en tus manos** si quieres extenderle la economía de puntos o al menos saltarle el selector de grado como a Sofía.
- **Tu teléfono personal está en el pie de una página pública.** Es tu decisión (está en un commit tuyo); solo tenlo presente si compartes el enlace fuera de la familia.
- Los premios dicen "Robux ~5 USD" y "Alcancía efectivo $5" sin aclarar moneda; se editan desde el panel familiar, así que puedes ajustarlo cuando quieras.

---

## Qué se corrigió en esta pasada (resumen por archivo)

- `js/utils.js`: opciones con distractores "con sentido" (`preferred`), sin bucles infinitos, guarda contra cambio de ejercicio durante el acierto, `registerWrongAttempt()` para el andamiaje.
- `js/gemini.js`: sin reintentos con clave vacía/inválida, validación de la respuesta, `isConfigured()`.
- `js/app.js`: prompts en femenino y coherentes, pista sin IA con aviso, botón de pista que nunca queda muerto, nivel a Fácil por tema, Paso a Paso legible en celular, "1 día", mensaje del tope con la fecha real, teoría de Radicación, Oraciones e Inecuaciones.
- Juegos: los 17 archivos de `js/games/` (detalle arriba).
- `index.html`: favicon, manifest, descripción, tema, ids para textos dinámicos, botones del selector de estadística.
- `css/styles.css`: temporizador en celular, botones de operador, signo del puente sin rotar.
- `firebase.json`, `.env.example`, `js/config.example.js`, `README.md`, íconos nuevos (`favicon-*.png`, `favicon.ico`, `apple-touch-icon.png`, `manifest.webmanifest`).

## Verificación

- `node --check` en los 20 archivos JavaScript: sin errores de sintaxis.
- Prueba funcional automática (`scripts/prueba-funcional.py`, Playwright, configuración neutralizada, sin tocar el Firestore real de Sofía): recorre los 17 temas en los 3 niveles, abre y cierra el Paso a Paso, contesta primero una opción incorrecta y luego la correcta, y comprueba que aparezca "¡Hacer otro ejercicio!" y que Sofía reciba puntos. Resultado: 102 de 102 ejercicios resueltos (2 rondas por tema y nivel), 0 errores de JavaScript, 0 errores de consola. En química también comprueba que el doble de la solución se rechace y la mínima se acepte.
- Capturas reales en escritorio (1366 px) y celular (iPhone 13) de las 32 pantallas principales, antes y después: sin errores de consola, sin peticiones fallidas, con los arreglos visibles.
- No se desplegó ni se hizo commit: la versión publicada sigue siendo la del 7 de septiembre hasta que tú lo decidas.

## Lo que queda en tus manos — órdenes sugeridas

1. Guardar el trabajo en git (primero lo tuyo del 7 de septiembre más estas correcciones):
   ```
   git add -A && git commit -m "Español (oraciones, refranes, guion), panel familiar, tienda de premios, Firestore; auditoría 2026-09-09: correcciones de contenido, lógica y móvil"
   git push
   ```
2. Publicar la versión corregida cuando quieras que Sofía la use:
   ```
   firebase deploy --only hosting
   ```
3. Restringir la clave de Gemini en Google Cloud → APIs y servicios → Credenciales → tu clave → Restricciones de aplicación: "Sitios web" → agregar `https://cuaderno-magico.web.app/*` (y `localhost` si pruebas en tu PC).
4. Cambiar el PIN del panel familiar (`PARENT_PIN` en `.env`, luego `node scripts/inject-env.js` y volver a publicar), ya que el actual estuvo en archivos de ejemplo de un repositorio público.
5. (Opcional) "Compila Tailwind con el CLI y reemplaza `js/vendor/tailwind-play-cdn.3.4.17.js` por un `css/tailwind.css` generado, con `safelist` de las clases que se arman en JS (`subjectStyles`, colores de opciones)".
6. (Opcional) "Dale a Valeria (mapache) el mismo salto directo a su grado que tiene Sofía y decide si le extiendes puntos y racha".
7. (Opcional) "Etiqueta la moneda en el catálogo de premios desde el panel familiar (USD o COP)".

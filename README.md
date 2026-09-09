# ✨ El Cuaderno Mágico

Aplicación web para que Sofía (5º) y Valeria (11º) repasen temas escolares de forma interactiva, con pistas de IA (Gemini), tienda de premios y panel familiar.

Publicada en Firebase Hosting: https://cuaderno-magico.web.app

## Contenido por grado

- **5º Grado (Básica Primaria)** — Sofía (avatar 🦊 Zorro, con puntos, racha, temporizador y tienda de premios)
  - Matemáticas: Ecuaciones, Jerarquía de operaciones, Potencias, Radicación, Fracciones, Geometría (áreas y perímetros), Estadística (moda, media, mediana, frecuencias)
  - Español: Oraciones simples y compuestas, Refranes y dichos, El guion teatral
  - Inglés: Vocabulario (con IA y banco de respaldo), Mis favoritos (My / His / Her)
  - Historia: Culturas precolombinas
- **11º Grado (Media Académica)** — Valeria (avatar 🦝 Mapache)
  - Matemáticas: Inecuaciones
  - Estadística: Probabilidad
  - Tecnología: Circuitos digitales (álgebra de Boole)
  - Química: Balanceo de ecuaciones

Cada tema tiene tres niveles (Fácil / Medio / Difícil), un "Paso a Paso" con el ejercicio actual y una pista del "Tutor Mágico" (Gemini). Al cambiar de tema el nivel vuelve a Fácil.

## Cómo ejecutarlo

Con un servidor local (recomendado), desde la raíz del proyecto:

```bash
npx serve .
```

Luego abre la URL que muestre (por ejemplo `http://localhost:3000`). Abrir `index.html` con doble clic también funciona, pero las fuentes y la IA pueden fallar sin HTTP.

## Configuración (`.env` → `js/config.js`)

1. Copia `.env.example` como `.env` y rellena:
   - `GEMINI_API_KEY`: clave de [Google AI Studio](https://aistudio.google.com/apikey). Sin clave, la app funciona igual: las pistas de IA se desactivan con un aviso y el vocabulario de inglés usa el banco de respaldo.
   - `PARENT_PIN`: PIN del panel familiar (elige uno propio).
   - `TRACKING_URL` (opcional): URL `/exec` de un Apps Script que reciba los eventos en Google Sheets.
   - `FIREBASE_*`: datos de la app web del proyecto `cuaderno-magico` (progreso de Sofía en Firestore, colección `players`, documento `zorro`).
2. Genera `js/config.js`: `node scripts/inject-env.js`.
3. `.env` y `js/config.js` están en `.gitignore`. **Ojo:** `js/config.js` sí se publica con el sitio (el navegador lo necesita), así que cualquiera que abra la página puede ver esas claves. Restringe la clave de Gemini por sitio web (`cuaderno-magico.web.app`) en Google Cloud y no reutilices el PIN en otra parte.

Modelo de IA: `gemini-2.5-flash` (estable). Sin clave o con clave inválida no se reintenta; solo se reintenta ante cuota (429) o errores del servidor.

## Publicar

```bash
firebase deploy --only hosting,firestore
```

`firebase.json` excluye del despliegue `firestore.rules`, `README.md`, `scripts/` y los archivos ocultos.

## Panel familiar

Se abre con el enlace "Panel familiar" del pie de página o tocando 5 veces el logo. Permite ver el progreso de Sofía, editar el catálogo de premios, confirmar canjes y ajustar puntos. El tope diario, la meta y los bonos están en `App.PointsEconomy` (`js/app.js`).

## Estructura del proyecto

```
cuadernomagico/
├── index.html            # Página principal (una sola página, vistas por JS)
├── manifest.webmanifest  # Ícono para "agregar a la pantalla de inicio"
├── favicon*.png / .ico   # Íconos generados desde logo.png
├── firebase.json / firestore.rules / .firebaserc
├── .env.example          # Plantilla de configuración
├── scripts/inject-env.js # Genera js/config.js desde .env
├── css/styles.css        # Estilos del cuaderno y animaciones
└── js/
    ├── config.js         # Generado (no se sube a git)
    ├── app.js            # Vistas, currículo, teorías, puntos, racha, temporizador, pistas
    ├── utils.js          # Opciones múltiples, acierto/error, andamiaje, confeti
    ├── gemini.js         # Llamadas a Gemini
    ├── firebase-stats.js # Progreso en Firestore
    ├── rewards-store.js  # Tienda de premios y canjes
    ├── parent-panel.js   # Panel familiar (PIN)
    ├── tracking.js       # Eventos a Google Sheets (opcional)
    ├── vendor/           # Tailwind (Play CDN local)
    └── games/            # Un archivo por tema
```

## Tecnologías

- HTML5, CSS3 (Tailwind Play CDN servido en local), JavaScript sin frameworks.
- Fuentes: Patrick Hand, Nunito (Google Fonts).
- Google Gemini (pistas y vocabulario), Firebase Hosting + Firestore.

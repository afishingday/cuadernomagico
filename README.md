# ✨ El Cuaderno Mágico

Aplicación web para que tus hijas repasen temas escolares de forma interactiva, con ayuda de IA (Gemini).

## Contenido por grado

- **5º Grado (Básica Primaria)**  
  - Matemáticas: Ecuaciones, Polinomios (jerarquía de operaciones)  
  - Inglés: Vocabulario generado por IA  

- **11º Grado (Media Académica)**  
  - Matemáticas: Inecuaciones (desigualdades e intervalos)  
  - Tecnología: Circuitos digitales (álgebra de Boole)  

## Cómo ejecutarlo

1. **Sin servidor**  
   Abre `index.html` en el navegador (doble clic o arrastrar al Chrome/Edge).  
   Algunas funciones (por ejemplo cargar fuentes o CORS con Gemini) pueden requerir servir los archivos por HTTP.

2. **Con un servidor local (recomendado)**  
   Desde la raíz del proyecto:
   ```bash
   npx serve .
   ```
   Luego abre la URL que muestre (por ejemplo `http://localhost:3000`).

## Configurar la API de Gemini (como en santiagotracker)

Las pistas del “Tutor Mágico” y el vocabulario de inglés usan la API de Gemini.

1. Obtén una API key en: [Google AI Studio](https://aistudio.google.com/apikey).
2. Copia el ejemplo y rellena tu clave: `cp .env.example .env` (en Windows: copiar `.env.example` como `.env`). Edita `.env` y asigna tu clave a `GEMINI_API_KEY=tu_clave_aqui`.
3. Genera `js/config.js` desde `.env`: `node scripts/inject-env.js`.
4. **Importante:** `.env` y `js/config.js` están en `.gitignore`; no se suben al repo.

Sin API key la app funciona para matemáticas y circuitos; solo fallarán las pistas con IA y el vocabulario de inglés (lista de respaldo). Se usa el modelo estable **gemini-2.5-flash** (igual que en santiagotracker).

## Estructura del proyecto

```
cuadernomagico/
├── index.html          # Página principal
├── .env                # API key (copiar desde .env.example, en .gitignore)
├── .env.example        # Plantilla con GEMINI_API_KEY=
├── scripts/
│   └── inject-env.js   # Genera js/config.js desde .env
├── css/
│   └── styles.css      # Estilos del cuaderno y animaciones
├── js/
│   ├── config.js       # Generado por inject-env.js (en .gitignore)
│   ├── gemini.js       # Llamadas a la API de Gemini
│   ├── app.js          # Navegación, currículo y Tutor Mágico
│   ├── utils.js        # Opciones múltiples, confeti
│   └── games/
│       ├── equations.js   # Juego de ecuaciones (drag & drop)
│       ├── polynomials.js # Jerarquía de operaciones
│       ├── inequations.js # Inecuaciones (11º)
│       ├── circuits.js   # Circuitos digitales
│       └── english.js     # Vocabulario inglés con IA
└── README.md
```

## Tecnologías

- HTML5, CSS3 (Tailwind vía CDN), JavaScript sin frameworks.
- Fuentes: Patrick Hand, Nunito (Google Fonts).
- API: Google Gemini (generación de pistas y vocabulario en inglés).

Cuando tengas los ajustes que estabas haciendo en Canvas, los podemos ir integrando aquí.

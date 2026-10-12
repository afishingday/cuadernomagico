# -*- coding: utf-8 -*-
"""Genera el cuaderno PDF "Estadística de 5º" (tablas de frecuencia, moda, media, mediana)."""
import base64
from pathlib import Path
from playwright.sync_api import sync_playwright

PRJ = Path(r"C:\Users\usuario\Documents\Proyectos Personales Luis\cuadernomagico")
OUT = PRJ / "material"
OUT.mkdir(exist_ok=True)
logo_b64 = base64.b64encode((PRJ / "logo.png").read_bytes()).decode()
LOGO = f"data:image/png;base64,{logo_b64}"

CSS = """
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&family=Patrick+Hand&display=swap');
@page { size: A4; margin: 16mm 14mm 18mm 14mm; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { font-family: 'Nunito', Arial, sans-serif; color: #1e293b; font-size: 11.5pt; line-height: 1.45; }
h1, h2, h3 { font-weight: 900; margin: 0; }
h2 { font-size: 19pt; color: #4c1d95; margin: 0 0 6px; display: flex; align-items: center; gap: 8px; }
h3 { font-size: 13.5pt; color: #5b21b6; margin: 12px 0 4px; }
p { margin: 4px 0; }
.page { page-break-after: auto; }
.cover-page { page-break-after: always; }
.newpage { page-break-before: always; }
h2, h3 { break-after: avoid; }
.card, .tip, .ex, table { break-inside: avoid; }
h2 { margin-top: 10px; }
.cover { height: 250mm; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
  background: #8b5cf6; background-image: radial-gradient(#a881af 1px, transparent 1px); background-size: 20px 20px; border-radius: 24px; color: white; padding: 30px; }
.cover img { width: 190px; filter: drop-shadow(0 8px 12px rgba(0,0,0,.25)); }
.cover h1 { font-size: 40pt; line-height: 1.05; margin: 14px 0 6px; text-shadow: 0 3px 0 rgba(0,0,0,.2); }
.cover .sub { font-size: 16pt; font-weight: 700; background: rgba(49,46,129,.45); border: 2px solid rgba(165,180,252,.5); border-radius: 18px; padding: 8px 18px; margin: 10px 0 24px; }
.cover .topics { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-bottom: 26px; }
.cover .topics span { background: white; color: #4c1d95; font-weight: 900; border-radius: 999px; padding: 6px 14px; border-bottom: 4px solid #c7d2fe; }
.cover .name { font-size: 14pt; font-weight: 700; background: white; color: #1e293b; border-radius: 14px; padding: 10px 18px; width: 80%; }
.cover .credit { margin-top: 30px; font-size: 10pt; color: #ede9fe; }
.credit-box { display: flex; align-items: center; gap: 12px; border: 2px solid #ddd6fe; border-radius: 14px; padding: 10px 14px; margin-top: 18px; background: #f5f3ff; }
.credit-box img { width: 54px; }
.credit-box p { font-size: 10pt; color: #4c1d95; }
.card { border: 3px solid #ddd6fe; border-radius: 16px; padding: 10px 14px; margin: 8px 0; background: #faf5ff; }
.tip { border: 3px solid #fde047; background: #fefce8; border-radius: 14px; padding: 8px 12px; margin: 8px 0; color: #713f12; }
.tip b { color: #854d0e; }
.steps { margin: 4px 0 4px 18px; padding: 0; }
.steps li { margin: 4px 0; }
table { border-collapse: separate; border-spacing: 0; margin: 6px auto; font-size: 11pt; border: 2px solid #c7d2fe; border-radius: 12px; overflow: hidden; }
th, td { padding: 5px 12px; text-align: center; border-bottom: 1px solid #e0e7ff; }
th { background: #e0e7ff; color: #3730a3; font-weight: 900; }
tr:last-child td { border-bottom: none; }
tr.total td { background: #eef2ff; font-weight: 900; }
.blank { display: inline-block; min-width: 46px; border-bottom: 2px solid #94a3b8; height: 16px; vertical-align: bottom; }
.blank.w { min-width: 90px; }
.icons { font-size: 18pt; letter-spacing: 4px; background: white; border: 2px solid #e0e7ff; border-radius: 12px; padding: 6px 12px; display: inline-block; margin: 4px 0; }
.nums { font-family: 'Patrick Hand', cursive; font-size: 18pt; color: #334155; background: white; border: 2px solid #fde68a; border-radius: 12px; padding: 4px 14px; display: inline-block; margin: 4px 0; }
.ex { border: 2px solid #e2e8f0; border-radius: 14px; padding: 8px 12px; margin: 7px 0; background: white; page-break-inside: avoid; }
.ex .n { display: inline-block; background: #8b5cf6; color: white; font-weight: 900; border-radius: 999px; padding: 1px 10px; margin-right: 6px; font-size: 10.5pt; }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.three { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
.mini { font-size: 10pt; color: #475569; }
.answers { columns: 2; column-gap: 18px; font-size: 10.5pt; }
.answers .ex { break-inside: avoid; }
.work { border: 2px dashed #cbd5e1; border-radius: 10px; min-height: 42px; margin-top: 6px; background: repeating-linear-gradient(white, white 20px, #f1f5f9 21px); }
.work.tall { min-height: 70px; }
.badge { display: inline-block; background: #fef3c7; color: #92400e; font-weight: 900; border-radius: 8px; padding: 0 8px; font-size: 10pt; }
.compare td:first-child { font-weight: 900; color: #4c1d95; text-align: left; }
.compare td { text-align: left; }
.big { font-family: 'Patrick Hand', cursive; font-size: 16pt; }
"""


def table_html(rows, headers=("Símbolo", "Absoluta (fa)", "Relativa (fr)", "Porcentual (fp)"), total=None, blank=False):
    h = "<table><tr>" + "".join(f"<th>{x}</th>" for x in headers) + "</tr>"
    for r in rows:
        h += "<tr>" + "".join(f"<td>{c}</td>" for c in r) + "</tr>"
    if total:
        h += "<tr class='total'>" + "".join(f"<td>{c}</td>" for c in total) + "</tr>"
    return h + "</table>"


B = "<span class='blank'></span>"
BW = "<span class='blank w'></span>"

html = f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Estadística de 5º · El Cuaderno Mágico</title><style>{CSS}</style></head><body>

<!-- PORTADA -->
<section class="page cover-page">
  <div class="cover">
    <img src="{LOGO}" alt="El Cuaderno Mágico">
    <h1>Estadística<br>de 5º</h1>
    <div class="sub">Explicación paso a paso + ejercicios para practicar</div>
    <div class="topics"><span>📋 Tablas de frecuencia</span><span>⭐ Moda</span><span>➗ Media</span><span>🎯 Mediana</span></div>
    <div class="name">Este cuaderno es de: ______________________________</div>
    <div class="credit">Un cuaderno de repaso hecho con cariño · El Cuaderno Mágico · afishingday.com</div>
  </div>
</section>

<!-- 1. INTRO + TABLAS -->
<section class="page">
  <h2>🔎 ¿Para qué sirve la estadística?</h2>
  <div class="card">
    <p>Cuando haces una <b>encuesta</b> (por ejemplo, preguntar a 10 amigos su sabor de paleta favorito) te quedan muchos <b>datos</b> sueltos. La estadística te ayuda a hacer dos cosas:</p>
    <ol class="steps">
      <li><b>Organizarlos</b> en una <b>tabla de frecuencias</b>, para ver de un vistazo cuántos eligieron cada cosa.</li>
      <li><b>Resumirlos</b> con un solo número que "represente" al grupo: la <b>moda</b>, la <b>media</b> o la <b>mediana</b>.</li>
    </ol>
  </div>

  <h2>📋 Tablas de frecuencia</h2>
  <p>Le preguntamos a <b>10 amigos</b> su sabor de paleta favorito. Respondieron:</p>
  <div style="text-align:center"><span class="icons">🍓 🍫 🍓 🍋 🍓 🍫 🍓 🍋 🍫 🍓</span></div>

  <h3>1. Frecuencia absoluta (fa): ¡contar!</h3>
  <p>Es <b>cuántas veces</b> aparece cada respuesta. Cuenta uno por uno (puedes ir tachándolos): 🍓 → 5, 🍫 → 3, 🍋 → 2.</p>
  <div class="tip">💡 <b>Truco:</b> la suma de todas las frecuencias absolutas <b>siempre da el total</b> de encuestados: 5 + 3 + 2 = 10. Si no te da, ¡cuenta otra vez!</div>

  <h3>2. Frecuencia relativa (fr): dividir</h3>
  <p>Es la absoluta <b>dividida entre el total</b>: <span class="big">fr = fa ÷ total</span>. Para 🍓: <b>5 ÷ 10</b>.</p>
  <div class="card">
    <p><b>¿Cómo dividir 5 ÷ 10 si el 5 es más chico que el 10?</b> Paso a paso:</p>
    <ol class="steps">
      <li>El 5 no cabe ni una vez completa en el 10, así que el resultado empieza en <b>0,</b> (cero coma).</li>
      <li><b>Baja un cero:</b> al 5 le agregas un cero y se convierte en 50. Ahora divide: 50 ÷ 10 = <b>5</b>. Ese 5 va después de la coma.</li>
      <li>Resultado: <b>0,5</b>. Como en las tablas se usan dos decimales, se escribe <b>0,50</b>.</li>
    </ol>
    <p>Para 🍫: 3 ÷ 10 = <b>0,30</b>. Para 🍋: 2 ÷ 10 = <b>0,20</b>.</p>
  </div>
  <div class="tip">💡 <b>Truco:</b> las frecuencias relativas de todas las filas suman <b>1,00</b> (0,50 + 0,30 + 0,20 = 1,00).</div>

  <h3>3. Frecuencia porcentual (fp): multiplicar por 100</h3>
  <p>Es la relativa <b>multiplicada por 100</b>: <span class="big">fp = fr × 100</span>. Multiplicar por 100 es fácil: <b>la coma salta dos lugares a la derecha</b>.</p>
  <p style="text-align:center" class="big">0,50 × 100 = 50 → <b>50 %</b> &nbsp;&nbsp;·&nbsp;&nbsp; 0,30 × 100 = <b>30 %</b> &nbsp;&nbsp;·&nbsp;&nbsp; 0,20 × 100 = <b>20 %</b></p>
  <div class="tip">💡 <b>Truco:</b> las porcentuales siempre suman <b>100 %</b>. Y si prefieres un solo paso: fp = fa ÷ total × 100.</div>

  <h3>La tabla completa</h3>
  {table_html([["🍓 Fresa", 5, "0,50", "50 %"], ["🍫 Chocolate", 3, "0,30", "30 %"], ["🍋 Limón", 2, "0,20", "20 %"]], total=["Total", 10, "1,00", "100 %"])}
</section>

<!-- 2. MODA MEDIA MEDIANA -->
<section class="page">
  <h2>⭐ Moda</h2>
  <div class="card">
    <p>La moda es el dato que <b>MÁS se repite</b>. Piensa en "estar a la moda": lo que más se usa. <b>No hay que sumar ni ordenar</b>, solo contar repeticiones.</p>
    <p>Ejemplo: <span class="nums">7, 3, 7, 9, 7, 2</span> → el 7 aparece 3 veces, los demás una sola vez. <b>Moda = 7</b>.</p>
    <p>La moda también puede ser una palabra o un dibujo: en la encuesta de paletas la moda es <b>🍓 fresa</b> (5 votos).</p>
  </div>
  <div class="tip">💡 Si dos datos se repiten la misma cantidad de veces (y más que los demás), hay <b>dos modas</b>. Ej: 4, 6, 4, 6, 9 → modas 4 y 6.</div>

  <h2>➗ Media (promedio)</h2>
  <div class="card">
    <p>La media es <b>repartir en partes iguales</b>. Se calcula en dos pasos: <b>sumar todos</b> los datos y <b>dividir</b> entre la cantidad de datos.</p>
    <p>Ejemplo, notas de un mes: <span class="nums">4, 3, 5, 4, 4</span></p>
    <ol class="steps">
      <li><b>Suma:</b> 4 + 3 + 5 + 4 + 4 = <b>20</b>.</li>
      <li><b>Cuenta cuántos datos hay:</b> son <b>5</b> notas.</li>
      <li><b>Divide:</b> 20 ÷ 5 = <b>4</b>. La media es <b>4</b>.</li>
    </ol>
  </div>
  <div class="tip">💡 La media no tiene que ser uno de los datos: 2, 3 y 7 tienen media 12 ÷ 3 = <b>4</b>, y el 4 no está en la lista. ¡Es normal!</div>

  <h2>🎯 Mediana</h2>
  <div class="card">
    <p>La mediana es el dato que queda <b>justo en el medio</b> cuando <b>ordenas</b> los datos de menor a mayor. ¡Ordenar es el paso clave: si no ordenas, te equivocas!</p>
    <p>Ejemplo: <span class="nums">9, 2, 7, 4, 5</span></p>
    <ol class="steps">
      <li><b>Ordena</b> de menor a mayor: 2, 4, <b>5</b>, 7, 9.</li>
      <li><b>Busca el del centro:</b> son 5 datos, así que el del medio es el tercero (queda con 2 a la izquierda y 2 a la derecha): <b>5</b>.</li>
    </ol>
    <p>Con 7 datos, la mediana es el cuarto: 1, 3, 4, <b>6</b>, 8, 9, 10 → mediana 6.</p>
  </div>
  <div class="tip">💡 <b>Dato extra:</b> si la cantidad de datos es <b>par</b>, quedan dos en el centro; la mediana es la media de esos dos. Ej: 4, 6, 8, 10 → (6 + 8) ÷ 2 = 7.</div>

  <h2>🧠 Cómo no confundirlas</h2>
  <table class="compare">
    <tr><th>Medida</th><th>Qué hago</th><th>Truco para recordar</th></tr>
    <tr><td>Moda</td><td>Cuento cuál se repite más.</td><td>MOda = lo que MÁS se usa, lo que está "de moda".</td></tr>
    <tr><td>Media</td><td>Sumo todo y divido entre cuántos datos hay.</td><td>MEDIA = repartir por igual.</td></tr>
    <tr><td>Mediana</td><td>Ordeno y tomo el del centro.</td><td>MEDIAna = la que queda en el MEDIO.</td></tr>
  </table>
</section>

<!-- 3. EJERCICIOS A: TABLAS -->
<section class="page newpage">
  <h2>✏️ Ejercicios A · Tablas de frecuencia</h2>
  <p class="mini">Escribe las respuestas en los espacios. Recuerda: fr = fa ÷ total, fp = fr × 100.</p>

  <div class="ex"><span class="n">A1</span> Se les preguntó a <b>10 niños</b> su animal favorito. Completa la tabla.
    <div style="text-align:center"><span class="icons">🐶 🐱 🐶 🐰 🐶 🐱 🐶 🐰 🐶 🐱</span></div>
    {table_html([["🐶 Perro", B, B, B], ["🐱 Gato", B, B, B], ["🐰 Conejo", B, B, B]], total=["Total", 10, "1,00", "100 %"])}
  </div>

  <div class="ex"><span class="n">A2</span> En un salón de <b>20 estudiantes</b> ya contaron la fruta favorita. Calcula las frecuencias relativa y porcentual.
    {table_html([["🍎 Manzana", 8, B, B], ["🍌 Banano", 6, B, B], ["🍇 Uvas", 4, B, B], ["🍉 Sandía", 2, B, B]], total=["Total", 20, "1,00", "100 %"])}
    <div class="work"></div>
  </div>

  <div class="ex"><span class="n">A3</span> <b>25 personas</b> dijeron su deporte favorito. Completa la tabla. <span class="badge">Pista: 7 ÷ 25 = 0,28</span>
    {table_html([["⚽ Fútbol", 10, B, B], ["🏀 Baloncesto", 7, B, B], ["🏊 Natación", 5, B, B], ["🎾 Tenis", 3, B, B]], total=["Total", 25, "1,00", "100 %"])}
    <div class="work"></div>
  </div>

  <div class="ex"><span class="n">A4</span> Lee la tabla y responde. Se encuestaron <b>10 personas</b> sobre su comida favorita.
    {table_html([["🍕 Pizza", "?", "0,50", "50 %"], ["🍔 Hamburguesa", 3, "0,30", "30 %"], ["🌭 Perro caliente", 2, "0,20", "20 %"]], total=["Total", 10, "1,00", "100 %"])}
    <p>a) ¿Cuántas personas eligieron pizza? {B} &nbsp;&nbsp; b) ¿Cuál es la moda? {BW} &nbsp;&nbsp; c) ¿Qué porcentaje eligió hamburguesa? {B}</p>
  </div>
</section>

<!-- 4. EJERCICIOS B, C, D -->
<section class="page">
  <h2>✏️ Ejercicios B · Moda</h2>
  <div class="two">
    <div class="ex"><span class="n">B1</span> <span class="nums">3, 8, 3, 5, 3, 9</span><br>Moda: {B}</div>
    <div class="ex"><span class="n">B2</span> <span class="nums">12, 15, 12, 18, 15, 12, 20</span><br>Moda: {B}</div>
    <div class="ex"><span class="n">B3</span> Colores favoritos: <b>rojo, azul, rojo, verde, azul, rojo</b><br>Moda: {BW}</div>
    <div class="ex"><span class="n">B4</span> <span class="badge">Reto</span> <span class="nums">4, 6, 4, 6, 9</span><br>Moda(s): {BW}</div>
  </div>

  <h2>✏️ Ejercicios C · Media</h2>
  <p class="mini">Muestra la suma y la división en el espacio de trabajo.</p>
  <div class="two">
    <div class="ex"><span class="n">C1</span> <span class="nums">6, 8, 10</span><div class="work"></div>Media: {B}</div>
    <div class="ex"><span class="n">C2</span> <span class="nums">5, 7, 9, 3, 6</span><div class="work"></div>Media: {B}</div>
    <div class="ex"><span class="n">C3</span> Puntos en 4 juegos: <span class="nums">12, 15, 9, 16</span><div class="work"></div>Media: {B}</div>
    <div class="ex"><span class="n">C4</span> En 5 días una niña vendió <b>8, 12, 10, 6 y 14</b> paletas. ¿Cuántas vendió en promedio por día?<div class="work"></div>Media: {B}</div>
  </div>

  <h2>✏️ Ejercicios D · Mediana</h2>
  <p class="mini">¡Primero ordena de menor a mayor! Escribe la lista ordenada y luego el del centro.</p>
  <div class="two">
    <div class="ex"><span class="n">D1</span> <span class="nums">7, 2, 9, 4, 5</span><br>Ordenados: {BW}{B}<br>Mediana: {B}</div>
    <div class="ex"><span class="n">D2</span> <span class="nums">15, 11, 19, 13, 17</span><br>Ordenados: {BW}{B}<br>Mediana: {B}</div>
    <div class="ex"><span class="n">D3</span> <span class="nums">8, 3, 10, 6, 1, 9, 4</span><br>Ordenados: {BW}{BW}<br>Mediana: {B}</div>
    <div class="ex"><span class="n">D4</span> <span class="badge">Reto (cantidad par)</span> <span class="nums">4, 10, 6, 8</span><br>Ordenados: {BW}<br>Mediana: {B}</div>
  </div>
</section>

<!-- 5. EJERCICIOS E: TODO JUNTO -->
<section class="page">
  <h2>🏆 Ejercicios E · Todo junto</h2>

  <div class="ex"><span class="n">E1</span> Las edades de 7 primos son: <span class="nums">9, 12, 9, 10, 11, 9, 10</span>
    <div class="three">
      <div>Moda: {B}</div><div>Media: {B}</div><div>Mediana: {B}</div>
    </div>
    <div class="work tall"></div>
  </div>

  <div class="ex"><span class="n">E2</span> Puntos de un equipo en 5 partidos: <span class="nums">12, 15, 12, 18, 13</span>
    <div class="three">
      <div>Moda: {B}</div><div>Media: {B}</div><div>Mediana: {B}</div>
    </div>
    <div class="work tall"></div>
  </div>

  <div class="ex"><span class="n">E3</span> <span class="badge">Reto final</span> Se encuestaron <b>20 compañeros</b> sobre su mascota favorita:
    <div style="text-align:center"><span class="icons">🐶 🐱 🐹 🐶 🐠 🐱 🐶 🐶 🐹 🐱 🐶 🐱 🐶 🐹 🐠 🐶 🐱 🐶 🐹 🐱</span></div>
    <p>a) Completa la tabla de frecuencias.</p>
    {table_html([["🐶 Perro", B, B, B], ["🐱 Gato", B, B, B], ["🐹 Hámster", B, B, B], ["🐠 Pez", B, B, B]], total=["Total", 20, "1,00", "100 %"])}
    <p>b) ¿Cuál es la moda? {BW} &nbsp; c) ¿Cuántos NO eligieron perro? {B} &nbsp; d) ¿Qué porcentaje eligió gato o hámster? {B}</p>
  </div>

  <div class="ex"><span class="n">E4</span> <span class="badge">Tu propia encuesta</span> Pregúntales a <b>10 personas</b> algo que te guste (color, fruta, juego...). Anota las respuestas y arma la tabla.
    <p>Pregunta: {BW}{BW}{BW}</p>
    <p>Respuestas: <span class="blank w"></span><span class="blank w"></span><span class="blank w"></span><span class="blank w"></span></p>
    {table_html([[BW, B, B, B], [BW, B, B, B], [BW, B, B, B]], headers=("Respuesta", "Absoluta (fa)", "Relativa (fr)", "Porcentual (fp)"), total=["Total", 10, "1,00", "100 %"])}
    <p>¿Cuál fue la moda? {BW}</p>
  </div>
</section>

<!-- 6. RESPUESTAS -->
<section class="page newpage">
  <h2>✅ Respuestas</h2>
  <p class="mini">Para revisar al final (¡intenta primero sin mirar!).</p>
  <div class="answers">
    <div class="ex"><b>A1</b> 🐶 5 · 0,50 · 50 % — 🐱 3 · 0,30 · 30 % — 🐰 2 · 0,20 · 20 %.</div>
    <div class="ex"><b>A2</b> 🍎 0,40 · 40 % — 🍌 0,30 · 30 % — 🍇 0,20 · 20 % — 🍉 0,10 · 10 %. (8 ÷ 20: 80 ÷ 20 = 4 → 0,40.)</div>
    <div class="ex"><b>A3</b> ⚽ 0,40 · 40 % — 🏀 0,28 · 28 % — 🏊 0,20 · 20 % — 🎾 0,12 · 12 %.</div>
    <div class="ex"><b>A4</b> a) 5 (porque 10 − 3 − 2 = 5, o 0,50 × 10). b) Pizza. c) 30 %.</div>
    <div class="ex"><b>B1</b> 3 (aparece 3 veces). <b>B2</b> 12 (3 veces). <b>B3</b> rojo (3 veces). <b>B4</b> Dos modas: 4 y 6 (cada una 2 veces).</div>
    <div class="ex"><b>C1</b> 6 + 8 + 10 = 24; 24 ÷ 3 = <b>8</b>. <b>C2</b> 30 ÷ 5 = <b>6</b>. <b>C3</b> 52 ÷ 4 = <b>13</b>. <b>C4</b> 50 ÷ 5 = <b>10</b> paletas por día.</div>
    <div class="ex"><b>D1</b> 2, 4, 5, 7, 9 → <b>5</b>. <b>D2</b> 11, 13, 15, 17, 19 → <b>15</b>. <b>D3</b> 1, 3, 4, 6, 8, 9, 10 → <b>6</b>. <b>D4</b> 4, 6, 8, 10 → (6 + 8) ÷ 2 = <b>7</b>.</div>
    <div class="ex"><b>E1</b> Moda 9 (3 veces). Media: 70 ÷ 7 = 10. Mediana: 9, 9, 9, <b>10</b>, 10, 11, 12 → 10.</div>
    <div class="ex"><b>E2</b> Moda 12. Media: 70 ÷ 5 = 14. Mediana: 12, 12, <b>13</b>, 15, 18 → 13.</div>
    <div class="ex"><b>E3</b> a) 🐶 8 · 0,40 · 40 % — 🐱 6 · 0,30 · 30 % — 🐹 4 · 0,20 · 20 % — 🐠 2 · 0,10 · 10 %. b) Perro. c) 20 − 8 = 12. d) 30 % + 20 % = 50 %.</div>
    <div class="ex"><b>E4</b> Depende de tu encuesta: revisa que las fa sumen 10, las fr sumen 1,00 y las fp sumen 100 %.</div>
  </div>

  <div class="credit-box">
    <img src="{LOGO}" alt="El Cuaderno Mágico">
    <p><b>El Cuaderno Mágico</b> · Cuaderno de repaso de estadística para 5º grado.<br>Explicaciones y ejercicios preparados con el mismo método que usa la app.<br>Créditos: <b>afishingday.com</b></p>
  </div>
</section>
</body></html>"""

html_path = OUT / "estadistica-5-tablas-moda-media-mediana.html"
pdf_path = OUT / "estadistica-5-tablas-moda-media-mediana.pdf"
html_path.write_text(html, encoding="utf-8")

footer = """<div style="width:100%;font-family:Nunito,Arial,sans-serif;font-size:8px;color:#6b7280;display:flex;justify-content:space-between;padding:0 14mm;">
<span>El Cuaderno Mágico · afishingday.com</span><span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span></div>"""

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto(html_path.as_uri(), wait_until="networkidle")
    page.wait_for_timeout(1200)  # fuentes web
    page.pdf(path=str(pdf_path), format="A4", print_background=True, prefer_css_page_size=True,
             display_header_footer=True, header_template="<span></span>", footer_template=footer,
             margin={"top": "16mm", "bottom": "18mm", "left": "14mm", "right": "14mm"})
    browser.close()
print("PDF:", pdf_path, pdf_path.stat().st_size, "bytes")

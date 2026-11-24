// --- Referencias al DOM ---
const formulario = document.getElementById("formulario");
const inputValor = document.getElementById("valor");
const selectDesde = document.getElementById("desde");
const selectHacia = document.getElementById("hacia");
const botonConvertir = document.getElementById("convertir");
const resultado = document.getElementById("resultado");

// Nombres para mostrar en el resultado
const NOMBRES = {
  celsius: "Celsius",
  fahrenheit: "Fahrenheit",
  kelvin: "Kelvin",
};

// Cero absoluto expresado en cada unidad (límite físico)
const CERO_ABSOLUTO = {
  celsius: -273.15,
  fahrenheit: -459.67,
  kelvin: 0,
};

// --- Habilitar el botón solo si los 3 campos están llenos ---
// Ojo: se compara con "" y no con la veracidad del valor, porque 0 es una temperatura válida.
function camposCompletos() {
  const valorLleno = inputValor.value.trim() !== "" && !Number.isNaN(parseFloat(inputValor.value));
  return valorLleno && selectDesde.value !== "" && selectHacia.value !== "";
}

function actualizarBoton() {
  botonConvertir.disabled = !camposCompletos();
}

// --- Conversión: siempre pasa por Celsius ---
function aCelsius(valor, unidad) {
  if (unidad === "fahrenheit") return (valor - 32) * (5 / 9);
  if (unidad === "kelvin") return valor - 273.15;
  return valor;
}

function desdeCelsius(celsius, unidad) {
  if (unidad === "fahrenheit") return celsius * (9 / 5) + 32;
  if (unidad === "kelvin") return celsius + 273.15;
  return celsius;
}

function convertir(valor, desde, hacia) {
  return desdeCelsius(aCelsius(valor, desde), hacia);
}

// --- Mostrar mensajes ---
function mostrarResultado(texto, esError = false) {
  resultado.textContent = texto;
  resultado.classList.toggle("error", esError);
}

// --- Eventos ---
// Cualquier cambio en los campos revisa el botón y borra el resultado anterior (ya no corresponde).
[inputValor, selectDesde, selectHacia].forEach((campo) => {
  campo.addEventListener("input", () => {
    actualizarBoton();
    mostrarResultado("");
  });
});

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault(); // evita que la página se recargue
  if (!camposCompletos()) return;

  const valor = parseFloat(inputValor.value);
  const desde = selectDesde.value;
  const hacia = selectHacia.value;

  if (valor < CERO_ABSOLUTO[desde]) {
    mostrarResultado(
      `${valor} ${NOMBRES[desde]} está por debajo del cero absoluto (${CERO_ABSOLUTO[desde]} ${NOMBRES[desde]}).`,
      true
    );
    return;
  }

  // Number(...toFixed(2)) deja máximo 2 decimales y quita ceros sobrantes (93.20 -> 93.2)
  const convertido = Number(convertir(valor, desde, hacia).toFixed(2));
  mostrarResultado(`${valor} ${NOMBRES[desde]} son ${convertido} ${NOMBRES[hacia]}`);
});

// Estado inicial
actualizarBoton();

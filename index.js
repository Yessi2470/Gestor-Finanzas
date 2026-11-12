import { Transaccion } from './classes/Transaccion.js'

const formulario = document.querySelector("#formTransaccion")
const tablaTransacciones = document.querySelector("#tablaTransacciones")
const fechaInput = document.querySelector("#fecha")

const totalIngresosEl = document.querySelector("#totalIngresos")
const totalGastosEl = document.querySelector("#totalGastos")
const balanceNetoEl = document.querySelector("#balanceNeto")

const canvasCategorias = document.querySelector("#graficoCategorias")
const canvasEvolucion = document.querySelector("#graficoFinanzas")

let graficoCategorias = null
let graficoEvolucion = null


function hoy() {
    return new Date().toLocaleDateString("en-CA")
}


function formatearFecha(fecha) {
    if (!fecha) return "-"
    const [anio, mes, dia] = fecha.split("-")
    return `${dia}/${mes}/${anio}`
}

fechaInput.value = hoy()

Transaccion.cargar()

Transaccion.obtenerHistorial().forEach(function (transaccion) {
    mostrarTransaccion(transaccion)
})

actualizarBalance()
actualizarGraficos()

formulario.addEventListener("submit", function (event) {
    event.preventDefault()

    const descripcion = document.querySelector("#descripcion").value
    const monto = document.querySelector("#monto").value
    const tipo = document.querySelector("#tipo").value
    const categoria = document.querySelector("#categoria").value
    const fecha = fechaInput.value

    const nuevaTransaccion = new Transaccion(
        tipo,
        descripcion,
        monto,
        categoria,
        fecha
    )

    mostrarTransaccion(nuevaTransaccion)
    actualizarBalance()
    actualizarGraficos()

    formulario.reset()
    fechaInput.value = hoy()
})

function mostrarTransaccion(transaccion) {
    const fila = document.createElement("tr")
    fila.className = "hover:bg-gray-50"

    const esEgreso = transaccion.tipo === "egreso"
    const claseMonto = esEgreso ? "text-red-600" : "text-green-700"
    const claseTipo = esEgreso
        ? "bg-red-100 text-red-700"
        : "bg-green-100 text-green-700"

    fila.innerHTML = `
        <td class="px-4 py-3 whitespace-nowrap">${formatearFecha(transaccion.fecha)}</td>
        <td class="px-4 py-3">
            <span class="px-2 py-1 rounded-full text-xs font-medium capitalize ${claseTipo}">
                ${transaccion.tipo}
            </span>
        </td>
        <td class="px-4 py-3">${transaccion.descripcion}</td>
        <td class="px-4 py-3 font-medium ${claseMonto}">$${Number(transaccion.monto).toFixed(2)}</td>
        <td class="px-4 py-3">${transaccion.categoria}</td>
        <td class="px-4 py-3">
            <button type="button"
                class="btn-eliminar text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-md px-3 py-1 text-xs transition-colors">
                Eliminar
            </button>
        </td>
    `

    const botonEliminar = fila.querySelector(".btn-eliminar")

    botonEliminar.addEventListener("click", function () {
        Transaccion.eliminar(transaccion.id)
        fila.remove()
        actualizarBalance()
        actualizarGraficos()
    })

    tablaTransacciones.appendChild(fila)
}

function actualizarBalance() {
    totalIngresosEl.textContent = "$" + Transaccion.totalIngresos().toFixed(2)
    totalGastosEl.textContent = "$" + Transaccion.totalGastos().toFixed(2)
    balanceNetoEl.textContent = "$" + Transaccion.balanceNeto().toFixed(2)
}

function actualizarGraficos() {
    actualizarGraficoCategorias()
    actualizarGraficoEvolucion()
}

function actualizarGraficoCategorias() {
    const resumen = Transaccion.resumenPorCategoria()
    const etiquetas = Object.keys(resumen)
    const datos = etiquetas.map((categoria) => resumen[categoria])

    if (!graficoCategorias) {
        graficoCategorias = new Chart(canvasCategorias, {
            type: "bar",
            data: {
                labels: etiquetas,
                datasets: [{
                    label: "Monto total por categoría ($)",
                    data: datos,
                    backgroundColor: "#3b82f6"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } }
            }
        })
    } else {
        graficoCategorias.data.labels = etiquetas
        graficoCategorias.data.datasets[0].data = datos
        graficoCategorias.update()
    }
}

function actualizarGraficoEvolucion() {
    const evolucion = Transaccion.evolucionTemporal()
    const etiquetas = evolucion.fechas.map(formatearFecha)

    if (!graficoEvolucion) {
        graficoEvolucion = new Chart(canvasEvolucion, {
            type: "line",
            data: {
                labels: etiquetas,
                datasets: [
                    {
                        label: "Ingresos",
                        data: evolucion.ingresos,
                        borderColor: "#16a34a",
                        backgroundColor: "#16a34a",
                        tension: 0.2
                    },
                    {
                        label: "Egresos",
                        data: evolucion.egresos,
                        borderColor: "#dc2626",
                        backgroundColor: "#dc2626",
                        tension: 0.2
                    },
                    {
                        label: "Balance neto",
                        data: evolucion.neto,
                        borderColor: "#2563eb",
                        backgroundColor: "#2563eb",
                        tension: 0.2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        })
    } else {
        graficoEvolucion.data.labels = etiquetas
        graficoEvolucion.data.datasets[0].data = evolucion.ingresos
        graficoEvolucion.data.datasets[1].data = evolucion.egresos
        graficoEvolucion.data.datasets[2].data = evolucion.neto
        graficoEvolucion.update()
    }
}
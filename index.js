import { Transaccion } from './classes/Transaccion.js'

const formulario = document.querySelector("#formTransaccion")
const tablaTransacciones = document.querySelector("#tablaTransacciones")

formulario.addEventListener("submit",function (event){
    event.preventDefault()

    const descripcion = document.querySelector("#descripcion").value
    const monto = document.querySelector("#monto").value
    const tipo = document.querySelector("#tipo").value
    const categoria = document.querySelector("#categoria").value

    const nuevaTransaccion = new Transaccion (
        tipo,
        descripcion,
        monto,
        categoria
    )

    mostrarTransaccion(nuevaTransaccion)
formulario.reset()
})



 function mostrarTransaccion(transaccion) {
    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${transaccion.tipo}</td>
        <td>${transaccion.descripcion}</td>
        <td>$${transaccion.monto.toFixed(2)}</td>
        <td>${transaccion.categoria}</td>
        <td>
            <button type="button" class="btn-eliminar">
                Eliminar
            </button>
        </td>
    `

    tablaTransacciones.appendChild(fila);
}

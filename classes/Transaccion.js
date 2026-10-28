export class Transaccion {
    static historial = []
    static idincremento = 1

    constructor(tipo, descripcion, monto, categoria) {
        this.id = Transaccion.idincremento++
        this.tipo = tipo
        this.descripcion = descripcion
        this.monto = Number(monto)
        this.categoria = categoria

        Transaccion.historial.push(this)
        Transaccion.guardar()
    }
    static obtenerHistorial() {
        return Transaccion.historial
    }
    static eliminar(id) {
        Transaccion.historial = Transaccion.historial.filter(
            (t) => t.id !== Number(id))
        Transaccion.guardar()
    }
    static guardar() {
        localStorage.setItem("transacciones", JSON.stringify(Transaccion.historial))
    }
    static cargar() {
        const guardado = localStorage.getItem("transacciones")
        if (guardado) {
            const array = JSON.parse(guardado)
            Transaccion.historial = []
            array.forEach((t) => {
                const nueva = new Transaccion(t.tipo, t.descripcion, t.monto, t.categoria)
                nueva.id = t.id
            })
            const maxid = Transaccion.historial.reduce(
                (max, t) => (t.id > max ? t.id : max),
                0
            )
            Transaccion.idincremento = maxid + 1
        }
    }
    static totalingresos() {
        return Transaccion.historial
            .filter((t) => t.tipo === "gastos")
            .reduce((acumulado, t) => acumulado + Number(t, monto), 0)
    }
    static balenceNeto() {
        return transaccion.totalingresos() - transaccion.totalGastos()
    }
    static resumenPorCategoria() {
        const resumen = {}
        transaccion.historial.forEach((t) => {
            if (!resumen[t.categoria]) {
                resumen[t.categoria] = 0
            }
            resumen[t.categoria] += Number(t.monto)
        })
        return resumen
    }
}
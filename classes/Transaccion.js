export class Transaccion {
    static historial = []
    static idincremento = 1

    
    constructor(tipo, descripcion, monto, categoria, fecha = "", id = null) {
        this.id = id !== null ? id : Transaccion.idincremento++
        this.tipo = tipo
        this.descripcion = descripcion
        this.monto = Number(monto)
        this.categoria = categoria
        this.fecha = fecha

        Transaccion.historial.push(this)

        if (id === null) {
            Transaccion.guardar()
        }
    }

    static obtenerHistorial() {
        return Transaccion.historial
    }

    static eliminar(id) {
        Transaccion.historial = Transaccion.historial.filter(
            (t) => t.id !== Number(id)
        )
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
                
                new Transaccion(t.tipo, t.descripcion, t.monto, t.categoria, t.fecha ?? "", t.id)
            })
            const maxid = Transaccion.historial.reduce(
                (max, t) => (t.id > max ? t.id : max),
                0
            )
            Transaccion.idincremento = maxid + 1
        }
    }

    static totalIngresos() {
        return Transaccion.historial
            .filter((t) => t.tipo === "ingreso")
            .reduce((acumulado, t) => acumulado + t.monto, 0)
    }

    static totalGastos() {
        return Transaccion.historial
            .filter((t) => t.tipo === "egreso")
            .reduce((acumulado, t) => acumulado + t.monto, 0)
    }

    static balanceNeto() {
        return Transaccion.totalIngresos() - Transaccion.totalGastos()
    }

    
    static resumenPorCategoria() {
        const resumen = {}
        Transaccion.historial.forEach((t) => {
            if (!resumen[t.categoria]) {
                resumen[t.categoria] = 0
            }
            resumen[t.categoria] += t.monto
        })
        return resumen
    }

    static evolucionTemporal() {
        const porFecha = {}

        Transaccion.historial.forEach((t) => {
            if (!t.fecha) return

            if (!porFecha[t.fecha]) {
                porFecha[t.fecha] = { ingresos: 0, egresos: 0 }
            }
            if (t.tipo === "ingreso") {
                porFecha[t.fecha].ingresos += t.monto
            } else if (t.tipo === "egreso") {
                porFecha[t.fecha].egresos += t.monto
            }
        })

        const fechas = Object.keys(porFecha).sort()

        return {
            fechas: fechas,
            ingresos: fechas.map((f) => porFecha[f].ingresos),
            egresos: fechas.map((f) => porFecha[f].egresos),
            neto: fechas.map((f) => porFecha[f].ingresos - porFecha[f].egresos)
        }
    }
}
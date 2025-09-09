class Cliente {
    constructor(id, nombre, apellido, nit) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.nit = nit;
    }

    nombre_completo() {
        return `${this.nombre} ${this.apellido}`;
    }
}

module.exports = { Cliente };

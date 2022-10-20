

class Prenotazione {


    constructor(data, orario, carico, scarico, tipo, autista, barelliere) {
        this.data = moment(data);
        this.orario = orario;
        this.carico = carico;
        this.scarico = scarico;
        this.tipo = tipo;
        this.autista = autista;
        this.barelliere = barelliere;
    }

    /**
     * converte un json in un servizio
     */
    static from(json) {
        const p = Object.assign(new Prenotazione(), json);
        p.data = moment(p.data);
        return p;
    }
}

export default Prenotazione;
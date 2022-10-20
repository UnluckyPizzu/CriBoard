import Prenotazione from "./prenotazione.js";

class prenotazioneManager {

    constructor() {
        this.prenotazioni = [];

    }

    /*
    buildMyPrenotazioni() {
        this.prenotazioni.push(
            new Prenotazione('21/07/2010','11.30','Trecate','Novara','Dialisi','NULL','NULL'),
            new Prenotazione('15/07/2015','12.30','Magenta','Novara','Trasporto','NULL','Pippo'),
            new Prenotazione('31/04/2010','00.30','Trecate','Trecate','Dialisi','Pluto','Pippo'),
            new Prenotazione('01/02/2010','14.00','Trecate','Sozzago','Sportivo','Carolina','NULL'),
            new Prenotazione('12/07/2010','16.32','Trecate','Milano','Dialisi','Gennaro','NULL'),
            new Prenotazione('05/07/2010','13.32','Torino','Novara','Transporto','Pippo','Carlo')
        );
    }
    */


    /**
     * fa la fetch per ottenere i servizi dal db
     */
    async getServizi(){
        // call API /avvisi
        let response = await fetch('/servizi');
        const serviziJson = await response.json();
        if(response.ok) {
            this.prenotazioni = serviziJson.map((serv) => Prenotazione.from(serv));
            return this.prenotazioni;
        }else
        {
            throw serviziJson;
        }
    }


    /**
     * fa la fetch per eliminare un servizio dal db
     */
    deleteServizio(id) {
        return new Promise((resolve, reject) =>{
            fetch('/servizi/'+id, {
                method:'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((response) => {
                if(response.ok) {
                    resolve(null);
                } else
                {
                    response.json()
                    .then((obj) =>{ reject(obj);})
                    .catch((err) => {reject({errors: [{param: "Application", msg: "Cannot parse server response"}] }) });
                }
            }).catch((err) => {reject({errors: [{param: "Server", msg: "Cannot communicate"}] }) });
        });
    }


    /**
     * fa la fetch per aggiungere un servizio al db
     */
    addServizio(servizio) {
        return new Promise((resolve, reject) =>{
            fetch('/servizi', {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(servizio),
            }).then((response) => {
                if(response.ok) {
                    resolve(null);
                } else
                {
                    response.json()
                    .then((obj) =>{ reject(obj);})
                    .catch((err) => {reject({errors: [{param: "Application", msg: "Cannot parse server response"}] }) });
                }
            }).catch((err) => {reject({errors: [{param: "Server", msg: "Cannot communicate"}] }) });
        });
    }


    /**
     * fa la fetch per ottenere tutti i servizi che hanno come barelliere il barelliere dato in input dal db
     */
    async getServiziByBarelliere(barelliere){
        // call API /avvisi
        let response = await fetch('/servizi/nome/'+barelliere);
        const serviziJson = await response.json();
        if(response.ok) {
            this.prenotazioni = serviziJson.map((serv) => Prenotazione.from(serv));
            return this.prenotazioni;
        }else
        {
            throw serviziJson;
        }
    }


    /**
     * fa la fetch per ottenere tutti i servizi che hanno come barelliere o come autista un campo vuoto
     */
    async getServiziByNULL(Tipo, Nome){
        // call API /avvisi
        if(Tipo == "autista")
        var response = await fetch('/servizi/null/' + Tipo + '/' + Nome);
        else
        var response = await fetch('/servizi/null/' + Tipo);
        const serviziJson = await response.json();
        if(response.ok) {
            this.prenotazioni = serviziJson.map((serv) => Prenotazione.from(serv));
            return this.prenotazioni;
        }else
        {
            throw serviziJson;
        }
    }

    /**
     * fa la fetch per cercare tutti i servizi con barelliere,autista e tipo dato in input
     */
    async searchServizio(barelliere, autista, tipo){
        if(barelliere == "")
        {
            barelliere = "star";
        }
        if(autista == "")
        {
            autista = "star";
        }
        if(tipo == "")
        {
            tipo = "star";
        }
        var response = await fetch('/servizi/search/'+ barelliere +'/'+ autista +'/'+ tipo);
        const serviziJson = await response.json();
        if(response.ok) {
            this.prenotazioni = serviziJson.map((serv) => Prenotazione.from(serv));
            return this.prenotazioni;
        }else
        {
            throw serviziJson;
        }
    }

    /**
     * fa la fetch per aggiornare il campo barelliere di un servizio con id dato in input con il nome dato in input
     */
    updateServizioByBarelliere(id, nome) {
        return new Promise((resolve, reject) =>{
            fetch('/servizi/barelliere/'+id, {
                method:'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nome),
            }).then((response) => {
                if(response.ok) {
                    resolve(null);
                } else
                {
                    response.json()
                    .then((obj) =>{ reject(obj);})
                    .catch((err) => {reject({errors: [{param: "Application", msg: "Cannot parse server response"}] }) });
                }
            }).catch((err) => {reject({errors: [{param: "Server", msg: "Cannot communicate"}] }) });
        });
    }




    /**
     * fa la fetch per aggiornare il campo autista di un servizio con id dato in input con il nome dato in input
     */
    updateServizioByAutista(id, nome) {
        return new Promise((resolve, reject) =>{
            fetch('/servizi/autista/'+id, {
                method:'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nome),
            }).then((response) => {
                if(response.ok) {
                    resolve(null);
                } else
                {
                    response.json()
                    .then((obj) =>{ reject(obj);})
                    .catch((err) => {reject({errors: [{param: "Application", msg: "Cannot parse server response"}] }) });
                }
            }).catch((err) => {reject({errors: [{param: "Server", msg: "Cannot communicate"}] }) });
        });
    }



    /*
    getByVolontario(id){
        return this.prenotazioni.filter(prenotazione => prenotazione.autista == id || prenotazione.barelliere == id);
    }
    */
}

export default prenotazioneManager;
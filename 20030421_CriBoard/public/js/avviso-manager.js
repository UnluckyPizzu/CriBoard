import Avviso from './avviso.js'

class AvvisoManager {

    constructor() {
        this.Avvisi = [];

    }
    /*

    buildMyAvvisi() {
        this.Avvisi.push(
        new Avviso("Pippo lavati"),
        new Avviso("Ciao a tutti"),
        new Avviso("Servizi igenici occupati"),
        new Avviso("Miao e bau")
        );
    }
    */


    /**
     * fa la fetch per ottenere gli avvisi dal db
     */
    async getAvvisi(){
        // call API /avvisi
        let response = await fetch('/avvisi');
        const AvvisiJson = await response.json();
        if(response.ok) {
            this.Avvisi = AvvisiJson.map((avv) => Avviso.from(avv));
            return this.Avvisi;
        }else
        {
            throw AvvisiJson;
        }
    }


    /**
     * fa la fetch per aggiungere un avviso al db
     */
    addAvviso(avviso) {
        return new Promise((resolve, reject) =>{
            fetch('/avvisi', {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(avviso),
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
     * fa la fetch per eliminare l'avviso dal db
     */
    deleteAvviso(id) {
        return new Promise((resolve, reject) =>{
            fetch('/avvisi/'+id, {
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
}

export default AvvisoManager;
import page from '//unpkg.com/page/page.mjs';
import User from "./user.js";

class AppLogin {
    constructor(form, formAdesioni){
        this.form = form;
        this.formAdesioni = formAdesioni;
        const close = document.getElementById('close');
        const announce = document.getElementById('announcements');

        close.addEventListener('click', this.popupToggle);
        announce.addEventListener('click', this.popupToggle);
        const returnHome = document.getElementById('returnHome');
        returnHome.addEventListener('click', event => {
            window.location.replace("/");
        });


        form.addEventListener('submit', this.onLoginSubmitted);

        formAdesioni.addEventListener('submit', this.onAdesioneSubmitted); 

    }

    /**
     * invia la richiesta di adesione e mostra se è stata inserita con successo o vi è stato un errore
     */

    onAdesioneSubmitted = async (event) => {
        event.preventDefault();
        const form = event.target;
        
        try
        {
            const adesione = {
                email : form.email.value
            };

            await this.addAdesione(adesione);

            Swal.fire(
                'Grazie!',
                'La tua richiesta di adesione è stata ricevuta e verrai contattato nei prossimi giorni!',
                'success'
              )
            
        }catch(error){
            if(error)
                {
                    const errorMg = error.error;
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: errorMg,
                    })
                }
        }
}

    /**
     * fa la fetch per aggiungere l'adesione al db
     */
    addAdesione(adesione) {
        return new Promise((resolve, reject) =>{
            fetch('/adesioni', {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adesione),
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
     * prende i campi dal form ed effettua il login, lanciando un avviso in caso positivo o negativo ed in 
     * caso positivo lo reinderizza alla pagina del centralino o dei volontari
     * 
     */

    onLoginSubmitted = async (event) => {
        event.preventDefault();
        const form = event.target;

            try{
                const code = await this.doLogin(form.code.value, form.password.value);
                // welcome the user
                this.getUserData().then(user =>{

                    Swal.fire(
                        'Ciao ' + user.nome + ' !',
                        'Hai fatto il login con successo!',
                        'success'
                      )
                    
                    setTimeout(() => {
                        if(user.tipo == "autista" || user.tipo == "barelliere" )
                            window.location.replace("/volontario");
                        else if(user.tipo == "centralinista")
                            window.location.replace("/centralino");
                    }, 2000);
            

                });
            }catch(error)
                {
                    if(error)
                    {
                        const errorMg = error;

                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: errorMg,
                          })
                    }
                }

        
    }

    /**
     * fa apparire il popup per la richiesta di adesione
     */

    popupToggle(){
        const popup = document.getElementById('popup');
        popup.classList.toggle('active');
    }

    
    /**
     * fa la fetch per fare il login e creare la sessione
     */
    doLogin = async (username, password) => {
        let response = await fetch('/api/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
        });
        if(response.ok) {
            const username = await response.json();
            return username;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.message;
            }
            catch(err) {
                throw err;
            }
        }
    }

    /**
     * fa la fetch per ottenere i dati dell'utente della sessione
     */

    async getUserData(){
        // call API /avvisi
        let response = await fetch('/user');
        const userJson = await response.json();
        if(response.ok) {
            const user = User.from(userJson);
            return user;
        }else
        {
            throw serviziJson;
        }
    }
}


export default AppLogin;
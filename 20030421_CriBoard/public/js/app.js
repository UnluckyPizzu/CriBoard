import AvvisoManager from "./avviso-manager.js";
import prenotazioneManager from "./prenotazione-manager.js";
import Avviso from "./avviso.js";
import Prenotazione from "./prenotazione.js";
import page from '//unpkg.com/page/page.mjs';
import User from "./user.js";

class App{
    constructor(avvisiContainer, prenotazioniMyContainer, prenotazioniDispContainer, nome){
        this.getUserData().then(user =>{
            const userAttuale = user;

        window.addEventListener('scroll', function(){
            const header = document.querySelector('header');
            header.classList.toggle("sticky",window.scrollY > 0);
        })


        /*
        this.getUserData().then(user =>{
            userAttuale = user;
            console.log(userAttuale);
        });
        */

        const Nome = userAttuale.nome;
        this.userNome = Nome;
        this.nome = nome;
        this.showNome(Nome);

        const Tipo = userAttuale.tipo;


        this.avvisiContainer = avvisiContainer;
        this.AvvisoManager = new AvvisoManager();
        this.AvvisoManager.getAvvisi().then(avvisi => {

            this.showAvvisi(avvisi);

        });

        this.prenotazioniMyContainer = prenotazioniMyContainer;
        this.prenotazioneManager = new prenotazioneManager;
        this.prenotazioniDispContainer = prenotazioniDispContainer;

        this.prenotazioneManager.getServiziByBarelliere(Nome).then(servizi => {

            this.showMyPrenotazioni(servizi);


        });

        this.prenotazioneManager.getServiziByNULL(Tipo ,Nome).then(servizi => {

            this.showNullPrenotazioni(servizi,Nome, Tipo);


        });

        const logout = document.getElementById("login");
        
        logout.addEventListener("click", this.logout);

        });

        const menuToggle = document.getElementById("menuToggle");
        
        menuToggle.addEventListener("click", this.toggleMenu);
    }



    /**
     * Mostra menu mobile
     */

    toggleMenu(){
        const menuToggle = document.querySelector('.menuToggle');
        const navigator = document.querySelector('.navigator');
        menuToggle.classList.toggle('active');
        navigator.classList.toggle('active');
    }
    
    /**
     * fa la fetch per ottenere i dati dell'utente in sessione
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

    /**
     * mostra il nome del utente connesso
     */
    showNome(Nome){
        this.nome.innerText = 'Benvenuto '+ Nome;
    }


    /**
     * mostra gli avvisi dati in input sulla pagina
     */
    showAvvisi(avvisi) {

        if(this.avvisiContainer.innerHTML !== ''){
            this.avvisiContainer.innerHTML = '';
        }
        let number = 0;
        for(let avviso of avvisi) {
            
            const contentBx = document.createElement('div');
            contentBx.classList.add('contentBx');

            const label = document.createElement('div');
            label.classList.add('label');
            number++;
            label.innerText = 'Avviso n° ' + number;

            const content = document.createElement('div');
            content.classList.add('content');

            const p = document.createElement('p');
            p.innerText = avviso.contenuto;

            content.appendChild(p);
            label.appendChild(content);
            contentBx.appendChild(label);
            this.avvisiContainer.appendChild(contentBx);
        }


        const accordion = document.getElementsByClassName('contentBx')

                for(let i=0; i < accordion.length; i++){
                    accordion[i].addEventListener('click',function(){
                        this.classList.toggle('active');
                    })
                
                    
        }

        
    }



    /**
     * mostra le prenotazioni dati in input nella sezione "Mie prenotazioni"
     */

    showMyPrenotazioni(prenotazioni){

        if(this.prenotazioniMyContainer.innerHTML !== ''){
            this.prenotazioniMyContainer.innerHTML = '';
        }


        for(let prenotazione of prenotazioni) {
            const tr = document.createElement('tr');

            const tdData = document.createElement('td');
            tdData.innerText = prenotazione.data.format('DD/MM/YYYY');

            const tdOrario = document.createElement('td');
            tdOrario.innerText = prenotazione.orario;

            const tdCarico = document.createElement('td');
            tdCarico.innerText = prenotazione.carico;

            const tdScarico = document.createElement('td');
            tdScarico.innerText = prenotazione.scarico;

            const tdTipo = document.createElement('td');
            tdTipo.innerText = prenotazione.tipo;

            const tdAutista = document.createElement('td');
            if(prenotazione.autista === null || prenotazione.autista == '')
            {
                tdAutista.innerText = "Da coprire";
                tdAutista.classList.add('red');
            }
            else
                tdAutista.innerText = prenotazione.autista;

            const tdBarelliere = document.createElement('td');
            if(prenotazione.barelliere === null || prenotazione.barelliere == '')
            {
                tdBarelliere.innerText = "Da coprire";
                tdBarelliere.classList.add('red');
            }
            else
            tdBarelliere.innerText = prenotazione.barelliere;

            tr.appendChild(tdData);
            tr.appendChild(tdOrario);
            tr.appendChild(tdCarico);
            tr.appendChild(tdScarico);
            tr.appendChild(tdTipo);
            tr.appendChild(tdAutista);
            tr.appendChild(tdBarelliere);
            this.prenotazioniMyContainer.appendChild(tr);

            }
    }

    /**
     * mostra le prenotazioni dati in input delle prenotazioni ancora disponibili
     */
    showNullPrenotazioni(prenotazioni, Nome , Tipo){

        if(this.prenotazioniDispContainer.innerHTML !== ''){
            this.prenotazioniDispContainer.innerHTML = '';
        }



        for(let prenotazione of prenotazioni) {

            const tr = document.createElement('tr');

            const tdData = document.createElement('td');
            tdData.innerText = prenotazione.data.format('DD/MM/YYYY');

            const tdOrario = document.createElement('td');
            tdOrario.innerText = prenotazione.orario;

            const tdCarico = document.createElement('td');
            tdCarico.innerText = prenotazione.carico;

            const tdScarico = document.createElement('td');
            tdScarico.innerText = prenotazione.scarico;

            const tdTipo = document.createElement('td');
            tdTipo.innerText = prenotazione.tipo;

            const tdAutista = document.createElement('td');
            if(Tipo == "barelliere" && (prenotazione.autista === null || prenotazione.autista == ''))
            {
                tdAutista.innerText = "Da coprire";
                tdAutista.classList.add('red');
            }
            else if(Tipo == "autista" && (prenotazione.autista === null || prenotazione.autista == ''))
                {
                    const button = document.createElement('input');
                    button.type = 'button';
                    button.classList.add("btnPreAutista")
                    button.id = prenotazione.id + " " + Tipo;
                    button.value = 'Prenota';
                    tdAutista.appendChild(button);
                }
                else
                    tdAutista.innerText = prenotazione.autista;
            
            
                const tdBarelliere = document.createElement('td');
                
                if(prenotazione.barelliere === null || prenotazione.barelliere == '')
                {
            
                    const button = document.createElement('input');
                    button.type = 'button';
                    button.classList.add("btnPre")
                    button.id = prenotazione.id + " "+ Tipo;
                    button.value = 'Prenota';

                    tdBarelliere.appendChild(button);
                }
                else
                    tdBarelliere.innerText =prenotazione.barelliere;



                /*
            const tdBarelliere = document.createElement('td');
            
            const button = document.createElement('input');
            button.type = 'button';
            button.classList.add("btnPre")
            button.id = prenotazione.id + " " + Nome;
            button.value = 'Prenota';

            tdBarelliere.appendChild(button);

            */

            tr.appendChild(tdData);
            tr.appendChild(tdOrario);
            tr.appendChild(tdCarico);
            tr.appendChild(tdScarico);
            tr.appendChild(tdTipo);
            tr.appendChild(tdAutista);
            tr.appendChild(tdBarelliere);
            this.prenotazioniDispContainer.appendChild(tr);

            }

            const btnPre = document.getElementsByClassName("btnPre");
            const btnPreAutista = document.getElementsByClassName("btnPreAutista");


            for(let i=0; i < btnPre.length; i++){
                btnPre[i].addEventListener('click', this.onbtnPreSubmitted)
                   }

                   
            for(let i=0; i < btnPreAutista.length; i++){
                btnPreAutista[i].addEventListener('click', this.onbtnPreAutistaSubmitted)
                    }
    }


    /**
     * chiede all'utente se è sicuro e fa prenotare l'utente al servizio scelto come barelliere
     */

    onbtnPreSubmitted = async (event) => {
        event.preventDefault();
        Swal.fire({
            title: 'Sei sicura/o?',
            text: "Non potrai cencellarti dal servizio dopo che ti sarai prenotato!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Annulla',
            confirmButtonText: 'Sì, voglio prenotarmi!'
          }).then(async (result) => {
            if (result.isConfirmed) {
                const form = event.target;
                const id = form.id;
                const res = id.split(" ");
        
        
                const barelliere = {
                    barelliere: this.userNome
                };
        
        
                try
                {
                    await this.prenotazioneManager.updateServizioByBarelliere(res[0], barelliere);
                    const Myservizi = await this.prenotazioneManager.getServiziByBarelliere(this.userNome);
                    const nullServizi = await this.prenotazioneManager.getServiziByNULL(res[1],this.userNome);
                    this.prenotazioniMyContainer.innerHTML = '';
                    this.prenotazioniDispContainer.innerHTML = '';
                    this.showMyPrenotazioni(Myservizi);
                    this.showNullPrenotazioni(nullServizi, this.userNome, res[1]);
                }catch(error){
                    if(error){
                        const errorMsg = error.error;
                    }
                }
              
            }
          })
        
    };

    /**
     * chiede all'utente se è sicuro e fa prenotare l'utente al servizio scelto come autista
     */

    onbtnPreAutistaSubmitted = async (event) => {
        event.preventDefault();
        Swal.fire({
            title: 'Sei sicura/o?',
            text: "Non potrai cencellarti dal servizio dopo che ti sarai prenotato!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Annulla',
            confirmButtonText: 'Sì, voglio prenotarmi!'
          }).then(async (result) => {
            if (result.isConfirmed) {
                const form = event.target;
                const id = form.id;
                const res = id.split(" ");


                const autista = {
                    autista: this.userNome
                };


                try
                {
                    await this.prenotazioneManager.updateServizioByAutista(res[0], autista);
                    const Myservizi = await this.prenotazioneManager.getServiziByBarelliere(this.userNome);
                    const nullServizi = await this.prenotazioneManager.getServiziByNULL(res[1],this.userNome);
                    this.prenotazioniMyContainer.innerHTML = '';
                    this.prenotazioniDispContainer.innerHTML = '';
                    this.showMyPrenotazioni(Myservizi);
                    this.showNullPrenotazioni(nullServizi, this.userNome, res[1]);
                }catch(error){
                    if(error){
                        const errorMsg = error.error;
                    }
                }
            }
          });
    };

    /**
     * permette di fare il logout e essere reindirizzato al login
     */
    logout = async () => {
        await this.doLogout();
        window.location.replace("/login");
    }

    /**
     * fa la fetch per eliminare la sessione corrente
     */
    doLogout = async () => {
        await fetch('/api/sessions/current', { method: 'DELETE' });
    }

    /*
    <tr>
                    <td>11/01/2021</td>
                    <td>Trecate</td>
                    <td>Via Milano</td>
                    <td>3</td>
                    <td>Pizz</td>
                    <td>Pippo</td>
                  </tr>
    */

    
}

export default App;
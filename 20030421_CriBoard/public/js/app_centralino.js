import AvvisoManager from "./avviso-manager.js";
import prenotazioneManager from "./prenotazione-manager.js";
import Avviso from "./avviso.js";
import Prenotazione from "./prenotazione.js";
import User from "./user.js";


class AppCentralino{
    constructor(avvisiContainer, prenotazioniContainer, nome, prenotazioneSearchContainer){
        this.getUserData().then(user =>{
        window.addEventListener('scroll', function(){
            const header = document.querySelector('header');
            header.classList.toggle("sticky",window.scrollY > 0);
        });

        this.tipo = user.tipo;
        if(this.tipo == "centralinista"){

        const Nome = user.nome;
        this.nome = nome;
        this.showNome(Nome);

        this.prenotazioneSearchContainer = prenotazioneSearchContainer;
        this.avvisiContainer = avvisiContainer;
        this.AvvisoManager = new AvvisoManager();
        this.AvvisoManager.getAvvisi().then(avvisi => {

            const addAvvisi = document.getElementById('add-avvisi');
            addAvvisi.addEventListener('submit', this.OnFormSubmittedAvvisi);

            this.showAvvisi(avvisi);

        });

        this.prenotazioniContainer = prenotazioniContainer;
        this.prenotazioneManager = new prenotazioneManager;
        this.prenotazioneManager.getServizi().then(servizi => {

            const addServizio = document.getElementById('add-servizio');
            addServizio.addEventListener('submit', this.OnFormSubmittedServizi);

            const searchServizio = document.getElementById('ricerca-servizio');
            searchServizio.addEventListener('submit', this.OnFormSubmittedSearchServizi);

            this.showPrenotazioni(servizi);

        });

        const menuToggle = document.getElementById("menuToggle");
        
        menuToggle.addEventListener("click", this.toggleMenu);
    }
    const logout = document.getElementById("login");
        
    logout.addEventListener("click", this.logout);
    });
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
     * Ottiene i dati dell'utente
     */
    async getUserData(){
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
     * aggiunge l'avviso al db dopo l'invio del form
     */

    OnFormSubmittedAvvisi = async (event) => {
        event.preventDefault();
        const form = event.target;
        const avviso = new Avviso(form.contenuto.value);
        try
        {
            await this.AvvisoManager.addAvviso(avviso);
            Swal.fire(
                'Inserito!',
                'L\' avviso è stato inserito in bacheca!',
                'success'
              )
            const avvisi = await this.AvvisoManager.getAvvisi();
            this.avvisiContainer.innerHTML = '';
            this.showAvvisi(avvisi);
        }catch(error){
            if(error){
                const errorMsg = error.error;
            }
        } finally {
            form.reset();
        }
    }

    /**
     * aggiunge il servizio al db dopo l'invio del form
     */

    OnFormSubmittedServizi = async (event) => {
        event.preventDefault();
        Swal.fire(
            'Inserito!',
            'Il servizio è stato inserito in bacheca!',
            'success'
          )
        const form = event.target;
        const servizio = new Prenotazione(form.data.value, form.orario.value, form.carico.value, form.scarico.value, form.tipo.value, form.autista.value, form.barelliere.value);
        try
        {
            await this.prenotazioneManager.addServizio(servizio);
            const servizi = await this.prenotazioneManager.getServizi();
            this.prenotazioniContainer.innerHTML = '';
            this.showPrenotazioni(servizi);
        }catch(error){
            if(error){
                const errorMsg = error.error;
            }
        } finally {
            form.reset();
        }
    }


    OnFormSubmittedSearchServizi = async (event) => {
        event.preventDefault();
        const form = event.target;
        try
        {
            const servizi = await this.prenotazioneManager.searchServizio(form.barelliere.value,form.autista.value,form.tipo.value);
            
            this.prenotazioneSearchContainer.innerHTML = '';
            this.showSearchPrenotazioni(servizi);
        }catch(error){
            if(error){
                const errorMsg = error.error;
            }
        } finally {
            form.reset();
        }
    }

    /**
     * modifica il nome nel banner di benvenuto con il nome dell'utente
     */

    showNome(Nome){
        this.nome.innerText = 'Benvenuto '+ Nome;
    }

    /**
     * data una lista di avvisi la visualizza nella bacheca
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

            const button = document.createElement('input');
            button.type = 'button';
            button.value = 'Cancella';
            button.classList.add("btnAvv");
            button.id = avviso.id;

            
            content.appendChild(p);
            content.appendChild(button);
            label.appendChild(content);
            contentBx.appendChild(label);
            this.avvisiContainer.appendChild(contentBx);
        }
        /*
        <div class="contentBx">
                    <div class="label">Avviso n° 1</div>
                    <div class="content">
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eveniet atque debitis, ipsam culpa assumenda praesentium dicta molestiae eligendi unde inventore est, animi nostrum qui repellendus vel. Nulla officiis voluptate fugit.</p>
                    </div>
                </div>
                */

        const accordion = document.getElementsByClassName('contentBx')

                for(let i=0; i < accordion.length; i++){
                    accordion[i].addEventListener('click',function(){
                        this.classList.toggle('active');
                    })
                
                    
        }

        const btnAvv = document.getElementsByClassName("btnAvv");


            for(let i=0; i < btnAvv.length; i++){
                btnAvv[i].addEventListener('click', this.onAvvSubmitted)
                   }
    }

    /**
     * quando si vuole eliminare un avviso cliccando sul suo tasto, chiede all'utente di esserne sicuro e lo elimina
     */

    onAvvSubmitted = async (event) => {
        event.preventDefault();
        Swal.fire({
            title: 'Sei sicura/o?',
            text: "Non potrai tornare indietro!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Annulla',
            confirmButtonText: 'Sì, voglio eliminarlo!'
          }).then(async (result) => {
            if (result.isConfirmed) {
                const form = event.target;
                const id = form.id;
                try
                {
                    await this.AvvisoManager.deleteAvviso(id);
                    const avvisi = await this.AvvisoManager.getAvvisi();
                    this.avvisiContainer.innerHTML = '';
                    this.showAvvisi(avvisi);
                }catch(error){
                    if(error){
                        const errorMsg = error.error;
                    }
                }
              
            }
          });
    };

    /**
     * mostra le prenotazioni passate in input
     */


    showPrenotazioni(servizi){

        if(this.prenotazioniContainer.innerHTML !== ''){
            this.prenotazioniContainer.innerHTML = '';
        }
        
        for(let prenotazione of servizi) {
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

            const button = document.createElement('input');
            button.type = 'button';
            button.classList.add("btnPre")
            button.id = prenotazione.id;
            button.value = 'Cancella';


            const tdCancella = document.createElement('td');
            tdCancella.appendChild(button);

            tr.appendChild(tdData);
            tr.appendChild(tdOrario);
            tr.appendChild(tdCarico);
            tr.appendChild(tdScarico);
            tr.appendChild(tdTipo);
            tr.appendChild(tdAutista);
            tr.appendChild(tdBarelliere);
            tr.appendChild(tdCancella);
            tr.classList.add("Trservizio");
            tr.id = prenotazione.id;
            this.prenotazioniContainer.appendChild(tr);

            }

            const btnPre = document.getElementsByClassName("btnPre");


            for(let i=0; i < btnPre.length; i++){
                btnPre[i].addEventListener('click', this.onTrSubmitted)
                   }
           
    }


    showSearchPrenotazioni(servizi){

        if(this.prenotazioneSearchContainer.innerHTML !== ''){
            this.prenotazioneSearchContainer.innerHTML = '';
        }
        
        for(let prenotazione of servizi) {
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

            const button = document.createElement('input');
            button.type = 'button';
            button.classList.add("btnPre")
            button.id = prenotazione.id;
            button.value = 'Cancella';


            const tdCancella = document.createElement('td');
            tdCancella.appendChild(button);

            tr.appendChild(tdData);
            tr.appendChild(tdOrario);
            tr.appendChild(tdCarico);
            tr.appendChild(tdScarico);
            tr.appendChild(tdTipo);
            tr.appendChild(tdAutista);
            tr.appendChild(tdBarelliere);
            tr.appendChild(tdCancella);
            tr.classList.add("Trservizio");
            tr.id = prenotazione.id;
            this.prenotazioneSearchContainer.appendChild(tr);

            }

            const btnPre = document.getElementsByClassName("btnPre");


            for(let i=0; i < btnPre.length; i++){
                btnPre[i].addEventListener('click', this.onTrSubmitted)
                   }
           
    }

    /**
     * quando si vuole eliminare un servizio cliccando sul suo tasto, chiede all'utente di esserne sicuro e lo elimina dal db
     */

    onTrSubmitted = async (event) => {
        event.preventDefault();
        Swal.fire({
            title: 'Sei sicura/o?',
            text: "Non potrai tornare indietro!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Annulla',
            confirmButtonText: 'Sì, voglio eliminarlo!'
          }).then(async (result) => {
            if (result.isConfirmed) 
            {
                const form = event.target;
                const id = form.id;
                try
                {
                    await this.prenotazioneManager.deleteServizio(id);
                    const servizi = await this.prenotazioneManager.getServizi();
                    this.prenotazioniContainer.innerHTML = '';
                    this.showPrenotazioni(servizi);
                    var element = document.getElementById(id);
                    this.prenotazioneSearchContainer.removeChild(element);
                }catch(error){
                    if(error){
                        const errorMsg = error.error;
                    }
                }
            }
          });
    };

    /**
     * effettua il logout e ritorna al login
     */
    logout = async () => {
        await this.doLogout();
        window.location.replace("/login");
    }

    /**
     * fa la fetch per eliminare la sessione
     */

    doLogout = async () => {
        await fetch('/api/sessions/current', { method: 'DELETE' });
    }


}

export default AppCentralino;
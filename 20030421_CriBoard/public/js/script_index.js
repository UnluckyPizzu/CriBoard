"use strict"

const navbar = document.querySelector('#navbar');


navbar.querySelectorAll('a').forEach(link =>{
    link.addEventListener('click', (event) =>{
        const el = event.target;
        const linkType = el.id;
        console.log(linkType);
        navbar.querySelector('a.active').classList.remove('active');
        el.classList.add('active');
        this.onLinkSelected(linkType);
    });
});

/*
Permette il cambio dinamico di testo nell'index.html e l'invio verso il login
*/
function onLinkSelected(link){
    if(link == "Home"){
        const titolo = document.querySelector('#title');
        titolo.innerHTML = "Benvenuto";
        const testo = document.querySelector('#testo');
        testo.innerHTML = "Cri Board è la nuova piattaforma che semplifica la gestione dei servizi e degli avvisi di un comitato di croce rossa da remoto.";
    }
        if(link == "About"){
            const titolo = document.querySelector('#title');
            titolo.innerHTML = "Chi siamo";
            const testo = document.querySelector('#testo');
            testo.innerHTML = "L’Associazione della Croce Rossa Italiana, organizzazione di volontariato, ha per scopo l’assistenza sanitaria e sociale sia in tempo di pace che in tempo di conflitto. Associazione di alto rilievo, è posta sotto l’alto patronato del Presidente della Repubblica. La CRI fa parte del Movimento Internazionale della Croce Rossa. Nelle sue azioni a livello internazionale si coordina con il Comitato Internazionale della Croce Rossa, nei Paesi in conflitto, e con la Federazione Internazionale di Croce Rossa e Mezzaluna Rossa per gli altri interventi.";
        }
            
        if(link == "Courses"){
            const titolo = document.querySelector('#title');
            titolo.innerHTML = "Corsi";
            const testo = document.querySelector('#testo');
            testo.innerHTML = "Ogni anno vengono gestiti corsi di formazione per gli interessati che vogliono offrire il loro sostegno alla comunità.\n Sei interessato ad unirti alla croce rossa? Nella sezione 'Login' troverai un popup dove inserire la tua mail per essere informato sui prossimi corsi! ";
        }

        if(link == "Volontari"){
            const titolo = document.querySelector('#title');
            titolo.innerHTML = "Volontari";
            const testo = document.querySelector('#testo');
            testo.innerHTML = "Che tu sia un autista o un barelliere, l'utilizzo della piattaforma è semplicissimo. Dentro potrai visualizzare gli avvisi del comitato, i servizi a cui sei già prenotato e i servizi ancora disponibili, che potrai prenotare con un semplice click. Non ci credi? Entra e scoprilo tu stesso!";
        }

        if(link == "Login"){
            window.location.replace("/login");
        }
        
    
}




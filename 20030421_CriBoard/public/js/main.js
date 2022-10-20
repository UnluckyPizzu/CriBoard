"use strict"

import App from './app.js';

const avvisiContainer = document.querySelector('#accordion');
const prenotazioniMyContainer = document.querySelector('#my-prenotazioni');
const prenotazioniDispContainer = document.querySelector('#prenotazioniDisp');
const nome = document.querySelector('#nome')

const app = new App(avvisiContainer, prenotazioniMyContainer, prenotazioniDispContainer,nome);

"use strict"

import AppCentralino from './app_centralino.js';

const avvisiContainer = document.querySelector('#accordion');
const prenotazioniContainer = document.querySelector('#all-prenotazioni');
const nome = document.querySelector('#nome')
const prenotazioneSearchContainer = document.querySelector('#prenotazioni-ricercate');

const app = new AppCentralino(avvisiContainer, prenotazioniContainer, nome, prenotazioneSearchContainer);
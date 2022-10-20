"use strict"
import AppLogin from './app_login.js';


const form = document.querySelector('#login-form');
const formAdesioni = document.querySelector('#adesione-form');

const app = new AppLogin(form,formAdesioni);


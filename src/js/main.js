import {loadJS, loadStyleSheet} from './helpers/dynLoading';
import {telegramApi} from "./classes/telegramApi.class";

const dynLoadedContent = {
    login: {
        html: 'login.html',
        js: './login.js',
        css: './css/login.css'
    },
    app: {
        html: 'app.html',
        js: './app.js',
        css: './css/app.css'
    },
};

const api = new telegramApi();


let loadedContent = dynLoadedContent.app;

if (window.location.search.indexOf('login') !== -1) {
    loadedContent = dynLoadedContent.login;
}

const request = new XMLHttpRequest();

request.open('GET', loadedContent.html, true);

request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
        loadStyleSheet(loadedContent.css, () => {
            loadJS(loadedContent.js, () => {
                document.querySelector('body').innerHTML = request.responseText;
            });
        });
    }
};

request.send();

let ls = window.localStorage;

window.onload = async function () {
    await init();
    // games.forEach((element, index) => {
    //     element.id = `g${index + 1}`;
    //     element.addEventListener('click', gameInfo);
    // });
}

// let icons = [];
// let games = [];
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = "https://image.tmdb.org/t/p/original";

let movie_prov_id = [];

async function init() {
    if (document.URL.includes("index.html")) {
        getProviders().then(response => generateSelections(response));
        document.getElementById("continue").addEventListener('click', toMovies)
    }
    if (document.URL.includes("movies.html")) {
        getMovies().then(response => generateMovies(response));
    }
}

function generateSelections(providersFiltered) {
    let parent = document.getElementById("selection-options");
    providersFiltered.forEach(provider => {
        let img = document.createElement('img');
        img.src = IMG_URL + provider.logo_path;
        img.id = provider.provider_id;
        img.classList.add("provider");
        img.addEventListener('click', selectProvider);
        parent.appendChild(img);
    });
}

async function getProviders() {
    const URL_PROVIDERS = BASE_URL + "/watch/providers/movie?api_key=" + API_KEY;
    return fetch(URL_PROVIDERS).then(res => res.json())
    .then(data =>
        getProvidersIds(data.results)
    )
    .catch(error => console.warn(error));
}

function getProvidersIds(providers) {
    let availibleServices = ["Netflix", "Disney Plus", "Hulu", "Amazon Prime Video"];
    return providers.filter(service => {
        if (availibleServices.includes(service.provider_name)) {
            availibleServices.splice(availibleServices.indexOf(service.provider_name), 1);
            return true;
        }});
}

function selectProvider() {
    if (this.classList.contains('selected')) {
        this.classList.remove('selected');
        movie_prov_id.splice(movie_prov_id.indexOf(this.id), 1);
    }
    else {
        this.classList.add('selected');
        movie_prov_id.push(this.id);
    }
}

function toMovies() {
    window.location.href = "movies.html";
    ls.setItem('providers', movie_prov_id);
}

async function getMovies() {
    const IDS = ls.getItem('providers');
    const URL_MOVIE = BASE_URL + "/discover/movie?with_watch_providers=" + IDS + "&api_key=" + API_KEY;
    return fetch(URL_MOVIE).then(res => res.json())
    .then(data =>
        data.results
    )
    .catch(error => console.warn(error));
}

function generateMovies(movies) {
    let parent = document.getElementById("content");
    movies.forEach(movie => {
        let img = document.createElement('img');
        img.src = IMG_URL + movie.poster_path;
        img.id = movie.id;
        img.classList.add("movie");
        img.loading = "lazy";
        img.addEventListener('click', movieInfo);
        parent.appendChild(img);
    });
}

function movieInfo() {
    getMovieInfo(this.id).then(response => generateMovieInfo(response));
}

async function getMovieInfo(id) {
    const URL_MOVIE_INFO = BASE_URL + "/movie/" + id + "?api_key=" + API_KEY;
    return fetch(URL_MOVIE_INFO).then(res => res.json())
    .catch(error => console.warn(error));
}

function generateMovieInfo(info) {
    console.log(info)
    let parent = document.getElementById("card-wrapper");
    let card = document.createElement("div");
    card.classList.add("info-card");
    card.id = 'gameCard';

    let banner = document.createElement("div");
    banner.classList.add("banner");

    let content = document.createElement("div");

    let background = document.createElement("img");
    background.src = IMG_URL + info.backdrop_path;
    background.classList.add("banner-game");

    let gameData = document.createElement("div");
    gameData.classList.add("game-data");

    let gameArt = document.createElement("img");
    gameArt.src = IMG_URL + info.poster_path;

    let gameCont = document.createElement("div");
    gameCont.classList.add("game-cont");

    let gameHead = document.createElement("h1");

    gameHead.innerHTML = info.title;

    let gameDis = document.createElement("h2");
    gameDis.innerHTML = info.overview;

    let exit = document.createElement("div");
    exit.innerHTML = "X";
    exit.classList.add("exit");

    exit.addEventListener('click', () => document.getElementById("gameCard").remove());

    //banner
    banner.appendChild(background);
    card.appendChild(banner);
    //Discription
    gameCont.appendChild(gameHead);
    gameCont.appendChild(gameDis);
    //content
    gameData.appendChild(gameArt);
    gameData.appendChild(gameCont);
    gameData.appendChild(exit);
    content.appendChild(gameData);
    card.appendChild(content);
    //adding to page
    parent.appendChild(card);
}




let ls = window.localStorage;

window.onload = async function () {
    await init();
    games.forEach((element, index) => {
        element.id = `g${index + 1}`;
        element.addEventListener('click', gameInfo);
    });
}

let icons = [];
let games = [];
let gameNames = {};


async function init() {
    games = document.querySelectorAll(".game");
}

async function gameInfo() {
    let parent = document.getElementById("card-wrapper");
    let card = document.createElement("div");
    card.classList.add("info-card");
    card.id = 'gameCard';

    let banner = document.createElement("div");
    banner.classList.add("banner");

    let content = document.createElement("div");
    content.classList.add("content");

    let background = document.createElement("img");
    background.src = this.src;
    background.classList.add("banner-game");

    let gameData = document.createElement("div");
    gameData.classList.add("game-data");

    let gameArt = document.createElement("img");
    gameArt.src = this.src;

    let gameCont = document.createElement("div");
    gameCont.classList.add("game-cont");

    let gameHead = document.createElement("h1");

    gameHead.innerHTML = gameNames[this.id]

    let gameDis = document.createElement("h2");
    gameDis.innerHTML = gameDetails["description"];

    let gameGroup = document.createElement("button");
    gameGroup.innerHTML = "Join Community";
    gameGroup.id = 'join-community';
    let gameName = gameNames[this.id]

    gameGroup.addEventListener('click', async e => {
        if (ls.getItem('loggedIn') === 'true') {
            let res = await crud.createCommunity(gameName, ls.getItem('loggedInUser'));
            if (!res.ok) {
                if (res.error === 'Already in this community') {
                    window.alert('You are already in this community!');
                }
                else {
                    window.location.href = 'groups.html';
                }
            }
        } else {
            window.alert("You need to be logged in to join a community!");
        }
    });

    let exit = document.createElement("div");
    exit.innerHTML = "X";
    exit.classList.add("exit");

    exit.addEventListener('click', () => document.getElementById("gameCard").remove());

    let list = document.createElement("div");
    list.classList.add('list-wrapper');
    addRentals(list, gameNames[this.id]);

    //banner
    banner.appendChild(background);
    card.appendChild(banner);
    //Discription
    gameCont.appendChild(gameHead);
    gameCont.appendChild(gameDis);
    gameCont.appendChild(gameGroup);
    //content
    gameData.appendChild(gameArt);
    gameData.appendChild(gameCont);
    gameData.appendChild(exit);
    content.appendChild(gameData);
    content.appendChild(list);
    card.appendChild(content);
    //adding to page
    parent.appendChild(card);
}



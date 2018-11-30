// Ids
const boardId = "board";
const timerId = "timer";
const triesId = "tries";

// Class names
const cardClassName = "card";
const cardActive = "active";
const cardFound = "found";
const cardsDontMatch = "not-match";

// Class animations
const match = "tada";
const matchAnimDuration = 1000;
const notMatch = "shake";
const notMatchAnimDuration = 1000;

/**
 * winMessage
 * Here you can set some logic based on the time x tries to set a custom message
 */
const winMessage = (tries, time) => {
    switch (tries) {
        case 18:
            return `Have you cheated? 👀`
        case 36:
            return `Well, that's impressive 😲`
        case 54:
            return `Well played! 🤗`
        default:
            return `You won after ${tries} tries and ${time} seconds! 😁`;
    }
}

// Helpers
const $ = id => document.getElementById(id);
const q = query => document.querySelectorAll(query);
const bulkClassName = (nodeList, classNames, operation) => {
    [].map.call(nodeList, e =>
        Array.isArray(classNames)
            ? classNames.map(className => e.classList[operation](className))
            : e.classList[operation](classNames)
    );
};
const shuffle = array => array.sort(() => 0.5 - Math.random());
const checkMatch = (a, b) => a === b;

// Game variables
const icons = [
    "bath",
    "bank",
    "coffee",
    "gamepad",
    "rocket",
    "truck",
    "umbrella",
    "camera",
    "bug",
    "bomb",
    "anchor",
    "fax",
    "eyedropper",
    "globe",
    "graduation-cap",
    "glass",
    "magnet",
    "heart"
];
let tryCounts = 0;
let countClicks = 0;
let timePassed = 0;
let timer = null;
let flippedCards = {};

const flippedCardsCount = () => Object.keys(flippedCards).length;
const flippedCardsIds = () => Object.keys(flippedCards);
const flippedCardsIcons = () => Object.values(flippedCards);

const queryCards = () => document.querySelectorAll(`.${cardClassName}`);
const queryActiveCards = () =>
    document.querySelectorAll(`.${cardClassName}.${cardActive}`);
const queryFoundCards = () =>
    document.querySelectorAll(`.${cardClassName}.${cardFound}`);

const setClock = () => ($(timerId).innerText = timePassed + "s");
const setTryCounts = () => ($(triesId).innerText = tryCounts);

const makeCard = (id, icon) => {
    let div = document.createElement("div");
    let i = document.createElement("i");
    div.classList.add(cardClassName);
    div.setAttribute("data-icon", icon);
    div.setAttribute("data-id", id);
    i.classList.add("fa", `fa-${icon}`);
    div.appendChild(i);
    return div;
};

const uniqId = () => new Date().getTime() + (Math.random() * 100).toString(36).replace(/\./g, "");
let compareID = id => flippedCardsIds().includes(id) ? compareID(uniqId()) : id;

const mountBoard = cards => shuffle(cards).reduce((allCards, icon) => {
    allCards.push(makeCard(compareID(uniqId()), icon));
    return allCards;
}, []);

window.youWon = () => {
    window.alert(winMessage(tryCounts, timePassed));
    gameRestart();
};

const clickCard = (e, c) => {
    e.preventDefault();

    if (timer === null) {
        timer = setInterval(() => {
            timePassed = timePassed + 1;
            setClock();
        }, 1000);
    }

    if (c.classList.contains(cardFound) || c.classList.contains("shake")) return;

    countClicks = countClicks + 1;
    if ((countClicks %= 2)) {
        tryCounts = tryCounts + 1;
        setTryCounts();
    }

    Object.assign(flippedCards, {
        [c.dataset.id]: c.dataset.icon
    });

    c.classList.add(cardActive);

    if (flippedCardsCount() === 2) {
        const lastFlipped = flippedCardsIds();
        let query = `[data-id="${lastFlipped[0]}"], [data-id="${lastFlipped[1]}"]`;
        if (checkMatch(flippedCardsIcons()[0], flippedCardsIcons()[1])) {
            bulkClassName(q(query), [cardFound, "animated", match], "add");
            bulkClassName(queryActiveCards(), cardActive, "remove");
            if (queryCards().length === queryFoundCards().length) {
                setTimeout(youWon, matchAnimDuration);
            }
            flippedCards = {};
            return;
        }
        flippedCards = {};
        bulkClassName(q(query), ["animated", notMatch, cardsDontMatch], "add");
        setTimeout(() => {
            bulkClassName(q(query), ["animated", notMatch, cardsDontMatch], "remove");
            bulkClassName(q(query), cardActive, "remove");
        }, notMatchAnimDuration);
        return;
    }
};

const gameStart = () => {
    const allCards = mountBoard(icons).concat(mountBoard(icons));
    $(boardId).innerHTML = "";
    allCards.map(card => {
        $(boardId).appendChild(card);
    });
    [].map.call(queryCards(), c =>
        c.addEventListener("click", e => clickCard(e, c))
    );
};

window.gameRestart = () => {
    clearInterval(timer);
    timePassed = 0;
    tryCounts = 0;
    timer = null;
    setClock();
    setTryCounts();
    gameStart();
};

// Call game start
gameStart();

// Year on footer
$("year").innerText = new Date().getFullYear();

// const location = window.location;
let gameBaseUrl = location.protocol + '//' + window.location.hostname + (location.port.length > 0 ? ':' + location.port : "") + location.pathname;
if (!gameBaseUrl.endsWith("/")) {
    gameBaseUrl += "/";
}
gameBaseUrl += "game/";

function getStats() {
    fetch("/stats")
        .then(r => r.json())
        .then(stats => {
            document.getElementById('stats').innerHTML = "On going games: " + stats.current + "/" + stats.max;
            document.getElementById("game-ttl").innerHTML = stats.ttl;

            if (stats.current >= stats.max) {
                document.getElementById("new-game-container").innerHTML = 'Server at max capacity, try again later';
            }
        })
}

getStats();
setInterval(getStats, 5 * 1000)

async function waitForGame(url) {

    document.getElementById("new-game-url").innerHTML = "Waiting for game to be ready...";

    const stats = await fetch(url+'stats')
        .then(r => r.json())
        .catch(e => console.log("Couldn't reach "+url));

    if (stats && stats.lastActivity) {
        let link = url;

        link = "<p>Share this link to the other players (the trailing / must be here):</p><a href=\"" + link + "\">" + link + "</a>";

        document.getElementById("new-game-url").innerHTML = link;

        getStats();
    } else {
        setTimeout(() => waitForGame(url), 1000);
    }
}

function createNewGame() {
    fetch("/new-game")
        .then(r => r.text())
        .then(t => {

            document.getElementById("new-game").remove();
            let gameUrl = gameBaseUrl + t + "/";
            waitForGame(gameUrl);
        })
}

document.getElementById("new-game").onclick = createNewGame;
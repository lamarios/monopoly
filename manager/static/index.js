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
            document.getElementById('stats').innerHTML = "On going games: " + stats.current +"/"+stats.max+", Number of games started: " + stats.total;

            if(stats.current >= stats.max){
                document.getElementById("new-game-container").innerHTML = 'Server at max capacity, try again later';
            }
        })
}
getStats();
setInterval(getStats, 5 * 1000)

function createNewGame() {
    fetch("/new-game")
        .then(r => r.text())
        .then(t => {

            document.getElementById("new-game").remove();
            let link = gameBaseUrl + t + "/";
            link = "<p>It might take a short while before your game is available, share this link to the other players (the trailing / must be here):</p><a href=\"" + link + "\">" + link + "</a>";

            document.getElementById("new-game-url").innerHTML = link;

            getStats();

        })
}

document.getElementById("new-game").onclick = createNewGame;
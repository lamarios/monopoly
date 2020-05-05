import {v4 as uuidv4} from 'uuid';

class GameService {
    game = null;
    ws = null;
    currentPlayer = null;
    getStreet = function (position, game) {
        return game.deeds.regular.find(s => s.position == position);
    }
    getStation = function (position, game) {
        return game.deeds.trainStations.find(s => s.position == position);
    }
    getUtility = function (position, game) {
        return game.deeds.utilities.find(s => s.position == position);
    }
    rollDie = () => {
        this.sendToWs('rollDice', {});
    }
    getPlayerFromId = (id) => {
        return this.game.players.find(p => p.id == id);
    }

    sendMoney = (from, to, notes) => {
        this.sendToWs('sendMoney', {from: from, to: to, notes: notes});
    }

    addHouse = (streetTitle) => {
        this.sendToWs('addHouse', {streetTitle: streetTitle});
    };
    addHotel = (streetTitle) => {
        this.sendToWs('addHotel', {streetTitle: streetTitle});
    };
    removeHouse = (streetTitle) => {
        this.sendToWs('removeHouse', {streetTitle: streetTitle});
    };
    removeHotel = (streetTitle) => {
        this.sendToWs('removeHotel', {streetTitle: streetTitle});
    };

    drawCard = (type) => {
        this.sendToWs('drawCard', {type: type});
    }

    canBuyHouse = (street, game) => {
        // get total of house of same color
        return game.deeds.regular.filter(s => street.color === s.color)
            .every(s => s.owner == this.currentPlayer && s.mortgaged === false);

    }

    useOutOfJailCard = () => {
        this.sendToWs('useOutOfJailCard', {});
    }

    transferOutOfJailCard = (to) => {
        this.sendToWs('transferOutOfJailCard', {to: to});
    }

    allowedToSendDeed = (deed, game) => {
        return {
            canSend: deed.owner == 1 || deed.owner === this.currentPlayer,
            owner: deed.owner === this.currentPlayer
        }
    }

    sendDeed = (street, type, to) => {
        this.sendToWs('sendDeed', {street: street, type: type, to: to});
    }

    calculateNotesSum = (notes) => {
        let sum = 0;

        Object.keys(notes).forEach(k => {
            sum += k * notes[k];
        });

        return sum;
    }

    setPlayerPosition = (playerId, x, y) => {
        this.sendToWs('movePlayer', {
            id: playerId,
            x: x,
            y: y,
        })
    }

    addNewPlayer = (player) => {
        player.id = uuidv4();
        this.currentPlayer = player.id;
        this.sendToWs("newPlayer", player)
    }

    scorePlayerForSorting = (player) => {
        switch (player.id) {
            case -1:
                return 1;
            case this.currentPlayer:
                return -1;
            default:
                return 0;
        }
    }

    loadGame = (game) => {
        this.sendToWs('loadGame', {game: game});
    }

    sendToWs = (command, object) => {
        this.ws.send(JSON.stringify({type: 'game', command: command, params: object, from: this.currentPlayer}));
    }

    toggleMortgageProperty = (property, type) => {
        this.sendToWs('mortgage', {
            title: property.title,
            type: type
        })
    }

    canMortgage = (deed, game) => {
        if (deed.owner !== this.currentPlayer) {
            return false;
        }

        // it's a street, we need to check if there any houses left on the street of the same colors
        if (deed.color) {
            return game.deeds.regular.filter(d => d.color === deed.color)
                .every(d => d.houses === 0 && d.hotel === 0);
        } else {
            return true;
        }

    }
}

export const gameService = new GameService();
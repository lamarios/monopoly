const fs = require('fs');

const OUT_OF_JAIL = "Get out of jail free. This card may be kept until needed, traded or sold.";

function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

class GameService {
    logs = [];
    chat = [];
    newGame = () => {
        fs.writeFileSync(this.logFile, '');
        fs.writeFileSync(this.chatFile, '');
        return {
            dice: [3, 6],
            rollingDice: false,
            started: false,
            players: [{
                id: 1,
                name: 'Bank',
                token: 'dollar-sign',
                notes: {
                    500: 30,
                    100: 30,
                    50: 30,
                    20: 30,
                    10: 30,
                    5: 30,
                    1: 30
                },
                housing: {
                    hotels: 12,
                    houses: 32
                },
            }],
            deeds: {
                utilities: [
                    {
                        position: 12,
                        owner: "1",
                        title: "Electric Company",
                        type: "electricity",
                        description: "If one Utility is owned, rent is 4 times the amount shown on dice. If both Utilities are owned rent is 10 times amount shown on dice.",
                        price: "$150",
                        mortgaged: false
                    },
                    {
                        position: 28,
                        owner: "1",
                        type: "water",
                        title: "Water works",
                        description: "If one Utility is owned, rent is 4 times the amount shown on dice. If both Utilities are owned rent is 10 times amount shown on dice.",
                        price: 150,
                        mortgaged: false
                    }
                ],
                trainStations: [
                    {
                        position: 5,
                        owner: "1",
                        title: "King's Cross Station",
                        rent: {
                            "Rent": '$25',
                            "If 2 Stations are Owned": "$50",
                            "If 3 Stations are Owned": "$100",
                            "If 4 Stations are Owned": "$200",
                        },
                        price: 200,
                        mortgaged: false
                    },
                    {
                        position: 15,
                        owner: "1",
                        title: "Marylebone Station",
                        rent: {
                            "Rent": '$25',
                            "If 2 Stations are Owned": "$50",
                            "If 3 Stations are Owned": "$100",
                            "If 4 Stations are Owned": "$200",
                        },
                        price: 200,
                        mortgaged: false
                    },
                    {
                        position: 25,
                        owner: "1",
                        title: "Fenchurch St. Station",
                        rent: {
                            "Rent": '$25',
                            "If 2 Stations are Owned": "$50",
                            "If 3 Stations are Owned": "$100",
                            "If 4 Stations are Owned": "$200",
                        },
                        price: 200,
                        mortgaged: false
                    },
                    {
                        position: 35,
                        owner: "1",
                        title: "Liverpool St. Station",
                        rent: {
                            "Rent": '$25',
                            "If 2 Stations are Owned": "$50",
                            "If 3 Stations are Owned": "$100",
                            "If 4 Stations are Owned": "$200",
                        },
                        price: 200,
                        mortgaged: false
                    },
                ],
                regular: [
                    {
                        position: 37,
                        owner: "1",
                        title: "Park Lane",
                        color: "#1a2596",
                        rent: {
                            "Rent": "$35",
                            "With colour set": "$70",
                            "With 1 House": "$175",
                            "With 2 House": "$500",
                            "With 3 House": "$1100",
                            "With 4 House": "$1300",
                            "With Hotel": "$1500",
                        },
                        cost: {
                            "House": "$200 each",
                            "Hotel": "$200 each"
                        },
                        houses: 0,
                        hotel: 0,
                        price: 350,
                        mortgaged: false
                    },
                    {
                        position: 39,
                        owner: "1",
                        title: "MayFair",
                        color: "#1a2596",
                        rent: {
                            "Rent": "$50",
                            "With colour set": "$100",
                            "With 1 House": "$200",
                            "With 2 House": "$600",
                            "With 3 House": "$1400",
                            "With 4 House": "$1700",
                            "With Hotel": "$2000",
                        },
                        houses: 0,
                        hotel: 0,
                        cost: {
                            "House": "$200 each",
                            "Hotel": "$200 each"
                        },
                        price: 400,
                        mortgaged: false
                    },
                    {
                        position: 31,
                        owner: "1",
                        title: "Regent Street",
                        color: "#008e04",
                        rent: {
                            "Rent": "$26",
                            "With colour set": "$52",
                            "With 1 House": "$130",
                            "With 2 House": "$390",
                            "With 3 House": "$900",
                            "With 4 House": "$1100",
                            "With Hotel": "$1275",
                        },
                        houses: 0,
                        hotel: 0,
                        cost: {
                            "House": "$200 each",
                            "Hotel": "$200 each"
                        },
                        price: 300,
                        mortgaged: false
                    },
                    {
                        position: 34,
                        owner: "1",
                        title: "Bond Street",
                        color: "#008e04",
                        rent: {
                            "Rent": "$28",
                            "With colour set": "$56",
                            "With 1 House": "$150",
                            "With 2 House": "$450",
                            "With 3 House": "$1000",
                            "With 4 House": "$1200",
                            "With Hotel": "$1400",
                        },
                        houses: 0,
                        hotel: 0,
                        cost: {
                            "House": "$200 each",
                            "Hotel": "$200 each"
                        },
                        price: 320,
                        mortgaged: false
                    },
                    {
                        position: 32,
                        owner: "1",
                        title: "Oxford Street",
                        color: "#008e04",
                        rent: {
                            "Rent": "$26",
                            "With colour set": "$52",
                            "With 1 House": "$130",
                            "With 2 House": "$390",
                            "With 3 House": "$900",
                            "With 4 House": "$1100",
                            "With Hotel": "$1275",
                        },
                        houses: 0,
                        hotel: 0,
                        cost: {
                            "House": "$200 each",
                            "Hotel": "$200 each"
                        },
                        price: 300,
                        mortgaged: false
                    },
                    {
                        position: 26,
                        owner: "1",
                        title: "Leicester Square",
                        color: "#d6d105",
                        rent: {
                            "Rent": "$22",
                            "With colour set": "$44",
                            "With 1 House": "$110",
                            "With 2 House": "$330",
                            "With 3 House": "$800",
                            "With 4 House": "$975",
                            "With Hotel": "$1150",
                        },
                        houses: 0,
                        hotel: 0,
                        cost: {
                            "House": "$150 each",
                            "Hotel": "$150 each"
                        },
                        price: 260,
                        mortgaged: false
                    },
                    {
                        position: 27,
                        owner: "1",
                        title: "Coventry Street",
                        color: "#d6d105",
                        rent: {
                            "Rent": "$22",
                            "With colour set": "$44",
                            "With 1 House": "$110",
                            "With 2 House": "$330",
                            "With 3 House": "$800",
                            "With 4 House": "$975",
                            "With Hotel": "$1150",
                        },
                        houses: 0,
                        hotel: 0,
                        cost: {
                            "House": "$150 each",
                            "Hotel": "$150 each"
                        },
                        price: 260,
                        mortgaged: false
                    },
                    {
                        position: 29,
                        owner: "1",
                        title: "Picadilly",
                        color: "#d6d105",
                        rent: {
                            "Rent": "$24",
                            "With colour set": "$48",
                            "With 1 House": "$120",
                            "With 2 House": "$360",
                            "With 3 House": "$850",
                            "With 4 House": "$1025",
                            "With Hotel": "$1200",
                        },
                        houses: 0,
                        hotel: 0,
                        cost: {
                            "House": "$150 each",
                            "Hotel": "$150 each"
                        },
                        price: 280,
                        mortgaged: false
                    },
                    {
                        position: 23,
                        owner: "1",
                        title: "Fleet Street",
                        color: "#9f0108",
                        rent: {
                            "Rent": "$18",
                            "With colour set": "$36",
                            "With 1 House": "$90",
                            "With 2 House": "$250",
                            "With 3 House": "$700",
                            "With 4 House": "$875",
                            "With Hotel": "$1050",
                        },
                        houses: 0,
                        hotel: 0,
                        cost: {
                            "House": "$150 each",
                            "Hotel": "$150 each"
                        },
                        price: 220,
                        mortgaged: false
                    },
                    {
                        position: 21,
                        owner: "1",
                        title: "Strand",
                        color: "#9f0108",
                        rent: {
                            "Rent": "$18",
                            "With colour set": "$36",
                            "With 1 House": "$90",
                            "With 2 House": "$250",
                            "With 3 House": "$700",
                            "With 4 House": "$875",
                            "With Hotel": "$1050",
                        },
                        cost: {
                            "House": "$150 each",
                            "Hotel": "$150 each"
                        },
                        houses: 0,
                        hotel: 0,
                        price: 220,
                        mortgaged: false
                    },
                    {
                        position: 24,
                        owner: "1",
                        title: "Trafalgar Square",
                        color: "#9f0108",
                        rent: {
                            "Rent": "$20",
                            "With colour set": "$40",
                            "With 1 House": "$100",
                            "With 2 House": "$300",
                            "With 3 House": "$750",
                            "With 4 House": "$925",
                            "With Hotel": "$1100",
                        },
                        houses: 0,
                        hotel: 0,
                        cost: {
                            "House": "$150 each",
                            "Hotel": "$150 each"
                        },
                        price: 240,
                        mortgaged: false
                    },
                    {
                        position: 16,
                        title: "Bow Street",
                        color: "#d68000",
                        owner: "1",
                        rent: {
                            "Rent": "$14",
                            "With colour set": "$28",
                            "With 1 House": "$70",
                            "With 2 House": "$200",
                            "With 3 House": "$550",
                            "With 4 House": "$750",
                            "With Hotel": "$950",
                        },
                        houses: 0,
                        hotel: 0,
                        cost: {
                            "House": "$100 each",
                            "Hotel": "$100 each"
                        },
                        price: 180,
                        mortgaged: false
                    },
                    {
                        position: 18,
                        title: "Marlborough Street",
                        color: "#d68000",
                        owner: "1",
                        rent: {
                            "Rent": "$14",
                            "With colour set": "$28",
                            "With 1 House": "$70",
                            "With 2 House": "$200",
                            "With 3 House": "$550",
                            "With 4 House": "$750",
                            "With Hotel": "$950",
                        },
                        houses: 0,
                        hotel: 0,
                        cost: {
                            "House": "$100 each",
                            "Hotel": "$100 each"
                        },
                        price: 180,
                        mortgaged: false
                    },
                    {
                        position: 19,
                        title: "Vine Street",
                        color: "#d68000",
                        owner: "1",
                        rent: {
                            "Rent": "$16",
                            "With colour set": "$32",
                            "With 1 House": "$80",
                            "With 2 House": "$220",
                            "With 3 House": "$600",
                            "With 4 House": "$800",
                            "With Hotel": "$1000",
                        },
                        houses: 0,
                        hotel: 0,
                        cost: {
                            "House": "$100 each",
                            "Hotel": "$100 each"
                        },
                        price: 200,
                        mortgaged: false
                    },
                    {
                        position: 13,
                        title: "WhiteHall",
                        color: "#930086",
                        owner: "1",
                        rent: {
                            "Rent": "$10",
                            "With colour set": "$20",
                            "With 1 House": "$50",
                            "With 2 House": "$150",
                            "With 3 House": "$450",
                            "With 4 House": "$625",
                            "With Hotel": "$750",
                        },
                        houses: 0,
                        hotel: 0,
                        cost: {
                            "House": "$100 each",
                            "Hotel": "$100 each"
                        },
                        price: 140,
                        mortgaged: false
                    },
                    {
                        position: 11,
                        title: "Pall Mall",
                        color: "#930086",
                        owner: "1",
                        rent: {
                            "Rent": "$10",
                            "With colour set": "$20",
                            "With 1 House": "$50",
                            "With 2 House": "$150",
                            "With 3 House": "$450",
                            "With 4 House": "$625",
                            "With Hotel": "$750",
                        },
                        houses: 0,
                        hotel: 0,
                        cost: {
                            "House": "$100 each",
                            "Hotel": "$100 each"
                        },
                        price: 140,
                        mortgaged: false
                    },
                    {
                        position: 14,
                        title: "Northumber land Avenue",
                        color: "#930086",
                        owner: "1",
                        rent: {
                            "Rent": "$12",
                            "With colour set": "$24",
                            "With 1 House": "$60",
                            "With 2 House": "$180",
                            "With 3 House": "$500",
                            "With 4 House": "$700",
                            "With Hotel": "$900",
                        },
                        houses: 0,
                        hotel: 0,
                        cost: {
                            "House": "$100 each",
                            "Hotel": "$100 each"
                        },
                        price: 160,
                        mortgaged: false
                    },
                    {
                        position: 6,
                        title: "The Angel, Islington",
                        color: "#6ba9a5",
                        owner: "1",
                        rent: {
                            "Rent": "$6",
                            "With colour set": "$12",
                            "With 1 House": "$30",
                            "With 2 House": "$90",
                            "With 3 House": "$270",
                            "With 4 House": "$400",
                            "With Hotel": "$550",
                        },
                        houses: 0,
                        hotel: 0,
                        cost: {
                            "House": "$50 each",
                            "Hotel": "$50 each"
                        },
                        price: 100,
                        mortgaged: false
                    },
                    {
                        position: 8,
                        title: "Euston Road",
                        color: "#6ba9a5",
                        owner: "1",
                        rent: {
                            "Rent": "$6",
                            "With colour set": "$12",
                            "With 1 House": "$30",
                            "With 2 House": "$90",
                            "With 3 House": "$270",
                            "With 4 House": "$400",
                            "With Hotel": "$550",
                        },
                        houses: 0,
                        hotel: 0,
                        cost: {
                            "House": "$50 each",
                            "Hotel": "$50 each"
                        },
                        price: 100,
                        mortgaged: false
                    },
                    {
                        position: 9,
                        title: "Pentonville Road",
                        color: "#6ba9a5",
                        owner: "1",
                        rent: {
                            "Rent": "$8",
                            "With colour set": "$16",
                            "With 1 House": "$40",
                            "With 2 House": "$100",
                            "With 3 House": "$300",
                            "With 4 House": "$450",
                            "With Hotel": "$600",
                        },
                        houses: 0,
                        hotel: 0,
                        cost: {
                            "House": "$50 each",
                            "Hotel": "$50 each"
                        },
                        price: 120,
                        mortgaged: false
                    },
                    {
                        position: 1,
                        title: "Old Kent Road",
                        color: "#614901",
                        owner: "1",
                        rent: {
                            "Rent": "$2",
                            "With colour set": "$4",
                            "With 1 House": "$10",
                            "With 2 House": "$30",
                            "With 3 House": "$90",
                            "With 4 House": "$160",
                            "With Hotel": "$250",
                        },
                        houses: 0,
                        hotel: 0,
                        cost: {
                            "House": "$50 each",
                            "Hotel": "$50 each"
                        },
                        price: 60,
                        mortgaged: false
                    },
                    {
                        position: 3,
                        title: "WhiteChapel Road",
                        color: "#614901",
                        owner: "1",
                        rent: {
                            "Rent": "$4",
                            "With colour set": "$8",
                            "With 1 House": "$20",
                            "With 2 House": "$60",
                            "With 3 House": "$180",
                            "With 4 House": "$320",
                            "With Hotel": "$450",
                        },
                        houses: 0,
                        hotel: 0,
                        cost: {
                            "House": "$50 each",
                            "Hotel": "$50 each"
                        },
                        price: 60,
                        mortgaged: false
                    },
                ],
            },
            cards: {
                chance: {
                    available: shuffle([
                        "Advance to go collect $200",
                        "You inherit $100",
                        "Go to Jail, Go directly to jail. Do not pass go. Do not collect $200",
                        "Holiday fund matures, collect $100",
                        "Income tax refund, collect $20",
                        "School fees. Pay $50",
                        "Hospital Fees. Pay $100",
                        "Collect $25 consultancy fee",
                        OUT_OF_JAIL,
                        "Bank error in your favour. Collect $200",
                        "It's your birthday collect $10 from each player",
                        "Life insurance matures. Collect $100",
                        "From sale of stock, you get $50",
                        "Doctor's fees. Pay $50"
                    ]),
                    used: [],
                },
                community: {
                    available: shuffle([
                        OUT_OF_JAIL,
                        "Go to Jail, Go directly to jail. Do not pass go. Do not collect $200",
                        "Advance to the next station. If UNOWNED, you may buy it from the bank. If OWNED, pay the owner twice the rent to which they are otherwise entitled",
                        "Advance to MayFair",
                        "Advance to the next station. If UNOWNED, you may buy it from the bank. If OWNED, pay the owner twice the rent to which they are otherwise entitled",
                        "You have been elected chairman of the board, pay each player $50",
                        "Advance to Trafalgar Square. If you pass go collect $200",
                        "Your building loan matures, collect $150",
                        "Advance to go, collect $200",
                        "Take a trip to king's cross station, if you pass go collect $200",
                        "Speeding fine, pay $15",
                        "Advance to the nearest utility, if UNOWNED, you may buy it from the bank. If OWNED, roll the dice and pay the owner 10 times your roll",
                        "Make general repairs on all you property: For each house pay $25, for each hotel pay $100",
                        "Go back 3 spaces",
                        "Advance to Pall Mall, if you pass go collect $200"
                    ]),
                    used: []

                }

            }
        }
    }

    processCommand = (command, params, from) => {
        const player = this.getPlayerFromId(from);
        switch (command) {
            case 'rollDice':
                this.rollDice(0, this.randomInt(10) + 5, from);
                break;
            case 'newPlayer':
                this.addNewPlayer(params);
                break;
            case 'sendMoney':
                this.transferNotes(params.from, params.to, params.notes);
                break;
            case 'movePlayer':
                this.movePlayer(params.id, params.x, params.y);
                break;
            case 'moveFinished':
                this.sendLog(this.getPlayerFromId(from).name + " moved player " + params.target);
                break;
            case 'sendDeed':
                this.transferDeed(params.street, params.type, params.to, from);
                break;
            case 'addHouse':
                this.addHouse(params.streetTitle, player);
                break;
            case 'removeHouse':
                this.removeHouse(params.streetTitle, player);
                break;
            case 'addHotel':
                this.addHotel(params.streetTitle, player);
                break;
            case 'removeHotel':
                this.removeHotel(params.streetTitle, player);
                break;
            case 'drawCard':
                this.drawCard(params.type, player);
                break;
            case 'loadGame':
                this.loadGame(params.game, player);
                break;
            case 'chat':
                this.addToChat(params.message, player);
                break;
            case 'mortgage':
                this.toggleMortgageDeed(params.title, params.type, player);
                break;
            case 'useOutOfJailCard':
                this.useOutOfJailCard(player);
                break;
            case 'transferOutOfJailCard':
                this.transferOutOfJailCard(player, params.to);
                break;
        }

        return {type: 'game', game: this.game};
    }

    transferOutOfJailCard = (player, to) => {
        const toPlayer = this.getPlayerFromId(to);
        if (!toPlayer) {
            this.sendLog(to + " player doesn't exist");
            return;
        }

        if (player.outOfJail.community > 0) {
            player.outOfJail.community--;
            toPlayer.outOfJail.community++;
            this.sendLog(player.name + " sent a 'Get out of jail' card to " + toPlayer.name);
        } else if (player.outOfJail.chance > 0) {
            player.outOfJail.chance--;
            toPlayer.outOfJail.chance++;
            this.sendLog(player.name + " sent a 'Get out of jail' card to " + toPlayer.name);
        } else {
            this.sendLog(player.name + " doesn't have an 'Get out of jail' card");
        }

    }

    useOutOfJailCard = (player) => {
        if (player.outOfJail.community > 0) {
            player.outOfJail.community--;
            this.game.cards.community.used.push(OUT_OF_JAIL);
            this.sendLog(player.name + " has used a 'Get out of jail' card");
        } else if (player.outOfJail.chance > 0) {
            player.outOfJail.chance--;
            this.game.cards.chance.used.push(OUT_OF_JAIL);
            this.sendLog(player.name + " has used a 'Get out of jail' card");
        } else {
            this.sendLog(player.name + " doesn't have an 'Get out of jail' card");
        }
    }

    loadGame = (game, player) => {
        //removing keys that are not supposed to exist
        this.sendLog(player.name + ' is loading a saved game');
        Object.keys(game.game).forEach(k => {
            if (!this.game[k]) {
                delete game.game[k];
            }
        });

        this.game = {...this.newGame(), ...game.game};
        this.logs = game.logs || [];
        this.chat = game.chat || [];
        this.ws.broadcast(JSON.stringify({type: 'newGame', game: this.game}));
    }

    toggleMortgageDeed = (title, type, from) => {
        const deed = this.game.deeds[type].find(s => s.title === title);

        let canMortgage = this.canMortgage(deed, from);
        console.log('Can mortgage?', canMortgage);
        if (canMortgage) {
            deed.mortgaged = !deed.mortgaged;
            this.sendLog(from.name + " " + (deed.mortgaged ? "" : "un") + "mortgaged " + deed.title);
        } else {
            this.sendLog(from.name + " can't mortgage this property, either not the owner or other properties from the same color still have houses");
        }

    }

    canMortgage = (deed, user) => {
        console.log('can mortgage', deed, user);
        if (deed.owner !== user.id) {
            return false;
        }

        // it's a street, we need to check if there any houses left on the street of the same colors
        if (deed.color) {
            return this.game.deeds.regular.filter(d => d.color === deed.color)
                .every(d => d.houses === 0 && d.hotel === 0);
        } else {
            return true;
        }

    }

    drawCard = (type, player) => {
        const cards = this.game.cards[type];

        if (cards.available.length === 0) {
            cards.available = shuffle(cards.used);
            cards.used = [];
            this.sendLog("No more " + type + " cards, shuffling the old ones");
        }

        const picked = cards.available.pop();

        if (picked === OUT_OF_JAIL) {
            player.outOfJail[type]++;
        } else {
            cards.used.push(picked);
        }

        this.sendLog(player.name + " draw  " + type + " card \"" + picked + "\"");
        this.ws.broadcast(JSON.stringify({type: 'cardDrawn', card: picked, cardType: type, player: player}));

    }

    canBuyHouse = (street, player) => {
        // get total of house of same color
        return this.game.deeds.regular.filter(s => street.color === s.color)
            .every(s => s.owner == player.id);

    }

    addHouse = (title, player) => {

        const street = this.game.deeds.regular.find(s => s.title === title);
        let bank = this.game.players.find(p => p.id == 1);
        const availableHouses = bank.housing.houses;

        if (!this.canBuyHouse(street, player)) {
            this.sendLog(player.name + " is not allowed to add houses to " + street.title);
            return;
        }

        if (player.id != street.owner) {
            this.sendLog(player.name + " is not the owner of " + street.title);
            return;
        }
        if (street.hotel === 1) {
            this.sendLog(street.title + " already has a hotel");
            return;
        }

        if (street.houses === 4) {
            this.sendLog(street.title + " already has 4 houses");
            return;
        }

        if (availableHouses > 0) {
            street.houses++;
            bank.housing.houses--;
            this.sendLog(player.name + " added one house to " + title);
            this.sendLog("Bank balance: Houses: " + bank.housing.houses + ", Hotels: " + bank.housing.hotels);
        } else {
            this.sendLog("No more houses in the bank");
        }

    }

    removeHouse = (title, player) => {

        const street = this.game.deeds.regular.find(s => s.title === title);
        let bank = this.game.players.find(p => p.id == 1);
        const availableHouses = bank.housing.houses;
        if (!this.canBuyHouse(street, player)) {
            this.sendLog(player.name + " is not allowed to add houses to " + street.title);
            return;
        }

        if (player.id != street.owner) {
            this.sendLog(player.name + " is not the owner of " + street.title);
            return;
        }

        if (street.houses === 0) {
            this.sendLog(street.title + " as no more houses to remove");
            return;
        }

        street.houses--;
        bank.housing.houses++;
        this.sendLog(player.name + " removed one house from " + title);
        this.sendLog("Bank balance: Houses: " + bank.housing.houses + ", Hotels: " + bank.housing.hotels);

    }

    addHotel = (title, player) => {

        const street = this.game.deeds.regular.find(s => s.title === title);
        let bank = this.game.players.find(p => p.id == 1);
        const availableHotels = bank.housing.hotels;
        if (!this.canBuyHouse(street, player)) {
            this.sendLog(player.name + " is not allowed to add houses to " + street.title);
            return;
        }

        if (player.id != street.owner) {
            this.sendLog(player.name + " is not the owner of " + street.title);
            return;
        }

        if (street.houses < 4) {
            this.sendLog(street.title + " needs 4 houses to buy a hotel");
            return;
        }

        if (availableHotels > 0) {
            bank.housing.houses += street.houses;
            bank.housing.hotels--;
            street.hotel++;
            street.houses = 0;
            this.sendLog(player.name + " added one hotel to " + title);
            this.sendLog("Bank balance: Houses: " + bank.housing.houses + ", Hotels: " + bank.housing.hotels);
        } else {
            this.sendLog("No more hotels in the bank");
        }

    }

    removeHotel = (title, player) => {

        const street = this.game.deeds.regular.find(s => s.title === title);
        let bank = this.game.players.find(p => p.id == 1);
        const availableHotels = bank.housing.hotels;
        if (!this.canBuyHouse(street, player)) {
            this.sendLog(player.name + " is not allowed to add houses to " + street.title);
            return;
        }

        if (player.id != street.owner) {
            this.sendLog(player.name + " is not the owner of " + street.title);
            return;
        }

        if (street.hotel === 0) {
            this.sendLog(street.title + " as no more hotel to remove");
            return;
        }

        street.hotel--;
        bank.housing.hotels++;
        this.sendLog(player.name + " removed one hotel from " + title);
        this.sendLog("Bank balance: Houses: " + bank.housing.houses + ", Hotels: " + bank.housing.hotels);

    }

    transferDeed = (title, type, to, from) => {
        const owner = this.getPlayerFromId(this.game.deeds[type].find(s => s.title === title).owner);
        const toUser = this.getPlayerFromId(to);
        const deed = this.game.deeds[type].find(s => s.title === title);
        console.log('transfer deed:', deed);
        if (owner.id !== toUser.id) {

            // sending back to the bank, we give back the houses to the bank
            if (toUser.id === 1) {
                const houses = deed.houses;
                const hotel = deed.hotel;
                toUser.housing.hotels = toUser.housing.hotels + hotel;
                toUser.housing.houses = toUser.housing.houses + houses;
                deed.hotel = 0;
                deed.houses = 0;
                deed.mortgaged = false;
            }

            deed.owner = toUser.id;

            this.game.deeds[type].sort((s1, s2) => s2.position - s1.position);

            this.sendLog(this.getPlayerFromId(from).name + " transferred " + title + " from " + owner.name + " to " + toUser.name);

        } else {
            this.sendLog(title + " can't be sent to its current owner");
        }
    }

    movePlayer = (playerId, x, y) => {
        const player = this.getPlayerFromId(playerId);
        player.x = x;
        player.y = y;
    }

    addNewPlayer = (player) => {
        player.notes = {
            500: 0,
            100: 0,
            50: 0,
            20: 0,
            10: 0,
            5: 0,
            1: 0
        };
        player.x = 200 + 40 * this.game.players.length;
        player.y = 200;
        player.outOfJail = {
            chance: 0,
            community: 0,
        }

        this.game.players.push(player);

        this.transferNotes(1, player.id, {
            1: 5,
            5: 1,
            10: 2,
            20: 1,
            50: 1,
            100: 4,
            500: 2,
        });

    }

    getPlayerFromId = (id) => {
        return this.game.players.find(p => p.id == id);
    }

    calculateNotesSum = (notes) => {
        let sum = 0;

        Object.keys(notes).forEach(k => {
            sum += k * notes[k];
        });

        return sum;
    }

    transferNotes(from, to, notes) {
        const fromPlayer = this.getPlayerFromId(from);
        const toPlayer = this.getPlayerFromId(to);

        Object.keys(notes).forEach(k => {
            fromPlayer.notes[k] = fromPlayer.notes[k] - notes[k];
            toPlayer.notes[k] = toPlayer.notes[k] + notes[k];
        });

        const sum = this.calculateNotesSum(notes);
        const fromNewSum = this.calculateNotesSum(fromPlayer.notes);
        const toNewSum = this.calculateNotesSum(toPlayer.notes);

        const logLine = fromPlayer.name + " sent $" + sum + " to " + toPlayer.name;
        this.sendLog(logLine);
        this.sendLog(fromPlayer.name + " new balance: $" + fromNewSum);
        this.sendLog(toPlayer.name + " new balance: $" + toNewSum);
    }

    randomInt = (max) => {
        return Math.floor(Math.random() * Math.floor(max));
    }

    sendToWs = () => {
        this.ws.broadcast(JSON.stringify({type: 'game', game: this.game}));
    }

    sendLog = (message) => {
        const date = new Date();
        message = "[" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "] " + message;
        this.logs.push(message);
        fs.appendFileSync(this.logFile, message + '\n', 'utf8');

        if (this.logs.length > 200) {
            this.logs.shift();
        }

        this.ws.broadcast(JSON.stringify({type: 'log', message: this.logs}));
    }

    addToChat = (message, player) => {
        const date = new Date();
        message = "[" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "] " + player.name + ": " + message;
        message.replace('<', '&lt;').replace('>', '&gt;');
        fs.appendFileSync(this.chatFile, message + '\n', 'utf8');
        this.chat.push(message);

        if (this.chat.length > 200) {
            this.chat.shift();
        }

        this.ws.broadcast(JSON.stringify({type: 'chat', message: this.chat}));
    }

    rollDice = (times, max, from) => {
        const player = this.getPlayerFromId(from).name;
        if (times === 0 && this.game.rollingDice === true) {
            return;
        }
        if (times === 0) {
            this.game.rollingDice = true;
            this.sendToWs();
            this.sendLog(player + ' rolled the dice !');
        }

        this.game.dice[0] = this.randomInt(6) + 1;
        this.game.dice[1] = this.randomInt(6) + 1;

        this.sendToWs();

        if (times < max) {

            setTimeout(() => this.rollDice(times + 1, max, from)
                , Math.floor(Math.random() * Math.floor(250)) + 50)
        } else {
            this.game.rollingDice = false;
            this.sendToWs();
            this.sendLog(player + ' rolled ' + this.game.dice[0] + " and " + this.game.dice[1] + "!");
        }

    }

    logFile = './static/logs.txt';
    chatFile = './static/chat.txt';
    game = this.newGame();
    ws = undefined;

}

exports
    .gameService = new GameService();

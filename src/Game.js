import { cities } from './static/cities'
import { powerplants, STEP_3 } from './static/powerplants'
import { playerSettings } from './static/reference'
import PlayerModel from './models/player'
import { setPlayerOrder } from './moves/playerOrder'
import * as auction from './moves/auction'
import { TurnOrder } from 'boardgame.io/core'


function setup(ctx, setupData) {
    let cityStatus = {}
    for (let i = 0; i < cities.length; i ++) {
        cityStatus[cities[i].id] = {house10: null, house15: null, house20: null}
    }
    let players = {}
    for (let i = 0; i < ctx.numPlayers; i++) {
        players[i] = new PlayerModel('Player ' + i)
    }
    let coalMarket = []
    let oilMarket = []
    let trashMarket = []
    let uraniumMarket = []

    for (let i = 0; i < 24; i++) {
        coalMarket.push({position: i, cost: Math.floor(i/3) + 1, available: true})
        oilMarket.push({position: i, cost: Math.floor(i/3) + 1, available: i > 5})
        trashMarket.push({position: i, cost: Math.floor(i/3) + 1, available: i > 14})
        if (i < 8) {
            uraniumMarket.push({position: i, cost: i + 1, available: false})
        }
    }

    for (let i = 10; i < 18; i += 2) {
        uraniumMarket.push({position: 2*i - 8, cost: i, available: i > 12})
    }

    let powerplantMarket = [3, 4, 5, 6, 7, 8, 9, 10]
    let powerplantDeck = []
    // Add all other powerplants to the deck, except for 13.
    for (const pp in powerplants) {
        if (pp > 10 && pp !== 13) {
            powerplantDeck.push(pp)
        }
    }
    // Shuffle the deck and randomly remove powerplants according to the number of players.
    powerplantDeck = ctx.random.Shuffle(powerplantDeck)
    powerplantDeck.splice(0, playerSettings[ctx.numPlayers].remove)

    // Add 13 to the top of the deck, and the step 3 card to the back. Note that we draw of the end of the array.
    powerplantDeck.push(13)
    powerplantDeck.unshift(STEP_3)


    return {
        cityStatus: cityStatus, 
        powerplantMarket: powerplantMarket, 
        powerplantDeck: powerplantDeck,
        players: players,
        coalMarket: coalMarket,
        oilMarket: oilMarket,
        trashMarket: trashMarket,
        uraniumMarket: uraniumMarket,
        step: 1,
        firstTurn: true,
        playerOrder: [],
        reverseOrder: [],
        auction: {upForAuction: null, selected: null, currentBid: null},
        logs: [],
    }
}

export const WattMatrix = {
    name: 'WattMatrix',
    setup: setup,
    phases: {
        playerOrder: {
            onBegin: setPlayerOrder,
            next: 'auction',
            start: true,  // TODO: The real game needs to start with region selection
        },
        auction: {
            onBegin: auction.startAuction,  
            turn: {
                order: {first: G => parseInt(G.playerOrder[0])},
            },
            moves: {
                selectPowerplant: auction.selectPowerplant,
                startBidding: auction.startBidding,
                makeBid: auction.makeBid,
                passBid: auction.passBid,
                passBuyPP: auction.passBuyPP,
            },
            next: 'cities'
        },
        cities: {
            moves: {},
            turn: {order: TurnOrder.CUSTOM_FROM('reverseOrder')}
        }
    },
    minPlayers: 3,
    maxPlayers: 6,
};
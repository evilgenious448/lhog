import { cities } from './static/cities'


// TODO:
// * Map in scrollable div
// * Test city names above edges


function setup(ctx, setupData) {
    let cityStatus = {}
    for (let i = 0; i < cities.length; i ++) {
        cityStatus[cities[i].id] = {house10: null, house15: null, house20: null}
    }
    return {cityStatus: cityStatus}
}

export const WattMatrix = {
    name: 'WattMatrix',
    setup: setup,
    moves: {
        takeGems: (G, ctx) => {},
    }
};
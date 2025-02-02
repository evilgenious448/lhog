import { Server, Origins } from 'boardgame.io/server'
import { StorageCache } from 'bgio-storage-cache'
import cors from '@koa/cors'
import MongooseStore from 'koa-session-mongoose'
import passport from 'koa-passport'
import path from 'path'
import serve from 'koa-static'
import session from 'koa-session'
import { PirateWars } from 'pirate_wars/src/Game'

// Import the game objects without importing any React components.

import './passport'
import { addRoutes } from './routes'
import { MongoStore } from '../db/mongo'


const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/lhog'

// Use the player ID as the credentials
const generateCredentials = (ctx) => {
    if (ctx.isAuthenticated()) {
        return ctx.state.user.id
    } else {
        throw new Error('user is not logged in')
    }
}

const PORT = process.env.PORT || 8000;

// Creating and running the server with mongo connection initializes it. This is also important for passport.
const db = new MongoStore(DB_URI)
const dbWithCaching = new StorageCache(db, {cacheSize: 200})
const server = Server({
    games: [PirateWars], 
    generateCredentials: generateCredentials, 
    db: dbWithCaching,
    origins: [
        // Allow your game site to connect. 
        'https://piratewars.herokuapp.com/',
        // Allow localhost to connect, except when NODE_ENV is 'production'.
        Origins.LOCALHOST_IN_DEVELOPMENT
    ],
})

const SINGLE_PORT = process.env.SINGLE_PORT

// We need to modify the CORS setting (to allow checking credentials) if we are running the server and client on separate
//  ports. However, this middleware has already been added to the server by default, so we only add this duplicate
//  middleware when we are running on two ports (for dev environments.)
if (!SINGLE_PORT) {
    server.app.use(cors({credentials: true}))
}

server.app.keys = [process.env.SECRET || 'not-so-secret']
server.app.use(session({store: new MongooseStore({collection: 'sessions'})}, server.app))

server.app.use(passport.initialize())
server.app.use(passport.session())

addRoutes(server.router)

if (SINGLE_PORT) {
    // Build path relative to the server.js file
    const frontEndAppBuildPath = path.resolve(__dirname, '../build');
    server.app.use(serve(frontEndAppBuildPath))
}

server.run(PORT)

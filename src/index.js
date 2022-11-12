import React from 'react'
import ReactDOM from 'react-dom'
import { PirateWars } from 'pirate_wars/src/Game'
import { PirateWarsBoard } from 'pirate_wars/src/Board'

import LobbyRouter from './lobby/lobbyRouter'

import './index.css'

const ENV = process.env.REACT_APP_ENV

let SERVER
if (ENV === 'dev')    {
    SERVER = `http://${window.location.hostname}:8000`  // Local
} else {
    SERVER = `https://${window.location.hostname}` // Prod
}

// Render the lobby. This relies on a running server.
ReactDOM.render(
    <React.StrictMode>
    <LobbyRouter
        gameServer={SERVER}
        gameComponents={[{game: PirateWars, board: PirateWarsBoard}]}
    />
    </React.StrictMode>,
    document.getElementById('root')
)
import { useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
    root: {
        '& .bgio-client': {
            height: 'calc(100vh - 64px)' // The header is 64px
        }
    },
})
export default function Board({runningMatch}) {

    const navigate = useNavigate()
    const classes = useStyles()

    useEffect(() => {
        if (!runningMatch) {
            navigate('/')
        } else {
            new runningMatch.board(document.getElementById('running-match'), runningMatch.app)
        }
    }, [runningMatch, navigate])

    if (runningMatch) {
        return (
            <div className={classes.root} id="running-match">
            </div>
        )
    } else {
        return null
    }
}
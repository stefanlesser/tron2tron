const blessed = require('blessed')

// Game lovic
class TronEvent {
    constructor(x, y, player, direction) {
        this.x = x
        this.y = y
        this.player = player
        this.direction = direction
    }

    tick() {
        return new TronEvent(
            this.x + this.direction.dx,
            this.y + this.direction.dy,
            this.player,
            this.direction
        )
    }
}

function firstRound() {
    return [
        new TronEvent( 10, 10, 0, { dx:  1, dy: 0 }),
        new TronEvent(100, 40, 1, { dx: -1, dy: 0 })
    ]
}

function nextRound(gameState) {
    const lastRound = gameState[gameState.length - 1]
    logWindow.content = `${JSON.stringify(lastRound)}`
    return lastRound.map(e => e.tick())
}

// Create screen object
const screen = blessed.screen({ smartCSR: true })
screen.title = 'tron2tron'

// Main playing field
const grid = blessed.box({
    top: 'center',
    left: 'center',
    width: '80%',
    height: '80%',
    content: 'Welcome to the {bold}Grid{/bold}',
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        br: 'blue',
        border: {
            fg: '#f0f0f0'
        }
    }
})

screen.append(grid)

// Console
const logWindow = blessed.box({
    top: '90%',
    left: '0%',
    width: '100%',
    height: '10%',
    content: 'Console',
    tags: true,
    style: {
        fg: 'white',
        br: 'blue',
    }
})
screen.append(logWindow)

screen.key(['escape', 'q', 'C-c'], () => process.exit(0))

// Game setup
const tickInterval = 1000 / 8

const width = grid.width
const height = grid.height

var tronState = [firstRound()]

setInterval(function () {
    tronState.push(nextRound(tronState))
    grid.content = `Round ${tronState.length}`
    screen.render()
}, tickInterval)

screen.render()

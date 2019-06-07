import React, { Component } from 'react'

function WaitingPlayers(props) {
    if (props.players.length === 0)
        return (
            <div className="textLobby">
                <div key="0" className="player">
                    No one is here.
                </div>
            </div>
        )
    else
        return (
            <div className="textLobby">
                {props.players.map((player, i) => {
                    return (
                        <div key={i} className="player">
                            {player.name}
                        </div>
                    )
                })}
            </div>
        )
}

class Lobby extends Component {
    constructor(props) {
        super(props)

        this.setUsernameGifUrls = [
            'e9aSISpSTtU4w', // monty python
            'xUySTIOsf7QxHx1gk0', // elf
            '10vXSmTzvg25Yk', // mr burns
            'l2SqcsbynKaOQYexG', // south park
            'w3B8L0cpSlwJ2', // blazing saddles
            '3o6ZtcaQX0Xa8FPLX2', // alien - people of earth
            '3o72EVymX8u70s22mQ', // devil wears prada
            '8TBsqQRCGhUDm', // my cousin vinny
            '3ohhwmiz7UTiKhCSoU', // schitts creek
            '3ohhwq5fVScLuq9hqo', // schitts creek 2
            'SrTogISS2hBBu', // the who drummer
            'l2YWC8lVRUjuTB2zS', // do the right thing
        ]

        this.waitingGifUrls = [
            'rq6c5xD7leHW8', // big lebowski
            'tXL4FHPSnVJ0A', // little rascals
            'F77lbfwEAnYNG', // hey arnold
            'AMSUrxqH4vxPW', // dexters laborotory
            'ZXKZWB13D6gFO', // alice in wonderland
            'PWfHC8ogZpWcE', // daffy duck
            'ZcnwOpPTw9Ucw', // the grinch
            'kpzfYwBT7nUVW', // colbert
            '3o85xscgnCWS8Xxqik', // abstract thumbs
        ]

        this.setUsernameGifUrl = this.setUsernameGifUrls[
            Math.floor(this.setUsernameGifUrls.length * Math.random())
        ]
        this.waitingGifUrl = this.waitingGifUrls[
            Math.floor(this.waitingGifUrls.length * Math.random())
        ]
        this.setUsernameGif = `https://media2.giphy.com/media/${
            this.setUsernameGifUrl
        }/giphy.gif`
        this.waitingGif = `https://media2.giphy.com/media/${
            this.waitingGifUrl
        }/giphy.gif`

        this.state = {
            inputtedUsername: '',
            badUsername: false,
            usernameSubmitted: false,
        }

        this.textInput = React.createRef()
    }

    fillUsername(event) {
        this.setState({
            inputtedUsername: event.target.value,
            badUsername: false,
        })
    }

    pressEnter(event) {
        if (event.key === 'Enter' && this.state.inputtedUsername)
            this.setUsername()
    }

    async setUsername() {
        if (!(await this.props.server.setName(this.state.inputtedUsername)))
            this.setState({ badUsername: true })
        else this.setState({ usernameSubmitted: true })
    }

    componentDidMount() {
        document.location.hash = this.props.roomId
        this.textInput.current.focus()
    }

    render() {
        let gif
        let action

        let badUsernameStatus = ''

        let waitingPlayers

        if (this.state.badUsername)
            badUsernameStatus = 'Username is already taken.'

        if (this.props.players) {
            waitingPlayers = (
                <div>
                    <WaitingPlayers players={this.props.players} />
                </div>
            )
        }

        if (!this.state.usernameSubmitted) {
            gif = <img src={this.setUsernameGif} alt="enter username" />

            action = (
                <div>
                    <input
                        className="inputLobby"
                        placeholder="Your Name"
                        ref={this.textInput}
                        onInput={event => this.fillUsername(event)}
                        onKeyDown={this.pressEnter.bind(this)}
                    />
                    <div>
                        <button
                            className="buttonLobby"
                            disabled={!this.state.inputtedUsername}
                            onClick={this.setUsername.bind(this)}
                        >
                            Set Username
                        </button>
                    </div>
                </div>
            )
        } else if (this.state.usernameSubmitted && this.props.isGameLeader) {
            gif = <img src={this.waitingGif} alt="waiting to begin" />

            action = (
                <div>
                    <button
                        className="buttonLobby"
                        disabled={this.props.players.length < 2}
                        onClick={async () =>
                            await this.props.server.startGame()
                        }
                    >
                        Start Game
                    </button>
                </div>
            )
        } else if (this.state.usernameSubmitted && !this.props.isGameLeader) {
            gif = <img src={this.waitingGif} alt="waiting to begin" />
            action = <div />
        }

        return (
            <div className="Lobby">
                {gif}
                <div className="textLobby">
                    <strong>{this.props.roomId}</strong>{' '}
                </div>
                <div>{badUsernameStatus}</div>
                {action}
                {waitingPlayers}
            </div>
        )
    }
}

export default Lobby

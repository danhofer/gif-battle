import React, { Component } from 'react'

class Staging extends Component {
    constructor(props) {
        super(props)

        this.headerGifUrls = [
            '28GHfhGFWpFgsQB4wR', // mrs doubtfire
            'l3V0uEmPgKpjZH6ve', // steve urkel
            'l0MYC0LajbaPoEADu', // dr evil
            'fOtA9hO1bNmaQ', // beauty and the beast
            'fTI9mBoWLef8k', // despicable me
            'l0MYNbSwbMyGTfASA', // colbert
            'NZmrvsfxpbTSU', // inigo montoya
            '3ornk57KwDXf81rjWM', // obi wan
        ]

        this.headerGifUrl = this.headerGifUrls[
            Math.floor(this.headerGifUrls.length * Math.random())
        ]
        this.headerGif = `https://media2.giphy.com/media/${
            this.headerGifUrl
        }/giphy.gif`

        this.state = {
            inputtedRoomId: '',
            // badRoomId: false,
            badRoomId: document.location.hash,
        }

        this.textInput = React.createRef()
    }

    onInput(event) {
        const value = event.target.value.toLowerCase()
        this.setState({
            inputtedRoomId: value,
            badRoomId: false,
        })
    }

    pressEnter(event) {
        if (event.key === 'Enter') this.joinRoomId()
    }

    async joinRoomId() {
        if (!(await this.props.server.joinLobby(this.state.inputtedRoomId)))
            this.setState({ badRoomId: true })
    }

    componentDidMount() {
        this.textInput.current.focus()
    }

    render() {
        let badIdStatus = ''

        if (this.state.badRoomId) badIdStatus = 'Room ID is not valid.'

        return (
            <div className="Staging">
                <img src={this.headerGif} alt="waiting to play" />
                <div>
                    <button
                        className="buttonStaging"
                        disabled={!this.state.inputtedRoomId}
                        onClick={this.joinRoomId.bind(this)}
                    >
                        Join Existing Game
                    </button>
                </div>
                <input
                    className="inputStaging"
                    placeholder="Game ID"
                    ref={this.textInput}
                    onInput={this.onInput.bind(this)}
                    onKeyDown={this.pressEnter.bind(this)}
                />

                <div className="buffer">OR</div>
                <button
                    className="buttonStaging"
                    onClick={async () => await this.props.server.newGame()}
                >
                    Create New Game
                </button>
                <div>{badIdStatus}</div>
                {/* </div> */}
            </div>
        )
    }
}

export default Staging

import React, { Component } from 'react'

const initialState = {
	scores: [],
	gamePhase: 'authoring',
	isGifSelected: false,

	roundSecondsCurrent: 0,
	roundSecondsAtStart: 0,

	promptText: '',
	promptUrl: '',
	promptId: '',
	promptSite: '',

	giphySearchResults: 5,
	giphyUrls: [],
	gifText: '',

	submissionUrl: '',

	itemsToChooseFrom: [],

	resultsOfVoting: [],
}

function GifViewer(props) {
	return (
		<div className={props.className}>
			{props.gifs.map((item, i) => {
				let clickFunction

				if (props.gamePhase === 'authoring')
					clickFunction = () => props.selectGif(item.url)
				else if (props.gamePhase === 'voting') 
					clickFunction = () => props.selectGif(i)
				else if (props.gamePhase === 'end')
					clickFunction = () => props.selectGif(i)

				if (item.url) {
					return (
						<div key={i} className="gifViewer">
							<img
								onClick={async (i) => clickFunction(i)}
								src={item.url}
								alt="gif"
							/>
							<br />
							<div className="gifText">{item.text}</div>
							<br />
							{item.player}
							<br />
							{item.votes}
						</div>
					)
				} else return <div key={i} />
			})}
		</div>
	)
}

function Scores(props) {
	return (
		<div className="scores">
			{props.scores.map((player, i) => {
				return (
					<div key={i} className="player">
						{player.name}: {player.score}
					</div>
				)
			})}
		</div>
	)
}

function Timer(props) {
	if (props.gamePhase === 'authoring'){
		if (props.roundSecondsCurrent > props.roundSecondsAtStart/2)
			return <div className="timerGreen">{props.timeLeft}</div>
		else if (props.roundSecondsCurrent > props.roundSecondsAtStart/4)
			return <div className="timerYellow">{props.timeLeft}</div>
		else
			return <div className="timerRed">{props.timeLeft}</div>
	}
	else return null
}

class Game extends Component {
	constructor(props) {
		super(props)

		this.state = initialState

		this.textInput = React.createRef()
	}

	componentDidMount() {
		this.prompt = event => {
			this.setState({
				promptId: event.detail.promptId,
				promptText: event.detail.promptText,
				promptUrl: event.detail.promptUrl,
				promptSite: event.detail.promptSite,
			})
		}
		this.props.server.addEventListener('prompt', this.prompt)

		this.choose = event => {
			const itemsToChooseFrom = event.detail.submissions
			this.setState({ itemsToChooseFrom })
		}
		this.props.server.addEventListener('choose', this.choose)

		this.forceSubmit = async () => {
			await this.submit()
		}
		this.props.server.addEventListener('forceSubmit', this.forceSubmit)

		this.result = event => {
			const resultsOfVoting = event.detail.result
			this.setState({ resultsOfVoting })
		}
		this.props.server.addEventListener('result', this.result)

		this.newRound = () => {
			const scores = this.state.scores

			this.setState(initialState)
			this.setState({ scores })
		}
		this.props.server.addEventListener('newRound', this.newRound)

		this.scores = event => {
			const scores = event.detail.scores
			this.setState({ scores })
		}
		this.props.server.addEventListener('scores', this.scores)

		this.round = event => {
			this.setState({
				currentRound: event.detail.currentRound,
				maxRounds: event.detail.maxRounds,
				roundSecondsCurrent: event.detail.roundSeconds,
				roundSecondsAtStart: event.detail.roundSeconds,
			})
		}
		this.props.server.addEventListener('round', this.round)

		this.timer = setInterval(() => this.tick(), 1000)

		this.textInput.current.focus()
	}

	componentWillUnmount() {
		this.props.server.removeEventListener('prompt', this.prompt)
		this.prompt = null

		this.props.server.removeEventListener('choose', this.choose)
		this.choose = null

		this.props.server.removeEventListener('result', this.result)
		this.result = null

		this.props.server.removeEventListener('newRound', this.newRound)
		this.newRound = null

		this.props.server.removeEventListener('scores', this.scores)
		this.scores = null

		this.props.server.removeEventListener('round', this.round)
		this.round = null

		clearInterval(this.timer)
	}

	async submit() {
		this.setState({ gamePhase: 'voting' })
		await this.props.server.setSubmission(
			this.state.submissionUrl,
			this.state.gifText
		)
	}

	tick() {
		let roundSecondsCurrent = this.state.roundSecondsCurrent
		if (roundSecondsCurrent > 0) {
			roundSecondsCurrent--
			const minutes = Math.floor(roundSecondsCurrent / 60)
			const seconds = ('0' + (roundSecondsCurrent % 60)).slice(-2)

			const timeLeft = `${minutes}:${seconds}`

			this.setState({ timeLeft, roundSecondsCurrent })
		}
	}

	render() {
		let currentPhase
		let selection

		if (this.state.gamePhase === 'authoring')
		{
			selection = (
				<div>
					<div>
						<div className="selectedGif">
						<img src={this.state.submissionUrl} alt="selected gif" />
							<div className="selectedGifText">
								{this.state.gifText}
							</div>
						</div>
					</div>
					<input
						className="inputGameText"
						placeholder="Optional Text"
						onInput={event => {
							this.setState({ gifText: event.target.value })
						}}
					/>
					<div>
						<button
							className="buttonGame"
							onClick={async () => {
								await this.submit()
							}}
						>
							Submit Gif
						</button>
					</div>
				</div>
			)
			currentPhase = (
				<div className="Authoring">
					<input
						ref={this.textInput}
						className="inputGameGiphy"
						placeholder="Search Giphy"
						value={this.state.inputText}
						onInput={event => {
							const inputText = event.target.value
							this.setState({inputText})
							const typingDelayDuration  = 1000

							const limit = this.state.giphySearchResults
							const newlySearchedGiphyUrls = []
							const searchQuery = event.target.value

							fetch(
								'https://api.giphy.com/v1/gifs/search?q=' +
									searchQuery +
									'&api_key=d6b6bccd7ab2472ab05d33299e466e94&limit=' +
									limit
							)
								.then(cows => {
									return cows.json()
								})
								.then(obj => {
									for (const item of obj.data) {
										newlySearchedGiphyUrls.push({
											url: item.images.original.url,
										})
									}
									if (
										searchQuery &&
										!newlySearchedGiphyUrls.length
									)
										newlySearchedGiphyUrls.push({
											url:
												'https://media2.giphy.com/media/xTiN0L7EW5trfOvEk0/giphy.gif',
										})
										clearTimeout(this.inputTimer)
										this.inputTimer = setTimeout( () => {
									this.setState({
										giphyUrls: newlySearchedGiphyUrls,
									})
								}, typingDelayDuration)

								})
						}}
					/>
					<div> Your reaction:</div>
					<GifViewer
						gamePhase={this.state.gamePhase}
						selectGif={async url =>{
							this.setState({
								inputText: '',
								submissionUrl: url,
								giphyUrls: [] })
							}
						}
						gifs={this.state.giphyUrls}
						className="GifsToSelect"
					/>
					{this.state.submissionUrl && selection}
				</div>
			)
		}
		else if (
			this.state.gamePhase === 'voting' &&
			this.state.itemsToChooseFrom.length === 0
		) {
			currentPhase = (
				<div className="Voting">
					Waiting for other players to select gifs.
				</div>
			)
		} else if (this.state.gamePhase === 'voting')
			currentPhase = (
				<div className="Voting">
					Select one gif to vote for.
					<GifViewer
						gamePhase={this.state.gamePhase}
						selectGif = {async voteIndex => {
							this.setState({ gamePhase: 'end' })
							await this.props.server.vote(
								voteIndex
							)
						}}
						gifs={this.state.itemsToChooseFrom}
						className="SubmittedGifs"
					/>
				</div>
			)
		else if (
			this.state.gamePhase === 'end' &&
			this.state.resultsOfVoting.length === 0
		) {
			currentPhase = (
				<div className="End">
					Waiting for other players to vote on gifs.
				</div>
			)
		} else if (this.state.gamePhase === 'end' && !this.props.isGameLeader) {
			currentPhase = (
				<div className="End">
					Round End
					<div className="SubmittedGifs" />
					<GifViewer
						gamePhase={this.state.gamePhase}
						selectGif={async i => console.log(i)}
						gifs={this.state.resultsOfVoting}
						className="VoteResults"
					/>
				</div>
			)
		} else if (this.state.gamePhase === 'end' && this.props.isGameLeader) {
			const newRoundButton = (
				<button
					disabled={this.state.resultsOfVoting.length === 0}
					className="NewRoundButton"
					onClick={async () => await this.props.server.newRound()}
				>
					Next Round
				</button>
			)

			const endGameButton = (
				<button
					disabled={this.state.resultsOfVoting.length === 0}
					className="EndGameButton"
					onClick={async () => await this.props.server.endGame()}
				>
					End Game
				</button>
			)

			currentPhase = (
				<div className="End">
					Round End
					<div className="SubmittedGifs">
						<GifViewer
							gamePhase={this.state.gamePhase}
							selectGif={async i => console.log(i)}
							gifs={this.state.resultsOfVoting}
							className="VoteResults"
						/>
					</div>
					<div className="buffer">
						{this.state.currentRound < this.state.maxRounds
							? newRoundButton
							: endGameButton}
					</div>
				</div>
			)
		}

		return (
			<div className="Game">
				<div className="Round">
					Round: {this.state.currentRound}/{this.state.maxRounds}
				</div>
				<Scores className="Scores" scores={this.state.scores} />
				<Timer
					timeLeft={this.state.timeLeft}
					roundSecondsCurrent={this.state.roundSecondsCurrent}
					roundSecondsAtStart={this.state.roundSecondsAtStart}
					gamePhase={this.state.gamePhase}
				/>
				<div className="PromptText">
					"{this.state.promptText}" 
					<a
						href={this.state.promptUrl}
						target="_blank"
						rel="noopener noreferrer"
					>
						({this.state.promptSite})
					</a>
					
				</div>

				{currentPhase}
			</div>
		)
	}
}

export default Game

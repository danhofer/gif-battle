import React, { Component } from 'react'

const initialState = {
	scores: [],
	gamePhase: 'authoring',
	isAuthor: true,
	isGifSelected: false,
	isVoter: true,

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
	voteIndex: -1,

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
								onClick={async () => clickFunction()}
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

		this.forceVote = async () => {
			await this.vote()
		}
		this.props.server.addEventListener('forceVote', this.forceVote)

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

	async vote() {
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
		let selectedGifToSubmit
		let selectedGifToVoteOn
		let selectedTextToVoteOn

		if (this.state.submissionUrl.length)
			selectedGifToSubmit = (
				<img src={this.state.submissionUrl} alt="selected gif" />
			)
		else
				selectedGifToSubmit = (
					<div className="noGifSelected"></div>
				)

		if (this.state.voteIndex > -1) {
			selectedGifToVoteOn = (
				<img
					src={this.state.itemsToChooseFrom[this.state.voteIndex].url}
					alt="gif voting for"
				/>
			)
		} else if (this.state.voteIndex <= -1)
			selectedGifToVoteOn = (
				<img
					src={
						'https://media.giphy.com/media/13bGgH9VnEDsuA/giphy.gif'
					}
					alt="gif voting for"
				/>
			)

		if (this.state.voteIndex > -1) {
			selectedTextToVoteOn = this.state.itemsToChooseFrom[
				this.state.voteIndex
			].text
		}

		if (this.state.gamePhase === 'authoring' && this.state.isAuthor)
			currentPhase = (
				<div className="Authoring">
					<input
						ref={this.textInput}
						className="inputGameGiphy"
						placeholder="Search Giphy"
						onInput={event => {
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
											url: item.images.original.webp,
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
									this.setState({
										giphyUrls: newlySearchedGiphyUrls,
									})
								})
						}}
					/>
					<GifViewer
						gamePhase={this.state.gamePhase}
						selectGif={async url =>
							this.setState({ submissionUrl: url })
						}
						gifs={this.state.giphyUrls}
						className="GifsToSelect"
					/>
					<div>
						<div> Your reaction:</div>
						<div className="selectedGif">
							{selectedGifToSubmit}
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
							disabled={!this.state.submissionUrl}
							onClick={async () => {
								await this.vote()
							}}
						>
							Submit Gif
						</button>
					</div>
				</div>
			)
		else if (this.state.gamePhase === 'authoring' && !this.state.isAuthor)
			currentPhase = (
				<div className="Authoring">
					Waiting for other players to select gifs.
				</div>
			)
		else if (
			this.state.gamePhase === 'voting' &&
			this.state.itemsToChooseFrom.length === 0
		) {
			currentPhase = (
				<div className="Voting">
					Waiting for other players to select gifs.
				</div>
			)
		} else if (this.state.gamePhase === 'voting' && this.state.isVoter)
			currentPhase = (
				<div className="Voting">
					<div>
						<div className="selectedGif">
							{selectedGifToVoteOn}
							<div className="selectedGifText">
								{selectedTextToVoteOn}
							</div>
						</div>
					</div>
					<div>
						<button
							className="buttonGame"
							disabled={this.state.voteIndex < 0}
							onClick={async () => {
								this.setState({ gamePhase: 'end' })
								await this.props.server.vote(
									this.state.voteIndex
								)
							}}
						>
							Submit Vote
						</button>
					</div>
					Select one gif to vote for.
					<GifViewer
						gamePhase={this.state.gamePhase}
						isVoter={this.state.isVoter}
						selectGif={async voteIndex =>
							this.setState({ voteIndex })
						}
						gifs={this.state.itemsToChooseFrom}
						className="SubmittedGifs"
					/>
				</div>
			)
		else if (this.state.gamePhase === 'voting' && !this.state.isVoter)
			currentPhase = (
				<div className="Voting">
					Waiting for other players to vote on gifs.
					{/* User can't choose these gifs because they are not a voter */}
					<GifViewer
						gamePhase={this.state.gamePhase}
						isVoter={this.state.isVoter}
						selectGif={async i => console.log(i)}
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

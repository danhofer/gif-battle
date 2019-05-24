import React, { Component } from 'react'

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

class Podium extends Component {
	render() {
		const playAgainButton = (
			<div>
				<button
					className="buttonPodium"
					disabled={this.props.players.length < 2}
					onClick={async () => await this.props.server.startGame()}
				>
					Play Again
				</button>
			</div>
		)

		return (
			<div className="Podium">
				game end
				<div className="FinalScore">final score</div>
				<Scores className="Scores" scores={this.props.finalScores} />
				{this.props.isGameLeader && playAgainButton}
			</div>
		)
	}
}

export default Podium

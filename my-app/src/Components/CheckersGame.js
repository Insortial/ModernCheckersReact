import React, { Component } from 'react'
import CheckersBoard from './CheckersBoard'

class CheckersGame extends Component {
    constructor(props) {
        super(props)
        this.divRef = React.createRef()
        this.player1 = React.createRef()
        this.player2 = React.createRef()
        this.modalScreen = React.createRef()
        this.state = {
            active: false,
            currentPlayer: 1,
            player1Score: 0,
            player2Score: 0,
            endGame: 'none',
            winner: '',
            restartGame: false
        }
    }
    
    setPlayerColor = (player) => {
        if(player === 1) {
            this.setState({
                currentPlayer: 1
            })
        } else {
            this.setState({
                currentPlayer: 2
            })
        }
    }

    setPlayerScore = (player) => {
        let score
        if(player === 1) {
            score = this.state.player1Score
            score++
            this.setState({
                player1Score: score
            })
            this.checkScore(score, player)
        } else {
            score = this.state.player2Score
            score++
            this.setState({
                player2Score: score
            })
            this.checkScore(score, player)
        }
    }

    setRestartGame = () => {
        this.setState({
            restartGame: false
        })
    }

    restartGame = () => {
        this.setState({
            currentPlayer: 1,
            player1Score: 0,
            player2Score: 0,
            endGame: 'none',
            winner: '',
            restartGame: true
        })
    }

    goHome = () => {
        console.log("Works")
        this.props.ChangeScreen()
        this.restartGame()
    }

    checkScore(score, player) {
        console.log(score)
        if(score === 12) {
            this.setState({
                endGame: 'flex',
                winner: player
            })
        }
    }

    render() {
        return (
            <div id="checkers_game" ref={this.divRef}>
                <div id="modalscreen" ref={this.modalScreen} style={{display: this.state.endGame}}></div>
                <div id="end_screen" style={{top: (this.state.endGame === 'flex') ? '0' : '-4000px'}}> 
                    <div id="text_container">
                        <h3>YOU WON</h3>
                        <h1 style={{color: (this.state.winner === 1) ? '#C26969' : '#686565'}}>PLAYER {this.state.winner}</h1>
                    </div>
                    <div className="circle" id="circle1"></div>
                    <div className="circle" id="circle2"></div>
                    <div id="buttons">
                        <div id="button" onClick={this.goHome}>HOME</div>
                        <div id="button" onClick={this.restartGame}>PLAY AGAIN</div>
                    </div>
                </div>
                <section id="score">
                    <span className="players">
                        <h3 id="player1" ref={this.player1}>Player 1</h3>
                        <h2 id="player1score">{this.state.player1Score}</h2>
                    </span>
                    <span className="players">
                        <h3 id="player2" ref={this.player2}>Player 2</h3>
                        <h2>{this.state.player2Score}</h2>
                    </span>
                </section>
                <section id="board_section">
                    <section className="board" style={{transform: (this.props.onlinePlayer === 2) ? 'rotateX(180deg)' : 'none'}}>
                        <CheckersBoard setPlayerColor={this.setPlayerColor} onlinePlayer={this.props.onlinePlayer} setPlayerScore={this.setPlayerScore} restartGame={this.state.restartGame} setRestartGame={this.setRestartGame} currentRoom={this.props.currentRoom} player1Score={this.state.player1Score} player2Score={this.state.player2Score}/>
                    </section>
                </section>
                <section id="footer" className={'player' + this.state.currentPlayer}>
                    <span id="home" className="gam_buttons" onClick={this.goHome}>
                        <svg width="90%" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"><path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z"></path></svg>
                    </span>
                    <span className="gam_buttons" onClick={this.restartGame} style={{display: (this.props.currentRoom !== undefined) ? 'none' : 'block'}}>
                        <svg width="90%" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12.75 8a4.5 4.5 0 0 1-8.61 1.834l-1.391.565A6.001 6.001 0 0 0 14.25 8 6 6 0 0 0 3.5 4.334V2.5H2v4l.75.75h3.5v-1.5H4.352A4.5 4.5 0 0 1 12.75 8z"></path></svg>
                    </span>
                </section>
            </div>
        )
    }
}

export default CheckersGame

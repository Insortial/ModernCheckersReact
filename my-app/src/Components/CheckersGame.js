import React, { Component } from 'react'
import CheckersBoard from './CheckersBoard'

class CheckersGame extends Component {
    constructor(props) {
        super(props)
        this.divRef = React.createRef()
        this.player1 = React.createRef()
        this.player2 = React.createRef()
        this.state = {
             active: false
        }
    }
    
    render() {
        return (
            <div id="checkers_game" ref={this.divRef}>
                <section id="score">
                    <span className="players">
                        <h3 id="player1" ref={this.player1}>Player 1</h3>
                        <h2 id="player1score">0</h2>
                    </span>
                    <span className="players">
                        <h3 id="player2" ref={this.player2}>Player 2</h3>
                        <h2>0</h2>
                    </span>
                </section>
                <section id="board_section">
                    <section className="board">
                        <CheckersBoard />
                    </section>
                </section>
                <section id="footer">
                    <span id="home" className="gam_buttons" onClick={this.props.ChangeScreen}></span>
                    <span className="gam_buttons"></span>
                </section>
            </div>
        )
    }
}

export default CheckersGame

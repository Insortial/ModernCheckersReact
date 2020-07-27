import React, { Component } from 'react'

class CheckersBoard extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            winner: '',
            spaces: 64,
            
        }
    }
    
    render() {
        return (
            <section id="board">
                
            </section>
        )
    }
}

export default CheckersBoard

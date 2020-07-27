import React, { Component } from 'react'

class Piece extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             row: null,
             column: null,
             isActive: false,
             canJump: false,
             isKing: false,

        }
    }
    
    render() {
        return (
            <div>
            </div>
        )
    }
}

export default Piece

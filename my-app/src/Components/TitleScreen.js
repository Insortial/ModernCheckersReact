import React, { Component } from 'react'
import CheckersAnimation from './CheckersAnimation'

class TitleScreen extends Component {
    constructor(props) {
        super(props)
        this.divRef = React.createRef()
    
        this.state = {
             active: true
        }
    }
    
    componentDidMount() {
        
    }

    render() {
        return (
            <div id="title_screen" ref={this.divRef}>
                <h1 id="title">CHECKERS</h1>
                <div id="button" onClick={this.props.EnterModal}>LOCAL</div>
                <div id="button" onClick={this.props.EnterOnlineGame}>ONLINE</div>
                <CheckersAnimation />
            </div>
        )
    }
}

export default TitleScreen

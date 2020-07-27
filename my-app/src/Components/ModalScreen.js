import React, { Component } from 'react'

class ModalScreen extends Component {
    constructor(props) {
        super(props)
        this.divRef = React.createRef()
        this.inputRef = React.createRef()
        this.labelRef = React.createRef()
        this.nameButtonRef = React.createRef()
        this.enterButtonRef = React.createRef()
        this.state = {
            active: false
        }
    }
    
    render() {
        return (
            <div id="modalscreen" ref={this.divRef}>
                <div id="modal">
                    <label htmlFor="name" id="nameLabel" ref={this.labelRef}>Player 1</label>
                    <input type="text" id="name" ref={this.inputRef} />
                    <button className="submit" onClick={this.props.EnterGame} ref={this.nameButtonRef}>Submit</button>
                    <button id="enter" className="submit" onClick={this.props.EnterGame} ref={this.enterButtonRef}>Enter Game</button>
                </div>
            </div>
        )
    }
}

export default ModalScreen

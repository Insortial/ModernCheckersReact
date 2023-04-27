import React, { Component } from 'react'

class ModalScreen extends Component {
    constructor(props) {
        super(props)
        this.divRef = React.createRef()
        this.inputRef = React.createRef()
        this.onlineInputRef = React.createRef()
        this.labelRef = React.createRef()
        this.nameButtonRef = React.createRef()
        this.enterButtonRef = React.createRef()
        this.onlineButtonsRef = React.createRef()
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
                    <input type="text" id="name2" ref={this.onlineInputRef} readOnly/>
                    <div id="onlineButtons" ref={this.onlineButtonsRef}>
                        <button className="submit" onClick={this.props.HostGame}>HOST GAME</button>
                        <button className="submit" onClick={this.props.JoinGame}>JOIN GAME</button>
                    </div>
                </div>
                <span id="exitButton" onClick={this.props.ExitModal}>
                    <svg width="90%" stroke="currentColor" fill="currentColor" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>
                </span>
            </div>
        )
    }
}

export default ModalScreen

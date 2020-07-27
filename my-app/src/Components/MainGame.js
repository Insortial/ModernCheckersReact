import React, { Component } from 'react'
import TitleScreen from './TitleScreen'
import CheckersGame from './CheckersGame'
import ModalScreen from './ModalScreen'

class MainGame extends Component {
    constructor(props) {
        super(props)
        this.titleRef = React.createRef()
        this.gameRef = React.createRef()
        this.modalRef = React.createRef()
        this.state = {
            player1Name: '',
            player2Name: '',
            player1Pieces: null,
            player2Pieces: null,
            canEnterGame: false
        }
        this.EnterGame = this.EnterGame.bind(this)
    }
    
    ChangeScreen = () => {
        console.log(this)
        if(!this.gameRef.current.state.active) {
            //Turns on Game Screen
            this.gameRef.current.divRef.current.style.display = 'grid'
            this.gameRef.current.state.active = true
            console.log(this.player1Name)
            //Attaching Player Names to the div
            this.gameRef.current.player1.current.textContent = this.state.player1Name
            this.gameRef.current.player2.current.textContent = this.state.player2Name
            //Turns off Title Screen
            this.titleRef.current.divRef.current.style.display = 'none'
            this.titleRef.current.state.active = false
            this.modalRef.current.divRef.current.style.display = 'none'
        } else {
            //Turns off Game Screen
            this.gameRef.current.divRef.current.style.display = 'none'
            this.gameRef.current.state.active = false
            //Turns on Title Screen
            this.titleRef.current.divRef.current.style.display = 'block'
            this.titleRef.current.state.active = true
            this.setState({
                player1Name: '',
                player2Name: ''
            })
        }
    }

    EnterModal = () => {
        this.modalRef.current.divRef.current.style.display = 'flex'
        this.modalRef.current.nameButtonRef.current.style.display = 'block'
        this.modalRef.current.labelRef.current.style.display = 'block'
        this.modalRef.current.inputRef.current.style.display = 'block'
        this.modalRef.current.enterButtonRef.current.style.display = 'none'
    }

    EnterGame = () => {
        if(this.state.player1Name === '' && this.modalRef.current.inputRef.current.value !== '') {
            console.log(this.modalRef.current.inputRef.current.value)
            const playerName1 = this.modalRef.current.inputRef.current.value
            this.setState({
                player1Name: playerName1
            }, function () {
                console.log(this.state.player1Name)
            })
            console.log(this.player1Name)
            this.modalRef.current.inputRef.current.value = ''
            this.modalRef.current.labelRef.current.textContent = 'Player 2'
            console.log(this.player1Name)
        } else if(this.modalRef.current.inputRef.current.value !== '') {
            const playerName2 = this.modalRef.current.inputRef.current.value
            this.setState({
                player2Name: playerName2,
                canEnterGame: true
            }, function () {
                console.log(this.state.player2Name)
            })
            this.modalRef.current.inputRef.current.value = ''
            this.modalRef.current.labelRef.current.textContent = 'Player 1'
            //Change UI to Enter Game Button
            this.modalRef.current.nameButtonRef.current.style.display = 'none'
            this.modalRef.current.labelRef.current.style.display = 'none'
            this.modalRef.current.inputRef.current.style.display = 'none'
            this.modalRef.current.enterButtonRef.current.style.display = 'block'
        } else if(this.state.canEnterGame) {
            this.ChangeScreen()
            //Create Chess Game Here
        }
    }

    render() {
        return (
            <div>
                <TitleScreen ref={this.titleRef} ChangeScreen={this.ChangeScreen} EnterModal={this.EnterModal}/>
                <CheckersGame ref={this.gameRef} ChangeScreen={this.ChangeScreen}/>
                <ModalScreen ref={this.modalRef} EnterGame={this.EnterGame}/>
            </div>
        )
    }
}

export default MainGame

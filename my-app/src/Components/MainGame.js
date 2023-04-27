import React, { useState, useRef, useEffect } from 'react'
import TitleScreen from './TitleScreen'
import CheckersGame from './CheckersGame'
import ModalScreen from './ModalScreen'
import { useSocket } from './SocketProvider'

function MainGame() {
    const socket = useSocket();
    const titleRef = useRef();
    const gameRef = useRef();
    const modalRef = useRef();
    const [player1Name, setPlayer1Name] = useState(null);
    const [player2Name, setPlayer2Name] = useState(null); 
    const [matchMade, setMatchMade] = useState(false);
    const [currentRoom, setCurrentRoom] = useState();
    const [player1Pieces, setPlayer1Pieces] = useState(null); 
    const [player2Pieces, setPlayer2Pieces] = useState(null); 
    const [onlinePlayer, setOnlinePlayer] = useState();
    const [canEnterGame, setCanEnterGame] = useState(false); 
    const [gameType, setGameType] = useState('local');


    useEffect(() => {
        if(socket == null) return

        socket.on('player-joined', ({ gameId }) => {
            setMatchMade(true);
            setCurrentRoom(gameId);
        })

        socket.on('finalized-names', ({ playerName, onlinePlayerNumber }) => {
            if(onlinePlayerNumber !== 1) {
                setPlayer2Name(playerName)
            } else {
                setPlayer1Name(playerName)
            }
        })

        return () => {
            socket.off('player-joined')
            socket.off('finalized-names')
        }
    }, [socket])

    useEffect(() => {
        if(player1Name !== null && player2Name !== null) {
            console.log("Passed")
            ChangeScreen();
        }
    }, [player1Name, player2Name, onlinePlayer])

    useEffect(() => {
        if(matchMade) {
            modalRef.current.labelRef.current.textContent = 'Enter Name'
            modalRef.current.inputRef.current.value = ''
            modalRef.current.onlineInputRef.current.style.display = 'none'
            modalRef.current.inputRef.current.style.display = 'block'
            modalRef.current.nameButtonRef.current.style.display = 'block'
        }
    }, [matchMade])

    const ChangeScreen = () => {
        if(!gameRef.current.state.active) {
            //Turns on Game Screen
            gameRef.current.divRef.current.style.display = 'grid'
            gameRef.current.state.active = true
            //Attaching Player Names to the div
            gameRef.current.player1.current.textContent = player1Name
            gameRef.current.player2.current.textContent = player2Name
            //Turns off Title Screen
            titleRef.current.divRef.current.style.display = 'none'
            titleRef.current.state.active = false
            modalRef.current.divRef.current.style.display = 'none'
        } else {
            //Turns off Game Screen
            gameRef.current.divRef.current.style.display = 'none'
            gameRef.current.state.active = false
            //Turns on Title Screen
            titleRef.current.divRef.current.style.display = 'block'
            titleRef.current.state.active = true
            setPlayer1Name(null);
            setPlayer2Name(null);
        }
    }

    const EnterModal = () => {
        modalRef.current.divRef.current.style.display = 'flex'
        modalRef.current.nameButtonRef.current.style.display = 'block'
        modalRef.current.labelRef.current.style.display = 'block'
        modalRef.current.inputRef.current.style.display = 'block'
        modalRef.current.enterButtonRef.current.style.display = 'none'
        modalRef.current.onlineInputRef.current.style.display = 'none'
        modalRef.current.onlineButtonsRef.current.style.display = 'none'
        modalRef.current.labelRef.current.textContent = 'Player 1'
        setGameType('local');
    }

    const ExitModal = () => {
        modalRef.current.divRef.current.style.display = 'none'
    }

    const EnterOnlineGame = () => {
        EnterModal();
        modalRef.current.onlineButtonsRef.current.style.display = 'flex'
        modalRef.current.labelRef.current.textContent = ''
        modalRef.current.nameButtonRef.current.style.display = 'none'
        modalRef.current.inputRef.current.style.display = 'none'
        modalRef.current.onlineInputRef.current.style.display = 'none'
        setGameType('online');
    }

    const JoinGame = () => {
        modalRef.current.onlineButtonsRef.current.style.display = 'none'
        modalRef.current.labelRef.current.textContent = 'Enter room ID'
        modalRef.current.inputRef.current.style.display = 'block'
        modalRef.current.nameButtonRef.current.style.display = 'block'
        setOnlinePlayer(2);
    }

    const HostGame = () => {
        modalRef.current.onlineButtonsRef.current.style.display = 'none'
        modalRef.current.labelRef.current.textContent = 'Send room ID'
        modalRef.current.onlineInputRef.current.style.display = 'block'
        let gameId = ( Math.random() * 100000 ) | 0;
        modalRef.current.onlineInputRef.current.value = gameId;
        setOnlinePlayer(1);
        socket.emit('create-game', { gameId });
    }

    const EnterGame = () => {
        if(gameType === 'local') {
            if(player1Name === null && modalRef.current.inputRef.current.value !== '') {
                const playerName1 = modalRef.current.inputRef.current.value
                setPlayer1Name(playerName1);
                modalRef.current.inputRef.current.value = ''
                modalRef.current.labelRef.current.textContent = 'Player 2'
            } else if(modalRef.current.inputRef.current.value !== '') {
                const playerName2 = modalRef.current.inputRef.current.value
                setPlayer2Name(playerName2);
                setCanEnterGame(true);
                modalRef.current.inputRef.current.value = ''
                modalRef.current.labelRef.current.textContent = 'Player 1'
                //Change UI to Enter Game Button
                modalRef.current.nameButtonRef.current.style.display = 'none'
                modalRef.current.labelRef.current.style.display = 'none'
                modalRef.current.inputRef.current.style.display = 'none'
                modalRef.current.enterButtonRef.current.style.display = 'block'
            } else if(canEnterGame) {
                ChangeScreen()
                //Create Chess Game Here
            }
        } else if(gameType === 'online') {
            if(!matchMade) {
                let gameId = parseInt(modalRef.current.inputRef.current.value);
                socket.emit('join-game', { gameId });
            } else {
                let playerName = modalRef.current.inputRef.current.value;
                if(onlinePlayer === 1) {
                    setPlayer1Name(playerName);
                } else {
                    setPlayer2Name(playerName);
                }
                socket.emit('player-name', { playerName, currentRoom, onlinePlayer });
            }
        }
    }

    return (
        <div>
            <TitleScreen ref={titleRef} ChangeScreen={ChangeScreen} EnterModal={EnterModal} EnterOnlineGame={EnterOnlineGame}/>
            <CheckersGame ref={gameRef} ChangeScreen={ChangeScreen} onlinePlayer={onlinePlayer} currentRoom={currentRoom}/>
            <ModalScreen ref={modalRef} EnterGame={EnterGame} ExitModal={ExitModal} JoinGame={JoinGame} HostGame={HostGame}/>
        </div>
    )
}

export default MainGame

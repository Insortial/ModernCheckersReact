import React, { useState, useEffect } from 'react'
import { useSocket } from './SocketProvider'

function CheckersBoard (props) {

    const socket = useSocket();
    const [winner, setWinner] = useState('');
    const [ChessSpaces, setChessSpaces] = useState([]);
    const [Pieces, setPieces] = useState([]);
    const [PlayerActive, setPlayerActive] = useState(1);
    const [activePiece, setActivePiece] = useState(null);
    const [highlightedSpaces, setHighlightedSpaces] = useState([]);
    const [canJump, setCanJump] = useState(false);
    const [onlineState, setOnlineState] = useState({
        currentRoom: null,
        winner: "",
        ChessSpaces: [],
        Pieces: [],
        didTakePiece: false,
        pieceCanJump: false,
        PlayerActive: 1,
        player1ScoreAdded: 0,
        player2ScoreAdded: 0,
        activePiece: null,
        highlightSpaces: [],
        canJump: false,
    })
    
    const createSpace = (type, key, occupied, column, row, highlighted) => {
        let space = {};

        space.type = type;
        space.key = key;
        space.occupied = occupied;
        space.column = column;
        space.row = row;
        space.highlighted = highlighted;
        space.jumpSpace = false;
        space.removePiece = null;

        return space
    }

    const createSpaces = () => {
        const SpaceArray = []
        let row = 0
        for(let i = 0; i < 64; i++) {
            if((i % 2 === 0 && row % 2 === 0) || (i % 2 === 1 && row % 2 === 1)) {
                if(i < 23 || (i > 40 && i < 64)) {
                    SpaceArray.push(createSpace(1, i, true, i % 8, row, false))
                } else {
                    SpaceArray.push(createSpace(1, i, false, i % 8, row, false))
                }
            } else if((i % 2 === 1 && row % 2 === 0) || (i % 2 === 0 && row % 2 === 1)) {
                SpaceArray.push(createSpace(2, i, false, i % 8, row, false))
            }

            if((i + 1) % 8 === 0) {
                row++
            }
        } 
        return SpaceArray
    }

    const BoardFinder = (array, column, row) => {
        return array.filter(space => {
            if(space.column === column) {
                if(space.row === row) {
                    return space
                } else {
                    return null
                }
            }
            return null
        })
    }

    const SpaceFinder = (column, row, type, key) => {
        let space = BoardFinder(ChessSpaces, column, row)[0]

        let Player1Pieces = Pieces.filter(piece => {
            if(piece.player === 1) {
                if(piece.inUse) {
                    return piece 
                }
            }
            return null
        })

        let Player2Pieces = Pieces.filter(piece => {
            if(piece.player === 2) {
                if(piece.inUse) {
                    return piece 
                }
            }
            return null
        })

        if(space.occupied) {
            if(PlayerActive === 1) {
                let foundPiece = BoardFinder(Player2Pieces, column, row)[0]
                if(typeof foundPiece !== 'undefined' && foundPiece !== null) {
                    setCanJump(true)
                    switch(type) {
                        case 1:
                            space = BoardFinder(ChessSpaces, column + 1, row - 1)[0]
                            break;
                        case 2:
                            space = BoardFinder(ChessSpaces, column - 1, row - 1)[0]
                            break;
                        case 3:
                            space = BoardFinder(ChessSpaces, column + 1, row + 1)[0]
                            break;
                        case 4:
                            space = BoardFinder(ChessSpaces, column - 1, row + 1)[0]
                            break;
                        default:
                            break;
                    }
                    if(typeof space !== 'undefined') {
                        if(space.occupied === false) {
                            space.jumpSpace = true
                            space.removePiece = foundPiece
                            return space
                        }
                    }
                }
            } else if(PlayerActive === 2) {
                let foundPiece = BoardFinder(Player1Pieces, column, row)[0]
                if(typeof foundPiece !== 'undefined' && foundPiece !== null) {
                    setCanJump(true)
                    switch(type) {
                        case 1:
                            space = BoardFinder(ChessSpaces, column + 1, row - 1)[0]
                            break;
                        case 2:
                            space = BoardFinder(ChessSpaces, column - 1, row - 1)[0]
                            break;
                        case 3:
                            space = BoardFinder(ChessSpaces, column + 1, row + 1)[0]
                            break;
                        case 4:
                            space = BoardFinder(ChessSpaces, column - 1, row + 1)[0]
                            break;
                        default:
                            break;
                    }
                    if(typeof space !== 'undefined') {
                        if(space.occupied === false) {
                            space.jumpSpace = true
                            space.removePiece = foundPiece
                            return space
                        }
                    }
                }
            }
            return space
        } else {
            return space
        }
    }

    const canHighlight = (player, isKing, space) => {
        if(space != null) {
            if(!space.occupied) {
               let newSpaces = [...ChessSpaces]
               newSpaces[space.key].highlighted = true
               setChessSpaces(newSpaces)
            }
        }
    }

    const checkForJumpablePieces = (array, player, king, piece) => {
        let newHighlightedSpaces = []
        let jumpSpaces = array.filter(space => {
            if(space !== null && typeof space !== 'undefined') {
                if(space.jumpSpace === true) {
                    return space
                }
            }
            return null
        })

        if(!piece.followupJump) {
            if(jumpSpaces.length !== 0) {
                jumpSpaces.forEach(space => {
                    canHighlight(player, king, space)
                    newHighlightedSpaces.push(space)
                })
            } else {
                array.forEach(space => {
                    canHighlight(player, king, space)
                    newHighlightedSpaces.push(space)
                })
            }
        } else {
            jumpSpaces.forEach(space => {
                canHighlight(player, king, space)
                newHighlightedSpaces.push(space)
            })   
        }
        
        return newHighlightedSpaces
    }

    const highlightSpaces = (piece) => {
        setActivePiece(piece)

        const { row, column } = piece
        
        let newHighlightedSpaces;
        let newSpaces = []
        let jumpAgain = false

        let highlightRow1 = row - 1
        let highlightRow2 = row + 1
        let highlightColumn1 = column + 1
        let highlightColumn2 = column - 1

        let space1 = null
        //Upper Right Space
        let space2 = null
        //Upper Left Space
        let space3 = null
        //Lower Right Space
        let space4 = null
        //Lower Left Space 

        if(highlightRow1 >= 0 && highlightRow1 < 8) {
            if(highlightColumn1 >= 0 && highlightColumn1 < 8) {
                space1 = SpaceFinder(highlightColumn1, highlightRow1, 1, piece.key)
            }

            if(highlightColumn2 >= 0 && highlightColumn2 < 8) {
                space2 = SpaceFinder(highlightColumn2, highlightRow1, 2, piece.key)      
            }
        }

        if(highlightRow2 >= 0 && highlightRow2 < 8) {
            if(highlightColumn1 >= 0 && highlightColumn1 < 8) {
                space3 = SpaceFinder(highlightColumn1, highlightRow2, 3, piece.key)
            }

            if(highlightColumn2 >= 0 && highlightColumn2 < 8) {
                space4 = SpaceFinder(highlightColumn2, highlightRow2, 4, piece.key)       
            }
        }

        if(!piece.isKing) {
            if(piece.player === 1) {//Player 1
                if((space3 !== null && typeof space3 !== 'undefined') && (typeof space4 !== 'undefined' && space4 !== null)) {
                    space3.jumpSpace = false
                    space4.jumpSpace = false
                }
                newSpaces.push(space1, space2)
                newHighlightedSpaces = checkForJumpablePieces(newSpaces, piece.player, piece.isKing, piece)
                newSpaces.forEach(space => {
                    if(typeof space !== 'undefined' && space !== null) {
                        if(space.jumpSpace) {
                            jumpAgain = true
                        }
                    }
                })
            } else {//Player 2
                if((space1 !== null && typeof space1 !== 'undefined') && (typeof space2 !== 'undefined' && space2 !== null)) {
                    space1.jumpSpace = false
                    space2.jumpSpace = false
                }
                newSpaces.push(space3, space4)
                newHighlightedSpaces = checkForJumpablePieces(newSpaces, piece.player, piece.isKing, piece)
                newSpaces.forEach(space => {
                    if(typeof space !== 'undefined' && space !== null) {
                        if(space.jumpSpace) {
                            jumpAgain = true
                        }
                    }
                })
            }
        } else {//King 
            newSpaces.push(space1, space2, space3, space4)
            newHighlightedSpaces = checkForJumpablePieces(newSpaces, piece.player, piece.isKing, piece)
            newSpaces.forEach(space => {
                if(typeof space !== 'undefined' && space !== null) {
                    if(space.jumpSpace) {
                        jumpAgain = true
                    }
                }
            })
        }
        setHighlightedSpaces(newHighlightedSpaces)
        return jumpAgain
    }

    const createPiece = (row, column, player, key) => {
        let piece = {};

        piece.column = column;
        piece.row = row;
        piece.key = key;
        piece.player = player;
        piece.isActive = false;
        piece.inUse = true;
        piece.followupJump = false;
        piece.isKing = false

        return piece
    }

    const createPieces = () => {
        const newPlayerPieces = []
        let row = 0
        for(let i = 0; i < 24; i++) {
            if(row === 3) {
                row += 2
            } 
        
            switch(row) {
                case 0:
                    newPlayerPieces.push(createPiece(row, 0 + (i * 2), 2, i))
                    break;
                case 1:
                    newPlayerPieces.push(createPiece(row, 1 + ((i - 4) * 2), 2, i))
                    break;
                case 2:
                    newPlayerPieces.push(createPiece(row, 0 + ((i - 8) * 2), 2, i))
                    break;
                case 5:
                    newPlayerPieces.push(createPiece(row, 1 + ((i - 12) * 2), 1, i))
                    break;
                case 6:
                    newPlayerPieces.push(createPiece(row, 0 + ((i - 16) * 2), 1, i))
                    break;
                case 7:
                    newPlayerPieces.push(createPiece(row, 1 + ((i - 20) * 2), 1, i))
                    break;
                default:
                    break;
            }

            if(i % 4 === 3 && i >= 3) {
                row++
            }
        }

        setPieces(newPlayerPieces)
    }

    const unHighlightSpaces = () => {
        let newSpaces = [...ChessSpaces]
/*         highlightedSpaces.forEach(space => {
            if(space != null) {
                spaces[space.key].highlighted = false
            }
        })
        setState({
            ChessSpaces: spaces,
            highlightedSpaces: []
        }) */
        newSpaces.forEach(space => {
            space.highlighted = false;
        })

        setChessSpaces(newSpaces);
        setHighlightedSpaces([]);
    }

    const removeSpaceProperties = () => {
        let newSpaces = [...ChessSpaces]
        newSpaces.forEach(space => {
            space.jumpSpace = false;
            space.removePiece = null;
        })
        setChessSpaces(newSpaces)
    }

    const onPieceClick = (piece) => {
        let pieces = [...Pieces]

        if(activePiece != null) {
            pieces[activePiece.key].isActive = false
            unHighlightSpaces()
        }

        if((PlayerActive === piece.player && props.onlinePlayer === undefined) || props.onlinePlayer === piece.player && PlayerActive === piece.player) {
            if(!piece.isActive) {
                pieces[piece.key].isActive = true
                highlightSpaces(piece)
            } else {
                pieces[piece.key].isActive = false
            }
        }

        setPieces(pieces);
        setActivePiece(pieces[piece.key])
    }


    const removePieces = (array) => {
        array.forEach(piece => {
            piece.inUse = false
        })
    }

    const onSpaceClick = (space) => {
        let pieces = [...Pieces]
        let newSpaces = [...ChessSpaces]
        let currentPlayer = PlayerActive
        let newCanJump = canJump
        let jumpAgain = false
        let tookPiece = false;
        let newActivePiece;

        if(space.highlighted === false) {
            unHighlightSpaces()
            removeSpaceProperties()
        }

        if(activePiece != null) {
            pieces[activePiece.key].isActive = false
            if(space.highlighted) {
                unHighlightSpaces()
                if(activePiece != null) {
                    let prevSpace = BoardFinder(ChessSpaces, activePiece.column, activePiece.row)[0]
                    newSpaces[prevSpace.key].occupied = false
                    newSpaces[space.key].occupied = true
                    newSpaces[space.key].highlighted = false
                    pieces[activePiece.key].column = space.column
                    pieces[activePiece.key].row = space.row 
                    if((space.row === 0 || space.row === 7) || (pieces[activePiece.key].isKing === true)) {
                        pieces[activePiece.key].isKing = true
                    } 
                    if(newSpaces[space.key].removePiece !== null) { //Look into this conditional in the future
                        if(newSpaces[space.key].jumpSpace === true) {
                            newSpaces[space.key].jumpSpace = false
                        }
                        pieces[space.removePiece.key].inUse = false
                        let occupiedSpace = BoardFinder(ChessSpaces, space.removePiece.column, space.removePiece.row)[0]
                        newSpaces[occupiedSpace.key].occupied = false
                        removeSpaceProperties()
                        props.setPlayerScore(currentPlayer)
                        tookPiece = true;
                        if((space.row === 0 || space.row === 7) || (pieces[activePiece.key].isKing === true)) {
                            pieces[activePiece.key].isKing = true
                        } else {
                            pieces[activePiece.key].followupJump = true
                            jumpAgain = highlightSpaces(pieces[activePiece.key])
                            newSpaces[space.key].removePiece = null
                            pieces[activePiece.key].followupJump = false
                            pieces[activePiece.key].isActive = jumpAgain ? true : false
                            newActivePiece = jumpAgain ? pieces[activePiece.key] : null
                            newCanJump = false
                            pieces[activePiece.key].followupJump = false
                        }
                        
                    }
                    if(!jumpAgain) {
                        if(PlayerActive === 1) {
                            currentPlayer = 2
                        } else if(PlayerActive === 2) {
                            currentPlayer = 1
                        }

                    }

                }
            }
            props.setPlayerColor(currentPlayer)
            setPlayerActive(currentPlayer);
            setPieces(pieces)
            setChessSpaces(newSpaces);
            setCanJump(newCanJump);
            setActivePiece(newActivePiece);
            if(props.onlinePlayer !== undefined) {
                setOnlineState({...onlineState, 
                    ChessSpaces: newSpaces,
                    Pieces: pieces,
                    didTakePiece: tookPiece,
                    pieceCanJump: jumpAgain,
                    PlayerActive: currentPlayer,
                    activePiece: newActivePiece,
                    canJump: !newCanJump,
                })
            }
        }

    }

    const clearGame = () => {
        setWinner('');
        setChessSpaces([]);
        setPieces([]);
        setPlayerActive(1);
        setActivePiece(null);
        setHighlightedSpaces([]);
        setCanJump(false);
    }

    const startGame = () => {
        createPieces();
        setChessSpaces(createSpaces());
    }

    useEffect(() => {
        console.log(Pieces.length);
        if(socket !== undefined && onlineState.ChessSpaces.length === 64) {
            let newOnlineState = onlineState
            socket.emit('make-move', { newOnlineState });
        }
    }, [onlineState])

    useEffect(() => {
        console.log(props.currentRoom)
        setOnlineState({...onlineState, 
            currentRoom: props.currentRoom
        })
    }, [props.currentRoom])

    useEffect(() => {
        if(socket == null) return

        socket.on('made-move', ({ newOnlineState }) => {
            console.log(newOnlineState);
            props.setPlayerColor(newOnlineState.PlayerActive);
            if(newOnlineState.didTakePiece) {
                if(newOnlineState.pieceCanJump) {
                    props.setPlayerScore(newOnlineState.PlayerActive);
                } else {
                    props.setPlayerScore((newOnlineState.PlayerActive === 1) ? 2 : 1);
                }
            }
            setPlayerActive(newOnlineState.PlayerActive);
            setPieces(newOnlineState.Pieces)
            setChessSpaces(newOnlineState.ChessSpaces);
            setCanJump(newOnlineState.canJump);
            setActivePiece(newOnlineState.activePiece);
        })

        return () => {
            socket.off('made-move')
        }
    }, [socket])

    useEffect(() => {
        if(props.restartGame) {
            clearGame();
            props.setRestartGame()
        } else {
            startGame();
        }
    }, [props.restartGame])

    useEffect(() => {
        startGame()
    }, [])

    let RenderChessSpaces = ChessSpaces.map(space => {
        return <div className = {'space ' + (space.highlighted ? 'highlight' : ((space.type === 1) ? 'space1' : 'space2'))} key={space.key} onClick={(param) => onSpaceClick(space)}></div>
    })

    let PlayerPieces = Pieces.map(piece => {
        return <div className = {`piece player${piece.player}${piece.isActive ? 'active' : ''}`} key={piece.key} onClick={(param) => onPieceClick(piece)} style={{
            left: `calc((100%/8) * ${piece.column})`,
            top: `calc((100%/8) * ${piece.row})`,
            display: piece.inUse ? 'flex' : 'none',
        }}><svg display={piece.isKing ? 'inherit' : 'none'} style={{transform: (props.onlinePlayer === 2) ? 'rotateX(180deg)' : 'none' }}stroke="currentColor" fill={(piece.player === 1) ? 'rgb(92, 42, 42)' : 'rgb(0, 0, 0)'} strokeWidth={0} viewBox="0 0 640 512" width="70%"><path d="M528 448H112c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h416c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm64-320c-26.5 0-48 21.5-48 48 0 7.1 1.6 13.7 4.4 19.8L476 239.2c-15.4 9.2-35.3 4-44.2-11.6L350.3 85C361 76.2 368 63 368 48c0-26.5-21.5-48-48-48s-48 21.5-48 48c0 15 7 28.2 17.7 37l-81.5 142.6c-8.9 15.6-28.9 20.8-44.2 11.6l-72.3-43.4c2.7-6 4.4-12.7 4.4-19.8 0-26.5-21.5-48-48-48S0 149.5 0 176s21.5 48 48 48c2.6 0 5.2-.4 7.7-.8L128 416h384l72.3-192.8c2.5.4 5.1.8 7.7.8 26.5 0 48-21.5 48-48s-21.5-48-48-48z" /></svg>
        </div>
    })

    return  (
        <React.Fragment>
                {RenderChessSpaces}
                {PlayerPieces}
        </React.Fragment>
    )
}

export default CheckersBoard
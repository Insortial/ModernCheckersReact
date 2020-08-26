import React, { Component } from 'react'

class CheckersBoard extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            winner: '',
            spaces: 64,
            ChessSpaces: [],
            Pieces: [],
            PlayerActive: 1,
            activePiece: null, 
            highlightedSpaces: [],
            canJump: false
        }
    }
    

    createSpace(type, key, occupied, column, row, highlighted) {
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

    createSpaces() {
        const SpaceArray = []
        let row = 0
        for(let i = 0; i < this.state.spaces; i++) {
            if((i % 2 === 0 && row % 2 === 0) || (i % 2 === 1 && row % 2 === 1)) {
                if(i < 23 || (i > 40 && i < 64)) {
                    SpaceArray.push(this.createSpace(1, i, true, i % 8, row, false))
                } else {
                    SpaceArray.push(this.createSpace(1, i, false, i % 8, row, false))
                }
            } else if((i % 2 === 1 && row % 2 === 0) || (i % 2 === 0 && row % 2 === 1)) {
                SpaceArray.push(this.createSpace(2, i, false, i % 8, row, false))
            }

            if((i + 1) % 8 === 0) {
                row++
            }
        } 
        return SpaceArray
    }

    BoardFinder(array, column, row) {
        return array.filter(space => {
            if(space.column === column) {
                if(space.row === row) {
                    return space
                } else {
                    return null
                }
            }
        })
    }

    SpaceFinder = (column, row, type, key) => {
        const { ChessSpaces, Pieces } = this.state
        let space = this.BoardFinder(ChessSpaces, column, row)[0]
        let pieces = [...this.state.Pieces]
        let removablePieces = []

        let Player1Pieces = Pieces.filter(piece => {
            if(piece.player === 1) {
                return piece 
            }
        })

        let Player2Pieces = Pieces.filter(piece => {
            if(piece.player === 2) {
                return piece 
            }
        })

        if(space.occupied) {
            if(this.state.PlayerActive === 1) {
                let foundPiece = this.BoardFinder(Player2Pieces, column, row)[0]
                if(typeof foundPiece !== 'undefined' && foundPiece !== null) {
                    this.setState({
                        canJump: true
                    })
                    switch(type) {
                        case 1:
                            space = this.BoardFinder(ChessSpaces, column + 1, row - 1)[0]
                            break;
                        case 2:
                            space = this.BoardFinder(ChessSpaces, column - 1, row - 1)[0]
                            break;
                        case 3:
                            space = this.BoardFinder(ChessSpaces, column + 1, row + 1)[0]
                            break;
                        case 4:
                            space = this.BoardFinder(ChessSpaces, column - 1, row + 1)[0]
                            break;
                    }
                    this.setState({
                        removablePieces: removablePieces
                    })
                    if(typeof space !== 'undefined') {
                        if(space.occupied === false) {
                            space.jumpSpace = true
                            space.removePiece = foundPiece
                            return space
                        }
                    }
                }
            } else if(this.state.PlayerActive === 2) {
                let foundPiece = this.BoardFinder(Player1Pieces, column, row)[0]
                if(typeof foundPiece !== 'undefined' && foundPiece !== null) {
                    this.setState({
                        canJump: true
                    })
                    switch(type) {
                        case 1:
                            space = this.BoardFinder(ChessSpaces, column + 1, row - 1)[0]
                            break;
                        case 2:
                            space = this.BoardFinder(ChessSpaces, column - 1, row - 1)[0]
                            break;
                        case 3:
                            space = this.BoardFinder(ChessSpaces, column + 1, row + 1)[0]
                            break;
                        case 4:
                            space = this.BoardFinder(ChessSpaces, column - 1, row + 1)[0]
                            break;
                    }
                    this.setState({
                        removablePieces: removablePieces
                    })
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

    canHighlight = (player, isKing, space) => {
        if(space != null) {
            if(!space.occupied) {
               let spaces = [...this.state.ChessSpaces]
               spaces[space.key].highlighted = true
               this.setState({
                   ChessSpaces: spaces 
               })
            }
        }
    }

    checkForJumpablePieces(array, player, king, piece) {
        let highlightedSpaces = []
        let jumpSpaces = array.filter(space => {
            if(space !== null && typeof space !== 'undefined') {
                if(space.jumpSpace === true) {
                    return space
                }
            }
            
        })

        if(!piece.followupJump) {
            if(jumpSpaces.length !== 0) {
                jumpSpaces.map(space => {
                    this.canHighlight(player, king, space)
                    highlightedSpaces.push(space)
                })
            } else {
                array.map(space => {
                    this.canHighlight(player, king, space)
                    highlightedSpaces.push(space)
                })
            }
        } else {
            jumpSpaces.map(space => {
                this.canHighlight(player, king, space)
                highlightedSpaces.push(space)
            })   
        }
        
        return highlightedSpaces
    }

    highlightSpaces = (piece) => {
        this.setState({
            activePiece: piece
        })

        const { row, column } = piece
        
        let highlightedSpaces
        let spaces = []
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
                space1 = this.SpaceFinder(highlightColumn1, highlightRow1, 1, piece.key)
            }

            if(highlightColumn2 >= 0 && highlightColumn2 < 8) {
                space2 = this.SpaceFinder(highlightColumn2, highlightRow1, 2, piece.key)      
            }
        }

        if(highlightRow2 >= 0 && highlightRow2 < 8) {
            if(highlightColumn1 >= 0 && highlightColumn1 < 8) {
                space3 = this.SpaceFinder(highlightColumn1, highlightRow2, 3, piece.key)
            }

            if(highlightColumn2 >= 0 && highlightColumn2 < 8) {
                space4 = this.SpaceFinder(highlightColumn2, highlightRow2, 4, piece.key)       
            }
        }

        if(!piece.isKing) {
            if(piece.player === 1) {//Player 1
                if((space3 !== null && typeof space3 !== 'undefined') && (typeof space4 !== 'undefined' && space4 !== null)) {
                    space3.jumpSpace = false
                    space4.jumpSpace = false
                }
                spaces.push(space1, space2)
                highlightedSpaces = this.checkForJumpablePieces(spaces, piece.player, piece.isKing, piece)
                spaces.map(space => {
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
                console.log(space3)
                spaces.push(space3, space4)
                highlightedSpaces = this.checkForJumpablePieces(spaces, piece.player, piece.isKing, piece)
                spaces.map(space => {
                    if(typeof space !== 'undefined' && space !== null) {
                        if(space.jumpSpace) {
                            jumpAgain = true
                        }
                    }
                })
            }
        } else {//King 
            spaces.push(space1, space2, space3, space4)
            highlightedSpaces = this.checkForJumpablePieces(spaces, piece.player, piece.isKing, piece)
            spaces.map(space => {
                if(typeof space !== 'undefined' && space !== null) {
                    if(space.jumpSpace) {
                        jumpAgain = true
                    }
                }
            })
        }
        console.log(highlightedSpaces)
        this.setState({
            highlightedSpaces: highlightedSpaces
        })
        return jumpAgain
    }

    createPiece(row, column, player, key) {
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

    createPieces() {
        const PlayerPieces = []
        let row = 0
        for(let i = 0; i < 24; i++) {
            if(row === 3) {
                row += 2
            } 
        
            switch(row) {
                case 0:
                    PlayerPieces.push(this.createPiece(row, 0 + (i * 2), 2, i))
                    break;
                case 1:
                    PlayerPieces.push(this.createPiece(row, 1 + ((i - 4) * 2), 2, i))
                    break;
                case 2:
                    PlayerPieces.push(this.createPiece(row, 0 + ((i - 8) * 2), 2, i))
                    break;
                case 5:
                    PlayerPieces.push(this.createPiece(row, 1 + ((i - 12) * 2), 1, i))
                    break;
                case 6:
                    PlayerPieces.push(this.createPiece(row, 0 + ((i - 16) * 2), 1, i))
                    break;
                case 7:
                    PlayerPieces.push(this.createPiece(row, 1 + ((i - 20) * 2), 1, i))
                    break;
            }

            if(i % 4 === 3 && i >= 3) {
                row++
            }
        }

        this.setState({
            Pieces: PlayerPieces
        })
    }

    componentDidMount() {
        this.createPieces()
        this.setState({
            ChessSpaces: this.createSpaces()
        })
    }

    unHighlightSpaces = () => {
        let spaces = [...this.state.ChessSpaces]
        this.state.highlightedSpaces.map(space => {
            if(space != null) {
                spaces[space.key].highlighted = false
            }
        })
        this.setState({
            ChessSpaces: spaces,
            highlightedSpaces: []
        })
    }

    onPieceClick = (piece) => {
        console.log(piece)
        let pieces = [...this.state.Pieces]

        if(this.state.activePiece != null) {
            pieces[this.state.activePiece.key].isActive = false
            this.unHighlightSpaces()
        }

        if(this.state.PlayerActive === piece.player) {
            if(!piece.isActive) {
                pieces[piece.key].isActive = true
                this.highlightSpaces(piece)
            } else {
                pieces[piece.key].isActive = false
            }
        }

        this.setState({
            Pieces: pieces,
            activePiece: pieces[piece.key]
        })
    }


    removePieces = (array) => {
        array.map(piece => {
            piece.inUse = false
        })
    }

    onSpaceClick = (space) => {
        let pieces = [...this.state.Pieces]
        let spaces = [...this.state.ChessSpaces]
        let currentPlayer = this.state.PlayerActive
        let canJump = this.state.canJump
        let jumpAgain = false
        let activePiece
        console.log(space)

        if(this.state.activePiece != null) {
            pieces[this.state.activePiece.key].isActive = false
            if(space.highlighted) {
                console.log('This is remove Piece - ')
                console.log(space.removePiece)
                if(this.state.activePiece != null) {
                    let prevSpace = this.BoardFinder(this.state.ChessSpaces, this.state.activePiece.column, this.state.activePiece.row)[0]
                    spaces[prevSpace.key].occupied = false
                    spaces[space.key].occupied = true
                    spaces[space.key].highlighted = false
                    pieces[this.state.activePiece.key].column = space.column
                    pieces[this.state.activePiece.key].row = space.row
                    if(space.row === 0 || space.row === 7) {
                        pieces[this.state.activePiece.key].isKing = true
                    }
                    if(spaces[space.key].removePiece !== null && typeof spaces[space.key].removePiece !== null) {
                        if(spaces[space.key].jumpSpace === true) {
                            spaces[space.key].jumpSpace = false
                        }
                        pieces[space.removePiece.key].inUse = false
                        let occupiedSpace = this.BoardFinder(this.state.ChessSpaces, space.removePiece.column, space.removePiece.row)[0]
                        spaces[occupiedSpace.key].occupied = false
                        console.log(occupiedSpace)
                        pieces[this.state.activePiece.key].followupJump = true
                        jumpAgain = this.highlightSpaces(pieces[this.state.activePiece.key])
                        spaces[space.key].removePiece = null
                        pieces[this.state.activePiece.key].followupJump = false
                        pieces[this.state.activePiece.key].isActive = jumpAgain ? true : false
                        activePiece = jumpAgain ? pieces[this.state.activePiece.key] : null
                    } else {
                        canJump = false
                        pieces[this.state.activePiece.key].followupJump = false
                    }
                    currentPlayer = (this.state.PlayerActive === 1 && !jumpAgain) ? 2 : 1
                }
            }
            console.log(this.state.highlightedSpaces)
            this.unHighlightSpaces()
            this.setState({
                activePiece: activePiece,
                Pieces: pieces,
                ChessSpaces: spaces,
                PlayerActive: currentPlayer,
                canJump: canJump
            })
        }

    }

    render() {
        let ChessSpaces = this.state.ChessSpaces.map(space => {
            return <div className = {'space ' + (space.highlighted ? 'highlight' : ((space.type === 1) ? 'space1' : 'space2'))} key={space.key} onClick={(param) => this.onSpaceClick(space)}></div>
        })

        let PlayerPieces = this.state.Pieces.map(piece => {
            return <div className = {'piece ' + 'player' + (piece.player) + (piece.isActive ? 'active' : '') + (piece.isKing ? 'king' : '')} key={piece.key} onClick={(param) => this.onPieceClick(piece)} style={{
                left: `calc((100%/8) * ${piece.column})`,
                top: `calc((100%/8) * ${piece.row})`,
                display: piece.inUse ? 'block' : 'none'
            }}></div>
        })
        return (<React.Fragment>
                {ChessSpaces}
                {PlayerPieces}
        </React.Fragment>
        )
    }
}

export default CheckersBoard

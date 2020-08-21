import React, { Component } from 'react'

class Piece extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             row: this.props.row,
             column: this.props.column,
             isActive: false,
             canJump: false,
             isKing: this.props.isKing,
             player: this.props.player,
             color: null,
             inUse: true,

        }
    }
    
    activePiece = () => {
        if(this.props.playerIsActive) {
            if(!this.state.isActive) {
                this.setState({
                    isActive: true
                })
                this.props.highlightSpaces(this, this.state.player, this.state.isKing)
    
            } else {
                this.setState({
                    isActive: false
                })
            }
        }
    }

 /*    BoardFinder(array, column, row) {
        return array.filter(space => {
            if(space.props.column === column) {
                if(space.props.row === row) {
                    return space
                }
            }
        })
    }

    SpaceFinder = (column, row) => {
        const { ChessSpaces, Player1Pieces, Player2Pieces, Player1Active, Player2Active, removablePieces } = this.game.state
        console.log('hi')
        let space = this.BoardFinder(ChessSpaces, column, row)
        if(space.occupied) {
            if(this.state.Player1Active) {
                let piece = this.state.removablePieces.push(this.BoardFinder(Player2Pieces, column, row)[0])
                this.setState({
                    removablePieces: piece
                })
            } else if(this.state.Player2Active) {
                let piece = this.state.removablePieces.push(this.BoardFinder(Player1Pieces, column, row)[0])
                this.setState({
                    removablePieces: piece
                })
            }
        } else {
            return space
        }
    }

    highlightSpaces(piece) {
      console.log(piece)
      const { row, column, player, isKing } = this.state
      console.log(this.state.spaces)

      if(!isKing) {
        if(player === 1) {
            let highlightRow = row + 1
            let highlightColumn1 = column + 1
            let highlightColumn2 = column - 1

            if(highlightRow >= 0 && highlightRow < 8) {
                if(highlightColumn1 >= 0 && highlightColumn1 < 8) {
                    let spaceHighlight = this.SpaceFinder(highlightColumn1, highlightRow)

                }

                if(highlightColumn2 >= 0 && highlightColumn2 < 8) {
                    let spaceHighlight = this.SpaceFinder(highlightColumn2, highlightRow)
                            
                }
            }
        } else {

        }
      } else {

      }
    }
 */
    checkState() {
        const Player1Color = 'rgb(194, 105, 105)'
        const Player2Color = 'rgb(67, 67, 67)'
        const Player1ColorActive = 'rgb(122, 57, 57)'
        const Player2ColorActive = 'rgb(0, 0, 0)'
        let piece

        if(this.state.inUse) {
            //Piece is inUse
            if(this.state.player === 1) {
                //Player 1
                if(!this.state.isKing) {
                    //Is not a King
                    if(this.state.isActive) {
                        //Is active
                        piece = <div className='piece' onClick={this.activePiece} style={{
                                left: `calc((100%/8) * ${this.state.column})`,
                                top: `calc((100%/8) * ${this.state.row})`,
                                backgroundColor: Player1ColorActive
                            }}>
                            </div>
                    } else {
                        //Is not active
                        piece = <div className='piece' onClick={this.activePiece} style={{
                                left: `calc((100%/8) * ${this.state.column})`,
                                top: `calc((100%/8) * ${this.state.row})`,
                                backgroundColor: Player1Color
                            }}>
                            </div>
                    }
                } else {
                    //Is a King
                    if(this.state.isActive) {
                        //Is active

                    } else {
                        //Is not active
                        
                    }
                }
            } else if(this.state.player === 2) {
                //Player 2
                if(!this.state.isKing) {
                    //Is not a King 
                    if(this.state.isActive) {
                        //Is active
                        piece = <div className='piece' onClick={this.activePiece} style={{
                            left: `calc((100%/8) * ${this.state.column})`,
                            top: `calc((100%/8) * ${this.state.row})`,
                            backgroundColor: Player2ColorActive
                        }}>
                        </div>
                    } else {
                        //Is not active
                        piece = <div className='piece' onClick={this.activePiece} style={{
                                left: `calc((100%/8) * ${this.state.column})`,
                                top: `calc((100%/8) * ${this.state.row})`,
                                backgroundColor: Player2Color
                            }}>
                            </div>
                    }
                } else {
                    //Is a king
                    if(this.state.isActive) {
                        //Is active

                    } else {
                        //Is not active
                        
                    }
                }
            }
        } else {
            //Piece is not in Use
            piece = null
        }
        return piece
    }


    render() {
        let chessPiece = this.checkState()
        return chessPiece
    }
}

export default Piece

import React, { Component } from 'react'


const CHANGEHIGHLIGHT = "CHANGEHIGHLIGHT"
const MOVEPIECE = "MOVEPIECE"

/* const reducer = action => (state, props) => {
    switch(action.type) {
        case CHANGEHIGHLIGHT:
            return {
                ChessSpaces: state.ChessSpaces[key].highlight = value
            }
    }
} */

class CheckersBoard extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            winner: '',
            spaces: 64,
            ChessSpaces: [],
            Pieces: [],
            PlayerActive: 1,
            removablePieces: [],
            activePiece: null, 
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
        console.log(SpaceArray)
        return SpaceArray
    }

    BoardFinder(array, column, row) {
        return array.filter(space => {
            if(space.column === column) {
                if(space.row === row) {
                    return space
                }
            }
        })
    }

    SpaceFinder = (column, row) => {
        const { ChessSpaces, Pieces } = this.state

        let space = this.BoardFinder(ChessSpaces, column, row)[0]

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
                let piece = this.state.removablePieces.push(this.BoardFinder(Player2Pieces, column, row)[0])
                this.setState({
                    removablePieces: piece
                })
            } else if(this.state.PlayerActive === 2) {
                let piece = this.state.removablePieces.push(this.BoardFinder(Player1Pieces, column, row)[0])
                this.setState({
                    removablePieces: piece
                })
            }
        } else {
            return space
        }
    }

    canHighlight = (player, isKing, space) => {
            if(space.occupied) {
                this.highlightSpaces(space, player, isKing)
            } else {
               let spaces = [...this.state.ChessSpaces]
               spaces[space.key].highlighted = true
               this.setState({
                   ChessSpaces: spaces 
               })
            }
    }

    highlightSpaces = (piece, player, isKing) => {
      console.log(piece)
      this.setState({
          activePiece: piece
      })

      const { row, column } = piece
      
      console.log(this.state.spaces)

      let highlightRow1 = row + 1
      let highlightRow2 = row - 1
      let highlightColumn1 = column + 1
      let highlightColumn2 = column - 1

      let space1
      //Upper Left Space
      let space2 
      //Upper Right Space
      let space3 
      //Lower Right Space
      let space4 
      //Lower Left Space 

      if(highlightRow1 >= 0 && highlightRow1 < 8) {
        if(highlightColumn1 >= 0 && highlightColumn1 < 8) {
            space1 = this.SpaceFinder(highlightColumn1, highlightRow1)
            space3 = this.SpaceFinder(highlightColumn1, highlightRow2)
        }

        if(highlightColumn2 >= 0 && highlightColumn2 < 8) {
            space2 = this.SpaceFinder(highlightColumn2, highlightRow1)  
            space4 = this.SpaceFinder(highlightColumn2, highlightRow2)       
        }
    }

      if(!isKing) {
        if(player === 1) {
            this.canHighlight(player, isKing, space1)
            this.canHighlight(player, isKing, space2)
        } else {
            this.canHighlight(player, isKing, space3)
            this.canHighlight(player, isKing, space4)
        }
      } else {
        this.canHighlight(player, isKing, space1)
        this.canHighlight(player, isKing, space2)
        this.canHighlight(player, isKing, space3)
        this.canHighlight(player, isKing, space4)
      }
    }

    createPiece(row, column, player, key) {
        let piece = {};

        piece.column = column;
        piece.row = row;
        piece.key = key;
        piece.player = player;
        piece.isActive = false;
        piece.inUse = true;

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

            /* if(i < 4) {
                PlayerPieces.push(this.createPiece(0, 0 + (i * 2), 2, i))
                PlayerPieces.push(this.createPiece(5, 1 + (i * 2), 1, i + 12))
            } else if(i < 8 && i > 3) {
                PlayerPieces.push(this.createPiece(1, 1 + ((i - 4) * 2), 2, i))
                PlayerPieces.push(this.createPiece(6, 0 + ((i - 4) * 2), 1, i + 16))
            } else if(i < 12 && i > 7) {
                PlayerPieces.push(this.createPiece(2, 0 + ((i - 8) * 2), 2, i))
                PlayerPieces.push(this.createPiece(7, 1 + ((i - 8) * 2), 1, i + 20))
            } */

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

    onPieceClick = (piece) => {
        let pieces = [...this.state.Pieces]

        if(this.state.PlayerActive === piece.player) {
            if(!piece.isActive) {
                pieces[piece.key].isActive = true
                this.highlightSpaces(piece)
            } else {
                pieces[piece.key].isActive = false
            }
        }
        if(this.state.activePiece != null) {
            console.log('works')
            pieces[this.state.activePiece.key].isActive = false
        }
        this.setState({
            Pieces: pieces,
            activePiece: pieces[piece.key]
        })
    }



    render() {
        let ChessSpaces = this.state.ChessSpaces.map(space => {
            return <div className = {'space ' + (space.highlighted ? 'highlight' : ((space.type === 1) ? 'space1' : 'space2'))} key={space.key} onClick={(param) => this.onSpaceClick(space)}></div>
        })

        console.log(this.state.Pieces)
        let PlayerPieces = this.state.Pieces.map(piece => {
            return <div className = {'piece ' + 'player' + (piece.player) + (piece.isActive ? 'active' : '')} key={piece.key} onClick={(param) => this.onPieceClick(piece)} style={{
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

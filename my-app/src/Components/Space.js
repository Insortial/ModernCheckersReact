import React, { Component } from 'react'

export class Space extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             type: this.props.type,
             occupied: this.props.occupied,
             column: this.props.column,
             row: this.props.row,
             highlighted: false
        }
    }
    
    checkSpace = () => {
        if(this.state.highlighted) {
            this.setState({
                highlighted: false 
            })
        } else {
            
        }
    }

    render() {
        const spaceColor1 = '#bca377'
        const spaceColor2 = '#ffffff'
        const spaceHighlight = '#d0d6e0'
        if(!this.state.highlighted && this.state.type === 1) {
            return <div className='space' onClick={this.checkSpace} style={{
                backgroundColor: spaceColor1
            }} />
        } else if(!this.state.highlighted && this.state.type === 2){
            return <div className='space' onClick={this.checkSpace} style={{
                backgroundColor: spaceColor2
            }} />
        } else if(this.state.highlighted) {
            return <div className='space' onClick={this.checkSpace} style={{
                backgroundColor: spaceHighlight
            }} />
        }
    }
}

export default Space



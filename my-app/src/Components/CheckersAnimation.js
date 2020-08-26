import React, { Component } from 'react'

class CheckersAnimation extends Component {
    constructor(props) {
        super(props)
        this.canvasRef = React.createRef()

        this.state = {
             
        }
    }
    
    createCanvas() {
        let canvas = this.canvasRef.current;
        var c = canvas.getContext('2d');
        let canvasWidth = 3840;
        canvas.width = canvasWidth;
        canvas.height = 300;

        function Circle(x, y, dx, radius, color, row) {
            this.x = x;
            this.y = y; 
            this.dx = dx;
            this.radius = radius;
            this.color = color;
            this.row = row;
        
            this.draw = function() {
                c.beginPath();
                c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                c.fillStyle = this.color;
                c.fill();
            }
        
            this.update = function() {
                if(this.x > canvas.width  || this.x < 0) {
                    this.dx = -this.dx;
                }
            
                this.x += this.dx;
        
                this.draw();
            }
        
        }
        
        let circleArray = [];
        let colors = ['rgb(194, 105, 105)', 'rgb(67, 67, 67)'];
        
        for(let i = 0; i < 90; i++) {
            let radius = (Math.random() * ((150 - 90) + 1)) + 90;
            let x = Math.random() * (canvas.width- radius * 2) + radius;
            let y = 320;
            let dx = (Math.random() - 0.5) * 3;
            let color = colors[Math.floor(Math.random() * 2)];
            circleArray.push(new Circle(x, y, dx, radius, color));
        }
        
        
        function animate() {
            requestAnimationFrame(animate);
            c.clearRect(0, 0, canvas.width, 400);
        
        for(let i = 0; i < circleArray.length; i++) {
            circleArray[i].update();
            }
        }
        
        animate();
    }

    componentDidMount() {
        this.createCanvas()
    }

    render() {
        return (
            <canvas id="checkers_canvas" ref={this.canvasRef} />
        )
    }
}

export default CheckersAnimation

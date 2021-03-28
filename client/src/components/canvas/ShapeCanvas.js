import React, {Component} from 'react';
import {event, select} from 'd3-selection';
import Common from '../../constants/common';
import uuid from 'react-uuid';
import {clearCanvasData} from '../../actions/canvasActions';
import {connect} from 'react-redux';

class ShapeCanvas extends Component {
    /**
     * Creates an instance of the Canvas
     *
     * @param {object.<string, any>} props The props.
     */
    constructor(props) {
        super(props);
        this.backgroundColor = this.props.backgroundColor;
        this.circleColor = this.props.shapeColor;
        this.speedConst = 0.5;
        this.particleCount = 150;
        this.connectionDistance = 100;
        this.shapeArr = [];
        this.currentShape = {};
        this.lines = [];
        this.posX = 100; 
        this.posY = 100;
        this.scalePosX = 1;
        this.scalePosY = 1;
        this.hoverActive = false;
        this.originX = 0;
        this.originY = 0;
        this.rotation = 0;

        this.state = {
            posX: 100,
            posY: 100,
        };
        this.canvasEl = null;
        this.particles = [];
        this.setupCanvas = this.setupCanvas.bind(this);
        this.addShape = this.addShape.bind(this);
        this.changeShapeColor = this.changeShapeColor.bind(this);
        this.changeShapeOpacity = this.changeShapeOpacity.bind(this);
        this.changeShapeType = this.changeShapeType.bind(this);
        this.changeShapeWidth = this.changeShapeWidth.bind(this);
        this.changeShapeHeight = this.changeShapeHeight.bind(this);
        this.changeShapeRadius = this.changeShapeRadius.bind(this);
        this.changeCanvasScale = this.changeCanvasScale.bind(this);
        this.selectShape = this.selectShape.bind(this);
        this.loadShapes = this.loadShapes.bind(this);
        this.centerStamp = this.centerStamp.bind(this);
    }

    componentDidUpdate(prevProps){
        const {type, width, height, radius, rotation, color, opacity} = this.props.currentShape;
        const { canvasWidth, canvasHeight, canvasScale, selectedShape } = this.props.canvasData;
        if(color !== prevProps.currentShape.color){
            this.changeShapeColor(color)
        }
        if(opacity !== prevProps.currentShape.opacity){
            this.changeShapeOpacity(opacity)
        }
        if(type !== prevProps.currentShape.type){
            this.changeShapeType(type)
        }
        if(width !== prevProps.currentShape.width){
            this.changeShapeWidth(width)
        }
        if(height !== prevProps.currentShape.height){
            this.changeShapeHeight(height)
        }
        if(rotation !== prevProps.currentShape.rotation){
            this.changeShapeRotation(rotation)
        }
        if(radius !== prevProps.currentShape.radius){
            this.changeShapeRadius(radius)
        }
        // if(canvasScale !== prevProps.canvasScale){
        //     this.changeCanvasScale(canvasScale)
        // }
        if(selectedShape !== prevProps.canvasData.selectedShape){
            this.selectShape(selectedShape)
        }
        // if(nextProps.canvas !== this.props.canvas){
        //     this.centerStamp();
        // }
    }

    /**
     * Update the state based on the props.
     *
     * @returns {void}
     */
    componentDidMount() {
        const { backgroundColor } = this.props.canvasData;
        const {shapeColor} = this.props.currentShape;
        this.setState(state => ({
            ...state,
            shapeColor: shapeColor,
            backgroundColor: backgroundColor
        }));
        window.addEventListener('resize', this.resize);
        this.setupCanvas();
    }

    setupCanvas(){
        const { currentShape } = this.props;
        const { canvasWidth, canvasHeight } = this.props.canvasData;
        this.centerX = canvasWidth / 2;
        this.centerY = canvasHeight/2;
        // Default starting shape
        this.currentShape = {
            width: currentShape.width,
            height: currentShape.height,
            posX: this.centerX - (currentShape.width/2), 
            posY: this.centerY - (currentShape.height/2),
            type: Common.square,
            border: 0,
            rotation: 0,
            color: currentShape.color,
            opacity: currentShape.opacity
        };

        select(this.node)
            .selectAll('rect')
            .data([this.currentShape])
            .enter()
            .append('rect')
            .attr('class', 'stamp')
            .attr('fill', obj => obj.color)
            .attr('opacity', obj => obj.opacity)
            .attr('width', obj => obj.width)
            .attr('height', obj => obj.height)
            .attr('x', obj => obj.posX)
            .attr('y', obj => obj.posY)

        select(this.node)
            .on('mousemove', () => this.moveShape())
            .on('mouseleave', () => this.centerStamp())
            .on('click', (obj, index, arr) => this.addShape(index, arr))

        // this.centerStamp();
    }

    moveShape(){
        const { currentShape } = this.props;
        const canvasElement = document.getElementById('canvas').getBoundingClientRect();
        const node = select(this.node)
            .select('.stamp');
        const ref = select(this.node)
            .select('.ref');

        this.hoverActive = true;

        if(currentShape.type === Common.square){
            const newX = (event.x - canvasElement.left) - (currentShape.width/2);
            const newY = (event.y - canvasElement.top) - (currentShape.height/2);
            this.originX = event.x - canvasElement.left;
            this.originY = event.y - canvasElement.top;
            node
                .attr('transform', obj => `rotate(0 ${this.originX} ${this.originY})`);

            node
                .attr('x', () => (newX) * this.scalePosX)
                .attr('y', () => (newY) * this.scalePosY)

            node
                .attr('transform', obj => `rotate(${currentShape.rotation} ${this.originX} ${this.originY})`);

        } else {
            node
                .attr('cx', () => (event.x - canvasElement.left) * this.scalePosX)
                .attr('cy', () => (event.y - canvasElement.top) * this.scalePosY);

            this.currentShape.posX = (event.x - canvasElement.left);
            this.currentShape.posY = (event.y - canvasElement.top);
        }
    }

    centerStamp(){
        const { currentShape } = this.props
        const {canvasWidth, canvasHeight} = this.props.canvasData;
        const stamp = select(this.node)
            .selectAll('.stamp');
        let centerX = (canvasWidth / 2) - (currentShape.width/2);
        let centerY = (canvasHeight / 2) - (currentShape.height/2);

        if(this.currentShape.type === Common.square){
            centerX = (canvasWidth / 2) - (currentShape.width/2);
            centerY = (canvasHeight / 2) - (currentShape.height/2);

            stamp
                .attr('transform', `rotate(0 ${this.originX} ${this.originY})`)

            stamp
                .attr('x', centerX)
                .attr('y', centerY)

            stamp
                .attr('transform', `rotate(${currentShape.rotation} ${this.centerX} ${this.centerY})`)
        } else {
            centerX = (canvasWidth / 2);
            centerY = (canvasHeight / 2);
            stamp
                .attr('cx', centerX)
                .attr('cy', centerY)
        }       
        this.currentShape.posX = centerX;
        this.currentShape.posY = centerY;
    }

    /**
     * Create the shape before passing into redux
     * Data formatting 
     */
    createShape = () => {
        const { currentShape } = this.props;
        const newShape = {
            id: this.currentShape.id,
            type: currentShape.type,
            color: currentShape.color,
            posX: this.currentShape.posX,
            posY: this.currentShape.posY
        };
        if(currentShape.type === Common.square){
            newShape.width = currentShape.width;
            newShape.height = currentShape.height;
            newShape.rotation = currentShape.rotation;
        } else {
            newShape.radius = currentShape.radius;
        }
        this.props.addShape(newShape)
    }

    loadShapes(){
        const squareArr = this.shapeArr.filter(shape => shape.type === Common.square ? shape : null),
            circleArr = this.shapeArr.filter(shape => shape.type === Common.circle ? shape : null);
        select(this.node)
            .selectAll('.shape')
            .remove();

        select(this.node)
            .selectAll('')
    }

    highlightShape = (highlight) => {
        const shapes = select(this.node)
            .selectAll('.shape')

        console.log(shapes)
    }

    selectShape(id){
        const { type } = this.props.currentShape;
        select(this.node)
            .selectAll('.shape-highlight')
            .remove();

        if(id !== ''){
            const selectedShape = select(this.node)
                .selectAll('.shape')
                .filter(obj => obj.id === id)
            const shapeTransform = selectedShape.attr('transform')
            const shapeData = selectedShape.data();
            console.log()
            if(type === Common.square){
                select(this.node)
                    .selectAll('.shape-highlight')
                    .data(shapeData)
                    .enter()
                    .append('rect')
                    .attr('class', 'shape-highlight')
                    .attr('fill', 'rgba(0,0,0,0)')
                    .attr('stroke', 'yellow')
                    .attr('stroke-width', '1')
                    .attr('width', obj => obj.width)
                    .attr('height', obj => obj.height)
                    .attr('x', obj => obj.posX)
                    .attr('y', obj => obj.posY)
                    .attr('transform', shapeTransform)
            } else {
                select(this.node)
                    .selectAll('.shape-highlight')
                    .data(shapeData)
                    .enter()
                    .append('circle')
                    .attr('class', 'shape-highlight')
                    .attr('fill', 'rgba(0,0,0,0)')
                    .attr('stroke', 'yellow')
                    .attr('stroke-width', '1')
                    .attr('r', obj => obj.radius)
                    .attr('cx', obj => obj.posX)
                    .attr('cy', obj => obj.posY)
            }
        }
    }

    addShape(){
        const { currentShape } = this.props;
        const newShapeUuid = uuid(),
            transform = select(this.node).selectAll('.stamp').attr('transform');

        let posX = null;
        let posY = null;
        if(currentShape.type === Common.square){
            posX = select(this.node).selectAll('.stamp').attr('x');
            posY = select(this.node).selectAll('.stamp').attr('y')
        } else {
            const stamp = select(this.node).selectAll('.stamp');
            posX = select(this.node).selectAll('.stamp').attr('cx');
            posY = select(this.node).selectAll('.stamp').attr('cy')
        }

        this.currentShape.posX = posX;
        this.currentShape.posY = posY;
        this.currentShape.id = newShapeUuid;
        this.currentShape.transform = transform;
        this.currentShape.opacity = currentShape.opacity;
        this.shapeArr.push({...this.currentShape});

        this.createShape();

        select(this.node)
            .selectAll('.stamp')
            .remove();
        
        if(currentShape.type === Common.square){
            select(this.node)
                .selectAll('.shape')
                .data(this.shapeArr)
                .enter()
                .append('rect')
                .attr('class', 'shape')
                .attr('fill', obj => obj.color)
                .attr('opacity', obj => obj.opacity)
                .attr('width', obj => obj.width)
                .attr('height', obj => obj.height)
                .attr('x', obj => obj.posX)
                .attr('y', obj => obj.posY)
                .attr('transform', `rotate(${currentShape.rotation} ${this.originX} ${this.originY})`)
                // .on('mousemove', () => this.highlightShape(true))
                // .on('mouseleave', () => this.highlightShape(false))
                // .on('click', (obj, index, arr) => this.addShape(index, arr))

            select(this.node)
                .selectAll('.stamp')
                .data([this.currentShape])
                .enter()
                .append('rect')
                .attr('class', 'stamp')
                .attr('fill', obj => obj.color)
                .attr('opacity', obj => obj.opacity)
                .attr('width', obj => obj.width)
                .attr('height', obj => obj.height)
                .attr('x', obj => obj.posX)
                .attr('y', obj => obj.posY)
                .attr('transform', `rotate(${currentShape.rotation} ${this.originX} ${this.originY})`);

        } else {
            select(this.node)
                .selectAll('.shape')
                .data(this.shapeArr)
                .enter()
                .append('circle')
                .attr('class', 'shape')
                .attr('fill', obj => obj.color)
                .attr('opacity', obj => obj.opacity)
                .attr('r', obj => obj.radius)
                .attr('cx', obj => obj.posX * this.scalePosX)
                .attr('cy', obj => obj.posY * this.scalePosY)

            select(this.node)
                .selectAll('.stamp')
                .data([this.currentShape])
                .enter()
                .append('circle')
                .attr('class', 'stamp')
                .attr('fill', obj => obj.color)
                .attr('opacity', obj => obj.opacity)
                .attr('r', obj => obj.radius)
                .attr('cx', obj => obj.posX * this.scalePosX)
                .attr('cy', obj => obj.posY * this.scalePosY)

        }
    }

    changeShapeWidth(newWidth){
        this.currentShape.width = newWidth;
        select(this.node)
            .selectAll('.stamp')
            .attr('width', newWidth)
        this.centerStamp();
    }

    changeShapeHeight(newHeight){
        this.currentShape.height = newHeight;
        select(this.node)
            .selectAll('.stamp')
            .attr('height', newHeight)
        this.centerStamp();
    }

    changeShapeRotation = (newRotation) => {
        const { canvasWidth, canvasHeight} = this.props.canvasData;
        this.originX = canvasWidth/2;
        this.originY = canvasHeight/2;
        select(this.node)
            .selectAll('.stamp')
            .attr('transform', obj => `rotate(${newRotation} ${this.originX} ${this.originY})`)

        this.currentShape.rotation = newRotation;
    }

    changeCanvasScale(newScale) {
        const {canvasWidth, canvasHeight} = this.props.canvasData;
        select(this.node)
            .attr('transform', `scale(${newScale})`)
        this.scalePosX = canvasWidth / (canvasWidth * newScale);
        this.scalePosY = canvasHeight / (canvasHeight * newScale);
    }

    changeShapeRadius(newRadius){
        this.currentShape.radius = newRadius;
        select(this.node)
            .selectAll('.stamp')
            .attr('r', newRadius)
    }

    changeShapeColor(newColor){
        select(this.node)
            .selectAll('.stamp')
            .attr('fill', newColor)
        this.currentShape.color = newColor;
    }
    
    changeShapeOpacity(newOpacity){
        select(this.node)
            .selectAll('.stamp')
            .attr('opacity', newOpacity)
        this.currentShape.opacity = newOpacity;
    }

    changeShapeType(newType){
        const { currentShape } = this.props;

        select(this.node)
            .selectAll('.stamp')
            .remove()

        delete this.currentShape['radius']
        delete this.currentShape['width']
        delete this.currentShape['height']

        if(newType === Common.square){
            this.currentShape = {
                ...this.currentShape,
                width: currentShape.width,
                height: currentShape.height,
                type: Common.square
            }

            select(this.node)
                .selectAll('.stamp')
                .data([this.currentShape])
                .enter()
                .append('rect')
                .attr('class', 'stamp')
                .attr('fill', obj => obj.color)
                .attr('width', obj => obj.width)
                .attr('opacity', obj => obj.opacity)
                .attr('height', obj => obj.height)
                .attr('x', obj => obj.posX * this.scalePosX)
                .attr('y', obj => obj.posY * this.scalePosY)

        } else {
            this.currentShape = {
                ...this.currentShape,
                radius: currentShape.radius,
                type: Common.circle
            }

            select(this.node)
                .selectAll('.stamp')
                .data([this.currentShape])
                .enter()
                .append('circle')
                .attr('class', 'stamp')
                .attr('fill', obj => obj.color)
                .attr('opacity', obj => obj.opacity)
                .attr('r', obj => obj.radius)
                .attr('cx', obj => obj.posX * this.scalePosX)
                .attr('cy', obj => obj.posY * this.scalePosY)
        }
        this.centerStamp();
    }

    render() {
        const {canvasWidth, canvasHeight, backgroundColor} = this.props.canvasData,
            style = {
                main: {
                    width: `${canvasWidth}px`,
                    height: `${canvasHeight}px`,
                    backgroundColor: backgroundColor,
                }
            };
            
        return (
            <svg style={style.main} id='canvas' ref={node => (this.node = node)}/>
        );
    }
}

const mapStateToProps = (state) => {
    const {canvasData, currentShape} = state.canvas;
    return { 
        canvasData,
        currentShape
    }
} 

export default connect(mapStateToProps)(ShapeCanvas);




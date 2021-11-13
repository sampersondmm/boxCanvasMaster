import React, {Component} from 'react';
import {event, select} from 'd3-selection';
import Common from '../../constants/common';
import uuid from 'react-uuid';
import {clearCanvasData} from '../../actions/canvas/canvasActions';
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
        const {shapeType, shapeWidth, shapeHeight, shapeRadius, selectedShape, shapeRotation, shapeColor, shapeOpacity} = this.props.currentShape;
        const { canvasWidth, canvasHeight, canvasScale } = this.props.canvasData;
        if(shapeColor !== prevProps.currentShape.shapeColor){
            this.changeShapeColor(shapeColor)
        }
        if(shapeOpacity !== prevProps.currentShape.shapeOpacity){
            this.changeShapeOpacity(shapeOpacity)
        }
        if(shapeType !== prevProps.currentShape.shapeType){
            this.changeShapeType(shapeType)
        }
        if(shapeWidth !== prevProps.currentShape.shapeWidth){
            this.changeShapeWidth(shapeWidth)
        }
        if(shapeHeight !== prevProps.currentShape.shapeHeight){
            this.changeShapeHeight(shapeHeight)
        }
        if(shapeRotation !== prevProps.currentShape.shapeRotation){
            this.changeShapeRotation(shapeRotation)
        }
        if(shapeRadius !== prevProps.currentShape.shapeRadius){
            this.changeShapeRadius(shapeRadius)
        }
        if(canvasScale !== prevProps.canvasScale){
            this.changeCanvasScale(canvasScale)
        }
        if(selectedShape !== prevProps.selectedShape){
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
        const { canvasWidth, canvasHeight } = this.props.canvasData;
        const {shapeWidth, shapeHeight, shapeColor, shapeOpacity} = this.props.currentShape;
        this.centerX = canvasWidth / 2;
        this.centerY = canvasHeight/2;
        // Default starting shape
        this.currentShape = {
            width: shapeWidth,
            height: shapeHeight,
            posX: this.centerX - (shapeWidth/2), 
            posY: this.centerY - (shapeHeight/2),
            type: Common.square,
            border: 0,
            rotation: 0,
            color: shapeColor,
            opacity: shapeOpacity
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
        const {shapeType, shapeWidth, shapeRotation, shapeHeight} = this.props.currentShape;
        const canvasElement = document.getElementById('collection-canvas').getBoundingClientRect();
        const node = select(this.node)
            .select('.stamp');
        const ref = select(this.node)
            .select('.ref');

        this.hoverActive = true;

        if(shapeType === Common.square){
            const newX = (event.x - canvasElement.left) - (shapeWidth/2);
            const newY = (event.y - canvasElement.top) - (shapeHeight/2);
            this.originX = event.x - canvasElement.left;
            this.originY = event.y - canvasElement.top;
            node
                .attr('transform', obj => `rotate(0 ${this.originX} ${this.originY})`);

            node
                .attr('x', () => (newX) * this.scalePosX)
                .attr('y', () => (newY) * this.scalePosY)

            node
                .attr('transform', obj => `rotate(${shapeRotation} ${this.originX} ${this.originY})`);

        } else {
            node
                .attr('cx', () => (event.x - canvasElement.left) * this.scalePosX)
                .attr('cy', () => (event.y - canvasElement.top) * this.scalePosY);

            // this.currentShape.posX = (event.x - canvasElement.left);
            // this.currentShape.posY = (event.y - canvasElement.top);
        }
    }

    centerStamp(){
        const {shapeWidth, shapeHeight, shapeRotation, shapeRadius} = this.props.currentShape;
        const {canvasWidth, canvasHeight} = this.props.canvasData;
        const stamp = select(this.node)
            .selectAll('.stamp');
        let centerX = (canvasWidth / 2) - (shapeWidth/2);
        let centerY = (canvasHeight / 2) - (shapeHeight/2);

        if(this.currentShape.type === Common.square){
            centerX = (canvasWidth / 2) - (shapeWidth/2);
            centerY = (canvasHeight / 2) - (shapeHeight/2);

            stamp
                .attr('transform', `rotate(0 ${this.originX} ${this.originY})`)

            stamp
                .attr('x', centerX)
                .attr('y', centerY)

            stamp
                .attr('transform', `rotate(${shapeRotation} ${this.centerX} ${this.centerY})`)
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

    loadShapes(){
        const squareArr = this.shapeArr.filter(shape => shape.type === Common.square ? shape : null),
            circleArr = this.shapeArr.filter(shape => shape.type === Common.circle ? shape : null);
        select(this.node)
            .selectAll('.shape')
            .remove();

        select(this.node)
            .selectAll('')
    }

    selectShape(selectedShape){
        if(selectedShape){
            const {posX, posY, width, height} = selectedShape,
                currentHighlight = select(this.node).selectAll('.selected-shape-highlight');

            select(this.node)
                .selectAll('.selected-shape-highlight')
                .data()
        }
    }

    addShape(){
        const {shapeType, shapeRotation, shapeOpacity} = this.props.currentShape,
            newShapeUuid = uuid(),
            transform = select(this.node).selectAll('.stamp').attr('transform');

        let posX = null;
        let posY = null;
        if(shapeType === Common.square){
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
        this.currentShape.opacity = shapeOpacity;
        this.shapeArr.push({...this.currentShape});

        this.props.addShape(this.currentShape)

        select(this.node)
            .selectAll('.stamp')
            .remove();
        
        if(shapeType === Common.square){
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
                .attr('transform', `rotate(${shapeRotation} ${this.originX} ${this.originY})`);

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
                .attr('transform', `rotate(${shapeRotation} ${this.originX} ${this.originY})`);

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
        const {shapeWidth, shapeHeight, shapeRadius} = this.props.currentShape;

        select(this.node)
            .selectAll('.stamp')
            .remove()

        delete this.currentShape['radius']
        delete this.currentShape['width']
        delete this.currentShape['height']

        if(newType === Common.square){
            this.currentShape = {
                ...this.currentShape,
                width: shapeWidth,
                height: shapeHeight,
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
                radius: shapeRadius,
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
            <svg style={style.main} id='collection-canvas' ref={node => (this.node = node)}/>
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




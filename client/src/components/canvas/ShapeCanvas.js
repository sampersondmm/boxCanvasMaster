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

    componentWillReceiveProps(nextProps){
        const {shapeType, shapeWidth, shapeHeight, shapeRadius, selectedShape, shapeRotation, shapeColor, shapeOpacity} = nextProps.canvas.currentShape;
        const { canvasWidth, canvasHeight, canvasScale } = this.props.canvas;
        if(shapeColor !== this.props.canvas.currentShape.shapeColor){
            this.changeShapeColor(shapeColor)
        }
        if(shapeOpacity !== this.props.canvas.currentShape.shapeOpacity){
            this.changeShapeOpacity(shapeOpacity)
        }
        if(shapeType !== this.props.canvas.currentShape.shapeType){
            this.changeShapeType(shapeType)
        }
        if(shapeWidth !== this.props.canvas.currentShape.shapeWidth){
            this.changeShapeWidth(shapeWidth)
        }
        if(shapeHeight !== this.props.canvas.currentShape.shapeHeight){
            this.changeShapeWidth(shapeHeight)
        }
        if(shapeRotation !== this.props.canvas.currentShape.shapeRotation){
            this.changeShapeRotation(shapeRotation)
        }
        if(shapeRadius !== this.props.canvas.currentShape.shapeRadius){
            this.changeShapeRadius(shapeRadius)
        }
        if(canvasScale !== this.props.canvas.canvasScale){
            this.changeCanvasScale(canvasScale)
        }
        if(selectedShape !== this.props.canvas.selectedShape){
            this.selectShape(selectedShape)
        }
        if(nextProps.canvas !== this.props.canvas){
            this.centerStamp();
        }
    }

    /**
     * Update the state based on the props.
     *
     * @returns {void}
     */
    componentDidMount() {
        const { backgroundColor } = this.props.canvas;
        const {shapeColor} = this.props.canvas.currentShape;
        this.setState(state => ({
            ...state,
            shapeColor: shapeColor,
            backgroundColor: backgroundColor
        }));
        window.addEventListener('resize', this.resize);
        this.setupCanvas();
    }

    setupCanvas(){
        const { canvasWidth, canvasHeight } = this.props.canvas;
        const {shapeWidth, shapeHeight, shapeColor, shapeOpacity} = this.props.canvas.currentShape;
        // Default starting shape
        this.currentShape = {
            width: shapeWidth,
            height: shapeHeight,
            posX: 100, 
            posY: 100,
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
            .attr('transform', obj => `translate(-${obj.width / 2}, -${obj.height / 2})`)

        select(this.node)
            .on('mousemove', () => this.moveShape())
            .on('mouseleave', () => this.centerStamp())
            .on('click', (obj, index, arr) => this.addShape(index, arr))

        this.centerStamp();
        this.centerX = canvasWidth / 2;
        this.centerY = canvasHeight/2;
    }

    moveShape(){
        const { canvasWidth, canvasHeight } = this.props.canvas;
        const {shapeType, shapeRotation} = this.props.canvas.currentShape,
            canvasElement = document.getElementById('canvas').getBoundingClientRect(),
            node = select(this.node)
                .select('.stamp');

        this.hoverActive = true;

        node.attr('visibility', 'visible')

        let shapeWidth = null,
            shapeHeight = null;


        if(shapeType === Common.square){
            shapeWidth = node.attr('width'); 
            shapeHeight = node.attr('height'); 

            node
                .attr('transform', obj => `translate(-${shapeWidth/2}, -${shapeHeight/2}) rotate(${ -shapeRotation} ${this.centerX} ${this.centerY})`);

            node
                .attr('x', () => (event.x - canvasElement.left) * this.scalePosX)
                .attr('y', () => (event.y - canvasElement.top) * this.scalePosY)

            // node
            //     .attr('transform', obj => `translate(-${shapeWidth/2}, -${shapeHeight/2}) rotate(${obj.rotation} ${this.centerX} ${this.centerY})`);

            this.currentShape.posX = (event.x - canvasElement.left);
            this.currentShape.posY = (event.y - canvasElement.top);
        } else {
            node
                .attr('cx', () => (event.x - canvasElement.left) * this.scalePosX)
                .attr('cy', () => (event.y - canvasElement.top) * this.scalePosY);

            this.currentShape.posX = (event.x - canvasElement.left);
            this.currentShape.posY = (event.y - canvasElement.top);
        }
    }

    centerStamp(){
        const {canvasWidth, canvasHeight} = this.props.canvas;
        this.hoverActive = false;
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;

        const stamp = select(this.node)
            .selectAll('.stamp');

        if(this.currentShape.type === Common.square){
            stamp
                .attr('x', centerX)
                .attr('y', centerY)
        } else {
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
        const {shapeType, shapeOpacity} = this.props.canvas,
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
                .attr('transform', transform);

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
                .attr('transform', obj => `translate(-${obj.width / 2}, -${obj.height / 2})`)

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
            .attr('transform', `translate(-${newWidth/2}, -${this.currentShape.height/2})`)
    }

    changeShapeHeight(newHeight){
        this.currentShape.height = newHeight;
        select(this.node)
            .selectAll('.stamp')
            .attr('height', newHeight)
            .attr('transform', `translate(-${this.currentShape.width/2}, -${newHeight/2})`)
    }

    changeShapeRotation = (newRotation) => {
        const { canvasWidth, canvasHeight} = this.props.canvas;
        const { shapeWidth, shapeHeight } = this.props.canvas.currentShape;
        const centerX = (canvasWidth / 2);
        const centerY = (canvasHeight / 2);
        this.currentShape.rotation = newRotation;
        const node = select(this.node)
        
        node
            .selectAll('.stamp')
            .attr('transform', obj => `rotate(${newRotation} ${centerX} ${centerY}) translate(-${obj.width/2}, -${obj.height/2})`)
            // .attr('transform', obj => `translate(-${obj.width/2}, -${obj.height/2})`)
    }

    changeCanvasScale(newScale) {
        const {canvasWidth, canvasHeight} = this.props.canvas;
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
        const {shapeWidth, shapeHeight, shapeRadius} = this.props.canvas;

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
                .attr('height', obj => obj.height)
                .attr('x', obj => obj.posX * this.scalePosX)
                .attr('y', obj => obj.posY * this.scalePosY)
                // .attr('transform', obj => `translate(-${obj.width / 2}, -${obj.height / 2})`)

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
                .attr('r', obj => obj.radius)
                .attr('cx', obj => obj.posX * this.scalePosX)
                .attr('cy', obj => obj.posY * this.scalePosY)
        }
    }

    render() {
        const {canvasWidth, canvasHeight, backgroundColor} = this.props.canvas,
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

export default ShapeCanvas;




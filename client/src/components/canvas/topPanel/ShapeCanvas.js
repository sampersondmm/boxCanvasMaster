import React, {Component} from 'react';
import {event, select} from 'd3-selection';
import Common from '../../../constants/common';
import uuid from 'react-uuid';

export default class ShapeCanvas extends Component {
    /**
     * Creates an instance of the Canvas
     *
     * @param {object.<string, any>} props The props.
     */
    constructor(props) {
        super(props);
        this.backgroundColor = this.props.backgroundColor;
        // this.circleColor = 'rgb(100,120,120)';
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

        this.state = {
            posX: 100,
            posY: 100,
        };
        this.canvasEl = null;
        this.particles = [];
        this.setupCanvas = this.setupCanvas.bind(this);
        this.addShape = this.addShape.bind(this);
        this.changeShapeColor = this.changeShapeColor.bind(this);
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
        const {canvasWidth, canvasHeight, canvasScale, shapeType, shapeWidth, shapeHeight, shapeRadius, selectedShape, shapeColor} = nextProps;
        if(shapeColor !== this.props.shapeColor){
            this.changeShapeColor(shapeColor)
        }
        if(shapeType !== this.props.shapeType){
            this.changeShapeType(shapeType)
        }
        if(shapeWidth !== this.props.shapeWidth){
            this.changeShapeWidth(shapeWidth)
        }
        if(shapeHeight !== this.props.shapeHeight){
            this.changeShapeHeight(shapeHeight)
        }
        if(shapeRadius !== this.props.shapeRadius){
            this.changeShapeRadius(shapeRadius)
        }
        if(canvasScale !== this.props.canvasScale){
            this.changeCanvasScale(canvasScale)
        }
        if(selectedShape !== this.props.selectedShape){
            this.selectShape(selectedShape)
        }
        if(nextProps !== this.props){
            this.centerStamp();
        }
    }

    /**
     * Update the state based on the props.
     *
     * @returns {void}
     */
    componentDidMount() {
        this.setState(state => ({
            ...state,
            shapeColor: this.props.shapeColor,
            backgroundColor: this.props.backgroundColor
        }));
        window.addEventListener('resize', this.resize);
        this.setupCanvas();
    }

    moveShape(){
        const canvasElement = document.getElementById('canvas').getBoundingClientRect();
        this.hoverActive = true;
        const node = select(this.node)
            .select('.stamp');

        node.attr('visibility', 'visible')

        let shapeWidth = null,
            shapeHeight = null;


        if(this.props.shapeType === Common.square){
            shapeWidth = node.attr('width'); 
            shapeHeight = node.attr('height'); 


            node
                .attr('x', () => (event.x - canvasElement.left) * this.scalePosX)
                .attr('y', () => (event.y - canvasElement.top) * this.scalePosY)
                .attr('transform', `translate(-${shapeWidth/2}, -${shapeHeight/2})`);

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
        this.hoverActive = false;

        const stamp = select(this.node)
            .selectAll('.stamp');

        if(this.currentShape.type === Common.square){
            stamp
                .attr('x', this.props.canvasWidth / 2)
                .attr('y', this.props.canvasHeight / 2)
        } else {
            stamp
                .attr('cx', this.props.canvasWidth / 2)
                .attr('cy', this.props.canvasHeight / 2)
        }       
    }

    setupCanvas(){
        // Default starting shape
        this.currentShape = {
            width: this.props.shapeWidth,
            height: this.props.shapeHeight,
            posX: 100, 
            posY: 100,
            type: Common.square,
            border: 0,
            rotation: 0,
            color: this.props.shapeColor
        };

        select(this.node)
            .selectAll('rect')
            .data([this.currentShape])
            .enter()
            .append('rect')
            .attr('class', 'stamp')
            .attr('fill', obj => obj.color)
            .attr('width', obj => obj.width)
            .attr('height', obj => obj.height)
            .attr('x', obj => obj.posX)
            .attr('y', obj => obj.posY)
            .attr('transform', obj => `translate(-${obj.width / 2}, -${obj.height / 2})`)

        select(this.node)
            .on('mousemove', () => this.moveShape())
            .on('mouseleave', () => this.centerStamp())
            .on('click', (obj, index, arr) => this.addShape(index, arr))
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
        const newShapeUuid = uuid(),
            transform = select(this.node).selectAll('.stamp').attr('transform');

        let posX = null;
        let posY = null;
        if(this.props.shapeType === Common.square){
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
        this.shapeArr.push({...this.currentShape});

        this.props.addShape(this.currentShape)

        select(this.node)
            .selectAll('.stamp')
            .remove();
        
        if(this.props.shapeType === Common.square){
            select(this.node)
                .selectAll('.shape')
                .data(this.shapeArr)
                .enter()
                .append('rect')
                .attr('class', 'shape')
                .attr('fill', obj => obj.color)
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

    changeCanvasScale(newScale) {
        select(this.node)
            .attr('transform', `scale(${newScale})`)
        this.scalePosX = this.props.canvasWidth / (this.props.canvasWidth * newScale);
        this.scalePosY = this.props.canvasHeight / (this.props.canvasHeight * newScale);
    }

    changeShapeHeight(newHeight){
        this.currentShape.height = newHeight;
        select(this.node)
            .selectAll('.stamp')
            .attr('height', newHeight)
            .attr('transform', `translate(-${this.currentShape.width/2}, -${newHeight/2})`)
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

    changeShapeType(newType){
        select(this.node)
            .selectAll('.stamp')
            .remove()

        delete this.currentShape['radius']
        delete this.currentShape['width']
        delete this.currentShape['height']

        if(newType === Common.square){
            this.currentShape = {
                ...this.currentShape,
                width: this.props.shapeWidth,
                height: this.props.shapeHeight,
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
                radius: this.props.shapeRadius,
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
        const {canvasWidth, canvasHeight} = this.props;
        const style = {
            main: {
                width: `${canvasWidth}px`,
                height: `${canvasHeight}px`,
                backgroundColor: this.props.backgroundColor,
            }
        }
        return (
            <svg style={style.main} id='canvas' ref={node => (this.node = node)}/>
        );
    }
}




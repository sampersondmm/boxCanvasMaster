import React, {Component} from 'react';
import {event, select} from 'd3-selection';
import Common from '../../constants/common';
import uuid from 'react-uuid';
import {clearCanvasData} from '../../actions/canvasActions';
import {connect} from 'react-redux';

class ShapeCollectionCanvas extends Component {
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
        this.shapeArr = props.canvas.collectionList;
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
        const {canvasWidth, canvasHeight, canvasScale, shapeType, shapeWidth, shapeHeight, shapeRadius, selectedShape, shapeColor, shapeOpacity} = nextProps.canvas;
        if(shapeColor !== this.props.canvas.shapeColor){
            this.changeShapeColor(shapeColor)
        }
        if(shapeOpacity !== this.props.canvas.shapeOpacity){
            this.changeShapeOpacity(shapeOpacity)
        }
        if(shapeType !== this.props.canvas.shapeType){
            this.changeShapeType(shapeType)
        }
        if(shapeWidth !== this.props.canvas.shapeWidth){
            this.changeShapeWidth(shapeWidth)
        }
        if(shapeHeight !== this.props.canvas.shapeHeight){
            this.changeShapeHeight(shapeHeight)
        }
        if(shapeRadius !== this.props.canvas.shapeRadius){
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
        const {shapeColor, backgroundColor} = this.props.canvas;
        this.setState(state => ({
            ...state,
            shapeColor: shapeColor,
            backgroundColor: backgroundColor
        }));
        window.addEventListener('resize', this.resize);
        this.setupCanvas();
    }

    moveShape(){
        const {shapeType, shapeRadius} = this.props.canvas,
            canvasElement = document.getElementById('canvas-collection').getBoundingClientRect(),
            node = select(this.node)
                .select('.stamp');

        this.hoverActive = true;

        node.attr('visibility', 'visible')

        let shapeWidth = null,
            shapeHeight = null,
            shapePosX = null,
            shapePosY = null;


        if(shapeType === Common.square){
            shapeWidth = node.attr('width'); 
            shapeHeight = node.attr('height'); 

            shapePosX = (event.x - canvasElement.left) * this.scalePosX;
            shapePosY = (event.y - canvasElement.top) * this.scalePosY;

            node
                .attr('x', () => (shapePosX))
                .attr('y', () => (shapePosY))
                .attr('transform', `translate(-${shapeWidth/2}, -${shapeHeight/2})`);

            this.currentShape.posX = shapePosX;
            this.currentShape.posY = shapePosY;

        } else {
            shapePosX = event.x - canvasElement.left;
            shapePosY = event.y - canvasElement.top;
            node
                .attr('cx', () => (shapePosX))
                .attr('cy', () => (shapePosY));

            this.currentShape.posX = (shapePosX);
            this.currentShape.posY = (shapePosY);
        }
    }

    centerStamp(){
        const {canvasWidth, canvasHeight} = this.props.canvas;
        this.hoverActive = false;

        const stamp = select(this.node)
            .selectAll('.stamp');

        if(this.currentShape.type === Common.square){
            stamp
                .attr('x', canvasWidth / 2)
                .attr('y', canvasHeight / 2)
        } else {
            stamp
                .attr('cx', canvasWidth / 2)
                .attr('cy', canvasHeight / 2)
        }       
    }

    createExistingShapes = () => {
        const { collectionList } = this.props.canvas;
        for(const listItem of collectionList) {
            if(listItem.type === Common.square){
                select(this.node)
                    .selectAll('rect')
                    .data([listItem])
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
            }
        }
    }

    setupCanvas(){
        const {shapeWidth, shapeHeight, shapeColor, shapeOpacity, collectionList} = this.props.canvas;

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

        select(this.node)
            .selectAll('.shape')
            .data(collectionList.reverse())
            .enter()
            .append('rect')
            .attr('class', 'shape')
            .attr('fill', obj => obj.color)
            .attr('opacity', obj => obj.opacity)
            .attr('width', obj => obj.width)
            .attr('height', obj => obj.height)
            .attr('x', obj => obj.posX)
            .attr('y', obj => obj.posY)
            .attr('transform', obj => `translate(-${obj.width / 2}, -${obj.height / 2})`)

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

    changeCanvasScale(newScale) {
        const {canvasWidth, canvasHeight} = this.props.canvas;
        select(this.node)
            .attr('transform', `scale(${newScale})`)
        this.scalePosX = canvasWidth / (canvasWidth * newScale);
        this.scalePosY = canvasHeight / (canvasHeight * newScale);
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
            <svg style={style.main} id='canvas-collection' ref={node => (this.node = node)}/>
        );
    }
}

export default ShapeCollectionCanvas;




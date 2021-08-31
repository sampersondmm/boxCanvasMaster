import React, {Component} from 'react';
import {event, select, selectAll} from 'd3-selection';
import { transition } from 'd3-transition'
import { selectShape } from '../../actions/canvasActions';
import Common from '../../constants/common';
import uuid from 'react-uuid';
import {connect} from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import { map, filter } from 'lodash';

class ShapeCanvas extends Component {
    /**
     * Creates an instance of the Canvas
     *
     * @param {object.<string, any>} props The props.
     */
    constructor(props) {
        super(props);
        this.shapeArr = [];
        this.currentShape = {};
        this.scalePosX = 1;
        this.scalePosY = 1;
        this.posX = 0;
        this.posY = 0;
        this.linePoints = [];
        this.closeShapeRange = false;

        //Center of rotation for currentShape.square
        this.originX = 0;
        this.originY = 0;
    }

    componentDidUpdate(prevProps){
        const { selectedShapeId, shapeList } = this.props.canvasData;
        const { currentShapeType, currentShape } = this.props;
        const { square, circle, line } = currentShape;

        switch(currentShapeType){
            case Common.square:
                if(square.width !== prevProps.currentShape.square.width){
                    this.changeShapeWidth(square.width)
                }
                if(square.height !== prevProps.currentShape.square.height){
                    this.changeShapeHeight(square.height)
                }
                if(square.rotation !== prevProps.currentShape.square.rotation){
                    this.changeShapeRotation(square.rotation)
                }
                if(square.fill !== prevProps.currentShape.square.fill){
                    this.changeShapeFill(square.fill)
                }
                if(square.stroke !== prevProps.currentShape.square.stroke){
                    this.changeShapeStroke(square.stroke)
                }
                if(square.strokeWidth !== prevProps.currentShape.square.strokeWidth){
                    this.changeShapeStrokeWidth(square.strokeWidth)
                }
                if(square.opacity !== prevProps.currentShape.square.opacity){
                    this.changeShapeOpacity(square.opacity)
                }
                break;

            case Common.circle:
                if(circle.radius !== prevProps.currentShape.circle.radius){
                    this.changeShapeRadius(circle.radius)
                }
                if(circle.fill !== prevProps.currentShape.circle.fill){
                    this.changeShapeFill(circle.fill);
                }
                if(circle.stroke !== prevProps.currentShape.circle.stroke){
                    this.changeShapeStroke(circle.stroke);
                }
                if(circle.strokeWidth !== prevProps.currentShape.circle.strokeWidth){
                    this.changeShapeStrokeWidth(circle.strokeWidth);
                }
                if(circle.opacity !== prevProps.currentShape.circle.opacity){
                    this.changeShapeOpacity(circle.opacity);
                }
                break;

            case Common.line:
                if(line.stroke !== prevProps.currentShape.line.stroke){
                    this.changeShapeStroke(line.stroke)
                }
                if(line.strokeWidth !== prevProps.currentShape.line.strokeWidth){
                    this.changeShapeStrokeWidth(line.strokeWidth)
                }
                break;
            default:
                break;
        }
        if(shapeList !== prevProps.canvasData.shapeList){
            if(shapeList.length < prevProps.canvasData.shapeList.length){
                this.removeShape(selectedShapeId);
            }
        }
        if(currentShapeType !== prevProps.currentShapeType){
            this.changeShapeType(currentShapeType)
        }
        if(selectedShapeId !== prevProps.canvasData.selectedShapeId){
            this.selectShape(selectedShapeId)
        }
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
        this.loadShapes();
        this.setupCanvas();
    }

    setupCanvas = () => {
        const { currentShape, currentShapeType } = this.props;
        const { canvasWidth, canvasHeight } = this.props.canvasData;
        this.centerX = canvasWidth / 2;
        this.centerY = canvasHeight / 2;

        switch(currentShapeType){
            case Common.square:
                select(this.node)
                    .selectAll('rect')
                    .data([currentShape.square])
                    .enter()
                    .append('rect')
                    .attr('class', 'stamp')
                    .attr('fill', obj => obj.fill)
                    .attr('stroke', obj => obj.stroke)
                    .attr('stroke-width', obj => obj.strokeWidth)
                    .attr('opacity', obj => obj.opacity)
                    .attr('width', obj => obj.width)
                    .attr('height', obj => obj.height)
                    .attr('x', obj => obj.posX)
                    .attr('y', obj => obj.posY)
                break;
            case Common.circle:
                select(this.node)
                    .selectAll('rect')
                    .data([currentShape.circle])
                    .enter()
                    .append('rect')
                    .attr('class', 'stamp')
                    .attr('fill', obj => obj.fill)
                    .attr('opacity', obj => obj.opacity)
                    .attr('r', obj => obj.radius)
                    .attr('cx', obj => obj.posX)
                    .attr('cy', obj => obj.posY)
                break;
            case Common.line:
                select(this.node)
                    .selectAll('rect')
                    .data([currentShape.square])
                    .enter()
                    .append('rect')
                    .attr('class', 'stamp')
                    .attr('fill', obj => obj.color)
                    .attr('opacity', obj => obj.opacity)
                    .attr('width', obj => obj.width)
                    .attr('height', obj => obj.height)
                    .attr('x', obj => obj.posX)
                    .attr('y', obj => obj.posY)
                break;
            default:
                break;
        }

        select(this.node)
            .on('mousemove', () => this.moveShape())
            .on('mouseleave', () => this.centerStamp())
            .on('click', (obj, index, arr) => this.addShape(index, arr))

        this.centerStamp();
    }

    moveShape = () => {
        const { currentShapeType, currentShape } = this.props;
        const { selectedShapeId } = this.props.canvasData;
        const { square, line } = this.props.currentShape;
        const canvasElement = document.getElementById('canvas').getBoundingClientRect();

        const stamp = select(this.node)
            .select('.stamp');
        const lineStamp = select(this.node)
            .select('.line-stamp');

        select(this.node)
            .selectAll('.shape-highlight')
            .remove();

        if(selectedShapeId){
            this.props.dispatch(selectShape(''))
        } else {
            stamp
                .attr('opacity', currentShape.opacity)
        }

        let newX = 0;
        let newY = 0;

        switch(currentShapeType){
            case Common.square:
                newX = (event.x - canvasElement.left) - (square.width/2);
                newY = (event.y - canvasElement.top) - (square.height/2);
                this.originX = event.x - canvasElement.left;
                this.originY = event.y - canvasElement.top;
                stamp
                    .attr('transform', `rotate(0 ${this.originX} ${this.originY})`);

                stamp
                    .attr('x', () => (newX) * this.scalePosX)
                    .attr('y', () => (newY) * this.scalePosY)

                stamp
                    .attr('transform', `rotate(${square.rotation} ${this.originX} ${this.originY})`);

                break;
            case Common.circle:
                newX = event.x - canvasElement.left;
                newY = event.y - canvasElement.top;
                stamp
                    .attr('cx', () => (newX) * this.scalePosX)
                    .attr('cy', () => (newY) * this.scalePosY);
                break;
            case Common.line:
                const firstPoint = this.linePoints[0];
                newX = event.x - canvasElement.left;
                newY = event.y - canvasElement.top;
                select(this.node)
                    .selectAll('.line-stamp-circle')
                    .attr('cx', () => (newX) * this.scalePosX)
                    .attr('cy', () => (newY) * this.scalePosY)

                select(this.node)
                    .selectAll('.crosshair-vertical')
                    .attr('x1', () => (newX) * this.scalePosX)
                    .attr('x2', () => (newX) * this.scalePosX)

                select(this.node)
                    .selectAll('.crosshair-horizontal')
                    .attr('y1', () => (newY) * this.scalePosY)
                    .attr('y2', () => (newY) * this.scalePosY)

                if(firstPoint){
                    if(newX > (firstPoint.x - 10) && newX < (firstPoint.x + 10) && newY > (firstPoint.y - 10) && newY < (firstPoint.y + 10) && this.linePoints.length > 1){
                        this.closeShapeRange = true;
                        stamp
                            .attr('fill', 'transparent')
                            .attr('stroke', 'yellow')
                    } else {
                        this.closeShapeRange = false;
                        stamp
                            .attr('fill', line.stroke)
                            .attr('opacity', line.opacity)
                            .attr('stroke', 'transparent')
                    }
    
                    let points = '';
    
                    for(const point of this.linePoints){
                        if(points === ''){
                            points = points.concat(`M ${point.x} ${point.y}`);
                        } else {
                            points = points.concat(` L ${point.x} ${point.y}`)
                        }
                    }
    
                    points = points.concat(` L ${newX} ${newY}`);
    
                    lineStamp
                        .attr('d', points)
                        .attr('fill', line.fill);
                }
                
                break;
            default:
                break;
        }

        this.posX = newX;
        this.posY = newY;
    }

    centerStamp = () => {
        const { square } = this.props.currentShape;
        const {canvasWidth, canvasHeight } = this.props.canvasData;
        const { currentShapeType } = this.props;
        const stamp = select(this.node)
            .selectAll('.stamp');
        const lineStamp = select(this.node)
            .selectAll('.line-stamp');

        let centerX = null;
        let centerY = null;

        switch(currentShapeType){
            case Common.square:
                centerX = (canvasWidth / 2) - (square.width/2);
                centerY = (canvasHeight / 2) - (square.height/2);

                stamp
                    .attr('transform', `rotate(0 ${this.originX} ${this.originY})`)

                stamp
                    .attr('x', centerX)
                    .attr('y', centerY)

                stamp
                    .attr('transform', `rotate(${square.rotation} ${this.centerX} ${this.centerY})`)
                break;
            case Common.circle:
                centerX = (canvasWidth / 2);
                centerY = (canvasHeight / 2);

                stamp
                    .attr('cx', centerX)
                    .attr('cy', centerY)
                break;
            case Common.line:
                centerX = (canvasWidth / 2);
                centerY = (canvasHeight / 2);

                select(this.node)
                    .selectAll('.line-stamp-circle')
                    .attr('cx', centerX)
                    .attr('cy', centerY);

                select(this.node)
                    .selectAll('.crosshair-vertical')
                    .attr('x1', canvasWidth/2)
                    .attr('x2', canvasWidth/2)
                    .attr('y1', 0)
                    .attr('y2', canvasHeight)
                    .attr('stroke', 'rgb(150,150,150)')

                select(this.node)
                    .selectAll('.crosshair-horizontal')
                    .attr('x1', 0)
                    .attr('x2', canvasWidth)
                    .attr('y1', canvasHeight/2)
                    .attr('y2', canvasHeight/2)
                    .attr('stroke', 'rgb(150,150,150)')

                break;
            default:
                break;
        }
    }

    loadShapes = () => {
        const { shapeList } = this.props.canvasData;
        let shapeCopy = {}
        
        select(this.node)
        .selectAll('.stamp')
        .remove();

        shapeList.map((shape) => {
            switch(shape.type){
                case Common.square:
                    select(this.node)
                    .selectAll('rect')
                    .data([shape])
                    .enter()
                    .append('rect')
                    .attr('class', 'stamp')
                    .attr('fill', obj => obj.fill)
                    .attr('stroke', obj => obj.stroke)
                    .attr('stroke-width', obj => obj.strokeWidth)
                    .attr('opacity', obj => obj.opacity)
                    .attr('width', obj => obj.width)
                    .attr('height', obj => obj.height)
                    .attr('x', obj => obj.posX)
                    .attr('y', obj => obj.posY)
        
                    break;
                case Common.circle:
                    shapeCopy = cloneDeep(shape);
                    select(this.node)
                        .selectAll('.shape')
                        .data(this.shapeArr)
                        .enter()
                        .append('circle')
                        .attr('class', 'shape')
                        .attr('fill', obj => obj.fill)
                        .attr('stroke', obj => obj.stroke)
                        .attr('stroke-width', obj => obj.strokeWidth)
                        .attr('opacity', obj => obj.opacity)
                        .attr('r', obj => obj.radius)
                        .attr('cx', this.posX)
                        .attr('cy', this.posY)
        
                    break;
                case Common.line:
                    this.shapeArr.push(shape)
                    select(this.node)
                        .selectAll('.shape')
                        .data(this.shapeArr)
                        .enter()
                        .append('path')
                        .attr('class', 'shape')
                        .attr('stroke', shape.stroke)
                        .attr('fill', shape.fill)
                        .attr('stroke-width', shape.strokeWidth)
                        .attr('d', shape.points);
        
        
    
        
                    break;
                default:
                    break;
            }
            if(shape.type === Common.line){
                if(this.closeShapeRange){
                    this.props.addShape(shapeCopy);
                    this.closeShapeRange = false;
                }
            } else {
                this.props.addShape(shapeCopy);
            }
        })
        
    }

    selectShape = (id) => {
        select(this.node)
            .selectAll('.shape-highlight')
            .remove();

        select(this.node)
            .selectAll('.stamp')
            .attr('opacity', '0')

        if(id !== ''){
            const selectedShapeId = select(this.node)
                .selectAll('.shape')
                .filter(obj => obj.id === id)
            const shapeData = selectedShapeId.data();

            switch(shapeData[0].type){
                case Common.square:
                    const shapeTransform = selectedShapeId.attr('transform')
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
                        .attr('transform', shapeTransform);

                    break;
                case Common.circle:
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
                        .attr('cy', obj => obj.posY);
                    break;
                case Common.line:
                    select(this.node)
                        .selectAll('.shape-highlight')
                        .data(shapeData[0].pointData)
                        .enter()
                        .append('circle')
                        .attr('class', 'shape-highlight')
                        .attr('fill', 'rgba(255,255,255,0.5)')
                        .attr('r', 4)
                        .attr('cx', obj => obj.x)
                        .attr('cy', obj => obj.y)

                    break;
                default:
                    break;
            }
        }
    }

    removeShape = (id) => {

        this.shapeArr = this.shapeArr.filter(shape => shape.id !== id);

        select(this.node)
            .selectAll('.shape')
            .filter((obj) => obj.id === id)
            .remove();
        
        select(this.node)
            .selectAll('.shape-highlight')
            .remove();
    }

    addShape = () => {
        const { currentShape, currentShapeType, canvasData } = this.props;
        const { square, circle, line } = currentShape;

        let shapeCopy = {}

        select(this.node)
            .selectAll('.stamp')
            .remove();

        switch(currentShapeType){
            case Common.square:
                shapeCopy = cloneDeep(square);
                shapeCopy.posX = this.posX;
                shapeCopy.posY = this.posY;
                shapeCopy.originX = this.originX;
                shapeCopy.originY = this.originY;
                shapeCopy.id = uuid();
                this.shapeArr.push(shapeCopy);
                select(this.node)
                    .selectAll('.shape')
                    .data(this.shapeArr)
                    .enter()
                    .append('rect')
                    .attr('class', 'shape')
                    .attr('fill', obj => obj.fill)
                    .attr('stroke', obj => obj.stroke)
                    .attr('stroke-width', obj => obj.strokeWidth)
                    .attr('opacity', obj => obj.opacity)
                    .attr('width', obj => obj.width)
                    .attr('height', obj => obj.height)
                    .attr('x', obj => obj.posX)
                    .attr('y', obj => obj.posY)
                    .attr('transform', obj => `rotate(${obj.rotation} ${this.originX} ${this.originY})`)

                select(this.node)
                    .selectAll('.stamp')
                    .data([shapeCopy])
                    .enter()
                    .append('rect')
                    .attr('class', 'stamp')
                    .attr('fill', obj => obj.fill)
                    .attr('stroke', obj => obj.stroke)
                    .attr('stroke-width', obj => obj.strokeWidth)
                    .attr('opacity', obj => obj.opacity)
                    .attr('width', obj => obj.width)
                    .attr('height', obj => obj.height)
                    .attr('x', obj => obj.posX)
                    .attr('y', obj => obj.posY)
                    .attr('transform', obj => `rotate(${obj.rotation} ${this.originX} ${this.originY})`);
                break;
            case Common.circle:
                shapeCopy = cloneDeep(circle);
                shapeCopy.posX = this.posX;
                shapeCopy.posY = this.posY;
                shapeCopy.id = uuid();
                this.shapeArr.push(shapeCopy);
                select(this.node)
                    .selectAll('.shape')
                    .data(this.shapeArr)
                    .enter()
                    .append('circle')
                    .attr('class', 'shape')
                    .attr('fill', obj => obj.fill)
                    .attr('stroke', obj => obj.stroke)
                    .attr('stroke-width', obj => obj.strokeWidth)
                    .attr('opacity', obj => obj.opacity)
                    .attr('r', obj => obj.radius)
                    .attr('cx', this.posX)
                    .attr('cy', this.posY)

                select(this.node)
                    .selectAll('.stamp')
                    .data([shapeCopy])
                    .enter()
                    .append('circle')
                    .attr('class', 'stamp')
                    .attr('fill', obj => obj.fill)
                    .attr('stroke', obj => obj.stroke)
                    .attr('stroke-width', obj => obj.strokeWidth)
                    .attr('opacity', obj => obj.opacity)
                    .attr('r', obj => obj.radius)
                    .attr('cx', this.posX)
                    .attr('cy', this.posY)
                break;
            case Common.line:
                if(this.closeShapeRange){
                    shapeCopy = cloneDeep(line);
                    shapeCopy.id = uuid();
                    shapeCopy.points = this.createPointString();
                    shapeCopy.pointData = this.linePoints;
                    this.shapeArr.push(shapeCopy);
                    this.linePoints = [];

                    select(this.node)
                        .select('.line-stamp')
                        .remove();
                    
                    select(this.node)
                        .selectAll('.shape')
                        .data(this.shapeArr)
                        .enter()
                        .append('path')
                        .attr('class', 'shape')
                        .attr('stroke', line.stroke)
                        .attr('fill', line.fill)
                        .attr('stroke-width', line.strokeWidth)
                        .attr('d', shapeCopy.points);

                    select(this.node)
                        .selectAll('.line-stamp')
                        .data([line])
                        .enter()
                        .append('path')
                        .attr('class', 'line-stamp')
                        .attr('stroke', obj => obj.stroke)
                        .attr('fill', obj => obj.fill)
                        .attr('stroke-width', obj => obj.strokeWidth)
                        .attr('d', '')

                } else {
                    this.linePoints.push({x: this.posX, y: this.posY})
                }

                select(this.node)
                    .selectAll('.stamp')
                    .data([circle])
                    .enter()
                    .append('circle')
                    .attr('class', 'stamp')
                    .attr('fill', line.stroke)
                    .attr('r', 5)
                    .attr('cx', this.posX)
                    .attr('cy', this.posY);
                break;
            default:
                break;
        }
        if(currentShapeType === Common.line){
            if(this.closeShapeRange){
                this.props.addShape(shapeCopy);
                this.closeShapeRange = false;
            }
        } else {
            this.props.addShape(shapeCopy);
        }
    }

    createPointString = () => {
        const firstPoint = this.linePoints[0];
        let points = '';
        for(const point of this.linePoints){
            if(points === ''){
                points = points.concat(`M ${point.x} ${point.y}`);
            } else {
                points = points.concat(` L ${point.x} ${point.y}`)
            }
        }
        points = points.concat(` Z`)
        return points;
    }

    createShape = () => {
        const { currentShape, currentShapeType } = this.props;
        const { square, circle, line } = currentShape;
        let newShape = {};
        switch(currentShapeType){
            case Common.square:
                newShape = cloneDeep(square);
                newShape.posX = this.posX;
                newShape.posY = this.posY;
                break;
            case Common.circle:
                newShape = cloneDeep(circle);
                newShape.posX = this.posX;
                newShape.posY = this.posY;
                break;
            case Common.line:
                newShape = cloneDeep(line);
                newShape.points = newShape.points.push([this.posX, this.posY])
                break;
            default:
                break;
        }
        this.props.addShape(newShape)
    }

    changeShapeWidth = (newWidth) => {
        this.currentShape.width = newWidth;
        select(this.node)
            .selectAll('.stamp')
            .attr('width', newWidth)
        this.centerStamp();
    }

    changeShapeHeight = (newHeight) => {
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

    changeCanvasScale = (newScale) => {
        const {canvasWidth, canvasHeight} = this.props.canvasData;
        select(this.node)
            .attr('transform', `scale(${newScale})`)
        this.scalePosX = canvasWidth / (canvasWidth * newScale);
        this.scalePosY = canvasHeight / (canvasHeight * newScale);
    }

    changeShapeRadius = (newRadius) => {
        this.currentShape.radius = newRadius;
        select(this.node)
            .selectAll('.stamp')
            .attr('r', newRadius)
    }

    changeShapeFill = (newFill) => {
        select(this.node)
            .selectAll('.stamp')
            .attr('fill', newFill)
    }

    changeShapeStroke = (newStroke) => {
        const {currentShapeType} = this.props;
        switch(currentShapeType){
            case Common.square:
                select(this.node)
                    .selectAll('.stamp')
                    .attr('stroke', newStroke)
                break;
            case Common.circle:
                select(this.node)
                    .selectAll('.stamp')
                    .attr('stroke', newStroke)
                break;
            case Common.line:
                select(this.node)
                    .selectAll('.stamp')
                    .attr('fill', newStroke)
                select(this.node)
                    .selectAll('.line-stamp')
                    .attr('stroke', newStroke);
                break;
            default:
                break;    
        }
    }

    changeShapeStrokeWidth = (newWidth) => {
        const {currentShapeType} = this.props;
        switch(currentShapeType){
            case Common.square:
                select(this.node)
                    .selectAll('.stamp')
                    .attr('stroke-width', newWidth)
                break;
            case Common.circle:
                select(this.node)
                    .selectAll('.stamp')
                    .attr('stroke-width', newWidth)
                break;
            case Common.line:
                select(this.node)
                    .selectAll('.line-stamp')
                    .attr('stroke-width', newWidth);
                break;
            default:
                break;    
        }
    }
    
    changeShapeOpacity = (newOpacity) => {
        select(this.node)
            .selectAll('.stamp')
            .attr('opacity', newOpacity)
        this.currentShape.opacity = newOpacity;
    }

    changeShapeType = (newType) => {
        const { currentShape, canvasData } = this.props;
        const { square, circle, line} = currentShape;

        select(this.node)
            .selectAll('.stamp')
            .remove()

        switch(newType){
            case Common.square:    
                select(this.node)
                    .selectAll('.stamp')
                    .data([square])
                    .enter()
                    .append('rect')
                    .attr('class', 'stamp')
                    .attr('fill', obj => obj.fill)
                    .attr('stroke', obj => obj.stroke)
                    .attr('stroke-width', obj => obj.strokeWidth)
                    .attr('width', obj => obj.width)
                    .attr('opacity', obj => obj.opacity)
                    .attr('height', obj => obj.height)
                    .attr('x', obj => obj.posX * this.scalePosX)
                    .attr('y', obj => obj.posY * this.scalePosY)
                break;
            case Common.circle:
                select(this.node)
                    .selectAll('.stamp')
                    .data([circle])
                    .enter()
                    .append('circle')
                    .attr('class', 'stamp')
                    .attr('fill', obj => obj.fill)
                    .attr('stroke', obj => obj.stroke)
                    .attr('stroke-width', obj => obj.strokeWidth)
                    .attr('opacity', obj => obj.opacity)
                    .attr('r', obj => obj.radius)
                    .attr('cx', obj => obj.posX * this.scalePosX)
                    .attr('cy', obj => obj.posY * this.scalePosY)
                break;
            case Common.line:
                select(this.node)
                    .selectAll('.stamp')
                    .append('g')
                    .attr('class', 'stamp')

                select(this.node)
                    .selectAll('.stamp')
                    .data([line])
                    .enter()
                    .append('circle')
                    .attr('class', 'line-stamp-circle')
                    .attr('fill', '#6ab8c5')
                    .attr('opacity', 0.5)
                    .attr('r', 5)
                    .attr('cx', 0)
                    .attr('cy', 0);

                select(this.node)
                    .selectAll('.stamp')
                    .data([line])
                    .enter()
                    .append('line')
                    .attr('class', 'crosshair-vertical')

                select(this.node)
                    .selectAll('.stamp')
                    .data([line])
                    .enter()
                    .append('line')
                    .attr('class', 'crosshair-horizontal')

                select(this.node)
                    .selectAll('.line-stamp')
                    .data([line])
                    .enter()
                    .append('path')
                    .attr('class', 'line-stamp')
                    .attr('stroke', obj => obj.stroke)
                    .attr('fill', obj => obj.fill)
                    .attr('stroke-width', obj => obj.strokeWidth)
                    .attr('d', '')

                break;
            default:
                break;
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
    const {canvasData, currentShapeType, currentShape} = state.canvas;
    return { 
        canvasData,
        currentShapeType,
        currentShape
    }
} 

export default connect(mapStateToProps)(ShapeCanvas);




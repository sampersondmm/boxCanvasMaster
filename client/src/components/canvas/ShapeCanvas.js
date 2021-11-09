import React, {Component} from 'react';
import {event, select, selectAll} from 'd3-selection';
import { transition } from 'd3-transition'
import { clearCanvasData, selectShape, updateLine, setCanvasData } from '../../actions/canvasActions';
import Common from '../../constants/common';
import uuid from 'react-uuid';
import {connect} from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import { map, filter, isEqual, trim } from 'lodash';
import { withRouter } from 'react-router-dom'
import CanvasAPI from '../../api/canvasApi';

const canvasApi = new CanvasAPI();

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

    /**
     * Update the state based on the props.
     *
     * @returns {void}
     */
     componentDidMount() {
        window.addEventListener('resize', this.resize);
        this.setupCanvas();
    }

    // shouldComponentUpdate(nextProps, nextState){
    //     return !isEqual(nextProps.canvas, this.props.canvas)
    // }

    componentDidUpdate(prevProps){
        const { currentShape, canvasId, selectedShapeId, idFromUrl } = this.props;
        const { shapeList } = this.props;

        switch(currentShape.type){
            case Common.square:
                if(currentShape.width !== prevProps.currentShape.width){
                    this.changeShapeWidth(currentShape.width)
                }
                if(currentShape.height !== prevProps.currentShape.height){
                    this.changeShapeHeight(currentShape.height)
                }
                if(currentShape.rotation !== prevProps.currentShape.rotation && prevProps.currentShape.rotation){
                    this.changeShapeRotation(currentShape.rotation)
                }
                if(currentShape.fill !== prevProps.currentShape.fill){
                    this.changeShapeFill(currentShape.fill)
                }
                if(currentShape.stroke !== prevProps.currentShape.stroke){
                    this.changeShapeStroke(currentShape.stroke)
                }
                if(currentShape.strokeWidth !== prevProps.currentShape.strokeWidth){
                    this.changeShapeStrokeWidth(currentShape.strokeWidth)
                }
                if(currentShape.opacity !== prevProps.currentShape.opacity){
                    this.changeShapeOpacity(currentShape.opacity)
                }
                break;

            case Common.circle:
                if(currentShape.radius !== prevProps.currentShape.radius){
                    this.changeShapeRadius(currentShape.radius)
                }
                if(currentShape.fill !== prevProps.currentShape.fill){
                    this.changeShapeFill(currentShape.fill);
                }
                if(currentShape.stroke !== prevProps.currentShape.stroke){
                    this.changeShapeStroke(currentShape.stroke);
                }
                if(currentShape.strokeWidth !== prevProps.currentShape.strokeWidth){
                    this.changeShapeStrokeWidth(currentShape.strokeWidth);
                }
                if(currentShape.opacity !== prevProps.currentShape.opacity){
                    this.changeShapeOpacity(currentShape.opacity);
                }
                break;

            case Common.line:
                if(currentShape.stroke !== prevProps.currentShape.stroke){
                    this.changeShapeStroke(currentShape.stroke)
                }
                if(currentShape.strokeWidth !== prevProps.currentShape.strokeWidth){
                    this.changeShapeStrokeWidth(currentShape.strokeWidth)
                }
                break;
            default:
                break;
        }
        if(shapeList.length !== prevProps.shapeList.length){
            if(shapeList.length < prevProps.shapeList.length){
                this.removeShape(selectedShapeId);
            }
            if(shapeList.length > prevProps.shapeList.length){
                this.addShapeToCanvas();
            }
        }
        if(currentShape.type !== prevProps.currentShape.type){
            this.changeShapeType(currentShape.type)
        }
        if(selectedShapeId !== prevProps.selectedShapeId){
            this.selectShape(selectedShapeId)
        }
        if(canvasId !== prevProps.canvasId && !canvasId){
            this.loadShapes();
            this.setupStamp();
        }
        if(idFromUrl !== prevProps.idFromUrl){
            this.setupCanvas();
        }
    }

    fetchCanvasData = async (id) => {
        try {
            const response = await canvasApi.fetchCanvas(id);
            this.props.dispatch(setCanvasData(response))
        } catch (error) {
            
        }
    }

    // clearCanvasData = () => {
    //     this.props.dispatch(clearCanvasData())

    //     select(this.node)
    //         .selectAll('.stamp')
    //         .remove();

    //     select(this.node)
    //         .selectAll('.shape')
    //         .remove();
    // }

    setupCanvas = async () => {
        const {idFromUrl, canvasId} = this.props;

        this.props.dispatch(clearCanvasData())

        if(idFromUrl){
            await this.fetchCanvasData(idFromUrl);
        }

        this.loadShapes();
        this.setupStamp();
        
    }

    loadShapes = () => {
        const { shapeList } = this.props;
        let shapeCopy = {}
        
        select(this.node)
        .selectAll('.stamp')
        .remove();

        select(this.node)
        .selectAll('.shape')
        .remove();

        const shapeSelector = select(this.node)
            .selectAll('.shape')

        shapeList.map((shape) => {
            switch(shape.type){
                case Common.square:
                    shapeSelector
                        .data([shape])
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
        
                    break;
                case Common.circle:
                    shapeSelector
                        .data([shape])
                        .enter()
                        .append('circle')
                        .attr('class', 'shape')
                        .attr('fill', obj => obj.fill)
                        .attr('stroke', obj => obj.stroke)
                        .attr('stroke-width', obj => obj.strokeWidth)
                        .attr('opacity', obj => obj.opacity)
                        .attr('r', obj => obj.radius)
                        .attr('cx', obj => obj.posX)
                        .attr('cy', obj => obj.posY)
        
                    break;
                case Common.line:
                    shapeSelector
                        .data([shape])
                        .enter()
                        .append('path')
                        .attr('class', 'shape')
                        .attr('stroke', obj => obj.stroke)
                        .attr('opacity', obj => obj.opacity)
                        .attr('fill', obj => obj.fill)
                        .attr('stroke-width', obj => obj.strokeWidth)
                        .attr('d', obj => obj.points);
        
                    break;
                default:
                    break;
            }
            // if(shape.type === Common.line){
            //     if(this.closeShapeRange){
            //         this.props.addShape(shapeCopy);
            //         this.closeShapeRange = false;
            //     }
            // } else {
            //     this.props.addShape(shapeCopy);
            // }
        })
        
    }

    setupStamp = () => {
        const { currentShape } = this.props;
        const { width, height } = this.props.canvasData;
        this.centerX = width / 2;
        this.centerY = height / 2;

        switch(currentShape.type){
            case Common.square:
                select(this.node)
                    .selectAll('.stamp')
                    .data([currentShape])
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
                    .selectAll('.stamp')
                    .data([currentShape])
                    .enter()
                    .append('circle')
                    .attr('class', 'stamp')
                    .attr('fill', obj => obj.fill)
                    .attr('opacity', obj => obj.opacity)
                    .attr('r', obj => obj.radius)
                    .attr('cx', obj => obj.posX)
                    .attr('cy', obj => obj.posY)
                    break;
            case Common.line:
                select(this.node)
                    .selectAll('.stamp')
                    .data([currentShape])
                    .enter()
                    .append('path')
                    .attr('class', 'stamp')
                    .attr('stroke', obj => obj.stroke)
                    .attr('opacity', obj => obj.opacity)
                    .attr('fill', obj => obj.fill)
                    .attr('stroke-width', obj => obj.strokeWidth)
                    .attr('d', obj => this.createPointString(obj.pointData))
                break;
            default:
                break;
        }

        select(this.node)
            .on('mousemove', () => this.moveStamp())
            .on('mouseleave', () => this.centerStamp())
            .on('click', (obj, index, arr) => this.addShape(index, arr))

        this.centerStamp();
    }

    centerStamp = () => {
        const { width, height } = this.props.canvasData;
        const { currentShape } = this.props;
        const stamp = select(this.node)
            .selectAll('.stamp');
        const lineStamp = select(this.node)
            .selectAll('.line-stamp');

        let centerX = null;
        let centerY = null;

        switch(currentShape.type){
            case Common.square:
                centerX = (width / 2) - (currentShape.width/2);
                centerY = (height / 2) - (currentShape.height/2);

                stamp
                    .attr('transform', `rotate(0 ${this.originX} ${this.originY})`)

                stamp
                    .attr('x', centerX)
                    .attr('y', centerY)

                stamp
                    .attr('transform', `rotate(${currentShape.rotation} ${this.centerX} ${this.centerY})`)
                break;
            case Common.circle:
                centerX = (width / 2);
                centerY = (height / 2);

                stamp
                    .attr('cx', centerX)
                    .attr('cy', centerY)
                break;
            case Common.line:
                centerX = (width / 2);
                centerY = (height / 2);

                select(this.node)
                    .selectAll('.line-stamp-circle')
                    .attr('cx', centerX)
                    .attr('cy', centerY);

                select(this.node)
                    .selectAll('.crosshair-vertical')
                    .attr('x1', width/2)
                    .attr('x2', width/2)
                    .attr('y1', 0)
                    .attr('y2', height)
                    .attr('stroke', 'rgb(150,150,150)')

                select(this.node)
                    .selectAll('.crosshair-horizontal')
                    .attr('x1', 0)
                    .attr('x2', width)
                    .attr('y1', height/2)
                    .attr('y2', height/2)
                    .attr('stroke', 'rgb(150,150,150)')

                break;
            default:
                break;
        }
    }

    moveStamp = () => {
        const { currentShape, selectedShapeId } = this.props;
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

        switch(currentShape.type){
            case Common.square:
                newX = (event.x - canvasElement.left) - (currentShape.width/2);
                newY = (event.y - canvasElement.top) - (currentShape.height/2);
                this.originX = event.x - canvasElement.left;
                this.originY = event.y - canvasElement.top;
                stamp
                    .attr('transform', `rotate(0 ${this.originX} ${this.originY})`);

                stamp
                    .attr('x', () => (newX) * this.scalePosX)
                    .attr('y', () => (newY) * this.scalePosY)

                stamp
                    .attr('transform', `rotate(${currentShape.rotation} ${this.originX} ${this.originY})`);

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
                            .attr('fill', currentShape.stroke)
                            .attr('opacity', currentShape.opacity)
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
                        .attr('fill', currentShape.fill);
                }
                
                break;
            default:
                break;
        }

        this.posX = newX;
        this.posY = newY;
    }

    selectShape = (id) => {
        const { shapeList } = this.props.canvasData;
        select(this.node)
            .selectAll('.shape-highlight')
            .remove();

        select(this.node)
            .selectAll('.stamp')
            .attr('opacity', '0')

        const shapeData = shapeList.find((shape) => shape.id === id)

        if(id !== '' && shapeData){
            switch(shapeData.type){
                case Common.square:
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
                        .attr('transform', obj => obj.transform);

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
                        .data(shapeData.pointData)
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

    addShapeToCanvas = () => {
        const { shapeList, currentShape } = this.props;
        
        select(this.node)
            .selectAll('.stamp')
            .remove();

        select(this.node)
            .selectAll('.shape')
            .remove();

        const shapeSelector = select(this.node)
            .selectAll('.shape')

        const stampSelector = select(this.node)
            .selectAll('.stamp')

        shapeList.map((shape) => {
            switch(shape.type){
                case Common.square:
                    shapeSelector
                        .data([shape])
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
        
                    break;
                case Common.circle:
                    shapeSelector
                        .data([shape])
                        .enter()
                        .append('circle')
                        .attr('class', 'shape')
                        .attr('fill', obj => obj.fill)
                        .attr('stroke', obj => obj.stroke)
                        .attr('stroke-width', obj => obj.strokeWidth)
                        .attr('opacity', obj => obj.opacity)
                        .attr('r', obj => obj.radius)
                        .attr('cx', obj => obj.posX)
                        .attr('cy', obj => obj.posY)
        
                    break;
                case Common.line:
                    shapeSelector
                        .data([shape])
                        .enter()
                        .append('path')
                        .attr('class', 'shape')
                        .attr('stroke', obj => obj.stroke)
                        .attr('opacity', obj => obj.opacity)
                        .attr('fill', obj => obj.fill)
                        .attr('stroke-width', obj => obj.strokeWidth)
                        .attr('d', obj => obj.points);
        
                    break;
                default:
                    break;
            }
            // if(shape.type === Common.line){
            //     if(this.closeShapeRange){
            //         this.props.addShape(shapeCopy);
            //         this.closeShapeRange = false;
            //     }
            // } else {
            //     this.props.addShape(shapeCopy);
            // }
        })

        switch(currentShape.type){
            case Common.square:
                stampSelector
                    .data([currentShape])
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
                stampSelector
                    .data([currentShape])
                    .enter()
                    .append('circle')
                    .attr('class', 'stamp')
                    .attr('fill', obj => obj.fill)
                    .attr('stroke', obj => obj.stroke)
                    .attr('stroke-width', obj => obj.strokeWidth)
                    .attr('opacity', obj => obj.opacity)
                    .attr('r', obj => obj.radius)
                    .attr('cx', obj => obj.posX)
                    .attr('cy', obj => obj.posY)
    
                break;
            case Common.line:
                stampSelector
                    .data([currentShape])
                    .enter()
                    .append('path')
                    .attr('class', 'stamp')
                    .attr('stroke', obj => obj.stroke)
                    .attr('opacity', obj => obj.opacity)
                    .attr('fill', obj => obj.fill)
                    .attr('stroke-width', obj => obj.strokeWidth)
                    .attr('d', obj => obj.points);
    
                break;
            default:
                break;
        }
         
    }

    addShape = () => {
        const { currentShape, defaultShape } = this.props;
        const { square, circle, line } = defaultShape;

        let shapeCopy = {};
        let stampCopy = {};

        const shapeSelector = select(this.node)
            .selectAll('.shape')

        select(this.node)
            .selectAll('.stamp')
            .remove();

        switch(currentShape.type){
            case Common.square:
                shapeCopy = cloneDeep(currentShape);
                shapeCopy.posX = this.posX;
                shapeCopy.posY = this.posY;
                shapeCopy.originX = this.originX;
                shapeCopy.originY = this.originY;
                shapeCopy.id = uuid();
                this.shapeArr.push(shapeCopy);
                break;
            case Common.circle:
                shapeCopy = cloneDeep(currentShape);
                shapeCopy.posX = this.posX;
                shapeCopy.posY = this.posY;
                shapeCopy.id = uuid();
                this.shapeArr.push(shapeCopy);
                break;
            case Common.line:
                if(this.closeShapeRange){
                    shapeCopy = cloneDeep(line);
                    shapeCopy.id = uuid();
                    shapeCopy.points = this.createPointString(this.linePoints);
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
                    shapeCopy = cloneDeep(line);
                    this.linePoints.push({x: this.posX, y: this.posY});
                    shapeCopy.pointData = this.linePoints;
                    this.props.dispatch(updateLine(shapeCopy))
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
        if(currentShape.type === Common.line){
            if(this.closeShapeRange){
                this.props.addShape(shapeCopy);
                this.closeShapeRange = false;
            }
        } else {
            this.props.addShape(shapeCopy);
        }
    }

    createPointString = (pointList) => {
        let pointString = '';
        for(const point of pointList){
            if(pointString === ''){
                pointString = pointString.concat(`M ${point.x} ${point.y}`);
            } else {
                pointString = pointString.concat(` L ${point.x} ${point.y}`)
            }
        }
        pointString = pointString.concat(` Z`)
        return pointString;
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
    }

    changeShapeType = (newType) => {
        const { currentShape } = this.props;

        select(this.node)
            .selectAll('.stamp')
            .remove()

        switch(newType){
            case Common.square:    
                select(this.node)
                    .selectAll('.stamp')
                    .data([currentShape])
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
                    .data([currentShape])
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
                    .data([currentShape])
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
                    .data([currentShape])
                    .enter()
                    .append('line')
                    .attr('class', 'crosshair-vertical')

                select(this.node)
                    .selectAll('.stamp')
                    .data([currentShape])
                    .enter()
                    .append('line')
                    .attr('class', 'crosshair-horizontal')

                select(this.node)
                    .selectAll('.line-stamp')
                    .data([currentShape])
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
        const {width, height, fill} = this.props.canvasData,
            style = {
                main: {
                    width: `${width}px`,
                    height: `${height}px`,
                    backgroundColor: fill,
                }
            };
            
        return (
            <svg style={style.main} id='canvas' ref={node => (this.node = node)}/>
        );
    }
}

const mapStateToProps = (state) => {
    const { editor, shapeList, canvasData } = state.canvas;
    const { currentShape, defaultShape, selectedShapeId } = editor;
    return { 
        shapeList,
        canvasData,
        defaultShape,
        canvasId: state.canvas._id,
        selectedShapeId,
        currentShape
    }
} 

export default withRouter(connect(mapStateToProps)(ShapeCanvas));




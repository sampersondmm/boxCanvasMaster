import React, {Component} from 'react';
import {event, select, selectAll} from 'd3-selection';
import { transition } from 'd3-transition'
import { clearCanvasData, selectShape, updateLine, changeBackgroundColor, setCanvasData } from '../../actions/canvas/canvasActions';
import Common from '../../constants/common';
import uuid from 'react-uuid';
import {connect} from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import { map, filter, isEqual, trim } from 'lodash';
import { withRouter } from 'react-router-dom'
import CanvasAPI from '../../api/canvasApi';
import * as d3 from 'd3'

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

    componentDidUpdate(prevProps){
        const { currentShape, canvasId, shapeList, selectedShapeId, idFromUrl, canvasData } = this.props;

        this.updateShapeAttr(currentShape, prevProps.currentShape);

        //Change shape opacity
        if(currentShape.opacity !== prevProps.currentShape.opacity){
            this.updateElementAttr('.stamp', 'opacity', currentShape.opacity, false)
        }
        //Add/Remove shape
        if(shapeList.length !== prevProps.shapeList.length){
            if(shapeList.length < prevProps.shapeList.length){
                this.removeShape(selectedShapeId);
            }
            if(shapeList.length > prevProps.shapeList.length && shapeList.length){
                this.addShapeToCanvas();
            }
        }
        //Change shape type
        if(currentShape.type !== prevProps.currentShape.type){
            this.changeShapeType(currentShape.type)
        }

        //Select shape
        if(selectedShapeId !== prevProps.selectedShapeId){
            this.selectShape(selectedShapeId)
        }
        //Initialize canvas
        if(canvasId !== prevProps.canvasId && !canvasId){
            this.setupCanvas();
        }
        if(idFromUrl !== prevProps.idFromUrl){
            this.setupCanvas();
        }
    }

    updateShapeAttr = (shape, prevShape) => {
        const { canvasData, selectedShapeId } = this.props;
        const { width, height } = canvasData;
        switch(shape.type){
            case Common.square:
                if(shape.width !== prevShape.width){
                    if(selectedShapeId){
                        this.updateExistingShape('.stamp', 'width', shape.width, true)
                    } else {
                        this.updateElementAttr('.stamp', 'width', shape.width, true)
                    }
                }
                if(shape.height !== prevShape.height){
                    if(selectedShapeId){
                        this.updateExistingShape('.stamp', 'height', shape.height, true);
                    } else {
                        this.updateElementAttr('.stamp', 'height', shape.height, true);
                    }
                }
                if(shape.rotation !== prevShape.rotation && prevShape.rotation){
                    this.originX = width/2;
                    this.originY = height/2;
                    if(selectedShapeId){
                        this.updateExistingShape(
                            '.stamp',
                            'transform', 
                            `rotate(${shape.rotation} ${this.originX} ${this.originY})`, 
                            false
                        )
                    } else {
                        this.updateElementAttr(
                            '.stamp',
                            'transform', 
                            `rotate(${shape.rotation} ${this.originX} ${this.originY})`, 
                            false
                        )
                    }
                }
                break;
                
            case Common.circle:
                if(shape.radius !== prevShape.radius){
                    if(selectedShapeId){
                        this.updateExistingShape('.stamp', 'r', shape.radius, false)
                    } else {
                        this.updateElementAttr('.stamp', 'r', shape.radius, false)
                    }
                }
                break;
                
            default:
                break;
        }
                
        //Change shape color
        if(shape.fill !== prevShape.fill){
            if(selectedShapeId){
                this.updateExistingShape('.stamp', 'fill', shape.fill, false)
            } else {
                this.updateElementAttr('.stamp', 'fill', shape.fill, false)
            }
        }
        //Change shape stroke color
        if(shape.stroke !== prevShape.stroke){
            if(selectedShapeId){
                this.changeShapeStroke(shape.stroke)
            } else {
                this.changeShapeStroke(shape.stroke)
            }
        }
        //Change shape stroke width
        if(shape.strokeWidth !== prevShape.strokeWidth){
            if(selectedShapeId){
                this.changeShapeStrokeWidth(shape.strokeWidth)
            } else {
                this.changeShapeStrokeWidth(shape.strokeWidth)
            }
        }
    }

    fetchCanvasData = async (id) => {
        try {
            const response = await canvasApi.fetchCanvas(id);
            this.props.dispatch(setCanvasData(response))
        } catch (error) {
            
        }
    }


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
        
        //Clear shapes from canvas
        this.removeElement('.shape')

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
        })
        
    }

    setupStamp = () => {
        const { currentShape } = this.props;
        const { width, height } = this.props.canvasData;
        this.centerX = width / 2;
        this.centerY = height / 2;

        this.removeElement('.stamp');

        switch(currentShape.type){
            case Common.square:
                this.createSquare(currentShape, 'stamp')
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
                    .selectAll('.line-stamp')
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
        const lineStampOutline = select(this.node)
            .select('.line-stamp-outline'); 

        if(selectedShapeId){
            // this.props.dispatch(selectShape(''))
        } else {
            this.removeElement('.shape-highlight')

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
                    .attr('cx', newX)
                    .attr('cy', newY)

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
                        select(this.node)
                            .selectAll('.line-stamp-circle')
                            .attr('fill', 'transparent')
                            .attr('stroke', 'yellow')
                    } else {
                        this.closeShapeRange = false;
                        select(this.node)
                            .selectAll('.line-stamp-circle')
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

                    if(currentShape.curve){
                        const newPoints = cloneDeep(this.linePoints)
                        newPoints.push({x: newX, y: newY})
                        lineStamp
                            .attr('d', this.createPointString(newPoints))
                            .attr('fill', currentShape.fill)
                            .attr('opacity', currentShape.opacity);
                        lineStampOutline
                            .attr('d', points)
                            .attr('fill', 'transparent')
                            .attr('stroke-width', '2')
                            .attr('stroke', currentShape.fill)
                            .attr('opacity', currentShape.opacity );
                    } else {
                        lineStamp
                            .attr('d', points)
                            .attr('fill', currentShape.fill)
                            .attr('opacity', currentShape.opacity );
                    }
    
                }
                
                break;
            default:
                break;
        }

        this.posX = newX;
        this.posY = newY;
    }

    selectShape = (id) => {
        const { shapeList } = this.props;
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
                        .data([shapeData])
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
                        .data([shapeData])
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
                    const shapeHighlight = select(this.node)
                        .selectAll('.shape-highlight');

                    if(shapeData.curve){
                        shapeHighlight
                            .data(shapeData.pointData)
                            .enter()
                            .append('circle')
                                .attr('class', 'shape-highlight')
                                .attr('fill', 'rgba(255,255,255,0.5)')
                                .attr('r', 4)
                                .attr('cx', obj => obj.x)
                                .attr('cy', obj => obj.y)
                        shapeHighlight
                            .data([shapeData])
                            .enter()
                            .append('path')
                                .attr('class', 'shape-highlight')
                                .attr('fill', 'transparent')
                                .attr('stroke', shapeData.fill)
                                .attr('stroke-width', 1)
                                .attr('d', this.createPointString(shapeData.pointData, false))
                    } else {
                        shapeHighlight
                            .data(shapeData.pointData)
                            .enter()
                            .append('circle')
                            .attr('class', 'shape-highlight')
                            .attr('fill', 'rgba(255,255,255,0.5)')
                            .attr('r', 4)
                            .attr('cx', obj => obj.x)
                            .attr('cy', obj => obj.y)
                    }

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

    removeElement = (elementClass) => {
        select(this.node)
            .selectAll(elementClass)
            .remove();
    }

    createSquare = (data, elementClass) => {
        select(this.node)
            .selectAll(`.${elementClass}`)
            .data([data])
            .enter()
            .append('rect')
            .attr('class', elementClass)
            .attr('fill', obj => obj.fill)
            .attr('stroke', obj => obj.stroke)
            .attr('stroke-width', obj => obj.strokeWidth)
            .attr('opacity', obj => obj.opacity)
            .attr('width', obj => obj.width)
            .attr('height', obj => obj.height)
            .attr('x', obj => obj.posX)
            .attr('y', obj => obj.posY)
    }

    createCircle = (data, elementClass) => {
        select(this.node)
            .selectAll(`.${elementClass}`)
            .data([data])
            .enter()
            .append('circle')
            .attr('class', elementClass)
            .attr('fill', obj => obj.fill)
            .attr('stroke', obj => obj.stroke)
            .attr('stroke-width', obj => obj.strokeWidth)
            .attr('opacity', obj => obj.opacity)
            .attr('r', obj => obj.radius)
            .attr('cx', obj => obj.posX)
            .attr('cy', obj => obj.posY)
    }

    createLine = (data, elementClass) => {
        select(this.node)
            .selectAll(`.${elementClass}`)
            .data([data])
            .enter()
            .append('path')
            .attr('class', elementClass)
            .attr('stroke', obj => obj.stroke)
            .attr('fill-opacity', obj => obj.opacity)
            .attr('fill', obj => obj.fill)
            .attr('stroke-width', obj => obj.strokeWidth)
            .attr('d', obj => obj.points);
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
                        .attr('transform', obj => `rotate(${currentShape.rotation} ${obj.originX} ${obj.originY})`)
        
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
                    const path = d3.path();
                    const curve = d3.curveCatmullRom(path);
                    for(const point of currentShape.pointData){
                        curve.lineStart();
                        for(const {x, y} of currentShape.pointData) curve.point(x, y);
                        curve.lineEnd();
                    }
                    shapeSelector
                        .data([shape])
                        .enter()
                        .append('path')
                        .attr('class', 'shape')
                        .attr('stroke', obj => obj.stroke)
                        .attr('opacity', obj => obj.opacity)
                        .attr('fill', obj => obj.fill)
                        .attr('stroke-width', obj => obj.strokeWidth)
                        .attr('d', obj => this.createPointString(obj.pointData));
        
                    break;
                default:
                    break;
            }
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
                    .attr('transform', obj => `rotate(${obj.rotation} ${obj.originX} ${obj.originY})`)
    
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
    }

    addShape = () => {
        const { currentShape, defaultShape } = this.props;
        const { square, circle, line } = defaultShape;

        console.log('CLICKED MAIN CANVAS')

        let shapeCopy = {};
        let stampCopy = {};


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
                    shapeCopy = cloneDeep(currentShape);
                    shapeCopy.id = uuid();
                    shapeCopy.points = this.createPointString(this.linePoints);
                    shapeCopy.pointData = this.linePoints;
                    this.shapeArr.push(shapeCopy);
                    this.linePoints = [];

                    this.removeElement('.line-stamp')
                    this.removeElement('.line-stamp-outline')
                    
                    select(this.node)
                        .selectAll('.shape')
                        .data(this.shapeArr)
                        .enter()
                        .append('path')
                        .attr('class', 'shape')
                        .attr('stroke', currentShape.stroke)
                        .attr('fill', currentShape.fill)
                        .attr('stroke-width', currentShape.strokeWidth)
                        .attr('d', shapeCopy.points);

                    select(this.node)
                        .selectAll('.line-stamp-circle')
                        .attr('fill', currentShape.stroke)
                        .attr('opacity', currentShape.opacity)
                        .attr('stroke', 'transparent')


                } else {
                    shapeCopy = cloneDeep(line);
                    this.linePoints.push({x: this.posX, y: this.posY});
                    shapeCopy.pointData = this.linePoints;
                    this.props.dispatch(updateLine(shapeCopy))
                }

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

    createPointString = (pointList, curve = true) => {
        // if(curve){
        //     const path = d3.path();
        //     const curve = d3.curveBasis(path);
        //     for(const point of pointList){
        //         curve.lineStart();
        //         for(const {x, y} of pointList) curve.point(x, y);
        //         curve.lineEnd();
        //     }
        //     return path;
        // } else {
            let string = '';
            pointList.map((point, index) => {
                if(index === 0){
                    string = `M ${point.x} ${point.y}`
                } else {
                    string = string.concat(` L ${point.x} ${point.y}`)
                }
            })
            string = string.concat(` Z`)
            return string;
        // }
    }

     changeCanvasScale = (newScale) => {
        const {canvasWidth, canvasHeight} = this.props.canvasData;
        select(this.node)
            .attr('transform', `scale(${newScale})`)
        this.scalePosX = canvasWidth / (canvasWidth * newScale);
        this.scalePosY = canvasHeight / (canvasHeight * newScale);
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

    changeShapeType = (newType) => {
        const { currentShape } = this.props;

        this.removeElement('.stamp')
        this.removeElement('.line-stamp-circle')
        this.removeElement('.crosshair-vertical')
        this.removeElement('.crosshair-horizontal')

        switch(newType){
            case Common.square:    
                this.createSquare(currentShape, 'stamp');
                break;
            case Common.circle:
                this.createCircle(currentShape, 'stamp');
                break;
            case Common.line:


                select(this.node)
                    .selectAll('.line-stamp-circle')
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
                    .data([currentShape])
                    .enter()
                    .append('line')
                    .attr('class', 'crosshair-vertical')

                select(this.node)
                    .data([currentShape])
                    .enter()
                    .append('line')
                    .attr('class', 'crosshair-horizontal')

                if(currentShape.curve){
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
                    select(this.node)
                        .selectAll('.line-stamp-outline')
                        .data([currentShape])
                        .enter()
                        .append('path')
                        .attr('class', 'line-stamp-outline')
                        .attr('stroke', obj => obj.stroke)
                        .attr('fill', obj => obj.fill)
                        .attr('stroke-width', obj => obj.strokeWidth)
                        .attr('d', '')
                } else {
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
                }

                break;
            default:
                break;
        }
        this.centerStamp();
    }

    updateExistingShape = (
        elementClass,
        elementAttr,
        updatedValue,
        centerStamp,
    ) => {
        const { selectedShapeId } = this.props;
        select(this.node)
            .selectAll('.shape')
            .filter((obj) => obj.id === selectedShapeId)
            .attr(elementAttr, updatedValue);
        if(centerStamp){
            this.centerStamp();
        }
    }

    /**
     * Update svg element
     * @param {String} elementClass - Class of the element to update
     * @param {String} elementAttr - Attribute to update
     * @param {Mixed} updatedValue - Updated value
     * @param {Boolean} centerStamp - Whether to center stamp after update
     */
    updateElementAttr = (
        elementClass, 
        elementAttr, 
        updatedValue,
        centerStamp
    ) => {
        select(this.node)
            .selectAll(elementClass)
            .attr(elementAttr, updatedValue)
        if(centerStamp){
            this.centerStamp();
        }
    }

    render() {
        const {width, height, fill, opacity} = this.props.canvasData,
            style = {
                main: {
                    width: `${width}px`,
                    height: `${height}px`,
                    backgroundColor: fill,
                    // opacity
                }
            };
        const viewBox = [0,0,width,height]
            
        return (
            <svg 
                style={style.main} 
                opacity={opacity}
                id='canvas' 
                ref={node => (this.node = node)}
            />
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




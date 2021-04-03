import React, {Component} from 'react';
import {event, select} from 'd3-selection';
import { transition } from 'd3-transition'
import Common from '../../constants/common';
import uuid from 'react-uuid';
import {connect} from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import { map } from 'lodash';

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
        const { selectedShape } = this.props.canvasData;
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
                if(square.color !== prevProps.currentShape.square.color){
                    this.changeShapeColor(square.color)
                }
                if(square.opacity !== prevProps.currentShape.square.opacity){
                    this.changeShapeOpacity(square.opacity)
                }
                break;

            case Common.circle:
                if(circle.radius !== prevProps.currentShape.circle.radius){
                    this.changeShapeRadius(circle.radius)
                }
                if(circle.color !== prevProps.currentShape.circle.color){
                    this.changeShapeColor(circle.color)
                }
                if(circle.opacity !== prevProps.currentShape.circle.opacity){
                    this.changeShapeOpacity(circle.opacity)
                }
                break;

            case Common.line:
                break;
            default:
                break;
        }
        if(currentShapeType !== prevProps.currentShapeType){
            this.changeShapeType(currentShapeType)
        }
        if(selectedShape !== prevProps.canvasData.selectedShape){
            this.selectShape(selectedShape)
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
                    .attr('fill', obj => obj.color)
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
                    .attr('fill', obj => obj.color)
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
        const { currentShapeType } = this.props;
        const { selectedShape } = this.props.canvasData;
        const { square, line } = this.props.currentShape;
        const canvasElement = document.getElementById('canvas').getBoundingClientRect();

        const stamp = select(this.node)
            .select('.stamp');
        const lineStamp = select(this.node)
            .select('.line-stamp');

        select(this.node)
            .selectAll('.shape-highlight')
            .remove();

        stamp
            .attr('opacity', 1)

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
                let closeShape = false;
                const firstPoint = this.linePoints[0];
                newX = event.x - canvasElement.left;
                newY = event.y - canvasElement.top;
                stamp
                    .attr('cx', () => (newX) * this.scalePosX)
                    .attr('cy', () => (newY) * this.scalePosY)
                    .attr('fill', obj => obj.color)

                if(firstPoint){
                    if(newX > (firstPoint.x - 10) && newX < (firstPoint.x + 10) && newY > (firstPoint.y - 10) && newY < (firstPoint.y + 10) && this.linePoints.length > 1){
                        this.closeShapeRange = true;
                        stamp
                            .attr('fill', 'transparent')
                            .attr('stroke', 'yellow')
                    } else {
                        this.closeShapeRange = false;
                        stamp
                            .attr('fill', obj => obj.color)
                            .attr('opacity', obj => obj.fill);
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
                        .attr('d', points);
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

                stamp
                    .attr('cx', centerX)
                    .attr('cy', centerY);

                break;
            default:
                break;
        }
    }

    loadShapes = () => {
        const squareArr = this.shapeArr.filter(shape => shape.type === Common.square ? shape : null),
            circleArr = this.shapeArr.filter(shape => shape.type === Common.circle ? shape : null);
        select(this.node)
            .selectAll('.shape')
            .remove();

        select(this.node)
            .selectAll('')
    }

    selectShape = (id) => {
        const { canvasWidth, canvasHeight } = this.props.canvasData
        select(this.node)
            .selectAll('.shape-highlight')
            .remove();

        select(this.node)
            .selectAll('.stamp')
            .attr('opacity', '0')

        if(id !== ''){
            const selectedShape = select(this.node)
                .selectAll('.shape')
                .filter(obj => obj.id === id)
            const shapeData = selectedShape.data();

            switch(shapeData[0].type){
                case Common.square:
                    const shapeTransform = selectedShape.attr('transform')
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

                    const animation = select(this.node)
                        .selectAll('.shape-highlight-animation')
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

                    animation
                        .transition()
                        .duration(500)
                        .attr('stroke', 'rgba(0,0,0,0)')
                        .attr('transform', obj => `translate(-${obj.posX + (obj.width / 2)}, -${obj.posY + (obj.height / 2)}) scale(2)`)
                        .remove()
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
                        .attr('fill', 'yellow')
                        .attr('r', 5)
                        .attr('cx', obj => obj.x)
                        .attr('cy', obj => obj.y)

                    break;
                default:
                    break;
            }
        }
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
                    .attr('fill', obj => obj.color)
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
                    .attr('fill', obj => obj.color)
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
                    .attr('fill', obj => obj.color)
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
                    .attr('fill', obj => obj.color)
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
                    .attr('fill', '#6ab8c5')
                    .attr('opacity', 0.5)
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

    changeShapeColor = (newColor) => {
        const {currentShapeType} = this.props; 
        if(currentShapeType === Common.line){
            select(this.node)
                .selectAll('.stamp')
                .attr('stroke', newColor)
        } else {
            select(this.node)
                .selectAll('.stamp')
                .attr('fill', newColor)
        }
    }
    
    changeShapeOpacity = (newOpacity) => {
        select(this.node)
            .selectAll('.stamp')
            .attr('opacity', newOpacity)
        this.currentShape.opacity = newOpacity;
    }

    changeShapeType = (newType) => {
        const { currentShape } = this.props;
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
                    .attr('fill', obj => obj.color)
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
                    .attr('fill', obj => obj.color)
                    .attr('opacity', obj => obj.opacity)
                    .attr('r', obj => obj.radius)
                    .attr('cx', obj => obj.posX * this.scalePosX)
                    .attr('cy', obj => obj.posY * this.scalePosY)
                break;
            case Common.line:
                select(this.node)
                    .selectAll('.stamp')
                    .data([circle])
                    .enter()
                    .append('circle')
                    .attr('class', 'stamp')
                    .attr('fill', '#6ab8c5')
                    .attr('opacity', 0.5)
                    .attr('r', 5)
                    .attr('cx', 0)
                    .attr('cy', 0);

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




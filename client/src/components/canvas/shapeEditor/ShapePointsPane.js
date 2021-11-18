import React, { Component } from 'react';
import { Icon, Header, Message, Accordion, Menu } from 'semantic-ui-react';
import { cloneDeep, round } from 'lodash'
import { connect } from 'react-redux';
import {event, select, selectAll} from 'd3-selection';
import { drag } from 'd3-drag'
import AccordionIcon from '../../AccordionIcon';
import Aux from '../../../utils/AuxComponent';
import uuid from 'react-uuid';

import * as d3 from 'd3'

const MenuIcon = ({
    icon,
    active,
}) => {
    return (
        <div style={{
            height: '40px',
            width: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderBottom: active ? '3px solid rgba(176, 176, 169, 0.5)' : '3px solid rgba(0,0,0,0)'
        }}>
            <Icon className='font-color' style={{margin: '0'}} name={icon}/>
        </div>
    )
}


class ShapePointsPane extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeTab: '',
            selectedPoint: null,
            expanded: [],
            pointData: [],
            action: 'add'
        }
        this.pointData = [];
        this.stampX = 0;
        this.stampY = 0;
    }
    componentDidMount(){
        select(this.node)
            .on('mousemove', () => this.moveStamp())
            .on('mouseleave', () => this.centerStamp())
            .on('click', () => this.addShape());
        this.centerStamp();
    }
    removeElement = (className) => {
        select(this.node)
            .selectAll(`.${className}`)
            .remove();
    }
    moveStamp = () => {
        const { pointData, action } = this.state;
        const canvasElement = document.getElementById('modal-canvas').getBoundingClientRect();
        const newX = event.x - canvasElement.left;
        const newY = event.y - canvasElement.top;

        this.stampX = newX;
        this.stampY = newY;

        if(action === 'add'){
            // this.removeElement('line-stamp')
            this.removeElement('circle-shape')
    
            const newPointList = cloneDeep(pointData);
            newPointList.push({x: newX, y: newY, id: ''}); 

            select(this.node)
                .selectAll('.line-shape')
                .attr('d', this.createPointString(newPointList)) 
    
            select(this.node)
                .selectAll('.circle-shape')
                .data(newPointList)
                .enter()
                .append('circle')
                .attr('class', 'circle-shape')
                .attr('fill', 'rgb(106, 184, 197)')
                .attr('r', '5')
                .attr('cx', obj => obj.x)
                .attr('cy', obj => obj.y)

            select(this.node)
                .selectAll('.circle-stamp')
                .attr('cx', newX)
                .attr('cy', newY)

        }

    }
    reloadCanvas = () => {
        const { pointData } = this.state; 
        this.removeElement('circle-shape')
        this.removeElement('line-shape');
        select(this.node)
            .selectAll('.line-shape')
            .data([pointData])
            .enter()
            .append('path')
            .attr('class', 'line-shape')
            .attr('fill', 'rgb(106, 184, 197)')
            .attr('opacity', 0.5)
            .attr('stroke', 'black')
            .attr('d', obj => this.createPointString(obj))

        d3.select(this.node)
            .selectAll('.circle-shape')
            .data(pointData)
            .enter()
            .append('circle')
            .attr('class', 'circle-shape')
            .attr('fill', 'rgb(106, 184, 197)')
            .attr('r', '5')
            .attr('cx', obj => obj.x)
            .attr('cy', obj => obj.y)
            .call(
                d3.drag()
                    .on('drag', this.handleDrag)
                    .on('end', this.handleDragComplete)
            )
    }
    centerStamp = () => {
        const { selectedPoint, pointData } = this.state;
        const copy = cloneDeep(pointData);

        if(copy.length){
            copy.push({x: 250, y: 200, id: ''})
        }

        select(this.node)
            .append('circle')
            .attr('class', 'circle-stamp')
            .attr('fill', 'rgb(106, 184, 197)')
            .attr('opacity', 0.7)
            .attr('r', '5')
            .attr('cx', 250)
            .attr('cy', 200)

        select(this.node)
            .selectAll('.line-shape')
            .attr('d', this.createPointString(copy))
    }
    clearStamps = () => {
        this.removeElement('line-stamp')
        this.removeElement('circle-stamp')
    }
    handleDrag = (event) => {
        const circleId = event && event.subject ? event.subject.id : '';
        const newX = event.x;
        const newY = event.y;
        let { pointData } = this.state;
        if(circleId){
            const pointCopy = pointData.map((point) => {
                if(point.id === circleId ){
                    return {x: newX, y: newY, id: point.id}
                } else {
                    return point
                }
            })
            this.removeElement('line-shape')
            select(this.node)
                .selectAll('.line-shape')
                .data([pointCopy])
                .enter()
                .append('path')
                .attr('class', 'line-shape')
                .attr('fill', 'rgb(106, 184, 197)')
                .attr('opacity', 0.5)
                .attr('stroke', 'black')
                .attr('d', obj => this.createPointString(obj))

            select(this.node)
                .selectAll('.circle-shape')
                .filter(obj => obj.id === circleId)
                .attr("cx", obj => {
                    return event.x
                })
                .attr("cy", event.y)
        }
    }
    handleDragComplete = (event) => {
        const circleId = event && event.subject ? event.subject.id : '';
        const newX = event.x;
        const newY = event.y;
        let { pointData } = this.state;

        if(circleId){
            const pointCopy = pointData.map((point) => {
                if(point.id === circleId ){
                    return {x: newX, y: newY, id: point.id}
                } else {
                    return point
                }
            })
            this.setState((state) => ({
                ...state,
                pointData: pointCopy
            }), () => {
                this.reloadCanvas();
            })
        }
    }

    setupEditMode = () => {
        const { pointData } = this.state;
        this.removeElement('circle-shape');
        this.removeElement('line-shape');

        select(this.node)
            .append('path')
            .attr('class', 'line-shape')
            .attr('fill', 'rgb(106, 184, 197)')
            .attr('stroke', 'rgb(106, 184, 197)')
            .attr('stroke-width', 3)
            .attr('opacity', 0.5)
            .attr('d', this.createPointString(pointData))

        d3.select(this.node)
            .selectAll('.circle-shape')
            .data(pointData)
            .enter()
            .append('circle')
            .attr('class', 'circle-shape')
            .attr('cursor', 'grab')
            .attr('fill', 'rgb(106, 184, 197)')
            .attr('r', '5')
            .attr('cx', obj => obj.x)
            .attr('cy', obj => obj.y)
            .call(
                d3.drag()
                    .on('drag', this.handleDrag)
                    .on('end', this.handleDragComplete)
            )
        this.clearStamps();
    }

    createPointString = (pointData) => {
        let string = '';
        if(pointData.length){
            pointData.map((point, index) => {
                const {x, y} = point;
                if(index === 0) {
                    string = `M ${x} ${y}`
                } else if (index === pointData.length - 1) {
                    // string = string.concat(` ${x} ${y} Z`)
                    string = string.concat(` L ${x} ${y}`)
                } else {
                    string = string.concat(` L ${x} ${y}`)
                }
            })
            return string;
        } else {
            return ''
        }
    }
    addShape = () => {
        let { pointData, action } = this.state;
        const pointCopy = cloneDeep(pointData)

        if(action === 'add'){
            this.removeElement('circle-shape');
            this.removeElement('line-shape');

            const newPoint = {
                x: this.stampX,
                y: this.stampY,
                id: uuid()
            }
    
            pointCopy.push(newPoint)
            const lineShape = d3.select(this.node)
                .selectAll('.line-shape');
            const circleShape = d3.select(this.node)
                .selectAll('.circle-shape');
    
            lineShape
                .data([pointCopy])
                .enter()
                .append('path')
                .attr('class', 'line-shape')
                .attr('fill', 'rgb(106, 184, 197)')
                .attr('stroke', 'rgb(106, 184, 197)')
                .attr('stroke-width', 3)
                .attr('opacity', 0.5)
                .attr('d', obj => this.createPointString(obj))
    
            circleShape
                .data(pointCopy)
                .enter()
                .append('circle')
                .attr('class', 'circle-shape')
                .attr('fill', 'rgb(106, 184, 197)')
                .attr('r', '5')
                .attr('cx', obj => obj.x)
                .attr('cy', obj => obj.y)
    
            this.setState((state) => ({
                ...state,
                pointData: pointCopy
            }))
        } else {

        }
    }
    toggleAction = (action) => {
        let { selectedPoint } = this.state;
        if(action === 'add'){
            selectedPoint = null
        } else {
            this.setupEditMode();
        }
        this.setState((state) => ({
            ...state,
            action,
            selectedPoint
        }))
    }
    handleSelectPoint = (id) => {
        const { selectedPoint } = this.state;

        select(this.node)
            .selectAll('.shape')
            .attr('fill', 'rgb(106, 184, 197)')

        if(selectedPoint !== id){
            select(this.node)
                .selectAll('.shape')
                .filter((obj) => obj.id === id)
                .attr('fill', 'yellow')
        }

        this.toggleAction('edit')

        this.setState((state) => ({
            ...state,
            selectedPoint: state.selectedPoint === id ? '' : id,
        }))
    }
    handleExpand = (id) => {
        let { expanded } = this.state;
        if(expanded.includes(id)){
            expanded = expanded.filter((x) => x !== id)
        } else {
            expanded.push(id)
        }
        this.setState((state) => ({
            ...state,
            expanded,
        }))
    }
    renderPointAccordion = (point, index) => {
        const active = false;
        const { selectedPoint, expanded } = this.state;
        const isSelected = selectedPoint === point.id; 
        const isActive = expanded.includes(point.id);
        return (
            <Menu.Item>
                <Accordion.Title
                    index={index}
                    style={{
                        border: '1px solid rgb(120,120,120)',
                        padding: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: index === 0 ? '5px 5px 0 0' : '0'
                    }}
                >
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <AccordionIcon
                            width='15px'
                            height='15px'
                            disabled={false}
                            onClick={() => this.handleExpand(point.id)}
                            icon={isActive ? 'minus' : 'plus'}
                        />
                        <div className='font-color' style={{marginLeft: '5px'}}>{`Point ${index} [${round(point.x)}, ${round(point.y)}]`}</div>
                    </div>
                    <AccordionIcon
                        width='15px'
                        height='15px'
                        disabled={false}
                        onClick={() => this.handleSelectPoint(point.id)}
                        color='teal'
                        hideIcon={!isSelected}
                        icon='check'
                    />
                </Accordion.Title>
                <Accordion.Content active={isActive} style={{margin: '0', padding: '0'}}>
                    <div  className='font-color' style={{height: '50px', width: '100%', background: 'yellow'}}></div>
                </Accordion.Content>
            </Menu.Item>
        )
    }
    renderPoints = () => {
        const { pointData } = this.state;
        return pointData.length ? (
            <Accordion >
                {pointData.map((point, index) => this.renderPointAccordion(point, index))}
            </Accordion>
        ) : (
            <Message
                style={{
                    backgroundColor: '#1b1c1d',
                    color: 'rgba(255,255,255,.9)',
                    margin: '0',
                    border: '1px solid rgb(120, 120, 120)'
                }}
                content='No Points'
            />
        )
    }
    leftMenu = () => {
        const { action } = this.state;
        return (
            <div style={{
                width: '300px',
                height: '100%',
            }}>
                <div style={{
                    width: '100%',
                    height: '100%'
                }}>
                    <div style={{
                        width: '100%',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Header className='font-color' style={{margin: '0', marginLeft: '10px'}}>Points</Header>
                        <div style={{
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <div 
                                onClick={() => this.toggleAction('edit')}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Icon name='trash' style={{margin: '0'}}/>
                            </div>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Icon name='edit' color={action === 'edit' ? 'yellow' : null} style={{margin: '0'}}/>
                            </div>
                            <div 
                                onClick={() => this.toggleAction('add')}
                            style={{
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Icon name='plus' color={action === 'add' ? 'yellow' : null} style={{margin: '0'}}/>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        width: '100%',
                        height: 'calc(100% - 40px)',
                        overflowY: 'scroll',
                        padding: '10px'
                    }}>
                        {this.renderPoints()}
                    </div>
                </div>
            </div>
        )
    }
    createToolbar = () => {
        return (
            <div style={{ 
                height: '40px', 
                display: 'flex',
                alignItems: 'center',

            }}>
                <div style={{
                    height: '40px',
                    width: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    borderBottom: '3px solid rgba(176, 176, 169, 0.5)'
                }}>
                    <Icon className='font-color' style={{margin: '0'}} name='crosshairs'/>
                </div>
            </div>
        )
    }
    renderCanvas = () => {
        const { canvasData } = this.props.canvas;
        const { fill } = canvasData;
        return (
            <div style={{
                width: '600px',
                height: '100%',
                backgroundColor: 'rgb(200,200,200)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <svg 
                    ref={node => this.node = node}
                    id='modal-canvas'
                    style={{
                        backgroundColor: fill, 
                        height: '400px', 
                        width: '500px',
                    }}
                />
            </div>
        )
    }
    render(){
        return (
            <div className='dark-1' style={{
                width: '100%',
                height: '100%',
            }}>
                <div style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    {this.createToolbar()}
                    <div style={{ height: '520px', display: 'flex'}}>
                        {this.leftMenu()}
                        {this.renderCanvas()}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        canvas: state.canvas
    }
}

export default connect(mapStateToProps)(ShapePointsPane);
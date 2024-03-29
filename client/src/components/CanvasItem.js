import React, {Component} from 'react';
import {select} from 'd3-selection';
import {Icon, Header} from 'semantic-ui-react'
import Carousel, { consts } from 'react-elastic-carousel'
import { setCanvasData } from '../actions/canvas/canvasActions';
import CustomPopupConfirm from './CustomPopupConfirm';
import {connect} from 'react-redux';
import CanvasAPI from '../api/canvasApi';

const canvasApi = new CanvasAPI();


class CanvasItem extends Component {
    constructor(props){
        super(props);
    }
    componentDidMount(){
        // this.setupCanvas();
        this.loadShapes();
    }
    componentDidUpdate(prevProps){
        if(prevProps.chamberId !== this.props.chamberId){
            this.loadShapes();
        }
        if(prevProps.canvas !== this.props.canvas){
            this.loadShapes();
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
    loadShapes = () => {
        const { shapeList } = this.props.canvas;

        select(this.node)
            .selectAll('.shape')
            .remove();
        const shapeSelector = select(this.node)
            .selectAll('.shape');

        shapeList.map((shapeItem) => {
            switch(shapeItem.type){
                case 'Square':
                    shapeSelector
                        .data([shapeItem])
                        .enter()
                        .append('rect') 
                        .attr('class', 'shape')
                        .attr('fill', shape => shape.fill)
                        .attr('fill-opacity', shape => shape.opacity)
                        .attr('stroke', shape => shape.stroke)
                        .attr('stroke-width', shape => shape.strokeWidth)
                        .attr('width', shape => shape.width)
                        .attr('height', shape => shape.height)
                        .attr('x', shape => shape.posX)
                        .attr('y', shape => shape.posY)
                        break;
                case 'Circle':
                    shapeSelector
                        .data([shapeItem])
                        .enter()
                        .append('circle') 
                        .attr('class', 'shape')
                        .attr('fill', shape => shape.fill)
                        .attr('fill-opacity', shape => shape.opacity)
                        .attr('stroke', shape => shape.stroke)
                        .attr('stroke-width', shape => shape.strokeWidth)
                        .attr('r', shape => shape.radius)
                        .attr('cx', shape => shape.posX)
                        .attr('cy', shape => shape.posY)
                    break;
                case 'Line':
                    shapeSelector
                        .data([shapeItem])
                        .enter()
                        .append('path')
                        .attr('class', 'shape')
                        .attr('stroke', obj => obj.stroke)
                        .attr('opacity', obj => obj.opacity)
                        .attr('fill', obj => obj.fill)
                        .attr('stroke-width', obj => obj.strokeWidth)
                        .attr('d', obj => obj.points)
                    break;    
                default:
                    break;
            }
        })
        
    }
    editCanvas = async () => {
        const { canvas } = this.props;
        const response = await canvasApi.fetchCanvas(canvas._id)
        this.props.dispatch(setCanvasData(response))
        this.props.history.push(`/canvas/${response._id}`)
    }
    deleteCanvas = async () => {
        const { canvas } = this.props;
        try {
            await canvasApi.deleteCanvas(canvas._id)
            this.props.fetchCanvasList();
            this.props.addNotification({
                type: 'success',
                message: 'Successfully deleted canvas!'
            })
        } catch (error) {
            console.log(error)
        }
    }
    topMenu = () => {
        const title = this.props.canvas.info ? this.props.canvas.info.title : ''
        return (
            <div style={{
                height: '50px', 
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '20px',
                color: 'white'
            }}>
                <Header style={{color: 'white'}}>{title}</Header>
            </div>
        )
    }
    bottomMenu = () => {
        return (
            <div 
                style={{
                    width: '100%', 
                    height: '50px', 
                    display: 'flex',
                    padding: '0 20px',
                    alignItems: 'center',
                    justifyContent: 'flex-end'
                }}>
                    <CustomPopupConfirm
                        trigger={
                            <div 
                                style={{
                                    height: '100%', 
                                    width: '40px', 
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Icon name='trash' size='large' color='teal'style={{padding: '0', margin: '0'}}/>
                            </div>
                        }
                        position='top center'
                        onConfirm={this.deleteCanvas}
                        content='Are you sure you want to delete canvas?'
                    />
                    <div 
                        onClick={this.editCanvas}
                        style={{
                            height: '100%', 
                            width: '40px', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Icon name='cogs' size='large' color='teal'style={{padding: '0', margin: '0'}}/>
                    </div>
            </div>
        )
    }
    // leftMenu = () => {
    //     return (
    //         <div style={{height: '100%', width: '40px'}}></div>
    //     )
    // }
    // rightMenu = () => {
    //     return (
    //         <div style={{height: '100%', width: '40px'}}></div>
    //     )
    // }
    render(){
        const { canvasData } = this.props.canvas;
        const { width, height, fill, opacity } = canvasData;
        const fillArr = fill.split(',')
        // ['rgb(0','0','0',')']
        const style = {
            backgroundColor: fill,
            height: `400px`,
            margin: '0 50px',
            padding: '0'
        }
        const viewBox = [ 0, 0, width, height ]
        return (
            <div 
                style={{
                    height: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    backgroundColor: '#1b1c1d', 
                    margin: '10px', 
                    padding: '0', 
                    borderRadius: '5px'
                }}>
                {this.topMenu()}
                <div style={{height: `calc(100% - 70px)`, display: 'flex'}}>
                    {/* {this.leftMenu()} */}
                    <svg className='canvas-item' viewBox={viewBox} style={style} ref={node => (this.node = node)}/>
                    {/* {this.rightMenu()} */}
                </div>
                {this.bottomMenu()}
            </div>
        )
    }
}

export default connect()(CanvasItem);
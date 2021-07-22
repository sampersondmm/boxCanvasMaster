import React, {Component} from 'react';
import {connect} from 'react-redux';
import LeftPanel from './leftPanel/LeftPanel';
import Size from '../../constants/size';
import { Modal, Menu, Tab, Card } from 'semantic-ui-react';
import ShapeCanvas from './ShapeCanvas'
import RightMenu from './rightMenu/RightMenu';
import NavBar from '../NavBar';
import {addShapeToCanvas, createCanvas, clearCanvasData} from '../../actions/canvasActions';

class Canvas extends Component {
    constructor(props){
        super(props);
        this.state = {
            rightPanelOpen: false,
            leftPanelOpen: false
        }
        this.handleRightMenu = this.handleRightMenu.bind(this);
        this.handleLeftMenu = this.handleLeftMenu.bind(this);
        this.addShape = this.addShape.bind(this);
        this.determineWidth = this.determineWidth.bind(this);
        this.createCanvas = this.createCanvas.bind(this);
    }
    handleRightMenu(){
        this.setState(state => ({
            ...state,
            rightPanelOpen: !state.rightPanelOpen
        }))
    }
    componentDidMount(){
        this.props.dispatch(clearCanvasData())
    }
    handleLeftMenu(){
        this.setState(state => ({
            ...state,
            leftPanelOpen: !state.leftPanelOpen
        }))
    }
    addShape(newShape){
        this.props.dispatch(addShapeToCanvas(newShape))
    }
    createCanvas(){
        this.props.dispatch(createCanvas(this.props.canvas.canvasData))
    }
    determineWidth(){
        const {rightPanelOpen, leftPanelOpen} = this.state;
        let width = null;
        if(rightPanelOpen && !leftPanelOpen){
            width = (Size.sidePanelWidth*2) + Size.sidePanelMenuWidth;
        }
        if(!rightPanelOpen && leftPanelOpen){
            width = (Size.sidePanelWidth*2) + Size.sidePanelMenuWidth;
        }
        if(!rightPanelOpen && !leftPanelOpen){
            width =  Size.sidePanelWidth * 2;
        } 
        if(rightPanelOpen && leftPanelOpen){
            width = (Size.sidePanelWidth + Size.sidePanelMenuWidth) * 2;
        }
        return width;
    }
    render(){
        const {canvasData} = this.props.canvas, 
            width = this.determineWidth(),
            style = {
                canvasDisplay: {
                    height: `calc(100vh - ${Size.topPanelHeight}px)`,
                },
                canvasDisplayInner: {
                    width: `calc(100vw - ${width}px)`,
                    height: `calc(100vh - ${Size.topPanelHeight}px)`,
                    left: `${this.state.leftPanelOpen ? Size.sidePanelWidth + Size.sidePanelMenuWidth : Size.sidePanelWidth}px`,
                    top: '0'
                }
            };
        
        return(
            <div className='canvas-wrap'>
                <NavBar/>
                <div className='canvas-display' style={{height: 'calc(100vh - 50px)'}}>
                    <LeftPanel
                        handleMenu={this.handleLeftMenu}
                        isOpen={this.state.leftPanelOpen}
                        addShape={this.addShape}
                        canvasData={canvasData}
                    />
                    <div className='canvas-display-inner'>
                        <ShapeCanvas 
                            addShape={this.addShape}
                        />
                    </div>
                    {/* <RightPanel
                        canvasData={canvasData}
                        handleMenu={this.handleRightMenu}
                        isOpen={this.state.rightPanelOpen}
                    /> */}
                        <RightMenu
                            width={`${Size.sidePanelMenuWidth + 100}px`}
                            shapeList={canvasData.shapeList}
                        />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const {canvas} = state;
    return {
        ...state,
        canvas
    }
}

export default connect(mapStateToProps)(Canvas);
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Size from '../../constants/size';
import ShapeCanvas from './ShapeCanvas'
import CustomMenu from './customMenu/CustomMenu';
import NavBar from '../NavBar';
import { addShapeToCanvas } from '../../actions/canvas/canvasActions';
import CanvasAPI from '../../api/canvasApi';

const canvasApi = new CanvasAPI();

class Canvas extends Component {
    constructor(props){
        super(props);
        this.state = {
            rightPanelOpen: false,
            leftPanelOpen: false,
            leftPanes: [
                {
                    type: 'shape',
                    icon: 'circle'
                }, 
                {
                    type: 'layers',
                    icon: 'cogs'
                },
            ],
            rightPanes: [
                {
                    type: 'layers',
                    icon: 'list'
                },
                {
                    type: 'settings',
                    icon: 'cogs'
                },
            ],
        }
    }
    componentDidUpdate(prevProps){
        if(prevProps.canvasId !== this.props.canvasId){
            this.fetchCanvasData();
        }
    }
    handleRightMenu = () => {
        this.setState(state => ({
            ...state,
            rightPanelOpen: !state.rightPanelOpen
        }))
    }
    handleLeftMenu = () => {
        this.setState(state => ({
            ...state,
            leftPanelOpen: !state.leftPanelOpen
        }))
    }
    addShape = (newShape) => {
        this.props.dispatch(addShapeToCanvas(newShape))
    }
    determineWidth = () => { 
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
        const {shapeList} = this.props.canvas;
        const { leftPanes, rightPanes } = this.state;
        const width = 350;
        const newCanvas = true;
        
        return(
            <div className='canvas-wrap'>
                <NavBar {...this.props}/>
                <div className='canvas-display' style={{height: 'calc(100vh - 50px)'}}>
                    <CustomMenu
                        location='main'
                        panes={leftPanes}
                        newCanvas={newCanvas}
                        width={width}
                        addNotification={this.props.addNotification}
                        canvasData={shapeList}
                        shapeList={shapeList}
                    />
                    <div className='canvas-display-inner' style={{width:`calc(100vw - ${width * 2}px)`}}>
                        <ShapeCanvas 
                            idFromUrl={this.props.idFromUrl}
                            addShape={this.addShape}
                        />
                    </div>
                    <CustomMenu
                        location='main'
                        panes={rightPanes}
                        actions={[{type: 'save', icon:'save'}]}
                        newCanvas={newCanvas}
                        width={width}
                        addNotification={this.props.addNotification}
                        canvasData={shapeList}
                        shapeList={shapeList}
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
        canvas,
    }
}

export default connect(mapStateToProps)(Canvas);
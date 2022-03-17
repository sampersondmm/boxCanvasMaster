import React, {Component} from 'react';
import {connect} from 'react-redux';
import Size from '../../constants/size';
import ShapeCanvas from './ShapeCanvas';
import CustomMenu from './customMenu/CustomMenu';
import { Modal, Icon } from 'semantic-ui-react';
import NavBar from '../NavBar';
import CanvasNavbar from './CanvasToolbar';
import { addShapeToCanvas } from '../../actions/canvas/canvasActions';
import CanvasAPI from '../../api/canvasApi';

const canvasAPI = new CanvasAPI();

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
    createCanvas = async () => {
        let response = {};
        const { userProfile, canvas } = this.props;
        try {
            response = await canvasAPI.createCanvas(canvas, userProfile._id);
                this.props.addNotification({
                    type: 'success',
                    message: 'Successfully created a new canvas!'
                })
        } catch (error) {
            console.log(error)
        }
    }
    updateCanvas = async () => {
        let response = {};
        const { userProfile, canvas } = this.props;
        try {
            response = await canvasAPI.updateCanvas(canvas, userProfile._id);
                this.props.addNotification({
                    type: 'success',
                    message: 'Successfully edited canvas!'
                })
        } catch (error) {
            console.log(error)
        }
    }

    saveCanvas = async () => {
        const { canvasId } = this.props;
        if(canvasId){
            this.updateCanvas();
        } else {
            this.createCanvas();
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
                <CanvasNavbar
                    saveCanvas={this.saveCanvas}
                />
                <div className='canvas-display' style={{height: 'calc(100vh - 90px)'}}>
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
    const {canvas, user } = state;
    return {
        ...state,
        userProfile: user.userProfile,
        canvasId: canvas._id,
        canvas,
    }
}

export default connect(mapStateToProps)(Canvas);
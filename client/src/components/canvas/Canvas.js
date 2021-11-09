import React, {Component} from 'react';
import {connect} from 'react-redux';
import LeftPanel from './leftPanel/LeftPanel';
import Size from '../../constants/size';
import { Modal, Menu, Tab, Card } from 'semantic-ui-react';
import ShapeCanvas from './ShapeCanvas'
import CustomMenu from './customMenu/CustomMenu';
import NavBar from '../NavBar';
import ShapeMenu from '../canvas/customMenu/ShapeMenu';
import LayerMenu from '../canvas/customMenu/LayerMenu';
import {addShapeToCanvas, clearCanvasData, createCanvas, setCanvasData} from '../../actions/canvasActions';
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
        this.handleRightMenu = this.handleRightMenu.bind(this);
        this.handleLeftMenu = this.handleLeftMenu.bind(this);
        this.addShape = this.addShape.bind(this);
        this.determineWidth = this.determineWidth.bind(this);
        this.createCanvas = this.createCanvas.bind(this);
    }
    componentDidMount(){
        this.fetchCanvasData();
        console.log('MOUNTED')
    }
    componentDidUpdate(prevProps){
        if(prevProps.canvasId !== this.props.canvasId){
            this.fetchCanvasData();
        }
    }
    handleRightMenu(){
        this.setState(state => ({
            ...state,
            rightPanelOpen: !state.rightPanelOpen
        }))
    }
    fetchCanvasData = async () => {
        const { currentCanvasId } = this.props;
        // if(currentCanvasId){
        //     try {
        //         const response = await canvasApi.fetchCanvas(currentCanvasId)
        //         this.props.dispatch(setCanvasData(response));
        //     } catch (error) {
        //         console.log(error)
        //     }
        // } else {
        //     this.props.dispatch(clearCanvasData())
        // }
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
        const {shapeList} = this.props.canvas;
        const { leftPanes, rightPanes } = this.state;
        const width = 350;
        const newCanvas = true;
        
        return(
            <div className='canvas-wrap'>
                <NavBar {...this.props}/>
                <div className='canvas-display' style={{height: 'calc(100vh - 50px)'}}>
                    {/* <LeftPanel
                        handleMenu={this.handleLeftMenu}
                        isOpen={this.state.leftPanelOpen}
                        addShape={this.addShape}
                        canvasData={canvasData}
                    /> */}
                    <CustomMenu
                        location='main'
                        panes={leftPanes}
                        newCanvas={newCanvas}
                        width={width}
                        addNotification={this.props.addNotification}
                        canvasData={shapeList}
                        shapeList={shapeList}
                    />
                    <div className='canvas-display-inner' style={{width:`calc(100vw - ${width * 2}px)`, border: '2px solid red'}}>
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
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Common from '../../../constants/common';
import PanelButton from '../PanelButton';
import CreateCollection from './CreateCollection';
import SetupCanvas from '../SetupCanvas';
import { Menu, Icon } from 'semantic-ui-react';
import {setCanvasSize} from '../../../actions/canvas/canvasActions';
import TooltipPositions from '../../../constants/tooltips';

class LeftPanel extends Component {
    constructor(props){
        super(props);
        this.state = {
            setup: false,
            selectShape: false,
            shapeMenuOpen: false
        }
        this.controlMenu = this.controlMenu.bind(this);
        this.setCanvasSize = this.setCanvasSize.bind(this);
        this.handleMenus = this.handleMenus.bind(this);
    }
    controlMenu(value){
        this.setState(state => ({   
            ...state,
            isOpen: value 
        }))
    }
    handleMenus(){
        this.props.handleMenu();
    }
    handleShapeSelection(select){
        this.setState(state => ({
            ...state,
            selectShape: select
        }))
    }
    setCanvasSize(width, height){
        this.props.dispatch(setCanvasSize(Number(width), Number(height)))
        this.setState(state => ({
            ...state,
            setup: false,
            canvasWidth: width ? width : this.props.width,
            canvasHeight: height ? height : this.props.height
         }))
    }
    closeShapeMenu = () => {
        this.setState(state => ({
            ...state,
            shapeMenuOpen: false
        }))
    }
    render(){
        const { shapeMenuOpen } = this.state;
        const {canvasData} = this.props;
        return (
            // <div className='left-panel'>
            <Menu vertical icon inverted attached='left'>
                <PanelButton 
                    tooltip={Common.stamp}
                    type={Common.sidePanel}
                    tooltipPosition={TooltipPositions.left}
                    onClick={() => this.handleShapeSelection(false)}
                    fa={true}
                    icon='fas fa-stamp'
                />
                <PanelButton 
                    tooltip={Common.selectCurrentShape}
                    type={Common.sidePanel}
                    tooltipPosition={TooltipPositions.left}
                    onClick={() => this.handleShapeSelection(true)}
                    icon='hand pointer outline'
                />
                <PanelButton 
                    tooltip={Common.shapes}
                    type={Common.sidePanel}
                    tooltipPosition={TooltipPositions.left}
                    onClick={() => {
                        this.setState(state => ({
                            ...state,
                            shapeMenuOpen: true
                        }))
                    }}
                    icon='clone outline'

                />
                <PanelButton 
                    tooltip={Common.colorPalette}
                    type={Common.sidePanel}
                    tooltipPosition={TooltipPositions.left}
                    onClick={() => {
                        this.setState(state => ({
                            ...state,
                            shapeMenuOpen: true
                        }))
                    }}
                    icon='fas fa-palette'
                    fa={true}
                />
                <CreateCollection
                    open={shapeMenuOpen}
                    addShape={this.props.addShape}
                    canvasData={this.props.canvasData}
                    closeModal={this.closeShapeMenu}
                />
            </Menu>
        )
    }
}

export default LeftPanel;
import React, {Component} from 'react';
import {connect} from 'react-redux';
import ColorPicker from '../ColorPicker';
import Common from '../../../constants/common';
import PanelButton from '../PanelButton';
import { Modal, Step, Icon, Button, Card, Header } from 'semantic-ui-react';
import Size from '../../../constants/size';
import {changeShapeColor, changeShapeType, changeShapeWidth, changeShapeHeight, changeShapeRadius, selectShape, changeBackgroundColor} from '../../../actions/canvasActions';
import map from 'lodash/map';
import {MenuTypes} from '../BaseMenu';
import TooltipPositions from '../../../constants/tooltips';
import {store} from '../../..';
import Carousel, { consts } from 'react-elastic-carousel';
import ShapeMenu from '../topPanel/ShapeMenu';
import ShapeCollectionCanvas from '../ShapeCollectionCanvas';

class ShapeMenuModal extends Component {
    constructor(props){
        super(props);
        this.menuType = MenuTypes.sideMenu
        this.state = {
            status: Common.shape,
            dirty: false,
            currentStep: 0,
            totalSteps: 4,
            open: false,
        }
    }
    renderArrow = ({ type, onClick, isEdge }) => {
        const pointer = type === consts.PREV ? (
            <div style={{height: '100%', display: 'flex', alignItems: 'center'}}>
                <Icon name='angle left' onClick={onClick}/>
            </div>
        ) : (
            <div style={{height: '100%', display: 'flex', alignItems: 'center'}}>
                <Icon name='angle right' onClick={onClick}/>
            </div>
        )
        return pointer;
      }
    shapeDisplay = () => {
        const { canvasData } = this.props;
        return <ShapeCollectionCanvas
            addShape={this.props.addShape}
            canvas={canvasData}
        />
    }
    createSteps = () => {
        const {canvasData} = this.props;
        const { currentStep } = this.state;
        switch(currentStep){
            case 0:
                return this.shapeDisplay();  
            default:
                return null
        }
    }
    previousStep = () => {
        this.setState(state => ({
            ...state,
            currentStep: state.currentStep > 0 ? state.currentStep - 1 : 0
        }))
    }
    nextStep = () => {
        this.setState(state => ({
            ...state,
            currentStep: state.currentStep < state.totalSteps - 1 ? state.currentStep + 1 : state.totalSteps - 1
        }))
    }
    closeModal = () => {
        this.setState(state => ({
            ...state,
            open: false
        }))
    }
    render(){
        const {currentStep, totalSteps } = this.state; 
        const { open } = this.props;
        return (
                <Modal
                    open={open}
                    style={{position: 'relative', height: 'auto'}}
                    trigger={this.props.trigger}
                >
                    <Modal.Header>Create Shape</Modal.Header>
                    <Modal.Content style={{
                        display: 'flex', 
                        flexDirection: 'column', 
                        height: '550px',
                        justifyContent: 'space-between',
                    }}>
                        <div style={{width: '100%', height: '100%', alignItems: 'flex-start', display: 'flex'}}>
                            <div style={{width: '200px', height: '100%', width: '70%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                {this.shapeDisplay()}

                            </div>
                            <div style={{width: '300px', height: '450px', overflowY: 'scroll', overflowX: 'hidden'}}>
                                <ShapeMenu 
                                    canvasData={this.props.canvasData}
                                    modal={true}
                                />
                            </div>
                        </div>
                        <div style={
                            {
                                width: '100%', 
                                height: '45px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }
                        }>
                            <div>
                                <Button
                                    content='Cancel'
                                    onClick={this.props.closeModal}
                                />
                            </div>
                            <div style={{display: 'flex'}}>
                                <Button
                                    content='Back'
                                    onClick={this.previousStep}
                                />
                                <Button
                                    primary
                                    onClick={this.nextStep}
                                    content={currentStep < totalSteps - 1 ? 'Next' : 'Submit'}
                                />
                            </div>
                        </div>
                    </Modal.Content>
                </Modal>
        )
    }
}


export default ShapeMenuModal;
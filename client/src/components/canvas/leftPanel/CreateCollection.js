import React, {Component} from 'react';
import {connect} from 'react-redux';
import ColorPicker from '../ColorPicker';
import Common from '../../../constants/common';
import PanelButton from '../PanelButton';
import { Modal, Step, Icon, Button, Card, Header } from 'semantic-ui-react';
import Size from '../../../constants/size';
import {changeShapeColor, addShapeToCollection, changeShapeType, changeShapeWidth, changeShapeHeight, changeShapeRadius, selectShape, changeBackgroundColor} from '../../../actions/canvasActions';
import map from 'lodash/map';
import {MenuTypes} from '../BaseMenu';
import TooltipPositions from '../../../constants/tooltips';
import {store} from '../../..';
import ShapeMenu from '../rightMenu/ShapeMenu';
import ShapeCollectionCanvas from '../ShapeCollectionCanvas';

class CreateCollection extends Component {
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
    addShapeToCollection = (newShape) => {
        const { canvasData } = this.props;
        store.dispatch(addShapeToCollection(newShape))
    }
    shapeDisplay = () => {
        const { canvasData } = this.props;
        return <ShapeCollectionCanvas
            addShape={this.addShapeToCollection}
            canvas={canvasData}
        />
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
        const { open, canvasData } = this.props;
        return (
                <Modal
                    open={open}
                    style={{position: 'relative', height: 'auto', height: '650px'}}
                    trigger={this.props.trigger}
                >
                    <Modal.Header>Create Shape</Modal.Header>
                    <Modal.Content style={{
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'space-between',
                    }}>
                        <div style={{width: '100%', height: '100%', alignItems: 'flex-start', display: 'flex'}}>
                            <div style={{ height: '495px', width: '70%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgb(220,220,220)'}}>
                                <ShapeCollectionCanvas
                                    open={open}
                                    addShape={this.addShapeToCollection}
                                    canvas={canvasData}
                                />

                            </div>
                            <div style={{width: '250px'}}>
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


export default CreateCollection;
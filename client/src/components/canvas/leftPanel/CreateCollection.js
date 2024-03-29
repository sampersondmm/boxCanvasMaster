import React, {Component} from 'react';
import {connect} from 'react-redux';
import Common from '../../../constants/common';
import { Modal, Button} from 'semantic-ui-react';
import {addShapeToCollection, createCollection} from '../../../actions/canvas/canvasActions';
import ShapeMenu from '../customMenu/CustomMenu';
import ShapeCollectionCanvas from '../ShapeCollectionCanvas';

class CreateCollection extends Component {
    constructor(props){
        super(props);
        this.state = {
            status: Common.shape,
            dirty: false,
            currentStep: 0,
            totalSteps: 4,
            open: false,
        }
    }
    createCollection = () => {
        const { shapeList } = this.props;
        this.props.dispatch(createCollection(shapeList))
    }
    addShapeToCollection = (newShape) => {
        this.props.dispatch(addShapeToCollection(newShape))
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
        const { open, collectionCanvasData } = this.props;
        return (
                <Modal
                    open={open}
                    style={{position: 'relative', height: 'auto', height: '650px'}}
                    trigger={this.props.trigger}
                >
                    <Modal.Header>Create Shape Collection</Modal.Header>
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
                                />

                            </div>
                            <div style={{width: '250px'}}>
                                <ShapeMenu 
                                    canvasData={this.props.canvasData}
                                    shapeList={collectionCanvasData.collectionList}
                                    modal={true}
                                />
                            </div>
                        </div>
                        <div style={
                            {
                                width: '100%', 
                                height: '45px',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center'
                            }
                        }>
                            <div style={{display: 'flex', marginTop: '10px'}}>
                                <Button
                                    content='Cancel'
                                    onClick={this.props.closeModal}
                                />
                                <Button
                                    primary
                                    onClick={this.createCollection}
                                    content='Create'
                                />
                            </div>
                        </div>
                    </Modal.Content>
                </Modal>
        )
    }
}


const mapStateToProps = state => {
    const {collectionCanvasData} = state.canvas;
    return {
        ...state,
        collectionCanvasData
    }
}

export default connect(mapStateToProps)(CreateCollection);
import React, {Component} from 'react';
import { Icon, Menu, Input } from 'semantic-ui-react';
import { changeShapeRotation } from '../../../../actions/canvas/editorActions';
import Common from '../../../../constants/common';
import {connect} from 'react-redux';
import AccordionCard from '../../../AccordionCard';
import CustomInput from './CustomInput';

class ShapeRotationCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            rotationIncrement: 5
        }
    }

    handleRotationChange = (data) => {
        this.props.dispatch(changeShapeRotation(data.value))
    }
    handleChangeRotationIncrement = (data) => {
        this.setState(state => ({
            ...state,
            rotationIncrement: parseInt(data.value, 10)
        }))
    }

    incrementRotation = (value) => {
        const { currentShape } = this.props;
        const { rotationIncrement } = this.state;
        let newRotation = 0;
        if(value === 'down'){
            let updatedRotation = currentShape.rotation - rotationIncrement;
            //goes below 0
            if(updatedRotation < 0) {
                newRotation = 360 - Math.abs(updatedRotation);
            } else {
                newRotation = updatedRotation;
            }
        } else {
            let updatedRotation = currentShape.rotation + rotationIncrement;
            //goes below 0
            if(updatedRotation >= 360) {
                newRotation = updatedRotation - 360;
            } else {
                newRotation = updatedRotation;
            }
        }
        this.props.dispatch(changeShapeRotation(newRotation))
    }

    cardContent = () => {
        const { rotationIncrement } = this.state;
        const { inverted, currentShape } = this.props;
        return (
            <Menu.Menu inverted={inverted} vertical >
                <CustomInput
                    value={currentShape.rotation}
                    type='number'
                    label={Common.rotation}
                    placeholder={`${Common.rotation}...`}
                    onChange={this.handleRotationChange}
                    onIncrement={this.incrementRotation}
                    useIncrement={true}
                />
                <CustomInput
                    value={rotationIncrement}
                    type='number'
                    label={Common.increment}
                    placeholder={`${Common.increment}...`}
                    onChange={this.handleChangeRotationIncrement}
                    useIncrement={false}
                />
            </Menu.Menu>
        )
    }

    render(){
        const { open, selected, handleSelect } = this.props;
        return (
            <AccordionCard
                open={open}
                selected={selected === Common.rotaion}
                handleSelect={handleSelect}
                handleOpen={this.props.handleOpen}
                header={Common.rotation}
                index={4}
                content={this.cardContent()}
            />
        )
    }
}

const mapStateToProps = (state) => {
    const { editor, canvasData } = state.canvas;
    return {
        canvasData,
        currentShape: editor.currentShape
    }
}

export default connect(mapStateToProps)(ShapeRotationCard);
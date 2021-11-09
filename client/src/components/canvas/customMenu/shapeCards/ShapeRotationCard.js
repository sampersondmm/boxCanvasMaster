import React, {Component} from 'react';
import { Icon, Menu, Input, Accordion} from 'semantic-ui-react';
import { changeShapeRotation } from '../../../../actions/canvasActions';
import Common from '../../../../constants/common';
import AccordianCard from '../../../AccordionCard';
import {connect} from 'react-redux';
import AccordionCard from '../../../AccordionCard';

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
        const { square } = this.props.currentShape;
        const { rotationIncrement } = this.state;
        let newRotation = 0;
        if(value === 'down'){
            let updatedRotation = square.rotation - rotationIncrement;
            //goes below 0
            if(updatedRotation < 0) {
                newRotation = 360 - Math.abs(updatedRotation);
            } else {
                newRotation = updatedRotation;
            }
        } else {
            let updatedRotation = square.rotation + rotationIncrement;
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
        const { inverted } = this.props;
        const { square } = this.props.currentShape;
        return (
            <Menu.Menu inverted={inverted} vertical >
                <Menu.Item style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: '0'}}>
                    <Icon name='minus' style={{cursor: 'pointer', margin: '0'}} onClick={() => this.incrementRotation('down')}/>
                    <Menu.Header style={{margin: '0'}}>{Common.rotation}</Menu.Header>
                    <Icon name='plus' style={{cursor: 'pointer', margin: '0'}} onClick={() => this.incrementRotation('up')}/>
                </Menu.Item>
                <Menu.Item>
                    <Input
                        inverted={inverted}
                        type='number'
                        min={0}
                        max={360}
                        value={square.rotation}
                        onChange={(e, data) => this.handleRotationChange(data, Common.rotation)}
                        placeholder='Rotation...'
                    />
                </Menu.Item>
                <Menu.Item>
                    <Menu.Header>Increment</Menu.Header>
                        <Input
                            inverted={inverted}
                            type='number'
                            value={rotationIncrement}
                            onChange={(e, data) => this.handleChangeRotationIncrement(data)}
                            placeholder='Increment...'
                        />
                </Menu.Item>
            </Menu.Menu>
        )
    }

    render(){
        const { open, selection, handleSelect } = this.props;
        return (
            <AccordionCard
                open={open}
                selection={selection}
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
    const { currentShape, canvasData } = state.canvas;
    return {
        canvasData,
        currentShape
    }
}

export default connect(mapStateToProps)(ShapeRotationCard);
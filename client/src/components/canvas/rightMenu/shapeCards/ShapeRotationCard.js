import React, {Component} from 'react';
import { Icon, Menu, Input, Accordion} from 'semantic-ui-react';
import { changeShapeRotation } from '../../../../actions/canvasActions';
import Common from '../../../../constants/common';
import {connect} from 'react-redux';

class ShapeSizeCard extends Component {
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
        const { shapeRotation } = this.props.currentShape;
        const { rotationIncrement } = this.state;
        const newValue = value === 'down' ? (shapeRotation - rotationIncrement <= 0 ? 0 : shapeRotation - rotationIncrement) : shapeRotation + rotationIncrement;
        this.props.dispatch(changeShapeRotation(newValue))
    }

    render(){
        const { rotationIncrement } = this.state;
        const { open, inverted } = this.props;
        const { shapeRotation } = this.props.currentShape;
        return (
            <Menu.Item textAlign='center' className='shape-accordian-option' >
                <Accordion.Title
                    index={3}
                    onClick={this.props.handleOpen}
                    >
                    <Icon name={open ? 'plus' : 'minus'} />
                    {Common.rotation}
                </Accordion.Title>
                <Accordion.Content active={open}>
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
                                value={shapeRotation}
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
                </Accordion.Content>
            </Menu.Item>
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

export default connect(mapStateToProps)(ShapeSizeCard);
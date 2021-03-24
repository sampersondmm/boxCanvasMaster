import React, {Component} from 'react';
import { Icon, Menu, Input, Accordion} from 'semantic-ui-react';
import { 
    changeShapeRadius, 
    changeShapeWidth, 
    changeShapeHeight
} from '../../../../actions/canvasActions';
import Common from '../../../../constants/common';
import {connect} from 'react-redux';

class ShapeSizeCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            sizeIncrement: 20,
            radiusIncrement: 20,
        }
    }

    handleSizeChange = (data, type) => {
        const value = parseInt(data.value, 10)
        switch(type){
            case Common.width:
                this.props.dispatch(changeShapeWidth(value));
                break;
            case Common.height:
                this.props.dispatch(changeShapeHeight(value));
                break;
            case Common.radius:
                this.props.dispatch(changeShapeRadius(value));
                break;
        }
    }
    incrementWidth = (value) => {
        const { shapeWidth } = this.props.currentShape;
        const { sizeIncrement } = this.state;
        const newValue = value === 'down' ? (shapeWidth - sizeIncrement <= 0 ? 0 : shapeWidth - sizeIncrement) : shapeWidth + sizeIncrement;
        this.props.dispatch(changeShapeWidth(newValue))
    }
    incrementHeight = (value) => {
        const { shapeHeight } = this.props.currentShape;
        const { sizeIncrement } = this.state;
        const newValue = value === 'down' ? (shapeHeight - sizeIncrement <= 0 ? 0 : shapeHeight - sizeIncrement) : shapeHeight + sizeIncrement;
        this.props.dispatch(changeShapeHeight(newValue))
    }
    incrementRadius = (value) => {
        const { shapeRadius } = this.props.currentShape;
        const { sizeIncrement } = this.state;
        const newValue = value === 'down' ? (shapeRadius - sizeIncrement <= 0 ? 0 : shapeRadius - sizeIncrement) : shapeRadius + sizeIncrement;
        this.props.dispatch(changeShapeRadius(newValue))
    }
    handleChangeRadiusIncrement = (data) => {
        this.setState(state => ({
            ...state,
            radiusIncrement: parseInt(data.value, 10)
        }))
    }
    handleChangeSizeIncrement = (data) => {
        this.setState(state => ({
            ...state,
            sizeIncrement: parseInt(data.value, 10)
        }))
    }

    render(){
        const { open, inverted } = this.props;
        const { sizeIncrement, radiusIncrement } = this.state;
        const { shapeType, shapeWidth, shapeHeight, shapeRadius } = this.props.currentShape;
        return (
            <Menu.Item textAlign='center' className='shape-accordian-option' >
                <Accordion.Title
                    index={3}
                    onClick={this.props.handleOpen}
                    >
                    <Icon name={open ? 'plus' : 'minus'} />
                    {Common.size}
                </Accordion.Title>
                <Accordion.Content active={open}>
                    {shapeType === Common.square && (
                        <Menu.Menu inverted={inverted} vertical >
                            <Menu.Item style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: '0'}}>
                                <Icon name='minus' style={{cursor: 'pointer', margin: '0'}} onClick={() => this.incrementWidth('down')}/>
                                <Menu.Header style={{margin: '0'}}>{Common.width}</Menu.Header>
                                <Icon name='plus' style={{cursor: 'pointer', margin: '0'}} onClick={() => this.incrementWidth('up')}/>
                            </Menu.Item>
                            <Menu.Item>
                                <Input
                                    inverted={inverted}
                                    type='number'
                                    value={shapeWidth}
                                    onChange={(e, data) => this.handleSizeChange(data, Common.width)}
                                    placeholder='Width...'
                                />
                            </Menu.Item>
                            <Menu.Item style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: '0'}}>
                                <Icon name='minus' style={{cursor: 'pointer', margin: '0'}} onClick={() => this.incrementHeight('down')}/>
                                <Menu.Header style={{margin: '0'}}>{Common.height}</Menu.Header>
                                <Icon name='plus' style={{cursor: 'pointer', margin: '0'}} onClick={() => this.incrementHeight('up')}/>
                            </Menu.Item>
                            <Menu.Item>
                                <Input
                                    inverted={inverted}
                                    type='number'
                                    value={shapeHeight}
                                    onChange={(e, data) => this.handleSizeChange(data, Common.height)}
                                    placeholder='Height...'
                                />
                            </Menu.Item>
                            <Menu.Item>
                                <Menu.Header>Increment</Menu.Header>
                                    <Input
                                        inverted={inverted}
                                        type='number'
                                        value={sizeIncrement}
                                        onChange={(e, data) => this.handleChangeSizeIncrement(data)}
                                        placeholder='Increment...'
                                    />
                            </Menu.Item>
                        </Menu.Menu>
                    )}
                    {shapeType === Common.circle && (
                            <Menu.Menu inverted={inverted} vertical >
                            <Menu.Item style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: '0'}}>
                                <Icon name='minus' style={{cursor: 'pointer', margin: '0'}} onClick={() => this.incrementRadius('down')}/>
                                <Menu.Header style={{margin: '0'}}>{Common.radius}</Menu.Header>
                                <Icon name='plus' style={{cursor: 'pointer', margin: '0'}} onClick={() => this.incrementRadius('up')}/>
                            </Menu.Item>
                            <Menu.Item>
                                <Input
                                    inverted={inverted}
                                    type='number'
                                    value={shapeRadius}
                                    onChange={(e, data) => this.handleSizeChange(data, Common.radius)}
                                    placeholder='Radius...'
                                />
                            </Menu.Item>
                            <Menu.Item>
                                <Menu.Header>Increment</Menu.Header>
                                    <Input
                                        inverted={inverted}
                                        type='number'
                                        value={radiusIncrement}
                                        onChange={(e, data) => this.handleChangeRadiusIncrement(data)}
                                        placeholder='Increment...'
                                    />
                            </Menu.Item>
                        </Menu.Menu>
                    )}
                </Accordion.Content>
            </Menu.Item>
        )
    }
}

const mapStateToProps = (state) => {
    const { currentShape } = state.canvas;
    return {
        currentShape
    }
}

export default connect(mapStateToProps)(ShapeSizeCard);
import React, {Component} from 'react';
import { Icon, Menu, Input, Accordion} from 'semantic-ui-react';
import { 
    changeShapeRadius, 
    changeShapeWidth, 
    changeShapeHeight,
    changeShapeStrokeWidth
} from '../../../../actions/canvasActions';
import Common from '../../../../constants/common';
import {connect} from 'react-redux';
import AccordionCard from '../../../AccordionCard';

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
        const { square } = this.props.currentShape;
        const { sizeIncrement } = this.state;
        const newValue = value === 'down' ? (square.width - sizeIncrement <= 0 ? 0 : square.width - sizeIncrement) : square.width + sizeIncrement;
        this.props.dispatch(changeShapeWidth(newValue))
    }
    incrementHeight = (value) => {
        const { square } = this.props.currentShape;
        const { sizeIncrement } = this.state;
        const newValue = value === 'down' ? (square.height - sizeIncrement <= 0 ? 0 : square.height - sizeIncrement) : square.height + sizeIncrement;
        this.props.dispatch(changeShapeHeight(newValue))
    }
    incrementStrokeWidth = (value) => {
        const { line } = this.props.currentShape;
        let newValue = value;
        if(value === 'down'){
            if(value !== 1){
                newValue = value - 1;
            }
        } else if (value === 'up'){
            newValue = value + 1;
        }
        this.props.dispatch(changeShapeStrokeWidth(newValue))
    }
    incrementRadius = (value) => {
        const { circle } = this.props.currentShape;
        const { sizeIncrement } = this.state;
        const newValue = value === 'down' ? (circle.radius - sizeIncrement <= 0 ? 0 : circle.radius - sizeIncrement) : circle.radius + sizeIncrement;
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

    cardContent = () => {
        const { inverted } = this.props;
        const { sizeIncrement, radiusIncrement } = this.state;
        const { currentShape, currentShapeType } = this.props;
        const { square, circle } = currentShape;
        switch(currentShapeType){
            case Common.square:
                return (
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
                                value={square.width}
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
                                value={square.height}
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
                )
            case Common.circle:
                return (
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
                                value={circle.radius}
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
                )
            default:
                return <div>N/A</div>
        }
    }

    render(){
        const { open, selection, handleSelect } = this.props;
        return (
            <AccordionCard
                open={open}
                selection={selection}
                handleSelect={handleSelect}
                handleOpen={this.props.handleOpen}
                index={3}
                header={Common.size}
                content={this.cardContent()}
            />
        )
    }
}

const mapStateToProps = (state) => {
    const { currentShape, currentShapeType } = state.canvas;
    return {
        currentShape,
        currentShapeType
    }
}

export default connect(mapStateToProps)(ShapeSizeCard);
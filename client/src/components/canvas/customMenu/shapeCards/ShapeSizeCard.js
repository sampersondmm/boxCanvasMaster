 import React, {Component} from 'react';
import { Icon, Menu, Input, Accordion} from 'semantic-ui-react';
import { 
    changeShapeRadius, 
    changeShapeWidth, 
    changeShapeHeight,
    changeShapeStrokeWidth
} from '../../../../actions/canvas/editorActions';
import Common from '../../../../constants/common';
import Colors from '../../../../constants/colors';
import {connect} from 'react-redux';
import AccordionCard from '../../../AccordionCard';
import CustomInput from './CustomInput'

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
        const { currentShape } = this.props;
        const { sizeIncrement } = this.state;
        const newValue = value === 'down' ? (currentShape.width - sizeIncrement <= 0 ? 0 : currentShape.width - sizeIncrement) : currentShape.width + sizeIncrement;
        this.props.dispatch(changeShapeWidth(newValue))
    }
    incrementHeight = (value) => {
        const { currentShape } = this.props;
        const { sizeIncrement } = this.state;
        const newValue = value === 'down' ? (currentShape.height - sizeIncrement <= 0 ? 0 : currentShape.height - sizeIncrement) : currentShape.height + sizeIncrement;
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
        const { currentShape } = this.props;
        const { sizeIncrement } = this.state;
        const newValue = value === 'down' ? (currentShape.radius - sizeIncrement <= 0 ? 0 : currentShape.radius - sizeIncrement) : currentShape.radius + sizeIncrement;
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
        const { currentShape } = this.props;
        switch(currentShape.type){
            case Common.square:
                return (
                    <Menu.Menu vertical >
                        <CustomInput
                            value={currentShape.width}
                            type='number'
                            label={Common.width}
                            onChange={this.handleSizeChange}
                            onIncrement={this.incrementWidth}
                            placeholder={`${Common.width}...`}
                            useIncrement={true}
                        />
                        <CustomInput
                            value={currentShape.height}
                            type='number'
                            label={Common.height}
                            onChange={this.handleSizeChange}
                            onIncrement={this.incrementHeight}
                            placeholder={`${Common.height}...`}
                            useIncrement={true}
                        />
                        <CustomInput
                            value={sizeIncrement}
                            type='number'
                            label='Increment'
                            onChange={this.handleChangeSizeIncrement}
                            placeholder={'Increment...'}
                            useIncrement={false}
                        />
                    </Menu.Menu>
                )
            case Common.circle:
                return (
                    <Menu.Menu inverted={inverted} vertical >
                        <CustomInput
                            value={currentShape.radius}
                            label={Common.radius}
                            onChange={this.handleSizeChange}
                            onIncrement={this.incrementRadius}
                            useIncrement={true}
                        />
                        <CustomInput
                            value={radiusIncrement}
                            label={Common.increment}
                            onChange={this.handleChangeRadiusIncrement}
                            useIncrement={false}
                        />
                    </Menu.Menu>
                )
            default:
                return <div>N/A</div>
        }
    }

    render(){
        const { open, selected, handleSelect } = this.props;
        return (
            <AccordionCard
                open={open}
                selected={selected === Common.size}
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
    const { currentShape, defaultShape } = state.canvas.editor;
    return {
        currentShape,
        defaultShape
    }
}

export default connect(mapStateToProps)(ShapeSizeCard);
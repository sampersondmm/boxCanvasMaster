import React, {Component} from 'react';
import { Menu, Input, Icon } from 'semantic-ui-react';
import ColorPicker from '../../ColorPicker';
import AccordionCard from '../../../AccordionCard';
import { 
    changeShapeStroke,
    changeShapeStrokeWidth
} from '../../../../actions/canvasActions';
import Common from '../../../../constants/common';
import {connect} from 'react-redux';

class ShapeColorCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            strokeColorValue: '',
            strokeColor: '',
            strokeColorOpen: false,
        }
        this.style = {
            colorIcon: {
                width: '40px',
                height: '20px',
                cursor: 'pointer',
                position: 'relative'
            }
        }
    }
    
    handleStrokeWidthChange = (data) => {
        const value = parseInt(data.value, 10);
        this.props.dispatch(changeShapeStrokeWidth(value))
    }

    incrementStrokeWidth = (value) => {
        const { currentShapeType, currentShape } = this.props;
        const shape = currentShape[currentShapeType.toLowerCase()];
        const newValue = value === 'down' ? (shape.strokeWidth - 1 <= 0 ? 0 : shape.strokeWidth - 1) : shape.strokeWidth + 1;
        this.props.dispatch(changeShapeStrokeWidth(newValue))
    }

    handleColorChange = (value, color) => {
        const { strokeColorOpen } = this.state;
        const rgbString = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
        if(strokeColorOpen){
            this.props.dispatch(changeShapeStroke(rgbString));
        } 
        this.setState(state => ({
            ...state, 
            dirty: true,
            strokeColorValue: state.strokeColorOpen ? value : state.strokeColorValue,
            value
        }));
    }

    colorTabChange = (data) => {
        this.setState(state => ({
            ...state,
            colorStatus: data.activeIndex === 1 ? Common.background : Common.shape,
            dirty: false
        }))
    }

    toggleColorPicker = (type, value) => {
        this.setState((state) => {
            let { strokeColorOpen } = this.state;
            strokeColorOpen = value
            return {
                ...state,
                strokeColorOpen
            }
        })
    }

    contentRow = (type, colorString, colorValue, open) => {
        const color = colorValue ? colorValue : colorString;
        const { currentShape } = this.props;
        const { backgroundColor } = this.props.canvasData;
        return (
            <Menu.Item style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Menu.Header>{type}</Menu.Header>
                <div 
                    style={{...this.style.colorIcon, backgroundColor: colorString}}
                    onClick={() => this.toggleColorPicker(type, true)}
                >
                </div>
                {open && (
                    <div style={{position: 'absolute', top: '0', right: '40px', width: '200px', zIndex: '2'}}>
                        <div style={{position: 'fixed', top: '0', right: '0', bottom: '0', left: '0'}}
                            onClick={() => this.toggleColorPicker(type, false)}
                        ></div>
                        <ColorPicker 
                            color={color} 
                            colorChange={this.handleColorChange}
                            shapeColor={currentShape.color}
                            backgroundColor={backgroundColor}
                        />
                    </div>
                )}
            </Menu.Item>
        )
    }

    determineShapeColor = () => {

    }

    cardShapeContent = () => {
        const { strokeColorOpen, strokeColorValue } = this.state;
        const { inverted, currentShape, currentShapeType } = this.props;
        const strokeColor = currentShape[currentShapeType.toLowerCase()].stroke;
        const strokeWidth = currentShape[currentShapeType.toLowerCase()].strokeWidth;
        return (
            <Menu.Menu inverted={inverted} vertical>
                {this.contentRow(Common.strokeColor, strokeColor, strokeColorValue, strokeColorOpen)}
                <Menu.Item style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: '0'}}>
                    <Icon name='minus' style={{cursor: 'pointer', margin: '0'}} onClick={() => this.incrementStrokeWidth('down')}/>
                    <Menu.Header style={{margin: '0'}}>{Common.strokeWidth}</Menu.Header>
                    <Icon name='plus' style={{cursor: 'pointer', margin: '0'}} onClick={() => this.incrementStrokeWidth('up')}/>
                </Menu.Item>
                <Menu.Item>
                    <Input
                        inverted={inverted}
                        type='number'
                        value={strokeWidth}
                        onChange={(e, data) => this.handleStrokeWidthChange(data)}
                        placeholder='Stoke Width'
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
                index={2}
                header={Common.stroke}
                content={this.cardShapeContent()}
            />
        )
    }
}

const mapStateToProps = (state) => {
    const { currentShape, canvasData, currentShapeType } = state.canvas;
    return {
        canvasData,
        currentShape,
        currentShapeType
    }
}

export default connect(mapStateToProps)(ShapeColorCard);
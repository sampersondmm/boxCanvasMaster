import React, {Component} from 'react';
import { Menu, Input, Icon } from 'semantic-ui-react';
import ColorPicker from '../../ColorPicker';
import AccordionCard from '../../../AccordionCard';
import CustomInput from './CustomInput';
import { 
    changeShapeStroke,
    changeShapeStrokeWidth
} from '../../../../actions/canvas/editorActions';
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
        const { currentShape } = this.props;
        const newValue = value === 'down' ? (currentShape.strokeWidth - 1 <= 0 ? 0 : currentShape.strokeWidth - 1) : currentShape.strokeWidth + 1;
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
                <Menu.Header className='font-color'>{type}</Menu.Header>
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
                            shapeColor={currentShape.fill}
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
        const { inverted, currentShape } = this.props;
        const strokeColor = currentShape.stroke;
        const strokeWidth = currentShape.strokeWidth;
        return (
            <Menu.Menu inverted={inverted} vertical>
                {this.contentRow(Common.strokeColor, strokeColor, strokeColorValue, strokeColorOpen)}
                <CustomInput
                    value={strokeWidth}
                    type='number'
                    label={Common.strokeWidth}
                    placeholder={`${Common.strokeWidth}...`}
                    onChange={this.handleStrokeWidthChange}
                    onIncrement={this.incrementStrokeWidth}
                    useIncrement={true}
                />
            </Menu.Menu>
        )
    }

    render(){
        const { open, selected, handleSelect } = this.props;
        return (
            <AccordionCard
                open={open}
                selected={selected === Common.stroke}
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
    const { canvas } = state;
    const { canvasData, editor } = canvas;
    const { currentShape } = editor;
    return {
        canvasData,
        currentShape
    }
}

export default connect(mapStateToProps)(ShapeColorCard);
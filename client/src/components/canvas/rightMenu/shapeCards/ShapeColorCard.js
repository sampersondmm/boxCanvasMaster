import React, {Component} from 'react';
import { Menu } from 'semantic-ui-react';
import ColorPicker from '../../ColorPicker';
import AccordionCard from '../../../AccordionCard';
import { 
    changeShapeFill,
    changeBackgroundColor
} from '../../../../actions/canvasActions';
import Common from '../../../../constants/common';
import {connect} from 'react-redux';

class ShapeColorCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            shapeFillValue: '',
            backgroundColorValue: '',
            shapeFillOpen: false,
            fillColorOpen: false,
            backgroundColorOpen: false
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

    handleColorChange = (value, color) => {
        const { shapeFillOpen } = this.state;
        const rgbString = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
        if(shapeFillOpen){
            this.props.dispatch(changeShapeFill(rgbString));
        } else {
            this.props.dispatch(changeBackgroundColor(rgbString));
        }
        this.setState(state => ({
            ...state, 
            dirty: true,
            shapeFillValue: state.shapeFillOpen ? value : state.shapeFillValue,
            backgroundColorValue: state.backgroundColorOpen ? value : state.backgroundColorValue,
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
            let { shapeFillOpen, backgroundColorOpen } = this.state;
            switch(type){
                case Common.shapeFill:
                    shapeFillOpen = value;
                    break;
                case Common.background:
                    backgroundColorOpen = value;
                    break;
                default:
                    break
            }
            return {
                ...state,
                shapeFillOpen,
                backgroundColorOpen
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
        const { shapeFillOpen, backgroundColorOpen, shapeFillValue, backgroundColorValue } = this.state;
        const { inverted, currentShape, currentShapeType, selectedShape } = this.props;
        const { backgroundColor } = this.props.canvasData;
        const shapeFill = selectedShape ? selectedShape.fill : currentShape[currentShapeType.toLowerCase()].fill;
        return (
            <Menu.Menu inverted={inverted} vertical>
                {this.contentRow(Common.shapeFill, shapeFill, shapeFillValue, shapeFillOpen)}
                {this.contentRow(Common.background, backgroundColor, backgroundColorValue, backgroundColorOpen)}
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
                header={Common.color}
                content={this.cardShapeContent()}
            />
        )
    }
}

const mapStateToProps = (state) => {
    const { currentShape, canvasData, currentShapeType } = state.canvas;
    const { selectedShape } = state.canvas.canvasData;
    return {
        canvasData,
        currentShape,
        currentShapeType,
        selectedShape
    }
}

export default connect(mapStateToProps)(ShapeColorCard);
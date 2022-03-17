import React, {Component} from 'react';
import { Menu, Popup } from 'semantic-ui-react';
import ColorPicker from '../../ColorPicker';
import AccordionCard from '../../../AccordionCard';
import { 
    changeBackgroundColor,
    changeBackgroundOpacity
} from '../../../../actions/canvas/canvasActions'
import { 
    changeShapeFill,
    changeShapeOpacity
} from '../../../../actions/canvas/editorActions';
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
        const rgbString = `rgb(${color.r}, ${color.g}, ${color.b})`
        if(shapeFillOpen){
            this.props.dispatch(changeShapeFill(rgbString));
            this.props.dispatch(changeShapeOpacity(color.a))
        } else {
            this.props.dispatch(changeBackgroundColor(rgbString));
            this.props.dispatch(changeBackgroundOpacity(color.a))
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

    contentRow = (type, colorString, colorValue, colorOpacity, open) => {
        const color = colorValue ? colorValue : colorString;
        const { currentShape, canvasData } = this.props;
        const fill = type === Common.background ? canvasData.fill : currentShape.fill;
        return (
            <Menu.Item style={{display: 'flex', alignItems: 'center', position: 'relative', justifyContent: 'space-between'}}>
                <Menu.Header className='font-color' style={{display: 'flex', alignItems: 'center'}}>{type}</Menu.Header>
                <Popup
                    inverted
                    onOpen={() => this.toggleColorPicker(type, true)}
                    onClose={() => this.toggleColorPicker(type, false)}
                    on='click'
                    style={{
                        width: '250px'
                    }}
                    trigger={
                        <div   
                            style={{...this.style.colorIcon, backgroundColor: colorString, opacity: colorOpacity}}
                            // onClick={() => this.toggleColorPicker(type, true)}
                        ></div>
                    }
                    content={
                        <ColorPicker 
                            color={color} 
                            colorChange={this.handleColorChange}
                            shapeColor={fill}
                            backgroundColor={fill}
                        />
                    }
                />
                {/* </div> */}
                {/* {open && (
                    <div style={{position: 'absolute', top: '30px', left: 'calc(100% - 200px)', zIndex: '10', width: '200px', height: '155px'}}>
                        <div style={{position: 'fixed', top: '0', right: '0', bottom: '0', left: '0'}}
                            onClick={() => this.toggleColorPicker(type, false)}
                        ></div>
                    </div>
                )} */}
            </Menu.Item>
        )
    }

    determineShapeColor = () => {

    }

    cardShapeContent = () => {
        const { shapeFillOpen, backgroundColorOpen, shapeFillValue, backgroundColorValue } = this.state;
        const { inverted, currentShape } = this.props;
        const { fill, opacity } = this.props.canvasData;
        return (
            <Menu.Menu inverted={inverted} vertical>
                {this.contentRow(Common.shapeFill, currentShape.fill, shapeFillValue, currentShape.opacity, shapeFillOpen)}
                {this.contentRow(Common.background, fill, backgroundColorValue, opacity ,backgroundColorOpen)}
            </Menu.Menu>
        )
    }

    render(){
        const { open, selected, handleSelect } = this.props;
        return (
            <AccordionCard
                open={open}
                selected={selected === Common.color}
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
    const { editor, canvasData } = state.canvas;
    const { selectedShapeId, currentShape } = editor;
    return {
        canvasData,
        currentShape,
        selectedShapeId
    }
}

export default connect(mapStateToProps)(ShapeColorCard);
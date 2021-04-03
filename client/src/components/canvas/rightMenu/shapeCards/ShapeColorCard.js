import React, {Component} from 'react';
import { Menu, Tab, Label } from 'semantic-ui-react';
import ColorPicker from '../../ColorPicker';
import AccordionCard from '../../../AccordionCard';
import { 
    changeShapeColor,
    changeBackgroundColor
} from '../../../../actions/canvasActions';
import Common from '../../../../constants/common';
import {connect} from 'react-redux';

class ShapeColorCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            shapeColorValue: '',
            backgroundColorValue: '',
            shapeColorOpen: false,
            backgroundColorOpen: false
        }
    }

    handleColorChange = (value, color) => {
        const { shapeColorOpen } = this.state;
        const rgbString = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
        if(shapeColorOpen){
            this.props.dispatch(changeShapeColor(rgbString));
        } else {
            this.props.dispatch(changeBackgroundColor(rgbString));
        }
        this.setState(state => ({
            ...state, 
            dirty: true,
            shapeColorValue: state.shapeColorOpen ? value : state.shapeColorValue,
            backgroundColorValue: state.backgroundColorOpen ? value : state.backgroundColorValue,
            value
        }));
    }

    colorTabChange = (event, data) => {
        this.setState(state => ({
            ...state,
            colorStatus: data.activeIndex === 1 ? Common.background : Common.shape,
            dirty: false
        }))
    }

    toggleColorPicker = (type, value) => {
        this.setState((state) => {
            let { shapeColorOpen, backgroundColorOpen } = this.state;
            switch(type){
                case Common.shape:
                    shapeColorOpen = value;
                    break;
                case Common.background:
                    backgroundColorOpen = value;
                    break;
                default:
                    break
            }
            return {
                ...state,
                shapeColorOpen,
                backgroundColorOpen
            }
        })
    }


    cardContent = () => {
        const { shapeColorOpen, backgroundColorOpen, shapeColorValue, backgroundColorValue } = this.state;
        const { inverted, currentShape, currentShapeType } = this.props;
        const { backgroundColor } = this.props.canvasData;
        const shapeColor = currentShape[currentShapeType.toLowerCase()].color
        let color = null;
        if(shapeColorOpen){
            color = shapeColorValue ? shapeColorValue : shapeColor;
        } else if (backgroundColorOpen) {
            color = backgroundColorValue ? backgroundColorValue : backgroundColor;
        }

        const style = {
            colorIcon: {
                width: '40px',
                height: '20px',
                cursor: 'pointer',
                position: 'relative'
            }
        }
        return (
            <Menu.Menu inverted={inverted} vertical >
                <Menu.Item style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Menu.Header>{Common.shape}</Menu.Header>
                    <div 
                        style={{...style.colorIcon, backgroundColor: shapeColor}}
                        onClick={() => this.toggleColorPicker(Common.shape, true)}
                    >
                    </div>
                    {shapeColorOpen && (
                        <div style={{position: 'absolute', top: '0', right: '40px', width: '200px', zIndex: '2'}}>
                            <div style={{position: 'fixed', top: '0', right: '0', bottom: '0', left: '0'}}
                                onClick={() => this.toggleColorPicker(Common.shape, false)}
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
                <Menu.Item style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Menu.Header>{Common.background}</Menu.Header>
                    <div 
                        style={{...style.colorIcon, backgroundColor: backgroundColor}}
                        onClick={() => this.toggleColorPicker(Common.background, true)}
                    >
                    </div>
                    {backgroundColorOpen && (
                        <div style={{position: 'absolute', top: '0', right: '40px', width: '200px', zIndex: '2'}}>
                            <div style={{position: 'fixed', top: '0', right: '0', bottom: '0', left: '0'}}
                                onClick={() => this.toggleColorPicker(Common.background, false)}
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
            </Menu.Menu>
        )
        return (
            <Tab 
                onTabChange={this.colorTabChange}
                menu={{secondary: true}}
                panes={[
                    {
                        menuItem: 'Shape',
                        render: () => {
                            return (    
                                <div sty>
                                    <Tab.Pane inverted={inverted} style={{padding: '0', display: 'flex', justifyContent: 'center', alignItems:'center', border: '0'}}>
                                        <ColorPicker 
                                            color={color} 
                                            colorChange={this.handleColorChange}
                                            shapeColor={currentShape.color}
                                            backgroundColor={backgroundColor}
                                            />
                                    </Tab.Pane>
                                </div>
                            )
                        }
                    },
                    {
                        menuItem: 'Background',
                        render: () => <Tab.Pane inverted={inverted} style={{padding: '0', display: 'flex', justifyContent: 'center', alignItems:'center', border: '0'}}>
                            <ColorPicker 
                                color={color} 
                                colorChange={this.handleColorChange}
                                shapeColor={currentShape.color}
                                backgroundColor={backgroundColor}
                                />
                        </Tab.Pane>
                    }
                ]}
            />
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
                content={this.cardContent()}
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
import React, {Component} from 'react';
import { Icon, Menu, Tab, Accordion} from 'semantic-ui-react';
import ColorPicker from '../../ColorPicker';
import { 
    changeShapeColor,
    changeBackgroundColor,
    changeShapeOpacity
} from '../../../../actions/canvasActions';
import Common from '../../../../constants/common';
import {connect} from 'react-redux';

class ShapeSizeCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            colorStatus: Common.shape
        }
    }

    handleColorChange = (value, color) => {
        if(this.state.colorStatus === Common.shape){
            this.props.dispatch(changeShapeColor(color));
            this.props.dispatch(changeShapeOpacity(value.a))
        } else {
            this.props.dispatch(changeBackgroundColor(color));
        }
        this.setState(state => ({
            ...state, 
            dirty: true,
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

    render(){
        const { open, inverted } = this.props;
        const { backgroundColor } = this.props.canvasData
        const { shapeColor } = this.props.currentShape;

        let color = null;
          if(this.state.colorStatus === Common.shape){
            color = this.state.dirty ? this.state.value : shapeColor;
          } else {
            color = this.state.dirty ? this.state.value : backgroundColor;
          }

        return (
            <Menu.Item className='shape-accordian-option'>
                <Accordion.Title
                    index={2}
                    onClick={this.props.handleOpen}
                    >
                    <Icon name={open ? 'plus' : 'minus'} />
                    {Common.color}
                </Accordion.Title>
                <Accordion.Content active={open}>
                    <Tab 
                            onTabChange={this.colorTabChange}
                            menu={{secondary: true}}
                            panes={[
                                {
                                    menuItem: 'Shape',
                                    render: () => <Tab.Pane inverted={inverted} style={{padding: '0', display: 'flex', justifyContent: 'center', alignItems:'center', border: '0'}}>
                                        <ColorPicker 
                                            color={color} 
                                            colorChange={this.handleColorChange}
                                            shapeColor={shapeColor}
                                            backgroundColor={backgroundColor}
                                            />
                                    </Tab.Pane>
                                },
                                {
                                    menuItem: 'Background',
                                    render: () => <Tab.Pane inverted={inverted} style={{padding: '0', display: 'flex', justifyContent: 'center', alignItems:'center', border: '0'}}>
                                        <ColorPicker 
                                            color={color} 
                                            colorChange={this.handleColorChange}
                                            shapeColor={shapeColor}
                                            backgroundColor={backgroundColor}
                                            />
                                    </Tab.Pane>
                                }
                            ]}
                            />
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
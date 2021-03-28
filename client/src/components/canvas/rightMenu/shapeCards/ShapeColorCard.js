import React, {Component} from 'react';
import { Icon, Menu, Tab, Accordion} from 'semantic-ui-react';
import ColorPicker from '../../ColorPicker';
import AccordionCard from '../../../AccordionCard';
import { 
    changeShapeColor,
    changeBackgroundColor,
    changeShapeOpacity
} from '../../../../actions/canvasActions';
import Common from '../../../../constants/common';
import {connect} from 'react-redux';

class ShapeColorCard extends Component {
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


    cardContent = () => {
        const { inverted, currentShape } = this.props;
        const { backgroundColor } = this.props.canvasData
        let color = null;
        if(this.state.colorStatus === Common.shape){
            color = this.state.dirty ? this.state.value : currentShape.color;
        } else {
            color = this.state.dirty ? this.state.value : backgroundColor;
        }
        return (
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
                                shapeColor={currentShape.color}
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
    const { currentShape, canvasData } = state.canvas;
    return {
        canvasData,
        currentShape
    }
}

export default connect(mapStateToProps)(ShapeColorCard);
import React, {Component} from 'react';
import { Icon, Menu, Tab, Accordion} from 'semantic-ui-react';
import { changeShapeType } from '../../../../actions/canvasActions';
import Common from '../../../../constants/common';
import {connect} from 'react-redux';
import Carousel, { consts } from 'react-elastic-carousel';

class ShapeSizeCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            colorStatus: Common.shape
        }
    }

    changeShapeType = (type) => {
        this.props.dispatch(changeShapeType(type))
    }

    renderArrow = ({ type, onClick, isEdge }) => {
        const pointer = type === consts.PREV ? (
            <div style={{height: '100%', display: 'flex', alignItems: 'center'}}>
                <Icon name='angle left' onClick={onClick}/>
            </div>
        ) : (
            <div style={{height: '100%', display: 'flex', alignItems: 'center'}}>
                <Icon name='angle right' onClick={onClick}/>
            </div>
        )
        return pointer;
    }

    render(){
        const { open, inverted } = this.props;
        const backgroundColor = !inverted ? 'rgb(50,50,50)' : 'rgb(220,220,220)'
        return (
            <Menu.Item className='shape-accordian-option'>
                <Accordion.Title
                    index={1}
                    onClick={this.props.handleOpen}
                    >
                    <Icon name={open ? 'plus' : 'minus'} />
                    {Common.type}
                </Accordion.Title>
                <Accordion.Content active={open}>
                    <Carousel itemsToShow={2} renderArrow={this.renderArrow}>

                        <div style={{width: '30px', height: '30px', backgroundColor}} onClick={() => this.changeShapeType(Common.square)}></div>

                        <div style={{width: '30px', height: '30px', borderRadius: '50%', backgroundColor}} onClick={() => this.changeShapeType(Common.circle)}></div>

                        <div style={{width: '30px', height: '30px', borderRadius: '50%', backgroundColor}} onClick={() => this.changeShapeType(Common.circle)}></div>

                        <div style={{width: '30px', height: '30px', borderRadius: '50%', backgroundColor}} onClick={() => this.changeShapeType(Common.circle)}></div>

                    </Carousel>
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
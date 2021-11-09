import React, {Component} from 'react';
import { Icon } from 'semantic-ui-react';
import { changeShapeType } from '../../../../actions/canvasActions';
import Common from '../../../../constants/common';
import {connect} from 'react-redux';
import Carousel, { consts } from 'react-elastic-carousel';
import AccordionCard from '../../../AccordionCard';

class ShapeTypeCard extends Component {
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
            <div style={{height: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                <Icon name='angle left' onClick={onClick}/>
            </div>
        ) : (
            <div style={{height: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                <Icon name='angle right' onClick={onClick}/>
            </div>
        )
        return pointer;
    }

    cardContent = () => {
        const { inverted } = this.props;
        const backgroundColor = !inverted ? 'rgb(50,50,50)' : 'rgb(220,220,220)'
        return (
            <Carousel itemsToShow={3} renderArrow={this.renderArrow}>
                <div style={{width: '30px', height: '30px', backgroundColor}} onClick={() => this.changeShapeType(Common.square)}></div>
                <div style={{width: '30px', height: '30px', borderRadius: '50%', backgroundColor}} onClick={() => this.changeShapeType(Common.circle)}></div>
                <div style={{width: '30px', height: '30px', display: 'flex', alignItems: 'center'}} onClick={() => this.changeShapeType(Common.line)}>
                    <div style={{width: '30px', height: '3px', backgroundColor}}></div>
                </div>
             </Carousel>
        )
    }

    render(){
        const { open, selection, handleSelect } = this.props;
        return (
            <AccordionCard
                open={open}
                index={1}
                header={Common.type}
                selection={selection}
                handleSelect={handleSelect}
                handleOpen={this.props.handleOpen}
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

export default connect(mapStateToProps)(ShapeTypeCard);
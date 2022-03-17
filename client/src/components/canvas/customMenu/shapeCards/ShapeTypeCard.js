import React, {Component} from 'react';
import { Icon } from 'semantic-ui-react';
import { changeShapeType } from '../../../../actions/canvas/editorActions';
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
                <Icon name='angle left' className='font-color' onClick={onClick}/>
            </div>
        ) : (
            <div style={{height: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                <Icon name='angle right'className='font-color' onClick={onClick}/>
            </div>
        )
        return pointer;
    }

    cardContent = () => {
        const { inverted, canvasData } = this.props;
        const backgroundColor = !inverted ? 'rgb(50,50,50)' : 'rgb(220,220,220)';
        const linePoints = [
            {x: 0, y: 0},
            {x: 20, y: 30},
            {x: 40, y: 0},
            {x: 60, y: 30},
        ]
        return (
            <Carousel itemsToShow={3} renderArrow={this.renderArrow}>
                {/* square */}
                <div 
                    style={{
                        width: '40px', 
                        height: '40px', 
                        backgroundColor
                    }} onClick={() => this.changeShapeType(Common.square)}></div>
                {/* circle */}
                <div style={{width: '40px', height: '40px', borderRadius: '50%', backgroundColor}} onClick={() => this.changeShapeType(Common.circle)}></div>
                {/* closed-path */}
                <div style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center'}}>
                    <svg 
                        style={{width: '40px', height: '40px'}}
                        onClick={() => this.changeShapeType(Common.line)}
                    >
                        <path
                            fill='white'
                            d='M 5 20 L 0 0 L 30 5 L 40 20 L 35 40 L 5 20'
                        />
                    </svg>
                </div>
                {/* path */}
                <div style={{width: '60px', height: '40px', display: 'flex', alignItems: 'center'}}>
                    <svg 
                        style={{width: '60px', height: '30px'}}
                        onClick={() => this.changeShapeType(Common.line)}
                    >
                        <path
                            stroke='white'
                            strokeWidth='2'
                            fill='transparent'
                            d='M 0 0 L 20 30 L 40 0 L 60 30'
                        />
                    </svg>
                </div>
             </Carousel>
        )
    }

    render(){
        const { open, selected, handleSelect } = this.props;
        return (
            <AccordionCard
                open={open}
                index={1}
                header={Common.type}
                selected={selected === Common.type}
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
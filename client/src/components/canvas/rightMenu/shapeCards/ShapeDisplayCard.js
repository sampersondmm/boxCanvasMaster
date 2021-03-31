import React, {Component} from 'react';
import Common from '../../../../constants/common';
import {connect} from 'react-redux';
import AccordionCard from '../../../AccordionCard';

class ShapeDisplayCard extends Component {
    constructor(props){
        super(props);
    }

    returnShape = () => {
        const { currentShape, currentShapeType } = this.props;
        const { square, circle, line } = currentShape;
        switch(currentShapeType){
            case Common.square:
                return (
                    <div 
                        style={{
                            width: '70px', 
                            height: '70px', 
                            opacity: square.opacity, 
                            backgroundColor: square.color
                        }}></div>
                )
            case Common.circle:
                return (
                    <div 
                        style={{
                            width: '70px', 
                            height: '70px', 
                            opacity: circle.opacity, 
                            borderRadius: '50%', 
                            backgroundColor: circle.color
                        }}></div>
                )
            case Common.line:
                return (
                    <div 
                        style={{
                            width: '70px', 
                            height: '3px', 
                            opacity: line.opacity, 
                            backgroundColor: line.stroke
                        }}></div>
                )
            default:
                return;
        }
    }

    cardContent = () => {
        const { canvasData, currentShape } = this.props;
        const {opacity, color, type } = currentShape;
        return (
            <div style={{
                height: '120px', 
                backgroundColor: canvasData.backgroundColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {this.returnShape()}
            </div>
        )
    }


    render() {
        const { open, selection, handleSelect } = this.props;
        return (
            <AccordionCard
                open={open}
                header={Common.display}
                selection={selection}
                handleSelect={handleSelect}
                handleOpen={this.props.handleOpen}
                index={0}
                content={this.cardContent()}
            />
        )
    }
}

const mapStateToProps = (state) => {
    const { currentShape, canvasData, currentShapeType } = state.canvas;
    return {
        canvasData,
        currentShapeType,
        currentShape
    }
}

export default connect(mapStateToProps)(ShapeDisplayCard);
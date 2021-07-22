import React, {Component} from 'react';
import Common from '../../../../constants/common';
import {connect} from 'react-redux';
import { isEmpty } from 'lodash';
import AccordionCard from '../../../AccordionCard';

class ShapeDisplayCard extends Component {
    constructor(props){
        super(props);
    }

    returnNewShape = () => {
        const { currentShape, currentShapeType } = this.props;
        const { square, circle, line } = currentShape;
        switch(currentShapeType){
            case Common.square:
                return (
                    <rect 
                        width='70' 
                        height='70' 
                        x={(120 / 2) - (70 / 2)}
                        y={(120 / 2) - (70 / 2)}
                        fill={square.fill}
                        fillOpacity={square.opacity}
                        stroke={square.stroke}
                        strokeWidth={square.strokeWidth}
                    />
                )
            case Common.circle:
                return (
                    <circle
                        r='35'
                        fill={circle.fill}
                        fillOpacity={circle.opacity}
                        stroke={circle.stroke}
                        strokeWidth={circle.strokeWidth}
                        cx={60}
                        cy={60}
                    />
                )
            case Common.line:
                return (
                    <path
                        stroke={line.stroke}
                        fill={line.fill}
                        strokeWidth={line.strokeWidth}
                        d='M 0 40 L 40 80 L 80 40 L 120 80'
                    />
                )
            default:
                return;
        }
    }

    returnExistingShape = () => {
        const { selectedShape } = this.props;
        switch(selectedShape.type){
            case Common.square:
                return (
                    <rect 
                        width='70' 
                        height='70' 
                        x={(120 / 2) - (70 / 2)}
                        y={(120 / 2) - (70 / 2)}
                        fill={selectedShape.fill}
                        fillOpacity={selectedShape.opacity}
                        stroke={selectedShape.stroke}
                        strokeWidth={selectedShape.strokeWidth}
                    />
                )
            case Common.circle:
                return (
                    <circle
                        r='35'
                        fill={selectedShape.fill}
                        fillOpacity={selectedShape.opacity}
                        stroke={selectedShape.stroke}
                        strokeWidth={selectedShape.strokeWidth}
                        cx={60}
                        cy={60}
                    />
                )
            case Common.line:
                return (
                    <path
                        stroke={selectedShape.stroke}
                        fill={selectedShape.fill}
                        strokeWidth={selectedShape.strokeWidth}
                        d='M 0 40 L 40 80 L 80 40 L 120 80'
                    />
                )
            default:
                return;
        }
    }

    cardContent = () => {
        const { canvasData, selectedShape } = this.props;
        const hasSelectedShape = !isEmpty(selectedShape)
        return (
            <div style={{
                height: '120px', 
                backgroundColor: canvasData.backgroundColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <svg width='120' height='120'>
                    {hasSelectedShape ? this.returnExistingShape() : this.returnNewShape()}
                </svg>
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
    const { selectedShape } = state.canvas.canvasData;

    return {
        canvasData,
        currentShapeType,
        selectedShape,
        currentShape
    }
}

export default connect(mapStateToProps)(ShapeDisplayCard);
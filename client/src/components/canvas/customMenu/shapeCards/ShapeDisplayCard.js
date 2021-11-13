import React, {Component} from 'react';
import Common from '../../../../constants/common';
import {connect} from 'react-redux';
import { isEmpty, cloneDeep } from 'lodash';
import AccordionCard from '../../../AccordionCard';

class ShapeDisplayCard extends Component {
    constructor(props){
        super(props);
    }

    returnNewShape = () => {
        const { currentShape, defaultShape } = this.props;
        switch(currentShape.type){
            case Common.square:
                return (
                    <rect 
                        width='70' 
                        height='70' 
                        x={(120 / 2) - (70 / 2)}
                        y={(120 / 2) - (70 / 2)}
                        fill={currentShape.fill}
                        fillOpacity={currentShape.opacity}
                        stroke={currentShape.stroke}
                        strokeWidth={currentShape.strokeWidth}
                    />
                )
            case Common.circle:
                return (
                    <circle
                        r='35'
                        fill={currentShape.fill}
                        fillOpacity={currentShape.opacity}
                        stroke={currentShape.stroke}
                        strokeWidth={currentShape.strokeWidth}
                        cx={60}
                        cy={60}
                    />
                )
            case Common.line:
                return (
                    <path
                        stroke={currentShape.stroke}
                        fill={currentShape.fill}
                        fillOpacity={currentShape.opacity}
                        strokeWidth={currentShape.strokeWidth}
                        d='M 0 40 L 40 80 L 80 40 L 120 80'
                    />
                )
            default:
                return;
        }
    }

    returnExistingShape = () => {
        const { selectedShapeId, shapeList } = this.props;
        const listCopy = cloneDeep(shapeList)
        const selectedShape = listCopy.find((x) => x.id === selectedShapeId)
        if(selectedShape){
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
        return null;
    }

    cardContent = () => {
        const { canvasData, selectedShapeId } = this.props;
        return (
            <div style={{
                height: '120px', 
                backgroundColor: canvasData.fill,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <svg width='120' height='120'>
                    {selectedShapeId ? this.returnExistingShape() : this.returnNewShape()}
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
    const { shapeList, canvasData } = state.canvas;
    const { currentShape, defaultShape, selectedShapeId } = state.canvas.editor;
    return {
        currentShape,
        shapeList,
        defaultShape,
        selectedShapeId,
        canvasData
    }
}

export default connect(mapStateToProps)(ShapeDisplayCard);
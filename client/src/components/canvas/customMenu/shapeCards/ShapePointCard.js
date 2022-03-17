import React, {Component} from 'react';
import Common from '../../../../constants/common';
import { Message } from 'semantic-ui-react';
import {connect} from 'react-redux';
import { selectPoint } from '../../../../actions/canvas/editorActions'
import AccordionCard from '../../../AccordionCard';
import { cloneDeep, without } from 'lodash';

class PointDisplayCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            openList: [],
            selectedList: []
        }
    }

    returnNewShape = () => {
        const { currentShape, currentShapeType } = this.props;
        // const { square, circle, line } = currentShape;
        switch(currentShapeType){
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
                        strokeWidth={currentShape.strokeWidth}
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

    handleSelectPoint = (id) => {
        let { selectedList } = this.state;
        const alreadySelected = selectedList.includes(id);

        if(alreadySelected){
            selectedList = [''];
        } else {
            selectedList = [id]
        }
        this.props.dispatch(selectPoint(selectedList))
        this.setState((state) => ({
            ...state,
            selectedList
        }))
    }

    handleOpen = (id) => {
        let openList = cloneDeep(this.state.openList);
        const alreadyOpen = openList.includes(id);
        if(alreadyOpen){
            openList = openList.filter(x => x.id === id);
        } else {
            openList.push(id)
        }
        this.setState(state => ({
            ...state,
            openList
        }))
    }

    cardContent = () => {
        const { currentShape, selectedShapeId } = this.props;
        const { openList, selectedList } = this.state;

        if(selectedShapeId){
            return currentShape.pointData.length ? currentShape.pointData.map((point, index) => {
                const open = openList.includes(point.id);
                const selected = selectedList.includes(point.id);
                return (
                    <AccordionCard
                        open={open}
                        header={`${Common.point} ${index}`}
                        additionalText={`[${Math.floor(point.x)}, ${Math.floor(point.y)}]`}
                        selected={selected}
                        handleSelect={() => this.handleSelectPoint(point.id)}
                        handleOpen={() => this.handleOpen(point.id)}
                        index={index}
                        content={null}
                    />
                )
            }) : (
                <Message
                    style={{
                        backgroundColor: '#1b1c1d',
                        color: 'rgba(255,255,255,.9)',
                        margin: '0',
                        border: '1px solid rgb(120, 120, 120)'
                    }}
                    content='No Points'
                />
            )
        } else {
            return null
        }
    }


    render() {
        const { open, selected, handleSelect } = this.props;
        return (
            <AccordionCard
                open={open}
                header={Common.points}
                selected={selected === Common.points}
                handleSelect={handleSelect}
                handleOpen={this.props.handleOpen}
                index={0}
                content={this.cardContent()}
            />
        )
    }
}

const mapStateToProps = (state) => {
    const { editor, canvasData } = state.canvas;
    const { selectedShape } = state.canvas.canvasData;

    return {
        canvasData,
        selectedShape,
        selectedShapeId: editor.selectedShapeId ,
        currentShape: editor.currentShape
    }
}

export default connect(mapStateToProps)(PointDisplayCard);
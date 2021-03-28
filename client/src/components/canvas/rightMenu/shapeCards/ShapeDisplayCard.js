import React, {Component} from 'react';
import { Icon, Menu, Accordion} from 'semantic-ui-react';
import Common from '../../../../constants/common';
import {connect} from 'react-redux';
import AccordionCard from '../../../AccordionCard';

class ShapeDisplayCard extends Component {
    constructor(props){
        super(props);
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
                <div style={{width: '70px', height: '70px', opacity, borderRadius: type === Common.square ? '0' : '50%', backgroundColor: color}}></div>
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
    const { currentShape, canvasData } = state.canvas;
    return {
        canvasData,
        currentShape
    }
}

export default connect(mapStateToProps)(ShapeDisplayCard);
import React, {Component} from 'react';
import { Icon, Menu, Accordion} from 'semantic-ui-react';
import Common from '../../../../constants/common';
import {connect} from 'react-redux';

class ShapeDisplayCard extends Component {
    constructor(props){
        super(props);
    }


    render() {
        const { open, canvasData, currentShape } = this.props;
        const {shapeOpacity, shapeColor, shapeType } = currentShape;
        return (
            <Menu.Item className='shape-accordian-option'>
                <Accordion.Title
                    index={0}
                    onClick={this.props.handleOpen}
                    >
                    <Icon name={open ? 'plus' : 'minus'} />
                    {Common.display}
                </Accordion.Title>
                <Accordion.Content active={open}>
                    <div style={{
                        height: '120px', 
                        backgroundColor: canvasData.backgroundColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <div style={{width: '70px', height: '70px', opacity: shapeOpacity, borderRadius: shapeType === Common.square ? '0' : '50%', backgroundColor: shapeColor}}></div>
                    </div>
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

export default connect(mapStateToProps)(ShapeDisplayCard);
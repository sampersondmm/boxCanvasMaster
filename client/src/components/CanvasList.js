import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Icon } from 'semantic-ui-react'
import map from 'lodash/map';
import CanvasItem from './CanvasItem';
import Carousel, { consts } from 'react-elastic-carousel'

class CanvasList extends Component {
    constructor(props){
        super(props);
    }
    componentDidMount(){
        // this.props.fetchCanvasList();
    }
    renderArrow = ({ type, onClick, isEdge }) => {
        const pointer = type === consts.PREV ? (
            <div style={{height: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                <Icon name='angle left' size='large' onClick={onClick}/>
            </div>
        ) : (
            <div style={{height: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                <Icon name='angle right' size='large' onClick={onClick}/>
            </div>
        )
        return pointer;
    }
    render(){
        let canvasList = map(this.props.list, (canvasItem) => {
            return (
                <CanvasItem 
                    {...this.props}
                    addNotification={this.props.addNotification}
                    fetchCanvasList={this.props.fetchCanvasList}
                    canvas={canvasItem}
                />
            )
        });
        return (
            <div className='canvas-list-wrap'>
                {/* <Carousel renderArrow={this.renderArrow}> */}
                    {canvasList}
                {/* </Carousel> */}
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        // canvasList: state.canvas.canvasList,
    }
}

export default connect(mapStateToProps)(CanvasList);
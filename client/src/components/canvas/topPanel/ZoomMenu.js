import React, {Component} from 'react';
import {connect} from 'react-redux';
import Common from '../../../constants/common';
import {changeShapeColor, changeCanvasScale, changeBackgroundColor} from '../../../actions/canvasActions';
import map from 'lodash/map';

class ZoomMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            status: Common.shape,
            dirty: false
        }
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleColorOptions = this.handleColorOptions.bind(this);
        this.handleZoom = this.handleZoom.bind(this);
    }  
    handleColorOptions(value){
        this.setState(state => ({
            ...state,
            status: value,
            dirty: false
        }))
    }
    handleZoom(e){
        const {value} = e.target;
        this.props.dispatch(changeCanvasScale(value))
    }
    handleColorChange(value, color) {
        if(this.state.status === Common.shape){
            this.props.dispatch(changeShapeColor(color));
        } else {
            this.props.dispatch(changeBackgroundColor(color));
        }
        this.setState(state => ({
            ...state, 
            dirty: true,
            value
        }));
    }
    renderPalette(){
        return map(this.props.colorPalette, item => {
            return <div className='color-menu-color-palette-item' style={{backgroundColor: item.color}}></div>
        });
    }
    render(){
        return (
            <div className='top-panel-menu-body'>
                <h3 className='top-menu-title'>{Common.zoom}</h3>
                <div className='zoom-menu-row'>
                    <div className='zoom-menu-input-wrap'>
                        <i className="far fa-minus-circle zoom-menu-icon"></i>
                        <input 
                            className='zoom-menu-input' 
                            type='range' 
                            onChange={this.handleZoom}
                            min='.4'
                            max='2.8'
                            step='.2'
                            list='tickmarks'
                            value={this.props.canvasScale}
                        />

                        <datalist id="tickmarks" key="tickmarks">
                            <option value="0.4" key="0.4" />
                            <option value="0.6" key="0.6" />
                            <option value="0.8" key="0.8" />
                            <option value="1" key="1" />
                            <option value="1.2" key="1.2" />
                            <option value="1.4" key="1.4" />
                            <option value="1.6" key="1.6" />
                            <option value="1.8" key="1.8" />
                            <option value="2" key="2" />
                            <option value="2.2" key="2.2" />
                            <option value="2.4" key="2.4" />
                            <option value="2.6" key="2.6" />
                            <option value="2.8" key="2.8" />
                        </datalist>
                        <i className="far fa-plus-circle zoom-menu-icon"></i>
                    </div>
                    <div className='zoom-menu-label'>{`${Math.floor(this.props.canvasScale * 100)}%`}</div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const {canvasScale} = state.canvas;
    return {
        ...state,
        canvasScale
    }
}

export default connect(mapStateToProps)(ZoomMenu);
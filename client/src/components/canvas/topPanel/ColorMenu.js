import React, {Component} from 'react';
import ColorPicker from '../ColorPicker';
import Common from '../../../constants/common';
import Size from '../../../constants/size';
import {changeShapeColor, changeBackgroundColor} from '../../../actions/canvasActions';
import map from 'lodash/map';
import {store} from '../../../index';

class ColorMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            status: Common.shape,
            dirty: false
        }
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleColorOptions = this.handleColorOptions.bind(this);
        this.renderPalette = this.renderPalette.bind(this);
        this.selectPalleteColor = this.selectPalleteColor.bind(this);
    }
    componentWillReceiveProps(nextProps){
        const {colorPalette} = this.props.canvasData;
        if(nextProps.canvasData.colorPalette !== colorPalette){
            this.renderPalette(nextProps.canvasData.colorPalette);
        }
    }   
    handleColorOptions(value){
        this.setState(state => ({
            ...state,
            status: value,
            dirty: false
        }))
    }
    handleColorChange(value, color) {
        if(this.state.status === Common.shape){
            store.dispatch(changeShapeColor(color));
        } else {
            store.dispatch(changeBackgroundColor(color));
        }
        this.setState(state => ({
            ...state, 
            dirty: true,
            value
        }));
    }
    renderPalette(){
        return map(this.props.canvasData.colorPalette, item => {
            return <div className='color-menu-color-palette-item' onClick={() => this.selectPalleteColor(item)} style={{backgroundColor: item.color}}></div>
        });
    }
    selectPalleteColor(item){
        const {color} = item;
        if(this.state.status === Common.shape){
            store.dispatch(changeShapeColor(color));
        } else {
            store.dispatch(changeBackgroundColor(color));
        }
    }
    render(){
        const style = {
            main: {
                width: Size.sidePanelMenuWidth
            },
            display: {
                backgroundColor: this.props.canvasData.backgroundColor
            },
            shape: {
                width: '60px',
                height: '60px',
                backgroundColor: this.props.canvasData.shapeColor,
                borderRadius: this.props.shapeType === Common.square ? '0' : '50%'
            }
          };
          let color = null;
          if(this.state.status === Common.shape){
            color = this.state.dirty ? this.state.value : this.props.canvasData.shapeColor;
          } else {
            color = this.state.dirty ? this.state.value : this.props.canvasData.backgroundColor;
          }
        return (
            <div className='top-panel-menu-body'>
                <h3 className='top-menu-title'>{Common.color}</h3>
                <div className='color-menu-display' style={style.display}>
                    <div style={style.shape}></div>
                </div>
                <div className='color-menu-option-wrap'>
                    <input
                        type='radio'
                        onChange={() => this.handleColorOptions(Common.shape)}
                        checked={this.state.status === Common.shape}
                        className='color-menu-option-input'
                    />
                    <div className='color-menu-option-label'>{Common.shape}</div>
                </div>
                <div className='color-menu-option-wrap'>
                    <input
                        type='radio'
                        onChange={() => this.handleColorOptions(Common.background)}
                        checked={this.state.status === Common.background}
                        className='color-menu-option-input'
                    />
                    <div  
                        className='color-menu-option-label'
                    >{Common.background}</div>
                </div>
                <ColorPicker 
                    color={color} 
                    colorChange={this.handleColorChange}
                    shapeColor={this.props.canvasData.shapeColor}
                    backgroundColor={this.props.canvasData.backgroundColor}
                />
                <div className='color-menu-color-palette-display'>
                    {this.renderPalette()}
                </div>
            </div>
        )
    }
}

export default ColorMenu;
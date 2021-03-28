import React, {Component} from 'react';
import Common from '../../constants/common';
import Size from '../../constants/size';
import {changeShapeColor, selectShape, changeBackgroundColor} from '../../actions/canvasActions';
import map from 'lodash/map';

class LayerMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            status: Common.shape,
            dirty: false
        }
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleColorOptions = this.handleColorOptions.bind(this);
        this.renderPalette = this.renderPalette.bind(this);
        this.renderShapeList = this.renderShapeList.bind(this);
        this.displayShape = this.displayShape.bind(this);
        this.selectShape = this.selectShape.bind(this);
        this.hoverShape = this.hoverShape.bind(this);
    }
    componentWillReceiveProps(nextProps){
        const {colorPalette, shapeList} = this.props.canvasData;
        if(nextProps.canvasData.colorPalette !== colorPalette){
            this.renderPalette(nextProps.canvasData.colorPalette);
        }
        if(nextProps.canvasData.shapeList !== shapeList){
            this.renderShapeList(nextProps.canvasData.shapeList);
        }
    }   
    handleColorOptions(value){
        this.setState(state => ({
            ...state,
            status: value,
            dirty: false
        }))
    }
    hoverShape(item){
        this.props.dispatch(selectShape(item))
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
    renderShapeList(){
        return map(this.props.canvasData.shapeList, item => {
            return (
                <div className='layer-menu-shape-item' style={{border: '2px solid red'}} onClick={() => this.selectShape(item)}>
                    <div 
                        className={item.type === Common.square ? 'layer-menu-shape-item-square' : 'layer-menu-shape-item-circle'} 
                        style={{backgroundColor: item.color}}
                    ></div>
                    <div className='layer-menu-shape-title'>{item.type}</div>
                </div>
            )
        });
    }
    selectShape(item){
        this.props.dispatch(selectShape(item.id))
    }
    displayShape(){
        return <div></div>
    }
    renderPalette(){
        return map(this.props.canvasData.colorPalette, item => {
            return <div className='color-menu-color-palette-item' style={{backgroundColor: item.color}}></div>
        });
    }
    render(){
        const {shapeColor, backgroundColor} = this.props.canvasData;
        const style = {
            main: {
                width: `${Size.sidePanelMenuWidth}px`,
                right: `${Size.sidePanelWidth}px`
            },
            display: {
                backgroundColor: `${backgroundColor}`
            },
            shape: {
                width: '50%',
                height: '50%',
                backgroundColor: `${shapeColor}`
            }
          };
          let color = null;
          if(this.state.status === Common.shape){
            color = this.state.dirty ? this.state.value : shapeColor;
          } else {
            color = this.state.dirty ? this.state.value : backgroundColor;
          }
        return (
            <div className='layer-menu' style={style.main}>
                <h3 className='layer-menu-title'>{this.props.name}</h3>
                <div className='layer-menu-display'>
                    <div className='layer-menu-display-inner' style={{backgroundColor}}>
                        {this.displayShape()}
                    </div>
                </div>
                <div className='layer-menu-shapes'>
                    {this.renderShapeList()}
                </div>
            </div>
        )
    }
}

export default LayerMenu;
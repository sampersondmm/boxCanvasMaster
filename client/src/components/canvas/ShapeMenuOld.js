import React, {Component} from 'react';
import {connect} from 'react-redux';
import ColorPicker from '../ColorPicker';
import Common from '../../../constants/common';
import PanelButton from '../PanelButton';
import Size from '../../../constants/size';
import {changeShapeColor, changeShapeType, changeShapeWidth, changeShapeHeight, changeShapeRadius, selectShape, changeBackgroundColor} from '../../../actions/canvasActions';
import map from 'lodash/map';
import {MenuTypes} from '../BaseMenu';
import TooltipPositions from '../../../constants/tooltips';
import {store} from '../../../';

class ShapeMenu extends Component {
    constructor(props){
        super(props);
        this.menuType = MenuTypes.sideMenu
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
        this.toggleShapeType = this.toggleShapeType.bind(this);
        this.changeDimensions = this.changeDimensions.bind(this);
    }
    componentWillReceiveProps(nextProps){
        const {colorPalette, shapeList} = this.props.canvasData;
        if(nextProps.canvasData.colorPalette !== colorPalette){
            this.renderPalette(nextProps.canvasData.colorPalette);
        }
        if(nextProps.shapeList !== shapeList){
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
        store.dispatch(selectShape(item))
    }
    toggleShapeType(type){
        store.dispatch(changeShapeType(type))
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
    renderShapeList(){
        return map(this.props.shapeList, item => {
            return (
                <div className='layer-menu-shape-item' onClick={() => this.selectShape(item)}>
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
        store.dispatch(selectShape(item.id))
    }
    displayShape(style){
        return <div style={style.shapeDisplay}></div>
    }
    renderPalette(){
        return map(this.props.canvasData.colorPalette, item => {
            return <div className='color-menu-color-palette-item' style={{backgroundColor: item.color}}></div>
        });
    }
    changeDimensions(attribute, plus){
        if(attribute === Common.width){
            const newWidth = plus ? this.props.canvasData.shapeWidth + 5 : this.props.canvasData.shapeWidth - 5;
            store.dispatch(changeShapeWidth(newWidth))
        }
        if(attribute === Common.height){
            const newHeight = plus ? this.props.canvasData.shapeHeight + 5 : this.props.canvasData.shapeHeight - 5;
            store.dispatch(changeShapeHeight(newHeight))
        }
        if(attribute === Common.radius){
            const newRadius = plus ? this.props.canvasData.shapeRadius + 5 : this.props.canvasData.shapeRadius - 5;
            store.dispatch(changeShapeRadius(newRadius))
        }
    }
    render(){
        const {
            shapeColor, 
            backgroundColor, 
            shapeRadius, 
            shapeType,
            shapeWidth,
            shapeHeight
        } = this.props.canvasData;
        const style = {
            main: {
                width: `${Size.sidePanelMenuWidth}px`,
                left: `${Size.sidePanelWidth}px`,
            },
            display: {
                backgroundColor: `${backgroundColor}`
            },
            shapeDisplay: {
                backgroundColor: shapeColor,
                width: '50px',
                height: '50px',
                borderRadius: shapeType === Common.square ? '0' : '50%'
            }
          };
          let color = null;
          if(this.state.status === Common.shape){
            color = this.state.dirty ? this.state.value : shapeColor;
          } else {
            color = this.state.dirty ? this.state.value : backgroundColor;
          }
        return (
            <div className='layer-menu-2' style={style.main}>
                <h3 className='layer-menu-2-title'>{this.props.name}</h3>
                <div className='layer-menu-2-display'>
                    <div className='layer-menu-2-display-inner' style={{backgroundColor: backgroundColor}}>
                        {this.displayShape(style)}
                    </div>
                </div>
                <h4 className='shape-menu-title'>{Common.type}</h4>
                <div className='shape-menu-type-display'>
                    <div 
                        className='shape-menu-type-square' 
                        style={{border: shapeType === Common.square ? '2px solid white' : 'none'}}
                        onClick={() => this.toggleShapeType(Common.square)}
                    ></div>
                    <div 
                        className='shape-menu-type-circle' 
                        style={{border: shapeType === Common.circle ? '2px solid white' : 'none'}}
                        onClick={() => this.toggleShapeType(Common.circle)}
                    ></div>
                </div>
                
                <h4 className='shape-menu-title'>{Common.color}</h4>
                <ColorPicker 
                    color={color} 
                    colorChange={this.handleColorChange}
                    shapeColor={shapeColor}
                    backgroundColor={backgroundColor}
                />
                
                <h4 className='shape-menu-title'>{Common.size}</h4>
                {shapeType === Common.square && (
                    <div className='shape-menu-size-row'>
                        <div className='shape-menu-size-label'>{Common.width}</div>
                        <div className='shape-menu-size-input-wrap'>
                            <i className="far fa-minus-circle shape-menu-size-icon" onClick={() => this.changeDimensions(Common.width, false)}></i>
                            <input className='shape-menu-size-input' value={shapeWidth}/>
                            <i className="far fa-plus-circle shape-menu-size-icon" onClick={() => this.changeDimensions(Common.width, true)}></i>
                        </div>
                    </div>
                )}
                {shapeType === Common.square && (
                    <div className='shape-menu-size-row'>
                        <div className='shape-menu-size-label'>{Common.height}</div>
                        <div className='shape-menu-size-input-wrap'>
                            <i className="far fa-minus-circle shape-menu-size-icon" onClick={() => this.changeDimensions(Common.height, false)}></i>
                            <input className='shape-menu-size-input' value={shapeHeight}/>
                            <i className="far fa-plus-circle shape-menu-size-icon" onClick={() => this.changeDimensions(Common.height, true)}></i>
                        </div>
                    </div>
                )}
                
                {shapeType === Common.circle && (
                    <div className='shape-menu-size-row'>
                        <div className='shape-menu-size-label'>{Common.radius}</div>
                        <div className='shape-menu-size-input-wrap'>
                            <i className="far fa-minus-circle shape-menu-size-icon" onClick={() => this.changeDimensions(Common.radius, false)}></i>
                            <input className='shape-menu-size-input' value={shapeRadius}/>
                            <i className="far fa-plus-circle shape-menu-size-icon" onClick={() => this.changeDimensions(Common.radius, true)}></i>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}


export default ShapeMenu;
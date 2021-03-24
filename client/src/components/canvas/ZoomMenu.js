import React, {Component} from 'react';
import ColorPicker from './ColorPicker';
import Common from '../../constants/common';
import {Button, InputGroup, FormControl} from 'react-bootstrap';
import Size from '../../constants/size';

class ColorMenu extends BaseMenu {
    constructor(props){
        super(props);
        this.state = {
            value: 'rgb(255,0,0)',
            colorSat: 'rgb(255,0,0)'
        }
        this.handleColorChange = this.handleColorChange.bind(this)
    }
    handleColorChange(value) {
        this.setState(state => ({...state, value}))
    }
    getAdditionalComponents(){
        const style = {
            main: {
                width: Size.sidePanelMenuWidth
            },
            shape: {
                width: '50%',
                height: '50%',
                backgroundColor: `${this.props.hex}`
            }
          };
        return (
            <div className='side-panel-content'>
                <h3 className='side-panel-title'>{Common.zoom}</h3>
                <div className='color-menu-display'>
                    <div style={style.shape}></div>
                </div>
                <ColorPicker color={this.state.value} colorChange={this.handleColorChange}/>
                <Button className='button' variant="primary">Apply</Button>
            </div>
        )
    }
}

export default ColorMenu;
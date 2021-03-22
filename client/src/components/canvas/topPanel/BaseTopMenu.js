import React, {Component} from 'react';
import Size from '../../../constants/size';
import Colors from '../../../constants/colors';
import SizeMenu from './SizeMenu';
import ZoomMenu from './ZoomMenu';
import ColorMenu from './ColorMenu';
import ShapeMenu from './ShapeMenuModal';
import PaletteMenu from './PaletteMenu';
import Common from '../../../constants/common';
import {connect} from 'react-redux';

export const MenuTypes = {
    sideMenu: 'sideMenu',
    topMenu: 'topMenu'
}

/**
 * Renders the individual top menu components individually. 
 * Controls which menus are open 
 */
class BaseTopMenu extends Component {
    constructor(props) {
        super(props);

        this.handleClose = this.handleClose.bind(this);
    }
    handleMenus(){
        switch(this.props.name){
            case Common.size:
                return (
                    <SizeMenu 
                        closeMenu={this.props.closeMenu}
                        canvasData={this.props.canvasData}
                    />
                )
            case Common.shape:
                return (
                    <ShapeMenu canvasData={this.props.canvasData}/>
                )
            case Common.color: 
                return (
                    <ColorMenu canvasData={this.props.canvasData}/>
                )
            case Common.palette: 
                return (
                    <PaletteMenu canvasData={this.props.canvasData}/>
                )
            case Common.zoom: 
                return (
                    <ZoomMenu canvasData={this.props.canvasData}/>
                )
            default:
                return;
        }
    }
    handleClose(event){
        event.preventDefault();
        this.props.closeMenu()
    }
    render() {
        const leftPosition = this.props.position * 
            Size.panelButtonWidth + Size.panelButtonWidth,
            style ={ 
                main: {
                    left: `${leftPosition}px`,
                }}
        return (
            <div className='top-panel-menu' style={style.main}>
                <div className='top-panel-menu-top'>
                    <div className='top-panel-icon' onClick={this.handleClose}>
                        <i className="fal fa-window-close panel-button"></i>
                    </div>
                </div>
                {this.handleMenus()}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        canvasData: state.canvas.canvasData
    }
}

export default connect(mapStateToProps)(BaseTopMenu);
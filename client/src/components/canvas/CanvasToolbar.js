import React, { Component } from 'react';
import { toggleCanvasAction } from '../../actions/canvas/canvasActions';
import MenuIcon from '../MenuIcon';
import { connect } from 'react-redux';
import SaveMenu from '../SaveMenu';

class CanvasToolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveOpen: false
        }
    }
    updateCanvasAction = (action) => {
        this.props.dispatch(toggleCanvasAction(action))
    }
    handleSave = () => {
        const { canvasId } = this.props;
        if(canvasId){

        }
    }
    handleClick = () => {

    }
    createLeftMenu = () => {
        const { action } = this.props;
        return (
            <div style={{
                height: '40px',
                display: 'flex',
            }}>
                <MenuIcon 
                    icon='add'
                    active={action === 'add'}
                    handleClick={() => this.updateCanvasAction('add')}
                    tooltipPosition='bottom left'
                    tooltip='Create new shape'
                />
                <MenuIcon 
                    icon='edit'
                    handleClick={() => this.updateCanvasAction('edit')}
                    active={action === 'edit'}
                    tooltip='Edit shapes'
                />
            </div>
        )
    }
    createRightMenu = () => {
        const { saveOpen } = this.state;
        const { action, canvasId } = this.props;
        return (
            <div style={{
                height: '40px',
                display: 'flex',
            }}>
                <SaveMenu
                    saveCanvas={this.props.saveCanvas}
                />
            </div>
        )
    }
    render(){
        return (
            <div 
                className='dark-1' 
                style={{
                    height: '40px',
                    display: 'flex', 
                    justifyContent: 'space-between',
                    padding: '0 10px',
                    alignItems: 'center'
                }}
            >
                {this.createLeftMenu()}
                {this.createRightMenu()}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const { action } = state.canvas;
    return {
        action,
        canvasId: state.canvas._id
    }
}

export default connect(mapStateToProps)(CanvasToolbar);
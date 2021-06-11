import React, {Component} from 'react';
import Common from '../../constants/common';
import { Menu, Icon, Popup } from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import TooltipPositions from '../../constants/tooltips';

class PanelButton extends Component {
    constructor(props){
        super(props);
        this.state = {
            hover: false,
            class: 'panel-button'
        }
        this.handleHover = this.handleHover.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleTooltipEvents = this.handleTooltipEvents.bind(this);
    }
    handleHover(isHover) {
        this.setState(state => ({
            ...state,
            hover: isHover
        }))
    }
    handleTooltipEvents(e){
        e.stopPropagation();
        this.handleHover(false)
    }
    handleClick(){
        this.props.onClick()
    }
    render(){
        const { icon, fa, onClick } = this.props;
         return (
            <Popup
                inverted
                trigger={
                    <Menu.Item onClick={onClick}>
                        {fa ? (
                            <i className={icon}></i>
                        ) : (
                            <Icon name={icon} inverted/>
                        )}
                    </Menu.Item>
                }
                content={<div>{this.props.tooltip}</div>}
                position='right center'
            />
        )
    }
}

export default PanelButton;
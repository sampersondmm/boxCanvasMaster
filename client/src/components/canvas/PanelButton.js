import React, {Component} from 'react';
import Common from '../../constants/common';
import { Menu, Icon, Popup } from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import TooltipPositions from '../../constants/tooltips';
import CustomTooltip from '../CustomTooltip';

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

            <CustomTooltip
                inverted={true}
                position='right center'
                content={this.props.tooltip}
                trigger={
                    <Menu.Item onClick={onClick}>
                        {fa ? (
                            <i className={icon}></i>
                        ) : (
                            <Icon name={icon} inverted/>
                        )}
                    </Menu.Item>
                }
            />
        )
    }
}

export default PanelButton;
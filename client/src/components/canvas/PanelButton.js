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
        let tooltipClass = '';
        switch(this.props.tooltipPosition){
            case TooltipPositions.bottom:
                tooltipClass = 'panel-tooltip-bottom';
                break;
            case TooltipPositions.bottomRight:
                tooltipClass = 'panel-tooltip-bottom-right';
                break;
            case TooltipPositions.right:
                tooltipClass = 'panel-tooltip-right';
                break;
            case TooltipPositions.left:
                tooltipClass = 'panel-tooltip-left';
                break;
            default:
                tooltipClass = 'panel-tooltip';
                break 
        }
         return (
            <Popup
                style={{margin: '0', borderRadius: '0', height: '40px'}}
                basic
                trigger={
                    <Menu.Item onClick={onClick}>
                        {fa ? (
                            <i className={icon}></i>
                        ) : (
                            <Icon name={icon} inverted/>
                        )}
                    </Menu.Item>
                }
                content={this.props.tooltip}
                position='right center'
            />
        )
    }
}

export default PanelButton;
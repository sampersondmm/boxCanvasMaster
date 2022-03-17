import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';
import CustomTooltip from './CustomTooltip';

class MenuIcon extends Component {
    constructor(props){
        super(props)
    }
    render(){
        const { icon, size, handleClick, active, tooltip, tooltipPosition } = this.props;
        return (
            <CustomTooltip
                trigger={
                    <div 
                        onClick={handleClick}
                        style={{
                            width: `${size || 40}px`,
                            height: `${size || 40}px`,
                            margin: '0 5px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <Icon 
                            className='font-color'
                            color={active ? 'yellow' : ''}
                            style={{margin: '0'}}
                            size='large'
                            name={icon}
                        />
                    </div>
                }
                content={tooltip}
                position={tooltipPosition || 'bottom center'}
            />
        )
    }
}

export default MenuIcon
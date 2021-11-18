import React from 'react';
import { Icon } from 'semantic-ui-react';

const AccordianIcon = ({
    width,
    height,
    disabled,
    onClick,
    spaceRight,
    hideIcon,
    color,
    style,
    size,
    icon
}) => {
    const main = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: disabled ? '1px solid rgb(80,80,80)' : '1px solid rgb(120,120,120)',
        borderRadius: '2px',
        marginRight: spaceRight,
        cursor: 'pointer',
        width,
        height,
        ...style
    }
    const handleClick = () => {
        if(!disabled){
            onClick()
        }
    }
    return (
        <div style={main} onClick={handleClick}>
            {!hideIcon && (
                <Icon 
                    name={icon} 
                    className={color ? '' : 'font-color'}
                    color={color ? color : null}
                    disabled={disabled}
                    size={size || 'small'}
                    style={{ margin: '0', padding: '0'}}
                />
            )}
        </div>
    )
}

export default AccordianIcon;
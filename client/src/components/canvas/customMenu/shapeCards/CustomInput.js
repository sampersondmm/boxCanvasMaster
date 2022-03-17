import React from 'react';
import { Menu, Input, Icon } from 'semantic-ui-react';
import Colors from '../../../../constants/colors';


const CustomInput = ({
    value,
    type = 'number',
    label,
    onChange,
    inline = true,
    onIncrement,
    placeholder,
    useIncrement,
}) => {
    const handleIncrement = (type) => {
        onIncrement(type)
    }
    const createIncrement = (type) => {
        const border = type === 'up' ?
            {borderLeft: '0'} :
            {borderRight: '0'}
        return (
            <div style={{width: '25px', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${Colors.BORDER_COLOR}`, ...border}}>
                <Icon className='font-color' name={type === 'up' ? 'plus' : 'minus'} style={{cursor: 'pointer', margin: '0'}} onClick={() => handleIncrement(type)}/>
            </div>
        )
    }
    const createInlineInput = () => {
        return (
            <Menu.Item style={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                paddingBottom: '0'
            }}>
                <Menu.Header 
                    className='font-color' 
                    style={{
                        margin: '0'
                    }}
                >
                    {label}
                </Menu.Header>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'flex-end'
                }}>
    
                    {useIncrement && createIncrement('down')}
                    <Input
                        // inverted={inverted}
                        style={!useIncrement ? {marginRight: '25px'} : {}}
                        className='inverted-input-inline'
                        type={type}
                        value={value}
                        onChange={(e, data) => onChange(data, label)}
                        placeholder={placeholder}
                    />
                    {useIncrement && createIncrement('up')}
                </div>
            </Menu.Item>
        )
    }
    const createInput = () => {
        return (
            <Menu.Item style={{
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'flex-start', 
                paddingBottom: '0'
            }}>
                <Menu.Header 
                    className='font-color' 
                    style={{
                        margin: '20px',
                    }}
                >
                    {label}
                </Menu.Header>

                    <Input
                        className='inverted-input'
                        style={{width: '100%'}}
                        type={type}
                        value={value}
                        onChange={(e, data) => onChange(data, label)}
                        placeholder={placeholder}
                    />
            </Menu.Item>
        )
    }
    if(inline){
        return createInlineInput();
    } else {
        return createInput();
    }
    return null;
}

export default CustomInput;
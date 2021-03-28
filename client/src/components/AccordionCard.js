import React from 'react';
import { Menu, Accordion, Icon } from 'semantic-ui-react'; 
import Common from '../constants/common';
import Size from '../constants/size';
import AccordionIcon from './AccordionIcon';
 

const AccordionCard = ({
    open,
    handleOpen,
    header,
    index,
    selection,
    content,
    handleSelect
}) => {
    const center = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid rgb(120,120,120)',
        borderRadius: '2px',
        cursor: 'pointer',
    }
    const selected = selection === header;
    return (
            <Menu.Item className='shape-accordian-option' style={{margin: '0 2px'}}>
                <Accordion.Title
                    index={index}
                    style={{
                        cursor: 'default',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <AccordionIcon 
                            width='20px'
                            spaceRight='7px'
                            disabled={false}
                            height='20px'
                            onClick={handleOpen}
                            icon={open ? 'plus' : 'minus'}
                        />
                        {header}
                    </div>
                    <AccordionIcon
                        width='15px'
                        height='15px'
                        disabled={false}
                        onClick={handleSelect}
                        color='teal'
                        hideIcon={selection !== header}
                        icon='check'
                    />
                    {/* <div 
                        style={{
                            ...center,
                            width: '15px',
                            height: '15px',
                            // backgroundColor: 'rgba(120,120,120,0.4)',
                        }}
                        onClick={handleSelect}
                    >
                        {selected && <Icon name='check' size='small' style={{margin: '0', padding: '0'}} color='teal'/>}
                    </div> */}
                </Accordion.Title>
                <Accordion.Content active={open}>
                    {content}
                </Accordion.Content>
            </Menu.Item>
    )
}

export default AccordionCard;
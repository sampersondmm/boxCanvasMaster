import React from 'react';
import { Menu, Accordion } from 'semantic-ui-react'; 
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
                </Accordion.Title>
                <Accordion.Content active={open}>
                    {content}
                </Accordion.Content>
            </Menu.Item>
    )
}

export default AccordionCard;
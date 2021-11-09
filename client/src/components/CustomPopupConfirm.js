import React, { Component } from 'react';
import { Popup, Button } from 'semantic-ui-react'

class CustomPopupConfirm extends Component {
    constructor(props){
        super(props)
    }
    render(){
        const { 
            trigger,
            content, 
            position 
        } = this.props;
        return (
            <Popup
                on='click'
                info
                trigger={trigger}
                content={
                    <div>
                        {content}
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Button primary>Confirm</Button>
                        </div>
                    </div>
                }
                position={position ? position : 'bottom center'}
            />
        )
    }
}

export default CustomPopupConfirm;
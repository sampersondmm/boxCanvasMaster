import React, { Component } from 'react';
import { Popup, Button } from 'semantic-ui-react'

class CustomPopupConfirm extends Component {
    constructor(props){
        super(props)
        this.state = {
            open: false
        }
    }
    onOpen = () => {
        this.setState((state) => ({
            ...state,
            open: true
        }))
    }
    close = async () => {
        await this.props.onConfirm()
        this.setState((state) => ({
            ...state,
            open: false
        }))
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
                open={this.state.open}
                onOpen={this.onOpen}
                info
                trigger={trigger}
                content={
                    <div>
                        {content}
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Button
                                primary
                                onClick={this.props.onConfirm}
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                }
                position={position ? position : 'bottom center'}
            />
        )
    }
}

export default CustomPopupConfirm;
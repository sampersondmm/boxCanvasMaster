import React, {Component} from 'react';
import { Popup } from 'semantic-ui-react';

class CustomTooltip extends Component {
    constructor(props){
        super(props);
    }
    render(){
        const { icon, fa, onClick, position } = this.props;
        return (
            <Popup
                inverted
                trigger={this.props.trigger}
                content={<div>{this.props.content}</div>}
                position={position ? position : 'bottom center'}
            />
        )
    }
}

export default CustomTooltip;
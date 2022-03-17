import React, {Component} from 'react';

class IsVisible extends Component{
    render(){
        if(this.props.visible){
            return {...this.props.children}
        } else {
            return null
        }
    }
}

export default IsVisible;
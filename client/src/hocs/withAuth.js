import { isEmpty } from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';

class WithAuth extends Component {
    constructor(props){
        super(props)
    }
    returnComponent = () => {
        const { userProfile } = this.props;
        if(!isEmpty(userProfile)){
            return {...this.props.children}
        } else {
            this.props.history.push('/signin')
            return null
        }
    }
    render(){
        return this.returnComponent();
    }
}

export default WithAuth;

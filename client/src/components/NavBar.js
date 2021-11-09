import React, {Component} from 'react';
// import {Navbar, Nav, NavDropdown,Form, FormControl, Button} from 'react-bootstrap';
import {Menu} from 'semantic-ui-react'
import {Link} from 'react-router-dom';
import logo from '../images/newLogo.png';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {logoutUser} from '../actions/userActions';
import { clearCanvasData } from '../actions/canvasActions';
import { Icon } from 'semantic-ui-react'

class NavBar extends Component {
    constructor(props){
        super(props);
    }
    logout = () => {
        const { props } = this;
        logoutUser();
    }
    newCanvasRoute = () => {
        this.props.dispatch(clearCanvasData())
        this.props.history.push('/canvas/new')
    }
    leftMenu = () => {
        return (
            <Menu.Menu position='left'>
                <Link to='/'>
                    <Menu.Item 
                        className='navbar-link' 
                    >
                        <div className='navbar-logo'>
                            <img className='navbar-logo-icon' src={logo}/>
                        </div>
                    </Menu.Item>
                </Link>
                <Menu.Item 
                    className='navbar-link'
                    onClick={this.newCanvasRoute}
                >
                    New Canvas
                </Menu.Item>
            </Menu.Menu>
        )
    }
    rightMenu = () => {
        return (
            <Menu.Menu position='right'>
                <Link to='/signin'>
                    <Menu.Item 
                        className='navbar-link' 
                        onClick={this.logout}
                    >
                            <Icon name="sign-out"/>
                    </Menu.Item>
                </Link>
            </Menu.Menu>
        )
    }
    render(){
        return (
            <Menu
                inverted
                style={{height: '50px', margin: '0', borderRadius: '0'}}
            >
                {this.leftMenu()}
                {this.rightMenu()}
            </Menu>
        )
    }
}

const mapStateToProps = state => {
    return {
        currentUser: state.currentUser
    }
}

export default connect(mapStateToProps)(NavBar);
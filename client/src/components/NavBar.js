import React, {Component} from 'react';
import {Menu, Dropdown, Header} from 'semantic-ui-react'
import {Link} from 'react-router-dom';
import logo from '../images/newLogo.png';
import {connect} from 'react-redux';
import {logoutUser} from '../actions/userActions';
import { clearCanvasData } from '../actions/canvas/canvasActions';
import { Icon } from 'semantic-ui-react'

class NavBar extends Component {
    constructor(props){
        super(props);
    }
    newCanvasRoute = () => {
        this.props.dispatch(clearCanvasData())
        this.props.history.push('/canvas/new')
    }
    signOut = () => {
        this.props.dispatch(logoutUser())
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
                    <div className='navbar-text'>New Canvas</div>
                </Menu.Item>
            </Menu.Menu>
        )
    }
    rightMenu = () => {
        const { username } = this.props.userProfile;
        return (
            <Menu.Menu position='right' inverted>
                <Dropdown
                    item
                    icon='user'
                >
                    <Dropdown.Menu
                        style={{
                            width: '200px',
                            backgroundColor: '#1b1c1d',
                        }}
                    >
                        <Dropdown.Item
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                display: 'flex'
                            }}
                            >
                            <Icon name='user' inverted/>
                            <Header style={{color: 'white', margin: '0'}}>{username}</Header>
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={this.signOut}
                            style={{
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                display: 'flex'
                            }}
                        >
                            <Icon name='sign-out' inverted/>
                            <div style={{color: 'white', margin: '0'}}>Sign Out</div>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Menu.Menu>
        )
    }
    render(){
        return (
            <Menu
                className='navbar-main'
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
        currentUser: state.currentUser,
        userProfile: state.user.userProfile
    }
}

export default connect(mapStateToProps)(NavBar);
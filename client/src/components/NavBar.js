import React, {Component} from 'react';
// import {Navbar, Nav, NavDropdown,Form, FormControl, Button} from 'react-bootstrap';
import {Menu} from 'semantic-ui-react'
import {Link} from 'react-router-dom';
import logo from '../images/newLogo.png';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {logoutUser} from '../actions/userActions';
import { Icon } from 'semantic-ui-react'

class NavBar extends Component {
    constructor(props){
        super(props);
    }
    logout(e){
        e.preventDefault();
        logoutUser();
    }
    render(){
        return (
            // <Navbar bg="dark" variant="dark" expand="lg">
            //     <Navbar.Brand> 
            //         <div className='navbar-logo'>
            //             <img className='navbar-logo-icon' src={logo}/>
            //         </div>
            //     </Navbar.Brand>
            //     <Navbar.Brand> 
            //         <Link className='button-link' to='/'>Box Canvas</Link>
            //     </Navbar.Brand>
            //     <Navbar.Toggle aria-controls="basic-navbar-nav" />
            //     <Navbar.Collapse id="basic-navbar-nav">
            //         <Nav className="mr-auto">
            //         <Nav.Link>
            //             <Link className='button-link' to='/'>Home</Link>
            //         </Nav.Link>
            //         <Nav.Link>
            //             <Link 
            //                 className='button-link' 
            //                 to={'/canvas/new'}>New Canvas</Link>
            //         </Nav.Link>
            //         <Nav.Link>
            //             <Link className='button-link' to='/'>Help</Link>
            //         </Nav.Link>
            //         </Nav>


            //         {/* Right Navigation */}
            //         <Nav inline >
            //             <Nav.Link>
            //                 <Link className='button-link' to='/'>Account</Link>
            //             </Nav.Link>
            //             <Nav.Link>
            //                 <a className='button-link' onClick={this.logout}>Sign Out</a>
            //             </Nav.Link>
            //         </Nav>
            //     </Navbar.Collapse>
            // </Navbar>
            <Menu
                inverted
                style={{height: '50px', margin: '0', borderRadius: '0'}}
            >
                <Menu.Item >
                    <div className='navbar-logo'>
                        <img className='navbar-logo-icon' src={logo}/>
                    </div>
                </Menu.Item>
                <Menu.Item >
                    <Link className='button-link' to='/'>Box Canvas</Link>
                </Menu.Item>
                <Menu.Item >
                    <Link className='button-link' to={'/canvas/new'}>New Canvas</Link>
                </Menu.Item>
                <Menu.Item >
                    <Link className='button-link' to='/'>Help</Link>
                </Menu.Item>
                <Menu.Item onClick={this.logout}>
                    <Icon name="sign-out"/>
                </Menu.Item>
            </Menu>
        )
    }
}

const mapStateToProps = state => {
    return {
        currentUser: state.currentUser
    }
}

export default connect(mapStateToProps, {logoutUser})(NavBar);
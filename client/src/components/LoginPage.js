import React, {Component} from 'react';
import {Form, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import logo from '../images/newLogo.png';
import UserAPI from '../api/userApi';
import { connect } from 'react-redux';

const userApi = new UserAPI();

class LoginPage extends Component {
    constructor(props){
        super(props);
        this.submitForm = this.submitForm.bind(this);
        this.onChange = this.onChange.bind(this);
        this.state = {
            username: '',
            password: '',
            rememberMe: false
        }
    }
    onChange(field, event){ 
        const {value} = event.target;
        let {username, password, rememberMe} = this.state;
        switch(field){
            case 'username':
                username = value;
                break;
            case 'password':
                password = value;
                break;
            case 'rememberMe':
                rememberMe = value;
                break;
            default:
                break;
        }
        this.setState(state => ({
            ...state,
            username,
            password
        }))
    }
    submitForm = async () => {
        const {username, password} = this.state;
        const { authType } = this.props;
        try {
            if(authType === 'signin'){
                await userApi.loginUser({username, password})
            } else if (authType === 'signup'){
                await userApi.createNewUser({username, password});
            }
            this.props.history.push('/')
        } catch (error) {
            console.log(error)
        }
    }
    render(){
        const {username, password} = this.state,
            {authType, error, history, removeError} = this.props,
            buttonLink = authType === 'signup' ? '/signin' : '/signup';

            //Remove error on route change
            history.listen(() => {
                removeError()
            })

        return(
            <div className='login-page-main'>
                <div className='login-page-form'>
                    <div className='login-page-logo-container'>
                        <img className='login-page-logo' src={logo}/>
                        <h4 className='login-page-title'>Box Canvas</h4>
                    </div>
                    <h2 className='login-page-header'>{authType === 'signup' ? 'Sign Up' : 'Login'}</h2>
                    <Form className='login-page-wrap'>
                        {error.message && <div className='login-page-error'>{error.message}</div>}
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control 
                                type="string" 
                                placeholder="Username" 
                                value={username} 
                                onChange={e => this.onChange('username', e)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Password" 
                                value={password} 
                                onChange={e => this.onChange('password', e)}
                            />
                        </Form.Group>

                        <div className='login-page-button-wrap'>
                            <Form.Group controlId="formBasicCheckbox">
                                <Form.Check 
                                    type="checkbox" 
                                    label="Remember Me" 
                                    value={this.state.rememberMe} 
                                    onChange={e => this.onChange('rememberMe', e)}
                                />
                            </Form.Group>
                            <div>Forgot Password?</div>
                        </div>
                        <div className='login-page-button-wrap'>
                            <Button 
                                variant="outline-primary" 
                                disabled={!username && !password}
                                onClick={this.submitForm}
                            >
                                {authType === 'signup' ? 'Sign Up' : 'Login'}
                            </Button>
                            <Link to={buttonLink}>
                                <Button 
                                    variant="outline-dark"
                                >
                                    {authType === 'signup' ? 'Returning User?' : 'New User?'}
                                </Button>
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {}
}

export default connect()(LoginPage);
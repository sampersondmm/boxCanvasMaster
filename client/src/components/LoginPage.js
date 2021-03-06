import React, {Component} from 'react';
import {Form, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import logo from '../images/newLogo.png';
import CircleCanvas from './loginAnimation';
import {apiCall} from '../actions/api'; 
import {authorizeUser} from '../actions/userActions';

class LoginPage extends Component {
    constructor(props){
        super(props);
        this.submitForm = this.submitForm.bind(this);
        this.onChange = this.onChange.bind(this);
        this.state = {
            email: '',
            password: '',
            rememberMe: false
        }
    }
    onChange(field, event){ 
        const {value} = event.target;
        let {email, password, rememberMe} = this.state;
        switch(field){
            case 'email':
                email = value;
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
            email,
            password
        }))
    }
    submitForm() {
        const {email, password} = this.state,
            {authType} = this.props;
        this.props.onAuth(authType, {email, password})
            .then(() => {
                this.props.history.push('/')
            })
            .catch(() => {
                return;
            })
    }
    render(){
        const {email, password} = this.state,
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
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="Email" 
                                value={email} 
                                onChange={e => this.onChange('email', e)}
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
                                disabled={!email && !password}
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
                <div className='login-page-design'></div>    
            </div>
        )
    }
}

export default LoginPage;
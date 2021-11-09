import React, {Component} from 'react';
import { Form, Header, Checkbox, Message } from 'semantic-ui-react'
import {Link} from 'react-router-dom';
import logo from '../images/newLogo.png';
import UserAPI from '../api/userApi';
import { connect } from 'react-redux';

const userApi = new UserAPI();

class LoginPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            rememberMe: false,
            error: ''
        }
    }
    onChange = (field, value) => { 
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
        let response = null;
        try {
            if(authType === 'signin'){
                response = await userApi.loginUser({username, password})
                this.props.addNotification({
                    type: 'success',
                    message: `Successfully logged in as ${username}!`
                })
            } else if (authType === 'signup'){
                response = await userApi.createNewUser({username, password});
                this.props.addNotification({
                    type: 'success',
                    message: `Successfully created new user ${username}!`
                })
            }
            this.props.history.push('/')
        } catch (error) {
            this.setState((state) => ({
                ...state,
                error: error.message
            }))
        }
    }
    changeAuthType = () => {
        const { authType } = this.props;
        const url = authType === 'signin' ? '/signup' : '/signin'
        this.props.history.push(url)
    }
    render(){
        const {username, password, error} = this.state,
            {authType, history, removeError} = this.props,
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
                    <Header>{authType === 'signup' ? 'SIGN UP' : 'SIGN IN'}</Header>
                    <Form style={{ width: '300px'}}>
                        {error && (
                            <Message
                                negative
                                content={error}
                            />
                        )}
                        <Form.Input
                            label='Username'
                            onChange={(e) => this.onChange('username', e.target.value)}
                            value={username}
                            placeholder='Username...'
                        />
                        <Form.Input
                            label='Password'
                            type='password'
                            onChange={(e) => this.onChange('password', e.target.value)}
                            value={password}
                            placeholder='Password...'
                        />
                        <Form.Button 
                            fluid
                            primary
                            onClick={() => this.submitForm()}
                            content={authType === 'signup' ? 'Sign Up' : 'Login'}
                        />
                        <Form.Field style={{display: 'flex', alignItems: 'center', justifyContent: 'space-evenly'}}>
                            <Checkbox
                                className='checkbox'
                                style={{margin: '0', padding: '0'}}
                                label='Remember me'
                            />
                            <div 
                                style={{cursor: 'pointer'}}
                                onClick={this.changeAuthType}
                            >
                                {authType === 'signup' ? 'Already a member?' : 'Become a new user.'}
                            </div>
                        </Form.Field>
                    </Form>
                </div>
            </div>
        )
    }
}

                            {/* <Button 
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
                            </Link> */}

const mapStateToProps = (state) => {
    return {}
}

export default connect()(LoginPage);
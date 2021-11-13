import React, {Component} from 'react';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import Canvas from './canvas/Canvas';
import {Switch, Route, withRouter, Redirect} from 'react-router-dom';
import {removeError} from '../actions/errorActions';
import {connect} from 'react-redux';
import WithAuth from '../hocs/WithAuth';
import { Message } from 'semantic-ui-react';
import uuid from 'react-uuid'
import store from '..';

class Notifification extends Component {
  constructor(props){
    super(props)
  }
  componentDidMount(){
    const { notification } = this.props
    this.props.autoDismiss(notification.id);
  }
  render(){
    const { notification } = this.props;
    let color = ''
    switch(notification.type){
      case 'success':
        color = 'rgb(154, 214, 195)'
        break;
      default: 
        break;
    }
    return (
      <Message 
        style={{
          // backgroundColor: color,
          // border: '2px solid rgb(87, 122, 111)',
          width: '100%',
        }}
        header='Success'
        success
        onDismiss={() => this.handleDismiss(notification.id)}
        content={notification.message}
      />
    )
  }
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      notifications: []
    }
  }
  autoDismiss = (id) => {
    setTimeout(() => {
      this.setState((state) => ({
        ...state,
        notifications: state.notifications.filter((x) => x.id !== id)
      }))
    }, 2000)
  }
  renderNotifications = () => {
    const { notifications } = this.state;
    return (
      <div style={{
        position: 'absolute',
        right: '20px',
        bottom: '20px',
        width: '300px'
      }}>
      {notifications.map((notification) => {
        return (
          <Notifification
            notification={notification}
            autoDismiss={this.autoDismiss}
          />
        )
        })}
      </div>
    )
  }
  handleDismiss = (id) => {
    let { notifications } = this.state;
    notifications = notifications.filter((x) => x.id !== id)
    this.setState((state) => ({
      notifications
    }))
  }
  addNotification = (notification) => {
    notification.id = uuid();
    this.setState((state) => ({
      ...state,
      notifications: [...state.notifications, notification]
    }))
  }
  render(){
    const {userProfile} = this.props;
    return (
      <div style={{width: '100%', height: '100%', position: 'relative'}}>
        <Switch>
          <Route 
            exact 
            path='/' 
            render={props => {
              return (
                <WithAuth {...props} userProfile={userProfile}>
                  <HomePage
                    addNotification={this.addNotification}
                    {...props}
                  />
                </WithAuth>
              )
            }}
          />
          <Route 
            exact 
            path='/signup' 
            render={props => {
              return (
                <LoginPage 
                  authType='signup'
                  addNotification={this.addNotification}
                  removeError={removeError}
                  {...props}
                />
              )
            }}
          />
          <Route
            exact
            path='/signin'
            render={props => {
              return (
                <LoginPage 
                  authType='signin'
                  addNotification={this.addNotification}
                  removeError={removeError}
                {...props}
              />
              )
            }}
          />
          <Route 
            exact 
            path='/canvas/new' 
            render={props => {
              return (
                <WithAuth {...props} userProfile={userProfile}>
                  <Canvas 
                    {...props}
                    idFromUrl=''
                    addNotification={this.addNotification}
                  />
                </WithAuth>
              )
            }}
          />
          <Route 
            path='/canvas/:canvasId' 
            exact
            render={props => {
              const id = props.match.params.canvasId
                return (
                  <WithAuth {...props} userProfile={userProfile}>
                    <Canvas 
                      {...props}
                      idFromUrl={id}
                      addNotification={this.addNotification}
                    />
                  </WithAuth>
                )
            }}
          />
        </Switch>
        {/* {this.renderNotifications()} */}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { userProfile } = state.user;
  const { canvas } = state;
  return {
    userProfile,
    error: state.error,
    canvasId: canvas._id,
    isAuthenticated: state.user.isAuthenticated
  }
}

export default withRouter(connect(mapStateToProps)(App));

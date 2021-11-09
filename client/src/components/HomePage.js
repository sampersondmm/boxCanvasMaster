import React, {Component} from 'react';
import NavBar from './NavBar';
import {fetchCanvasList} from '../actions/canvasActions';
import { Header } from 'semantic-ui-react';
import {connect} from 'react-redux';
import {apiCall} from '../utils/apiUtils';
import CanvasList from './CanvasList';
import CanvasAPI from '../api/canvasApi';

const canvasApi = new CanvasAPI();

class HomePage extends Component {
    constructor(props){
        super(props);
        this.state = {
            canvasList: []
        }
    }
    componentDidMount(){
        this.fetchUserCanvas();
    }
    fetchUserCanvas = async () => {
        const { userProfile } = this.props;
        let { canvasList } = this.state;
        try {
            canvasList = await canvasApi.fetchCanvasList(userProfile._id);
        } catch (error) {
            console.log(error)
        }
        this.setState((state) => ({
            ...state,
            canvasList
        }))
    }
    render(){
        const { userProfile } = this.props;
        const { canvasList } = this.state;
        return (
            <div className='homepage'>
                <NavBar {...this.props}/>
                <div className='homepage-body'>
                    <div className='canvaslist-section'>
                        <div className='canvaslist-header'>
                            <Header as='h2' style={{padding: '0', margin: '0'}}>CURRENT PROJECTS</Header>
                        </div>
                        <CanvasList 
                            {...this.props}
                            fetchCanvasList={this.fetchUserCanvas}
                            list={canvasList}
                        />
                    </div>
                </div>
                <div className='homepage-footer'></div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userProfile: state.user.userProfile
    }
}

export default connect(mapStateToProps)(HomePage)
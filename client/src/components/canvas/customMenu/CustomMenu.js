import React, {Component} from 'react';
import { Menu, Tab, Icon } from 'semantic-ui-react';
import {connect} from 'react-redux';
import { isEqual } from 'lodash'
import { addShapeToCollection } from '../../../actions/canvas/canvasActions';
import Common from '../../../constants/common';
import ShapeMenu from './ShapeMenu';
import LayerMenu from './LayerMenu';
import SaveMenu from './SaveMenu';
import { defaultCanvasData } from '../../../constants/data';
import CanvasAPI from '../../../api/canvasApi';
import CustomTooltip from '../../CustomTooltip';

const canvasAPI = new CanvasAPI();

class CustomMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeMenu: props.panes[0].type,
            changes: false
        }
    }

    componentDidUpdate(prevProps){
        if(!isEqual(this.props.canvas.shapeList, prevProps.canvas.shapeList)){
                this.setState((state) => ({
                    ...state,
                    changes: true
                }))
        }
    }
    addShape(newShape){
        this.props.dispatch(addShapeToCollection(newShape))
    }
    toggleAccordian = (selectedTab) => {
        this.setState(state => {
            let { display, type, color, size, rotation } = state.tabOpen;
            switch(selectedTab){
                case Common.display:
                    display = !display;
                    break;
                case Common.type:
                    type = !type;
                    break;
                case Common.color:
                    color = !color;
                    break;
                case Common.size:
                    size = !size;
                    break;
                case Common.rotation:
                    rotation = !rotation;
                    break;
                default:
                    break
            }
            return {
                ...state,
                tabOpen: {
                    display,
                    type,
                    color,
                    size,
                    rotation
                }
            }
        })
    }

    createCanvas = async () => {
        let response = {};
        const { userProfile, canvas } = this.props;
        try {
            response = await canvasAPI.createCanvas(canvas, userProfile._id);
                this.props.addNotification({
                    type: 'success',
                    message: 'Successfully created a new canvas!'
                })
        } catch (error) {
            console.log(error)
        }
    }
    updateCanvas = async () => {
        let response = {};
        const { userProfile, canvas } = this.props;
        try {
            response = await canvasAPI.updateCanvas(canvas, userProfile._id);
                this.props.addNotification({
                    type: 'success',
                    message: 'Successfully edited canvas!'
                })
        } catch (error) {
            console.log(error)
        }
    }

    saveChanges = async () => {
        const { canvasId } = this.props;
        if(canvasId){
            this.updateCanvas();
        } else {
            this.createCanvas();
        }
    }

    clickMenuItem = (type) => {
        const { changes } = this.state;
        let { activeMenu } = this.state;
        switch(type) {
            case 'shape':
            case 'layers':
            case 'settings':
                activeMenu = type;
                break;
            case 'save':
                activeMenu = type;
                break;
            default:
                break;
        }
        this.setState((state) => ({
            ...state,
            activeMenu
        }))
    }

    renderMenuPanes = () => {
        const { panes } = this.props;
        return panes.map((pane) => {
            return this.renderMenuTab(pane.icon, pane.type)
        })
    }

    renderMenuActions = () => {
        const { actions } = this.props;
        const { changes } = this.state;
        const { canvasId } = this.props;
        return actions && actions.length ? actions.map((action) => {
            let color = '';
            let newIcon = action.icon
            if(action.type === 'save'){
                if(!canvasId){
                    newIcon = 'add'
                }
                if(changes){
                    color = 'yellow';
                }
            }
            if(action.type === 'shape'){
                color = 'teal';
            }
            return (
                <CustomTooltip 
                    content={action.type}
                    position='bottom center'
                    trigger={
                        <Menu.Item 
                            onClick={() => this.clickMenuItem(action.type)}
                            style={{
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center'
                            }}>
                            <Icon name={newIcon} className='font-color' color={color} size='large' style={{margin: '0'}}/>
                        </Menu.Item>
                    }
                />   
            )
        }) : []
    }

    renderMenuTab = (icon, type) => {
        const { changes } = this.state;
        const { canvasId } = this.props;
        let color = '';
        let newIcon = icon
        if(type === 'save'){
            if(!canvasId){
                newIcon = 'add'
            }
            if(changes){
                color = 'yellow';
            }
        }
        if(type === 'shape'){
            color = 'teal';
        }
        return (
            <CustomTooltip 
                content={type}
                position='bottom center'
                trigger={
                    <Menu.Item 
                        onClick={() => this.clickMenuItem(type)}
                        style={{
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center'
                        }}>
                        <Icon name={newIcon} className='font-color' color={color} size='large' style={{margin: '0'}}/>
                    </Menu.Item>
                }
            />   
        )
    }

    renderMenuContents = () => {
        const {activeMenu} = this.state;
        const { canvasData, modal, width } = this.props;
        const isInverted = modal ? false : true;
        switch(activeMenu){
            case 'shape':
                return (
                    <ShapeMenu 
                        inverted={isInverted} 
                        modal={modal}
                        canvasData={canvasData}
                        currentShape={this.props.currentShape}
                        shapeType={this.props.currentShapeType}
                    />
                );
            case 'layers':
                return (
                    <LayerMenu 
                        shapeList={this.props.shapeList} 
                        inverted={isInverted}
                        modal={modal}
                    />
                )
            case 'save':
                return (
                    <SaveMenu
                        saveCanvas={this.saveChanges}
                    />
                )
        }
    }

    render(){
        const { canvasData, modal, width } = this.props;
        const isInverted = modal ? false : true;
        return (
            <Menu
                className='dark-1'
                style={{ height: '100%', width: `${width}px`, margin: '0', borderRadius: '0'}}
                // inverted={isInverted}
                vertical
            >
                <Menu.Item style={{height: '100%', padding: '0', paddingBottom: '20px'}}>
                    
                        <div style={{height: '100%'}}>
                            <Menu className='dark-1' style={{ height: '50px', border: '0' }} vertical={false}>
                                <Menu.Menu>
                                    {this.renderMenuPanes()}
                                </Menu.Menu>
                                <Menu.Menu position='right'>
                                    {this.renderMenuActions()}
                                </Menu.Menu>
                            </Menu>
                            {this.renderMenuContents()}
                        </div>
                </Menu.Item>
            </Menu>
        )
    }
}

const mapStateToProps = state => {
    const { user } = state;
    const { currentShape, canvasData, currentShapeType, _id } = state.canvas;
    return {
        currentShape,
        canvas: state.canvas,
        currentShapeType,
        canvasId: _id,
        canvasData,
        userProfile: user.userProfile
    }
}

export default connect(mapStateToProps)(CustomMenu);
import React, { Component } from 'react';
import { Modal, Menu, Icon, Button, Header } from 'semantic-ui-react';
import Carousel, { consts } from 'react-elastic-carousel'
import { connect } from 'react-redux';
import ShapeTypePane from './ShapeTypePane';
import ShapePointsPane from './ShapePointsPane';


class ShapeEditor extends Component {
    constructor(props){
        super(props);
        this.state = {
            menuItems: [
                {
                    type: 'type',
                    icon: 'exchange',
                    title: 'Type'
                },
                {
                    type: 'color',
                    icon: 'circle',
                    title: 'Color'
                },
                {
                    type: 'points',
                    icon: 'crosshairs',
                    title: 'Points'
                },
            ],
            activeMenu: 'points'
        }
    }
    clickMenuItem = (type) => {
        this.setState((state) => ({
            ...state,
            activeMenu: type
        }))
    }
    renderMenuItems = () => {
        const { menuItems, activeMenu } = this.state;
        return (
            <Menu
                className='dark-1 font-color no-border'
            >
                {menuItems.map((item) => {
                    const active = item.type === activeMenu;
                    return (
                        <div 
                            onClick={() => this.clickMenuItem(item.type)}
                            style={{
                                display: 'flex',
                                width:'50px', 
                                alignItems: 'center', 
                                borderBottom: `3px solid ${active ? 'rgba(176, 176, 169, 0.5)' : 'rgba(0,0,0,0)'}`, 
                                cursor: 'pointer',
                                justifyContent: 'center'
                            }}
                        >
                            <Icon className='font-color' name={item.icon} style={{width:'20px', height: '20px'}}/>
                        </div>
                    )
                })}
            </Menu>
        )
    }
    renderMenuContents = () => {
        const { width, height, fill } = this.props.canvasData;
        const { activeMenu } = this.state;
        switch(activeMenu){
            case 'type':
                return (
                    <ShapeTypePane/>
                )
            case 'color':
                return (
                    <svg style={{backgroundColor: fill, height: '400px', width: '500px'}}/>
                    )    
            case 'points':
                return (
                    <ShapePointsPane/>
                )
            default:
                return null
        }
    }
    render(){
        const { open, canvas } = this.props;
        const { width, height, fill } = canvas.canvasData;
        return (
            <Modal
                open={open}
                className='dark-1 font-color'
                style={{
                    height: `auto`,
                    width: '900px',
                    justifyContent: 'space-between',
                    position: 'relative'
                }}
                trigger={
                    <Icon 
                        className='font-color' 
                        onClick={this.props.openShapeEditor}
                        style={{margin: '0', padding: '0'}} 
                        name='edit'
                    />
                }
            >
                <Modal.Header className='dark-1 font-color'>Create Shape</Modal.Header>
                <Modal.Content style={{backgroundColor: 'rgb(200,200,200)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '600px', padding: '0'}}>
                    <div className='dark-1' style={{height: '50px', padding: '0 20px'}}>
                        {this.renderMenuItems()}
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                        {this.renderMenuContents()}
                    </div>
                </Modal.Content>
                <Modal.Actions
                    className='dark-1 font-color'
                >  
                    <Button onClick={this.props.closeShapeEditor}>Cancel</Button>
                    <Button>Create</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        canvasData: state.canvas.canvasData,
        canvas: state.canvas
    }
}

export default connect(mapStateToProps)(ShapeEditor);
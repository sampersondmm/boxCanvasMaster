import React, {Component} from 'react';
import { Modal, Menu, Tab, Input, Header, Label, Button } from 'semantic-ui-react';
import { updateCanvasTitle, updateCanvasDescription } from '../actions/canvas/canvasActions';
import MenuIcon from './MenuIcon';
import CustomInput from './canvas/customMenu/shapeCards/CustomInput'
import {connect} from 'react-redux'

class SaveMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            openList: [],
            open: false,
            selection: '',
            selectionIndex: null,
            title: '',
            description: ''
        }
    }

    updateTitle = (data) => {
        this.props.dispatch(updateCanvasTitle(data.value))
    }
    
    updateDescription = (data) => {
        this.props.dispatch(updateCanvasDescription(data.value))
    }

    renderContents = () => {
        const { title, description } = this.props.info;
        return (
            <div style={{width: '100%', padding: '0 2px'}}>
                <Menu vertical style={{width: '100%', border: '0', boxShadow: '0'}} className='dark-1'>
                    <CustomInput
                        value={title}
                        type='string'
                        inline={false}
                        onChange={this.updateTitle}
                        label='Name'
                        placeholder='Name...'
                    />
                    <CustomInput
                        value={description}
                        type='string'
                        inline={false}
                        onChange={this.updateDescription}
                        label='Description'
                        placeholder='Description...'
                    />
                    {/* <Menu.Item style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: '0'}}>
                        <Menu.Header style={{margin: '0'}}>Shape Number</Menu.Header>
                        <div style={{display: 'flex'}}>
                            <Label color='teal'>45</Label>
                            <div></div>
                        </div>
                    </Menu.Item> */}
                </Menu>
            </div>
        )
    }

    render(){
        const { inverted, modal, canvasId, action } = this.props;
        const { description, title } = this.props.info;
        const wrapHeight = modal ? '433px' : 'calc(100vh - 100px)';
        const { open } = this.state;
        const scrollHeight = 'calc(100vh - 140px)';
        const scrollClass = !true ? 'scrollbar' : 'scrollbar-inverted';
        return (
            <div>
                <MenuIcon 
                        icon='save'
                        active={true}
                        handleClick={() => this.setState({open: true})}
                        tooltipPosition='bottom right'
                        tooltip={canvasId ? 'Update canvas' : 'Create new canvas'}
                    />
                <Modal
                    open={open}
                    className='dark-1'
                    style={{
                        width: '500px', 
                        height: 'auto',
                        // justifyContent: 'space-between',
                        position: 'relative'
                    }}
                >
                    <Modal.Content className='dark-1'>
                        <div>
                            <div style={{height: '40px', display: 'flex', alignItems: 'center', paddingLeft: '10px'}}>
                                <Header className='font-color' style={{ margin: '0'}}>Save</Header>
                            </div>
                            <div style={{ display: 'flex', paddingBottom: '10px', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
                                    {this.renderContents()}
                                    <div style={{
                                        display: 'flex',
                                        width: '100%',
                                        justifyContent: 'flex-end',
                                        marginTop: '40px',
                                        padding: '0 20px'
                                    }}>
                                        <Button
                                            content={'Cancel'}
                                            onClick={() => this.setState({open: false})}
                                        />
                                        <Button
                                            primary
                                            style={{marginLeft: '10px'}}
                                            disabled={!title}
                                            content={canvasId ? 'Edit' : 'Create'}
                                            onClick={() => {
                                                this.setState({open: false})
                                                this.props.saveCanvas()
                                            }}
                                        />
                                    </div>

                            </div>
                        </div> 
                    </Modal.Content>
                </Modal>
            </div>
        )
    }

}

const mapStateToProps = state => {
    const { editor, _id, info, action } = state.canvas;
    const { currentShape, selectedShapeId } = editor;
    return {
        action,
        selectedShapeId,
        currentShape,
        canvasId: _id,
        info
    }
}

export default connect(mapStateToProps)(SaveMenu);
import React, {Component} from 'react';
import { Menu, Tab, Input, Header, Label, Button } from 'semantic-ui-react';
import { updateCanvasTitle, updateCanvasDescription } from '../../../actions/canvas/canvasActions';
import {connect} from 'react-redux'

class SaveMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            openList: [],
            selection: '',
            selectionIndex: null,
            title: '',
            description: ''
        }
    }

    updateTitle = (value) => {
        this.props.dispatch(updateCanvasTitle(value))
    }
    
    updateDescription = (value) => {
        this.props.dispatch(updateCanvasTitle(value))
    }

    renderContents = () => {
         const { title, description } = this.props.info;
        return (
            <div style={{width: '100%', padding: '0 2px'}}>
                <Menu inverted={true} vertical style={{width: '100%'}}>
                        <Menu.Item style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: '0'}}>
                            <Menu.Header style={{margin: '0'}}>Name</Menu.Header>
                        </Menu.Item>
                        <Menu.Item>
                            <Input
                                inverted={true}
                                value={''}
                                onChange={(e, data) => this.updateTitle(data.value)}
                                value={title}
                                placeholder='Name'
                            />
                        </Menu.Item>
                        <Menu.Item style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: '0'}}>
                            <Menu.Header style={{margin: '0'}}>Description</Menu.Header>
                        </Menu.Item>
                        <Menu.Item>
                            <Input
                                inverted={true}
                                value={''}
                                onChange={(e, data) => this.updateDescription(data.value)}
                                value={description}
                                placeholder='Description'
                            />
                        </Menu.Item>
                        <Menu.Item style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: '0'}}>
                            <Menu.Header style={{margin: '0'}}>Shape Number</Menu.Header>
                            <div style={{display: 'flex'}}>
                                <Label color='teal'>45</Label>
                                <div></div>
                            </div>
                        </Menu.Item>
                </Menu>
            </div>
        )
    }

    render(){
        const { inverted, modal, canvasId } = this.props;
        const { description, title } = this.props.info;
        const wrapHeight = modal ? '433px' : 'calc(100vh - 100px)';
        const { selection } = this.state;
        const scrollHeight = 'calc(100vh - 140px)';
        const scrollClass = !true ? 'scrollbar' : 'scrollbar-inverted';
        return (
            <div style={{height: wrapHeight, overflow: 'hidden'}}>
                <div style={{height: '40px', display: 'flex', alignItems: 'center', paddingLeft: '10px'}}>
                    <Header style={{ color: 'white', margin: '0'}}>Save</Header>
                </div>
                <div className={`${scrollClass} tab-pane-wrap`} style={{height: scrollHeight, display: 'flex', paddingBottom: '10px', flexDirection: 'column', alignItems: 'center', overflowY: 'scroll', width: '100%'}}>
                        {this.renderContents()}
                        <Button
                            primary
                            style={{marginTop: '20px'}}
                            disabled={!title}
                            content={canvasId ? 'Edit' : 'Create'}
                            onClick={this.props.saveCanvas}
                        />

                </div>
            </div> 
        )
    }

}

const mapStateToProps = state => {
    const { editor, _id, info } = state.canvas;
    const { currentShape, selectedShapeId } = editor;
    return {
        selectedShapeId,
        currentShape,
        canvasId: _id,
        info
    }
}

export default connect(mapStateToProps)(SaveMenu);
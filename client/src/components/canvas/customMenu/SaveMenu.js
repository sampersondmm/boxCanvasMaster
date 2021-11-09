import React, {Component} from 'react';
import { Menu, Tab, Input, Header, Label, Button } from 'semantic-ui-react';
import {connect} from 'react-redux'
import Common from '../../../constants/common';
import { without, indexOf, find } from 'lodash';
import { selectShape, removeShape } from '../../../actions/canvasActions';
import Aux from '../../../utils/AuxComponent';
import AccordionIcon from '../../AccordionIcon';

class SaveMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            openList: [],
            selection: '',
            selectionIndex: null,
        }

    }

    renderContents = () => {
        const { 
            shapeList,
            inverted
         } = this.props;
        return (
            <div style={{width: '100%', padding: '0 2px'}}>
                <Menu inverted={true} vertical style={{width: '100%'}}>
                        <Menu.Item style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: '0'}}>
                            <Menu.Header style={{margin: '0'}}>Name</Menu.Header>
                        </Menu.Item>
                        <Menu.Item>
                            <Input
                                inverted={true}
                                type='number'
                                value={''}
                                // onChange={(e, data) => this.handleSizeChange(data, Common.width)}
                                placeholder='Name'
                            />
                        </Menu.Item>
                        <Menu.Item style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: '0'}}>
                            <Menu.Header style={{margin: '0'}}>Description</Menu.Header>
                        </Menu.Item>
                        <Menu.Item>
                            <Input
                                inverted={true}
                                type='number'
                                value={''}
                                // onChange={(e, data) => this.handleSizeChange(data, Common.width)}
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
        const wrapHeight = modal ? '433px' : 'calc(100vh - 100px)';
        const { selection } = this.state;
        const scrollHeight = 'calc(100vh - 190px)';
        const scrollClass = !true ? 'scrollbar' : 'scrollbar-inverted';
        return (
            <div style={{height: wrapHeight, overflow: 'hidden'}}>
                <div style={{height: '40px', display: 'flex', alignItems: 'center', paddingLeft: '10px'}}>
                    <Header style={{ color: 'white', margin: '0'}}>Save</Header>
                </div>
                <div className={`${scrollClass} tab-pane-wrap`} style={{height: scrollHeight, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', overflowY: 'scroll', width: '100%'}}>
                    {/* <Tab.Pane inverted={inverted} style={{padding: '0', border: '0', display: 'flex', justifyContent: 'center', margin: '0'}}> */}
                        {this.renderContents()}

                        <Button
                            primary
                            content={canvasId ? 'Edit' : 'Create'}
                            onClick={this.props.saveCanvas}
                        />

                    {/* </Tab.Pane> */}
                </div>
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '10px'}}>
                    {/* <AccordionIcon
                        icon='trash'
                        width='20px'
                        height='20px'
                        onClick={() => this.handleRemove(selection)}
                        disabled={selection === ''}
                    />
                    <AccordionIcon
                        icon='angle down'
                        width='20px'
                        height='20px'
                        style={{
                            marginLeft: '7px'
                        }}
                        onClick={() => this.handleMove('down')}
                        disabled={selection === ''}
                    /> */}
                </div>
            </div> 
        )
    }

}

const mapStateToProps = state => {
    const { editor, _id } = state.canvas;
    const { currentShape, selectedShapeId } = editor;
    return {
        selectedShapeId,
        currentShape,
        canvasId: _id
    }
}

export default connect(mapStateToProps)(SaveMenu);
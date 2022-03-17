import React, {Component} from 'react';
import { Menu, Tab, Accordion, Header, Message, Label } from 'semantic-ui-react';
import {connect} from 'react-redux'
import Common from '../../../constants/common';
import { without, reverse, cloneDeep } from 'lodash';
import { selectShape, removeShape, hoverShape } from '../../../actions/canvas/canvasActions';
import Aux from '../../../utils/AuxComponent';
import AccordionIcon from '../../AccordionIcon';

class LayerMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            openList: [],
            selection: '',
            selectionIndex: null,
        }

    }

    componentDidUpdate(prevProps){
        if(this.props.selectedShapeId !== prevProps.selectedShapeId){
            this.setState((state) => ({
                ...state,
                selection: this.props.selectedShapeId
            }))
        }
    }

    handleOpen = (id) => {
        this.setState(state => {
            const indexIncluded = state.openList.includes(id);
            let { openList } = state;
            if(indexIncluded){
                openList = without(openList, id)
            } else {
                openList.push(id)
            }
            return {
                openList
            }
        })
    }

    handleSelect = (newSelection, index) => {
        const selection = newSelection === this.state.selection ? '' : newSelection
        this.props.dispatch(selectShape(selection));
        // this.setState(state => ({
        //     ...state,
        //     selection,
        //     selectionIndex: index,
        // }));
    }

    handleRemove = async (selection) => {
        const { selectionIndex } = this.state;
        await this.props.dispatch(removeShape(selection));
        const nextShape = this.props.shapeList[selectionIndex];
        const prevShape = this.props.shapeList[selectionIndex - 1];
        if(nextShape){
            this.props.dispatch(selectShape(nextShape.id))
        } else if (prevShape) {
            this.props.dispatch(selectShape(prevShape.id))
            this.setState(state => ({
                ...state,
                selectionIndex: selectionIndex - 1
            }))
        }
    }

    createShapeItem = (shape) => {
        const type = shape.type;
        switch(type){
            case Common.square:
                return (
                    <Aux>
                        <Menu.Item >
                            <Label >{shape.width}</Label>
                            {Common.width}
                        </Menu.Item>
                        <Menu.Item >
                            <Label >{shape.height}</Label>
                            {Common.height}
                        </Menu.Item>
                        <Menu.Item >
                            <Label >{shape.rotation}</Label>
                            {Common.rotation}
                        </Menu.Item>
                        <Menu.Item >
                            <Label >{Number(shape.posX).toFixed(0)}</Label>
                            {Common.positionX}
                        </Menu.Item>
                        <Menu.Item >
                            <Label >{Number(shape.posY).toFixed(0)}</Label>
                            {Common.positionY}
                        </Menu.Item>
                    </Aux>
                )
            case Common.circle:
                return (
                    <Aux>
                        <Menu.Item>
                            <Label color='teal'>{shape.radius}</Label>
                            {Common.radius}
                        </Menu.Item>
                        <Menu.Item >
                            <Label color='teal'>{Number(shape.posX).toFixed(0)}</Label>
                            {Common.positionX}
                        </Menu.Item>
                        <Menu.Item >
                            <Label color='teal'>{Number(shape.posY).toFixed(0)}</Label>
                            {Common.positionY}
                        </Menu.Item>
                    </Aux>
                )
            case Common.line:
                return (
                    <Aux>
                        <Menu.Item>
                            <Label color='teal'>{shape.stroke}</Label>
                            {Common.stroke}
                        </Menu.Item>
                        <Menu.Item >
                            <Label color='teal'>{shape.strokeWidth}</Label>
                            {Common.strokeWidth}
                        </Menu.Item>
                        <Menu.Item >
                            <Label color='teal'>{shape.pointData.length}</Label>
                            {Common.numberOfPoints}
                        </Menu.Item>
                    </Aux>
                )
            default:
                return;
        }
    }

    determineShapeDisplay = (shape) => {
        switch(shape.type){
            case Common.square:
                return (
                    <div style={{
                        width: '30px', 
                        height: '30px', 
                        backgroundColor: shape.fill, 
                        margin: '0 10px 0 5px'
                    }}></div>
                )
            case Common.circle:
                return (
                    <div style={{
                        width: '30px', 
                        height: '30px', 
                        backgroundColor: shape.fill, 
                        borderRadius: '50%',
                        margin: '0 10px 0 5px'
                    }}></div>
                )
            case Common.line:
                return (
                    <div style={{
                        width: '30px', 
                        height: '2px', 
                        backgroundColor: shape.fill, 
                        margin: '0 10px 0 5px'
                    }}></div>
                )
            default:
                break;
        }
    }

    renderContents = () => {
        const { 
            shapeList,
            inverted
         } = this.props;
        if(shapeList.length){
            return (
                <Accordion inverted={inverted} as={Menu} vertical style={{border: '0', paddingTop: '0'}} fluid >
                    {this.createShapeList()}
                </Accordion>
            );
        } else {
            return (
                <div style={{width: '100%', padding: '0 2px'}}>
                    <Message
                        style={{
                            backgroundColor: '#1b1c1d',
                            color: 'rgba(255,255,255,.9)',
                            margin: '0',
                            border: '1px solid rgb(120, 120, 120)'
                        }}
                        content='No Layers'
                    />

                </div>
            )
        }
    }

    hoverOn = (shape) => {
        this.props.dispatch(hoverShape(shape.id))
    }
    
    hoverOff = () => {
        this.props.dispatch(hoverShape(''))
    }

    createShapeList = () => {
        const { shapeList, inverted } = this.props;
        const { openList, selection } = this.state;
        const reversed = reverse(cloneDeep(shapeList))
        const newList = reversed.map((shape, index) => {
            return (
                <Menu.Item 
                    className='shape-accordian-option' 
                    onMouseEnter={() => this.hoverOn(shape)}
                    onMouseLeave={this.hoverOff}
                    style={{
                        margin: '0 2px', 
                        marginBottom: '5px', 
                        borderRadius: '4px'
                    }}
                >
                        <Accordion.Title
                            index={0}
                            style={{
                                cursor: 'default',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <AccordionIcon 
                                    width='20px'
                                    spaceRight='7px'
                                    disabled={false}
                                    height='20px'
                                    onClick={() => this.handleOpen(shape.id)}
                                    icon={openList.includes(index) ? 'plus' : 'minus'}
                                />
                                {this.determineShapeDisplay(shape)}
                                {shape.type}
                            </div>
                            <AccordionIcon
                                width='15px'
                                height='15px'
                                disabled={false}
                                onClick={() => this.handleSelect(shape.id, index)}
                                color='teal'
                                hideIcon={selection !== shape.id}
                                icon='check'
                            />
                        </Accordion.Title>

                    <Accordion.Content active={openList.includes(shape.id)} as={Menu} inverted={inverted} style={{margin: '0', marginTop: '5px', border: '0', boxShadow: '0 0 0 0'}}>
                        {this.createShapeItem(shape)}
                    </Accordion.Content>
                </Menu.Item>
            )
        })
        return newList
    }

    render(){
        const { inverted, modal, shapeList } = this.props;
        const wrapHeight = modal ? '433px' : 'calc(100vh - 140px)';
        const { selection } = this.state;
        const scrollHeight = 'calc(100vh - 230px)';
        const scrollClass = !inverted ? 'scrollbar' : 'scrollbar-inverted';
        return (
            <div style={{height: wrapHeight, overflow: 'hidden'}}>
                <div style={{height: '40px', display: 'flex', alignItems: 'center', paddingLeft: '10px'}}>
                    <Header style={{ color: 'white', margin: '0'}}>Layers</Header>
                </div>
                <div className={`${scrollClass} tab-pane-wrap`} style={{height: scrollHeight, overflowY: 'scroll'}}>
                    <Tab.Pane inverted={inverted} style={{padding: '0', border: '0', display: 'flex', justifyContent: 'center', margin: '0'}}>
                        {this.renderContents()}

                    </Tab.Pane>
                </div>
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '10px'}}>
                    <AccordionIcon
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
                    />
                    <AccordionIcon
                        icon='angle up'
                        width='20px'
                        height='20px'
                        style={{
                            marginLeft: '7px'
                        }}
                        disabled={selection === ''}
                        onClick={() => this.handleMove('up')}
                    />
                </div>
            </div> 
        )
    }

}

const mapStateToProps = state => {
    const { editor } = state.canvas;
    const { currentShape, selectedShapeId } = editor;
    return {
        selectedShapeId,
        currentShape
    }
}

export default connect(mapStateToProps)(LayerMenu);
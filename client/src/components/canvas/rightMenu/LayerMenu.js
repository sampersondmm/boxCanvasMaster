import React, {Component} from 'react';
import { Menu, Tab, Accordion, Header, Label } from 'semantic-ui-react';
import {connect} from 'react-redux'
import Common from '../../../constants/common';
import { without, indexOf, find } from 'lodash';
import { selectShape, removeShape } from '../../../actions/canvasActions';
import Aux from '../../../utils/Aux';
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
        if(this.props.selectedShape !== prevProps.selectedShape){
            this.setState((state) => ({
                ...state,
                selection: this.props.selectedShape
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
        this.setState(state => ({
            ...state,
            selection,
            selectionIndex: index,
        }));
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
                            <Label color='teal'>{shape.width}</Label>
                            {Common.width}
                        </Menu.Item>
                        <Menu.Item >
                            <Label color='teal'>{shape.height}</Label>
                            {Common.height}
                        </Menu.Item>
                        <Menu.Item >
                            <Label color='teal'>{shape.rotation}</Label>
                            {Common.rotation}
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
                            <Label color='teal'>{shape.points.length}</Label>
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
                        width: '20px', 
                        height: '20px', 
                        backgroundColor: shape.color, 
                        margin: '0 10px 0 5px'
                    }}></div>
                )
            case Common.circle:
                return (
                    <div style={{
                        width: '20px', 
                        height: '20px', 
                        backgroundColor: shape.color, 
                        borderRadius: '50%',
                        margin: '0 10px 0 5px'
                    }}></div>
                )
            case Common.line:
                return (
                    <div style={{
                        width: '20px', 
                        height: '2px', 
                        backgroundColor: shape.stroke, 
                        margin: '0 10px 0 5px'
                    }}></div>
                )
            default:
                break;
        }
    }

    createShapeList = () => {
        const { shapeList, inverted } = this.props;
        const { openList, selection } = this.state;
        const newList = shapeList.map((shape, index) => {
            return (
                <Menu.Item className='shape-accordian-option' style={{margin: '0 2px', marginBottom: '5px', borderRadius: '4px'}}>
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
        return newList;
    }

    render(){
        const { inverted, modal } = this.props;
        const wrapHeight = modal ? '433px' : 'calc(100vh - 90px)';
        const { selection } = this.state;
        const scrollHeight = 'calc(100vh - 180px)';
        const scrollClass = !inverted ? 'scrollbar' : 'scrollbar-inverted';
        return (
            <div style={{height: wrapHeight, overflow: 'hidden'}}>
                <div style={{height: '40px', display: 'flex', alignItems: 'center', paddingLeft: '10px'}}>
                    <Header style={{ color: 'white', margin: '0'}}>Layers</Header>
                </div>
                <div className={`${scrollClass} tab-pane-wrap`} style={{height: scrollHeight, overflowY: 'scroll'}}>
                    <Tab.Pane inverted={inverted} style={{padding: '0', border: '0', display: 'flex', justifyContent: 'center', margin: '0'}}>
                        <Accordion inverted={inverted} as={Menu} vertical style={{border: '0', paddingTop: '0'}} fluid >
                            {this.createShapeList()}
                        </Accordion>
                    </Tab.Pane>
                </div>
                <div style={{height: '50px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '10px'}}>
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
    const { collectionList, currentShape, canvasData } = state.canvas;
    return {
        collectionList,
        selectedShape: canvasData.selectedShape,
        currentShape
    }
}

export default connect(mapStateToProps)(LayerMenu);
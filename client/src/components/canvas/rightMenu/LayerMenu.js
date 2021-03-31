import React, {Component} from 'react';
import { Menu, Tab, Accordion, Header, Label } from 'semantic-ui-react';
import {connect} from 'react-redux'
import Common from '../../../constants/common';
import without from 'lodash/without';
import { selectShape } from '../../../actions/canvasActions';
import Aux from '../../../utils/Aux';
import AccordionIcon from '../../AccordionIcon';

class LayerMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            openList: [],
            selection: ''
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
    handleSelect = (newSelection) => {
        const selection = newSelection === this.state.selection ? '' : newSelection
        this.props.dispatch(selectShape(selection));
        this.setState(state => ({
            ...state,
            selection
        }))
    }
    createShapeItem = (shape) => {
        const type = shape.type;
        return (
            <Aux>
                {type === Common.square ? (
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
                    </Aux>
                ) : (
                    <Aux>
                        <Menu.Item >
                            <Label color='teal'>{shape.radius}</Label>
                            {Common.radius}
                        </Menu.Item>
                    </Aux>
                )}
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
    }
    render(){
        const { inverted, shapeList } = this.props;
        const { openList, selection } = this.state;
        const wrapHeight = !inverted ? '433px' : 'calc(100vh - 150px)';
        const scrollClass = !inverted ? 'scrollbar' : 'scrollbar-inverted';
        return (
            <div>
                <div className={`${scrollClass} tab-pane-wrap`} style={{height: wrapHeight, borderBottom: '1px solid rgb(120,120,120)', borderTop: '1px solid rgb(120,120,120)'}}>
                    <Header style={{ color: 'white'}}>LAYER</Header>
                    <Tab.Pane inverted={inverted} style={{padding: '0', border: '0', display: 'flex', justifyContent: 'center', margin: '0'}}>
                        <Accordion inverted={inverted} as={Menu} vertical style={{border: '0'}} fluid >
                            {shapeList.map((shape, index) => {
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
                                                    <div style={{width: '20px', height: '20px', backgroundColor: shape.color, borderRadius: shape.type === Common.square ? 0 : '50%', margin: '0 10px 0 5px'}}></div>
                                                    {shape.type}
                                                </div>
                                                <AccordionIcon
                                                    width='15px'
                                                    height='15px'
                                                    disabled={false}
                                                    onClick={() => this.handleSelect(shape.id)}
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
                            })}
                        </Accordion>
                    </Tab.Pane>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { collectionList, currentShape } = state.canvas;
    return {
        collectionList,
        currentShape
    }
}

export default connect(mapStateToProps)(LayerMenu);
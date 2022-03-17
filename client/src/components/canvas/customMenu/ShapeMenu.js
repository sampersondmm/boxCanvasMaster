import React, {Component} from 'react';
import Common from '../../../constants/common';
import {connect} from 'react-redux';
import { Tab, Accordion, Menu, Icon, Modal, Header } from 'semantic-ui-react';
import ShapeDisplayCard from './shapeCards/ShapeDisplayCard';
import ShapeSizeCard from './shapeCards/ShapeSizeCard';
import ShapeColorCard from './shapeCards/ShapeColorCard';
import ShapeTypeCard from './shapeCards/ShapeTypeCard';
import ShapeRotationCard from './shapeCards/ShapeRotationCard';
import ShapeStrokeCard from './shapeCards/ShapeStrokeCard';
import AccordionIcon from '../../AccordionIcon';
import findIndex from 'lodash/findIndex';
import ShapePointCard from './shapeCards/ShapePointCard';
import ShapeEditor from '../shapeEditor/ShapeEditor';
import IsVisible from '../../../utils/IsVisible';

class ShapeMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeIndex: 1,
            selected: '',
            shapeEditorOpen: false,
            cardOrder: [
                Common.display,
                Common.type,
                Common.points,
                Common.color,
                Common.size,
                Common.stroke,
                Common.rotation
            ],
            tabOpen: {
                display: true,
                type: true,
                points: true,
                color: true,
                size: true,
                stroke: true,
                rotation: true
            },
        }
    }
    toggleAccordian = (selectedTab) => {
        this.setState(state => {
            let { display, type, points, color, size, stroke, rotation } = state.tabOpen;
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
                case Common.stroke:
                    stroke = !stroke;
                    break;
                case Common.points:
                    points = !points;
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
                    points,
                    color,
                    size,
                    stroke,
                    rotation
                }
            }
        })
    }
    handleMove = (direction) => {
        this.setState(state => {
            let { cardOrder, selected } = state;
            const index = findIndex(cardOrder, card => card === selected);
            if(direction === 'up'){
                if(index === 0){
                    
                } else {
                    const prevStep = cardOrder[index - 1];
                    cardOrder[index - 1] = selected;
                    cardOrder[index] = prevStep;
                }
            } else {
                if(index === cardOrder.length - 1){
                    cardOrder.pop();
                    cardOrder.unshift(selected)
                } else {
                    const nextStep = cardOrder[index + 1];
                    cardOrder[index + 1] = selected;
                    cardOrder[index] = nextStep;
                }
            }
            return {
                ...state,
                cardOrder
            }  
        })
    }
    handleSelect = (selected) => {
        this.setState(state => ({
            ...state,
            selected: selected === state.selected ? '' : selected
        }))
    }
    createAccordianList = () => {
        const { modal, selectedShapeId } = this.props;
        const { currentShape } = this.props;
        const { tabOpen, selected, cardOrder } = this.state;
        const isInverted = modal ? false : true;
        let listArr = [];
        listArr = cardOrder.map(item => {
            switch(item){
                case Common.display:
                    return (
                        <ShapeDisplayCard
                            open={tabOpen.display}
                            selected={selected}
                            handleSelect={() => this.handleSelect(Common.display)}
                            handleOpen={() => this.toggleAccordian(Common.display)}
                        />
                    );
                case Common.type:
                    if(!selectedShapeId){
                        return (
                            <ShapeTypeCard
                                open={tabOpen.type}
                                selected={selected}
                                handleSelect={() => this.handleSelect(Common.type)}
                                handleOpen={() => this.toggleAccordian(Common.type)}
                                inverted={isInverted}
                                />
                            )
                    } else {
                        return null;
                    }
                case Common.points:
                    if(currentShape.type === Common.line){
                        return (
                            <ShapePointCard
                                open={tabOpen.points}
                                selected={selected}
                                handleSelect={() => this.handleSelect(Common.points)}
                                handleOpen={() => this.toggleAccordian(Common.points)}
                                inverted={isInverted}
                            />
                        )
                    } else {
                        return null;
                    }
                case Common.color:
                    return (
                        <ShapeColorCard
                            open={tabOpen.color}
                            selected={selected}
                            handleSelect={() => this.handleSelect(Common.color)}
                            handleOpen={() => this.toggleAccordian(Common.color)}
                            inverted={isInverted}
                        />
                    )
                case Common.size:
                    if(currentShape.type !== Common.line){
                        return (
                            <ShapeSizeCard 
                                open={tabOpen.size}
                                selected={selected}
                                handleSelect={() => this.handleSelect(Common.size)}
                                handleOpen={() => this.toggleAccordian(Common.size)}
                                inverted={isInverted}
                            />
                        )  
                    } else {
                        return null
                    }
                case Common.stroke:
                    return (
                        <ShapeStrokeCard
                            open={tabOpen.stroke}
                            selected={selected}
                            handleSelect={() => this.handleSelect(Common.stroke)}
                            handleOpen={() => this.toggleAccordian(Common.stroke)}
                            inverted={isInverted}
                        />
                    )
                case Common.rotation:
                    if(currentShape.type === Common.square){
                        return (
                            <ShapeRotationCard
                                open={tabOpen.rotation}
                                selected={selected}
                                handleSelect={() => this.handleSelect(Common.rotation)}
                                handleOpen={() => this.toggleAccordian(Common.rotation)}
                                inverted={isInverted}
                            />
                        )
                    }
                    return null;
                default:
                    return null;
            }
        })
        return listArr;
    }
    openShapeEditor = () => {
        this.setState((state) => ({
            ...state,
            shapeEditorOpen: true
        }))
    }
    closeShapeEditor = () => {
        this.setState((state) => ({
            ...state,
            shapeEditorOpen: false
        }))
    }
    render(){
        const { modal, inverted, action, selectedShapeId } = this.props;
        const { selected, shapeEditorOpen } = this.state;
        const wrapHeight = modal ? '433px' : 'calc(100vh - 140px)';
        const scrollHeight = 'calc(100vh - 230px)';
        const scrollClass = modal ? 'scrollbar' : 'scrollbar-inverted'
        const title = action === 'edit' ? Common.editShape : Common.createShape;
    
        return (
            <div style={{height: wrapHeight, overflow: 'hidden'}}>
                <div style={{height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px'}}>
                    <Header className='font-color' style={{ margin: '0'}}>{title}</Header>
                    <div style={{height: '100%', display: 'flex', alignItems: 'center'}}>
                        <ShapeEditor
                            open={shapeEditorOpen}
                            openShapeEditor={this.openShapeEditor}
                            closeShapeEditor={this.closeShapeEditor}
                        />
                    </div>
                </div>
                <div className={`${scrollClass} tab-pane-wrap`} style={{height: scrollHeight, overflowY: 'scroll'}}>
                    <IsVisible visible={action === 'add' || (action === 'edit' && selectedShapeId)}>
                        <Tab.Pane className='dark-1' style={{padding: '0', border: '0', display: 'flex', justifyContent: 'center', margin: '0'}}>
                            <Accordion as={Menu} className='dark-1' vertical style={{border: '0', paddingTop: '0'}} fluid >
                                {this.createAccordianList()}
                            </Accordion>
                        </Tab.Pane>
                    </IsVisible>
                    <IsVisible visible={action === 'edit' && !selectedShapeId}>
                        <div style={{height: '100%', width: '100%', display: 'flex', justifyContent: 'center', paddingTop: '20px'}}>
                            <Header className='font-color' size='small'>Select a shape to start editing</Header>
                        </div>
                    </IsVisible>
                </div>
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '10px'}}>
                     <AccordionIcon
                        icon='angle down'
                        width='20px'
                        height='20px'
                        onClick={() => this.handleMove('down')}
                        disabled={selected === ''}
                     />
                     <AccordionIcon
                        icon='angle up'
                        width='20px'
                        height='20px'
                        style={{
                            marginLeft: '7px'
                        }}
                        disabled={selected === ''}
                        onClick={() => this.handleMove('up')}
                     />
                </div>
            </div> 
        )
    }
}

const mapStateToProps = state => {
    const { currentShape, selectedShapeId } = state.canvas.editor;
    return {
        action: state.canvas.action,
        currentShape,
        selectedShapeId
    }
}

export default connect(mapStateToProps)(ShapeMenu);
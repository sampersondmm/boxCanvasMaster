import React, {Component} from 'react';
import Common from '../../../constants/common';
import {connect} from 'react-redux';
import { Tab, Accordion, Menu, Header } from 'semantic-ui-react';
import ShapeDisplayCard from './shapeCards/ShapeDisplayCard';
import ShapeSizeCard from './shapeCards/ShapeSizeCard';
import ShapeColorCard from './shapeCards/ShapeColorCard';
import ShapeTypeCard from './shapeCards/ShapeTypeCard';
import ShapeRotationCard from './shapeCards/ShapeRotationCard';
import ShapeStrokeCard from './shapeCards/ShapeStrokeCard';
import AccordionIcon from '../../AccordionIcon';
import findIndex from 'lodash/findIndex';

class ShapeMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeIndex: 1,
            selection: '',
            cardOrder: [
                Common.display,
                Common.type,
                Common.color,
                Common.size,
                Common.stroke,
                Common.rotation
            ],
            tabOpen: {
                display: true,
                type: true,
                color: true,
                size: true,
                stroke: true,
                rotation: true
            },
        }
    }
    toggleAccordian = (selectedTab) => {
        this.setState(state => {
            let { display, type, color, size, stroke, rotation } = state.tabOpen;
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
                    stroke,
                    rotation
                }
            }
        })
    }
    handleMove = (direction) => {
        this.setState(state => {
            let { cardOrder, selection } = state;
            const index = findIndex(cardOrder, card => card === selection);
            if(direction === 'up'){
                if(index === 0){
                    
                } else {
                    const prevStep = cardOrder[index - 1];
                    cardOrder[index - 1] = selection;
                    cardOrder[index] = prevStep;
                }
            } else {
                if(index === cardOrder.length - 1){
                    cardOrder.pop();
                    cardOrder.unshift(selection)
                } else {
                    const nextStep = cardOrder[index + 1];
                    cardOrder[index + 1] = selection;
                    cardOrder[index] = nextStep;
                }
            }
            return {
                ...state,
                cardOrder
            }  
        })
    }
    handleSelect = (selection) => {
        this.setState(state => ({
            ...state,
            selection: selection === state.selection ? '' : selection
        }))
    }
    createAccordianList = () => {
        const { modal } = this.props;
        const { currentShapeType } = this.props;
        const { tabOpen, selection, cardOrder } = this.state;
        const isInverted = modal ? false : true;
        let listArr = [];
        listArr = cardOrder.map(item => {
            switch(item){
                case Common.display:
                    return (
                        <ShapeDisplayCard
                            open={tabOpen.display}
                            selection={selection}
                            handleSelect={() => this.handleSelect(Common.display)}
                            handleOpen={() => this.toggleAccordian(Common.display)}
                        />
                    );
                case Common.type:
                    return (
                        <ShapeTypeCard
                            open={tabOpen.type}
                            selection={selection}
                            handleSelect={() => this.handleSelect(Common.type)}
                            handleOpen={() => this.toggleAccordian(Common.type)}
                            inverted={isInverted}
                            />
                        )
                case Common.color:
                    return (
                        <ShapeColorCard
                            open={tabOpen.color}
                            selection={selection}
                            handleSelect={() => this.handleSelect(Common.color)}
                            handleOpen={() => this.toggleAccordian(Common.color)}
                            inverted={isInverted}
                        />
                    )
                case Common.size:
                    return (
                        <ShapeSizeCard 
                            open={tabOpen.size}
                            selection={selection}
                            handleSelect={() => this.handleSelect(Common.size)}
                            handleOpen={() => this.toggleAccordian(Common.size)}
                            inverted={isInverted}
                        />
                    )  
                case Common.stroke:
                    return (
                        <ShapeStrokeCard
                            open={tabOpen.stroke}
                            selection={selection}
                            handleSelect={() => this.handleSelect(Common.stroke)}
                            handleOpen={() => this.toggleAccordian(Common.stroke)}
                            inverted={isInverted}
                        />
                    )
                case Common.rotation:
                    if(currentShapeType === Common.square){
                        return (
                            <ShapeRotationCard
                                open={tabOpen.rotation}
                                selection={selection}
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
    render(){
        const { modal, inverted, selectedShapeId } = this.props;
        const { selection } = this.state;
        const wrapHeight = modal ? '433px' : 'calc(100vh - 90px)';
        const scrollHeight = 'calc(100vh - 180px)';
        const scrollClass = modal ? 'scrollbar' : 'scrollbar-inverted'
        const title = selectedShapeId ? Common.editShape : Common.createShape;
    
        return (
            <div style={{height: wrapHeight, overflow: 'hidden'}}>
                <div style={{height: '40px', display: 'flex', alignItems: 'center', paddingLeft: '10px'}}>
                    <Header style={{ color: 'white', margin: '0'}}>{title}</Header>
                </div>
                <div className={`${scrollClass} tab-pane-wrap`} style={{height: scrollHeight, overflowY: 'scroll'}}>
                    <Tab.Pane inverted={inverted} style={{padding: '0', border: '0', display: 'flex', justifyContent: 'center', margin: '0'}}>
                        <Accordion inverted={inverted} as={Menu} vertical style={{border: '0', paddingTop: '0'}} fluid >
                            {this.createAccordianList()}
                        </Accordion>
                    </Tab.Pane>
                </div>
                <div style={{height: '50px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '10px'}}>
                     <AccordionIcon
                        icon='angle down'
                        width='20px'
                        height='20px'
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
    const { currentShapeType } = state.canvas;
    const { selectedShapeId } = state.canvas.canvasData
    return {
        currentShapeType,
        selectedShapeId
    }
}

export default connect(mapStateToProps)(ShapeMenu);
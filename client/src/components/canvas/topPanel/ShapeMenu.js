import React, {Component} from 'react';
import { Menu, Card, Tab, Icon, Input, Accordion } from 'semantic-ui-react';
import Carousel, { consts } from 'react-elastic-carousel';
import {changeShapeType, changeShapeColor, changeBackgroundColor, changeShapeRadius, changeShapeWidth, changeShapeOpacity, changeShapeHeight} from '../../../actions/canvasActions';
import Common from '../../../constants/common';
import ColorPicker from '../ColorPicker';
import {store} from '../../..';

class ShapeMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            colorStatus: Common.shape,
            shapeWidth: props.canvasData.shapeWidth,
            shapeHeight: props.canvasData.shapeHeight,
            activeIndex: 1,
            increment: 20,
            tabOpen: {
                display: true,
                type: true,
                color: true,
                size: true
            },
            dirty: false
        }

    }

    renderArrow = ({ type, onClick, isEdge }) => {
        const pointer = type === consts.PREV ? (
            <div style={{height: '100%', display: 'flex', alignItems: 'center'}}>
                <Icon name='angle left' onClick={onClick}/>
            </div>
        ) : (
            <div style={{height: '100%', display: 'flex', alignItems: 'center'}}>
                <Icon name='angle right' onClick={onClick}/>
            </div>
        )
        return pointer;
    }

    colorTabChange = (event, data) => {
        this.setState(state => ({
            ...state,
            colorStatus: data.activeIndex === 1 ? Common.background : Common.shape,
            dirty: false
        }))
    }
    handleSizeChange = (data, type) => {
        switch(type){
            case Common.width:
                store.dispatch(changeShapeWidth(data.value));
                break;
            case Common.height:
                store.dispatch(changeShapeHeight(data.value));
                break;
            case Common.radius:
                store.dispatch(changeShapeRadius(data.value));
                break;
            
        }
        if(type === Common.width) {
            store.dispatch(changeShapeWidth(data.value))
        } else {
            store.dispatch(changeShapeHeight(data.value))
        }
    }
    handleChangeIncrement = (data) => {
        this.setState(state => ({
            ...state,
            increment: parseInt(data.value, 10)
        }))
    }
    toggleAccordian = (selectedTab) => {
        this.setState(state => {
            let { display, type, color, size } = state.tabOpen;
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
                default:
                    break
            }
            return {
                ...state,
                tabOpen: {
                    display,
                    type,
                    color,
                    size
                }
            }
        })
    }
    handleColorChange = (value, color) => {
        if(this.state.colorStatus === Common.shape){
            store.dispatch(changeShapeColor(color));
            store.dispatch(changeShapeOpacity(value.a))
        } else {
            store.dispatch(changeBackgroundColor(color));
        }
        this.setState(state => ({
            ...state, 
            dirty: true,
            value
        }));
    }
    incrementWidth = (value) => {
        const { shapeWidth } = this.props.canvasData;
        const { increment } = this.state;
        const newValue = value === 'down' ? (shapeWidth - increment <= 0 ? 0 : shapeWidth - increment) : shapeWidth + increment;
        store.dispatch(changeShapeWidth(newValue))
    }
    incrementHeight = (value) => {
        const { shapeHeight } = this.props.canvasData;
        const { increment } = this.state;
        const newValue = value === 'down' ? (shapeHeight - increment <= 0 ? 0 : shapeHeight - increment) : shapeHeight + increment;
        store.dispatch(changeShapeHeight(newValue))
    }
    render(){
        const { canvasData } = this.props;
        const { activeIndex, tabOpen, increment } = this.state;
        const { shapeColor, shapeType, shapeOpacity, shapeRadius, backgroundColor, shapeWidth, shapeHeight } = canvasData;
        const borderRadius = canvasData.shapeType === 'Square' ? '0' : '50%';
        let color = null;
          if(this.state.colorStatus === Common.shape){
            color = this.state.dirty ? this.state.value : shapeColor;
          } else {
            color = this.state.dirty ? this.state.value : backgroundColor;
          }
        return (
            <Menu
                style={{width: '400px'}}
                inverted={this.props.modal ? false : true}
                attached='right'
                vertical
            >
                <Menu.Item>
                    <Tab
                        menu={{secondary: true}}
                        panes={[
                            {
                                menuItem: 'Current Shape',
                                render: () => <Tab.Pane inverted={this.props.modal ? false : true}>
                                    <Accordion fluid inverted={this.props.modal ? false : true} >
                                        <Accordion.Title
                                            index={0}
                                            onClick={() => this.toggleAccordian(Common.display)}
                                        >
                                            <Icon name={tabOpen.display ? 'plus' : 'minus'} />
                                            {Common.display}
                                        </Accordion.Title>
                                        <Accordion.Content active={tabOpen.display}>
                                            <div style={{
                                                height: '120px', 
                                                backgroundColor: canvasData.backgroundColor,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                                <div style={{width: '70px', height: '70px', opacity: shapeOpacity, borderRadius, backgroundColor: shapeColor}}></div>
                                            </div>
                                        </Accordion.Content>

                                        <Accordion.Title
                                            index={1}
                                            onClick={() => this.toggleAccordian(Common.type)}
                                        >
                                            <Icon name={tabOpen.type ? 'plus' : 'minus'} />
                                            {Common.type}
                                        </Accordion.Title>
                                        <Accordion.Content active={tabOpen.type}>
                                            <Carousel itemsToShow={2} renderArrow={this.renderArrow}>
                                                <Card style={{margin:'5px', backgroundColor: 'rgb(200,200,200)'}} inverted onClick={() => store.dispatch(changeShapeType('Square'))}>
                                                    <Card.Content>
                                                        <div style={{width: '30px', height: '30px', backgroundColor: 'black'}}></div>
                                                    </Card.Content>
                                                </Card>
                                                <Card style={{margin:'5px', backgroundColor: 'rgb(200,200,200)'}} onClick={() => store.dispatch(changeShapeType('Circle'))}>
                                                    <Card.Content textAlign='center'>
                                                        <div style={{width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'black'}}></div>
                                                    </Card.Content>
                                                </Card>
                                                <Card style={{margin:'5px', backgroundColor: 'rgb(200,200,200)'}} onClick={() => store.dispatch(changeShapeType('Circle'))}>
                                                    <Card.Content textAlign='center'>
                                                        <div style={{width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'black'}}></div>
                                                    </Card.Content>
                                                </Card>
                                                <Card style={{margin:'5px', backgroundColor: 'rgb(200,200,200)'}} onClick={() => store.dispatch(changeShapeType('Circle'))}>
                                                    <Card.Content textAlign='center'>
                                                        <div style={{width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'black'}}></div>
                                                    </Card.Content>
                                                </Card>
                                            </Carousel>
                                        </Accordion.Content>

                                        <Accordion.Title
                                            index={2}
                                            onClick={() => this.toggleAccordian(Common.color)}
                                        >
                                            <Icon name={tabOpen.color ? 'plus' : 'minus'} />
                                            {Common.color}
                                        </Accordion.Title>
                                        <Accordion.Content active={tabOpen.color}>
                                            <Tab 
                                                    onTabChange={this.colorTabChange}
                                                    menu={{secondary: true}}
                                                    panes={[
                                                        {
                                                            menuItem: 'Shape',
                                                            render: () => <Tab.Pane inverted={this.props.modal ? false : true} style={{padding: '0', display: 'flex', justifyContent: 'center', alignItems:'center', border: '0'}}>
                                                                <ColorPicker 
                                                                    color={color} 
                                                                    colorChange={this.handleColorChange}
                                                                    shapeColor={shapeColor}
                                                                    backgroundColor={backgroundColor}
                                                                />
                                                            </Tab.Pane>
                                                        },
                                                        {
                                                            menuItem: 'Background',
                                                            render: () => <Tab.Pane inverted={this.props.modal ? false : true} style={{padding: '0', display: 'flex', justifyContent: 'center', alignItems:'center', border: '0'}}>
                                                                <ColorPicker 
                                                                    color={color} 
                                                                    colorChange={this.handleColorChange}
                                                                    shapeColor={shapeColor}
                                                                    backgroundColor={backgroundColor}
                                                                />
                                                            </Tab.Pane>
                                                        }
                                                    ]}
                                                />
                                        </Accordion.Content>
                                        
                                        <Accordion.Title
                                            index={3}
                                            onClick={() => this.toggleAccordian(Common.size)}
                                        >
                                            <Icon name={tabOpen.size ? 'plus' : 'minus'} />
                                            {Common.size}
                                        </Accordion.Title>
                                        <Accordion.Content active={tabOpen.size}>
                                            {shapeType === Common.square && (
                                                <Menu inverted={this.props.modal ? false : true} vertical >
                                                    <Menu.Item>
                                                        <Menu.Header>{Common.width}</Menu.Header>
                                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                            <Icon name='minus' style={{cursor: 'pointer'}} onClick={() => this.incrementWidth('down')}/>
                                                            <Input
                                                                inverted={this.props.modal ? false : true}
                                                                type='number'
                                                                style={{margin: '5px'}}
                                                                value={shapeWidth}
                                                                onChange={(e, data) => this.handleSizeChange(data, Common.width)}
                                                                placeholder='Width...'
                                                            />
                                                            <Icon name='plus' style={{cursor: 'pointer'}} onClick={() => this.incrementWidth('up')}/>
                                                        </div>
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        <Menu.Header>{Common.height}</Menu.Header>
                                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                            <Icon name='minus' style={{cursor: 'pointer'}} onClick={() => this.incrementHeight('down')}/>
                                                            <Input
                                                                inverted={this.props.modal ? false : true}
                                                                type='number'
                                                                style={{margin: '5px'}}
                                                                value={shapeHeight}
                                                                onChange={(e, data) => this.handleSizeChange(data, Common.height)}
                                                                placeholder='Height...'
                                                            />
                                                            <Icon name='plus' style={{cursor: 'pointer'}} onClick={() => this.incrementHeight('up')}/>
                                                        </div>
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        <Menu.Header>Increment</Menu.Header>
                                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                            <Input
                                                                inverted={this.props.modal ? false : true}
                                                                type='number'
                                                                style={{margin: '5px'}}
                                                                value={increment}
                                                                onChange={(e, data) => this.handleChangeIncrement(data)}
                                                                placeholder='Increment...'
                                                            />
                                                        </div>
                                                    </Menu.Item>
                                                </Menu>
                                            )}
                                            {shapeType === Common.circle && (
                                                <Menu inverted={this.props.modal ? false : true} vertical >
                                                    <Menu.Item>
                                                        <Menu.Header>{Common.radius}</Menu.Header>
                                                        <Input
                                                            inverted={this.props.modal ? false : true}
                                                            type='number'
                                                            style={{margin: '5px'}}
                                                            value={shapeRadius}
                                                            onChange={(e, data) => this.handleSizeChange(data, Common.radius)}
                                                            placeholder='Radius...'
                                                        />
                                                    </Menu.Item>
                                                </Menu>
                                            )}
                                        </Accordion.Content>
                                        
                                    </Accordion>
                                </Tab.Pane>
                            },
                            {
                                menuItem: 'Layer Menu',
                                render: () => <Tab.Pane inverted={this.props.modal ? false : true}>
                                    <Menu vertical inverted={this.props.modal ? false : true} >
                                        <Menu.Item>Layer menu List Item 1</Menu.Item>
                                    </Menu>
                                </Tab.Pane>
                            }
                        ]}
                    />
                </Menu.Item>
            </Menu>
        )
    }
}

export default ShapeMenu;
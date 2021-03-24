import React, {Component} from 'react';
import { Menu, Card, Tab, Icon, Input, Accordion } from 'semantic-ui-react';
import {connect} from 'react-redux'
import Carousel, { consts } from 'react-elastic-carousel';
import {
    changeShapeType, 
    addShapeToCollection, 
    changeShapeColor, 
    changeBackgroundColor, 
    changeShapeRotation, 
    changeShapeRadius, 
    changeShapeWidth, 
    changeShapeOpacity, 
    changeShapeHeight
} from '../../../actions/canvasActions';
import Common from '../../../constants/common';
import Size from '../../../constants/size';
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
            sizeIncrement: 20,
            rotationIncrement: 20,
            radiusIncrement: 20,
            tabOpen: {
                display: true,
                type: true,
                color: true,
                size: true,
                rotation: true
            },
            dirty: false
        }

    }
    componentDidUpdate(prevProps){
        if(this.props.collectionList && !prevProps.collectionList){
            console.log(this.props.collectionList)
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

    addShape(newShape){
        this.props.dispatch(addShapeToCollection(newShape))
    }
    colorTabChange = (event, data) => {
        this.setState(state => ({
            ...state,
            colorStatus: data.activeIndex === 1 ? Common.background : Common.shape,
            dirty: false
        }))
    }
    changeShapeType = (type) => {
        this.props.dispatch(changeShapeType(type))
    }
    handleSizeChange = (data, type) => {
        const value = parseInt(data.value, 10)
        switch(type){
            case Common.width:
                this.props.dispatch(changeShapeWidth(value));
                break;
            case Common.height:
                this.props.dispatch(changeShapeHeight(value));
                break;
            case Common.radius:
                this.props.dispatch(changeShapeRadius(value));
                break;
        }
    }
    handleRotationChange = (data) => {
        this.props.dispatch(changeShapeRotation(data.value))
    }
    handleChangeSizeIncrement = (data) => {
        this.setState(state => ({
            ...state,
            sizeIncrement: parseInt(data.value, 10)
        }))
    }
    handleChangeRotationIncrement = (data) => {
        this.setState(state => ({
            ...state,
            rotationIncrement: parseInt(data.value, 10)
        }))
    }
    handleChangeRadiusIncrement = (data) => {
        this.setState(state => ({
            ...state,
            radiusIncrement: parseInt(data.value, 10)
        }))
    }
    toggleAccordian = (selectedTab) => {
        this.setState(state => {
            let { display, type, color, size, rotation } = state.tabOpen;
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
                    rotation
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
        const { shapeWidth } = this.props.currentShape;
        const { sizeIncrement } = this.state;
        const newValue = value === 'down' ? (shapeWidth - sizeIncrement <= 0 ? 0 : shapeWidth - sizeIncrement) : shapeWidth + sizeIncrement;
        this.props.dispatch(changeShapeWidth(newValue))
    }
    incrementHeight = (value) => {
        const { shapeHeight } = this.props.currentShape;
        const { sizeIncrement } = this.state;
        const newValue = value === 'down' ? (shapeHeight - sizeIncrement <= 0 ? 0 : shapeHeight - sizeIncrement) : shapeHeight + sizeIncrement;
        this.props.dispatch(changeShapeHeight(newValue))
    }
    incrementRadius = (value) => {
        const { shapeRadius } = this.props.currentShape;
        const { sizeIncrement } = this.state;
        const newValue = value === 'down' ? (shapeRadius - sizeIncrement <= 0 ? 0 : shapeRadius - sizeIncrement) : shapeRadius + sizeIncrement;
        this.props.dispatch(changeShapeRadius(newValue))
    }
    incrementRotation = (value) => {
        const { shapeRotation } = this.props.currentShape;
        const { rotationIncrement } = this.state;
        const newValue = value === 'down' ? (shapeRotation - rotationIncrement <= 0 ? 0 : shapeRotation - rotationIncrement) : shapeRotation + rotationIncrement;
        this.props.dispatch(changeShapeRotation(newValue))
    }

    //Accordian items
    createDisplayItem = () => {
        const { tabOpen } = this.state;
        const { backgroundColor } = this.props.canvasData
        const {shapeOpacity, borderRadius, shapeColor, shapeType } = this.props.currentShape;
        return (
            <Menu.Item className='shape-accordian-option'>
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
                        backgroundColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <div style={{width: '70px', height: '70px', opacity: shapeOpacity, borderRadius: shapeType === Common.square ? '0' : '50%', backgroundColor: shapeColor}}></div>
                    </div>
                </Accordion.Content>
            </Menu.Item>
        )
    }
    createShapeTypeItem = () => {
        const { tabOpen } = this.state;
        const { modal } = this.props;
        const backgroundColor = modal ? 'rgb(50,50,50)' : 'rgb(220,220,220)'
        return (
            <Menu.Item className='shape-accordian-option'>
                <Accordion.Title
                    index={1}
                    onClick={() => this.toggleAccordian(Common.type)}
                    >
                    <Icon name={tabOpen.type ? 'plus' : 'minus'} />
                    {Common.type}
                </Accordion.Title>
                <Accordion.Content active={tabOpen.type}>
                    <Carousel itemsToShow={2} renderArrow={this.renderArrow}>

                        <div style={{width: '30px', height: '30px', backgroundColor}} onClick={() => this.changeShapeType(Common.square)}></div>

                        <div style={{width: '30px', height: '30px', borderRadius: '50%', backgroundColor}} onClick={() => this.changeShapeType(Common.circle)}></div>

                        <div style={{width: '30px', height: '30px', borderRadius: '50%', backgroundColor}} onClick={() => this.changeShapeType(Common.circle)}></div>

                        <div style={{width: '30px', height: '30px', borderRadius: '50%', backgroundColor}} onClick={() => this.changeShapeType(Common.circle)}></div>

                    </Carousel>
                </Accordion.Content>
            </Menu.Item>
        )
    }
    createColorItem = () => {
        const { tabOpen } = this.state;
        const { modal } = this.props;
        const { backgroundColor } = this.props.canvasData
        const { shapeColor } = this.props.currentShape;
        const isInverted = modal ? false : true;

        let color = null;
          if(this.state.colorStatus === Common.shape){
            color = this.state.dirty ? this.state.value : shapeColor;
          } else {
            color = this.state.dirty ? this.state.value : backgroundColor;
          }

        return (
            <Menu.Item className='shape-accordian-option'>
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
                                    render: () => <Tab.Pane inverted={isInverted} style={{padding: '0', display: 'flex', justifyContent: 'center', alignItems:'center', border: '0'}}>
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
                                    render: () => <Tab.Pane inverted={isInverted} style={{padding: '0', display: 'flex', justifyContent: 'center', alignItems:'center', border: '0'}}>
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
            </Menu.Item>
        )
    }
    createSizeItem = () => {
        const { tabOpen, sizeIncrement, rotationIncrement, radiusIncrement } = this.state;
        const { modal } = this.props;
        const { shapeType, shapeWidth, shapeHeight, shapeRadius } = this.props.currentShape;
        const isInverted = modal ? false : true;
        return (
            <Menu.Item textAlign='center' className='shape-accordian-option' >
                <Accordion.Title
                    index={3}
                    onClick={() => this.toggleAccordian(Common.size)}
                    >
                    <Icon name={tabOpen.size ? 'plus' : 'minus'} />
                    {Common.size}
                </Accordion.Title>
                <Accordion.Content active={tabOpen.size}>
                    {shapeType === Common.square && (
                        <Menu.Menu inverted={isInverted} vertical >
                            <Menu.Item style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: '0'}}>
                                <Icon name='minus' style={{cursor: 'pointer', margin: '0'}} onClick={() => this.incrementWidth('down')}/>
                                <Menu.Header style={{margin: '0'}}>{Common.width}</Menu.Header>
                                <Icon name='plus' style={{cursor: 'pointer', margin: '0'}} onClick={() => this.incrementWidth('up')}/>
                            </Menu.Item>
                            <Menu.Item>
                                <Input
                                    inverted={isInverted}
                                    type='number'
                                    value={shapeWidth}
                                    onChange={(e, data) => this.handleSizeChange(data, Common.width)}
                                    placeholder='Width...'
                                />
                            </Menu.Item>
                            <Menu.Item style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: '0'}}>
                                <Icon name='minus' style={{cursor: 'pointer', margin: '0'}} onClick={() => this.incrementHeight('down')}/>
                                <Menu.Header style={{margin: '0'}}>{Common.height}</Menu.Header>
                                <Icon name='plus' style={{cursor: 'pointer', margin: '0'}} onClick={() => this.incrementHeight('up')}/>
                            </Menu.Item>
                            <Menu.Item>
                                <Input
                                    inverted={isInverted}
                                    type='number'
                                    value={shapeHeight}
                                    onChange={(e, data) => this.handleSizeChange(data, Common.height)}
                                    placeholder='Height...'
                                />
                            </Menu.Item>
                            <Menu.Item>
                                <Menu.Header>Increment</Menu.Header>
                                    <Input
                                        inverted={isInverted}
                                        type='number'
                                        value={sizeIncrement}
                                        onChange={(e, data) => this.handleChangeSizeIncrement(data)}
                                        placeholder='Increment...'
                                    />
                            </Menu.Item>
                        </Menu.Menu>
                    )}
                    {shapeType === Common.circle && (
                         <Menu.Menu inverted={isInverted} vertical >
                            <Menu.Item style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: '0'}}>
                                <Icon name='minus' style={{cursor: 'pointer', margin: '0'}} onClick={() => this.incrementRadius('down')}/>
                                <Menu.Header style={{margin: '0'}}>{Common.radius}</Menu.Header>
                                <Icon name='plus' style={{cursor: 'pointer', margin: '0'}} onClick={() => this.incrementRadius('up')}/>
                            </Menu.Item>
                            <Menu.Item>
                                <Input
                                    inverted={isInverted}
                                    type='number'
                                    value={shapeRadius}
                                    onChange={(e, data) => this.handleSizeChange(data, Common.radius)}
                                    placeholder='Radius...'
                                />
                            </Menu.Item>
                            <Menu.Item>
                                <Menu.Header>Increment</Menu.Header>
                                    <Input
                                        inverted={isInverted}
                                        type='number'
                                        value={radiusIncrement}
                                        onChange={(e, data) => this.handleChangeRadiusIncrement(data)}
                                        placeholder='Increment...'
                                    />
                            </Menu.Item>
                        </Menu.Menu>
                    )}
                </Accordion.Content>
            </Menu.Item>
        )
    }
    createRotationItem = () => {
        const { tabOpen, rotationIncrement } = this.state;
        const { modal } = this.props;
        const { shapeType, shapeWidth, shapeHeight, shapeRotation } = this.props.currentShape;
        const isInverted = modal ? false : true;
        return (
            <Menu.Item textAlign='center' className='shape-accordian-option' >
                <Accordion.Title
                    index={3}
                    onClick={() => this.toggleAccordian(Common.rotation)}
                    >
                    <Icon name={tabOpen.rotation ? 'plus' : 'minus'} />
                    {Common.rotation}
                </Accordion.Title>
                <Accordion.Content active={tabOpen.rotation}>
                    <Menu.Menu inverted={isInverted} vertical >
                        <Menu.Item style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: '0'}}>
                            <Icon name='minus' style={{cursor: 'pointer', margin: '0'}} onClick={() => this.incrementRotation('down')}/>
                            <Menu.Header style={{margin: '0'}}>{Common.rotation}</Menu.Header>
                            <Icon name='plus' style={{cursor: 'pointer', margin: '0'}} onClick={() => this.incrementRotation('up')}/>
                        </Menu.Item>
                        <Menu.Item>
                            <Input
                                inverted={isInverted}
                                type='number'
                                min={0}
                                max={360}
                                value={shapeRotation}
                                onChange={(e, data) => this.handleRotationChange(data, Common.rotation)}
                                placeholder='Rotation...'
                            />
                        </Menu.Item>
                        <Menu.Item>
                            <Menu.Header>Increment</Menu.Header>
                                <Input
                                    inverted={isInverted}
                                    type='number'
                                    value={rotationIncrement}
                                    onChange={(e, data) => this.handleChangeIncrement(data)}
                                    placeholder='Increment...'
                                />
                        </Menu.Item>
                    </Menu.Menu>
                </Accordion.Content>
            </Menu.Item>
        )
    }
    createAccordianList = () => {
        const { shapeType } = this.props.currentShape;
        const arr = [
            {
                key: Common.display,
                render: () => this.createDisplayItem(),
            },
            {
                key: Common.type,
                render: () => this.createShapeTypeItem(),
            },
            {
                key: Common.color,
                render: () => this.createColorItem(),
            },
            {
                key: Common.size,
                render: () => this.createSizeItem(),
            },
            {
                key: Common.rotation,
                render: () => {
                    if(shapeType !== Common.circle) {
                        return this.createRotationItem()
                    }
                },
            },

        ]
        return arr.map(item => {
            return  item.render()
        })
    }
    currentShapePane = () => {
        const { modal, canvasData } = this.props;
        const { shapeColor } = this.props.currentShape;
        const { backgroundColor } = canvasData;

        const isInverted = modal ? false : true;
        const wrapHeight = modal ? '433px' : 'calc(100vh - 120px)';
        const scrollClass = modal ? 'scrollbar' : 'scrollbar-inverted'

        let color = null;
          if(this.state.colorStatus === Common.shape){
            color = this.state.dirty ? this.state.value : shapeColor;
          } else {
            color = this.state.dirty ? this.state.value : backgroundColor;
          }
        return (
            <div className={`${scrollClass} tab-pane-wrap`} style={{height: wrapHeight}}>
                <Tab.Pane inverted={isInverted} style={{padding: '0', border: '0', display: 'flex', justifyContent: 'center', margin: '0 10px 0 20px'}}>
                    <Accordion inverted={isInverted} as={Menu} vertical style={{border: '0'}} fluid >
                        {this.createAccordianList()}
                    </Accordion>
                </Tab.Pane>
            </div>
        )
    }
    createCollectionCards = () => {
        const { collectionList } = this.props;
        collectionList.map(shape => {
            return (
                <Menu.Item>
                    {shape.type}
                </Menu.Item>
            )
        })
    }
    layerMenuPane = () => {
        const { modal, canvasData } = this.props;
        const isInverted = modal ? false : true;
        const wrapHeight = modal ? '433px' : 'calc(100vh - 120px)';
        const scrollClass = modal ? 'scrollbar' : 'scrollbar-inverted';
        return (
            <div className={`${scrollClass} tab-pane-wrap`} style={{height: wrapHeight}}>
                <Tab.Pane inverted={isInverted} style={{padding: '0', border: '0', display: 'flex', justifyContent: 'center', margin: '0'}}>
                    <Menu vertical inverted={isInverted} style={{margin: '10px'}}>
                        {canvasData.collectionList.map(shape => {
                            return (
                                <Menu.Item>
                                    <Card inverted={isInverted}>
                                        <Card.Content style={{display: 'flex', alignItems: 'center'}}>
                                            <div style={{width: '20px', height: '20px', backgroundColor: shape.color, borderRadius: shape.type === Common.square ? 0 : '50%', marginRight: '10px'}}></div>
                                            <Card.Header>{shape.type}</Card.Header>
                                        </Card.Content>
                                    </Card>
                                </Menu.Item>
                            )
                        })}
                    </Menu>
                </Tab.Pane>
            </div>
        )
    }
    render(){
        const { canvasData, modal } = this.props;
        const isInverted = modal ? false : true;
        return (
            <Menu
                style={{ height: '100%', width: `${Size.sidePanelMenuWidth}px`}}
                inverted={isInverted}
                attached='right'
                vertical
            >
                <Menu.Item style={{height: '100%', padding: '0', paddingBottom: '20px'}}>
                        <div style={{height: '100%'}}>
                            <Tab
                                menu={{secondary: true}}
                                panes={[
                                    {
                                        menuItem: {key: 'Current Shape', icon: 'circle', color: 'teal'},
                                        render: () => this.currentShapePane()
                                    },
                                    {
                                        menuItem: {key: 'Current Shape', icon: 'list'},
                                        render: () => this.layerMenuPane()
                                    },
                                    {
                                        menuItem: {key: 'Settings', icon: 'cogs'},
                                        render: () => this.layerMenu()
                                    }
                                ]}
                            />
                        </div>
                </Menu.Item>
            </Menu>
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

export default connect(mapStateToProps)(ShapeMenu);
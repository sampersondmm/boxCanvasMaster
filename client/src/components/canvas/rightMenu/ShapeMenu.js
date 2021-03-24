import React, {Component} from 'react';
import { Menu, Card, Tab, Accordion } from 'semantic-ui-react';
import {connect} from 'react-redux'
import { addShapeToCollection } from '../../../actions/canvasActions';
import Common from '../../../constants/common';
import Size from '../../../constants/size';
import ShapeDisplayCard from './shapeCards/ShapeDisplayCard';
import ShapeSizeCard from './shapeCards/ShapeSizeCard';
import ShapeColorCard from './shapeCards/ShapeColorCard';
import ShapeTypeCard from './shapeCards/ShapeTypeCard';
import ShapeRotationCard from './shapeCards/ShapeRotationCard';

class ShapeMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeIndex: 1,
            tabOpen: {
                display: true,
                type: true,
                color: true,
                size: true,
                rotation: true
            },
        }

    }

    addShape(newShape){
        this.props.dispatch(addShapeToCollection(newShape))
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
    createAccordianList = () => {
        const { modal } = this.props;
        const { shapeType } = this.props.currentShape;
        const { tabOpen } = this.state;
        const isInverted = modal ? false : true;
        const arr = [
            {
                key: Common.display,
                render: () => {
                    return (
                        <ShapeDisplayCard
                            open={tabOpen.display}
                            handleOpen={() => this.toggleAccordian(Common.display)}
                        />
                    )
                },
            },
            {
                key: Common.type,
                render: () => {
                    return (
                        <ShapeTypeCard
                            open={tabOpen.type}
                            handleOpen={() => this.toggleAccordian(Common.type)}
                            inverted={isInverted}
                        />
                    )
                },
            },
            {
                key: Common.color,
                render: () => {
                    return (
                        <ShapeColorCard
                            open={tabOpen.color}
                            handleOpen={() => this.toggleAccordian(Common.color)}
                            inverted={isInverted}
                        />
                    )
                },
            },
            {
                key: Common.size,
                render: () => {
                    return (
                        <ShapeSizeCard 
                            open={tabOpen.size}
                            handleOpen={() => this.toggleAccordian(Common.size)}
                            inverted={isInverted}
                        />
                    )
                },
            },
            {
                key: Common.rotation,
                render: () => {
                    if(shapeType === Common.square){
                        return (
                            <ShapeRotationCard
                                open={tabOpen.rotation}
                                handleOpen={() => this.toggleAccordian(Common.rotation)}
                                inverted={isInverted}
                            />
                        )
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
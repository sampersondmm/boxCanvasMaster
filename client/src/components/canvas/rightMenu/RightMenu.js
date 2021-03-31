import React, {Component} from 'react';
import { Menu, Tab } from 'semantic-ui-react';
import {connect} from 'react-redux'
import { addShapeToCollection } from '../../../actions/canvasActions';
import Common from '../../../constants/common';
import ShapeMenu from './ShapeMenu';
import LayerMenu from './LayerMenu';

class RightMenu extends Component {

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

    render(){
        const { canvasData, modal } = this.props;
        const isInverted = modal ? false : true;
        return (
            <Menu
                style={{ height: '100%', width: this.props.width, margin: '0', borderRadius: '0'}}
                inverted={isInverted}
                vertical
            >
                <Menu.Item style={{height: '100%', padding: '0', paddingBottom: '20px'}}>
                        <div style={{height: '100%'}}>
                            <Tab
                                menu={{secondary: true}}
                                panes={[
                                    {
                                        menuItem: {key: 'Current Shape', icon: 'circle', color: 'teal'},
                                        render: () => {
                                            return (
                                                <ShapeMenu 
                                                    inverted={isInverted} 
                                                    modal={modal} 
                                                    canvasData={canvasData}
                                                    currentShape={this.props.currentShape}
                                                    shapeType={this.props.currentShapeType}
                                                />
                                            )
                                        }
                                    },
                                    {
                                        menuItem: {key: 'Layers', icon: 'list'},
                                        render: () => <LayerMenu shapeList={this.props.shapeList} inverted={isInverted}/>
                                    },
                                    {
                                        menuItem: {key: 'Settings', icon: 'cogs'},
                                        render: () => <LayerMenu shapeList={this.props.shapeList} inverted={isInverted}/>
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
    const { currentShape, canvasData, currentShapeType } = state.canvas;
    return {
        currentShape,
        currentShapeType,
        canvasData
    }
}

export default connect(mapStateToProps)(RightMenu);
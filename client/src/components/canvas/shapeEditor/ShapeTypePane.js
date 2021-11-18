import React, { Component } from 'react';
import { Icon, Header } from 'semantic-ui-react';
import Carousel, { consts } from 'react-elastic-carousel'

const PropertyDisplayRow = ({svgs}) => {
    return (
        <div style={{
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-evenly', 
            padding: '25px 0'
        }}>
            {svgs}
        </div>
    )
}

const PropertyDisplay = ({
    type,
    fill = 'rgb(44 84 101)',
    opacity = 0.7,
    r = 40,
    rx = 0,
    rotation = 0,
    width = 80,
    height = 80,
    text = '',
    stroke = 'black',
    strokeWidth = 0,
}) => {
    const renderShape = () => {
        switch(type){
            case 'square':
                return (
                    <rect
                        x='0'
                        y='0'
                        fill={fill}
                        rx={rx}
                        opacity={opacity}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        width={width}
                        height={height}
                    />
                )
            case 'circle':
                return (
                    <circle
                        cx='50%'
                        cy='50%'
                        r={r - strokeWidth}
                        fill={fill}
                        opacity={opacity}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                    />
                )
            default:
                return null;
        }
    }
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <div style={{
                height: '100px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <svg style={{
                    height: height, 
                    width: width, 
                    backgroundColor: 'rgba(0,0,0,0)',
                    transform: `rotate(${rotation}deg)`
                }}>
                    {renderShape()}
                </svg>
            </div>
            <Header style={{margin: '0', marginTop: '10px', zIndex: 2}}>{text}</Header>
        </div>
    )
}
const PathPropertyDisplay = ({
    fill = 'rgb(44 84 101)',
    opacity = 0.7,
    open = false,
    points = [],
    text = '',
    stroke = 'rgb(20,20,20)',
    strokeWidth = 0,
}) => {
    const renderPointString = () => {
        let string = ''
        points.map((point, index) => {
            if(index === 0){
                string = `M ${point[0]} ${point[1]}`
            } else if (index === points.length - 1){
                if(open){
                    string = string.concat(` ${point[0]} ${point[1]}`)
                } else {
                    string = string.concat(` ${point[0]} ${point[1]} Z`)
                }
            } else {
                string = string.concat(` L ${point[0]} ${point[1]}`)
            }
        })
        return string;
    }
    const renderShape = () => {
        return (
            <path
                d={renderPointString()}
                fill={fill}
                opacity={opacity}
                stroke={stroke}
                strokeWidth={strokeWidth}
            />
        )
    }
    const renderCircles = () => {
        return points.map((point) => {
            return (
                <circle
                    cx={point[0]}
                    cy={point[1]}
                    r={5}
                    fill='rgba(50,50,50, 0.5)'
                />
            )
        })
    }
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <div style={{
                height: '100px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <svg style={{
                    height: 100, 
                    width: 160, 
                    backgroundColor: 'rgba(0,0,0,0)',
                }}>
                    {renderShape()}
                    {renderCircles()}
                </svg>
            </div>
            <Header style={{margin: '0', marginTop: '10px', zIndex: 2}}>{text}</Header>
        </div>
    )
}

class ShapeTypePane extends Component {
    constructor(props){
        super(props);
    }
    renderArrow = ({ type, onClick, isEdge }) => {
        const pointer = type === consts.PREV ? (
            <div style={{height: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                <Icon name='angle left' onClick={onClick}/>
            </div>
        ) : (
            <div style={{height: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                <Icon name='angle right' onClick={onClick}/>
            </div>
        )
        return pointer;
    }
    createDisplays = () => {
        return [
            <svg style={{height: '100px', width: '100px', backgroundColor: 'rgba(0,0,0,0)', border: '1px solid red'}}>
                <rect
                    x='0'
                    y='0'
                    fill='rgb(106, 184, 197)'
                    opacity={0.7}
                    width='100'
                    height='100'
                />
            </svg>,
            <svg style={{height: '100px', width: '100px', backgroundColor: 'rgba(0,0,0,0)', border: '1px solid red'}}>
                <rect
                    x='0'
                    y='0'
                    fill='rgb(106, 184, 197)'
                    opacity={0.7}
                    width='100'
                    height='100'
                />
            </svg>,
            <svg style={{height: '100px', width: '100px', backgroundColor: 'rgba(0,0,0,0)', border: '1px solid red'}}>
                <rect
                    x='0'
                    y='0'
                    fill='rgb(106, 184, 197)'
                    opacity={0.7}
                    width='100'
                    height='100'
                />
            </svg>,
        ]
    }
    squareCard = () => {
        return (
            <div style={{ width: '100%', height: '470px', display: 'flex', justifyContent: 'space-between', alignItems: 'space-between', flexDirection: 'column'}}>
                <Header style={{ width: '100%', height: '50px', display: 'flex', margin: '0', alignItems: 'center'}}>{`SQUARE (<rect/>)`}</Header>
                <div style={{height: '420px', display: 'flex'}}>
                    <div style={{width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <svg style={{height: '300px', width: '300px', backgroundColor: 'rgba(0,0,0,0)'}}>
                            <rect
                                x='0'
                                y='0'
                                fill='rgb(44 84 101)'
                                opacity={0.7}
                                width='300'
                                height='300'
                            />
                        </svg>
                    </div>
                    <div className='scrollbar' style={{width: '50%', overflowY: 'scroll'}}>
                        <PropertyDisplayRow
                            svgs={[
                                <PropertyDisplay
                                    type='square'
                                    text={'Width'}
                                    width={100}
                                    height={70}
                                />,
                                <PropertyDisplay
                                    type='square'
                                    text={'Height'}
                                    width={70}
                                    height={100}
                                />,
                            ]}
                        />
                        <PropertyDisplayRow
                            svgs={[
                                <PropertyDisplay
                                    type='square'
                                    rotation={45}
                                    text={'Rotate'}
                                />,
                                <PropertyDisplay
                                    type='square'
                                    text={'Stroke'}
                                    stroke='black'
                                    strokeWidth={6}
                                />,
                            ]}
                        />
                        <PropertyDisplayRow
                            svgs={[
                                <PropertyDisplay
                                    type='square'
                                    text={'Border Radius'}
                                    rx='15'
                                />,
                            ]}
                        />
                    </div>
                </div>
            </div>
        )
    }

    circleCard = () => { 
        return (
            <div style={{ width: '100%', height: '470px', display: 'flex', justifyContent: 'space-between', alignItems: 'space-between', flexDirection: 'column'}}>
                <Header style={{ width: '100%', height: '50px', display: 'flex', margin: '0', alignItems: 'center'}}>{`CIRCLE (<circle/>)`}</Header>
                <div style={{height: '420px', display: 'flex'}}>
                    <div style={{width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <svg style={{height: '300px', width: '300px', backgroundColor: 'rgba(0,0,0,0)'}}>
                            <circle
                                cx='150'
                                cy='150'
                                fill='rgb(44 84 101)'
                                opacity={0.7}
                                r='150'
                            />
                        </svg>
                    </div>
                    <div className='scrollbar' style={{width: '50%', overflowY: 'scroll'}}>
                        <PropertyDisplayRow
                            svgs={[
                                <PropertyDisplay
                                    type='circle'
                                    text='Radius'
                                    r={20}
                                />,
                                <PropertyDisplay
                                    type='circle'
                                    text={'Border'}
                                    strokeWidth={5}
                                />,
                            ]}
                        /> 
                    </div>
                </div>
            </div>
        )
    }

    pathCard = () => { 
        return (
            <div style={{ width: '100%', height: '470px', display: 'flex', justifyContent: 'space-between', alignItems: 'space-between', flexDirection: 'column'}}>
                <Header style={{ width: '100%', height: '50px', display: 'flex', margin: '0', alignItems: 'center'}}>{`CUSTOM SHAPE (<path/>)`}</Header>
                <div style={{height: '420px', display: 'flex'}}>
                    <div style={{width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <svg style={{height: '300px', width: '300px', backgroundColor: 'rgba(0,0,0,0)'}}>
                            <path
                                fill='rgb(44 84 101)'
                                d='
                                    M 0 0
                                    L 20 200
                                    L 150 300
                                    L 300 50
                                    Z
                                '
                                opacity={0.7}
                            />
                        </svg>
                    </div>
                    <div className='scrollbar' style={{width: '50%', overflowY: 'scroll'}}>
                        <PropertyDisplayRow
                            svgs={[
                                <PathPropertyDisplay
                                    text='Open'
                                    strokeWidth={3}
                                    open={true}
                                    points={[
                                        [5, 50],
                                        [60, 95],
                                        [60, 5],
                                        [100, 95],
                                        [100, 5],
                                        [155, 50],
                                    ]}
                                />,
                                <PathPropertyDisplay
                                    text='Closed'
                                    strokeWidth={3}
                                    open={false}
                                    points={[
                                        [5, 50],
                                        [60, 95],
                                        [60, 5],
                                        [100, 95],
                                        [100, 5],
                                        [155, 50],
                                    ]}
                                />,
                            ]}
                        /> 
                    </div>
                </div>
            </div>
        )
    }

    render(){
        return (
            <div style={{
                width: '100%',
                height: '100%',
            }}>
                <div style={{
                    width: '100%',
                    // height: '50px',
                    display: 'flex',
                    flexDirection: 'column',
                    // padding: '0 20px'
                }}>
                    <Header style={{display: 'flex', alignItems: 'center', margin: '0', height: '50px', padding: '0 50px'}}>Shape Type</Header>
                    <div style={{ height: '500px'}}>
                        <Carousel itemsToShow={1} renderArrow={this.renderArrow}>
                            {this.squareCard()}
                            {this.circleCard()}
                            {this.pathCard()}
                        </Carousel>
                    </div>
                </div>
            </div>
        )
    }
}

export default ShapeTypePane;
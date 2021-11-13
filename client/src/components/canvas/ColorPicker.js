import React, {Component} from 'react'
import {CustomPicker} from 'react-color'
import {EditableInput, Hue, Alpha, Saturation, Checkboard} from 'react-color/lib/components/common'
import Size from '../../constants/size';

class ColorPicker extends Component {
    render(){
      return (
        <div className='color-picker-wrap' style={{width: '100%', height: '100%'}}>
            <div className='color-picker-saturation'>
              <Saturation 
                {...this.props} 
                onChange={event => this.props.colorChange(event, this.props.rgb)}
                // onChangeComplete={this.props.completeColorChange}
            />
            </div>
            <div className='color-picker-hue'>
              <Hue 
                {...this.props} 
                onChange={event => this.props.colorChange(event, this.props.rgb)}
                // onChangeComplete={this.props.completeColorChange} 
            />
            </div>
            <div  className='color-picker-alpha'>
                <Checkboard/>
              <Alpha 
                {...this.props} 
                onChange={event => this.props.colorChange(event, this.props.rgb)}
                // onChangeComplete={this.props.completeColorChange}
            />
            </div>
            {this.props.applyColorChange && (
                <div className='color-picker-bottom'>
                    <i onClick={() => this.props.applyColorChange(this.props.rgb)} className="fal fa-check color-picker-icon"></i>
                </div>
            )}
        </div>
      )
    }
}

export default CustomPicker(ColorPicker)
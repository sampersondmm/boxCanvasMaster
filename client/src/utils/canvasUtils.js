import Common from '../constants/common';
import cloneDeep from 'lodash/cloneDeep';

const updateCurrentShape = (currentShape, type, field, value) => {
    const shapeCopy = cloneDeep(currentShape);
    switch(type){
        case Common.square:
          shapeCopy.square[field] = value;
          break;
        case Common.circle:
          shapeCopy.circle[field] = value;
          break;
        case Common.line:
          shapeCopy.line[field] = value;
          break;
        default:
          break;
      }
    return shapeCopy;
}

export { updateCurrentShape };
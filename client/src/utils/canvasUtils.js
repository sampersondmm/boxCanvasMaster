import Common from '../constants/common';
import cloneDeep from 'lodash/cloneDeep';

const updateCurrentShape = (currentShape, field, value) => {
    const shapeCopy = cloneDeep(currentShape);
    switch(shapeCopy.type){
        case Common.square:
          shapeCopy[field] = value;
          break;
        case Common.circle:
          shapeCopy[field] = value;
          break;
        case Common.line:
          shapeCopy[field] = value;
          break;
        default:
          break;
      }
    return shapeCopy;
}

export { updateCurrentShape };
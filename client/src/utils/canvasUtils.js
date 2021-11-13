import Common from '../constants/common';
import cloneDeep from 'lodash/cloneDeep';

const updateCurrentShape = (state, field, value) => {
    const copy = cloneDeep(state);
    const { currentShape, editedShapes } = copy.editor;
    currentShape[field] = value;
    editedShapes[currentShape.type.toLowerCase()] = {...currentShape};
    return {
      ...copy,
      editor: {
        ...copy.editor,
        currentShape,
        editedShapes
      }
    }
}

const createPointString = (pointData) => {
  
}

export { 
  updateCurrentShape
};
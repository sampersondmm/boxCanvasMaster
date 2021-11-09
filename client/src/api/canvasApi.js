import { apiCall } from "../utils/apiUtils";

const formatError = (error) => {
    const message = error && error.data ?
        error.data.error.message : 
        '';
    throw new Error(message);
}

class CanvasAPI {
    createCanvas = async (canvas, userId) => {
        try {
            const response = await apiCall({
                method: 'post', 
                url: '/api/canvas',
                data: {
                    user: userId,
                    canvas
                }
            })
            return response;
        } catch (error) {
            formatError(error)
        }
    }
    fetchCanvas = async (canvasId) => {
        try {
            const response = await apiCall({
                method: 'get',
                url: `/api/canvas/${canvasId}`
            })
            return response;
        } catch (error) {
            formatError(error)
        }
    }
    updateCanvas = async (canvas, userId) => {
        try {
            const response = await apiCall({
                method: 'put',
                url: `/api/canvas/${canvas._id}`,
                data: {
                    user: userId,
                    canvas
                }
            })
            return response;
        } catch (error) {
            formatError(error)
        }
    }
    deleteCanvas = async (canvasId) => {
        try {
            const response = await apiCall({
                method: 'put',
                url: `/api/canvas/delete/${canvasId}`,
            })
            return response;
        } catch (error) {
            formatError(error)
        }
    }
    fetchCanvasList = async (userId) => {
        try {
            const response = await apiCall({
                method: 'get',
                url: `/api/canvas?user_id=${userId}`
            })
            return response
        } catch (error) {
            formatError(error)
        }
    }
}

export default CanvasAPI;
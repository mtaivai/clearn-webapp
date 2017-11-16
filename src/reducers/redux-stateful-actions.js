

import { handleActions, combineActions } from 'redux-actions'

const requestAction = (action) => {
    return action + '_REQUEST';
};
const successAction = (action) => {
    return action + '_SUCCESS';
};
const errorAction = (action) => {
    return action + '_ERROR';
};
const phaseTransition = (action) => {
    return action + '_PHASE_TRANSITION';
};


export const statefulAction = (action) => {
    return combineActions(requestAction(action), successAction(action), errorAction(action));
};


const defaultRequestPhaseHandler = (state, action) => {
    const phase = action.meta && action.meta.phase;
    switch (phase) {
        case 'request':
            return {...state, isWorking: true};
            break;

        default:
            return state;
    }
};
const defaultErrorPhaseHandler = (state, action) => {
    const phase = action.meta && action.meta.phase;
    if (phase === 'error' || action.error) {
        return {...state, isWorking: false};
    } else {
        return state;
    }

}

export const handleStatefulActions = (handlers, defaultState) => {
    for (let type in handlers) {
        if (!handlers.hasOwnProperty(type)) {
            continue;
        }
        const handler = handlers[type];
        if (typeof(handler) === 'object') {
            // Replace with custom logic:
            // console.log("Handling as stateful action: '" + type + "'");

            handlers[type] = (state, action) => {

                let requestPhaseHandler = handler['request'] || defaultRequestPhaseHandler;
                let successHandler = handler['success'] || handler['next'] || handler[0];
                let errorHandler = handler['error'] || handler['throw'] || defaultErrorPhaseHandler;


                let error = !!action.error;

                let handlerDelegate;
                const phase = action.meta && action.meta.phase;


                switch (phase) {
                    case 'request':
                        handlerDelegate = requestPhaseHandler;
                        break;
                    case 'success':
                        handlerDelegate = successHandler;
                        break;
                    case 'error':
                        handlerDelegate = errorHandler;
                        error = true;
                        break;
                    default:
                }

                let newState;
                if (typeof(handlerDelegate) === 'function') {
                    newState = handlerDelegate(state, action);

                    if (newState !== state) {
                        switch (phase) {
                            case 'request':
                                if (!newState.isWorking) {
                                    newState.isWorking = true;
                                }
                                break;
                            case 'success':
                            case 'error':
                                if (newState.isWorking) {
                                    newState.isWorking = false;
                                }
                                break;
                        }
                    }


                } else {
                    newState = state;
                }
                if (newState !== state) {
                    newState.stateSince = Date.now();
                }
                return newState;

            };
        } else {
            // console.log("Not handling as stateful action: '" + type + "'");

        }
    }


    return handleActions(handlers, defaultState);
}

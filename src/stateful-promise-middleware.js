
import { isFSA } from 'flux-standard-action';

function isPromise(val) {
    return val && typeof val.then === 'function';
}

const statefulPromiseMiddleware = ({ dispatch }) => {
    return next => action => {

        if (!isFSA(action)) {
            // Not a FSA (Flux Standard Action)
            return isPromise(action)
                ? action.then(dispatch)
                : next(action);
        }

        const meta = action.meta || {};

        const booleanOrElse = (val, def) => (typeof(val) !== 'undefined' ? !!val : !!def);

        // Should we dispatch separate phase actions: '_REQUEST', '_SUCCESS' and '_ERROR':
        const withPhaseActions = booleanOrElse(meta.withPhaseActions, true);

        const dispatchMainAction = booleanOrElse(meta.dispatchMainAction, false);

        const unifiedPhaseActionTypes = booleanOrElse(meta.unifiedPhaseActionTypes, false);

        const dispatchActionOnRequest = booleanOrElse(meta.dispatchActionOnRequest, withPhaseActions);
        const dispatchActionOnSuccess = booleanOrElse(meta.dispatchActionOnSuccess, withPhaseActions);
        const dispatchActionOnError = booleanOrElse(meta.dispatchActionOnError, withPhaseActions);

        const dispatchMainActionOnRequest = booleanOrElse(meta.dispatchMainActionOnRequest, false);
        const dispatchMainActionOnSuccess = booleanOrElse(meta.dispatchMainActionOnSuccess, dispatchMainAction);
        const dispatchMainActionOnError = booleanOrElse(meta.dispatchMainActionOnError, dispatchMainAction);

        const requestPhaseActionType = action.type + (unifiedPhaseActionTypes ? '_PHASE_TRANSITION' : '_REQUEST');
        const successPhaseActionType = action.type + (unifiedPhaseActionTypes ? '_PHASE_TRANSITION' : '_SUCCESS');
        const errorPhaseActionType = action.type + (unifiedPhaseActionTypes ? '_PHASE_TRANSITION' : '_ERROR');


        if (isPromise(action.payload)) {


            // TODO we should have an option to use either separate sequence actions (the current impl) or
            // status meta field

            if (dispatchActionOnRequest) {
                dispatch({
                    ...action,
                    type: requestPhaseActionType,
                    payload: { request: action.payload},
                    meta: {...meta, phase: "request"}
                });
            }
            if (dispatchMainActionOnRequest) {

                dispatch({...action, payload: {request: action.payload}, meta: {...meta, phase: "request"}});
            }


            // dispatch({...action, payload: {}});


            action.payload.then(
                result => {
                    let ret;
                    if (dispatchActionOnSuccess) {
                        ret = dispatch({
                            ...action,
                            type: successPhaseActionType,
                            payload: result,
                            meta: {...meta, phase: "success"}
                        });
                    }
                    if (dispatchMainActionOnSuccess) {
                        ret = dispatch({...action, payload: result, meta: {...meta, phase: "success"}});
                    }
                    return ret;
                },
                error => {

                    if (dispatchActionOnError) {
                        dispatch({
                            ...action,
                            type: errorPhaseActionType,
                            payload: error,
                            error: true,
                            meta: {...meta, phase: "error"}
                        });
                    }

                    if (dispatchMainActionOnError) {
                        dispatch({...action, payload: error, error: true, meta: {...meta, phase: "error"}});
                    }
                    return Promise.reject(error);
                }
            )
        } else {
            return next(action);
        }

    };
};

export default statefulPromiseMiddleware;

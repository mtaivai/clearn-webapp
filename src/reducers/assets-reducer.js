

import { handleActions, combineActions } from 'redux-actions'
import {fetchAssets, updateAsset} from "../actions";

import {handleStatefulActions, statefulAction} from "./redux-stateful-actions";
//
// const foo = (state, action) => {
//     const phase = action.meta.phase;
//     let newState = state;
//     switch (phase) {
//         case 'request':
//             newState = {...state, isFetching: true};
//             break;
//         case 'success':
//             newState = {
//                 ...state,
//                 isFetching: false,
//                 didInvalidate: state.didInvalidate,
//                 count: action.payload.count,
//                 offset: action.payload.offset,
//                 items: action.payload.items,
//                 totalCount: action.payload.totalCount
//             };
//             break;
//         case 'error':
//             newState = {...state, isFetching: false};
//             break;
//         default:
//             newState = state;
//     }
//     if (newState !== state) {
//         newState.stateSince = Date.now();
//     }
//     return newState;
// };
//

const assets = handleStatefulActions({

    [statefulAction(fetchAssets)]: {
        success(state, action)  {
            return {
                ...state,
                didInvalidate: state.didInvalidate,
                count: action.payload.count,
                offset: action.payload.offset,
                items: action.payload.items,
                totalCount: action.payload.totalCount
            };
        }
    },

    [statefulAction(updateAsset)](state, action) {
        const newState = {...state};
        newState.items[0] = action.payload.item;
        return newState;
    }
}, {
    isWorking: false,
    didInvalidate: false,
    items: []
});


export default assets;

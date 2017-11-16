import { combineReducers } from 'redux'
import assets from './assets-reducer'

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

const appReducer = combineReducers({
    assets,
    router: routerReducer
});



export default appReducer


// // By Bruno Grieder / SO
// const getAllMethods = (obj) => {
//     let props = []
//
//     do {
//         const l = Object.getOwnPropertyNames(obj)
//             .concat(Object.getOwnPropertySymbols(obj).map(s => s.toString()))
//             .sort()
//             .filter((p, i, arr) =>
//                 typeof obj[p] === 'function' &&  //only the methods
//                 p !== 'constructor' &&           //not the constructor
//                 (i == 0 || p !== arr[i - 1]) &&  //not overriding in this prototype
//                 props.indexOf(p) === -1          //not overridden in a child
//             )
//         props = props.concat(l)
//     }
//     while (
//         (obj = Object.getPrototypeOf(obj)) &&   //walk-up the prototype chain
//         Object.getPrototypeOf(obj)              //not the the Object prototype methods (hasOwnProperty, etc...)
//         )
//
//     return props
// };
//
// class ActionAPI {
//     constructor() {
//         getAllMethods(this).forEach((methodName) => {
//             //console.log("X: " + x);
//
//             const method = this[methodName];
//
//             // To action name:
//             const actionType = methodName.replace(/([a-z])([A-Z])/, "$1_$2").toUpperCase();
//
//
//             method.toAction = () => {
//                 this[methodName] = createAction(actionType, method);
//             }
//         });
//     }
// }
//
// export class ThingAPI extends ActionAPI {
//     constructor() {
//         super();
//         this.namespace = "THING";
//
//         // for (let x in this.prototype) {
//         //     console.log("X: " + x);
//         // }
//
//         // this.
//         //this.fetchThing = createAction('FETCH_THING', this.fetchThing);
//
//         this.fetchThing.toAction();
//
//     }
//
//     fetchThing() {
//
//         return new Promise((resolve, reject) => {
//             setTimeout(() => {
//
//                 resolve("MyAPI!");
//                 //reject("Foo");
//             }, 2000);
//         })
//     }
// }

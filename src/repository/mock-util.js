
export const delayedPromise = (func, delay = 1000) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Call resolve");
            resolve(func());
            //reject("Foo");
        }, delay);
    });
};

/**
 Much of this code is derived from:
 Copyright (c) 2018 Jed Watson.
 Licensed under the MIT License (MIT)
 http://jedwatson.github.io/classnames
*/

export function classNames() {
    const classes = [];
    const hasOwn = Object.prototype.hasOwnProperty;
    let index;

    for (index = 0; index < arguments.length; index += 1) {
        const arg = arguments[index];

        if (arg) {
            const argType = typeof arg;

            if (argType === 'string' || argType === 'number') {
                classes.push(arg);
            } else if (Array.isArray(arg)) {
                if (arg.length) {
                    const inner = classNames(...arg);

                    if (inner) {
                        classes.push(inner);
                    }
                }
            } else if (argType === 'object') {
                if (arg.toString === Object.prototype.toString) {
                    let key;

                    for (key in arg) {
                        if (hasOwn.call(arg, key) && arg[key]) {
                            classes.push(key);
                        }
                    }
                } else {
                    classes.push(arg.toString());
                }
            }
        }
    }

    const result = classes.join(' ');

    return result?.length ? result : undefined;
}
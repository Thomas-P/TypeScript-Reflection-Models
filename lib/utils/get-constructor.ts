/**
 * Created by ThomasP on 18.04.2016.
 */

/**
 * Return the constructor chain of a class or function prototype chain
 * @param target
 * @returns {any}
 */
export function getConstructorChain(target): Array<any> {
    let result = [];
    let shiftFirst = false;
    let getPrototype = (target) => {
        return target.prototype || target.__proto__;
    };

    if (target && typeof target === 'function') {
        target = getPrototype(target);
    } else {
        shiftFirst = true;
    }

    if (!target) {
        return result;
    }

    do {
        result.push(target);
        target = getPrototype(target);
    } while(target);

    if (shiftFirst) {
        result.shift();
    }
    result.pop();
    return result.map((item) => item.constructor);
}
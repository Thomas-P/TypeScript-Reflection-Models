/**
 * Created by ThomasP on 27.03.2016.
 */

const propertyKey: string = 'model:property-list';

/**
 * add the property name to a property list on the object
 * @param target
 * @param propertyKeyValue
 */
export function setProperty(target, propertyKeyValue: string) {
    if (!target || typeof propertyKeyValue !== 'string') {
        throw new Error('Could not set meta information because the target is undefined or the property is not named.');
    }
    let data = Reflect.getMetadata(propertyKey, target);
    if (data) {
        if (data.indexOf(propertyKeyValue) === -1) {
            data.push(propertyKeyValue);
        }
    } else {
        Reflect.defineMetadata(propertyKey, [propertyKeyValue], target);
    }
}


/**
 *
 * @param target
 * @param typeKey
 * @returns {any}
 */
export function getProperties(target, typeKey?: string): Array<string> {
    if (!target) {
        throw new Error('Cannot get information, if the target is not set.');
    }
    if (typeof target === 'function') {
        return getProperties(target.prototype, typeKey);
    }
    if (!Reflect.hasMetadata(propertyKey, target)) {
        return [];
    }
    let result =  Reflect.getMetadata(propertyKey, target);
    if (!Array.isArray(result)) {
        result = [];
    }
    return result;
}
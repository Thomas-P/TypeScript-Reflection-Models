/**
 * Created by ThomasP on 01.04.2016.
 */
/**
 *
 * @param prop
 * @returns {boolean}
 *      only true if a string is not a String object
 */
function assertString(prop):boolean {
    return typeof prop === 'string';
}
/**
 *
 */
export interface IValidatorFunction<T> {
    (actValue:T, baseValue:T, target:any, propertyName: string):boolean
}


/**
 * Assertion function for IValidatorFunction
 * @param property
 * @returns {boolean}
 */
export function assertIValidatorFunction<T>(property:IValidatorFunction<T>):boolean {
    return typeof property === 'function';
}


/**
 *
 */
export interface IValidatorAgainstFunction<T> {
    (propertyA:T, propertyB:T, target:any, propertyNameA: string, propertyNameB: string):boolean
}


/**
 * Assertion function for IValidatorFunction
 * @param property
 * @returns {boolean}
 */
export function assertIValidatorAgainstFunction<T>(property:IValidatorAgainstFunction<T>):boolean {
    return typeof property === 'function';
}


/**
 *
 */
export interface IValidationObject<T> {
    validatorName:string;
    validatorFunction:IValidatorFunction<T>;
}


/**
 * Assertion function for IValidationObject
 * @param property {IValidationObject}
 * @returns {boolean}
 */
export function assertIValidationObject<T>(property:IValidationObject<T>):boolean {
    return typeof assertString(property.validatorName) &&
        assertIValidatorFunction(property.validatorFunction);
}

/**
 *
 */
export interface IValidationProperty<T> extends IValidationObject<T> {
    baseValue?:T;
    errorNotice:string;
    propertyName:string;
}


/**
 *
 * @param property
 * @return {boolean}
 */
export function assertIValidationProperty<T>(property:IValidationProperty<T>):boolean {
    return assertIValidationObject(property) &&
        assertString(property.errorNotice) &&
        assertString(property.propertyName);
}
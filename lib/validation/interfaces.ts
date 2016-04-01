/**
 * Created by ThomasP on 01.04.2016.
 */


/**
 *
 */
export interface IValidatorFunction<T> {
    (actValue:T, baseValue?:T):boolean
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
    return typeof property.validatorName === 'string' &&
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

        typeof property.errorNotice === 'string' &&

        typeof property.propertyName === 'string';
}
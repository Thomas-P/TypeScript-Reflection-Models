/**
 * Created by ThomasP on 27.03.2016.
 */
import {IValidationObject, IValidatorFunction, IValidationProperty} from "./validation/interfaces";
/**
 * The idea of validation is, that you can build own flexible validation patterns,
 * which were stored as meta data on the object. The validation interface allows you
 * to check if a validation for a property is correct or if it will fail.
 * Validation will be set for properties on the class, but they will be only checked against an
 * object and a key property. But it is allowed to check a validation against other properties
 * of the same object, by using the target as the function context of the test function.
 *
 * a operation fails, when one of the test fail
 * every test will have a failure notice
 * 
 *
 */
let key = 'model:property:validation';

// store all validations that exists
let createdValidators: Array<IValidationObject<any>> = [];

/**
 *
 * @param validatorName
 * @param validatorFunction
 * @returns {function(T, string): function(any, string)}
 */
export function createValidator<T>(validatorName: string, validatorFunction:IValidatorFunction<T>) {
    //
    // Decorator function
    //
    //  Usage:
    //
    //  class Model {
    //      @ValidateLT(5)
    //      prop: number
    //
    //  }
    //
    return function (baseValue: T, errorNotice: string) {

        //
        // This is s
        //
        return function (target, propertyName: string) {

        }
    }
}



export class Validation {


    constructor(private target) {
        // err Message: 'The validation target must be an object.';
    }


    /**
     * Check if the target, set on constructor is valid
     * @return {boolean} returns true if an object is valid
     */
    isValid():boolean {
        return Validation.isValid(this.target);
    }


    /**
     * validator for a target
     * @param target
     * @return {boolean} true if the validation is ok
     */
    static isValid(target): boolean {

        return;
    }


    /**
     * Return a list of items, that failed on testing
     * @returns {Array<IValidationProperty<any>>}
     *      returns a list of items, where the test is failed
     */
    getErrors(): Array<IValidationProperty<any>> {
        return Validation.getErrors(this.target);
    }


    /**
     * Return a list of items, that failed on testing
     * @param target
     * @returns {Array<IValidationProperty<any>>}
     *      returns a list of items, where the test is failed
     */
    static getErrors(target):Array<IValidationProperty<any>> {

        return;
    }


    /**
     * Check if a property on a target is valid
     * @param property
     * @returns {boolean}
     *      returns true if the test on a property is valid
     */
    isValidProperty(property: string): boolean {
        return Validation.isValidProperty(this.target, property);
    }


    /**
     * Validate a property
     * @param target
     * @param property {string}
     * @return {boolean} true if the property on a target is valid
     */
    static isValidProperty(target, property: string): boolean {

        return;
    }


    /**
     * Return a list of items, that failed on testing a property
     * @param property
     * @returns {Array<IValidationProperty<any>>}
     *      returns a list of items, where the test fail on a property
     */
    getPropertyErrors(property: string): Array<IValidationProperty<any>> {
        return Validation.getPropertyErrors(this.target, property);
    }


    /**
     * Return a list of items, that failed on testing a property
     * @param target
     * @param property {string}
     * @returns {Array<IValidationProperty<any>>}
     *      returns a list of items, where the test fail on a property
     */
    static getPropertyErrors(target, property: string):Array<IValidationProperty<any>> {

        return;
    }


    /**
     * Returns a list of validations an there functions
     * @param target
     */
    static getAllValidationObjects():Array<IValidationObject<any>> {


        return;
    }


    /**
     * Returns a list of validations an there functions
     * @param target
     */
    static getValidationOnObject(target):Array<IValidationObject<any>> {

        return;
    }


    /**
     * Returns a list of validations an there functions
     */
    getValidationOnObject():Array<IValidationObject<any>> {
        return Validation.getValidationOnObject(this.target);
    }


    /**
     * Returns a list of validations an there functions
     * @param target
     * @param property
     */
    static getValidationOnProperty(target, property: string):Array<IValidationObject<any>> {

        return;
    }


    /**
     * Returns a list of validations an there functions
     * @param property
     */
    getValidationOnProperty(property: string):Array<IValidationObject<any>> {
        return Validation.getValidationOnProperty(this.target, property);
    }


}
import {createValidator, Validation} from "../../lib/validation";
import {IValidationObject, IValidationProperty} from "../../lib/validation/interfaces";
/**
 * Created by ThomasP on 28.03.2016.
 */


describe('Model::Property::Validation', function() {
    let _modelObject;
    let _validatorObject;
    let ValidateLower;
    let ValidateHigher;
    beforeAll(function () {
        ValidateLower = createValidator('lowerThen', function (value:number, baseValue: number) {
            return value < baseValue;
        });
        
        ValidateHigher = createValidator('higherThen', function (value:number, baseValue: number) {
            return value > baseValue;
        });

        class Model {
            @ValidateLower(10, 'must be lower 10.')
            num1: number = 5;

            @ValidateLower(20, 'must be lower 20')
            num2: number =  10;

            @ValidateLower(20, 'must be lower 20')
            num3: number =  20;
        }

        _modelObject = new Model;

        _validatorObject = new Validation(_modelObject);
    });


    it('should create a validator', function () {

        expect(ValidateLower).toBeDefined();
        expect(typeof ValidateLower).toBe('function');

    });

    it ('should be create a validation interface for objects', function () {
        class X{}
        function Y() {}
        expect(new Validation({})).toBeDefined();
        expect(new Validation(new Object(null))).toBeDefined();
        expect(new Validation(new X)).toBeDefined();
        expect(new Validation(new Y)).toBeDefined();
    });

    it('should not create a validation interface for class or constructor function or null / undefined', function () {
        //
        //  Error message
        //
        let errorMessage = 'The validation target must be an object.';
        //
        //  Throw on failure
        //
        expect(function () {
            new Validation(undefined);
        }).toThrowError(errorMessage);
        expect(function () {
            new Validation(null);
        }).toThrowError(errorMessage);
        expect(function () {
            let noop = function () {

            };
            new Validation(noop);
        }).toThrowError(errorMessage);
        expect(function () {
            let noop = class {

            };
            new Validation(noop);
        }).toThrowError(errorMessage);
        expect(function () {
            new Validation(null);
        }).toThrowError(errorMessage);
        expect(function () {
            new Validation('');
        }).toThrowError(errorMessage);
        expect(function () {
            new Validation(Number(2));
        }).toThrowError(errorMessage);
        expect(function () {
            new Validation(Boolean(true));
        }).toThrowError(errorMessage);

    });


    it('should handle Validation.isValid correctly', function () {

        class M {
            @ValidateLower(5)
            prop1: number = 5;

            @ValidateLower(10)
            prop2: number = 7;
        }
        let m = new M;
        let validatorInterface = new Validation(m);

        expect(validatorInterface.isValid()).toBe(false);
        m.prop1 = 4;
        expect(validatorInterface.isValid()).toBe(true);
        m.prop1 = 5;
        m.prop2 = 10;
        expect(validatorInterface.isValid()).toBe(false);
    });

    it('should handle Validation.isValidProperty([string]) correctly', function () {
        class M {
            @ValidateLower(5)
            prop1: number = 5;

            @ValidateLower(10)
            prop2: number = 7;
        }
        let m = new M;
        let validatorInterface = new Validation(m);

        expect(validatorInterface.isValidProperty('prop1')).toBe(false);
        expect(validatorInterface.isValidProperty('prop2')).toBe(true);
        m.prop1 = 10;
        m.prop2 = 10;
        expect(validatorInterface.isValidProperty('prop1')).toBe(false);
        expect(validatorInterface.isValidProperty('prop2')).toBe(false);
        m.prop1 = -10;
        m.prop2 = -10;

        expect(validatorInterface.isValidProperty('prop1')).toBe(true);
        expect(validatorInterface.isValidProperty('prop2')).toBe(true);

        m.prop1 = -10;
        m.prop2 = 10;
        expect(validatorInterface.isValidProperty('prop1')).toBe(true);
        expect(validatorInterface.isValidProperty('prop2')).toBe(false);
    });

    it('should handle Validation.isValid correctly', function () {

        class M {
            @ValidateLower(5)
            prop1: number = 5;

            @ValidateLower(10)
            prop2: number = 7;
        }
        let m = new M;

        expect(Validation.isValid(m)).toBe(false);
        m.prop1 = 4;
        expect(Validation.isValid(m)).toBe(true);
        m.prop1 = 5;
        m.prop2 = 10;
        expect(Validation.isValid(m)).toBe(false);


    });


    it('should handle Validation.isValidProperty correctly', function () {
        class M {
            @ValidateLower(5)
            prop1: number = 5;

            @ValidateLower(10)
            prop2: number = 7;
        }
        let m = new M;


        expect(Validation.isValidProperty(m, 'prop1')).toBe(false);
        expect(Validation.isValidProperty(m, 'prop2')).toBe(true);
        m.prop1 = 10;
        m.prop2 = 10;
        expect(Validation.isValidProperty(m, 'prop1')).toBe(false);
        expect(Validation.isValidProperty(m, 'prop2')).toBe(false);
        m.prop1 = -10;
        m.prop2 = -10;

        expect(Validation.isValidProperty(m, 'prop1')).toBe(true);
        expect(Validation.isValidProperty(m, 'prop2')).toBe(true);

        m.prop1 = -10;
        m.prop2 = 10;
        expect(Validation.isValidProperty(m, 'prop1')).toBe(true);
        expect(Validation.isValidProperty(m, 'prop2')).toBe(false);
    });


    it('should get all created validation functions', function () {

        let result:Array<IValidationObject<any>> = Validation.getAllValidationObjects();
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
        result.forEach((resItem:IValidationObject<any>) => {
            // these one have no base Value or error notice
            expect(['lowerThen','higherThen'].indexOf(resItem.validatorName)).toBeGreaterThan(-1);
            expect(typeof resItem.validatorFunction).toBe('function');
        });
    });


    it('should get validation functions on object', function () {
        class M {
            @ValidateLower(5)
            prop1: number = 5;

            @ValidateLower(10)
            prop2: number = 7;
        }
        let m = new M;

        let result:Array<IValidationObject<any>> = Validation.getValidationOnObject(m);
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        result.forEach((resItem:IValidationObject<any>) => {
            // these one have no base Value or error notice
            expect(['lowerThen'].indexOf(resItem.validatorName)).toBeGreaterThan(-1);
            expect(typeof resItem.validatorFunction).toBe('function');
        });

        result = new Validation(m).getValidationOnObject();
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        result.forEach((resItem:IValidationObject<any>) => {
            // these one have no base Value or error notice
            expect(['lowerThen'].indexOf(resItem.validatorName)).toBeGreaterThan(-1);
            expect(typeof resItem.validatorFunction).toBe('function');
        });
    });


    it('should get validation functions on object property', function () {
        class M {
            @ValidateLower(5)
            prop1: number = 5;

            @ValidateHigher(10)
            prop2: number = 7;
        }
        let m = new M;

        let result:Array<IValidationObject<any>> = Validation.getValidationOnProperty(m, 'prop1');
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        result.forEach((resItem:IValidationObject<any>) => {
            // these one have no base Value or error notice
            expect(['lowerThen'].indexOf(resItem.validatorName)).toBeGreaterThan(-1);
            expect(typeof resItem.validatorFunction).toBe('function');
        });

        result = new Validation(m).getValidationOnProperty('prop1');
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        result.forEach((resItem:IValidationObject<any>) => {
            // these one have no base Value or error notice
            expect(['lowerThen'].indexOf(resItem.validatorName)).toBeGreaterThan(-1);
            expect(typeof resItem.validatorFunction).toBe('function');
        });

        result = Validation.getValidationOnProperty(m, 'prop2');
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        result.forEach((resItem:IValidationObject<any>) => {
            // these one have no base Value or error notice
            expect(['higherThen'].indexOf(resItem.validatorName)).toBeGreaterThan(-1);
            expect(typeof resItem.validatorFunction).toBe('function');
        });

        result = new Validation(m).getValidationOnProperty('prop2');
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        result.forEach((resItem:IValidationObject<any>) => {
            // these one have no base Value or error notice
            expect(['higherThen'].indexOf(resItem.validatorName)).toBeGreaterThan(-1);
            expect(typeof resItem.validatorFunction).toBe('function');
        });
    });


    it('should get validation errors', function () {
        class M {
            @ValidateLower(5)
            prop1: number = 5;

            @ValidateHigher(10)
            prop2: number = 17;
        }
        let m = new M;

        let result:Array<IValidationProperty<any>> = Validation.getErrors(m);
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        result.forEach((resItem:IValidationProperty<any>) => {
            // these one have no base Value or error notice
            expect(['lowerThen'].indexOf(resItem.validatorName)).toBeGreaterThan(-1);
            expect(typeof resItem.validatorFunction).toBe('function');
            expect(resItem.propertyName).toBe('prop1');
            expect(resItem.baseValue).toBe(5);
        });

        result = new Validation(m).getErrors();
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        result.forEach((resItem:IValidationProperty<any>) => {
            // these one have no base Value or error notice
            expect(['lowerThen'].indexOf(resItem.validatorName)).toBeGreaterThan(-1);
            expect(typeof resItem.validatorFunction).toBe('function');
            expect(resItem.propertyName).toBe('prop1');
            expect(resItem.baseValue).toBe(5);
        });

        m.prop2 = 7;

        result = Validation.getErrors(m);
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
        result.forEach((resItem:IValidationProperty<any>) => {
            // these one have no base Value or error notice
            switch (resItem.propertyName) {
                case 'prop1':
                    expect(['lowerThen'].indexOf(resItem.validatorName)).toBeGreaterThan(-1);
                    expect(typeof resItem.validatorFunction).toBe('function');
                    expect(resItem.propertyName).toBe('prop1');
                    expect(resItem.baseValue).toBe(5);
                    break;
                case 'prop2':
                    expect(['higherThen'].indexOf(resItem.validatorName)).toBeGreaterThan(-1);
                    expect(typeof resItem.validatorFunction).toBe('function');
                    expect(resItem.propertyName).toBe('prop2');
                    expect(resItem.baseValue).toBe(10);
                    break;
                default:
                    throw new Error('Unknown property ' + resItem.propertyName);
            }
        });

        result = new Validation(m).getErrors();
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        result.forEach((resItem:IValidationProperty<any>) => {
            // these one have no base Value or error notice
            switch (resItem.propertyName) {
                case 'prop1':
                    expect(['lowerThen'].indexOf(resItem.validatorName)).toBeGreaterThan(-1);
                    expect(typeof resItem.validatorFunction).toBe('function');
                    expect(resItem.propertyName).toBe('prop1');
                    expect(resItem.baseValue).toBe(5);
                    break;
                case 'prop2':
                    expect(['higherThen'].indexOf(resItem.validatorName)).toBeGreaterThan(-1);
                    expect(typeof resItem.validatorFunction).toBe('function');
                    expect(resItem.propertyName).toBe('prop2');
                    expect(resItem.baseValue).toBe(10);
                    break;
                default:
                    throw new Error('Unknown property ' + resItem.propertyName);
            }
        });

        class M2 {
            // do not check if something is not possible
            @ValidateLower(5)
            @ValidateHigher(10)
            prop2prop: number = 6;
        }
        let m2 = new M2;

        result = Validation.getErrors(m2);
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
        result.forEach((resItem:IValidationProperty<any>) => {
            // these one have no base Value or error notice
            switch (resItem.validatorName) {
                case 'lowerThen':
                    expect(typeof resItem.validatorFunction).toBe('function');
                    expect(resItem.propertyName).toBe('prop2prop');
                    expect(resItem.baseValue).toBe(5);
                    break;
                case 'higherThen':
                    expect(typeof resItem.validatorFunction).toBe('function');
                    expect(resItem.propertyName).toBe('prop2prop');
                    expect(resItem.baseValue).toBe(10);
                    break;
                default:
                    throw new Error('Unknown validator ' + resItem.validatorName);
            }
        });

        result = new Validation(m2).getErrors();
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        result.forEach((resItem:IValidationProperty<any>) => {
            // these one have no base Value or error notice
            switch (resItem.validatorName) {
                case 'lowerThen':
                    expect(typeof resItem.validatorFunction).toBe('function');
                    expect(resItem.propertyName).toBe('prop2prop');
                    expect(resItem.baseValue).toBe(5);
                    break;
                case 'higherThen':
                    expect(typeof resItem.validatorFunction).toBe('function');
                    expect(resItem.propertyName).toBe('prop2prop');
                    expect(resItem.baseValue).toBe(10);
                    break;
                default:
                    throw new Error('Unknown validator ' + resItem.validatorName);
            }
        });
    });


    it('should get validation errors on property', function () {
        class M {
            @ValidateLower(5)
            prop1: number = 5;

            @ValidateHigher(10)
            prop2: number = 17;
        }
        let m = new M;

        let result:Array<IValidationProperty<any>> = Validation.getPropertyErrors(m, 'prop1');
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        result.forEach((resItem:IValidationProperty<any>) => {
            // these one have no base Value or error notice
            expect(resItem.validatorName).toBe('lowerThen');
            expect(typeof resItem.validatorFunction).toBe('function');
            expect(resItem.propertyName).toBe('prop1');
            expect(resItem.baseValue).toBe(5);
        });

        result = new Validation(m).getPropertyErrors('prop2');
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        result.forEach((resItem:IValidationProperty<any>) => {
            // these one have no base Value or error notice
            expect(resItem.validatorName).toBe('lowerThen');
            expect(typeof resItem.validatorFunction).toBe('function');
            expect(resItem.propertyName).toBe('prop1');
            expect(resItem.baseValue).toBe(5);
        });

        result = Validation.getPropertyErrors(m, 'prop2');
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        result.forEach((resItem:IValidationProperty<any>) => {
            // these one have no base Value or error notice
            expect(resItem.validatorName).toBe('higherThen');
            expect(typeof resItem.validatorFunction).toBe('function');
            expect(resItem.propertyName).toBe('prop1');
            expect(resItem.baseValue).toBe(5);
        });

        result = new Validation(m).getPropertyErrors('prop2');
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        result.forEach((resItem:IValidationProperty<any>) => {
            // these one have no base Value or error notice
            expect(resItem.validatorName).toBe('higherThen');
            expect(typeof resItem.validatorFunction).toBe('function');
            expect(resItem.propertyName).toBe('prop1');
            expect(resItem.baseValue).toBe(5);
        });

        class M2 {
            // do not check if something is not possible
            @ValidateLower(5)
            @ValidateHigher(10)
            prop2prop: number = 6;
        }
        let m2 = new M2;

        result = Validation.getPropertyErrors(m2, 'prop2prop');
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
        result.forEach((resItem:IValidationProperty<any>) => {
            // these one have no base Value or error notice
            switch (resItem.validatorName) {
                case 'lowerThen':
                    expect(typeof resItem.validatorFunction).toBe('function');
                    expect(resItem.propertyName).toBe('prop2prop');
                    expect(resItem.baseValue).toBe(5);
                    break;
                case 'higherThen':
                    expect(typeof resItem.validatorFunction).toBe('function');
                    expect(resItem.propertyName).toBe('prop2prop');
                    expect(resItem.baseValue).toBe(10);
                    break;
                default:
                    throw new Error('Unknown validator ' + resItem.validatorName);
            }
        });

        result = new Validation(m2).getPropertyErrors('prop2prop');
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        result.forEach((resItem:IValidationProperty<any>) => {
            // these one have no base Value or error notice
            switch (resItem.validatorName) {
                case 'lowerThen':
                    expect(typeof resItem.validatorFunction).toBe('function');
                    expect(resItem.propertyName).toBe('prop2prop');
                    expect(resItem.baseValue).toBe(5);
                    break;
                case 'higherThen':
                    expect(typeof resItem.validatorFunction).toBe('function');
                    expect(resItem.propertyName).toBe('prop2prop');
                    expect(resItem.baseValue).toBe(10);
                    break;
                default:
                    throw new Error('Unknown validator ' + resItem.validatorName);
            }
        });

        // did not exists
        result = Validation.getPropertyErrors(m2, 'prop2');
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });



});
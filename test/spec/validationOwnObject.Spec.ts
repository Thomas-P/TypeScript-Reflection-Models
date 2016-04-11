/**
 * Created by ThomasP on 11.04.2016.
 */
import {createValidator, Validation, createAgainstPropertyValidator} from "../../lib/validation";


describe('Model::Property::Validation::OwnObjects', function() {

    it('should set the this context of the validation function to the model object', function () {
        let called = false;
        let Validator = createValidator('own', function () {
            called = true;
            expect(this instanceof Model).toBe(true);
            return true;
        });

        class Model {
            @Validator(null, '')
            private test:string;
        }

        // should call Validator
        expect(Validation.isValid(new Model())).toBe(true);
        expect(called).toBe(true);

    });


    it('should allow lower than an other property', function () {

        let LowerThanProperty = createValidator('LTP', function (actValue, property: string) {
            try {
                return actValue < this[property];
            } catch(e) {

            }
            return false;
        });


        class Model {
            prop1: number= 1;
            @LowerThanProperty('prop1', 'Err')
            prop2: number=2;
        }

        expect(Validation.isValid(new Model())).toBe(false);

        let m = new Model();
        m.prop1 = 10;
        expect(Validation.isValid(m)).toBe(true);

    });


    it('should allow lower than an other property as parameter', function () {

        let LowerThanProperty = createValidator('LTP-A', function (actValue, property: string, target, propertyName: string) {
            try {
                return target[propertyName] < target[property];
            } catch(e) {

            }
            return false;
        });


        class Model {
            prop1: number= 1;
            @LowerThanProperty('prop1', 'Err')
            prop2: number=2;
        }

        expect(Validation.isValid(new Model())).toBe(false);


        let m = new Model();
        m.prop1 = 10;
        expect(Validation.isValid(m)).toBe(true);
    });


    it('should allow lower than an other property created with createAgainstPropertyValidator', function () {

        let LowerThanProperty = createAgainstPropertyValidator('LTP-WithPropertyAgainstValidator', function (propA, propB, target, propertyA: string, propertyB: string) {
            expect(propA).toBe(target.propA);
            expect(propB).toBe(target.propB);
            expect(target instanceof Model).toBe(true);
            expect(propertyA).toBe('propA');
            expect(propertyB).toBe('propB');
            return propA < propB;
        });


        class Model {
            @LowerThanProperty('propB', 'Err')
            propA: number=2;

            propB: number= 1;
        }

        let m = new Model();
        expect(Validation.isValid(m)).toBe(false);
        m.propA=-1;
        expect(Validation.isValid(m)).toBe(true);
    });

});


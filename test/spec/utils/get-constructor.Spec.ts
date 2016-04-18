import {getConstructorChain} from "../../../lib/utils/get-constructor";
/**
 * Created by ThomasP on 18.04.2016.
 */

describe('utils::getConstructor', function() {

    class U {

    }

    class T extends U {

    }

    class S extends T {

    }

    it('should return an array', function () {
        let undefinedArray = getConstructorChain(undefined);
        expect(Array.isArray(undefinedArray)).toBe(true, 'return [] for undefined');
        expect((undefinedArray.length)).toBe(0, 'the [].length for undefined must be 0');

        let nullArray = getConstructorChain(null);
        expect(Array.isArray(nullArray)).toBe(true, 'return [] for null');
        expect((nullArray.length)).toBe(0, 'the [].length for null must be 0');

        let ObjectArray = getConstructorChain({});
        expect(Array.isArray(ObjectArray)).toBe(true, 'return [] for {}');
        expect((ObjectArray.length)).toBe(0, 'the [].length for {} must be 0');

    });

    it('should return [U], when we get the chain for U', function () {
        let uArray = getConstructorChain(U);
        expect(Array.isArray(uArray)).toBe(true, 'return [U] for class U {}');
        expect((uArray.length)).toBe(1, 'the [U].length for class U {} must be 1');

        uArray = getConstructorChain(new U);
        expect(Array.isArray(uArray)).toBe(true, 'return [U] for new U');
        expect((uArray.length)).toBe(1, 'the [U].length for new U must be 1');
    });


    it('should return [T, U], when we get the chain for T', function () {
        let uArray = getConstructorChain(T);
        expect(Array.isArray(uArray)).toBe(true, 'return [T, U] for class T {}');
        expect((uArray.length)).toBe(2, 'the [T, U].length for class T {} must be 2');
        expect(uArray.shift()).toBe(T);
        expect(uArray.shift()).toBe(U);


        uArray = getConstructorChain(new T);
        expect(Array.isArray(uArray)).toBe(true, 'return [T, U] for new T');
        expect((uArray.length)).toBe(2, 'the [T, U].length for new T must be 2');
        expect(uArray.shift()).toBe(T);
        expect(uArray.shift()).toBe(U);
    });

    it('should return [S, T, U], when we get the chain for S', function () {
        let uArray = getConstructorChain(S);
        expect(Array.isArray(uArray)).toBe(true, 'return [S, T, U] for class S {}');
        expect((uArray.length)).toBe(3, 'the [S, T, U].length for class S {} must be 3');
        expect(uArray.shift()).toBe(S);
        expect(uArray.shift()).toBe(T);
        expect(uArray.shift()).toBe(U);


        uArray = getConstructorChain(new S);
        expect(Array.isArray(uArray)).toBe(true, 'return [S, T, U] for new S');
        expect((uArray.length)).toBe(3, 'the [S, T, U].length for new S must be 3');
        expect(uArray.shift()).toBe(S);
        expect(uArray.shift()).toBe(T);
        expect(uArray.shift()).toBe(U);
    })
});
const _suites: Suite[] = [];

let _suite: Suite = null;

export function run(){
    console.log("running tests");
    _suites.forEach(x => console.log(x.describes));
}

export interface Suite {
    describes: string;
    specs: Spec[]
}

export interface Spec {
    it: string;
    func: () => (void | Promise<void>); 
}


export async function describe(description: string, specDefinitions: () => (void | Promise<void>)) {
    let suite = _suites.filter(x => x.describes === description)[0]; 
    if(!suite) {
        suite = {
            describes: description,
            specs: []
        }
        _suites.push(suite);
    }
    await Promise.resolve(specDefinitions());
    suite = _suite;
};


export function it(description: string, func: () => void | Promise<void> ){
    if(!_suite)
        throw 'Spec has to be inside Suite';

    _suite.specs.push({
        it: description,
        func: func
    });
}

export function expect<T>(actual: T) {
    return new Expected(actual);
}

export class Expected<T> {
    
    constructor(private _value: T){}       

    toBe(expected: T, expectationFailOutput?: any) {
        if(this._value !== expected)
            throw expectationFailOutput || `${this._value} is not ${expected}`;
    }
    
    toEqual = this.toBe;
    
    //toMatch(expected: string | RegExp, expectationFailOutput?: any): boolean;
    toBeDefined(expectationFailOutput?: any) {
        if(this._value === undefined)
            throw expectationFailOutput || `${this._value} is not defined.`;
    }

    toBeUndefined(expectationFailOutput?: any) {
        if(this._value !== undefined)
            throw expectationFailOutput || `${this._value} is not undefined.`;
    }

    toBeNull(expectationFailOutput?: any) {
        if(this._value !== null)
            throw expectationFailOutput || `${this._value} it not null.`;
    }   

    toBeNaN() {
        if(!isNaN(<any>this._value))
            throw `${this._value} has to be NaN`;
    }

    toBeTruthy(expectationFailOutput?: any) {
        if(!this._value)
            throw expectationFailOutput || `${this._value} is not truthy`;
    }
    
    toBeFalsy(expectationFailOutput?: any) {
        if(this._value)
            throw expectationFailOutput || `${this._value} is not falsy`;
    }
    
    toContain(expected: any, expectationFailOutput?: any) {
        if((<string><any>this._value).indexOf(expected) === -1)
            throw expectationFailOutput || `${this._value} does not contain ${expected}`;
    }
    
    toBeLessThan(expected: number, expectationFailOutput?: any) {
        if((<any>this._value) >= expect)
            throw expectationFailOutput || `${this._value} is not less than ${expected}`;
    }
   
    toBeLessThanOrEqual(expected: number, expectationFailOutput?: any) {
        throw 'Not implemented';
    }

    toBeGreaterThan(expected: number, expectationFailOutput?: any) {
        throw 'Not implemented';
    }

    toBeGreaterThanOrEqual(expected: number, expectationFailOutput?: any) {
        throw 'Not implemented';
    }

    toBeCloseTo(expected: number, precision?: any, expectationFailOutput?: any) {
        throw 'Not implemented';
    }

    async toThrow(expected?: any) {
        try {
            await Promise.resolve(<any>this._value);
        }
        catch(e) {
            if(e != expected)
                throw `Exception was expected to be ${expected}, but was ${e}.`;

            return;
        }
        throw `Exception  ${expected} was expected but none was thrown.`;
    }
}



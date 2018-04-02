const _suites: Suite[] = [];

let _suite: Suite = null;

export function getTests() {
    return _suites;
}

export interface Suite {
    describes: string;
    specs: Spec[]
}

export class Spec {

    success = false;
    wasRun = false;
    reference: HTMLCanvasElement = null;
    result: HTMLCanvasElement = null;
    message = '';
    time = 0;

    constructor(public name: string, private _func: () => void | Promise<void>) {
    }

    async run() {
        const time = performance.now();
        try {
            await Promise.resolve(this._func());
            this.success = true;
        }
        catch (e) {
            console.log(e);
            if(e instanceof ImageError){
                this.reference = e.reference;
                this.result = e.result;
                this.message = e.message;
            }
            else {
                this.message = e.toString();
            }
            this.success = false;
        }
        this.wasRun = true;
        this.time = performance.now() - time;
    }
}


export async function describe(description: string, specDefinitions: () => (void | Promise<void>)) {
    let suite = _suites.filter(x => x.describes === description)[0];
    if (!suite) {
        suite = {
            describes: description,
            specs: []
        }
        _suites.push(suite);
    }
    _suite = suite;
    await Promise.resolve(specDefinitions());
    _suite = null;
};


export function it(description: string, func: () => void | Promise<void>) {
    if (!_suite)
        throw 'Spec has to be inside Suite';

    _suite.specs.push(new Spec(description, func));
}

export function expect<T>(actual: T) {
    return new Expected(actual);
}

export class ImageError {
    constructor(public message: string, public result: HTMLCanvasElement, public reference: HTMLCanvasElement){

    }
}

export class Expected<T> {

    constructor(private _value: T) { }

    toBe(expected: T, expectationFailOutput?: any) {
        if (this._value !== expected)
            throw expectationFailOutput || `${this._value} is not ${expected}`;
    }

    toEqual = this.toBe;

    toBeInstanceOf(constructor: any){
        if(!(this._value instanceof constructor))
            throw `Value ${this._value} is not an instance of ${constructor}`;
    }

    //toMatch(expected: string | RegExp, expectationFailOutput?: any): boolean;
    toBeDefined(expectationFailOutput?: any) {
        if (this._value === undefined)
            throw expectationFailOutput || `${this._value} is not defined.`;
    }

    toBeUndefined(expectationFailOutput?: any) {
        if (this._value !== undefined)
            throw expectationFailOutput || `${this._value} is not undefined.`;
    }

    toBeNull(expectationFailOutput?: any) {
        if (this._value !== null)
            throw expectationFailOutput || `${this._value} it not null.`;
    }

    toBeNaN() {
        if (!isNaN(<any>this._value))
            throw `${this._value} has to be NaN`;
    }

    toBeTruthy(expectationFailOutput?: any) {
        if (!this._value)
            throw expectationFailOutput || `${this._value} is not truthy`;
    }

    toBeFalsy(expectationFailOutput?: any) {
        if (this._value)
            throw expectationFailOutput || `${this._value} is not falsy`;
    }

    toContain(expected: any, expectationFailOutput?: any) {
        if ((<string><any>this._value).indexOf(expected) === -1)
            throw expectationFailOutput || `${this._value} does not contain ${expected}`;
    }

    toBeLessThan(expected: number, expectationFailOutput?: any) {
        if ((<any>this._value) >= expect)
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

    async toThrowAsync(expected?: any) {
        try {
            await Promise.resolve((<any>this._value)());
        }
        catch (e) {
            if (expected && e != expected)
                throw `Exception was expected to be ${expected}, but was ${e}.`;

            return;
        }
        throw `Exception  ${expected || ''} was expected but none was thrown.`;
    }

    toThrow(expected?: any) {
        try {
            (<any>this._value)();
        }
        catch (e) {
            if (expected && e != expected)
                throw `Exception was expected to be ${expected}, but was ${e}.`;

            return;
        }
        throw `Exception  ${expected || ''} was expected but none was thrown.`;
    }

    private async canvasFromImage(src: string){
        const img = new Image();
        img.src = src;

        return new Promise<HTMLCanvasElement>((res) => {
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
                res(canvas);
            }
        });                
    } 

    async toLookLike(src: string | HTMLCanvasElement, percent: number) {
        if(!(this._value instanceof WebGLRenderingContext))
            throw 'Value must be a WebGLRenderingContext';

        const gl = <WebGLRenderingContext>this._value;
        const canvas = gl.canvas;

        const buffer = new Uint8Array(canvas.width * canvas.height * 4);
        gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, buffer);

        const canvasCompare = typeof(src) === 'string' ? (await this.canvasFromImage(src)) : src;
        const cvs = canvasCompare.getContext('2d');
        cvs.fillStyle = 'rgba(255,0,0,128)';
        
        const pixelData = cvs.getImageData(0, 0, canvasCompare.width, canvasCompare.height).data;
        
        let ctr = 0;
        
        if(pixelData.length !== buffer.length)
        throw 'Rendered and reference image are of different size';
        
            
        for (let i = 0; i < pixelData.length; i+=4) {
            const p = Math.floor(i / 4);
            const x = p%320;
            const y = Math.floor(p / 320);
            const j = (((239 - y) * 320) + x) * 4;

            if (buffer[i] === pixelData[j] &&
                buffer[i+1] === pixelData[j+1] &&
                buffer[i+2] === pixelData[j+2] &&
                buffer[i+3] === pixelData[j+3]){
                    ctr++;
            } else {
                cvs.fillRect(x, 239-y, 1, 1);
            }
        }
        
        const percentResult = (ctr / (pixelData.length/4)) * 100; 
        if(percentResult < percent)
            throw new ImageError(
                `Rendered image is ${percentResult}% identical with reference but ${percent}% was expected`,
                canvas,
                canvasCompare
            );
    }
}



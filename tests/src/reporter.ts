import { Suite, Spec } from 'test';
const mainTemplate = require('./../templates/main.html');

class Template {

    

    constructor(private _template: string){

    }

}



console.log(mainTemplate);

export default class Reporter {
    
    runners: any[] = [];
    
    constructor(private _suites: Suite[]){

    }

    run(){
        const frag = document.createDocumentFragment();
        
        const h1 = document.createElement('h1');
        h1.textContent = 'TGL Testrunner';

        const button = document.createElement('button');
        button.textContent = 'Run all';
        button.onclick = async () => {
            for (const runner of this.runners) {
                await runner();
            }  
        };
        h1.appendChild(button);
        frag.appendChild(h1);

        this._suites.forEach(x => this.createSuiteHtml(x, frag));
        document.body.appendChild(frag);
    }

    createSuiteHtml(suite: Suite, frag: DocumentFragment){
    
        const h2 = document.createElement('h2');
        h2.textContent = suite.describes;
        frag.appendChild(h2);

        const list = document.createElement('ul');
        suite.specs.forEach(x => this.createSpecHtml(x, list));
        frag.appendChild(list);
    }

    createSpecHtml(spec: Spec, frag: HTMLElement){
        const li = document.createElement('li');
        li.textContent = spec.name;

        const message = document.createElement('span');
        const container = document.createElement('div');

        const button = document.createElement('button');
        button.textContent = 'run';
        button.onclick = async () => {
            container.innerHTML = '';
            li.className = '';
            message.textContent = 'RUNNING';
            await spec.run();
            li.className = spec.success ? 'success' : 'fail';
            message.textContent = spec.success ? `SUCCESS (${Math.floor(spec.time)}ms)` : 'FAIL:' + spec.message;
            if(spec.reference && spec.result){
                container.appendChild(spec.reference);
                container.appendChild(spec.result);
            }
        }
        this.runners.push(button.onclick);

        li.appendChild(button);
        li.appendChild(message);
        li.appendChild(container);
        frag.appendChild(li);
    }
}
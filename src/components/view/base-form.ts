import { EventEmitter } from "../base/events";
import {IRenderable} from '../../types'

abstract class BaseForm<T> extends EventEmitter implements IRenderable{
    
    _el: HTMLElement;
    btn: HTMLButtonElement | null;
    formData: T;

    constructor(template: HTMLTemplateElement) {
        super();

        this._el = template.cloneNode() as HTMLElement

        this.btn = this._el.querySelector('button');
    
        this.on('formSubmit', this._submit.bind(this));
    }


     private _submit(formData: T) {
        if(this.validate()) return false;
        return true;
     }

     render() {
        return this._el;
     }

     abstract validate(): boolean;

    }
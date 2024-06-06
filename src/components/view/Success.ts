import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { formatNumber } from '../../utils/utils'

interface ISuccess {
	total: number;
}

export class Success extends Component<ISuccess> {
	protected _buttonclose: HTMLElement;
	protected _description: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this._buttonclose = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this._description = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		this._buttonclose.addEventListener('click', () => {
			events.emit('sucess:close');
		});
	}

	set total(value: number) {
    this._description.textContent = `Списано ${formatNumber(value)} синапсов`
  }
}

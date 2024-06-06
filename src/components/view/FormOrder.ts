import { IOrderForm } from '../../types';
import { IEvents } from '../base/events';
import { Form } from './Form';

export interface PaymentChangeEventDetail {
	button: 'online' | 'recipt';
}

export class FormOrder extends Form<IOrderForm> {
	protected online: HTMLButtonElement;
	protected recipt: HTMLButtonElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		this.online = container.elements.namedItem('card') as HTMLButtonElement;
		this.recipt = container.elements.namedItem('cash') as HTMLButtonElement;

		this.online.addEventListener('click', () =>
			this.toggleActiveButton('online')
		);
		this.recipt.addEventListener('click', () =>
			this.toggleActiveButton('recipt')
		);
	}

	private toggleActiveButton(button: 'online' | 'recipt') {
		if (button === 'online') {
			this.online.classList.add('button_alt-active');
			this.recipt.classList.remove('button_alt-active');
		} else {
			this.online.classList.remove('button_alt-active');
			this.recipt.classList.add('button_alt-active');
		}

		this.events.emit<PaymentChangeEventDetail>('payment:change', { button });
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	disableButtons() {
		this.online.classList.remove('button_alt-active');
		this.recipt.classList.remove('button_alt-active');
	}
}

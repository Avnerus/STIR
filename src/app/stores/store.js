import { observable } from 'riot';

export default class Store {
    constructor(state) {
        this._state = state;

        if (IS_CLIENT) {
            observable(this);
        }
    }

    clientTrigger(event, data) {
        if (IS_CLIENT) {
            this.trigger(event, data);
        }
    }
}

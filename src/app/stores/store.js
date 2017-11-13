import { observable } from 'riot';

export default class Store {
    constructor(state) {
        this._state = state;
        observable(this);
    }
}

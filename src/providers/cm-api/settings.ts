import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class Settings {
  _default: any;

  constructor(public storage: Storage, defaults: any) {
    this.set(defaults);
  }

  get() {
    return this.storage.get("intro").then((value) => {});
  }

  set(value: any) {
    return this.storage.set("intro", value);
  }
}

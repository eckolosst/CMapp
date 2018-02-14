import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/**
 * A simple settings/config class for storing key/value pairs with persistence.
 */
@Injectable()
export class Settings {
  _default: any;

  constructor(public storage: Storage, defaults: any) {
    console.log("Entró a constructor.")
    this.set(defaults);
    console.log("Pasó por set.")
  }

  get() {
    return this.storage.get("intro").then((value) => {});
  }

  set(value: any) {
    console.log("Entró a set.")
    return this.storage.set("intro", value);
  }
}

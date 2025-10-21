import { EventEmitter } from "../base/Events";

export abstract class BaseModel {
  protected eventBus: EventEmitter;

  constructor(eventBus:EventEmitter) {
    this.eventBus = eventBus
  }
}
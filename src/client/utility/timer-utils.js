/* eslint-disable no-magic-numbers */
export class CustomInterval {
  interval;
  duration;
  callback;

  constructor(duration, callback, ctr) {
    this.duration = duration;
    this.callback = callback;
    this.ctr = ctr || 0;
    this.finalCtr = 100;
    this.list = [3, 7, 11];
    this.active = false;
  }

  timerHandler (list) {
    this.ctr++;
    let i = 0;
    let isFactor = false;
    while (i < list.length && !isFactor) {
      if (this.ctr % list[i] === 0) {
        isFactor = true;
        this.callback(this.ctr, this.active);
      }
      i++;
    }

    if (this.ctr === this.finalCtr) {
      return window.clearInterval(this.interval);
    }
    return this.interval;
  }

  start () {
    this.active = true;
    const freq = this.duration * 1000 / this.finalCtr;
    const list = [3, 7, 11];
    this.interval = window.setInterval(this.timerHandler.bind(this, list), freq);
  }

  stop () {
    window.clearInterval(this.interval);
    this.active = false;
    this.callback(this.ctr, this.active);
  }
}


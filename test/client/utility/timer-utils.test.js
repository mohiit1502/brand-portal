import {CustomInterval} from "../../../src/client/utility/timer-utils";

describe("timer utils test container", () => {
  it("should execute timer",  () => {
    let interval = new CustomInterval(4, () => console.log("executing test function in timer"));
    const start = interval.start.bind(interval);
    const stop = interval.stop.bind(interval);
    let timerHandler = interval.timerHandler.bind(interval);
    expect(start).not.toThrowError();
    expect(stop).not.toThrowError();
    expect(() => timerHandler([3, 7, 11])).not.toThrowError();
    expect(() => timerHandler([2, 4, 8])).not.toThrowError();
    interval = new CustomInterval(4, () => console.log("executing test function in timer"), 99);
    timerHandler = interval.timerHandler.bind(interval);
    expect(() => timerHandler([2, 4, 8])).not.toThrowError();
  });
});

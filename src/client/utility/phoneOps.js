/* eslint-disable no-magic-numbers, no-unused-expressions */
export default class InputFormatter {

  static inputTypeIgnoreList = ["deleteContentBackward", "deleteContentForward"];

  constructor(initOpts) {
    this.initOpts = initOpts;
    this.on = this.on.bind(this);

    this.inputFormatterDefaults = {
      formats: {
        3: "(xxx",
        6: "(xxx) xxx",
        10: "(xxx) xxx-xxxx",
        11: "+x (xxx) xxx-xxxx",
        12: "+xx (xxx) xxx-xxxx"
      },
      replaceChar: "x",
      skipFormatOpts: [{
        length: 10,
        position: 1,
        skip: false
      }]
    };
  }

  getMaxLengthKeys(formats) {
    return Object.keys(formats)
      .map(key => parseInt(key, 10))
      .sort((a, b) => a - b);
  }

  static getSkipOpt(skipFormatOpts, digitChars, curPosition) {
    return skipFormatOpts.find(({
      length,
      position
    }) => {
      return digitChars.length === length && curPosition === position;
    });
  }

  static nthIndex(str, pattern, n) {
    let i = -1;
    while (n-- && i++ < str.length) {
      i = str.indexOf(pattern, i);
      if (i < 0) break;
    }
    return i;
  }

  getDigitChars(inputElement) {
    return inputElement.value.replace(/\D/g, "");
  }

  getFormat(formats, maxLengthKeys, digitChars) {
    return formats[maxLengthKeys.find(len => digitChars.length <= len)];
  }

  static format(digitChars, formatString, replaceChar) {
    if (digitChars.length > 0) {
      const lastIndex = InputFormatter.nthIndex(formatString, replaceChar, digitChars.length);
      formatString = formatString.substring(0, lastIndex + 1);

      let i = 0;

      return formatString.split("").map(char => {
        if (char === replaceChar) {
          char = digitChars[i];
          i++;
        }
        return char;
      }).join("");
    }

    return "";
  }

  handleInput(event, digitChars, skipFormatOpts) {
    const caretPosition = this.selectionStart;
    const keepPostition = caretPosition !== event.target.value.length;

    let skipFormat = InputFormatter.inputTypeIgnoreList.includes(event.inputType);

    const skipOpt = InputFormatter.getSkipOpt(skipFormatOpts, digitChars, caretPosition);
    skipFormat = skipOpt === undefined ? skipFormat : skipOpt.skip;

    return (formatString, replaceChar) => {
      if (!skipFormat) {
        this.value = InputFormatter.format(digitChars, formatString, replaceChar);

        if (keepPostition) {
          this.selectionEnd = caretPosition;
        }
      }
    };
  }

  on(selector, newOpts) {
    const initOpts = Object.assign({}, this.initOpts, newOpts);

    const replaceChar = initOpts.replaceChar || this.inputFormatterDefaults.replaceChar;
    const skipFormatOpts = initOpts.skipFormatOpts || this.inputFormatterDefaults.skipFormatOpts;
    const formats = initOpts.formats || this.inputFormatterDefaults.formats;

    const inputEl = document.querySelector(selector);

    const maxLengthKeys = this.getMaxLengthKeys(formats);

    const inputHandler = event => {
      const digitChars = this.getDigitChars(event.target);
      const format = this.getFormat(formats, maxLengthKeys, digitChars);
      this.handleInput.call(event.target, event, digitChars, skipFormatOpts)(format, replaceChar);
    };

    return {inputHandler};
  }
}

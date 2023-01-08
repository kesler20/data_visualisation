import { arrayOfChars } from "./DataProcessing";

export default class NotificationModel {
  /**
   * this takes an array of strings, the first string () first 12 chars are used as message
   * from the second string the first 20 chars are used as description
   * @param {*} content - an array of strings forming the content of the notification
   * this can then be displayed on a popup
   */
  constructor(content) {
    this.content = content;
    this.message = this.convertArrayOfStringsToString(35, 0);
    this.description = this.convertArrayOfStringsToString(50, 1);
  }

  convertArrayOfStringsToString = (n, m) => {
    const firstParagraphIndex = this.findTheFirstParagraph(m);
    if (this.content[firstParagraphIndex] === undefined) {
      return this.turnArrayOfCharsToString(
        this.content[0].split("").filter((_, index) => index <= n)
      );
    } else {
      return this.turnArrayOfCharsToString(
        this.content[firstParagraphIndex]
          .split("")
          .filter((_, index) => index <= n)
      );
    }
  };

  findTheFirstParagraph = (n) => {
    try {
      if (
        this.content[n]
          .split("")
          .some((element) => arrayOfChars.indexOf(element) !== -1)
      ) {
        return n;
      } else this.findTheFirstParagraph(n + 1);
    } catch (e) {
      // protect yourself from out of range errors
      console.log(e);
      return n;
    }
  };

  getContent = () => {
    return "".concat(...this.content);
  };

  turnArrayOfCharsToString = (chars) => {
    const firstChar = chars[0];
    return firstChar[0].concat(...chars.filter((_, index) => index !== 0));
  };

  getMetaData = () => {
    return { message: this.message, desc: this.description };
  };
}

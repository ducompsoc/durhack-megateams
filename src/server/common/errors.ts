export class NullError extends Error {
  constructor(message) {
    super(message);
    this.name = "NullError";
  }
}

export class ValueError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValueError";
  }
}
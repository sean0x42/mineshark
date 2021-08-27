declare global {
  interface BigInt {
    toJSON: () => string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export default function clonePacket<T>(packet: T): T {
  return JSON.parse(JSON.stringify(packet));
}

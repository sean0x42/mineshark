export default function encodeToPem(publicKey: Buffer): string {
  const base64 = publicKey.toString("base64");
  return `-----BEGIN PUBLIC KEY-----
${base64}
-----END PUBLIC KEY-----`;
}

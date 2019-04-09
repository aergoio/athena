export const numberToByteArray = (value: number): Buffer => {
  const ret = Buffer.alloc(4);
  ret[0] = 0xFF & value;
  ret[1] = 0xFF & (value >> 8);
  ret[2] = 0xFF & (value >> 16);
  ret[3] = 0xFF & (value >> 24);
  return ret;
};
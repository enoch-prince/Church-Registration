const len = (obj: Object): number => {
  let count = 0;
  for (let key in obj) if (obj.hasOwnProperty(key)) ++count;
  return count;
};

const getKeyValue =
  <T extends Object, U extends keyof T>(obj: T) =>
  (key: U) =>
    obj[key];

export const createQueryUrl = (
  url: string,
  params: { [key: string]: string }
): string => {
  url += "?";
  let params_length = len(params);

  if (params_length < 1)
    throw new Error(
      "params: { [key: string]: string } must not be an empty object"
    );

  let qs = Object.keys(params)
    .map((key) => {
      return key + "=" + getKeyValue(params)(key);
    })
    .join(params_length > 1 ? "&" : "");

  return (url += qs);
};

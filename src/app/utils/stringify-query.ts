export function stringifyQuery(obj: any, parentKey?: string): string[] {
  return Object.keys(obj).flatMap(key => {
      const encodedKey = parentKey ? `${parentKey}[${key}]` : key;
      const value = obj[key];

      if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
          return stringifyQuery(value, encodedKey);
      } else if (Array.isArray(value)) {
          return value.flatMap((item, index) => stringifyQuery({ [index]: item }, encodedKey));
      } else {
          return [`${encodedKey}=${value}`];
      }
  });
};

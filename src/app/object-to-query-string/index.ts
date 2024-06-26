export function objectToQueryString(obj: any, prefix: string = ''): string {
  const queryStringParts: string[] = [];

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const fullKey = prefix ? `${prefix}[${key}]` : key;

      if (value !== null && typeof value === 'object' && !Array.isArray(value) && typeof value !== 'string') {
        // Recursively process nested objects
        queryStringParts.push(objectToQueryString(value, fullKey));
      } else if (Array.isArray(value)) {
        // Process arrays
        value.forEach((item, index) => {
          if (typeof item === 'string') {
            queryStringParts.push(`${encodeURIComponent(`${fullKey}[${index}]`)}=${encodeURIComponent(item)}`);
          } else {
            queryStringParts.push(objectToQueryString(item, `${fullKey}[${index}]`));
          }
        });
      } else {
        // Process primitive values
        queryStringParts.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(value)}`);
      }
    }
  }

  return queryStringParts.join('&');
}

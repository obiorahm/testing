export function convertToObject(instance: any) {
  let object: any = {};
  Object.getOwnPropertyNames(instance).forEach((prop) => {
    if (instance[prop] !== undefined) {
      object[prop] = instance[prop];
    }
  })
  return object;
}
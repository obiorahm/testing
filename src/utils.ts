export function convertToObject(instance: any) {
  let object: any = {};
  Object.getOwnPropertyNames(instance).forEach((prop) => {
    object[prop] = instance[prop];
  })
  return object;
}
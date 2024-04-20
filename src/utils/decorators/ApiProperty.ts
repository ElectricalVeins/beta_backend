export const API_PROPERTIES = '_properties';

export default function ApiProperty() {
  return (target: any, propertyKey: string): void => {
    if (!target[API_PROPERTIES]) {
      Object.defineProperty(target, API_PROPERTIES, { enumerable: false, writable: true, value: [] });
    }
    target[API_PROPERTIES].push(propertyKey);
  };
}

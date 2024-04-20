export const API_RELATIONS = '_relations';

export default function ApiRelation(...nestedRelations: string[]) {
  return (target: any, propertyKey: string): void => {
    if (!target[API_RELATIONS]) {
      Object.defineProperty(target, API_RELATIONS, { enumerable: false, writable: true, value: [] });
    }
    target[API_RELATIONS].push(propertyKey, ...nestedRelations.map((rel) => `${propertyKey}.${rel}`));
  };
}

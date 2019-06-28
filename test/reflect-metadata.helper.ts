import { ok } from 'assert';
import "reflect-metadata";

const metadataKeyForFoo = Symbol('metadataKeyForFoo');

export function addFooMetadata(value: string) {
  return Reflect.metadata(metadataKeyForFoo, value);
}

export function getFooMetadata(constructor: Function): string {
  ok(
    Reflect.hasMetadata(metadataKeyForFoo, constructor),
    `class definition of ${constructor.name} missing metadata`,
  );

  return Reflect.getMetadata(metadataKeyForFoo, constructor);
};


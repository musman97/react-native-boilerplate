export function createPredicatePair<T extends (...args: any[]) => boolean>(
  predicate: T,
): {
  positive: (...args: Parameters<T>) => boolean;
  negative: (...args: Parameters<T>) => boolean;
} {
  return {
    positive: predicate,
    negative: (...args: Parameters<T>) => !predicate(args),
  };
}

export const isDefined = (value: any) => value !== undefined && value !== null;
export const isNotDefined = (value: any) =>
  value === undefined || value === null;

export const {positive: isObjectEmpty, negative: isObjectNotEmpty} =
  createPredicatePair((obj: any) => {
    if (isNotDefined(obj)) {
      return true;
    }

    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return true;
  });

export const isError = (error: unknown): error is Error =>
  error instanceof Error;

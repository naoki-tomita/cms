import { AssertionError } from "assert";

function deepEquals(obj1: any, obj2: any): boolean {
  if (typeof obj1 !== typeof obj2) {
    return false;
  }

  if (typeof obj1 === "undefined") {
    // obj is undefined.
    return true;
  } else if (typeof obj1 === "number") {
    // NaN === NaN is return false.
    if (Number.isNaN(obj1) && Number.isNaN(obj2)) {
      return true;
    }
    // obj is number.
    return obj1 === obj2;
  } else if (
    typeof obj1 === "string" ||
    typeof obj1 === "function" ||
    typeof obj1 === "symbol" ||
    typeof obj1 === "boolean" ||
    // typeof null === "object". but, Object.keys(null); throws Error.
    // so, if obj1 or obj2 is null then equal check by using "===".
    (obj1 === null || obj2 === null)
  ) {
    // obj is string, function, symbol, boolean, null.
    return obj1 === obj2;
  } else if (Array.isArray(obj1)) {
    // obj is array.
    return (
      obj1.length === obj2.length && obj1.every((o, i) => deepEquals(o, obj2[i]))
    );
  } else if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }

  return (
    deepEquals(Object.keys(obj1).sort(), Object.keys(obj2).sort())
      && Object.keys(obj1).every(k => deepEquals(obj1[k], obj2[k]))
  );
}

function lazyDeepEquals(left: any, right: any) {
  if (typeof left !== "object") {
    return deepEquals(left, right);
  } else if (Array.isArray(left) && Array.isArray(right)) {
    return leftArrayIncludesRightArray(left, right, lazyDeepEquals);
  } else if (left instanceof Date && right instanceof Date) {
    return deepEquals(left, right)
  }

  return (
    leftArrayIncludesRightArray(Object.keys(left).sort(), Object.keys(right).sort())
      && Object.keys(right).every(k => lazyDeepEquals(left[k], right[k]))
  );
}

function leftArrayIncludesRightArray(
  left: any[],
  right: any[],
  comparator: (left: any, right: any) => boolean = deepEquals,
) {
  for (let i = 0; i < left.length; i++) {
    if (comparator(left[i], right[0])) {
      for (let j = 0; i + j < left.length; j++) {
        if (!comparator(left[i + j], right[j])) {
          break;
        } else if (j === right.length - 1) {
          return true;
        }
      }
    }
  }
  return false;
}

export function expect(expected: any) {
  return {
    includes: {
      item(item: any) {
        if (!lazyDeepEquals(expected, item)) {
          throw new AssertionError({
            message: `Expected object is not includes item.
expected: ${JSON.stringify(expected, null, "  ")}
but was: ${JSON.stringify(item, null, "  ")}`,
            expected,
            actual: item,
          });
        }
      },
      items(items: any[]) {
        if (Array.isArray(expected)) {
          if (!leftArrayIncludesRightArray(expected, items)) {
            throw new AssertionError({
              message: `Expected array are not includes item.
expected: ${JSON.stringify(expected, null, "  ")}
but was: ${JSON.stringify(items, null, "  ")}`,
              expected,
              actual: items,
            });
          }
        } else {
          throw new Error("not implemented");
        }
      },
      lazy: {
        item(item: any) {
          if (!lazyDeepEquals(expected, item)) {
            throw new AssertionError({
              message: `Expected object is not includes item.
expected: ${JSON.stringify(expected, null, "  ")}
but was: ${JSON.stringify(item, null, "  ")}`,
              expected,
              actual: item,
            });
          }
        },
        items(items: any[]) {
          if (Array.isArray(expected)) {
            if (!leftArrayIncludesRightArray(expected, items, lazyDeepEquals)) {
              throw new AssertionError({
                message: `Expected array are not includes item.
expected: ${JSON.stringify(expected, null, "  ")}
but was: ${JSON.stringify(items, null, "  ")}`,
                expected,
                actual: items,
              });
            }
          } else {
            throw new Error("not implemented");
          }
        },
      }
    },
    deepEquals(actual: any) {
      if (!deepEquals(expected, actual)) {
        throw new AssertionError({
          message: `Expected object is not includes item.
expected: ${JSON.stringify(expected, null, "  ")}
but was: ${JSON.stringify(actual, null, "  ")}`,
          expected,
          actual,
        });
      }
    },
    lazy: {
      deepEquals(actual: any) {
        if (!lazyDeepEquals(expected, actual)) {
          throw new AssertionError({
            message: `Expected object is not includes item.
expected: ${JSON.stringify(expected, null, "  ")}
but was: ${JSON.stringify(actual, null, "  ")}`,
            expected,
            actual,
          });
        }
      }
    }
  }
}

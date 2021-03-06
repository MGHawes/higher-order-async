import { forEach, identity, map, reduce } from 'lodash';

export type Abortable<T> = Promise<T> & { abort(): void };

export type Cancelable<T> = Promise<T> & { cancel(): void };

export type AbortableLike<T> = Abortable<T> | Cancelable<T> | Promise<T> | T;

const abort = (abortables: Array<AbortableLike<any>>) =>
  forEach(abortables, abortable => {
    if (abortable.abort != null) {
      return abortable.abort();
    }
    if (abortable.cancel != null) {
      return abortable.cancel();
    }
  });

export function all<T>(abortables: [AbortableLike<T>]): Abortable<[T]>
export function all<T1, T2>(abortables: [AbortableLike<T1>, AbortableLike<T2>]): Abortable<[T1, T2]>
export function all<T1, T2, T3>(abortables: [AbortableLike<T1>, AbortableLike<T2> | AbortableLike<T3>]): Abortable<[T1, T2, T3]>
export function all<T1, T2, T3, T4>(abortables: [AbortableLike<T1>, AbortableLike<T2> | AbortableLike<T3>, AbortableLike<T4>]): Abortable<[T1, T2, T3, T4]>
export function all<T1, T2, T3, T4, T5>(abortables: [AbortableLike<T1>, AbortableLike<T2> | AbortableLike<T3>, AbortableLike<T4>, AbortableLike<T5>]): Abortable<[T1, T2, T3, T4, T5]>
export function all<T1, T2, T3, T4, T5, T6>(abortables: [AbortableLike<T1>, AbortableLike<T2> | AbortableLike<T3>, AbortableLike<T4>, AbortableLike<T5>, AbortableLike<T6>]): Abortable<[T1, T2, T3, T4, T5, T6]>
export function all<T1, T2, T3, T4, T5, T6, T7>(abortables: [AbortableLike<T1>, AbortableLike<T2> | AbortableLike<T3>, AbortableLike<T4>, AbortableLike<T5>, AbortableLike<T6>, AbortableLike<T7>]): Abortable<[T1, T2, T3, T4, T5, T6, T7]>
export function all<T1, T2, T3, T4, T5, T6, T7, T8>(abortables: [AbortableLike<T1>, AbortableLike<T2> | AbortableLike<T3>, AbortableLike<T4>, AbortableLike<T5>, AbortableLike<T6>, AbortableLike<T7>, AbortableLike<T8> ]): Abortable<[T1, T2, T3, T4, T5, T6, T7, T8]>
export function all<T1, T2, T3, T4, T5, T6, T7, T8, T9>(abortables: [AbortableLike<T1>, AbortableLike<T2> | AbortableLike<T3>, AbortableLike<T4>, AbortableLike<T5>,  AbortableLike<T6>, AbortableLike<T7>, AbortableLike<T8>, AbortableLike<T9>]): Abortable<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>
export function all<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(abortables: [AbortableLike<T1>, AbortableLike<T2> | AbortableLike<T3>, AbortableLike<T4>, AbortableLike<T5>, AbortableLike<T6>, AbortableLike<T7>, AbortableLike<T8>, AbortableLike<T9>, AbortableLike<T10>]): Abortable<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>
export function all(abortables: Array<any | Abortable<any>>): Abortable<Array<any>> {
  // If the abortable is a superagent request the request wont be sent until it has been then'd
  const initiatedRequests: Array<Promise<any>> = map(abortables, (abortable): Promise<any> =>
    abortable.then ? abortable.then(identity) : Promise.resolve(abortable));

  const results: Array<any> = [];
  const mergedAbortable: Promise<any> = reduce(
    initiatedRequests,
    (chainedAbortables, abortable) =>
      chainedAbortables.then(() => abortable).then((result: any) => results.push(result)),
    Promise.resolve(0),
  );

  const result = new Promise((resolve, reject) =>
    mergedAbortable
      .then(() => resolve(results))
      .catch(reason => {
        abort(abortables);
        reject(reason);
      })
  ) as Abortable<any>;

  result.abort = () => abort(abortables);

  return result;
}

export function race<T>(abortables: [AbortableLike<T>]): Abortable<[T]>
export function race<T1, T2>(abortables: [AbortableLike<T1>, AbortableLike<T2>]): Abortable<T1 | T2>
export function race<T1, T2, T3>(abortables: [AbortableLike<T1>, AbortableLike<T2> | AbortableLike<T3>]): Abortable<T1 | T2 | T3>
export function race<T1, T2, T3, T4>(abortables: [AbortableLike<T1>, AbortableLike<T2> | AbortableLike<T3>, AbortableLike<T4>]): Abortable<T1 | T2 | T3 | T4>
export function race<T1, T2, T3, T4, T5>(abortables: [AbortableLike<T1>, AbortableLike<T2> | AbortableLike<T3>, AbortableLike<T4>, AbortableLike<T5>]): Abortable<T1 | T2 | T3 | T4 | T5>
export function race<T1, T2, T3, T4, T5, T6>(abortables: [AbortableLike<T1>, AbortableLike<T2> | AbortableLike<T3>, AbortableLike<T4>, AbortableLike<T5>]): Abortable<T1 | T2 | T3 | T4 | T5>
export function race<T1, T2, T3, T4, T5, T6, T7>(abortables: [AbortableLike<T1>, AbortableLike<T2> | AbortableLike<T3>, AbortableLike<T4>, AbortableLike<T5>]): Abortable<T1 | T2 | T3 | T4 | T5>
export function race<T1, T2, T3, T4, T5, T6, T7, T8>(abortables: [AbortableLike<T1>, AbortableLike<T2> | AbortableLike<T3>, AbortableLike<T4>, AbortableLike<T5>]): Abortable<T1 | T2 | T3 | T4 | T5>
export function race<T1, T2, T3, T4, T5, T6, T7, T8, T9>(abortables: [AbortableLike<T1>, AbortableLike<T2> | AbortableLike<T3>, AbortableLike<T4>, AbortableLike<T5>]): Abortable<T1 | T2 | T3 | T4 | T5>
export function race<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(abortables: [AbortableLike<T1>, AbortableLike<T2> | AbortableLike<T3>, AbortableLike<T4>, AbortableLike<T5>]): Abortable<T1 | T2 | T3 | T4 | T5>
export function race(abortables: Array<Abortable<any>>): Abortable<any> {
  const result = new Promise((resolve, reject) =>
    forEach(abortables, (abortable) => abortable
      .then((result) => {
        abort(abortables);
        resolve(result);
      })
      .catch(reason => {
        abort(abortables);
        reject(reason);
      })
    )) as Abortable<any>;

  result.abort = () => abort(abortables);
  return result;
}

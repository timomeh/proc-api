import { ProcCtx } from './types.js'

// It's a lot of overloads but it can do inferred types!
export function pipe<A extends ProcCtx>(): (arg: A) => Promise<A>
export function pipe<A extends ProcCtx, B>(
  fn0: (arg: A) => Promise<B> | B,
): (arg: A) => Promise<B>
export function pipe<A extends ProcCtx, B, C>(
  fn0: (arg: A) => Promise<B> | B,
  fn1: (arg: B) => Promise<C> | C,
): (arg: A) => Promise<C>
export function pipe<A extends ProcCtx, B, C, D>(
  fn0: (arg: A) => Promise<B> | B,
  fn1: (arg: B) => Promise<C> | C,
  fn2: (arg: C) => Promise<D> | D,
): (arg: A) => Promise<D>
export function pipe<A extends ProcCtx, B, C, D, E>(
  fn0: (arg: A) => Promise<B> | B,
  fn1: (arg: B) => Promise<C> | C,
  fn2: (arg: C) => Promise<D> | D,
  fn3: (arg: D) => Promise<E> | E,
): (arg: A) => Promise<E>
export function pipe<A extends ProcCtx, B, C, D, E, F>(
  fn0: (arg: A) => Promise<B> | B,
  fn1: (arg: B) => Promise<C> | C,
  fn2: (arg: C) => Promise<D> | D,
  fn3: (arg: D) => Promise<E> | E,
  fn4: (arg: E) => Promise<F> | F,
): (arg: A) => Promise<F>
export function pipe<A extends ProcCtx, B, C, D, E, F, G>(
  fn0: (arg: A) => Promise<B> | B,
  fn1: (arg: B) => Promise<C> | C,
  fn2: (arg: C) => Promise<D> | D,
  fn3: (arg: D) => Promise<E> | E,
  fn4: (arg: E) => Promise<F> | F,
  fn5: (arg: F) => Promise<G> | G,
): (arg: A) => Promise<G>
export function pipe<A extends ProcCtx, B, C, D, E, F, G, H>(
  fn0: (arg: A) => Promise<B> | B,
  fn1: (arg: B) => Promise<C> | C,
  fn2: (arg: C) => Promise<D> | D,
  fn3: (arg: D) => Promise<E> | E,
  fn4: (arg: E) => Promise<F> | F,
  fn5: (arg: F) => Promise<G> | G,
  fn6: (arg: G) => Promise<H> | H,
): (arg: A) => Promise<H>
export function pipe<A extends ProcCtx, B, C, D, E, F, G, H, I>(
  fn0: (arg: A) => Promise<B> | B,
  fn1: (arg: B) => Promise<C> | C,
  fn2: (arg: C) => Promise<D> | D,
  fn3: (arg: D) => Promise<E> | E,
  fn4: (arg: E) => Promise<F> | F,
  fn5: (arg: F) => Promise<G> | G,
  fn6: (arg: G) => Promise<H> | H,
  fn7: (arg: H) => Promise<I> | I,
): (arg: A) => Promise<I>
export function pipe<A extends ProcCtx, B, C, D, E, F, G, H, I, J>(
  fn0: (arg: A) => Promise<B> | B,
  fn1: (arg: B) => Promise<C> | C,
  fn2: (arg: C) => Promise<D> | D,
  fn3: (arg: D) => Promise<E> | E,
  fn4: (arg: E) => Promise<F> | F,
  fn5: (arg: F) => Promise<G> | G,
  fn6: (arg: G) => Promise<H> | H,
  fn7: (arg: H) => Promise<I> | I,
  fn8: (arg: I) => Promise<J> | J,
): (arg: A) => Promise<J>
export function pipe<A extends ProcCtx, B, C, D, E, F, G, H, I, J, K>(
  fn0: (arg: A) => Promise<B> | B,
  fn1: (arg: B) => Promise<C> | C,
  fn2: (arg: C) => Promise<D> | D,
  fn3: (arg: D) => Promise<E> | E,
  fn4: (arg: E) => Promise<F> | F,
  fn5: (arg: F) => Promise<G> | G,
  fn6: (arg: G) => Promise<H> | H,
  fn7: (arg: H) => Promise<I> | I,
  fn8: (arg: I) => Promise<J> | J,
  fn9: (arg: J) => Promise<K> | K,
): (arg: A) => Promise<K>
export function pipe<A extends ProcCtx, B, C, D, E, F, G, H, I, J, K, L>(
  fn0: (arg: A) => Promise<B> | B,
  fn1: (arg: B) => Promise<C> | C,
  fn2: (arg: C) => Promise<D> | D,
  fn3: (arg: D) => Promise<E> | E,
  fn4: (arg: E) => Promise<F> | F,
  fn5: (arg: F) => Promise<G> | G,
  fn6: (arg: G) => Promise<H> | H,
  fn7: (arg: H) => Promise<I> | I,
  fn8: (arg: I) => Promise<J> | J,
  fn9: (arg: J) => Promise<K> | K,
  fn10: (arg: K) => Promise<L> | L,
): (arg: A) => Promise<L>
export function pipe<A extends ProcCtx, B, C, D, E, F, G, H, I, J, K, L, M>(
  fn0: (arg: A) => Promise<B> | B,
  fn1: (arg: B) => Promise<C> | C,
  fn2: (arg: C) => Promise<D> | D,
  fn3: (arg: D) => Promise<E> | E,
  fn4: (arg: E) => Promise<F> | F,
  fn5: (arg: F) => Promise<G> | G,
  fn6: (arg: G) => Promise<H> | H,
  fn7: (arg: H) => Promise<I> | I,
  fn8: (arg: I) => Promise<J> | J,
  fn9: (arg: J) => Promise<K> | K,
  fn10: (arg: K) => Promise<L> | L,
  fn11: (arg: L) => Promise<M> | M,
): (arg: A) => Promise<M>

export function pipe(...fns: any[]): any {
  return (initial: any) => {
    return fns.reduce((arg, fn) => {
      return arg.then(fn)
    }, Promise.resolve(initial))
  }
}

/**
 * 여러 HOC(Higher Order Components)를 조합하는 함수
 * @param {...Function} funcs - 조합할 HOC 함수들
 * @returns {Function} - 조합된 HOC 함수
 */
export const compose = (...funcs) => {
  if (funcs.length === 0) {
    return (arg) => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  )
}

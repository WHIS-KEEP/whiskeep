import { Provider } from "react-redux"
import { store } from "../../shared/config/store"

export const withStore = (component) => () => {
  return <Provider store={store}>{component()}</Provider>
}

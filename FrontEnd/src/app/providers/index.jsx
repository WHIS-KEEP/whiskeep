import { compose } from "../../shared/lib/compose"
import { withRouter } from "./with-router"
import { withStore } from "./with-store"
import { withTheme } from "./with-theme"

// 컴포저블 HOC 패턴으로 프로바이더들을 구성합니다
export const withProviders = compose(withRouter, withStore, withTheme)

import { useState } from "react"
import { ProductList } from "../../../entities/product"
import { ProductFilter } from "../../../features/product-filter"
import styles from "./HomePage.module.css"

export const HomePage = () => {
  const [filters, setFilters] = useState({})

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className={styles.homePage}>
      <div className={styles.hero}>
        <h1>Welcome to A409FE</h1>
        <p>Feature-Sliced Design (FSD) 구조 예시 애플리케이션</p>
      </div>

      <div className={styles.filterSection}>
        <h2>상품 목록</h2>
        <ProductFilter onChange={handleFilterChange} />
      </div>

      <div className={styles.productSection}>
        <ProductList filters={filters} />
      </div>
    </div>
  )
}

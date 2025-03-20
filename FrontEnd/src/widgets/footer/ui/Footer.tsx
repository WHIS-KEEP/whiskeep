import React from "react"
import { SafeArea } from "../../../shared/ui/layout/SafeArea"
import { Container } from "../../../shared/ui/layout/Container"

export const Footer: React.FC = () => (
  <SafeArea top={false} bottom={true} className="">
    <footer className="footer">
      <Container>
        <p>© {new Date().getFullYear()} 임시로고 - All rights reserved</p>
      </Container>
    </footer>
  </SafeArea>
)

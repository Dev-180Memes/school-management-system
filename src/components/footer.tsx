import React from 'react'
import { Footer as FlowBiteFooter } from 'flowbite-react'

const Footer = () => {
  return (
    <FlowBiteFooter container>
      <FlowBiteFooter.Copyright href='#' by='Funaab High School' year={2024} />
      <FlowBiteFooter.LinkGroup>
        <FlowBiteFooter.Link href='#'>About</FlowBiteFooter.Link>
        <FlowBiteFooter.Link href='#'>Privacy Policy</FlowBiteFooter.Link>
        <FlowBiteFooter.Link href='#'>Contact</FlowBiteFooter.Link>
      </FlowBiteFooter.LinkGroup>
    </FlowBiteFooter>
  )
}

export default Footer;
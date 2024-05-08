import { ReactNode } from "react"

type textSmTypes= {
    children:  ReactNode
    className?: string
}

const TextSmall = ({children, className=''}:textSmTypes) => {
  return <p className={`text-sm text-center  ${className}`}>{children}</p>;
}

export default TextSmall
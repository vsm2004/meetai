interface Props{
    children:React.ReactNode;
}
import React from 'react'

const Layout = ({children}:Props) => {
  return (
    <div className="h-screen bg-black">
        {children} 
    </div>
  )
}

export default Layout

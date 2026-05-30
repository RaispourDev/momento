"use client" 

import Link from 'next/link'
import React from 'react'

function HomePage() {

  return (
    <React.Fragment>
    <div className='h-64 flex font-black text-5xl justify-center items-center'>
      <h1 className=''>MOMENTO</h1>
      <h1 className='bg-sky-500 rounded-t-full p-5.5'>📷</h1>
    </div>
    <div className="flex items-center-safe justify-center m-5 space-x-4">
      <Link href="signin" className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-sky-500">
        Sign In
      </Link>
      <Link href="/signup" className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-sky-500">
        Sign Up
      </Link>
    </div>
    </React.Fragment>
  )
}

export default HomePage
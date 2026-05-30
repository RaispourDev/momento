"use client"

import { FormEvent, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import Link from "next/link";

export default function SignUp(){
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const {signUp} = useAuth()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try{
        const { data, error } = await signUp(email, password, name)
        if(error){
            throw error
        }else {
        console.log('Signup successful:', data)
        window.location.href = '/dashboard'
      }


      window.location.href = ('/dashboard')
    } catch (err: unknown){
        if(err instanceof Error){
            setError(err.message)
        }else{
            setError('an unknown error occured')
        }
    }finally{
        setLoading(false)
    }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-blue-300 rounded-4xl p-5">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border-1 border-black placeholder-gray-900 text-black rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <input
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border-1 border-black placeholder-gray-900 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border-1 border-black placeholder-gray-900 text-black rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-500 bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>

          <div className="text-center">
            <Link href="/signin" className="text-gray-900 hover:text-black">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
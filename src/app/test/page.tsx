"use client"

import { useSession } from "next-auth/react"
import { signIn, signOut } from "next-auth/react"

export default function TestPage() {
  const { data: session, status } = useSession()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test Page</h1>
      
      <div className="space-y-4">
        <div>
          <strong>Status:</strong> {status}
        </div>
        
        <div>
          <strong>Session:</strong> {JSON.stringify(session, null, 2)}
        </div>
        
        <div className="space-x-4">
          <button
            onClick={() => signIn("credentials", { 
              email: "admin@itc.com", 
              password: "admin123",
              redirect: false 
            })}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Test Login
          </button>
          
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
} 
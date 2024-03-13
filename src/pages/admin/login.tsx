import React from 'react'
import { Navbar, Footer } from '@/components';
import { Button, TextInput, Label } from 'flowbite-react';

const Login = () => {
  return (
    <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-full max-w-md">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <h2 className="text-2xl font-bold mb-6">Admin Portal</h2>
              <div className="mb-4">
                <Label>Email</Label>
                <TextInput type="email" placeholder="Email" />
              </div>
              <div className="mb-6">
                <Label>Password</Label>
                <TextInput type="password" placeholder="******************" />
              </div>
              <div className="flex items-center justify-between">
                <Button color="green">Sign In</Button>
              </div>
              {/* Links to Admin and Staff Login */}
              <div className="flex flex-row gap-4 justify-center items-center mt-5">
                <Button color="green">Student Login</Button>
                <Button color="green">Staff Login</Button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
    </>
  )
}

export default Login;
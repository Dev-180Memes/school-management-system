import React from 'react'
import { Navbar, Footer } from '@/components';
import { Button, TextInput, Label } from 'flowbite-react';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();

  const onAdminLoginClick = () => {
    router.push('/admin/login');
  }

  const onStaffLoginClick = () => {
    router.push("/staff/login");
  }

  return (
    <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-full max-w-md">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <h2 className="text-2xl font-bold mb-6">Student Portal</h2>
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
                <Button color="green" onClick={onAdminLoginClick}>Admin Login</Button>
                <Button color="green" onClick={onStaffLoginClick}>Staff Login</Button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
    </>
  )
}

export default Login;
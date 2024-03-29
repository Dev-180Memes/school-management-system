import React, { useState, useEffect } from 'react'
import { Navbar, Footer } from '@/components';
import { Button, TextInput, Label } from 'flowbite-react';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import decodeJWT from '@/utils/decodeToken';

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  // Check if staff is already logged in then redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // decode token and see if it's a staff
      const decodedToken = decodeJWT(token) as { exp: number, id?: string, name?: string, email?: string, position?: string, account?: string }

      if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("token")
        toast.error("Token has expired, Please Login");
        router.push("/staff/login");
      } else if (decodedToken && decodedToken.account === "staff") {
        router.push("/staff/dashboard");
      }
    }
  }, [router]);

  const onAdminLoginClick = () => {
    router.push('/admin/login');
  }

  const onStudentLoginClick = () => {
    router.push('/student/login');
  }

  const handleStaffLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      email,
      password
    }

    const response = await fetch('/api/staff/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    
    if (response.status === 200) {
      const result = await response.json();
      localStorage.setItem("token", result.token)
      router.push("/staff/dashboard")
    } else {
      const result = await response.json();
      toast.error(result.message)
    }
  }

  return (
    <>
        <ToastContainer />
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-full max-w-md">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleStaffLogin}>
              <h2 className="text-2xl font-bold mb-6">Staff Portal</h2>
              <div className="mb-4">
                <Label>Email</Label>
                <TextInput type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="mb-6">
                <Label>Password</Label>
                <TextInput type="password" placeholder="******************" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="flex items-center justify-between">
                <Button color="green" type='submit'>Sign In</Button>
              </div>
              {/* Links to Admin and Staff Login */}
              <div className="flex flex-row gap-4 justify-center items-center mt-5">
                <Button color="green" onClick={onAdminLoginClick}>Admin Login</Button>
                <Button color="green" onClick={onStudentLoginClick}>Student Login</Button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
    </>
  )
}

export default Login;
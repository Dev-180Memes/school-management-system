import React, { useState, useEffect } from 'react'
import { Navbar, Footer } from '@/components';
import { Button, TextInput, Label } from 'flowbite-react';
import { useRouter } from 'next/router';
import decodeJWT from '@/utils/decodeToken';
import { toast } from 'react-toastify';

const Login = () => {
  const router = useRouter();

  const onAdminLoginClick = () => {
    router.push('/admin/login');
  }

  const onStaffLoginClick = () => {
    router.push("/staff/login");
  }

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = decodeJWT(token) as { exp: number, id?: string, name?: string, email?: string, teacherId?: string, account?: string }

      if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("token")
        toast.error("Token has expired, Please Login");
        router.push("/student/login");
      } else if (decodedToken && decodedToken.account === "student") {
        router.push("/student/dashboard");
      }
    }
  }, [router])

  const handleStudentLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      email,
      password
    }

    const response = await fetch('/api/student/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (response.status === 200) {
      const result = await response.json()
      localStorage.setItem("token", result.token);
      router.push("/student/dashboard");
    } else {
      const result = await response.json();
      toast.error(result.message);
    }
  }

  return (
    <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-full max-w-md">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleStudentLogin}>
              <h2 className="text-2xl font-bold mb-6">Student Portal</h2>
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
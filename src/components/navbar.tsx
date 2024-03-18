import React, { useState, useEffect } from 'react';
import { 
    Navbar as FlowNavbar, 
    Avatar, 
    Dropdown, 
    Button
} from 'flowbite-react';
import decodeJWT from '@/utils/decodeToken';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Navbar = () => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [dashboardLink, setDashboardLink] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        const token: string | null = localStorage.getItem("token");

        if (!token) {
            setIsLoggedIn(false);
        } else if (token) {
            const decodedToken = decodeJWT(token) as { exp: number, id?: string, name?: string, email?: string, position?: string, account?: string }
            setName(decodedToken.name || "");
            setEmail(decodedToken.email || "");

            if (decodedToken.account === "admin") {
                setDashboardLink("/admin/dashboard")
            } else if (decodedToken.account === "staff") {
                setDashboardLink("/staff/dashboard")
            } else if (decodedToken.account === "student") {
                setDashboardLink("/student/dashboard")
            }

            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        router.push("/")
    }
    

  return (
    <FlowNavbar fluid rounded>
        <FlowNavbar.Brand href="/">
            <span className="self-center whitespace-nowrap text-xl font-semibold">Funaab High School</span>
        </FlowNavbar.Brand>
        <div className="flex md:order-2">
            {isLoggedIn ? (
                <Dropdown
                arrowIcon={false}
                inline
                label={
                    <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
                }
                >
                    <Dropdown.Header>
                        <span className="block text-sm">{name}</span>
                        <span className="block truncate text-sm font-medium">{email}</span>
                    </Dropdown.Header>

                    <Link href={dashboardLink}>
                        <Dropdown.Item>Dashboard</Dropdown.Item>
                    </Link>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
                </Dropdown>  
            ) : (
                <Link href={"student/login"}>
                    <Button color="green">Login</Button>
                </Link>
            )}
            <FlowNavbar.Toggle />
        </div>
        <FlowNavbar.Collapse>
            <FlowNavbar.Link href="/">Home</FlowNavbar.Link>
            <FlowNavbar.Link href="/admin/login">Admin Login</FlowNavbar.Link>
            <FlowNavbar.Link href="/staff/login">Staff Login</FlowNavbar.Link>
            <FlowNavbar.Link href="/student/login">Student Login</FlowNavbar.Link>
        </FlowNavbar.Collapse>
    </FlowNavbar>
  )
}

export default Navbar;
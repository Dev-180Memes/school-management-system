import React, { useState, useEffect } from 'react';
import { 
    Navbar as FlowNavbar, 
    Avatar, 
    Dropdown, 
    Button
} from 'flowbite-react';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setIsLoggedIn(false);
        }
    }, []);
    

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
                        <span className="block text-sm">Student Name</span>
                        <span className="block truncate text-sm font-medium">student@email.com</span>
                    </Dropdown.Header>
    
                    <Dropdown.Item>Dashboard</Dropdown.Item>
                    <Dropdown.Item>Settings</Dropdown.Item>
                    <Dropdown.Item>Notifications</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item>Sign out</Dropdown.Item>
                </Dropdown>  
            ) : (
                <Button color="green">Login</Button>
            )}
            <FlowNavbar.Toggle />
        </div>
        <FlowNavbar.Collapse>
            <FlowNavbar.Link href="#">Home</FlowNavbar.Link>
            <FlowNavbar.Link href="#">Admin Login</FlowNavbar.Link>
            <FlowNavbar.Link href="#">Staff Login</FlowNavbar.Link>
            <FlowNavbar.Link href="#">Student Login</FlowNavbar.Link>
        </FlowNavbar.Collapse>
    </FlowNavbar>
  )
}

export default Navbar;
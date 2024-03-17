import React, { useEffect, useState } from 'react';
import { Navbar, Footer } from '@/components';
import { Tabs, TextInput, Button, Table, Select } from 'flowbite-react';
import { FaEnvelope, FaChalkboardTeacher, FaGraduationCap, FaUser } from 'react-icons/fa';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import decodeJWT from '@/utils/decodeToken';
import { useRouter } from 'next/router';

interface Admins {
    _id: string,
    name: string,
    email: string,
    position: string
}

const Dashboard = () => {
    const [adminName, setAdminName] = useState<string>("");
    const [adminEmail, setAdminEmail] = useState<string>("");
    const [adminPosition, setAdminPosition] = useState<string>("");
    const [adminPassword, setAdminPassword] = useState<string>("");
    const [isSubmittingAdmin, setIsSubmittingAdmin] = useState<boolean>(false);
    const [isDeletingAdmin, setIsDeletingAdmin] = useState<boolean>(false);
    const [admins, setAdmins] = useState<Admins[]>([]);
    const router = useRouter();

    useEffect(() => {
        const token: string | null = localStorage.getItem("token");
        if (!token) {
            toast.error("You need to Login");
            router.push("/admin/login");
        } else if (token) {
            const decodedToken = decodeJWT(token) as { exp: number, id?: string, name?: string, email?: string, position?: string, account?: string }
            if (decodedToken.account !== "admin") {
                toast.error("You are not authorized to view this page");
                router.push("/admin/login");
            }

            if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
                localStorage.removeItem("token")
                toast.error("Token has expired, Please Login");
                router.push("/admin/login");
            }
        }

        // Fetch all admins
        const fetchAdmins = async () => {
            const response = await fetch('/api/admin/addAdmin', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            })

            if (response.status === 200) {
                const result = await response.json();
                setAdmins(result.admins);
            } else {
                const result = await response.json();
                toast.error(result.message);
            }
        }

        fetchAdmins();
    }, [router])

    const handleCreateAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmittingAdmin(true);

        const name: string = adminName;
        const email: string = adminEmail;
        const position: string = adminPosition;
        const password: string = adminPassword;

        const data = {
            name,
            email,
            position,
            password
        }

        const response = await fetch('/api/admin/addAdmin', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        if (response.status === 201) {
            const result = await response.json();
            setAdmins(prev => [...prev, result.admin]);
            setIsSubmittingAdmin(false);
            setAdminEmail("");
            setAdminName("");
            setAdminPassword("");
            setAdminPosition("");
            toast.success(result.message);
        } else {
            const result = await response.json();
            setIsSubmittingAdmin(false);
            toast.error(result.message);
        }
    }

    const handleDeleteAdmin = async (id: string) => {
        setIsDeletingAdmin(true);
        const response = await fetch(`/api/admin/IdOperations/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (response.status === 200) {
            const data = await response.json();
            setIsDeletingAdmin(false);
            setAdmins(prev => prev.filter(admin => admin._id != id));
            toast.success(data.message);
        } else {
            const data = await response.json();
            setIsDeletingAdmin(false);
            toast.error(data.message);
        }
    }

  return (
    <>
        <ToastContainer />
        <Navbar />
        <div className="flex flex-col min-h-screen p-5">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
            <Tabs style="underline">
                <Tabs.Item active title="Add Staff" icon={FaChalkboardTeacher}>
                    {/* Add Teacher */}
                    <div className="w-full max-w items-center justify-center">
                        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <h2 className="text-2xl font-bold mb-6">Add Staff</h2>
                            <div className="mb-4">
                                <TextInput type="text" placeholder="Full Name" />
                            </div>
                            <div className="mb-4">
                                <TextInput type="email" placeholder="Email" />
                            </div>
                            <div className="mb-4">
                                <TextInput type="text" placeholder="Class Name" />
                            </div>
                            <div className="mb-6">
                                <TextInput type="password" placeholder="******************" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Button color="green">Add Staff</Button>
                            </div>
                        </form>
                    </div>

                    {/* List All Staff Members */}
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>Full Name</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>ClassName</Table.HeadCell>
                            <Table.HeadCell>
                                <span className="sr-only">Delete</span>
                            </Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>John Doe</Table.Cell>
                                <Table.Cell>staff@email.com</Table.Cell>
                                <Table.Cell>Mathematics</Table.Cell>
                                <Table.Cell>
                                    <Button color="red">Delete</Button>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Tabs.Item>
                <Tabs.Item title="Add Admins" icon={FaUser}>
                    <div className="w-full max-w items-center justify-center">
                        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleCreateAdmin}>
                            <h2 className="text-2xl font-bold mb-6">Add Admin</h2>
                            <div className="mb-4">
                                <TextInput type="text" placeholder="Full Name" value={adminName} onChange={(e) => setAdminName(e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <TextInput type="email" placeholder="Email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <TextInput type="text" placeholder="Position" value={adminPosition} onChange={(e) => setAdminPosition(e.target.value)} />
                            </div>
                            <div className="mb-6">
                                <TextInput type="password" placeholder="******************" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />
                            </div>
                            <div className="flex items-center justify-between">
                                {isSubmittingAdmin ? (
                                    <Button color={"green"} disabled>Adding Admin ...</Button>
                                ) : (
                                    <Button color={"green"} type='submit'>Add Admin</Button>
                                )}
                            </div>
                        </form>
                    </div>

                    <Table>
                        <Table.Head>
                            <Table.HeadCell>Full Name</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Position</Table.HeadCell>
                            <Table.HeadCell>
                                <span className="sr-only">Delete</span>
                            </Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {admins.map((admin, index) => (
                                <Table.Row key={index}>
                                    <Table.Cell>{admin.name}</Table.Cell>
                                    <Table.Cell>{admin.email}</Table.Cell>
                                    <Table.Cell>{admin.position}</Table.Cell>
                                    <Table.Cell>
                                        {isDeletingAdmin ? (
                                            <Button color={"red"} disabled>Deleting...</Button>
                                        ) : (
                                            <Button color={"red"} type='submit' onClick={() => handleDeleteAdmin(admin._id)}>Delete</Button>
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </Tabs.Item>
                <Tabs.Item title="Add Student" icon={FaGraduationCap}>
                    {/* Add Student */}
                    <div className="w-full max-w items-center justify-center">
                        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <h2 className="text-2xl font-bold mb-6">Add Student</h2>
                            <div className="mb-4">
                                <TextInput type="text" placeholder="Full Name" />
                            </div>
                            <div className="mb-4">
                                <TextInput type="email" placeholder="Email" />
                            </div>
                            <div className="mb-4">
                                <Select>
                                    <option>Mr. Teacher</option>
                                    <option>Ms. Teacher</option>
                                </Select>
                            </div>
                            <div className="mb-6">
                                <TextInput type="password" placeholder="******************" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Button color="green">Add Student</Button>
                            </div>
                        </form>
                    </div>

                    {/* List All Students */}
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>Full Name</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Teacher</Table.HeadCell>
                            <Table.HeadCell>
                                <span className="sr-only">Delete</span>
                            </Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>John Doe</Table.Cell>
                                <Table.Cell>student@email.com</Table.Cell>
                                <Table.Cell>Mr. Teacher</Table.Cell>
                                <Table.Cell>
                                    <Button color="red">Delete</Button>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Tabs.Item>
                <Tabs.Item title="Post Notification" icon={FaEnvelope}>
                    <div className="w-full max-w items-center justify-center">
                        <form action="" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <h2 className='text-2xl font-bold mb-6'>Post Notifications</h2>
                            <div className="mb-6">
                                <TextInput type='text' placeholder='Notification Content' />
                            </div>
                            <div className="flex items-center jusify-between">
                                <Button color='green'>Post Notification</Button>
                            </div>
                        </form>
                    </div>
                </Tabs.Item>
                <Tabs.Item title="Manage Profile" icon={FaUser}>
                    {/* Change Password */}
                    <div className="w-full max-w items-center justify-center">
                        <form action="" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <h2 className='text-2xl font-bold mb-6'>Change Password</h2>
                            <div className="mb-6">
                                <TextInput type='password' placeholder='Old Password' />
                            </div>
                            <div className="mb-6">
                                <TextInput type='password' placeholder='New Password' />
                            </div>
                            <div className="mb-6">
                                <TextInput type='password' placeholder='Confirm Password' />
                            </div>
                            <div className="flex items-center justify-between">
                                <Button color='green'>Change Password</Button>
                            </div>
                        </form>
                    </div>
                </Tabs.Item>
            </Tabs>
        </div>
        <Footer />
    </>
  )
}

export default Dashboard;
import React from 'react';
import { Navbar, Footer } from '@/components';
import { Tabs, TextInput, Button, Table, Select } from 'flowbite-react';
import { FaEnvelope, FaChalkboardTeacher, FaGraduationCap, FaUser } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <>
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
                        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <h2 className="text-2xl font-bold mb-6">Add Admin</h2>
                            <div className="mb-4">
                                <TextInput type="text" placeholder="Full Name" />
                            </div>
                            <div className="mb-4">
                                <TextInput type="email" placeholder="Email" />
                            </div>
                            <div className="mb-4">
                                <TextInput type="text" placeholder="Position" />
                            </div>
                            <div className="mb-6">
                                <TextInput type="password" placeholder="******************" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Button color="green">Add Admin</Button>
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
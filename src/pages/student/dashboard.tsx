import React from 'react'
import { Navbar, Footer } from '@/components';
import { Tabs, List, Card, TextInput, Button, Table } from 'flowbite-react';
import { FaEnvelope, FaBook, FaFile, FaUser } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <>
        <Navbar />
        <div className="min-h-screen flex flex-col p-5">
            <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
            <Tabs style='underline'>
                <Tabs.Item active title="Notifications" icon={FaEnvelope}>
                    <Tabs style='underline'>
                        <Tabs.Item active title="General Notifications">
                            <List>
                                <List.Item>Lorem ipsum dolor sit amet.</List.Item>
                                <List.Item>Lorem ipsum dolor sit amet.</List.Item>
                                <List.Item>Lorem ipsum dolor sit amet.</List.Item>
                            </List>
                        </Tabs.Item>
                        <Tabs.Item title="Class Notifications">
                            <List>
                                <List.Item>Lorem ipsum dolor sit amet.</List.Item>
                                <List.Item>Lorem ipsum dolor sit amet.</List.Item>
                                <List.Item>Lorem ipsum dolor sit amet.</List.Item>
                                <List.Item>Lorem ipsum dolor sit amet.</List.Item>
                                <List.Item>Lorem ipsum dolor sit amet.</List.Item>
                                <List.Item>Lorem ipsum dolor sit amet.</List.Item>
                            </List>
                        </Tabs.Item>
                    </Tabs>
                </Tabs.Item>
                <Tabs.Item title="Assignments" icon={FaBook}>
                    <div className="flex flex-wrap gap-4">
                        <Card className='max-w-sm'>
                            <span className="text-sm">Course Title</span>
                            <h5 className='text-xl font-bold'>Question 1</h5>
                            <form action="" className='flex flex-col gap-4'>
                                <TextInput type="text" placeholder='Answer' />
                                <Button color="green">Submit</Button>
                            </form>
                        </Card>

                        <Card className='max-w-sm'>
                            <span className="text-sm">Course Title</span>
                            <h5 className='text-xl font-bold'>Question 1</h5>
                            <p className='text-md'>Answer: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem, dicta!</p>
                            <span className="text-md font-bold">Score: Ungraded</span>
                        </Card>

                        <Card className='max-w-sm'>
                            <span className="text-sm">Course Title</span>
                            <h5 className='text-xl font-bold'>Question 1</h5>
                            <p className='text-md'>Answer: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem, dicta!</p>
                            <span className="text-md font-bold">Score: 70%</span>
                        </Card>

                        <Card className='max-w-sm'>
                            <span className="text-sm">Course Title</span>
                            <h5 className='text-xl font-bold'>Question 1</h5>
                            <p className='text-md'>Answer: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem, dicta!</p>
                            <span className="text-md font-bold">Score: Ungraded</span>
                        </Card>
                    </div>
                </Tabs.Item>
                <Tabs.Item title="Results" icon={FaFile} >
                    {/* Printable table shoeing results (Course Title, Score and Grade) */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xl font-bold">Result for Student Name</h2>
                        <Table>
                            <Table.Head>
                                <Table.HeadCell>Course Title</Table.HeadCell>
                                <Table.HeadCell>Score</Table.HeadCell>
                                <Table.HeadCell>Grade</Table.HeadCell>
                            </Table.Head>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>Mathematics</Table.Cell>
                                    <Table.Cell>70%</Table.Cell>
                                    <Table.Cell>B</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Physics</Table.Cell>
                                    <Table.Cell>80%</Table.Cell>
                                    <Table.Cell>A</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Chemistry</Table.Cell>
                                    <Table.Cell>90%</Table.Cell>
                                    <Table.Cell>A</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                        <Button color={"green"}>Print Result</Button>
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
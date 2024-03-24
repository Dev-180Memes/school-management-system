import React, { useState, useEffect } from 'react'
import { Navbar, Footer } from '@/components';
import { Tabs, List, Card, TextInput, Button, Table } from 'flowbite-react';
import { FaEnvelope, FaBook, FaFile, FaUser } from 'react-icons/fa';
import decodeJWT from '@/utils/decodeToken';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

interface GenNOotificationInterface {
    _id: string,
    notification: string,
    postedBy: string
}

interface ClassNotificationInterface {
    _id: string,
    notification: string,
    postedBy: string
}

interface AssignmentInterface {
    _id: string,
    courseId: {
        courseTitle: string
    },
    question: string,
}

interface IAssignmentWithSubmissions {
    _id: string;
    courseId: {
        courseTitle: string;
    };
    question: string;
    submissions: {
        answer: string;
        score?: number;
        submittedBy: {
            name: string;
        };
    }[];
}

interface ResultInterface {
    _id: string,
    courseId: {
        courseTitle: string
    },
    score: number,
    grade: string,
    comment: string
}

type HandleSubmitAnswer = (event: React.FormEvent<HTMLFormElement>, assignmentId: string) => void;

const Dashboard = () => {
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsChangingPassword(true);

        const token: string | null = localStorage.getItem("token");

        if (token) {
            const decodedToken = decodeJWT(token) as { exp: number, id?: string, name?: string, email?: string, teacherId?: string, account?: string }

            const oldPass: string = oldPassword;
            const newPass: string = newPassword;
            const confirmPass: string = confirmPassword;

            if (newPass !== confirmPass) {
                toast.error("Passwords do not match");
                return
            }

            const data = {
                oldPassword: oldPass,
                newPassword: newPass
            }

            const response = await fetch(`/api/student/IdOperations/${decodedToken.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })

            if (response.status === 200) {
                const result = await response.json();
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setIsChangingPassword(false);
                toast.success(result.message);
            } else {
                const result = await response.json();
                setIsChangingPassword(false);
                toast.error(result.message);
            }
        }
    }

    const [genNotification, setGenNotification] = useState<GenNOotificationInterface[]>([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const response = await fetch("/api/admin/notification", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.status === 200) {
                const result = await response.json();
                setGenNotification(result.notifications);
            } else {
                const result = await response.json();
                toast.error(result.message);
            }
        }

        fetchNotifications();
    }, [])

    const [classNotification, setClassNotification] = useState<ClassNotificationInterface[]>([]);

    useEffect(() => {
        const token: string | null = localStorage.getItem("token");

        if (token) {
            const decodedToken = decodeJWT(token) as { exp: number, id?: string, name?: string, email?: string, teacherId?: string, account?: string }

            const fetchNotifications = async () => {
                const response = await fetch(`/api/staff/notification/${decodedToken.teacherId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })

                if (response.status === 200) {
                    const result = await response.json();
                    setClassNotification(result.notifications);
                } else {
                    const result = await response.json();
                    toast.error(result.message);
                }
            }

            fetchNotifications();
        }
    }, [])

    const [assignments, setAssignments] = useState<AssignmentInterface[]>([]);

    useEffect(() => {
        const token: string | null = localStorage.getItem("token");

        if (token) {
            const decodedToken = decodeJWT(token) as { exp: number, id?: string, name?: string, email?: string, teacherId?: string, account?: string }

            const fetchAssignments = async () => {
                const response = await fetch(`/api/staff/assingment/${decodedToken.teacherId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (response.status === 200) {
                    const result = await response.json();
                    setAssignments(result.assignments)
                } else {
                    const result = await response.json();
                    toast.error(result.message)
                }
            }

            fetchAssignments();
        }
    }, [])

    const [assignmentsWithSubmissions, setAssignmentsWithSubmissions] = useState<IAssignmentWithSubmissions[]>([]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            const token: string | null = localStorage.getItem("token");

            if (token) {
                const decodedToken = decodeJWT(token) as { exp: number, id?: string, name?: string, email?: string, teacherId?: string, account?: string }
                
                const response = await fetch(`/api/student/submissions/${decodedToken.teacherId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (response.status === 200) {
                    const result = await response.json();
                    setAssignmentsWithSubmissions(result.submissions);
                } else {
                    const result = await response.json();
                    toast.error(result.message)
                }
            }
        }

        fetchSubmissions();
    }, [])

    const [answer, setAnswer] = useState<string>("");

    const handleSubmitAnswer: HandleSubmitAnswer = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
        e.preventDefault();
        const token: string | null = localStorage.getItem("token");

        if (token) {
            const decodedToken = decodeJWT(token) as { exp: number, id?: string, name?: string, email?: string, teacherId?: string, account?: string }

            const assignmentId: string = id;
            
            const data = {
                assignmentId,
                answer,
                submittedBy: decodedToken.id
            }

            const response = await fetch("/api/student/submissions/submissions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })

            if (response.status === 200) {
                setAnswer("");
                toast.success("Submitted Successfully")
                window.location.reload();
            } else {
                toast.error("Couldn't submit assignment")
            }
        }
    }

    const [results, setResults] = useState<ResultInterface[]>([]);

    useEffect(() => {
        const token: string | null = localStorage.getItem("token");

        if (token) {
            const decodedToken = decodeJWT(token) as { exp: number, id?: string, name?: string, email?: string, teacherId?: string, account?: string }

            const fetchResults = async () => {
                const response = await fetch(`/api/student/result/${decodedToken.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (response.status === 200) {
                    const result = await response.json();
                    setResults(result.results);
                } else {
                    const result = await response.json();
                    toast.error(result.message)
                }
            }

            fetchResults();
        }
    }, [])

  return (
    <>
        <ToastContainer />
        <Navbar />
        <div className="min-h-screen flex flex-col p-5">
            <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
            <Tabs style='underline'>
                <Tabs.Item active title="Notifications" icon={FaEnvelope}>
                    <Tabs style='underline'>
                        <Tabs.Item active title="General Notifications">
                            <List>
                                {genNotification.map((notification, index) => (
                                    <List.Item key={index}>{notification.notification}</List.Item>
                                ))}
                            </List>
                        </Tabs.Item>
                        <Tabs.Item title="Class Notifications">
                            <List>
                                {classNotification.map((notification, index) => (
                                    <List.Item key={index}>{notification.notification}</List.Item>
                                ))}
                            </List>
                        </Tabs.Item>
                    </Tabs>
                </Tabs.Item>
                <Tabs.Item title="Assignments" icon={FaBook}>
                    <div className="flex flex-wrap gap-4">
                        {assignmentsWithSubmissions.map((assignment) => {
                            // Find the user's submission for the assignment
                            const token: string | null = localStorage.getItem("token");

                            let decodedToken: { exp: number, id?: string, name?: string, email?: string, teacherId?: string, account?: string } ;

                            if (token) {
                                decodedToken = decodeJWT(token) as { exp: number, id?: string, name?: string, email?: string, teacherId?: string, account?: string }
                            }
                            const userSubmission = assignment.submissions.find(
                                (sub) => sub.submittedBy.name === decodedToken.name
                            );

                            return (
                                <Card key={assignment._id} className='max-w-sm'>
                                    <span className="text-sm">{assignment.courseId.courseTitle}</span>
                                    <h5 className='text-xl font-bold'>{assignment.question}</h5>

                                    {userSubmission ? (
                                        <>
                                            <p className='text-md'>Answer: {userSubmission.answer}</p>
                                            <span className="text-md font-bold">
                                                Score: {userSubmission.score !== undefined ? userSubmission.score : 'Ungraded'}
                                            </span>
                                        </>
                                    ) : (
                                        <form onSubmit={(e) => handleSubmitAnswer(e, assignment._id)} className='flex flex-col gap-4'>
                                            <TextInput type="text" placeholder='Your answer' value={answer} onChange={(e) => setAnswer(e.target.value)} />
                                            <Button color="green" type='submit'>Submit</Button>
                                        </form>
                                    )}
                                </Card>
                            );
                        })}
                    </div>`
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
                                {results.map((result, index) => (
                                    <Table.Row key={index}>
                                        <Table.Cell>{result.courseId.courseTitle}</Table.Cell>
                                        <Table.Cell>{result.score}%</Table.Cell>
                                        <Table.Cell>{result.grade}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                        <Button color={"green"}>Print Result</Button>
                    </div>
                </Tabs.Item>
                <Tabs.Item title="Manage Profile" icon={FaUser}>
                    {/* Change Password */}
                    <div className="w-full max-w items-center justify-center">
                        <form action="" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleChangePassword}>
                            <h2 className='text-2xl font-bold mb-6'>Change Password</h2>
                            <div className="mb-6">
                                <TextInput type='password' placeholder='Old Password' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                            </div>
                            <div className="mb-6">
                                <TextInput type='password' placeholder='New Password' value={newPassword}  onChange={(e) => setNewPassword(e.target.value)} />
                            </div>
                            <div className="mb-6">
                                <TextInput type='password' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </div>
                            <div className="flex items-center justify-between">
                                {isChangingPassword ? (
                                    <Button color='green' disabled>Changing Password...</Button>
                                ) : (
                                    <Button color='green' type='submit'>Change Password</Button>
                                )}
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
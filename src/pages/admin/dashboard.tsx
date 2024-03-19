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

interface Staff {
    _id: string,
    name: string,
    email: string,
    className: string
}

interface Student {
    _id: string,
    name: string,
    email: string,
    teacher: string
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
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
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

        const token: string | null = localStorage.getItem("token");

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
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
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

        const token: string | null = localStorage.getItem("token");
        
        const response = await fetch(`/api/admin/IdOperations/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
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

    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const token: string | null = localStorage.getItem("token");

        if (token) {
            const decodedToken = decodeJWT(token) as { exp: number, id?: string, name?: string, email?: string, position?: string, account?: string }

            const oldPass: string = oldPassword;
            const newPass: string = newPassword;
            const confirmPass: string = confirmPassword;

            if (newPass !== confirmPass) {
                toast.error("New Password and Confirm Password do not match");
                return;
            }

            const data = {
                oldPassword: oldPass,
                newPassword: newPass
            }

            const response = await fetch(`/api/admin/IdOperations/${decodedToken.id}`, {
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
                toast.success(result.message);
            } else {
                const result = await response.json();
                toast.error(result.message);
            }
        }
    }

    const [notificationContent, setNotificationContent] = useState<string>("");

    const handleNotificationPosting = async () => {
        const token: string | null = localStorage.getItem("token")

        if (token) {
            const decodedToken = decodeJWT(token) as { exp: number, id?: string, name?: string, email?: string, position?: string, account?: string }

            const notification: string = notificationContent;
            const postedBy: string | undefined = decodedToken.id;

            const data = {
                notification,
                postedBy
            }

            const response = await fetch('/api/admin/notification', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })

            if (response.status === 201) {
                const result = await response.json();
                setNotificationContent("");
                toast.success(result.message);
            } else {
                const result = await response.json();
                toast.error(result.message);
            }
        }
    }

    const [teacherName, setTeacherName] = useState<string>("");
    const [teacherEmail, setTeacherEmail] = useState<string>("");
    const [teacherClassName, setTeacherClassName] = useState<string>("");
    const [teacherPassword, setTeacherPassword] = useState<string>("");
    const [isSubmittingTeacher, setIsSubmittingTeacher] = useState<boolean>(false);
    const [isDeletingTeacher, setIsDeletingTeacher] = useState<boolean>(false);
    const [teachers, setTeachers] = useState<Staff[]>([]);

    const handleCreateTeacher = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmittingTeacher(true);

        const token: string | null = localStorage.getItem("token");

        const name: string = teacherName;
        const email: string = teacherEmail;
        const className: string = teacherClassName;
        const password: string = teacherPassword;

        const data = {
            name,
            email,
            className,
            password
        }

        const response = await fetch('/api/staff/addStaff', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })

        if (response.status === 201) {
            const result = await response.json();
            setTeachers(prev => [...prev, result.staff]);
            setIsSubmittingTeacher(false);
            setTeacherEmail("");
            setTeacherName("");
            setTeacherPassword("");
            setTeacherClassName("");
            toast.success(result.message);
        } else {
            const result = await response.json();
            setIsSubmittingTeacher(false);
            toast.error(result.message);
        }
    }

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

        // Fetch all teachers
        const fetchTeachers = async () => {
            const response = await fetch('/api/staff/addStaff', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            })

            if (response.status === 200) {
                const result = await response.json();
                setTeachers(result.staffs);
            } else {
                const result = await response.json();
                toast.error(result.message);
            }
        }

        fetchTeachers();
    
    }, [router])

    const handleDeleteTeacher = async (id: string) => {
        setIsDeletingTeacher(true);

        const token: string | null = localStorage.getItem("token");
        
        const response = await fetch(`/api/staff/IdOperations/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        if (response.status === 200) {
            const data = await response.json();
            setIsDeletingTeacher(false);
            setTeachers(prev => prev.filter(teacher => teacher._id != id));
            toast.success(data.message);
        } else {
            const data = await response.json();
            setIsDeletingTeacher(false);
            toast.error(data.message);
        }
    }

    const [studentName, setStudentName] = useState<string>("");
    const [studentEmail, setStudentEmail] = useState<string>("");
    const [studentTeacher, setStudentTeacher] = useState<string>("");
    const [studentPassword, setStudentPassword] = useState<string>("");
    const [isSubmittingStudent, setIsSubmittingStudent] = useState<boolean>(false);
    const [isDeletingStudent, setIsDeletingStudent] = useState<boolean>(false);
    const [students, setStudents] = useState<Student[]>([]);

    const handleCreateStudent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmittingStudent(true);

        const token: string | null = localStorage.getItem("token");

        const name: string = studentName;
        const email: string = studentEmail;
        const teacher: string = studentTeacher;
        const password: string = studentPassword;

        const data = {
            name,
            email,
            teacherId: teacher,
            password
        }

        const response = await fetch('/api/student/addStudent', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })

        if (response.status === 201) {
            const result = await response.json();
            setStudents(prev => [...prev, result.student]);
            setIsSubmittingStudent(false);
            setStudentEmail("");
            setStudentName("");
            setStudentPassword("");
            setStudentTeacher("");
            toast.success(result.message);
        } else {
            const result = await response.json();
            setIsSubmittingStudent(false);
            toast.error(result.message);
        }
    }

    const handleDeleteStudent = async (id: string) => {
        setIsDeletingStudent(true);

        const token: string | null = localStorage.getItem("token");
        
        const response = await fetch(`/api/student/IdOperations/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        if (response.status === 200) {
            const data = await response.json();
            setIsDeletingStudent(false);
            setStudents(prev => prev.filter(student => student._id != id));
            toast.success(data.message);
        } else {
            const data = await response.json();
            setIsDeletingStudent(false);
            toast.error(data.message);
        }
    }

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

        // Fetch all students
        const fetchStudents = async () => {
            const response = await fetch('/api/student/addStudent', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            })

            if (response.status === 200) {
                const result = await response.json();
                setStudents(result.students);
            } else {
                const result = await response.json();
                toast.error(result.message);
            }
        }

        fetchStudents();
    }, [router])

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
                        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleCreateTeacher}>
                            <h2 className="text-2xl font-bold mb-6">Add Staff</h2>
                            <div className="mb-4">
                                <TextInput type="text" placeholder="Full Name" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <TextInput type="email" placeholder="Email" value={teacherEmail} onChange={(e) => setTeacherEmail(e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <TextInput type="text" placeholder="Class Name" value={teacherClassName} onChange={(e) => setTeacherClassName(e.target.value)} />
                            </div>
                            <div className="mb-6">
                                <TextInput type="password" placeholder="******************" value={teacherPassword} onChange={(e) => setTeacherPassword(e.target.value)} />
                            </div>
                            <div className="flex items-center justify-between">
                                {isSubmittingTeacher ? (
                                    <Button color={"green"} disabled>Adding Staff ...</Button>
                                ) : (
                                    <Button color={"green"} type='submit'>Add Staff</Button>
                                )}
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
                            {teachers.map((teacher, index) => (
                                <Table.Row key={index}>
                                    <Table.Cell>{teacher.name}</Table.Cell>
                                    <Table.Cell>{teacher.email}</Table.Cell>
                                    <Table.Cell>{teacher.className}</Table.Cell>
                                    <Table.Cell>
                                        {isDeletingTeacher ? (
                                            <Button color={"red"} disabled>Deleting...</Button>
                                        ) : (
                                            <Button color={"red"} type='submit' onClick={() => handleDeleteTeacher(teacher._id)}>Delete</Button>
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
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
                        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleCreateStudent}>
                            <h2 className="text-2xl font-bold mb-6">Add Student</h2>
                            <div className="mb-4">
                                <TextInput type="text" placeholder="Full Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <TextInput type="email" placeholder="Email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <Select value={studentTeacher} onChange={(e) => setStudentTeacher(e.target.value)}>
                                    <option value="">Select Teacher</option>
                                    {/* Show all teachers */}
                                    {teachers.map((teacher, index) => (
                                        <option key={index} value={teacher._id}>{teacher.name}</option>
                                    ))}
                                </Select>
                            </div>
                            <div className="mb-6">
                                <TextInput type="password" placeholder="******************" value={studentPassword} onChange={(e) => setStudentPassword(e.target.value)} />
                            </div>
                            <div className="flex items-center justify-between">
                                {isSubmittingStudent ? (
                                    <Button color={"green"} disabled>Adding Student ...</Button>
                                ) : (
                                    <Button color={"green"} type='submit'>Add Student</Button>
                                )}
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
                            {students.map((student, index) => (
                                <Table.Row key={index}>
                                    <Table.Cell>{student.name}</Table.Cell>
                                    <Table.Cell>{student.email}</Table.Cell>
                                    <Table.Cell>{student.teacher}</Table.Cell>
                                    <Table.Cell>
                                        {isDeletingStudent ? (
                                            <Button color={"red"} disabled>Deleting...</Button>
                                        ) : (
                                            <Button color={"red"} type='submit' onClick={() => handleDeleteStudent(student._id)}>Delete</Button>
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </Tabs.Item>
                <Tabs.Item title="Post Notification" icon={FaEnvelope}>
                    <div className="w-full max-w items-center justify-center">
                        <form action="" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleNotificationPosting}>
                            <h2 className='text-2xl font-bold mb-6'>Post Notifications</h2>
                            <div className="mb-6">
                                <TextInput type='text' placeholder='Notification Content' value={notificationContent} onChange={(e) => setNotificationContent(e.target.value)} />
                            </div>
                            <div className="flex items-center jusify-between">
                                <Button color='green' type='submit'>Post Notification</Button>
                            </div>
                        </form>
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
                                <TextInput type='password' placeholder='New Password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            </div>
                            <div className="mb-6">
                                <TextInput type='password' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Button color='green' type='submit'>Change Password</Button>
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
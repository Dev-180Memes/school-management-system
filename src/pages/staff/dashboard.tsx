import React, { useState, useEffect } from 'react'
import { Navbar, Footer } from '@/components'
import { 
  Tabs, 
  TextInput, 
  Button, 
  Table, 
  Select,
  Datepicker,
  Card
} from "flowbite-react";
import { FaBook, FaFile, FaEnvelope, FaUser } from 'react-icons/fa';
import { BsBoxes, BsStar } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import decodeJWT from '@/utils/decodeToken';
import { useRouter } from 'next/router';

interface Courses {
  _id: string,
  courseTitle: string,
  teacherId: string
}

const Dashboard = () => {
  const [courseTitle, setCourseTitle] = useState<string>("");
  const [courses, setCourses] = useState<Courses[]>([]);
  const [isSubmittingCourse, setIsSubmittingCourse] = useState<boolean>(false);
  const [isDeletingCourse, setIsDeletingCourse] = useState<boolean>(false);
  const router = useRouter()

  const handleCreateCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingCourse(true)

    const token: string | null = localStorage.getItem("token");

    if (token) {
      const decodedToken = decodeJWT(token) as { exp: number, id?: string, name?: string, email?: string, position?: string, account?: string }

      const course: string = courseTitle;
      const teacherId: string | undefined = decodedToken.id;

      const data = {
        courseTitle: course,
        teacherId
      }

      const response = await fetch('/api/staff/courses', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      if (response.status === 201) {
        const result = await response.json();
        setCourseTitle("")
        setCourses(prev => [...prev, result.course]);
        setIsSubmittingCourse(false);
        toast.success(result.message);
      } else {
        const result = await response.json();
        setIsSubmittingCourse(false);
        toast.error(result.message);
      }
    }
  }

  const handleDeleteCourse = async (id: string) => {
    setIsDeletingCourse(true);

    const token: string | null = localStorage.getItem("token");

    const response = await fetch(`/api/staff/Idoperations/courses/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })

    if (response.status === 200) {
      const data = await response.json();
      setIsDeletingCourse(false);
      setCourses(prev => prev.filter(course => course._id != id));
      toast.success(data.message);
    } else {
      const data = await response.json();
      setIsDeletingCourse(false);
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

      const fetchCourse = async () => {
        const response = await fetch(`/api/staff/IdOperations/courses/${decodedToken.id}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        })

        if (response.status === 200) {
          const result = await response.json();
          setCourses(result.courses);
        } else {
          const result = await response.json();
          toast.error(result.message);
        }
      }

      fetchCourse();
    }
  }, [router])

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

      const response = await fetch(`/api/staff/IdOperations/${decodedToken.id}`, {
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

  return (
    <>
        <ToastContainer />
        <Navbar />
        <div className="flex flex-col min-h-screen p-5">
          <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>
            <Tabs style='underline'>
                <Tabs.Item active title="Manage Courses" icon={FaBook}>
                  {/* Add Course */}
                  <div className="w-full max-w items-center justify-center">
                    <form action="" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleCreateCourse}>
                      <h2 className='text-2xl font-bold mb-6'>Add Course</h2>
                      <div className="mb-6">
                        <TextInput type='text' placeholder='Course Name' value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Button color='green' type='submit'>Add Course</Button>
                      </div>
                    </form>
                  </div>

                  {/* List All Courses */}
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Course Name</Table.HeadCell>
                      <Table.HeadCell>
                        <span className="sr-only">Delete</span>
                      </Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>Mathematics</Table.Cell>
                        <Table.Cell>
                          <Button color='red'>Delete</Button>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Tabs.Item>
                <Tabs.Item title="Upload Student Result" icon={FaFile}>
                  <div className="w-full max-w items-center justify-center">
                    <form action="" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                      <h2 className='text-2xl font-bold mb-6'>Upload Student Result</h2>
                      <div className="mb-6">
                        <Select>
                          <option value='1'>John Doe</option>
                          <option value='2'>Jane Doe</option>
                        </Select>
                      </div>
                      <div className="mb-6">
                        <Select>
                          <option value='1'>Mathematics</option>
                          <option value='2'>English</option>
                        </Select>
                      </div>
                      <div className="mb-6">
                        <TextInput type='text' placeholder='Score' />
                      </div>
                      <div className="mb-6">
                        <TextInput type='text' placeholder="Teacher's Comment"/>
                      </div>
                      <div className="flex items-center justify-between">
                        <Button color='green'>Upload Result</Button>
                      </div>
                    </form>
                  </div>
                  {/* View Results in Groups Based on the Student */}
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Student Name</Table.HeadCell>
                      <Table.HeadCell>Course</Table.HeadCell>
                      <Table.HeadCell>Score</Table.HeadCell>
                      <Table.HeadCell>Grade</Table.HeadCell>
                      <Table.HeadCell>Teachers Comment</Table.HeadCell>
                      <Table.HeadCell>
                        <span className="sr-only">Delete</span>
                      </Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>John Doe</Table.Cell>
                        <Table.Cell>Mathematics</Table.Cell>
                        <Table.Cell>80</Table.Cell>
                        <Table.Cell>A</Table.Cell>
                        <Table.Cell>Good</Table.Cell>
                        <Table.Cell>
                          <Button color='red'>Delete</Button>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Tabs.Item>
                <Tabs.Item title="Add Assingment" icon={BsBoxes}>
                  <div className="w-full max-w items-center jusify-center">
                    <form action="" className="bg-white shadow-md rounded px-8 pt- pb-8 mb-4">
                      <h2 className="text-2xl font-bold mb-6">Add Assignment</h2>
                      <div className="mb-6">
                        <Select>
                          <option value="1">Course 1</option>
                          <option value="2">Course 2</option>
                        </Select>
                      </div>
                      <div className="mb-6">
                        <TextInput type='text' placeholder='Assignment Question' />
                      </div>
                      <div className="mb-6">
                        <Datepicker />
                      </div>
                      <div className="mb-6">
                        <Button color={"green"}>Create Assingment</Button>
                      </div>
                    </form>
                  </div>
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Course Title</Table.HeadCell>
                      <Table.HeadCell>Question</Table.HeadCell>
                      <Table.HeadCell>Due Date</Table.HeadCell>
                      <Table.HeadCell>
                        <span className="sr-only">Delete</span>
                      </Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>Cuorse 1</Table.Cell>
                        <Table.Cell>Question 1</Table.Cell>
                        <Table.Cell>Today</Table.Cell>
                        <Table.Cell>
                          <Button color={"red"}>Delete</Button>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Tabs.Item>
                <Tabs.Item title="Grade Assingment" icon={BsStar}>
                  {/* Show Individual submissions as cards. If the submission has being scored show the score if not show a form to grade it */}
                  <div className="flex flex-row gap-4 flex-wrap">
                    <Card className='max-w-sm'>
                      <h5 className='text-xl font-bold'>Question 1</h5>
                      <span className="text-sm font-semibold">Student Name</span>
                      <p className='text-l'>Answer: Lorem ipsum, dolor sit amet consectetur adipisicing elit. Itaque illum aliquid quis eveniet consectetur tenetur ex, modi neque voluptates sunt?</p>
                      <span className="text-md font-semibold">Score: 70%</span>
                    </Card>

                    <Card className='max-w-sm'>
                      <h5 className='text-xl font-bold'>Question 1</h5>
                      <span className="text-sm font-semibold">Student Name</span>
                      <p className='text-l'>Answer: Lorem ipsum, dolor sit amet consectetur adipisicing elit. Itaque illum aliquid quis eveniet consectetur tenetur ex, modi neque voluptates sunt?</p>
                      {/* <span className="text-md font-semibold">Score: 70%</span> */}
                      <form action="" className='flex flex-row gap-2'>
                        <TextInput type='text' placeholder='Score' />
                        <Button color={"green"}>Grade</Button>
                      </form>
                    </Card>

                    <Card className='max-w-sm'>
                      <h5 className='text-xl font-bold'>Question 1</h5>
                      <span className="text-sm font-semibold">Student Name</span>
                      <p className='text-l'>Answer: Lorem ipsum, dolor sit amet consectetur adipisicing elit. Itaque illum aliquid quis eveniet consectetur tenetur ex, modi neque voluptates sunt?</p>
                      {/* <span className="text-md font-semibold">Score: 70%</span> */}
                      <form action="" className='flex flex-row gap-2'>
                        <TextInput type='text' placeholder='Score' />
                        <Button color={"green"}>Grade</Button>
                      </form>
                    </Card>

                    <Card className='max-w-sm'>
                      <h5 className='text-xl font-bold'>Question 1</h5>
                      <span className="text-sm font-semibold">Student Name</span>
                      <p className='text-l'>Answer: Lorem ipsum, dolor sit amet consectetur adipisicing elit. Itaque illum aliquid quis eveniet consectetur tenetur ex, modi neque voluptates sunt?</p>
                      {/* <span className="text-md font-semibold">Score: 70%</span> */}
                      <form action="" className='flex flex-row gap-2'>
                        <TextInput type='text' placeholder='Score' />
                        <Button color={"green"}>Grade</Button>
                      </form>
                    </Card>
                  </div>
                </Tabs.Item>
                <Tabs.Item title="Post Notifications" icon={FaEnvelope}>
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
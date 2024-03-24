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

interface StudentInterface {
  _id: string,
  name: string,
  email: string,
  teacher: string
}

interface ResultInterface {
  _id: string,
  courseTitle: string,
  studentName: string,
  score: number,
  grade: string,
  comment: string
}

interface AssingmentInterface {
  _id: string,
  courseId: {
    courseTitle: string
  },
  question: string
}

const Dashboard = () => {
  const [students, setStudents] = useState<StudentInterface[]>([]);
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
      const decodedToken = decodeJWT(token) as { exp: number, id?: string, name?: string, email?: string, className?: string, account?: string }

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

    const response = await fetch(`/api/staff/IdOperations/courses/${id}`, {
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
      router.push("/staff/login");
    } else if (token) {
      const decodedToken = decodeJWT(token) as { exp: number, id?: string, name?: string, email?: string, className?: string, account?: string }

      if (decodedToken.account !== "staff") {
        toast.error("You are not authorized to view this page");
        router.push("/staff/login");
      }

      if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("token")
        toast.error("Token has expired, Please Login");
        router.push("/staff/login");
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

      const fetchStudents = async () => {
        const response = await fetch(`/api/student/IdOperations/${decodedToken.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        })

        if (response.status === 200) {
          const result = await response.json();
          setStudents(result.students);
        } else {
          const result = await response.json();
          toast.error(result.message);
        }
      }

      fetchCourse();
      fetchStudents();
    }
  }, [router])

  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsChangingPassword(true);

    const token: string | null = localStorage.getItem("token");

    if (token) {
      const decodedToken = decodeJWT(token) as { exp: number, id?: string, name?: string, email?: string, className?: string, account?: string }

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
        setIsChangingPassword(false);
        toast.success(result.message);
      } else {
        const result = await response.json();
        setIsChangingPassword(false);
        toast.error(result.message);
      }
    }
  }

  const [notificationContent, setNotificationContent] = useState<string>("");
  const [isPostingNotification, setIsPostingNotification] = useState<boolean>(false);

  const handleNotificationPosting = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPostingNotification(true);

    const token: string | null = localStorage.getItem("token")

    if (token) {
      const decodedToken = decodeJWT(token) as { exp: number, id?: string, name?: string, email?: string, className?: string, account?: string }

      const notification: string = notificationContent;
      const postedBy: string | undefined = decodedToken.id;

      const data = {
        notification,
        postedBy
      }

      const response = await fetch('/api/staff/notification/send', {
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
        setIsPostingNotification(false);
        toast.success(result.message);
      } else {
        const result = await response.json();
        setIsPostingNotification(false);
        toast.error(result.message);
      }
    }
  }

  const [resultCourseId, setResultCourseId] = useState<string>("");
  const [resultStudentId, setResultStudentId] = useState<string>("");
  const [resultScore, setResultScore] = useState<string>("");
  const [resultComment, setResultComment] = useState<string>("");
  const [isUploadingResult, setIsUploadingResult] = useState<boolean>(false);
  const [results, setResults] = useState<ResultInterface[]>([]);

  const handleResultUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploadingResult(true);

    const token: string | null = localStorage.getItem("token")

    if (token) {
      const courseId: string = resultCourseId;
      const studentId: string = resultStudentId;
      const score: number = parseInt(resultScore);
      const comment: string = resultComment;

      const data = {
        courseId,
        studentId,
        score,
        comment
      }

      const response = await fetch('/api/staff/result/result', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      if (response.status === 201) {
        const result = await response.json();
        setResultCourseId("");
        setResultStudentId("");
        setResultScore("");
        setResultComment("");
        setIsUploadingResult(false);
        setResults(prev => [...prev, result.student])
        toast.success(result.message);
      } else {
        const result = await response.json();
        setIsUploadingResult(false);
        toast.error(result.message);
      }
    }
  }

  useEffect(() => {
    const token: string | null = localStorage.getItem("token");

    if (token) {
      const decodedToken = decodeJWT(token) as { exp: number, id?: string, name?: string, email?: string, className?: string, account?: string }

      const fetchResults = async () => {
        const response = await fetch(`/api/staff/result/${decodedToken.id}`, {
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
  }, []);

  const [assignmentCourseId, setAssignmentCourseId] = useState<string>("");
  const [assignmentQuestion, setAssignmentQuestion] = useState<string>("");
  const [isUploadingAssignment, setIsUploadingAssignment] = useState<boolean>(false);
  const [assignments, setAssignments] = useState<AssingmentInterface[]>([]);
  const [isDeletingAssignment, setIsDeletingAssignment] = useState<boolean>(false);

  const handleAssignmentUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploadingAssignment(true);

    const token: string | null = localStorage.getItem("token");

    if (token) {
      const courseId: string = assignmentCourseId;
      const question: string = assignmentQuestion;

      const data = {
        courseId,
        question,
      }

      const response = await fetch('/api/staff/assingment/add', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      if (response.status === 201) {
        const result = await response.json();
        setAssignmentCourseId("");
        setAssignmentQuestion("");
        setIsUploadingAssignment(false);
        setAssignments(prev => [...prev, result.result]);
        toast.success(result.message);
      } else {
        const result = await response.json();
        setIsUploadingAssignment(false);
        toast.error(result.message);
      }
    }
  }

  const handleAssignmentDelete = async (id: string) => {
    setIsDeletingAssignment(true);

    const token: string | null = localStorage.getItem("token");

    const response = await fetch(`/api/staff/assingment/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })

    if (response.status === 200) {
      const result = await response.json();
      setIsDeletingAssignment(false);
      setAssignments(prev => prev.filter(assignment => assignment._id != id));
      toast.success(result.message);
    } else {
      const result = await response.json();
      setIsDeletingAssignment(false);
      toast.error(result.message);
    }
  }

  useEffect(() => {
    const token: string | null = localStorage.getItem("token");

    if (token) {
      const decodedToken = decodeJWT(token) as { exp: number, id?: string, name?: string, email?: string, className?: string, account?: string }

      const fetchAssignments = async () => {
        const response = await fetch(`/api/staff/assingment/${decodedToken.id}`, {
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
          toast.error(result.message);
        }
      }
      
      fetchAssignments();
    }
  }, []);

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
                        {isSubmittingCourse ? (
                          <Button color='green' disabled>Adding...</Button>
                        ) : (
                          <Button color='green' type='submit'>Add Course</Button>
                        )}
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
                      {courses.map(course => (
                        <Table.Row key={course._id}>
                          <Table.Cell>{course.courseTitle}</Table.Cell>
                          <Table.Cell>
                            {isDeletingCourse ? (
                              <Button color='red' disabled>Deleting...</Button>
                            ) : (
                              <Button color='red' onClick={() => handleDeleteCourse(course._id)}>Delete</Button>
                            )}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </Tabs.Item>
                <Tabs.Item title="Upload Student Result" icon={FaFile}>
                  <div className="w-full max-w items-center justify-center">
                    <form action="" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleResultUpload} >
                      <h2 className='text-2xl font-bold mb-6'>Upload Student Result</h2>
                      <div className="mb-6">
                        <Select value={resultStudentId} onChange={(e) => setResultStudentId(e.target.value)}>
                          <option value="">Select Student</option>
                          {students.map(student => (
                            <option key={student._id} value={student._id}>{student.name}</option>
                          ))}
                        </Select>
                      </div>
                      <div className="mb-6">
                        <Select value={resultCourseId} onChange={(e) => setResultCourseId(e.target.value)}>
                          <option value="">Select Course</option>
                          {courses.map(course => (
                            <option key={course._id} value={course._id}>{course.courseTitle}</option>
                          ))}
                        </Select>
                      </div>
                      <div className="mb-6">
                        <TextInput type='text' placeholder='Score' value={resultScore} onChange={(e) => setResultScore(e.target.value)} />
                      </div>
                      <div className="mb-6">
                        <TextInput type='text' placeholder="Teacher's Comment" value={resultComment} onChange={(e) => setResultComment(e.target.value)}/>
                      </div>
                      <div className="flex items-center justify-between">
                        {isUploadingResult ? (
                          <Button disabled color="green">Uploading...</Button>
                        ) : (
                          <Button color="green" type='submit'>Upload Result</Button>
                        )}
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
                      {results.map(result => (
                        <Table.Row key={result._id}>
                          <Table.Cell>{result.studentName}</Table.Cell>
                          <Table.Cell>{result.courseTitle}</Table.Cell>
                          <Table.Cell>{result.score}</Table.Cell>
                          <Table.Cell>{result.grade}</Table.Cell>
                          <Table.Cell>{result.comment}</Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </Tabs.Item>
                <Tabs.Item title="Add Assingment" icon={BsBoxes}>
                  <div className="w-full max-w items-center jusify-center">
                    <form action="" className="bg-white shadow-md rounded px-8 pt- pb-8 mb-4" onSubmit={handleAssignmentUpload} >
                      <h2 className="text-2xl font-bold mb-6">Add Assignment</h2>
                      <div className="mb-6">
                        <Select value={assignmentCourseId} onChange={(e) => setAssignmentCourseId(e.target.value)}>
                          <option value="">Select Course</option>
                          {courses.map(course => (
                            <option key={course._id} value={course._id}>{course.courseTitle}</option>
                          ))}
                        </Select>
                      </div>
                      <div className="mb-6">
                        <TextInput type='text' placeholder='Assignment Question' value={assignmentQuestion} onChange={(e) => setAssignmentQuestion(e.target.value)} />
                      </div>
                      <div className="mb-6">
                        {isUploadingAssignment ? (
                          <Button color={"green"} disabled>Uploading...</Button>
                        ) : (
                          <Button color={"green"} type='submit'>Upload Assignment</Button>
                        )}
                      </div>
                    </form>
                  </div>
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Course Title</Table.HeadCell>
                      <Table.HeadCell>Question</Table.HeadCell>
                      <Table.HeadCell>
                        <span className="sr-only">Delete</span>
                      </Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                    {assignments.map((assignment, index) => (
                      <Table.Row key={index}>
                        <Table.Cell>{assignment.courseId.courseTitle}</Table.Cell>
                        <Table.Cell>{assignment.question}</Table.Cell>
                        <Table.Cell>
                          {isDeletingAssignment ? (
                            <Button color={"green"} disabled>Deleting...</Button>
                          ) : (
                            <Button color="green" onClick={() => handleAssignmentDelete(assignment._id)}>Delete</Button>
                          )}
                        </Table.Cell>
                      </Table.Row>
                    ))}
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
                    <form action="" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleNotificationPosting}>
                      <h2 className='text-2xl font-bold mb-6'>Post Notifications</h2>
                      <div className="mb-6">
                        <TextInput type='text' placeholder='Notification Content' value={notificationContent} onChange={(e) => setNotificationContent(e.target.value)} />
                      </div>
                      <div className="flex items-center jusify-between">
                        {isPostingNotification ? (
                          <Button disabled color={'green'}>Posting...</Button>
                        ) : (
                          <Button color={"green"} type='submit'>Post Notification</Button>
                        )}
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
                        {isChangingPassword ? (
                          <Button color='green' disabled>Changing...</Button>
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
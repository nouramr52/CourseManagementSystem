import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/shared/Navbar/Navbar'
import Footer from '../../components/shared/Footer/Footer'
import './CourseDetails.css'

export default function CourseDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)

  // Sample course data (in a real app, this would come from an API or state management)
  const coursesData = {
    1: {
      id: 1,
      name: 'Database Systems',
      instructor: 'Dr. Sarah Johnson',
      progress: 75,
      schedule: 'Mon / Wed',
      time: '10:00 AM',
      color: '#4f46e5',
      assignments: 8,
      completedAssignments: 6,
      nextClass: 'Monday, 10:00 AM',
      description: 'Comprehensive course covering database design, SQL, normalization, and data management principles.',
      modules: 12,
      completedModules: 9,
      syllabus: [
        { id: 1, title: 'Introduction to Databases', completed: true, duration: '2 weeks' },
        { id: 2, title: 'Relational Model', completed: true, duration: '2 weeks' },
        { id: 3, title: 'SQL Fundamentals', completed: true, duration: '3 weeks' },
        { id: 4, title: 'Advanced SQL', completed: true, duration: '2 weeks' },
        { id: 5, title: 'Database Design', completed: true, duration: '3 weeks' },
        { id: 6, title: 'Normalization', completed: true, duration: '2 weeks' },
        { id: 7, title: 'Transactions', completed: true, duration: '2 weeks' },
        { id: 8, title: 'Indexing', completed: true, duration: '2 weeks' },
        { id: 9, title: 'Query Optimization', completed: true, duration: '2 weeks' },
        { id: 10, title: 'NoSQL Databases', completed: false, duration: '2 weeks' },
        { id: 11, title: 'Database Security', completed: false, duration: '2 weeks' },
        { id: 12, title: 'Final Project', completed: false, duration: '3 weeks' }
      ],
      assignments: [
        { id: 1, title: 'ER Diagram Design', dueDate: 'Completed', status: 'completed', grade: '95%' },
        { id: 2, title: 'SQL Queries Practice', dueDate: 'Completed', status: 'completed', grade: '88%' },
        { id: 3, title: 'Database Normalization', dueDate: 'Completed', status: 'completed', grade: '92%' },
        { id: 4, title: 'Transaction Management', dueDate: 'Completed', status: 'completed', grade: '90%' },
        { id: 5, title: 'Index Optimization', dueDate: 'Completed', status: 'completed', grade: '85%' },
        { id: 6, title: 'Query Performance', dueDate: 'Completed', status: 'completed', grade: '93%' },
        { id: 7, title: 'NoSQL Implementation', dueDate: 'Dec 15, 2024', status: 'pending', grade: '-' },
        { id: 8, title: 'Final Database Project', dueDate: 'Dec 22, 2024', status: 'pending', grade: '-' }
      ],
      materials: [
        { id: 1, title: 'Course Syllabus', type: 'PDF', size: '245 KB' },
        { id: 2, title: 'Lecture Slides - Week 1-4', type: 'PDF', size: '3.2 MB' },
        { id: 3, title: 'SQL Reference Guide', type: 'PDF', size: '1.8 MB' },
        { id: 4, title: 'Database Design Tutorial', type: 'Video', size: '125 MB' },
        { id: 5, title: 'Practice Exercises', type: 'ZIP', size: '450 KB' }
      ]
    },
    2: {
      id: 2,
      name: 'Software Engineering',
      instructor: 'Prof. Michael Chen',
      progress: 60,
      schedule: 'Tue / Thu',
      time: '1:00 PM',
      color: '#06b6d4',
      description: 'Learn software development lifecycle, agile methodologies, and best practices for building scalable applications.',
      modules: 15,
      completedModules: 9,
      syllabus: [
        { id: 1, title: 'Introduction to Software Engineering', completed: true, duration: '1 week' },
        { id: 2, title: 'SDLC Models', completed: true, duration: '2 weeks' },
        { id: 3, title: 'Agile Methodology', completed: true, duration: '2 weeks' },
        { id: 4, title: 'Requirements Engineering', completed: true, duration: '2 weeks' },
        { id: 5, title: 'System Design', completed: true, duration: '3 weeks' },
        { id: 6, title: 'Design Patterns', completed: true, duration: '2 weeks' },
        { id: 7, title: 'Testing Strategies', completed: true, duration: '2 weeks' },
        { id: 8, title: 'CI/CD', completed: true, duration: '2 weeks' },
        { id: 9, title: 'Code Quality', completed: true, duration: '1 week' },
        { id: 10, title: 'Version Control', completed: false, duration: '1 week' },
        { id: 11, title: 'DevOps Practices', completed: false, duration: '2 weeks' },
        { id: 12, title: 'Microservices', completed: false, duration: '2 weeks' },
        { id: 13, title: 'Security Best Practices', completed: false, duration: '2 weeks' },
        { id: 14, title: 'Project Management', completed: false, duration: '2 weeks' },
        { id: 15, title: 'Capstone Project', completed: false, duration: '4 weeks' }
      ],
      assignments: [
        { id: 1, title: 'SDLC Analysis', dueDate: 'Completed', status: 'completed', grade: '90%' },
        { id: 2, title: 'Agile Sprint Planning', dueDate: 'Completed', status: 'completed', grade: '87%' },
        { id: 3, title: 'Requirements Document', dueDate: 'Completed', status: 'completed', grade: '92%' },
        { id: 4, title: 'System Architecture', dueDate: 'Completed', status: 'completed', grade: '88%' },
        { id: 5, title: 'Design Patterns Implementation', dueDate: 'Completed', status: 'completed', grade: '85%' },
        { id: 6, title: 'Unit Testing', dueDate: 'Completed', status: 'completed', grade: '91%' },
        { id: 7, title: 'CI/CD Pipeline', dueDate: 'Dec 18, 2024', status: 'pending', grade: '-' },
        { id: 8, title: 'Code Review', dueDate: 'Dec 20, 2024', status: 'pending', grade: '-' },
        { id: 9, title: 'DevOps Implementation', dueDate: 'Dec 25, 2024', status: 'pending', grade: '-' },
        { id: 10, title: 'Final Project', dueDate: 'Jan 5, 2025', status: 'pending', grade: '-' }
      ],
      materials: [
        { id: 1, title: 'Course Overview', type: 'PDF', size: '180 KB' },
        { id: 2, title: 'Agile Handbook', type: 'PDF', size: '2.1 MB' },
        { id: 3, title: 'Design Patterns Guide', type: 'PDF', size: '4.5 MB' },
        { id: 4, title: 'Testing Best Practices', type: 'Video', size: '98 MB' }
      ]
    },
    3: {
      id: 3,
      name: 'Operating Systems',
      instructor: 'Dr. Emily Rodriguez',
      progress: 45,
      schedule: 'Mon / Fri',
      time: '3:00 PM',
      color: '#10b981',
      description: 'Explore OS concepts including processes, threads, memory management, and file systems.',
      modules: 10,
      completedModules: 4,
      syllabus: [
        { id: 1, title: 'OS Introduction', completed: true, duration: '1 week' },
        { id: 2, title: 'Process Management', completed: true, duration: '2 weeks' },
        { id: 3, title: 'Threads', completed: true, duration: '2 weeks' },
        { id: 4, title: 'CPU Scheduling', completed: true, duration: '2 weeks' },
        { id: 5, title: 'Synchronization', completed: false, duration: '2 weeks' },
        { id: 6, title: 'Deadlocks', completed: false, duration: '2 weeks' },
        { id: 7, title: 'Memory Management', completed: false, duration: '3 weeks' },
        { id: 8, title: 'Virtual Memory', completed: false, duration: '2 weeks' },
        { id: 9, title: 'File Systems', completed: false, duration: '2 weeks' },
        { id: 10, title: 'I/O Systems', completed: false, duration: '2 weeks' }
      ],
      assignments: [
        { id: 1, title: 'Process Simulation', dueDate: 'Completed', status: 'completed', grade: '89%' },
        { id: 2, title: 'Thread Programming', dueDate: 'Completed', status: 'completed', grade: '92%' },
        { id: 3, title: 'Scheduling Algorithms', dueDate: 'Completed', status: 'completed', grade: '86%' },
        { id: 4, title: 'Synchronization Project', dueDate: 'Dec 16, 2024', status: 'pending', grade: '-' },
        { id: 5, title: 'Deadlock Detection', dueDate: 'Dec 23, 2024', status: 'pending', grade: '-' },
        { id: 6, title: 'Memory Allocator', dueDate: 'Jan 8, 2025', status: 'pending', grade: '-' }
      ],
      materials: [
        { id: 1, title: 'OS Concepts Textbook', type: 'PDF', size: '12.5 MB' },
        { id: 2, title: 'Lecture Notes', type: 'PDF', size: '3.8 MB' },
        { id: 3, title: 'Lab Exercises', type: 'ZIP', size: '850 KB' }
      ]
    },
    4: {
      id: 4,
      name: 'Web Development',
      instructor: 'Prof. David Kim',
      progress: 90,
      schedule: 'Wed / Fri',
      time: '11:00 AM',
      color: '#8b5cf6',
      description: 'Master modern web technologies including HTML, CSS, JavaScript, React, and Node.js.',
      modules: 14,
      completedModules: 13,
      syllabus: [
        { id: 1, title: 'HTML Fundamentals', completed: true, duration: '1 week' },
        { id: 2, title: 'CSS Styling', completed: true, duration: '2 weeks' },
        { id: 3, title: 'JavaScript Basics', completed: true, duration: '2 weeks' },
        { id: 4, title: 'DOM Manipulation', completed: true, duration: '1 week' },
        { id: 5, title: 'ES6+ Features', completed: true, duration: '2 weeks' },
        { id: 6, title: 'React Fundamentals', completed: true, duration: '2 weeks' },
        { id: 7, title: 'React Hooks', completed: true, duration: '2 weeks' },
        { id: 8, title: 'State Management', completed: true, duration: '2 weeks' },
        { id: 9, title: 'React Router', completed: true, duration: '1 week' },
        { id: 10, title: 'Node.js Basics', completed: true, duration: '2 weeks' },
        { id: 11, title: 'Express.js', completed: true, duration: '2 weeks' },
        { id: 12, title: 'REST APIs', completed: true, duration: '2 weeks' },
        { id: 13, title: 'Authentication', completed: true, duration: '2 weeks' },
        { id: 14, title: 'Full Stack Project', completed: false, duration: '3 weeks' }
      ],
      assignments: [
        { id: 1, title: 'Portfolio Website', dueDate: 'Completed', status: 'completed', grade: '95%' },
        { id: 2, title: 'JavaScript Calculator', dueDate: 'Completed', status: 'completed', grade: '93%' },
        { id: 3, title: 'Todo App with React', dueDate: 'Completed', status: 'completed', grade: '97%' },
        { id: 4, title: 'E-commerce UI', dueDate: 'Completed', status: 'completed', grade: '91%' },
        { id: 5, title: 'Blog with React Router', dueDate: 'Completed', status: 'completed', grade: '94%' },
        { id: 6, title: 'REST API Server', dueDate: 'Completed', status: 'completed', grade: '89%' },
        { id: 7, title: 'User Authentication', dueDate: 'Completed', status: 'completed', grade: '96%' },
        { id: 8, title: 'Social Media App', dueDate: 'Completed', status: 'completed', grade: '92%' },
        { id: 9, title: 'Real-time Chat', dueDate: 'Completed', status: 'completed', grade: '90%' },
        { id: 10, title: 'Payment Integration', dueDate: 'Completed', status: 'completed', grade: '88%' },
        { id: 11, title: 'Deployment & Hosting', dueDate: 'Completed', status: 'completed', grade: '94%' },
        { id: 12, title: 'Final Capstone Project', dueDate: 'Dec 20, 2024', status: 'pending', grade: '-' }
      ],
      materials: [
        { id: 1, title: 'Web Dev Roadmap', type: 'PDF', size: '320 KB' },
        { id: 2, title: 'React Documentation', type: 'PDF', size: '5.2 MB' },
        { id: 3, title: 'Node.js Guide', type: 'PDF', size: '2.8 MB' },
        { id: 4, title: 'Project Templates', type: 'ZIP', size: '1.2 MB' },
        { id: 5, title: 'Video Tutorials', type: 'Link', size: 'Online' }
      ]
    }
  }

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    // Get course data
    const courseData = coursesData[id]
    if (courseData) {
      setCourse(courseData)
    } else {
      navigate('/dashboard')
    }
  }, [id, navigate])

  if (!course) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <main className="course-details">
        <div className="course-details__container">
          {/* Header */}
          <div className="course-details__header">
            <button className="course-details__back" onClick={() => navigate('/dashboard')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>

            <div className="course-details__hero">
              <div className="course-details__hero-content">
                <div className="course-details__icon" style={{ background: `${course.color}15`, color: course.color }}>
                  📖
                </div>
                <div>
                  <h1 className="course-details__title">{course.name}</h1>
                  <p className="course-details__instructor">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    {course.instructor}
                  </p>
                  <p className="course-details__description">{course.description}</p>
                </div>
              </div>

              <div className="course-details__hero-stats">
                <div className="course-details__stat-card">
                  <span className="course-details__stat-value">{course.progress}%</span>
                  <span className="course-details__stat-label">Progress</span>
                </div>
                <div className="course-details__stat-card">
                  <span className="course-details__stat-value">{course.completedModules}/{course.modules}</span>
                  <span className="course-details__stat-label">Modules</span>
                </div>
                <div className="course-details__stat-card">
                  <span className="course-details__stat-value">{course.completedAssignments}/{course.assignments.length}</span>
                  <span className="course-details__stat-label">Assignments</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="course-details__progress">
              <div className="course-details__progress-label">
                <span>Overall Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="course-details__progress-bar">
                <div 
                  className="course-details__progress-fill" 
                  style={{ width: `${course.progress}%`, background: course.color }}
                />
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="course-details__grid">
            {/* Syllabus */}
            <div className="course-details__section">
              <h2 className="course-details__section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                Course Syllabus
              </h2>
              <div className="syllabus-list">
                {course.syllabus.map((module, index) => (
                  <div key={module.id} className={`syllabus-item ${module.completed ? 'syllabus-item--completed' : ''}`}>
                    <div className="syllabus-item__number">{index + 1}</div>
                    <div className="syllabus-item__content">
                      <h3 className="syllabus-item__title">{module.title}</h3>
                      <p className="syllabus-item__duration">{module.duration}</p>
                    </div>
                    <div className="syllabus-item__status">
                      {module.completed ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignments */}
            <div className="course-details__section">
              <h2 className="course-details__section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Assignments
              </h2>
              <div className="assignments-list">
                {course.assignments.map((assignment) => (
                  <div key={assignment.id} className={`assignment-item assignment-item--${assignment.status}`}>
                    <div className="assignment-item__header">
                      <h3 className="assignment-item__title">{assignment.title}</h3>
                      <span className={`assignment-item__badge assignment-item__badge--${assignment.status}`}>
                        {assignment.status === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                    <div className="assignment-item__footer">
                      <span className="assignment-item__due">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {assignment.dueDate}
                      </span>
                      <span className="assignment-item__grade">
                        Grade: <strong>{assignment.grade}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Materials */}
            <div className="course-details__section">
              <h2 className="course-details__section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                  <polyline points="13 2 13 9 20 9" />
                </svg>
                Course Materials
              </h2>
              <div className="materials-list">
                {course.materials.map((material) => (
                  <div key={material.id} className="material-item">
                    <div className="material-item__icon">
                      {material.type === 'PDF' && '📄'}
                      {material.type === 'Video' && '🎥'}
                      {material.type === 'ZIP' && '📦'}
                      {material.type === 'Link' && '🔗'}
                    </div>
                    <div className="material-item__info">
                      <h3 className="material-item__title">{material.title}</h3>
                      <p className="material-item__meta">{material.type} • {material.size}</p>
                    </div>
                    <button className="material-item__download">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

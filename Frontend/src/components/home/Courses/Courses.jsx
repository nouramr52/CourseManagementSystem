import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CourseCard from '../../shared/CourseCard/CourseCard'
import { getAllCourses } from '../../../api/courseApi'
import './Courses.css'

export default function Courses() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllCourses()
      .then(res => setCourses(res.data.slice(0, 6))) // show first 6 on landing
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="courses" id="courses">
      <div className="courses__container">
        <div className="section-header">
          <span className="section-tag">Course Catalog</span>
          <h2 className="section-title">Browse available courses</h2>
          <p className="section-subtitle">
            View course schedules, available seats, and instructor details.
            Login or create an account to enroll.
          </p>
        </div>

        {loading ? (
          <div className="courses__loading">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="courses__skeleton" />
            ))}
          </div>
        ) : (
          <div className="courses__grid">
            {courses.map((course, idx) => (
              <CourseCard
                key={course.id}
                course={course}
                idx={idx}
                isGuest={true}
              />
            ))}
          </div>
        )}

        <div className="courses__footer">
          <button className="courses__view-all" onClick={() => navigate('/courses')}>
            View Full Catalog
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

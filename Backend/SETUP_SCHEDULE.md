# Schedule System Setup Guide

## ✅ What Was Created

### Backend Files
1. **Routes**: `src/routes/scheduleRoutes.js`
2. **Controller**: `src/controllers/scheduleController.js`
3. **Service**: `src/services/scheduleService.js`
4. **Repository**: `src/repositories/scheduleRepo.js`

### Features
- ✅ Get student schedule based on enrolled courses
- ✅ Get instructor schedule based on taught courses
- ✅ Check for schedule conflicts before enrolling
- ✅ Create/Update/Delete course schedules (instructor/admin)
- ✅ Automatic schedule sorting by day and time
- ✅ Time validation and conflict detection

---

## 🚀 Quick Start

### 1. The Schedule table already exists in your Prisma schema
No migration needed! The `Schedule` model is already defined.

### 2. Start the Backend
```bash
cd Backend
npm start
```

### 3. Test the API

#### Get My Schedule (Student)
```bash
curl http://localhost:5000/api/schedules/my \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create a Schedule (Instructor/Admin)
```bash
curl -X POST http://localhost:5000/api/schedules/course/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "day": "Monday",
    "startTime": "10:00",
    "endTime": "11:30",
    "room": "Room 101"
  }'
```

#### Check for Conflicts (Student)
```bash
curl -X POST http://localhost:5000/api/schedules/check-conflicts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"courseId": 5}'
```

---

## 📊 How It Works

### For Students
1. **Enroll in a course** → Schedule automatically shows course times
2. **View schedule** → GET `/api/schedules/my`
3. **Check conflicts** → POST `/api/schedules/check-conflicts` before enrolling

### For Instructors
1. **Create course schedule** → POST `/api/schedules/course/:courseId`
2. **View my teaching schedule** → GET `/api/schedules/my`
3. **Update schedule** → PUT `/api/schedules/:scheduleId`
4. **Delete schedule** → DELETE `/api/schedules/:scheduleId`

### For Admins
1. **View all schedules** → GET `/api/schedules/all`
2. **Manage any schedule** → Full CRUD access

---

## 🔗 Integration with Enrollment

The schedule system automatically integrates with enrollments:

```javascript
// When a student enrolls in a course
POST /api/enrollments/:courseId

// Their schedule automatically includes the course times
GET /api/schedules/my
// Returns all schedules from enrolled courses
```

---

## 📝 API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/schedules/my` | All | Get my schedule |
| POST | `/api/schedules/check-conflicts` | Student | Check conflicts |
| GET | `/api/schedules/all` | Admin | Get all schedules |
| POST | `/api/schedules/course/:courseId` | Instructor/Admin | Create schedule |
| PUT | `/api/schedules/:scheduleId` | Instructor/Admin | Update schedule |
| DELETE | `/api/schedules/:scheduleId` | Instructor/Admin | Delete schedule |

---

## 🎯 Example Workflow

### Student Enrolling in a Course

```javascript
// 1. Check for conflicts first
const conflictCheck = await fetch('/api/schedules/check-conflicts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ courseId: 5 })
});

const { hasConflicts, conflicts } = await conflictCheck.json();

if (hasConflicts) {
  // Show warning to user
  alert(`Warning: This course conflicts with ${conflicts[0].existingCourse.title}`);
}

// 2. If user confirms, enroll
const enrollment = await fetch('/api/enrollments/5', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// 3. Get updated schedule
const schedule = await fetch('/api/schedules/my', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const mySchedule = await schedule.json();
// Now includes the new course's schedule
```

---

## 🗓️ Schedule Data Format

```javascript
{
  "id": 1,
  "day": "Monday",           // Full day name
  "startTime": "10:00",      // 24-hour format HH:MM
  "endTime": "11:30",        // 24-hour format HH:MM
  "room": "Room 101",        // Optional
  "courseId": 5,
  "course": {
    "id": 5,
    "title": "Database Systems",
    "icon": "🗄️",
    "instructor": {
      "id": 2,
      "name": "Dr. Sarah Johnson"
    }
  }
}
```

---

## ✨ Features

### Automatic Sorting
Schedules are automatically sorted by:
1. Day of week (Monday → Sunday)
2. Start time (earliest → latest)

### Conflict Detection
- Checks if two time slots overlap on the same day
- Prevents double-booking
- Shows which courses conflict

### Time Validation
- Validates HH:MM format
- Ensures end time > start time
- Prevents invalid time entries

### Role-Based Access
- Students: Read-only access to their schedule
- Instructors: Manage schedules for their courses
- Admins: Full access to all schedules

---

## 🔧 Customization

### Add More Days
The system supports any day name. Common values:
- Monday, Tuesday, Wednesday, Thursday, Friday
- Saturday, Sunday (for weekend classes)

### Change Time Format
Currently uses 24-hour format (HH:MM). To change:
1. Update validation in `scheduleService.js`
2. Update display format in frontend

### Add Recurring Schedules
To add support for recurring schedules (e.g., "Every Monday for 12 weeks"):
1. Add `startDate` and `endDate` fields to Schedule model
2. Update repository to filter by date range
3. Update frontend to show date ranges

---

## 🐛 Troubleshooting

### "Schedule not found"
- Check that the schedule ID exists
- Verify you have permission to access it

### "Forbidden"
- Instructors can only manage their own course schedules
- Students cannot create/update/delete schedules

### "Invalid time format"
- Use HH:MM format (e.g., "10:00", not "10:00 AM")
- Use 24-hour format (e.g., "14:00" for 2:00 PM)

### "End time must be after start time"
- Ensure endTime > startTime
- Check for typos in time values

---

## 📚 Documentation

- **API Reference**: See `SCHEDULE_API.md`
- **Database Schema**: See `prisma/schema.prisma`
- **Example Requests**: See `SCHEDULE_API.md` examples section

---

## ✅ Testing Checklist

- [ ] Student can view their schedule
- [ ] Schedule shows all enrolled courses
- [ ] Conflict detection works
- [ ] Instructor can create schedule for their course
- [ ] Instructor cannot create schedule for other courses
- [ ] Admin can manage all schedules
- [ ] Schedules are sorted correctly
- [ ] Time validation works
- [ ] Schedule updates when student enrolls/drops

---

## 🎉 You're All Set!

The schedule system is now fully integrated with your backend. Students will automatically see their class schedules based on enrolled courses!

**Next Steps:**
1. Test the API endpoints
2. Update your frontend to fetch schedules
3. Display schedules in a calendar or list view
4. Add conflict warnings before enrollment

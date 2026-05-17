# Schedule API Documentation

## Overview
The Schedule API allows students to view their class schedules based on enrolled courses, and allows instructors/admins to manage course schedules.

---

## Endpoints

### 1. Get My Schedule
**GET** `/api/schedules/my`

Get the authenticated user's schedule based on their role:
- **Students**: Get schedules for all enrolled courses
- **Instructors**: Get schedules for all courses they teach
- **Admins**: Get all schedules in the system

**Authentication**: Required (JWT token)

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "day": "Monday",
    "startTime": "10:00",
    "endTime": "11:30",
    "room": "Room 101",
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
  },
  {
    "id": 2,
    "day": "Wednesday",
    "startTime": "10:00",
    "endTime": "11:30",
    "room": "Room 101",
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
]
```

---

### 2. Check Schedule Conflicts
**POST** `/api/schedules/check-conflicts`

Check if enrolling in a course would create schedule conflicts with currently enrolled courses.

**Authentication**: Required (Student only)

**Request Body**:
```json
{
  "courseId": 5
}
```

**Response**: `200 OK`
```json
{
  "hasConflicts": true,
  "conflicts": [
    {
      "existingCourse": {
        "id": 3,
        "title": "Operating Systems",
        "day": "Monday",
        "startTime": "10:00",
        "endTime": "11:30"
      },
      "newCourse": {
        "id": 5,
        "day": "Monday",
        "startTime": "10:30",
        "endTime": "12:00"
      }
    }
  ]
}
```

---

### 3. Get All Schedules (Admin Only)
**GET** `/api/schedules/all`

Get all schedules in the system.

**Authentication**: Required (Admin only)

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "day": "Monday",
    "startTime": "10:00",
    "endTime": "11:30",
    "room": "Room 101",
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
]
```

---

### 4. Create Schedule
**POST** `/api/schedules/course/:courseId`

Create a new schedule slot for a course.

**Authentication**: Required (Instructor/Admin only)

**Permissions**: 
- Instructor can only create schedules for their own courses
- Admin can create schedules for any course

**Request Body**:
```json
{
  "day": "Monday",
  "startTime": "10:00",
  "endTime": "11:30",
  "room": "Room 101"
}
```

**Response**: `201 Created`
```json
{
  "id": 1,
  "day": "Monday",
  "startTime": "10:00",
  "endTime": "11:30",
  "room": "Room 101",
  "courseId": 5,
  "course": {
    "id": 5,
    "title": "Database Systems",
    "icon": "🗄️"
  }
}
```

**Errors**:
- `400`: Invalid time format or end time before start time
- `403`: Not authorized to create schedule for this course
- `404`: Course not found

---

### 5. Update Schedule
**PUT** `/api/schedules/:scheduleId`

Update an existing schedule slot.

**Authentication**: Required (Instructor/Admin only)

**Permissions**: 
- Instructor can only update schedules for their own courses
- Admin can update any schedule

**Request Body** (all fields optional):
```json
{
  "day": "Tuesday",
  "startTime": "14:00",
  "endTime": "15:30",
  "room": "Room 202"
}
```

**Response**: `200 OK`
```json
{
  "id": 1,
  "day": "Tuesday",
  "startTime": "14:00",
  "endTime": "15:30",
  "room": "Room 202",
  "courseId": 5,
  "course": {
    "id": 5,
    "title": "Database Systems",
    "icon": "🗄️"
  }
}
```

**Errors**:
- `400`: Invalid time format or end time before start time
- `403`: Not authorized to update this schedule
- `404`: Schedule not found

---

### 6. Delete Schedule
**DELETE** `/api/schedules/:scheduleId`

Delete a schedule slot.

**Authentication**: Required (Instructor/Admin only)

**Permissions**: 
- Instructor can only delete schedules for their own courses
- Admin can delete any schedule

**Response**: `200 OK`
```json
{
  "message": "Schedule deleted successfully"
}
```

**Errors**:
- `403`: Not authorized to delete this schedule
- `404`: Schedule not found

---

## Data Models

### Schedule
```typescript
{
  id: number;
  day: string;           // "Monday", "Tuesday", etc.
  startTime: string;     // "HH:MM" format (e.g., "10:00")
  endTime: string;       // "HH:MM" format (e.g., "11:30")
  room: string | null;   // Optional room number
  courseId: number;
  course: {
    id: number;
    title: string;
    icon: string;
    instructor?: {
      id: number;
      name: string;
    }
  }
}
```

---

## Usage Examples

### Student: Get My Schedule
```javascript
const response = await fetch('http://localhost:5000/api/schedules/my', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const schedule = await response.json();
```

### Student: Check for Conflicts Before Enrolling
```javascript
const response = await fetch('http://localhost:5000/api/schedules/check-conflicts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ courseId: 5 })
});
const { hasConflicts, conflicts } = await response.json();

if (hasConflicts) {
  console.log('Warning: Schedule conflicts detected!');
  conflicts.forEach(conflict => {
    console.log(`Conflict with ${conflict.existingCourse.title}`);
  });
}
```

### Instructor: Create Schedule for Course
```javascript
const response = await fetch('http://localhost:5000/api/schedules/course/5', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    day: 'Monday',
    startTime: '10:00',
    endTime: '11:30',
    room: 'Room 101'
  })
});
const schedule = await response.json();
```

---

## Features

### ✅ Automatic Schedule Generation
- When a student enrolls in a course, their schedule automatically includes all course schedule slots
- No manual schedule management needed for students

### ✅ Conflict Detection
- Check for time conflicts before enrolling
- Prevents double-booking
- Shows which courses conflict

### ✅ Role-Based Access
- **Students**: View their own schedule (enrolled courses only)
- **Instructors**: View schedules for courses they teach
- **Admins**: View all schedules, manage any schedule

### ✅ Time Validation
- Validates time format (HH:MM)
- Ensures end time is after start time
- Detects overlapping time slots

### ✅ Sorted Output
- Schedules are automatically sorted by day of week
- Within each day, sorted by start time
- Easy to read and display

---

## Integration with Enrollment

The schedule system is tightly integrated with the enrollment system:

1. **Student enrolls in course** → Schedule automatically includes course times
2. **Student drops course** → Schedule automatically removes course times
3. **Instructor updates schedule** → All enrolled students see updated times

---

## Database Schema

```prisma
model Schedule {
  id        Int     @id @default(autoincrement())
  day       String  // e.g. "Monday"
  startTime String  // e.g. "10:00"
  endTime   String  // e.g. "11:30"
  room      String?

  courseId Int
  course   Course @relation(fields: [courseId], references: [id], onDelete: Cascade)
}
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (invalid data) |
| 403 | Forbidden (not authorized) |
| 404 | Not Found |
| 409 | Conflict (schedule overlap) |
| 500 | Server Error |

---

## Testing

### Test Schedule Creation
```bash
# Create a schedule for course ID 1
curl -X POST http://localhost:5000/api/schedules/course/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "day": "Monday",
    "startTime": "10:00",
    "endTime": "11:30",
    "room": "Room 101"
  }'
```

### Test Get My Schedule
```bash
curl http://localhost:5000/api/schedules/my \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Conflict Check
```bash
curl -X POST http://localhost:5000/api/schedules/check-conflicts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"courseId": 5}'
```

---

## Notes

- All times are in 24-hour format (HH:MM)
- Days must be full day names ("Monday", not "Mon")
- Room field is optional
- Schedules are automatically deleted when a course is deleted (CASCADE)
- Students cannot create, update, or delete schedules
- Instructors can only manage schedules for their own courses
- Admins have full access to all schedules

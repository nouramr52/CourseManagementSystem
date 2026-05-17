import {
    getMySchedule,
    getAllSchedules,
    createCourseSchedule,
    updateCourseSchedule,
    deleteCourseSchedule,
    checkScheduleConflicts
} from "../services/scheduleService.js";

// ─── GET /api/schedules/my ─────────────────────────────────────────────────
// Get the authenticated user's schedule based on their enrolled courses
export const getMyScheduleHandler = async (req, res) => {
    try {
        console.log('📅 Fetching schedule for user:', req.user.id, 'Role:', req.user.role);
        const userId = req.user.id;
        const userRole = req.user.role;
        
        const schedule = await getMySchedule(userId, userRole);
        console.log('✅ Schedule fetched successfully:', schedule.length, 'items');
        res.status(200).json(schedule);
    } catch (err) {
        console.error('❌ Error fetching schedule:', err);
        res.status(500).json({ message: err.message });
    }
};

// ─── GET /api/schedules/all ────────────────────────────────────────────────
// Get all schedules (admin only)
export const getAllSchedulesHandler = async (req, res) => {
    try {
        const schedules = await getAllSchedules();
        res.status(200).json(schedules);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── POST /api/schedules/course/:courseId ──────────────────────────────────
// Create a new schedule slot for a course (instructor/admin only)
export const createScheduleHandler = async (req, res) => {
    try {
        const courseId = Number(req.params.courseId);
        const { day, startTime, endTime, room } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Validate required fields
        if (!day || !startTime || !endTime) {
            return res.status(400).json({ 
                message: "Day, start time, and end time are required" 
            });
        }

        const schedule = await createCourseSchedule(
            courseId,
            { day, startTime, endTime, room },
            userId,
            userRole
        );
        
        res.status(201).json(schedule);
    } catch (err) {
        const status =
            err.message === "Course not found" ? 404 :
            err.message === "Forbidden" ? 403 :
            err.message.includes("conflict") ? 409 : 500;

        res.status(status).json({ message: err.message });
    }
};

// ─── PUT /api/schedules/:scheduleId ────────────────────────────────────────
// Update an existing schedule slot (instructor/admin only)
export const updateScheduleHandler = async (req, res) => {
    try {
        const scheduleId = Number(req.params.scheduleId);
        const { day, startTime, endTime, room } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        const schedule = await updateCourseSchedule(
            scheduleId,
            { day, startTime, endTime, room },
            userId,
            userRole
        );
        
        res.status(200).json(schedule);
    } catch (err) {
        const status =
            err.message === "Schedule not found" ? 404 :
            err.message === "Forbidden" ? 403 :
            err.message.includes("conflict") ? 409 : 500;

        res.status(status).json({ message: err.message });
    }
};

// ─── DELETE /api/schedules/:scheduleId ─────────────────────────────────────
// Delete a schedule slot (instructor/admin only)
export const deleteScheduleHandler = async (req, res) => {
    try {
        const scheduleId = Number(req.params.scheduleId);
        const userId = req.user.id;
        const userRole = req.user.role;

        await deleteCourseSchedule(scheduleId, userId, userRole);
        
        res.status(200).json({ message: "Schedule deleted successfully" });
    } catch (err) {
        const status =
            err.message === "Schedule not found" ? 404 :
            err.message === "Forbidden" ? 403 : 500;

        res.status(status).json({ message: err.message });
    }
};

// ─── POST /api/schedules/check-conflicts ───────────────────────────────────
// Check for schedule conflicts for a student
export const checkConflictsHandler = async (req, res) => {
    try {
        const { courseId } = req.body;
        const studentId = req.user.id;

        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        const conflicts = await checkScheduleConflicts(studentId, Number(courseId));
        
        res.status(200).json({ 
            hasConflicts: conflicts.length > 0,
            conflicts 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

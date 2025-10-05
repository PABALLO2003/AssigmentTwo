const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');


dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());


const authRoutes = require('./Routes/auth');
const moduleRoutes = require('./Routes/modules');
const lecturerRoutes = require('./Routes/lecturers');
const ratingsRoutes = require('./Routes/ratings');
const plRoutes = require('./Routes/pl');
const reportRoutes = require('./Routes/reports');
const courseRoutes = require('./Routes/courses');
const assignRoutes = require('./Routes/assign');
const prlRoutes = require('./Routes/prl');
const venueRoutes = require('./Routes/venues');

app.use('/api/auth', authRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/lecturers', lecturerRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/pl', plRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api', assignRoutes);
app.use('/api/prl', prlRoutes);
app.use('/api/venues', venueRoutes);

app.get('/', (req, res) => {
  res.send('✅ LUCT Report Portal backend is running');
});

app.get('/api/students/:id', async (req, res) => {
  const studentId = req.params.id;
  try {
    const [student] = await db.query(
      'SELECT name, surname, program FROM Students WHERE student_id = ?',
      [studentId]
    );
    if (!student.length) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student[0]);
  } catch (err) {
    console.error('❌ Student fetch error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/api/pl/courses', async (req, res) => {
  const user_id = req.query.user_id;
  try {
    const [plProgram] = await db.query(
      'SELECT program FROM PL WHERE user_id = ?',
      [user_id]
    );

    if (!plProgram.length) {
      console.warn('⚠️ No PL found for user_id:', user_id);
      return res.status(404).json({ error: 'PL not found' });
    }

    const [courses] = await db.query(
      'SELECT course_id, course_name, course_code FROM courses WHERE program = ?',
      [plProgram[0].program]
    );

    console.log(`✅ ${courses.length} courses found for program: ${plProgram[0].program}`);
    res.json(courses);
  } catch (err) {
    console.error('❌ PL course fetch error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
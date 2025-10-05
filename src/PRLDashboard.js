import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

function PRLDashboard() {
  const navigate = useNavigate();
  const user_id = localStorage.getItem('user_id') || 'PRL001';

  const [selectedCourse, setSelectedCourse] = useState('');
  const [feedbacks, setFeedbacks] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  
  const courses = [
    { course_id: 1, course_name: 'Programming Fundamentals', course_code: 'BIT101' },
    { course_id: 2, course_name: 'Web Design', course_code: 'BIT102' },
    { course_id: 3, course_name: 'Object-Oriented Programming', course_code: 'BIT201' },
    { course_id: 4, course_name: 'Database Systems', course_code: 'BIT202' },
    { course_id: 5, course_name: 'Networking', course_code: 'BIT301' },

  ];

  const classes = [
    { class_id: 1, course_id: 1, class_name: 'BIT101-Monday-AM', venue: 'Hall1', day_of_week: 'Monday', scheduled_time: '08:30' },
    { class_id: 2, course_id: 2, class_name: 'BIT102-Tuesday-AM', venue: 'MM3', day_of_week: 'Tuesday', scheduled_time: '10:30' },
    { class_id: 3, course_id: 3, class_name: 'BIT201-Wednesday-AM', venue: 'MM4', day_of_week: 'Wednesday', scheduled_time: '08:30' },
    { class_id: 4, course_id: 4, class_name: 'BIT202-Thursday-AM', venue: 'MM1', day_of_week: 'Thursday', scheduled_time: '10:30' },
    { class_id: 5, course_id: 5, class_name: 'BIT301-Friday-AM', venue: 'MM5', day_of_week: 'Friday', scheduled_time: '08:30' },
 
  ];

  const reports = [
    { report_id: 1, class_id: 1, course_id: 1, topic_taught: 'Intro to Programming', week_number: 1, lecturer_name: 'Lecturer 1', course_name: 'Programming Fundamentals', course_code: 'BIT101', status: 'pending' },
    { report_id: 2, class_id: 2, course_id: 2, topic_taught: 'HTML & CSS Basics', week_number: 1, lecturer_name: 'Lecturer 4', course_name: 'Web Design', course_code: 'BIT102', status: 'pending' },
  
  ];

  const ratings = [
    { id: 15, lecturer_name: 'Lecturer 15', score: 5 },
    { id: 16, lecturer_name: 'Lecturer 16', score: 4 },
  ];

  const monitoring = [
    { id: 1, date: '2025-08-04', status: 'Completed' },
    { id: 2, date: '2025-08-05', status: 'Pending' },
  ];

 
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleExport = () => {
    const workbook = XLSX.utils.book_new();
    const sheets = [
      { data: courses, name: 'Courses' },
      { data: classes, name: 'Classes' },
      { data: monitoring, name: 'Monitoring' },
      { data: ratings, name: 'Ratings' },
      { data: reports, name: 'Reports' },
    ];
    sheets.forEach(({ data, name }) => {
      if (data.length > 0) {
        const sheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, sheet, name);
      }
    });
    XLSX.writeFile(workbook, `PRL_Report_${user_id}.xlsx`);
  };

  const handleFeedbackSubmit = (report_id) => {
    if (!feedbacks[report_id] || feedbacks[report_id].trim() === '') return;
    alert(`Feedback submitted for report ${report_id}: ${feedbacks[report_id]}`);
    setFeedbacks(prev => ({ ...prev, [report_id]: '' }));
  };

  const styles = {
    container: { padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' },
    section: { marginBottom: '40px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' },
    heading: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', borderBottom: '2px solid #007bff', paddingBottom: '10px', color: '#333' },
    item: { marginBottom: '10px', padding: '8px', borderBottom: '1px solid #ddd' },
    logoutButton: { padding: '10px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginRight: '10px' },
    exportButton: { padding: '10px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' },
    dropdownBtn: { padding: '10px 16px', backgroundColor: '#050506ff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
    dropdownMenu: { marginTop: '5px', border: '1px solid #ccc', borderRadius: '6px', backgroundColor: '#fff', maxHeight: '200px', overflowY: 'auto', position: 'absolute', zIndex: 10, width: '250px' },
    dropdownItem: { padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' },
    feedbackBox: { marginTop: '10px', display: 'flex', gap: '10px' },
    textarea: { flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
    submitBtn: { padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  };

  const filteredReports = selectedCourse
    ? reports.filter(r => r.course_id.toString() === selectedCourse)
    : reports;

  const filteredClasses = selectedCourse
    ? classes.filter(c => c.course_id.toString() === selectedCourse)
    : classes;

  return (
    <div style={styles.container}>
      <button onClick={handleLogout} style={styles.logoutButton}>🔒 Logout</button>
      <button onClick={handleExport} style={styles.exportButton}>📤 Export to Excel</button>

      {}
      <div style={styles.section}>
        <h2 style={styles.heading}>📘 Courses</h2>
        <div style={{ position: 'relative' }}>
          <button style={styles.dropdownBtn} onClick={() => setDropdownOpen(prev => !prev)}>
            {selectedCourse
              ? courses.find(c => c.course_id.toString() === selectedCourse).course_name
              : '-- Select a course --'}
          </button>
          {dropdownOpen && (
            <div style={styles.dropdownMenu}>
              {courses.map(course => (
                <div
                  key={course.course_id}
                  style={styles.dropdownItem}
                  onClick={() => {
                    setSelectedCourse(course.course_id.toString());
                    setDropdownOpen(false);
                  }}
                >
                  {course.course_name} ({course.course_code})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {}
      <div style={styles.section}>
        <h2 style={styles.heading}>🏫 Classes</h2>
        {filteredClasses.map(cls => (
          <div key={cls.class_id} style={styles.item}>
            {cls.class_name} | {cls.venue} | {cls.day_of_week} {cls.scheduled_time}
          </div>
        ))}
        {filteredClasses.length === 0 && <p>No classes available.</p>}
      </div>

      {}
      <div style={styles.section}>
        <h2 style={styles.heading}>📄 Reports</h2>
        {filteredReports.map(report => (
          <div key={report.report_id} style={styles.item}>
            <strong>Week {report.week_number}</strong> – {report.topic_taught} <br />
            Lecturer: {report.lecturer_name} | Course: {report.course_name} ({report.course_code})<br />
            Status: {report.status}
            <div style={styles.feedbackBox}>
              <textarea
                style={styles.textarea}
                placeholder="Add feedback..."
                value={feedbacks[report.report_id] || ''}
                onChange={(e) => setFeedbacks(prev => ({ ...prev, [report.report_id]: e.target.value }))}
              />
              <button style={styles.submitBtn} onClick={() => handleFeedbackSubmit(report.report_id)}>Submit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PRLDashboard;

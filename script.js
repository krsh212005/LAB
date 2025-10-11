const API_BASE_URL = 'http://localhost:8080';

const studentForm = document.getElementById('studentForm');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const gradeInput = document.getElementById('gradeInput');
const attendanceForm = document.getElementById('attendanceForm');
const studentSelect = document.getElementById('studentSelect');
const dateInput = document.getElementById('dateInput');
const statusInput = document.getElementById('statusInput');
const studentList = document.getElementById('studentList');
const attendanceList = document.getElementById('attendanceList');
const errorMessage = document.getElementById('errorMessage');

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

async function fetchStudents() {
    try {
        const response = await fetch(`${API_BASE_URL}/students`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const students = await response.json();
        renderStudents(students);
        populateStudentSelect(students);
        return students;
    } catch (error) {
        console.error('Error fetching students:', error);
        showError('Failed to load students. Check if backend is running.');
    }
}

function renderStudents(students) {
    studentList.innerHTML = '';
    students.forEach(student => {
        const li = document.createElement('li');
        li.className = 'student-item';
        li.innerHTML = `
            <div class="student-content">
                <h3>${student.name}</h3>
                <p>Email: ${student.email} | Grade: ${student.grade}</p>
            </div>
            <div class="actions">
                <button class="edit-btn" onclick="editStudent(${student.id})">Edit</button>
                <button class="delete-btn" onclick="deleteStudent(${student.id})">Delete</button>
            </div>
            <!-- Inline edit form (hidden) -->
            <form class="edit-form" id="editStudentForm-${student.id}" onsubmit="updateStudent(event, ${student.id})">
                <input type="text" id="editName-${student.id}" value="${student.name}" required>
                <input type="email" id="editEmail-${student.id}" value="${student.email}" required>
                <input type="text" id="editGrade-${student.id}" value="${student.grade}" required>
                <button type="submit">Save</button>
                <button type="button" class="cancel-btn" onclick="cancelEdit('editStudentForm-${student.id}')">Cancel</button>
            </form>
        `;
        studentList.appendChild(li);
    });
}

function populateStudentSelect(students) {
    studentSelect.innerHTML = '<option value="">Select Student</option>';
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = `${student.name} (${student.grade})`;
        studentSelect.appendChild(option);
    });
}

async function fetchAttendance() {
    try {
        const response = await fetch(`${API_BASE_URL}/attendance`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const attendance = await response.json();
        renderAttendance(attendance);
    } catch (error) {
        console.error('Error fetching attendance:', error);
        showError('Failed to load attendance records.');
    }
}

function renderAttendance(attendance) {
    attendanceList.innerHTML = '';
    attendance.forEach(record => {
        const li = document.createElement('li');
        li.className = 'attendance-item';
        const statusClass = `status-${record.status.toLowerCase()}`;
        li.innerHTML = `
            <div class="attendance-content">
                <h3>Student ID: ${record.studentId}</h3>
                <p>Date: ${record.date} | Status: <span class="attendance-status ${statusClass}">${record.status}</span></p>
            </div>
            <div class="actions">
                <button class="edit-btn" onclick="editAttendance(${record.id})">Edit</button>
                <button class="delete-btn" onclick="deleteAttendance(${record.id})">Delete</button>
            </div>
            <!-- Inline edit form (hidden) -->
            <form class="edit-form" id="editAttendanceForm-${record.id}" onsubmit="updateAttendance(event, ${record.id})">
                <input type="date" id="editDate-${record.id}" value="${record.date}" required>
                <select id="editStatus-${record.id}" required>
                    <option value="Present" ${record.status === 'Present' ? 'selected' : ''}>Present</option>
                    <option value="Absent" ${record.status === 'Absent' ? 'selected' : ''}>Absent</option>
                    <option value="Late" ${record.status === 'Late' ? 'selected' : ''}>Late</option>
                </select>
                <button type="submit">Save</button>
                <button type="button" class="cancel-btn" onclick="cancelEdit('editAttendanceForm-${record.id}')">Cancel</button>
            </form>
        `;
        attendanceList.appendChild(li);
    });
}

async function createStudent(name, email, grade) {
    try {
        const response = await fetch(`${API_BASE_URL}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, grade }),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const newStudent = await response.json();
        return newStudent;
    } catch (error) {
        console.error('Error creating student:', error);
        showError('Failed to add student.');
        throw error;
    }
}

async function updateStudent(event, id) {
    event.preventDefault();
    const name = document.getElementById(`editName-${id}`).value;
    const email = document.getElementById(`editEmail-${id}`).value;
    const grade = document.getElementById(`editGrade-${id}`).value;

    try {
        const response = await fetch(`${API_BASE_URL}/students/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, grade }),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        document.getElementById(`editStudentForm-${id}`).style.display = 'none';
        fetchStudents(); // Refresh lists
    } catch (error) {
        console.error('Error updating student:', error);
        showError('Failed to update student.');
    }
}

async function deleteStudent(id) {
    if (!confirm('Delete this student? This may affect attendance records.')) return;
    try {
        const response = await fetch(`${API_BASE_URL}/students/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        fetchStudents(); // Refresh
    } catch (error) {
        console.error('Error deleting student:', error);
        showError('Failed to delete student.');
    }
}

function editStudent(id) {
    document.getElementById(`editStudentForm-${id}`).style.display = 'block';
}

async function createAttendance(studentId, date, status) {
    try {
        const response = await fetch(`${API_BASE_URL}/attendance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId, date, status }),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const newRecord = await response.json();
        return newRecord;
    } catch (error) {
        console.error('Error marking attendance:', error);
        showError('Failed to mark attendance.');
        throw error;
    }
}

async function updateAttendance(event, id) {
    event.preventDefault();
    const date = document.getElementById(`editDate-${id}`).value;
    const status = document.getElementById(`editStatus-${id}`).value;

    try {
        const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, status }),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

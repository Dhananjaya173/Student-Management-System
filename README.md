# CampusDesk — Student Management System

A responsive Student Management System made with **HTML, CSS and JavaScript**. It is designed as a beginner-friendly BCA first-semester project.

## Features
- Dashboard with total students, active students, course count and average attendance
- Add, edit and delete student records
- Search by student name, ID, email or course
- Filter students by active/inactive status
- Attendance percentage display
- Course distribution overview
- Export student records to CSV
- Saves records in browser `localStorage`
- Responsive layout for desktop, tablet and mobile

## How to run
1. Download and extract the project ZIP.
2. Open the extracted folder.
3. Double-click `index.html` to open it in Chrome, Edge or Firefox.
4. No installation or server is required.

## Project files
- `index.html` — page structure and form
- `style.css` — design, layout and responsive styling
- `script.js` — student CRUD operations, search, filtering, CSV export and local storage

## How data is stored
This project uses the browser's `localStorage`. Records remain saved in the same browser on the same device after refreshing the page. Clearing browser site data may remove them. This is a front-end demonstration and does not use a secure college database or user login.

## Testing checklist
1. Open the dashboard and check that the sample records and statistics appear.
2. Add a student with a unique student ID.
3. Try adding the same student ID again; the form should show a validation message.
4. Edit a student and verify the updated details in the table.
5. Search for a student by name, ID or course.
6. Filter the list by Active and Inactive.
7. Delete a record and confirm the dashboard counts update.
8. Export the records and open the downloaded CSV file.
9. Refresh the browser and verify that saved records remain.

## Academic note
Use fictional/sample student details for demonstrations. Do not enter real student personal information into a public demo website.

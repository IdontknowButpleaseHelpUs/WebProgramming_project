document.addEventListener("DOMContentLoaded", function () {
   document.querySelector(".menu-logo").addEventListener("click", function () {
      this.style.filter = this.style.filter === "" ? "invert(100%)" : "";
      this.style.transform = this.style.transform === "" ? "rotate(-90deg)" : "";
   });

   document.querySelector(".drop-down").addEventListener("click", function () {
      this.style.filter = this.style.filter === "" ? "invert(100%)" : "";
      this.style.transform = this.style.transform === "" ? "rotate(-180deg)" : "";
   });

   const adminName = localStorage.getItem('adminUsername');
   const welcomeText = document.getElementById('welcome-text');
   const username_display = document.getElementById('logged-username');
   const pfp_pic = document.getElementById('pfp');

   if (adminName) {
      const capitalizedAdminName = adminName[0].toUpperCase() + adminName.slice(1);
      welcomeText.textContent = `Welcome Admin: ${capitalizedAdminName}`;
      username_display.textContent = capitalizedAdminName;
   } else {
      welcomeText.textContent = 'Welcome Admin';
   }

   const dropdown = document.getElementById('dropdown');
   const dropdownContent = document.getElementById('dropdown-content');

   dropdown.addEventListener('click', (e) => {
      e.preventDefault();
      dropdownContent.classList.toggle('show');
   });

   document.querySelector('.logout').addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('adminUsername');
      setTimeout(() => window.location.href = '../login/login.html', 500);
   });

   document.querySelector('.setting').addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '../setting/setting.html';
   });

   async function loadProfile() {
      try {
         const res = await fetch(`http://127.0.0.1:5000/api/admin/${adminName}`);
         if (!res.ok) throw new Error("Failed to load profile");
         const data = await res.json();

         if (data.profilePic) {
            pfp_pic.src = data.profilePic;
         }
      } catch (error) {
         console.error(error);
         alert("Error loading profile data.");
      }
   }
   loadProfile();

   const tabButtons = document.querySelectorAll(".tab-btn");
   const sections = document.querySelectorAll(".table-section");
   const coursesTableBody = document.querySelector("#courses-table tbody");
   const searchInput = document.getElementById("search-input");

   tabButtons.forEach(button => {
      button.addEventListener("click", () => {
         tabButtons.forEach(btn => btn.classList.remove("active"));
         button.classList.add("active");

         const targetTab = button.dataset.tab;
         sections.forEach(section => {
            if (section.id === targetTab) {
               section.style.display = "block";
            } else {
               section.style.display = "none";
            }
         });
      });
   });

   let courses = [
      {
         id: "101",
         name: "Mathematics",
         lecturer: "John Doe",
         schedule: "Mon 9:00 AM - 12:00 PM, Wed 1:00 PM - 3:00 PM",
         description: "Basic math course"
      },
      {
         id: "102",
         name: "Computer Science",
         lecturer: "Alice Smith",
         schedule: "Tue 10:00 AM - 1:00 PM, Thu 2:00 PM - 4:00 PM",
         description: "Intro to CS"
      }
   ];

   let filteredCourses = [...courses];

   function renderTable(data = filteredCourses) {
      coursesTableBody.innerHTML = "";
      data.forEach((course, index) => {
         const row = document.createElement("tr");
         row.innerHTML = `
            <td>${course.id}</td>
            <td>${course.name}</td>
            <td>${course.lecturer}</td>
            <td>${course.schedule}</td>
            <td>${course.description || ''}</td>
            <td>
               <button class="edit-btn" data-index="${index}">Edit</button>
               <button class="delete-btn" data-index="${index}">Delete</button>
            </td>
         `;
         coursesTableBody.appendChild(row);
      });
      attachRowEvents(data);
   }

   function filterCourses(query) {
      const lowerQuery = query.toLowerCase();
      filteredCourses = courses.filter(course =>
         course.id.toLowerCase().includes(lowerQuery) ||
         course.name.toLowerCase().includes(lowerQuery) ||
         course.lecturer.toLowerCase().includes(lowerQuery) ||
         (course.description && course.description.toLowerCase().includes(lowerQuery)) // search description too
      );
      renderTable(filteredCourses);
   }

   searchInput.addEventListener("input", () => {
      filterCourses(searchInput.value.trim());
   });

   const form = document.getElementById("course-form");
   const courseIdInput = document.getElementById("course-id");
   const courseNameInput = document.getElementById("course-name");
   const lecturerInput = document.getElementById("lecturer-name");
   const descriptionInput = document.getElementById("description");
   const scheduleInput = document.getElementById("schedule");

   const addBtn = document.getElementById("add-course-btn");
   const updateBtn = document.getElementById("update-course-btn");
   const deleteBtn = document.getElementById("delete-course-btn");
   const clearBtn = document.getElementById("clear-form-btn");

   let editIndex = null;

   addBtn.addEventListener("click", () => {
      const newCourse = {
         id: courseIdInput.value.trim(),
         name: courseNameInput.value.trim(),
         lecturer: lecturerInput.value.trim(),
         schedule: scheduleInput.value.trim(),
         description: descriptionInput.value.trim()
      };

      if (!newCourse.id || !newCourse.name) return alert("Course ID and Name are required!");

      const exists = courses.some(course =>
         course.id === newCourse.id || course.name.toLowerCase() === newCourse.name.toLowerCase()
      );
      if (exists) return alert("Course with this ID or Name already exists!");

      courses.push(newCourse);
      filterCourses(searchInput.value.trim());
      clearForm();
   });

   function loadCourseIntoForm(index) {
      const course = courses[index];
      courseIdInput.value = course.id;
      courseNameInput.value = course.name;
      lecturerInput.value = course.lecturer;

      scheduleInput.value = course.schedule;

      descriptionInput.value = course.description || "";

      editIndex = index;
   }

   updateBtn.addEventListener("click", () => {
      if (editIndex === null) return alert("Select a course to edit first!");

      const updatedCourse = {
         id: courseIdInput.value.trim(),
         name: courseNameInput.value.trim(),
         lecturer: lecturerInput.value.trim(),
         schedule: scheduleInput.value.trim(),
         description: descriptionInput.value.trim()
      };
      if (!updatedCourse.id || !updatedCourse.name) return alert("Course ID and Name are required!");

      const exists = courses.some((course, idx) =>
         idx !== editIndex &&
         (course.id === updatedCourse.id || course.name.toLowerCase() === updatedCourse.name.toLowerCase())
      );
      if (exists) return alert("Course with this ID or Name already exists!");

      courses[editIndex] = updatedCourse;
      filterCourses(searchInput.value.trim());
      clearForm();
      editIndex = null;
   });

   deleteBtn.addEventListener("click", () => {
      if (editIndex === null) return alert("Select a course to delete first!");
      courses.splice(editIndex, 1);
      filterCourses(searchInput.value.trim());
      clearForm();
      editIndex = null;
   });

   clearBtn.addEventListener("click", () => {
      clearForm();
      editIndex = null;
   });

   function clearForm() {
      form.reset();
   }

   function attachRowEvents(data = filteredCourses) {
      document.querySelectorAll(".edit-btn").forEach(btn => {
         btn.addEventListener("click", () => {
            const index = btn.dataset.index;
            const actualIndex = courses.findIndex(c => c.id === data[index].id);
            loadCourseIntoForm(actualIndex);
         });
      });

      document.querySelectorAll(".delete-btn").forEach(btn => {
         btn.addEventListener("click", () => {
            const index = btn.dataset.index;
            const actualIndex = courses.findIndex(c => c.id === data[index].id);
            courses.splice(actualIndex, 1);
            filterCourses(searchInput.value.trim());
            clearForm();
         });
      });
   }

   renderTable();
});

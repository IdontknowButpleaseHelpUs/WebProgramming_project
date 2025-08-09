document.addEventListener('DOMContentLoaded', function () {
   // Existing click handlers
   document.querySelector('.menu-logo').addEventListener('click', function () {
      this.style.filter = this.style.filter === '' ? 'invert(100%)' : '';
      this.style.transform = this.style.transform === '' ? 'rotate(-90deg)' : '';
   });

   document.querySelector('.drop-down').addEventListener('click', function () {
      this.style.filter = this.style.filter === '' ? 'invert(100%)' : '';
      this.style.transform = this.style.transform === '' ? 'rotate(-180deg)' : '';
   });

   // New logic for course cards
   document.querySelector('.background').src = '../assets/background2.jpg';

   const courses = [
      {
         title: "Probability Model and Data Analysis",
         description: "Dive into probability models and learn data analysis techniques."
      },
      {
         title: "Computer Architecture and Organization",
         description: "Explore computer architecture concepts and organization principles."
      },
      {
         title: "Web Programming",
         description: "Understand web development technologies and best practices."
      },
      {
         title: "Data Structure and Algorithms",
         description: "Master the fundamentals of data structures and algorithm design."
      }
   ];

   const courseGrid = document.getElementById('courseGrid');

   courses.forEach(course => {
      const card = document.createElement('div');
      card.classList.add('course-card');

      const header = document.createElement('div');
      header.classList.add('course-card-header');

      const overlay = document.createElement('div');
      overlay.classList.add('course-card-overlay');

      // Generate a random color
      const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.4)`;
      overlay.style.background = randomColor;

      const title = document.createElement('h3');
      title.textContent = course.title;

      header.appendChild(overlay);
      header.appendChild(title);

      const description = document.createElement('p');
      description.textContent = course.description;

      card.appendChild(header);
      card.appendChild(description);

      courseGrid.appendChild(card);

      // Add the click event listener to the card here
      card.addEventListener('click', function () {
         const courseTitle = encodeURIComponent(course.title);
         const courseDescription = encodeURIComponent(course.description);
         window.location.href = `course/view.html?title=${courseTitle}&description=${courseDescription}`;
      });
   });
});

document.addEventListener("DOMContentLoaded", function () {
   // Existing click handlers
   document.querySelector(".menu-logo").addEventListener("click", function () {
      this.style.filter = this.style.filter === "" ? "invert(100%)" : "";
      this.style.transform = this.style.transform === "" ? "rotate(-90deg)" : "";
   });

   document.querySelector(".drop-down").addEventListener("click", function () {
      this.style.filter = this.style.filter === "" ? "invert(100%)" : "";
      this.style.transform = this.style.transform === "" ? "rotate(-180deg)" : "";
   });

   document.querySelector(".background").src = "../assets/background2.jpg";

   const courses = [
      {
         title: "Probability Model and Data Analysis",
         description:
            "Dive into probability models and learn data analysis techniques.",
      },
      {
         title: "Computer Architecture and Organization",
         description:
            "Explore computer architecture concepts and organization principles.",
      },
      {
         title: "Web Programming",
         description:
            "Understand web development technologies and best practices.",
      },
      {
         title: "Data Structure and Algorithms",
         description:
            "Master the fundamentals of data structures and algorithm design.",
      },
   ];

   fetch("http://127.0.0.1:5000/api/courses")
      .then((res) => res.json())
      .then((data) => {
         const courseGrid = document.getElementById("courseGrid");

         Object.values(data).forEach((course) => {
            const card = document.createElement("div");
            card.classList.add("course-card");

            const header = document.createElement("div");
            header.classList.add("course-card-header");
            
            const topColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.4)`;
            const bottomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.4)`;

            const overlay = document.createElement("div");
            overlay.classList.add("course-card-overlay");
            overlay.style.background =
               `linear-gradient(to bottom, ${topColor}, ${bottomColor})`;

            const title = document.createElement("h3");
            title.textContent = course.title;

            header.appendChild(overlay);
            header.appendChild(title);

            const description = document.createElement("p");
            description.textContent = course.description;

            card.appendChild(header);
            card.appendChild(description);

            courseGrid.appendChild(card);

            card.addEventListener("click", function () {
               const courseTitle = encodeURIComponent(course.title);
               window.location.href = `course/view.html?title=${courseTitle}`;
            });
         });
      })
      .catch((err) => console.error("Error fetching courses:", err));
});

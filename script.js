document.addEventListener("DOMContentLoaded", function () {
   document.querySelector(".menu-logo").addEventListener("click", function () {
      this.style.filter = this.style.filter === "" ? "invert(100%)" : "";
      this.style.transform = this.style.transform === "" ? "rotate(-90deg)" : "";
   });
   
   document.querySelector(".background").src = "../assets/background2.jpg";

   document.querySelector(".drop-down").addEventListener("click", function () {
      this.style.filter = this.style.filter === "" ? "invert(100%)" : "";
      this.style.transform = this.style.transform === "" ? "rotate(-180deg)" : "";
   });

   const dropdown = document.getElementById('dropdown');
   const dropdownContent = document.getElementById('dropdown-content');

   dropdown.addEventListener('click', (e) => {
      e.preventDefault();
      dropdownContent.classList.toggle('show');
   });

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

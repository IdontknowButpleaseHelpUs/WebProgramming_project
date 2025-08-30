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

   if (adminName) {
      welcomeText.textContent = `Welcome Admin: ${adminName}`;
   } else {
      welcomeText.textContent = 'Welcome Admin';
   }

   const dropdown = document.getElementById('dropdown');
   const dropdownContent = document.getElementById('dropdown-content');

   dropdown.addEventListener('click', (e) => {
      e.preventDefault();
      dropdownContent.classList.toggle('show');
   });

   const logoutLink = document.querySelector('.logout');
   logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('adminUsername');
      window.location.href = '../login/login.html';
   });
});


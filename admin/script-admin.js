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
   const username_dispaly = document.getElementById('logged-username');

   if (adminName) {
      const capitalizedAdminName = adminName[0].toUpperCase() + adminName.slice(1);
      welcomeText.textContent = `Welcome Admin: ${capitalizedAdminName}`;
      username_dispaly.textContent = capitalizedAdminName;
      
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
      setTimeout(() => {
         window.location.href = '../login/login.html';
      }, 1000);
   });
   const settingLink = document.querySelector('.setting');
   settingLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '../setting/setting.html';
   });

});


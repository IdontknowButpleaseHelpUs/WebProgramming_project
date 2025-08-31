document.addEventListener("DOMContentLoaded", function () {
    const adminName = localStorage.getItem('adminUsername');
    if (!adminName) {
        alert("No admin logged in!");
        window.location.href = "../login/login.html";
        return;
    }

    document.querySelector(".menu-logo").addEventListener("click", function () {
      this.style.filter = this.style.filter === "" ? "invert(100%)" : "";
      this.style.transform = this.style.transform === "" ? "rotate(-90deg)" : "";
    });

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
    const gobackbtn = document.querySelector('.goback');
    const changeBtn = document.getElementById('change-pfp-btn');
    const accountTitle = document.getElementById('account-title');
    const uploadInput = document.getElementById('upload-profile');
    const profileImg = document.getElementById('profile-img');
    const saveBtn = document.getElementById('save-changes');
    const inputs = document.querySelectorAll('input[data-field], textarea[data-field]');

    const logoutLink = document.querySelector('.logout');
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('adminUsername');
        setTimeout(() => {
            window.location.href = '../login/login.html';
        }, 1000);
    });

    gobackbtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.back();
    });

    accountTitle.textContent = `Settings - ${adminName}`;

    changeBtn.addEventListener('click', () => {
        uploadInput.click();
    });

    uploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profileImg.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please select a valid PNG or JPG image.");
        }
    });

    async function loadProfile() {
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/admin/${adminName}`);
            if (!res.ok) throw new Error("Failed to load profile");
            const data = await res.json();

            inputs.forEach(input => {
                const field = input.getAttribute('data-field');
                if (data[field]) input.value = data[field];
            });

            if (data.profilePic) {
                profileImg.src = data.profilePic;
            }
        } catch (error) {
            console.error(error);
            alert("Error loading profile data.");
        }
    }
    loadProfile();

    uploadInput.addEventListener('change', () => {
        if (uploadInput.files.length > 0) {
            const file = uploadInput.files[0];
            if (file.type === "image/png" || file.type === "image/jpeg") {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profileImg.src = e.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                alert("Please select a valid PNG or JPG image.");
                uploadInput.value = "";
            }
        }
    });

    // Save Changes
    saveBtn.addEventListener('click', async () => {
        let error = false;
        let updateData = {};

        inputs.forEach(input => {
            if (input.value.trim() === '') {
                input.style.border = '1px solid red';
                error = true;
            } else {
                input.style.border = '';
                const field = input.getAttribute('data-field');
                updateData[field] = input.value.trim();
            }
        });

        if (error) {
            alert("Please fill out all fields.");
            return;
        }

        try {
            // Update text fields
            const res = await fetch(`http://127.0.0.1:5000/api/admin/${adminName}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            if (!res.ok) throw new Error("Failed to update profile");
            const json = await res.json();
            console.log("Profile update response:", json);

            if (uploadInput.files.length > 0) {
                const formData = new FormData();
                formData.append('profilePic', uploadInput.files[0]);

                const uploadRes = await fetch(`http://127.0.0.1:5000/api/upload-profile-pic/${adminName}`, {
                    method: "POST",
                    body: formData
                });

                if (!uploadRes.ok) throw new Error("Failed to upload profile picture");
                const uploadJson = await uploadRes.json();
                console.log("Image upload response:", uploadJson);

                if (uploadJson.profilePic) {
                    profileImg.src = uploadJson.profilePic;
                }
            }

            alert("Profile updated successfully!");
        } catch (error) {
            console.error(error);
            alert("Error updating profile.");
        }
    });
});

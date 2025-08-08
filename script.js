document.querySelector('.menu-logo').addEventListener('click', function() {
   this.style.filter = this.style.filter === '' ? 'invert(100%)' : '';
   this.style.transform = this.style.transform === '' ? 'rotate(-90deg)' : '';
});

document.querySelector('.drop-down').addEventListener('click', function() {
   this.style.filter = this.style.filter === '' ? 'invert(100%)' : '';
   this.style.transform = this.style.transform === '' ? 'rotate(-180deg)' : '';
});

document.addEventListener('DOMContentLoaded', function() {
   document.querySelector('.background').src = '../assets/background2.jpg';
});



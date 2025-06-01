document.getElementById("downloadBtn").addEventListener("click", function (e) {
  e.preventDefault();
  const progressContainer = document.getElementById("progress-container");
  progressContainer.classList.remove("loader-hidden");

  setTimeout(() => {
    window.location.href = e.target.href;
    progressContainer.classList.add("loader-hidden");
  }, 4000);
});

// Get all the contact icons
const contactIcons = document.querySelectorAll(".contact-icon");

// Add an event listener for each icon
contactIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    // Remove the 'active' class from all icons
    contactIcons.forEach((i) => i.classList.remove("active"));

    // Add the 'active' class to the clicked icon
    icon.classList.add("active");
  });
});

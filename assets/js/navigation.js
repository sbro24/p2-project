document.addEventListener("DOMContentLoaded", () => {
    // Highlight active page in navigation
    const navLinks = document.querySelectorAll(".navbar nav ul li a");
    const currentPage = window.location.pathname.split("/").pop(); // Get current file name

    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });

    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
        link.addEventListener("click", event => {
            if (link.getAttribute("href").startsWith("#")) {
                event.preventDefault();
                const targetId = link.getAttribute("href").substring(1);
                document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
});

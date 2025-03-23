document.addEventListener("DOMContentLoaded", function () {
    // Determine the base path based on the current page's location
    const isInPagesFolder = window.location.pathname.includes('/pages/');
    const basePath = isInPagesFolder ? '../' : '';

    const navbar = `
        <div class="navbar">
            <nav aria-label="Main Navigation">
                <ul>
                    <li><a href="${basePath}index.html">Home</a></li>
                    <li><a href="${basePath}pages/importData-actual-POC.html">Upload file</a></li>
                    <li><a href="${basePath}pages/budget-vs-actual.html">Budget og forecast</a></li>
                    <li><a href="${basePath}pages/forecast.html">Forecast</a></li>
                    <li><a href="${basePath}pages/key-metrics.html">Nøgletal</a></li>
                    <li><a href="${basePath}pages/project-management.html">Projektledelse</a></li>
                </ul>
            </nav>
        </div>
    `;

    // Inject the navbar into the <header> or another container
    const header = document.querySelector('header');
    if (header) {
        header.insertAdjacentHTML('afterend', navbar);
    }
});
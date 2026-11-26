// APPLICATION STATE MANAGEMENT
// =========================================================================
let currentTab = 'home';
let currentCategoryFilter = 'all';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    navigateToTab('home');
    renderFeaturedCourses();
    renderAllCoursesGrid();
    renderFaqs();
    populateFormCourseDropdown();

    // Ensure hero video autoplays smoothly
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        heroVideo.play().catch(() => {
            // Handled when user interacts
        });
    }

    // Subtle scroll-reveal animation for glassmorphism cards
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.08 });

        document.querySelectorAll('.course-tile, .service-alternating-row, .method-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(16px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }
});

// Navigation Functions
function navigateToTab(tabId) {
    currentTab = tabId;

    document.querySelectorAll('.tab-content').forEach(section => {
        section.classList.add('hidden');
    });

    const targetSection = document.getElementById(`tab-${tabId}`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }

    // Fixed white header: active = mint active indicator bar + background pill
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        link.style.color = '#000000';
    });
    const activeNav = document.getElementById(`nav-${tabId}`);
    if (activeNav) {
        activeNav.classList.add('active');
    }

    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) mobileMenu.classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.toggle('hidden');
}

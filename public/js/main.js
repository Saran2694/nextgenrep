// ── NEXTGEN DMA VENTURES — Main Orchestrator ──

function populateFormCourseDropdown() {
    const select = document.getElementById('form-course');
    if (!select) return;

    // Reset dropdown options keeping placeholder
    select.innerHTML = '<option value="">Select a Course / Program...</option>';

    COURSES_DATA.forEach(course => {
        const opt = document.createElement('option');
        opt.value = course.name;
        opt.setAttribute('data-fee', course.formattedFee);
        opt.setAttribute('data-duration', course.durationText);
        opt.setAttribute('data-id', course.id);
        opt.textContent = `${course.name} — ${course.formattedFee} (${course.durationText})`;
        select.appendChild(opt);
    });

    // Listen to dropdown changes to automatically update the course fee display
    select.addEventListener('change', () => {
        const selectedCourseName = select.value;
        const matched = COURSES_DATA.find(c => c.name === selectedCourseName || c.title === selectedCourseName);
        const feeInput = document.getElementById('form-fee');
        if (feeInput) {
            feeInput.value = matched ? `${matched.formattedFee} (${matched.durationText})` : '';
        }
    });
}



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


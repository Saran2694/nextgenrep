function filterCategoryAndSwitch(category) {
    navigateToTab('courses');
    setCategoryFilter(category);
}

function setCategoryFilter(category) {
    currentCategoryFilter = category;
    
    document.querySelectorAll('.cat-pill').forEach(pill => {
        if (pill.getAttribute('data-cat') === category) {
            pill.classList.add('active-cat');
        } else {
            pill.classList.remove('active-cat');
        }
    });

    filterCourses();
}

function filterCourses() {
    const searchInput = document.getElementById('course-search-input');
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const durationFilter = document.getElementById('duration-filter');
    const durationQuery = durationFilter ? durationFilter.value : 'all';
    const sortFilter = document.getElementById('sort-filter');
    const sortQuery = sortFilter ? sortFilter.value : 'default';

    let filtered = COURSES_DATA.filter(course => {
        // Category check
        const matchesCat = (currentCategoryFilter === 'all') || (course.category === currentCategoryFilter);
        
        // Duration filter check (Weeks)
        let matchesDuration = true;
        if (durationQuery === 'lt24') {
            matchesDuration = course.duration < 24;
        } else if (durationQuery === '24-26') {
            matchesDuration = course.duration >= 24 && course.duration <= 26;
        } else if (durationQuery === '28-30') {
            matchesDuration = course.duration >= 28 && course.duration <= 30;
        } else if (durationQuery === 'gt30') {
            matchesDuration = course.duration > 30;
        }

        // Search check
        const matchesSearch = !searchQuery || 
                              course.name.toLowerCase().includes(searchQuery) || 
                              (course.title && course.title.toLowerCase().includes(searchQuery)) ||
                              course.category.toLowerCase().includes(searchQuery) ||
                              course.overview.toLowerCase().includes(searchQuery) ||
                              (course.careerRoles && course.careerRoles.toLowerCase().includes(searchQuery)) ||
                              course.skills.some(s => s.toLowerCase().includes(searchQuery));

        return matchesCat && matchesDuration && matchesSearch;
    });

    // Sorting
    if (sortQuery === 'fee-asc') {
        filtered.sort((a, b) => a.fee - b.fee);
    } else if (sortQuery === 'fee-desc') {
        filtered.sort((a, b) => b.fee - a.fee);
    } else if (sortQuery === 'duration-asc') {
        filtered.sort((a, b) => a.duration - b.duration);
    } else if (sortQuery === 'duration-desc') {
        filtered.sort((a, b) => b.duration - a.duration);
    } else if (sortQuery === 'title-asc') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    renderCoursesList(filtered, 'all-courses-grid');

    // Update live counts
    const countEl = document.getElementById('courses-count');
    const totalEl = document.getElementById('courses-total');
    if (countEl) countEl.textContent = filtered.length;
    if (totalEl) totalEl.textContent = COURSES_DATA.length;

    const noResults = document.getElementById('no-courses-found');
    if (noResults) {
        if (filtered.length === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }
    }
}

function resetFilters() {
    const searchInput = document.getElementById('course-search-input');
    if (searchInput) searchInput.value = '';
    const durationFilter = document.getElementById('duration-filter');
    if (durationFilter) durationFilter.value = 'all';
    const sortFilter = document.getElementById('sort-filter');
    if (sortFilter) sortFilter.value = 'default';
    setCategoryFilter('all');
}


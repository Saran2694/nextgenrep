// EXPLORE OUR CAPABILITIES — 3D CINEMATIC CAROUSEL ENGINE
// Inspired by Reference Image 2 (Stacked 3D Depth, Editorial Glass)
// ============================================================

let currentCapabilityIndex = 0;
const TOTAL_CAPABILITIES = 7;
let isCinematicDragging = false;
let cinematicDragStartX = 0;
let cinematicDragCurrentX = 0;
let cinematicDragThreshold = false;

function rotateCapabilities(direction) {
    currentCapabilityIndex = (currentCapabilityIndex + direction + TOTAL_CAPABILITIES) % TOTAL_CAPABILITIES;
    updateCinematicCarousel();
}

function setCapabilityActive(index) {
    if (index >= 0 && index < TOTAL_CAPABILITIES) {
        currentCapabilityIndex = index;
        updateCinematicCarousel();
    }
}

function handleCardClick(index) {
    if (cinematicDragThreshold) return; // Prevent card click if dragged
    
    if (index === currentCapabilityIndex) {
        // Active center card clicked — browse programs
        navigateToTab('courses');
    } else {
        // Side card clicked — rotate into center focus
        setCapabilityActive(index);
    }
}

// Backward compatibility alias for any existing caller
function scrollArcGallery(direction) {
    rotateCapabilities(direction);
}

function updateCinematicCarousel() {
    const stage = document.getElementById('cinematic-stage');
    const cards = document.querySelectorAll('.cinematic-card');
    const dockItems = document.querySelectorAll('.cinematic-dock-item');
    if (!stage || !cards || cards.length === 0) return;

    const width = window.innerWidth;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;

    cards.forEach((card) => {
        const cardIndex = parseInt(card.getAttribute('data-index'), 10);
        
        // Compute cyclic relative offset around active index: -3, -2, -1, 0, 1, 2, 3
        let diff = (cardIndex - currentCapabilityIndex) % TOTAL_CAPABILITIES;
        if (diff < -Math.floor(TOTAL_CAPABILITIES / 2)) diff += TOTAL_CAPABILITIES;
        if (diff > Math.floor(TOTAL_CAPABILITIES / 2)) diff -= TOTAL_CAPABILITIES;

        const absDiff = Math.abs(diff);
        const sign = Math.sign(diff);

        let tx = 0;
        let tz = 0;
        let ry = 0;
        let scale = 1;
        let zIndex = 30;
        let opacity = 1;
        let brightness = 1;
        let blur = 0;

        if (diff === 0) {
            // Central active card: Dominant, forward, straight, brightest
            tx = 0;
            tz = 0;
            ry = 0;
            scale = isMobile ? 1.0 : (isTablet ? 0.98 : 1.0);
            zIndex = 30;
            opacity = 1;
            brightness = 1;
            blur = 0;
        } else if (absDiff === 1) {
            // Immediate left/right neighbors: Tilted inward, stacked slightly behind
            if (isMobile) {
                tx = sign * 80;
                tz = -70;
                ry = -sign * 12;
                scale = 0.85;
                zIndex = 20;
                opacity = 0.38;
                brightness = 0.65;
            } else if (isTablet) {
                tx = sign * 165;
                tz = -90;
                ry = -sign * 16;
                scale = 0.83;
                zIndex = 20;
                opacity = 0.85;
                brightness = 0.72;
            } else {
                tx = sign * 215;
                tz = -110;
                ry = -sign * 18;
                scale = 0.86;
                zIndex = 20;
                opacity = 0.88;
                brightness = 0.74;
            }
        } else if (absDiff === 2) {
            // Mid-tier cards: Further back and steeper angle
            if (isMobile) {
                tx = sign * 140;
                tz = -140;
                ry = -sign * 18;
                scale = 0.7;
                zIndex = 10;
                opacity = 0; // Hide on mobile to prevent overflow
                brightness = 0.3;
            } else if (isTablet) {
                tx = sign * 300;
                tz = -180;
                ry = -sign * 24;
                scale = 0.68;
                zIndex = 10;
                opacity = 0.45;
                brightness = 0.48;
                blur = 0.5;
            } else {
                tx = sign * 390;
                tz = -220;
                ry = -sign * 28;
                scale = 0.72;
                zIndex = 10;
                opacity = 0.55;
                brightness = 0.50;
                blur = 0.5;
            }
        } else {
            // Outer cards (diff === 3 or -3): Faded out in background depth
            if (isMobile || isTablet) {
                tx = sign * 380;
                tz = -260;
                ry = -sign * 30;
                scale = 0.55;
                zIndex = 5;
                opacity = 0;
                brightness = 0.2;
            } else {
                tx = sign * 530;
                tz = -330;
                ry = -sign * 36;
                scale = 0.60;
                zIndex = 5;
                opacity = 0.28;
                brightness = 0.32;
                blur = 1;
            }
        }

        // Apply calculated 3D transformation
        card.style.transform = `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`;
        card.style.zIndex = zIndex;
        card.style.opacity = opacity;
        card.style.filter = `brightness(${brightness})${blur > 0 ? ` blur(${blur}px)` : ''}`;
        card.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';

        // Toggle active highlight state
        const isActive = (diff === 0);
        card.classList.toggle('is-active', isActive);

        // Update progress bar and counter inside the card
        const indexEl = card.querySelector('.cinematic-card-index');
        const progressLine = card.querySelector('.cinematic-card-progressline');
        if (indexEl) {
            indexEl.textContent = `0${currentCapabilityIndex + 1} / 0${TOTAL_CAPABILITIES}`;
        }
        if (progressLine) {
            progressLine.style.width = `${((currentCapabilityIndex + 1) / TOTAL_CAPABILITIES) * 100}%`;
        }
    });

    // Update floating dock active indicators
    dockItems.forEach((item) => {
        const itemIndex = parseInt(item.getAttribute('data-index'), 10);
        const isActive = (itemIndex === currentCapabilityIndex);
        item.classList.toggle('is-active', isActive);
        if (isActive && item.scrollIntoView && window.innerWidth < 640) {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    });
}

function initCinematicCarouselControls() {
    const stage = document.getElementById('cinematic-stage');
    if (!stage) return;

    // Mouse Drag Handling
    stage.addEventListener('mousedown', (e) => {
        isCinematicDragging = true;
        cinematicDragThreshold = false;
        cinematicDragStartX = e.pageX;
        cinematicDragCurrentX = e.pageX;
        stage.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', (e) => {
        if (!isCinematicDragging) return;
        cinematicDragCurrentX = e.pageX;
        const deltaX = cinematicDragCurrentX - cinematicDragStartX;
        if (Math.abs(deltaX) > 8) {
            cinematicDragThreshold = true;
        }
    });

    window.addEventListener('mouseup', () => {
        if (!isCinematicDragging) return;
        isCinematicDragging = false;
        stage.classList.remove('is-dragging');
        
        const deltaX = cinematicDragCurrentX - cinematicDragStartX;
        if (Math.abs(deltaX) > 45) {
            if (deltaX < 0) {
                rotateCapabilities(1); // Dragged left -> advance next
            } else {
                rotateCapabilities(-1); // Dragged right -> advance prev
            }
        }
        setTimeout(() => { cinematicDragThreshold = false; }, 60);
    });

    // Touch Swipe Handling for Mobile / Tablets
    stage.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isCinematicDragging = true;
            cinematicDragThreshold = false;
            cinematicDragStartX = e.touches[0].pageX;
            cinematicDragCurrentX = e.touches[0].pageX;
        }
    }, { passive: true });

    stage.addEventListener('touchmove', (e) => {
        if (!isCinematicDragging || e.touches.length !== 1) return;
        cinematicDragCurrentX = e.touches[0].pageX;
        const deltaX = cinematicDragCurrentX - cinematicDragStartX;
        if (Math.abs(deltaX) > 10) {
            cinematicDragThreshold = true;
        }
    }, { passive: true });

    stage.addEventListener('touchend', () => {
        if (!isCinematicDragging) return;
        isCinematicDragging = false;
        
        const deltaX = cinematicDragCurrentX - cinematicDragStartX;
        if (Math.abs(deltaX) > 40) {
            if (deltaX < 0) {
                rotateCapabilities(1); // Swiped left -> next
            } else {
                rotateCapabilities(-1); // Swiped right -> prev
            }
        }
        setTimeout(() => { cinematicDragThreshold = false; }, 60);
    }, { passive: true });

    // Keyboard Arrow Controls (Left / Right Arrow)
    window.addEventListener('keydown', (e) => {
        // Ignore if user is currently typing in an input, textarea or select
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;

        // Check if section is roughly in view
        const section = document.getElementById('capabilities-section');
        if (section) {
            const rect = section.getBoundingClientRect();
            const isInView = (rect.top < window.innerHeight && rect.bottom > 0);
            if (!isInView) return;
        }

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            rotateCapabilities(-1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            rotateCapabilities(1);
        }
    });

    // Window resize handler to readjust 3D scale and offsets
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateCinematicCarousel, 60);
    });

    // Initial 3D Layout Calculation
    updateCinematicCarousel();
}

// Auto-initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCinematicCarouselControls);
} else {
    initCinematicCarouselControls();
}

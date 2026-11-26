// ── NEXTGEN DMA VENTURES — Course Renderer & Modal Component ──

// =========================================================================

function createCourseCardHTML(course) {
    const primaryRole = course.careerRoles ? course.careerRoles.split(',')[0].trim() : 'Specialist';
    const skillsList = course.skills || course.tools || [];
    
    return `
      <article class="course-tile group">
        <!-- Full Background Cover Image (Image Alone Without Black Overlay) -->
        <div class="course-img-bg-wrap">
          <img src="${course.image}" alt="${course.name}" class="course-bg-img" loading="lazy">
        </div>

        <!-- Top Floating Frosted Glass Pills (matching 'starts at ₱4,999' reference) -->
        <div class="course-top-bar">
          <span class="course-badge-pill">${course.badge} &bull; ${course.durationText}</span>
          <span class="course-starts-pill">starts at ₹2,499</span>
        </div>

        <!-- Text Content Layered Directly Over Image at Bottom -->
        <div class="course-overlay-content">
          <span class="course-domain-tag">${course.category}</span>
          <h3 class="course-card-title">${course.name}</h3>
          
          <div class="course-meta-row">
            <span>${course.durationText}</span>
            <span class="text-white/40">&bull;</span>
            <span><i class="fa-solid fa-star text-mint text-[11px] mr-1"></i>Internship Incl.</span>
          </div>

          <div class="course-location-row">
            <i class="fa-solid fa-location-dot text-[#ef4444] text-[11px]"></i>
            <span>${primaryRole} &bull; Bangalore &amp; Remote</span>
          </div>

          <!-- Skills tags in frosted glass pills -->
          <div class="course-tags-row">
            ${skillsList.slice(0, 3).map(skill => `<span class="course-tag-glass">${skill}</span>`).join('')}
            ${skillsList.length > 3 ? `<span class="course-tag-glass">+${skillsList.length - 3}</span>` : ''}
          </div>

          <!-- Bottom Fee & Buttons -->
          <div class="course-bottom-bar">
            <div>
              <div class="course-fee-label">TOTAL FEE</div>
              <div class="course-fee-val">${course.formattedFee}</div>
            </div>
            <div class="course-actions-group">
              <button onclick="openCourseModal('${course.id}')" class="course-btn-details" aria-label="View Details for ${course.name}">
                <span>Details</span> <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </button>
              <button onclick="openBookingModal('${course.id}', 'advance')" class="course-btn-book" aria-label="Book Slot for ${course.name}">
                <span>Book Slot</span>
              </button>
            </div>
          </div>
        </div>
      </article>`;
}

function renderFeaturedCourses() {
    const container = document.getElementById('featured-courses-container');
    if (!container) return;
    // Featured selection: AI, Web, Cyber, SolidWorks, EV Tech, AI in Auto
    const featuredIds = ["ai-001", "sd-001", "si-001", "me-004", "ae-001", "at-001"];
    const featured = COURSES_DATA.filter(c => featuredIds.includes(c.id));
    container.innerHTML = featured.map(c => createCourseCardHTML(c)).join('');
}

function renderAllCoursesGrid() {
    renderCoursesList(COURSES_DATA, 'all-courses-grid');
    const countEl = document.getElementById('courses-count');
    const totalEl = document.getElementById('courses-total');
    if (countEl) countEl.textContent = COURSES_DATA.length;
    if (totalEl) totalEl.textContent = COURSES_DATA.length;
}

function renderCoursesList(list, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = list.map(c => createCourseCardHTML(c)).join('');
}



// =========================================================================

function openCourseModal(courseId) {
    const course = COURSES_DATA.find(c => c.id === courseId);
    if (!course) return;

    const modalHolder = document.getElementById('modal-content-container');
    const encodedCourse = encodeURIComponent(course.name);
    const waLink = `https://wa.me/919787076296?text=Hi%20Nextgen%20DMA,%20I%20want%20to%20enquire%20about%20the%20${encodedCourse}%20course%20(${course.durationText},%20Fee:%20${encodeURIComponent(course.formattedFee)}).`;

    const skillsList = course.skills || course.tools || [];
    const outcomesList = course.learningOutcomes || course.modules || [];
    const advanceFee = 2499;
    const remainingBalance = course.fee - advanceFee;

    modalHolder.innerHTML = `
        <!-- Hero Header -->
        <div class="relative h-64 sm:h-72 overflow-hidden border-b border-white/10">
            <img src="${course.image}" alt="${course.name}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
            <div class="absolute bottom-5 left-6 right-6 text-white">
                <span class="px-3 py-1 bg-black/80 backdrop-blur-md text-[#65D2C5] border border-[#65D2C5]/40 text-[10px] font-mono font-bold uppercase rounded-full tracking-wider">
                    ${course.category}
                </span>
                <h2 class="font-display text-3xl sm:text-4xl uppercase text-white mt-2 leading-none">${course.name}</h2>
                <div class="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 mt-2">
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-clock text-[#65D2C5]"></i> ${course.durationText} Total Duration</span>
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-briefcase text-[#65D2C5]"></i> Real Production Capstone</span>
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-certificate text-[#65D2C5]"></i> Bangalore Industry Certified</span>
                </div>
            </div>
        </div>

        <div class="p-6 sm:p-8 space-y-6 text-white">
            
            <!-- PROMINENT BOOK YOUR SLOT SECTION (FIXED ADVANCE ₹2,499 VS FULL PAYMENT) -->
            <div class="p-6 rounded-2xl bg-gradient-to-br from-[#172126] to-[#0a0f12] border-2 border-[#65D2C5] shadow-2xl space-y-4 relative overflow-hidden">
                <div class="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#65D2C5]/10 filter blur-2xl pointer-events-none"></div>

                <div class="flex items-center justify-between flex-wrap gap-2">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-[#65D2C5] animate-ping"></span>
                        <span class="font-mono text-xs uppercase font-extrabold text-[#65D2C5] tracking-widest">
                            Admissions Open &bull; Instant Slot Reservation
                        </span>
                    </div>
                    <span class="px-3 py-1 bg-[#65D2C5] text-black font-mono font-black text-xs uppercase rounded-full tracking-wider shadow">
                        Fixed Advance: ₹2,499
                    </span>
                </div>

                <div>
                    <h3 class="font-display text-3xl sm:text-4xl uppercase text-white tracking-wide">
                        Book Your Slot &ndash; <span class="text-[#65D2C5]">₹2,499</span>
                    </h3>
                    <p class="text-xs text-slate-300 font-sans mt-1 leading-relaxed">
                        Reserve your course registration slot by paying ₹2,499 and confirm your admission process.
                    </p>
                </div>

                <!-- Two Payment Options Comparison Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs pt-1">
                    
                    <!-- 1. Pay Advance – ₹2,499 -->
                    <div class="p-4 rounded-xl bg-white/5 border border-[#65D2C5]/60 flex flex-col justify-between hover:bg-white/10 transition group">
                        <div>
                            <div class="flex items-center justify-between">
                                <span class="font-mono text-[10px] text-[#65D2C5] uppercase font-bold tracking-wider">Option 1: Slot Reservation</span>
                                <span class="w-2 h-2 rounded-full bg-[#65D2C5]"></span>
                            </div>
                            <div class="text-2xl font-display text-white mt-1.5 font-bold">
                                Pay Advance &ndash; <span class="text-[#65D2C5]">₹2,499</span>
                            </div>
                            <p class="text-[11px] text-slate-300 mt-1 font-sans leading-relaxed">
                                Pay ₹2,499 to reserve the course slot. This amount will be adjusted against the total course fee.
                            </p>
                            <div class="mt-3 pt-2.5 border-t border-white/10 font-mono text-[11px] text-amber-300 flex items-center justify-between">
                                <span>Remaining Balance:</span>
                                <strong>₹${remainingBalance.toLocaleString('en-IN')}</strong>
                            </div>
                            <div class="text-[10px] text-slate-400 font-mono mt-1">Status: Advance Paid &ndash; Slot Reserved</div>
                        </div>
                        <button onclick="openBookingModal('${course.id}', 'advance')" class="mt-4 w-full py-3 bg-[#65D2C5] hover:bg-[#8ae2d8] text-black font-mono font-bold text-xs uppercase rounded-lg transition shadow-lg shadow-[#65D2C5]/20 flex items-center justify-center gap-2">
                            <i class="fa-solid fa-ticket text-xs"></i>
                            <span>Reserve Slot For ₹2,499</span>
                        </button>
                    </div>

                    <!-- 2. Pay Full Course Fee -->
                    <div class="p-4 rounded-xl bg-white/5 border border-white/20 flex flex-col justify-between hover:border-[#65D2C5]/40 transition group">
                        <div>
                            <div class="flex items-center justify-between">
                                <span class="font-mono text-[10px] text-slate-400 uppercase font-bold tracking-wider">Option 2: 100% Cleared</span>
                                <span class="w-2 h-2 rounded-full bg-slate-500"></span>
                            </div>
                            <div class="text-2xl font-display text-white mt-1.5 font-bold">
                                Pay Full Fee &ndash; <span class="text-white">${course.formattedFee}</span>
                            </div>
                            <p class="text-[11px] text-slate-300 mt-1 font-sans leading-relaxed">
                                Pay the entire course fee in one single transaction. Zero remaining balance.
                            </p>
                            <div class="mt-3 pt-2.5 border-t border-white/10 font-mono text-[11px] text-emerald-400 flex items-center justify-between">
                                <span>Remaining Balance:</span>
                                <strong>₹0 (Fully Paid)</strong>
                            </div>
                            <div class="text-[10px] text-slate-400 font-mono mt-1">Status: Fully Paid (Zero Balance)</div>
                        </div>
                        <button onclick="openBookingModal('${course.id}', 'full')" class="mt-4 w-full py-3 bg-white/10 hover:bg-white/20 border border-[#65D2C5]/40 text-white hover:text-[#65D2C5] font-mono font-bold text-xs uppercase rounded-lg transition flex items-center justify-center gap-2">
                            <i class="fa-solid fa-credit-card text-xs"></i>
                            <span>Pay Full Course Fee</span>
                        </button>
                    </div>

                </div>
            </div>

            <!-- OFFICIAL FEE DETAILS BREAKDOWN SECTION -->
            <div class="p-5 rounded-2xl bg-black/80 border border-[#65D2C5]/40 backdrop-blur-md shadow-xl">
                <div class="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-white/10">
                    <div>
                        <div class="text-[10px] font-mono uppercase font-bold tracking-widest text-slate-400">Total Official Course Fee</div>
                        <div class="text-3xl sm:text-4xl font-display text-white mt-1 tracking-wide">
                            <span class="text-[#65D2C5]">${course.formattedFee}</span>
                            <span class="text-xs font-mono text-slate-400 ml-1">INR (Official Fee)</span>
                        </div>
                    </div>
                    <div class="text-left sm:text-right">
                        <div class="text-[10px] font-mono uppercase font-bold tracking-widest text-slate-400">Program Duration</div>
                        <div class="text-xl font-mono font-bold text-white mt-1 flex items-center sm:justify-end gap-2">
                            <i class="fa-regular fa-calendar-check text-[#65D2C5]"></i>
                            <span>${course.durationText} (${course.duration} Weeks)</span>
                        </div>
                    </div>
                </div>
                <div class="pt-3 text-xs text-slate-300 font-mono flex items-start gap-2.5">
                    <i class="fa-solid fa-circle-info text-[#65D2C5] mt-0.5"></i>
                    <div>
                        <strong class="text-white">Payment Information:</strong> Contact our admissions team for payment options or pay online via Razorpay.
                    </div>
                </div>
            </div>

            <!-- Course Overview -->
            <div>
                <h3 class="text-xs font-mono font-bold uppercase tracking-wider text-[#65D2C5] mb-2 flex items-center gap-2">
                    <i class="fa-solid fa-book-open"></i> Course Overview
                </h3>
                <p class="text-slate-300 text-sm leading-relaxed">${course.overview}</p>
            </div>

            <!-- Skills Covered -->
            <div>
                <h3 class="text-xs font-mono font-bold uppercase tracking-wider text-[#65D2C5] mb-2.5 flex items-center gap-2">
                    <i class="fa-solid fa-wrench"></i> Skills &amp; Technologies Covered
                </h3>
                <div class="flex flex-wrap gap-2">
                    ${skillsList.map(skill => `<span class="bg-white/10 border border-[#65D2C5]/30 text-[#65D2C5] font-mono text-xs font-semibold px-3 py-1.5 rounded-lg">${skill}</span>`).join('')}
                </div>
            </div>

            <!-- Learning Outcomes -->
            <div>
                <h3 class="text-xs font-mono font-bold uppercase tracking-wider text-[#65D2C5] mb-2.5 flex items-center gap-2">
                    <i class="fa-solid fa-list-check"></i> Key Learning Outcomes
                </h3>
                <div class="space-y-2">
                    ${outcomesList.map(outcome => `
                        <div class="p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-start gap-3">
                            <div class="w-5 h-5 rounded-full bg-[#65D2C5]/20 text-[#65D2C5] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#65D2C5]/40">✓</div>
                            <span class="text-xs font-medium text-slate-200 leading-relaxed">${outcome}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Internship Information -->
            <div class="p-4 rounded-xl bg-white/5 border border-white/10">
                <h3 class="text-xs font-mono font-bold uppercase tracking-wider text-[#65D2C5] mb-1.5 flex items-center gap-2">
                    <i class="fa-solid fa-building-columns"></i> Internship &amp; Practical Capstone
                </h3>
                <p class="text-xs text-slate-300 leading-relaxed">${course.internship}</p>
                <div class="mt-2 text-[11px] font-mono text-slate-400">
                    <strong class="text-[#65D2C5]">Deliverables:</strong> GitHub / CAD Repo, Code Review Signoff, Official Industry Internship Certificate.
                </div>
            </div>

            <!-- Target Roles & Audience -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs">
                <div>
                    <span class="font-mono font-bold text-[#65D2C5] block mb-1">
                        <i class="fa-solid fa-users mr-1"></i> Target Audience:
                    </span>
                    <span class="text-slate-300 leading-relaxed">${course.targetAudience}</span>
                </div>
                <div>
                    <span class="font-mono font-bold text-[#65D2C5] block mb-1">
                        <i class="fa-solid fa-briefcase mr-1"></i> Career Pathways:
                    </span>
                    <span class="text-slate-300 leading-relaxed">${course.careerRoles}</span>
                </div>
            </div>

            <!-- Action Buttons: Direct Booking, General Enquiry & WhatsApp -->
            <div class="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                <button onclick="openBookingModal('${course.id}', 'advance')" class="flex-1 py-3.5 bg-[#65D2C5] hover:bg-[#8ae2d8] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-full transition shadow-lg shadow-[#65D2C5]/20 flex items-center justify-center gap-2">
                    <i class="fa-solid fa-bolt"></i> Book Slot Now (₹2,499)
                </button>
                <button onclick="applyForCourse('${course.id}')" class="py-3.5 px-6 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-full transition flex items-center justify-center gap-2">
                    <i class="fa-solid fa-paper-plane text-xs"></i> General Enquiry
                </button>
                <a href="${waLink}" target="_blank" class="py-3.5 px-6 bg-white/10 hover:bg-white/20 border border-[#65D2C5]/40 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-full transition flex items-center justify-center gap-2">
                    <i class="fa-brands fa-whatsapp text-[#65D2C5] text-base"></i> WhatsApp
                </a>
            </div>
        </div>
    `;

    document.getElementById('course-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeCourseModal() {
    document.getElementById('course-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}


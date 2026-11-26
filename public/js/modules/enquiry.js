// =========================================================================

function applyForCourse(courseId) {
    closeCourseModal();
    const course = COURSES_DATA.find(c => c.id === courseId);
    if (!course) return;

    navigateToTab('contact');

    // Automatically populate Selected Course and Course Fee
    const select = document.getElementById('form-course');
    if (select) {
        select.value = course.name;
    }

    const feeInput = document.getElementById('form-fee');
    if (feeInput) {
        feeInput.value = `${course.formattedFee} (${course.durationText})`;
    }

    // Scroll smoothly to the enquiry form section
    const enquirySection = document.getElementById('enquiry-form-section');
    if (enquirySection) {
        enquirySection.scrollIntoView({ behavior: 'smooth' });
    }

    // Focus on the student name field
    const nameField = document.getElementById('form-name');
    if (nameField) {
        setTimeout(() => nameField.focus(), 400);
    }
}

function scrollToEnquiry(courseTitle, courseFee) {
    navigateToTab('contact');

    if (courseTitle) {
        const select = document.getElementById('form-course');
        if (select) {
            select.value = courseTitle;
        }
        const matched = COURSES_DATA.find(c => c.name === courseTitle || c.title === courseTitle);
        const feeInput = document.getElementById('form-fee');
        if (feeInput) {
            feeInput.value = matched ? `${matched.formattedFee} (${matched.durationText})` : (courseFee || '');
        }
    }

    const enquirySection = document.getElementById('enquiry-form-section');
    if (enquirySection) {
        enquirySection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Form Validation and Submission with Clean API Integration Point
function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const phone = document.getElementById('form-phone').value.trim();
    const college = document.getElementById('form-college') ? document.getElementById('form-college').value.trim() : '';
    const course = document.getElementById('form-course').value;
    const fee = document.getElementById('form-fee') ? document.getElementById('form-fee').value : '';
    const message = document.getElementById('form-message') ? document.getElementById('form-message').value.trim() : '';
    const learningMode = document.querySelector('input[name="learning-mode"]:checked') ? document.querySelector('input[name="learning-mode"]:checked').value : 'Bangalore Classroom';

    const errorBanner = document.getElementById('form-error-message');
    const successBanner = document.getElementById('form-success-message');

    if (errorBanner) errorBanner.classList.add('hidden');
    if (successBanner) successBanner.classList.add('hidden');

    // Validation 1: Required Fields
    if (!name || !email || !phone || !course) {
        showFormError("Please fill in all required fields (Name, Email, Mobile Number, and Selected Course).");
        return;
    }

    // Validation 2: Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormError("Please provide a valid email address (e.g. rahul@example.com).");
        return;
    }

    // Validation 3: Phone number (at least 10 digits)
    const phoneDigits = phone.replace(/[^0-9]/g, '');
    if (phoneDigits.length < 10) {
        showFormError("Please provide a valid mobile number with at least 10 digits.");
        return;
    }

    // Prepared application payload
    const applicationPayload = {
        studentName: name,
        email: email,
        mobileNumber: phone,
        collegeOrInstitution: college || 'Not Specified',
        selectedCourse: course,
        courseFee: fee,
        learningMode: learningMode,
        message: message,
        submittedAt: new Date().toISOString()
    };

    // Clean API Integration Point
    submitCourseApplicationAPI(applicationPayload)
        .then(response => {
            if (successBanner) {
                const detailsSpan = document.getElementById('success-course-details');
                if (detailsSpan) {
                    detailsSpan.textContent = `Applied for: ${course} — Fee: ${fee}`;
                }
                successBanner.classList.remove('hidden');
            }
            document.getElementById('enquiry-form').reset();
            const feeInput = document.getElementById('form-fee');
            if (feeInput) feeInput.value = '';

            setTimeout(() => {
                if (successBanner) successBanner.classList.add('hidden');
            }, 8000);
        })
        .catch(err => {
            showFormError("There was a problem sending your enquiry. Please try again or message our team directly via WhatsApp.");
        });
}

function showFormError(msg) {
    let errorBanner = document.getElementById('form-error-message');
    if (!errorBanner) {
        alert(msg);
        return;
    }
    const errorText = document.getElementById('form-error-text');
    if (errorText) errorText.textContent = msg;
    errorBanner.classList.remove('hidden');
}

// Clean API Integration Handler (Ready for Backend/Webhook Integration)
async function submitCourseApplicationAPI(payload) {
    console.log("=== NEXTGEN DMA VENTURES COURSE APPLICATION PAYLOAD ===", payload);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                status: "success",
                statusCode: 200,
                message: "Application recorded successfully.",
                data: payload
            });
        }, 500);
    });
}


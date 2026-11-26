// RAZORPAY COURSE BOOKING & PAYMENT GATEWAY INTEGRATION
// =========================================================================

let lastVerifiedRegId = null;

function openBookingModal(courseId, preferredPaymentType = 'advance') {
    closeCourseModal();
    const course = COURSES_DATA.find(c => c.id === courseId);
    if (!course) return;

    // Populate Modal Elements
    document.getElementById('book-course-id').value = course.id;
    document.getElementById('book-course-name').textContent = course.name;
    document.getElementById('book-course-duration').textContent = `${course.durationText} Program`;
    document.getElementById('book-course-total-fee').textContent = course.formattedFee;
    document.getElementById('book-full-fee-display').textContent = course.formattedFee;

    // Remaining balance for advance option
    const advanceBalance = course.fee - 2499;
    document.getElementById('book-advance-balance').textContent = `₹${advanceBalance.toLocaleString('en-IN')}`;

    // Select the radio button
    const radios = document.getElementsByName('booking-payment-type');
    radios.forEach(r => {
        r.checked = (r.value === preferredPaymentType);
    });

    // Reset error banner
    const errBanner = document.getElementById('booking-error-banner');
    if (errBanner) errBanner.classList.add('hidden');

    updatePaymentCalculation();

    document.getElementById('booking-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
    document.getElementById('booking-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function updatePaymentCalculation() {
    const courseId = document.getElementById('book-course-id').value;
    const course = COURSES_DATA.find(c => c.id === courseId);
    if (!course) return;

    const radios = document.getElementsByName('booking-payment-type');
    let selectedType = 'advance';
    radios.forEach(r => {
        if (r.checked) selectedType = r.value;
    });

    const isAdvance = selectedType === 'advance';
    const amountToPay = isAdvance ? 2499 : course.fee;
    const remainingBalance = isAdvance ? (course.fee - 2499) : 0;

    // Update summary box
    document.getElementById('summary-total-fee').textContent = course.formattedFee;
    document.getElementById('summary-payable-now').textContent = `₹${amountToPay.toLocaleString('en-IN')}`;
    document.getElementById('summary-remaining-balance').textContent = `₹${remainingBalance.toLocaleString('en-IN')}`;

    // Update button label
    const btnLabel = document.getElementById('book-pay-btn-label');
    if (btnLabel) {
        btnLabel.textContent = isAdvance ? 'PROCEED TO PAY ₹2,499 (RAZORPAY)' : `PROCEED TO PAY ${course.formattedFee} (RAZORPAY)`;
    }

    // Toggle card highlights
    const cardAdvance = document.getElementById('card-option-advance');
    const cardFull = document.getElementById('card-option-full');
    if (cardAdvance && cardFull) {
        if (isAdvance) {
            cardAdvance.classList.add('border-mint', 'bg-white/10');
            cardAdvance.classList.remove('border-white/20');
            cardFull.classList.remove('border-mint', 'bg-white/10');
            cardFull.classList.add('border-white/20');
        } else {
            cardFull.classList.add('border-mint', 'bg-white/10');
            cardFull.classList.remove('border-white/20');
            cardAdvance.classList.remove('border-mint', 'bg-white/10');
            cardAdvance.classList.add('border-white/20');
        }
    }
}

// Student Registration and Razorpay Checkout Submission
async function handleBookingFormSubmit(e) {
    e.preventDefault();

    const courseId = document.getElementById('book-course-id').value;
    const course = COURSES_DATA.find(c => c.id === courseId);
    if (!course) {
        showBookingError("Please select a valid course track.");
        return;
    }

    const name = document.getElementById('book-name').value.trim();
    const email = document.getElementById('book-email').value.trim();
    const phone = document.getElementById('book-phone').value.trim();
    const whatsapp = document.getElementById('book-whatsapp').value.trim();
    const college = document.getElementById('book-college').value.trim();
    const department = document.getElementById('book-department').value.trim();
    const year = document.getElementById('book-year').value;
    const state = document.getElementById('book-state').value.trim();

    const radios = document.getElementsByName('booking-payment-type');
    let paymentType = 'advance';
    radios.forEach(r => { if (r.checked) paymentType = r.value; });

    // Validation
    if (!name || !email || !phone) {
        showBookingError("Please fill in all required fields (Name, Email, Mobile).");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showBookingError("Please enter a valid email address.");
        return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
        showBookingError("Please enter a valid 10-digit mobile number.");
        return;
    }

    const payBtn = document.getElementById('book-pay-btn');
    payBtn.disabled = true;
    payBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Connecting to Razorpay...</span>';

    try {
        // Step 1: Initiate Student Registration on Backend
        const initRes = await fetch('/api/registration/initiate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                full_name: name,
                email,
                phone: cleanPhone,
                whatsapp: whatsapp || cleanPhone,
                college,
                department,
                year_of_study: year,
                state,
                course_id: course.id,
                course_name: course.name,
                payment_type: paymentType
            })
        });

        const initData = await initRes.json();
        if (!initRes.ok || !initData.success) {
            throw new Error(initData.error || 'Failed to initiate admission registration.');
        }

        const registrationId = initData.registration_id;

        // Step 2: Create Razorpay Order on Backend
        const orderRes = await fetch('/api/payment/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ registration_id: registrationId })
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok || !orderData.success) {
            throw new Error(orderData.error || 'Failed to create payment order on server.');
        }

        if (!orderData.key_id || orderData.key_id.includes('placeholder')) {
            throw new Error('Online payment gateway is temporarily unconfigured. Please contact NEXTGEN DMA VENTURES admissions.');
        }

        // Step 3: Initialize Razorpay Checkout Window
        const isAdvance = paymentType === 'advance';
        const options = {
            key: orderData.key_id,
            amount: orderData.amount, // in paise
            currency: "INR",
            name: "NEXTGEN DMA VENTURES",
            description: `${isAdvance ? 'Advance Slot Reservation' : 'Full Payment'} - ${course.name}`,
            image: "./logo.jpeg",
            order_id: orderData.order_id,
            handler: async function (response) {
                // Step 4: Server-Side Signature Verification
                payBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Verifying Payment Signature...</span>';
                await verifyPaymentWithBackend({
                    registration_id: registrationId,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                });
            },
            prefill: {
                name: name,
                email: email,
                contact: cleanPhone
            },
            notes: {
                registration_id: registrationId,
                course_name: course.name,
                payment_type: paymentType
            },
            theme: {
                color: "#65D2C5"
            },
            modal: {
                ondismiss: function () {
                    // Record payment abandoned / cancelled
                    fetch('/api/payment/payment-failed', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            registration_id: registrationId,
                            razorpay_order_id: orderData.order_id,
                            error_description: 'Payment modal closed before transaction completion'
                        })
                    });
                    showBookingError('Payment cancelled. Your registration ID is ' + registrationId + '. You can retry payment anytime.');
                    resetBookingPayBtn();
                }
            }
        };

        // Open Razorpay Checkout Window
        if (typeof Razorpay !== 'undefined') {
            const rzp = new Razorpay(options);
            rzp.on('payment.failed', function (resp) {
                fetch('/api/payment/payment-failed', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        registration_id: registrationId,
                        razorpay_order_id: orderData.order_id,
                        error_description: resp.error ? resp.error.description : 'Payment failed'
                    })
                });
                showBookingError('Payment Failed: ' + (resp.error ? resp.error.description : 'Transaction was declined'));
                resetBookingPayBtn();
            });
            rzp.open();
        } else {
            // Strict error on checkout script loading failure — never simulate success
            throw new Error('Razorpay secure checkout could not be loaded. Please ensure ad-blockers or privacy extensions are disabled, check your internet connection, or contact NEXTGEN DMA VENTURES admissions.');
        }

    } catch (err) {
        showBookingError(err.message);
        resetBookingPayBtn();
    }
}

// Server-side payment verification
async function verifyPaymentWithBackend(verificationData) {
    try {
        const verifyRes = await fetch('/api/payment/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(verificationData)
        });

        const verifyData = await verifyRes.json();
        if (!verifyRes.ok || !verifyData.success || !verifyData.verified) {
            throw new Error(verifyData.error || 'Server signature verification failed.');
        }

        lastVerifiedRegId = verifyData.registration_id;

        // Close checkout modal & show confirmed success screen
        closeBookingModal();
        displayPaymentSuccessModal(verifyData);

    } catch (err) {
        showBookingError('Payment Verification Alert: ' + err.message);
        resetBookingPayBtn();
    }
}

function displayPaymentSuccessModal(data) {
    const r = data.receipt || {};
    const isAdvance = r.payment_type === 'advance';

    document.getElementById('success-reg-id').textContent = data.registration_id;
    document.getElementById('success-student-name').textContent = r.student_name;
    document.getElementById('success-course-name').textContent = `${r.course_name} (${r.duration})`;
    document.getElementById('success-total-fee').textContent = `₹${Number(r.total_fee).toLocaleString('en-IN')}`;
    document.getElementById('success-amount-paid').textContent = `₹${Number(r.amount_paid).toLocaleString('en-IN')}`;
    document.getElementById('success-remaining-balance').textContent = `₹${Number(r.remaining_balance).toLocaleString('en-IN')}`;
    document.getElementById('success-payment-id').textContent = r.payment_id || 'Verified';
    document.getElementById('success-payment-status').textContent = isAdvance ? 'Advance Paid – Slot Reserved' : 'Fully Paid';

    const note = document.getElementById('success-tailored-note');
    if (note) {
        note.textContent = isAdvance
            ? 'Your ₹2,499 advance payment is confirmed. Your course slot reservation has been recorded and adjusted against your total fee.'
            : 'Your full course payment has been confirmed. Your seat is 100% secured.';
    }

    document.getElementById('payment-success-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
    document.getElementById('payment-success-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
    navigateToTab('home');
}

function downloadVerifiedReceipt() {
    if (!lastVerifiedRegId) {
        alert('Receipt ID not available.');
        return;
    }
    window.open(`/api/registration/status/${lastVerifiedRegId}?print=true`, '_blank');
}

function showBookingError(msg) {
    const errBanner = document.getElementById('booking-error-banner');
    const errText = document.getElementById('booking-error-text');
    if (errBanner && errText) {
        errText.textContent = msg;
        errBanner.classList.remove('hidden');
    } else {
        alert(msg);
    }
}

function resetBookingPayBtn() {
    const payBtn = document.getElementById('book-pay-btn');
    if (!payBtn) return;
    payBtn.disabled = false;
    updatePaymentCalculation();
}

// =========================================================================

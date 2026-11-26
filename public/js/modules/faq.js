function renderFaqs() {
    const container = document.getElementById('faq-container');
    if (!container) return;

    container.innerHTML = FAQ_DATA.map((faq, index) => `
        <div class="faq-item">
            <button onclick="toggleFaq(${index})" class="faq-question">
                <span>${faq.q}</span>
                <i class="fa-solid fa-chevron-down text-xs transition-transform duration-200" id="faq-icon-${index}" style="color:#65D2C5;flex-shrink:0;margin-left:14px;"></i>
            </button>
            <div id="faq-answer-${index}" class="hidden faq-answer">
                <p style="padding-top:14px;">${faq.a}</p>
            </div>
        </div>
    `).join('');
}

function toggleFaq(index) {
    const answer = document.getElementById(`faq-answer-${index}`);
    const icon = document.getElementById(`faq-icon-${index}`);

    if (answer.classList.contains('hidden')) {
        answer.classList.remove('hidden');
        icon.classList.add('rotate-180');
    } else {
        answer.classList.add('hidden');
        icon.classList.remove('rotate-180');
    }
}


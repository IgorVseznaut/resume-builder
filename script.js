// Данные пользователя
let userData = {
    jobTitle: '',
    industry: 'it',
    fullName: '',
    phone: '',
    email: '',
    hasExperience: null,
    noExperienceText: '',
    workExperienceText: '',
    photoDataURL: null,
    skillLevel: '',          // 'yes', 'basic', 'no' для SQL или других
    selectedSkills: []
};

// Переход к шагу 2 (после ввода личных данных)
function goToStep2() {
    const title = document.getElementById('jobTitle').value.trim();
    const name = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!title) {
        alert('Пожалуйста, введите желаемую должность');
        return;
    }
    if (!name) {
        alert('Пожалуйста, введите ваше ФИО');
        return;
    }
    if (!phone) {
        alert('Пожалуйста, введите телефон');
        return;
    }
    if (!email) {
        alert('Пожалуйста, введите email');
        return;
    }

    userData.jobTitle = title;
    userData.industry = document.getElementById('industry').value;
    userData.fullName = name;
    userData.phone = phone;
    userData.email = email;

    showStep('step2');
}

// Установка опыта
function setExperience(has) {
    userData.hasExperience = has;
    if (has) {
        // Меняем подсказку в зависимости от отрасли
        const hint = document.getElementById('experienceHint');
        const industry = userData.industry;
        if (industry === 'it') {
            hint.textContent = 'Опишите ваш стек технологий, проекты и достижения (желательно с цифрами).';
        } else if (industry === 'marketing') {
            hint.textContent = 'Расскажите о проведённых кампаниях, росте охватов, вовлечённости, бюджетах.';
        } else if (industry === 'sales') {
            hint.textContent = 'Укажите выполнение планов, объём продаж, количество привлечённых клиентов.';
        } else if (industry === 'finance') {
            hint.textContent = 'Опишите работу с отчётностью, бюджетирование, финансовый анализ.';
        } else {
            hint.textContent = 'Опишите ваши обязанности и достижения на предыдущих местах работы.';
        }
        showStep('step4');
    } else {
        showStep('step3');
    }
}

// Сохранение текста при отсутствии опыта
function saveNoExperience() {
    const text = document.getElementById('noExperienceText').value.trim();
    if (!text) {
        alert('Пожалуйста, опишите свои учебные проекты или курсы');
        return;
    }
    userData.noExperienceText = text;
    showSkillQuestion();
}

// Сохранение данных из трудовой и фото
function saveWorkData() {
    const text = document.getElementById('workExperienceText').value.trim();
    if (!text) {
        alert('Пожалуйста, введите данные из трудовой книжки или выписки');
        return;
    }
    userData.workExperienceText = text;
    const fileInput = document.getElementById('photoInput');
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            userData.photoDataURL = e.target.result;
            showSkillQuestion();
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        showSkillQuestion();
    }
}

// Умный вопрос про инструменты (SQL или другие)
function showSkillQuestion() {
    const questionEl = document.getElementById('skillQuestion');
    const answersEl = document.getElementById('skillAnswers');
    answersEl.innerHTML = '';

    const industry = userData.industry;
    const title = userData.jobTitle.toLowerCase();

    // Определяем, нужен ли SQL
    const needsSQL = (industry === 'it' || industry === 'finance' || 
                      title.includes('аналитик') || title.includes('разработчик') || 
                      title.includes('база данных') || title.includes('sql'));

    if (needsSQL) {
        questionEl.textContent = 'Знаете ли вы SQL?';
        answersEl.innerHTML = `
            <button onclick="setSkill('yes')">Да, уверенно</button>
            <button onclick="setSkill('basic')">Базово</button>
            <button onclick="setSkill('no')">Нет</button>
        `;
    } else if (industry === 'marketing') {
        questionEl.textContent = 'Какими инструментами для анализа и продвижения вы владеете?';
        answersEl.innerHTML = `
            <button onclick="setSkill('advanced')">Продвинутые (Google Analytics, SMM-планеры, таргетинг)</button>
            <button onclick="setSkill('basic')">Базовые (Excel, соцсети, простые редакторы)</button>
            <button onclick="setSkill('no')">Пока не владею, но готов учиться</button>
        `;
    } else if (industry === 'sales') {
        questionEl.textContent = 'Какой опыт работы с CRM-системами и техниками продаж у вас есть?';
        answersEl.innerHTML = `
            <button onclick="setSkill('advanced')">Опыт работы с CRM, техники активных продаж</button>
            <button onclick="setSkill('basic')">Базовое понимание, готов развиваться</button>
            <button onclick="setSkill('no')">Нет опыта</button>
        `;
    } else {
        questionEl.textContent = 'Какие профессиональные инструменты вы знаете?';
        answersEl.innerHTML = `
            <button onclick="setSkill('advanced')">Владею профессиональным софтом</button>
            <button onclick="setSkill('basic')">Базовые навыки</button>
            <button onclick="setSkill('no')">Пока нет, но готов учиться</button>
        `;
    }

    showStep('step5');
}

// Сохранить ответ на вопрос об инструментах
function setSkill(level) {
    userData.skillLevel = level;
    generateSkills();
    showStep('step6');
}

// Генерация чекбоксов навыков (расширенные наборы)
function generateSkills() {
    const container = document.getElementById('skillsContainer');
    container.innerHTML = '';

    const skillsMap = {
        it: ['Java', 'Python', 'JavaScript', 'Spring', 'Django', 'React', 'Git', 'Docker', 'SQL', 'Английский язык'],
        finance: ['SQL', 'Excel', 'Python', 'Tableau', 'Power BI', 'Статистика', 'МСФО', 'Аналитика', 'Английский язык'],
        marketing: ['SMM', 'Таргетинг', 'Google Analytics', 'Контент-маркетинг', 'Photoshop', 'Figma', 'Копирайтинг', 'Английский язык'],
        production: ['Управление проектами', 'Бережливое производство', '6 Sigma', 'Логистика', 'Оптимизация процессов'],
        sales: ['Переговоры', 'CRM (Salesforce, Bitrix)', 'Управление продажами', 'B2B', 'Холодные звонки', 'Английский язык'],
        other: ['Коммуникабельность', 'Работа в команде', 'Обучаемость', 'Ответственность', 'Английский язык']
    };

    let skills = skillsMap[userData.industry] || skillsMap.other;

    // Добавляем специфические навыки в зависимости от ответа на инструменты
    if (userData.skillLevel === 'advanced') {
        skills.push('Глубокое владение инструментами');
    } else if (userData.skillLevel === 'basic') {
        skills.push('Базовое владение инструментами');
    }

    // Если SQL был выбран, добавляем соответствующую метку
    if (userData.skillLevel === 'yes' && (userData.industry === 'it' || userData.industry === 'finance')) {
        skills.push('Оптимизация SQL-запросов');
    }

    // Убираем дубликаты
    skills = [...new Set(skills)];

    skills.forEach(skill => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = skill;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(skill));
        container.appendChild(label);
    });
}

// Переход к предпросмотру
function goToStep7() {
    const checkboxes = document.querySelectorAll('#skillsContainer input[type="checkbox"]:checked');
    userData.selectedSkills = Array.from(checkboxes).map(cb => cb.value);
    if (userData.selectedSkills.length === 0) {
        alert('Выберите хотя бы один навык');
        return;
    }
    generateResume();
    showStep('step7');
}

// Генерация резюме
function generateResume() {
    const preview = document.getElementById('resumePreview');
    let html = '';

    if (userData.photoDataURL) {
        html += `<img src="${userData.photoDataURL}" alt="Фото">`;
    }

    html += `<h3>${userData.fullName}</h3>`;
    html += `<p><strong>Желаемая должность:</strong> ${userData.jobTitle}</p>`;
    html += `<p><strong>Контакты:</strong> ${userData.phone} | ${userData.email}</p>`;

    if (userData.hasExperience) {
        html += `<h4>Опыт работы</h4>`;
        html += `<p>${userData.workExperienceText.replace(/\n/g, '<br>')}</p>`;
    } else {
        html += `<h4>Учебные проекты и курсы</h4>`;
        html += `<p>${userData.noExperienceText.replace(/\n/g, '<br>')}</p>`;
    }

    // Отображение уровня владения инструментами (SQL или другими)
    let skillText = '';
    if (userData.skillLevel === 'yes') skillText = 'Владею SQL на продвинутом уровне';
    else if (userData.skillLevel === 'basic') skillText = 'Базовые знания';
    else if (userData.skillLevel === 'advanced') skillText = 'Продвинутое владение профессиональными инструментами';
    else if (userData.skillLevel === 'no') skillText = 'Готов учиться новому';
    else skillText = 'Не указано';
    html += `<p><strong>Владение инструментами:</strong> ${skillText}</p>`;

    html += `<h4>Ключевые навыки</h4><ul>`;
    userData.selectedSkills.forEach(skill => {
        html += `<li>${skill}</li>`;
    });
    html += `</ul>`;

    html += `<p style="font-size:0.8rem; color:#888;">Резюме создано с помощью конструктора.</p>`;

    preview.innerHTML = html;
}

// Скачать PDF
function downloadPDF() {
    const element = document.getElementById('resumePreview');
    const opt = {
        margin: [10, 10],
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}

// Показать шаг
function showStep(stepId) {
    document.querySelectorAll('.step').forEach(step => {
        step.style.display = 'none';
    });
    document.getElementById(stepId).style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Сброс
function resetApp() {
    userData = {
        jobTitle: '',
        industry: 'it',
        fullName: '',
        phone: '',
        email: '',
        hasExperience: null,
        noExperienceText: '',
        workExperienceText: '',
        photoDataURL: null,
        skillLevel: '',
        selectedSkills: []
    };
    document.getElementById('jobTitle').value = '';
    document.getElementById('industry').value = 'it';
    document.getElementById('fullName').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('email').value = '';
    document.getElementById('noExperienceText').value = '';
    document.getElementById('workExperienceText').value = '';
    document.getElementById('photoInput').value = '';
    showStep('step1');
}
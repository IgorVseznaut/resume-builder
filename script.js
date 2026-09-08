// Глобальные данные пользователя
let userData = {
    jobTitle: '',
    industry: 'it',
    hasExperience: null,
    noExperienceText: '',
    workExperienceText: '',
    photoDataURL: null,
    sqlLevel: '',
    selectedSkills: [],
    fullName: 'Иван Иванов',   // позже можно добавить форму для ввода
    email: 'ivan@example.com',
    phone: '+7 999 123-45-67'
};

// Переход к шагу 2
function goToStep2() {
    const title = document.getElementById('jobTitle').value.trim();
    if (!title) {
        alert('Пожалуйста, введите желаемую должность');
        return;
    }
    userData.jobTitle = title;
    userData.industry = document.getElementById('industry').value;
    showStep('step2');
}

// Установка опыта
function setExperience(has) {
    userData.hasExperience = has;
    if (has) {
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
    showStep('step5');
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
        reader.onload = function (e) {
            userData.photoDataURL = e.target.result;
            showStep('step5');
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        showStep('step5');
    }
}

// Установка уровня SQL
function setSql(level) {
    userData.sqlLevel = level;
    generateSkills();
    showStep('step6');
}

// Генерация чекбоксов навыков с учётом отрасли и SQL
function generateSkills() {
    const container = document.getElementById('skillsContainer');
    container.innerHTML = '';

    // База навыков по отраслям
    const skillsMap = {
        it: ['Java', 'Python', 'JavaScript', 'Spring', 'Django', 'React', 'Git', 'Docker', 'SQL', 'Английский язык'],
        finance: ['SQL', 'Excel', 'Python', 'Tableau', 'Power BI', 'Статистика', 'МСФО', 'Аналитика', 'Английский язык'],
        marketing: ['SEO', 'SMM', 'Google Analytics', 'Контент-маркетинг', 'Photoshop', 'Figma', 'Английский язык'],
        production: ['Управление проектами', 'Бережливое производство', '6 Sigma', 'Логистика', 'Оптимизация процессов'],
        sales: ['Переговоры', 'CRM', 'Управление продажами', 'B2B', 'Холодные звонки', 'Английский язык'],
        other: ['Коммуникабельность', 'Работа в команде', 'Обучаемость', 'Ответственность', 'Английский язык']
    };

    let skills = skillsMap[userData.industry] || skillsMap.other;

    // Добавляем SQL-скиллы в зависимости от ответа
    if (userData.sqlLevel === 'yes') {
        skills.push('Оптимизация запросов', 'Проектирование БД', 'Оконные функции');
    } else if (userData.sqlLevel === 'basic') {
        skills.push('Базовые SELECT, INSERT, UPDATE');
    }

    // Убираем дубликаты
    skills = [...new Set(skills)];

    // Создаём чекбоксы
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

// Переход к предпросмотру резюме
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
    html += `<p><strong>Контакты:</strong> ${userData.email} | ${userData.phone}</p>`;

    if (userData.hasExperience) {
        html += `<h4>Опыт работы</h4>`;
        html += `<p>${userData.workExperienceText.replace(/\n/g, '<br>')}</p>`;
    } else {
        html += `<h4>Учебные проекты и курсы</h4>`;
        html += `<p>${userData.noExperienceText.replace(/\n/g, '<br>')}</p>`;
    }

    let sqlText = '';
    if (userData.sqlLevel === 'yes') sqlText = 'Владею на продвинутом уровне';
    else if (userData.sqlLevel === 'basic') sqlText = 'Базовые знания';
    else sqlText = 'Не владею';
    html += `<p><strong>Знание SQL:</strong> ${sqlText}</p>`;

    html += `<h4>Ключевые навыки</h4><ul>`;
    userData.selectedSkills.forEach(skill => {
        html += `<li>${skill}</li>`;
    });
    html += `</ul>`;

    // Дополнительная информация (можно расширить)
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

// Показать нужный шаг
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
        hasExperience: null,
        noExperienceText: '',
        workExperienceText: '',
        photoDataURL: null,
        sqlLevel: '',
        selectedSkills: [],
        fullName: 'Иван Иванов',
        email: 'ivan@example.com',
        phone: '+7 999 123-45-67'
    };
    document.getElementById('jobTitle').value = '';
    document.getElementById('industry').value = 'it';
    document.getElementById('noExperienceText').value = '';
    document.getElementById('workExperienceText').value = '';
    document.getElementById('photoInput').value = '';
    showStep('step1');
}
// 1. محاولة قراءة النقاط المحفوظة، أو البدء من صفر
let userPoints = Number(localStorage.getItem('userPoints')) || 0;

// 2. محاولة قراءة الدروس المكتملة، أو البدء بمصفوفة فارغة
let completedLessons = JSON.parse(localStorage.getItem('completedLessons')) || [];

// تحديث حالة الدروس بناءً على المحفوظات عند فتح التطبيق
myLessons.forEach((lesson, index) => {
    if (completedLessons.includes(lesson.id)) {
        lesson.status = "مكتمل";
        lesson.color = "#38bdf8";
        // فتح الدرس التالي
        if (myLessons[index + 1]) {
            myLessons[index + 1].status = "متاح";
            myLessons[index + 1].color = "#4ade80";
        }
    }
});

const screens = {
    home: () => `
        <div class="welcome-header">
            <h1>مرحبًا بك يا بطل 👋</h1>
            <p>مستعد لبناء أول تطبيق لك؟</p>
        </div>
        <div class="card">
            <h2>🎯 هدفك الحالي</h2>
            <p>الوصول إلى أول تطبيق منشور وناجح. ابدأ بالدروس لتكتسب المهارات.</p>
            <button onclick="navigate('lessons', document.querySelectorAll('.nav-btn')[1])" style="background:var(--primary); color:black; padding:10px 20px; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">ابدأ التعلم الآن</button>
        </div>
        <div class="card">
            <h2>📊 إحصائياتك</h2>
            <p>النقاط: <strong>${userPoints}</strong></p>
            <p>الدروس المكتملة: <strong>${completedLessons.length}</strong></p>
        </div>
    `,
    lessons: () => {
        let html = `<h1>📚 رحلة التعلم</h1><p>هنا نتعلم خطوة بخطوة حتى الاحتراف.</p>`;
        
        myLessons.forEach(lesson => {
            const isClickable = lesson.status !== "مغلق";
            const clickAction = isClickable ? `onclick="openLesson(${lesson.id})"` : "";
            
            html += `
                <div class="card" style="border-right: 4px solid ${lesson.color}; cursor: ${isClickable ? 'pointer' : 'default'};" ${clickAction}>
                    <h2>${lesson.icon} ${lesson.title}</h2>
                    <p>${lesson.description}</p>
                    <span style="font-size: 12px; background: ${lesson.color}; color: #000; padding: 4px 8px; border-radius: 10px; font-weight: bold;">
                        ${lesson.status}
                    </span>
                </div>
            `;
        });
        return html;
    },
    profile: () => `
        <h1>👤 ملفي</h1>
        <div class="card">
            <h2>معلومات المتعلم</h2>
            <p>الاسم: بطل التحدي</p>
            <p>المستوى: مبتدئ</p>
            <p>النقاط: <strong>${userPoints}</strong></p>
        </div>
    `
};

function navigate(screenName, btnElement) {
    document.getElementById('app-content').innerHTML = screens[screenName]();
    
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    if (btnElement) {
        btnElement.classList.add('active');
    } else {
        document.querySelector('.nav-btn').classList.add('active');
    }
}

function openLesson(id) {
    const lesson = myLessons.find(l => l.id === id);
    if (!lesson || !lesson.question) return;

    let optionsHtml = '';
    lesson.options.forEach((opt, index) => {
        optionsHtml += `<button onclick="checkAnswer(${id}, ${index})" style="display:block; width:100%; margin-bottom:10px; padding:12px; background:#334155; color:white; border:none; border-radius:8px; font-size:16px;">${opt}</button>`;
    });

    document.getElementById('app-content').innerHTML = `
        <button onclick="navigate('lessons', document.querySelectorAll('.nav-btn')[1])" style="background:none; border:none; color:var(--primary); font-size:16px; margin-bottom:20px; cursor:pointer;">← العودة للدروس</button>
        <div class="card">
            <h2>${lesson.title}</h2>
            <p>${lesson.question}</p>
            <hr style="border-color:#334155; margin: 15px 0;">
            ${optionsHtml}
        </div>
    `;
}

function checkAnswer(lessonId, selectedIndex) {
    const lesson = myLessons.find(l => l.id === lessonId);
    
    if (selectedIndex === lesson.correctAnswer) {
        // التحقق مما إذا كان الدرس مكملاً مسبقاً لتجنب تكرار النقاط
        if (!completedLessons.includes(lessonId)) {
            alert("🎉 إجابة صحيحة! كسبت 50 نقطة.");
            userPoints += 50;
            completedLessons.push(lessonId);
            
            // حفظ في الذاكرة
            localStorage.setItem('userPoints', userPoints);
            localStorage.setItem('completedLessons', JSON.stringify(completedLessons));

            // تحديث الواجهة
            lesson.status = "مكتمل";
            lesson.color = "#38bdf8"; 
            
            // فتح الدرس التالي
            const currentIndex = myLessons.findIndex(l => l.id === lessonId);
            if (myLessons[currentIndex + 1]) {
                myLessons[currentIndex + 1].status = "متاح";
                myLessons[currentIndex + 1].color = "#4ade80";
            }
        } else {
            alert("لقد أكملت هذا الدرس بالفعل!");
        }

        navigate('lessons', document.querySelectorAll('.nav-btn')[1]);
    } else {
        alert("❌ إجابة خاطئة. حاول مرة أخرى!");
    }
}

window.onload = () => {
    navigate('home');
};
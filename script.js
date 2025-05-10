const quizData = [
    {
        question: "HTML açılımı nedir?",
        options: ["Hyper Trainer Marking Language", "Hyper Text Markup Language", "Hyper Text Markdown Language", "Hyper Tool Multi Language"],
        correct: 1
    },
    {
        question: "CSS ne işe yarar?",
        options: ["Veritabanı yönetimi", "Sunucu yönetimi", "Web sayfası stilini belirler", "JavaScript fonksiyonlarını tanımlar"],
        correct: 2
    },
    {
        question: "jQuery nedir?",
        options: ["Veri tabanı", "Programlama dili", "JavaScript kütüphanesi", "Sunucu dili"],
        correct: 2
    },
    {
        question: "HTML'de bir bağlantı (link) oluşturmak için hangi etiket kullanılır?",
        options: ["&lt;link&gt;", "&lt;a&gt;", "&lt;href&gt;", "&lt;url&gt;"],
        correct: 1
    },
    {
        question: "CSS'te arka plan rengini değiştirmek için hangi özellik kullanılır?",
        options: ["text-color", "background-color", "border", "font-style"],
        correct: 1
    },
    {
        question: "JavaScript'te bir fonksiyon nasıl tanımlanır?",
        options: ["def myFunc()", "function myFunc()", "create function myFunc()", "new function()"],
        correct: 1
    },
    {
        question: "jQuery ile bir öğeyi gizlemek için hangi komut kullanılır?",
        options: ["hideElement()", "$().invisible()", "$().hide()", "element.hide()"],
        correct: 2
    },
    {
        question: "Bootstrap'te yeşil bir buton oluşturmak için hangi sınıf kullanılır?",
        options: ["btn btn-primary", "btn btn-warning", "btn btn-success", "btn btn-danger"],
        correct: 2
    },
    {
        question: "JavaScript'te bir dizinin uzunluğunu nasıl öğreniriz?",
        options: ["array.length()", "length(array)", "array.size", "array.length"],
        correct: 3
    },
    {
        question: "Bootstrap'te bir elementi ortalamak için en yaygın kullanılan sınıf hangisidir?",
        options: ["text-align-center", "center-block", "mx-auto", "align-middle"],
        correct: 2
    }
];

let currentQuestion = 0;
let score = 0;
let timerInterval;
let timeLeft = 10;
let userAnswers = [];

function updateProgressBar() {
    const percentage = Math.round((currentQuestion / quizData.length) * 100);
    $('#progress-bar').css('width', `${percentage}%`).text(`${percentage}%`);
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 10;
    $('#timer').text(`⏳ ${timeLeft} saniye kaldı`);

    timerInterval = setInterval(() => {
        timeLeft--;
        $('#timer').text(`⏳ ${timeLeft} saniye kaldı`);
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleAnswerTimeout();
        }
    }, 1000);
}

function handleAnswerTimeout() {
    clearInterval(timerInterval);
    $('.option-btn').prop('disabled', true);
    const correct = quizData[currentQuestion].correct;

    // Kullanıcı süreyi geçirirse cevapsız kaydet
    userAnswers.push({
        question: quizData[currentQuestion].question,
        options: quizData[currentQuestion].options,
        correct: correct,
        selected: null
    });

    $(`.option-btn[data-index=${correct}]`).addClass('btn-success');
    $('#quiz-container').addClass('wrong-shake');

    setTimeout(() => {
        $('#quiz-container').removeClass('wrong-shake');
        currentQuestion++;
        if (currentQuestion < quizData.length) {
            loadQuestion();
        } else {
            finishQuiz();
        }
    }, 2000);
}

function loadQuestion() {
    clearInterval(timerInterval);
    $('#explanation').hide();
    const q = quizData[currentQuestion];
    $('#question-counter').text(`Soru ${currentQuestion + 1} / ${quizData.length}`);
    $('#question').text(q.question);
    $('#options').empty().removeClass('fade-in').addClass('fade-in');

    q.options.forEach((opt, index) => {
        $('<button>')
            .addClass('btn btn-outline-primary btn-lg mb-2 w-100 option-btn rounded-pill')
            .attr('data-index', index)
            .html(opt)
            .appendTo('#options');
    });

    updateProgressBar();
    startTimer();
}

function finishQuiz() {
    $('#quiz-container').hide();
    $('#progress-bar').css('width', '100%').text('100%');

    let detailsHtml = '<h5 class="mt-4">📋 Detaylı Sonuçlar:</h5><ul class="list-group">';
    userAnswers.forEach((item, index) => {
        const correctAnswer = item.options[item.correct];
        const userAnswer = item.selected !== null ? item.options[item.selected] : "⏱️ Cevap verilmedi";
        const isCorrect = item.selected === item.correct;

        detailsHtml += `
            <li class="list-group-item ${isCorrect ? 'list-group-item-success' : 'list-group-item-danger'}">
                <strong>Soru ${index + 1}:</strong> ${item.question}<br>
                <strong>Senin Cevabın:</strong> ${userAnswer}<br>
                <strong>Doğru Cevap:</strong> ${correctAnswer}
            </li>
        `;
    });
    detailsHtml += '</ul>';

    $('#result').html(`
        <h4 class="text-success">🎉 Quiz bitti!</h4>
        <p>Doğru sayısı: <strong>${score}</strong> / ${quizData.length}</p>
        ${detailsHtml}
        <button id="retry-btn" class="btn btn-primary mt-3">Tekrar Dene 🔄</button>
    `).show();
}

$(document).ready(function () {
    loadQuestion();

    $('#options').on('click', '.option-btn', function () {
        clearInterval(timerInterval); // sürenin durması için
        $('.option-btn').prop('disabled', true); // butonları devre dışı bırak
        const selected = $(this).data('index'); // Seçilen cevabın index'i
        const correct = quizData[currentQuestion].correct; // Doğru cevabın index'i

        // Kullanıcının verdiği cevabı userAnswers dizisine ekleyin
        userAnswers.push({
            question: quizData[currentQuestion].question,
            options: quizData[currentQuestion].options,
            correct: correct,
            selected: selected !== undefined ? selected : null // Eğer cevap verilmediyse null
        });

        const isCorrect = selected === correct;

        if (isCorrect) {
            $(this).addClass('btn-success');
            $('#quiz-container').addClass('correct-flash');
            score++;
        } else {
            $(this).addClass('btn-danger');
            $(`.option-btn[data-index=${correct}]`).addClass('btn-success');
            $('#quiz-container').addClass('wrong-shake');
        }

        setTimeout(() => {
            $('#quiz-container').removeClass('correct-flash wrong-shake');
            currentQuestion++;
            if (currentQuestion < quizData.length) {
                loadQuestion();
            } else {
                finishQuiz(); // Quiz bitince finishQuiz fonksiyonunu çağır
            }
        }, 1000);
    });

    $('#result').on('click', '#retry-btn', function () {
        currentQuestion = 0;
        score = 0;
        $('#result').hide();
        $('#quiz-container').show();
        updateProgressBar();
        loadQuestion();
    });
});

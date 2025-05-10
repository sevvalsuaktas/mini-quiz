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

function updateProgressBar() {
    const percentage = Math.round((currentQuestion / quizData.length) * 100);
    $('#progress-bar')
        .css('width', `${percentage}%`)
        .text(`${percentage}%`);
}

function loadQuestion() {
    const q = quizData[currentQuestion];
    $('#question').text(q.question);
    $('#options').empty().removeClass('fade-in').addClass('fade-in');

    q.options.forEach((opt, index) => {
        $('<button>')
            .addClass('btn btn-outline-primary btn-lg mb-2 w-100 option-btn rounded-pill')
            .attr('data-index', index)
            .html(opt)  // Burada .text(opt) yerine .html(opt) kullandık ki < > işaretleri düzgün görünsün
            .appendTo('#options');
    });

    updateProgressBar();
}

$(document).ready(function() {
    loadQuestion();

    $('#options').on('click', '.option-btn', function() {
        $('.option-btn').prop('disabled', true);
        const selected = $(this).data('index');
        const correct = quizData[currentQuestion].correct;

        if (selected === correct) {
            $(this).addClass('btn-success');
            $('#quiz-container').addClass('correct-flash');
            score++;
        } else {
            $(this).addClass('btn-danger');
            $(`.option-btn[data-index=${correct}]`).addClass('btn-success');
            $('#quiz-container').addClass('wrong-shake');
        }

    // 🔁 Tekrar Dene butonu burada:
    $('#result').on('click', '#retry-btn', function() {
        currentQuestion = 0;
        score = 0;
        $('#result').hide();
        $('#quiz-container').show();
        updateProgressBar();
        loadQuestion();
    });

        setTimeout(() => {
            $('#quiz-container').removeClass('correct-flash wrong-shake');
            currentQuestion++;
            if (currentQuestion < quizData.length) {
                loadQuestion();
            } else {
                $('#quiz-container').hide();
                $('#progress-bar').css('width', '100%').text('100%');
                $('#result').html(`
                    <h4 class="text-success">🎉 Quiz bitti!</h4>
                    <p>Doğru sayısı: <strong>${score}</strong> / ${quizData.length}</p>
                    <button id="retry-btn" class="btn btn-primary mt-3">Tekrar Dene 🔄</button>
                `).show();
            }
        }, 1000);
    });
});

// Quiz verileri: Kolay, Orta ve Zor seviyeler için sorular
const quizData = {
    easy: [
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
        }
    ],
    medium: [
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
    ],
    hard: [
        {
            question: "CSS'te bir öğenin margin değerini nasıl ayarlarsınız?",
            options: ["margin-set", "padding", "margin", "box-sizing"],
            correct: 2
        },
        {
            question: "JavaScript'te bir nesneye nasıl yeni bir özellik eklenir?",
            options: ["object.newProperty = value", "object.addProperty(value)", "object.setProperty(value)", "addProperty(object, value)"],
            correct: 0
        },
        {
            question: "jQuery ile bir öğeye animasyon eklemek için hangi fonksiyon kullanılır?",
            options: ["animate()", "motion()", "move()", "effect()"],
            correct: 0
        },
        {
            question: "CSS'te bir öğe içindeki metni nasıl ortalarsınız?",
            options: ["text-align: center;", "align: center;", "justify-content: center;", "display: center;"],
            correct: 0
        },
        {
            question: "JavaScript'te bir fonksiyonu birden fazla parametreyle nasıl çağırırsınız?",
            options: ["myFunction(param1, param2)", "myFunction(param1; param2)", "myFunction(param1, param2, param3)", "call(myFunction, param1, param2)"],
            correct: 0
        }
    ]
};

let currentQuestion = 0; // Hangi soruda olunduğunu tutar
let score = 0; // Kullanıcının doğru cevap sayısı
let timerInterval; // setInterval()'den dönen referans (timer kontrolü için)
let timeLeft = 10; // Her soru için kalan süre (saniye cinsinden)
let userAnswers = []; // Kullanıcının verdiği cevapları tutar
let selectedQuizData = []; // Seçilen zorluk seviyesine göre yüklenecek sorular

// İlerleme çubuğunu güncelleyen fonksiyon
function updateProgressBar() {
    const percentage = Math.round((currentQuestion / selectedQuizData.length) * 100);
    $('#progress-bar').css('width', `${percentage}%`).text(`${percentage}%`); // jQuery ile .css() ve .text() kullanılarak hem çubuğun genişliği hem de üzerindeki yazı güncellenir.
}

// Geri sayımı başlatan fonksiyon
function startTimer() {
    clearInterval(timerInterval); // Önceki timer varsa durdur
    timeLeft = 10; // Her soru için 10 saniye
    $('#timer').text(`⏳ ${timeLeft} saniye kaldı`);

    // Her saniye bir azalt
    timerInterval = setInterval(() => { // setInterval: Her 1000ms'de bir timeLeft'i 1 azaltır
        timeLeft--;
        $('#timer').text(`⏳ ${timeLeft} saniye kaldı`);
        if (timeLeft <= 0) {
            clearInterval(timerInterval); // Süre bittiğinde zamanlayıcıyı durdur
            handleAnswerTimeout(); // Cevap verilmediyse işle
        }
    }, 1000);
}

// Süre bittiğinde cevap verilmeme durumunu işleyen fonksiyon
function handleAnswerTimeout() {
    clearInterval(timerInterval); // Zamanlayıcıyı durdur
    $('.option-btn').prop('disabled', true); // Tüm seçenekleri pasifleştir

    const correct = selectedQuizData[currentQuestion].correct; // Doğru cevabın indexi

    // Kullanıcının cevap vermediği kaydedilir
    userAnswers.push({
        question: selectedQuizData[currentQuestion].question,
        options: selectedQuizData[currentQuestion].options,
        correct: correct,
        selected: null // Hiçbir seçenek seçilmedi
    });

    // Doğru cevap yeşil gözükür
    $(`.option-btn[data-index=${correct}]`)
        .removeClass('btn-outline-primary')
        .addClass('btn-success');

    // Quiz konteynerine yanlış cevaba özel animasyon uygulanır
    $('#quiz-container').addClass('wrong-shake');

    // Kullanıcı cevap vermeyip süre bittiyse 2 saniye sonra sonraki soruya geç
    setTimeout(() => {
        $('#quiz-container').removeClass('wrong-shake');
        currentQuestion++;
        if (currentQuestion < selectedQuizData.length) {
            loadQuestion(); // Yeni soruyu yükle
        } else {
            finishQuiz(); // Quiz bitti
        }
    }, 2000);
}

// Yeni soruyu yükleyen fonksiyon
function loadQuestion() {
    clearInterval(timerInterval); // Önceki zamanlayıcıyı durdur
    const q = selectedQuizData[currentQuestion]; // Şu anki soru
    $('#question-counter').text(`Soru ${currentQuestion + 1} / ${selectedQuizData.length}`);
    $('#question').text(q.question); // Soruyu göster
    $('#options').empty().removeClass('fade-in').addClass('fade-in'); // Seçenekleri temizle ve animasyon uygula

    // Seçenek butonlarını oluştur
    q.options.forEach((opt, index) => {
        $('<button>')
            .addClass('btn btn-outline-primary btn-lg mb-2 w-100 option-btn rounded-pill')
            .attr('data-index', index)
            .html(opt)
            .appendTo('#options');
    });

    updateProgressBar(); // İlerleme çubuğunu güncelle
    startTimer(); // Timer'ı başlat
}

// Quiz bittiğinde sonucu gösteren fonksiyon
function finishQuiz() {
    $('#quiz-container').hide(); // Quiz ekranını gizle
    $('#progress-bar').css('width', '100%').text('100%'); // İlerleme %100

    // Cevapların detaylı listesi
    let detailsHtml = '<h5 class="mt-4">📋 Detaylı Sonuçlar:</h5><ul class="list-group">';
    userAnswers.forEach((item, index) => {
        const correctAnswer = item.options[item.correct]; // Doğru cevap metni
        const userAnswer = item.selected !== null ? item.options[item.selected] : "⏱️ Cevap verilmedi";
        const isCorrect = item.selected === item.correct;

        // Her sorunun sonucu listelenir
        detailsHtml += `
            <li class="list-group-item ${isCorrect ? 'list-group-item-success' : 'list-group-item-danger'}">
                <strong>Soru ${index + 1}:</strong> ${item.question}<br>
                <strong>Senin Cevabın:</strong> ${userAnswer}<br>
                <strong>Doğru Cevap:</strong> ${correctAnswer}
            </li>
        `;
    });
    detailsHtml += '</ul>';

    // Sonuç ekranını oluştur ve göster
    $('#result').html(`
        <h4 class="text-success">🎉 Quiz bitti!</h4>
        <p>Doğru sayısı: <strong>${score}</strong> / ${selectedQuizData.length}</p>
        ${detailsHtml}
        <button id="retry-btn" class="btn btn-primary mt-3">Tekrar Dene 🔄</button>
    `).show();
}

// Sayfa yüklendiğinde çalışacak kodlar
$(document).ready(function () {
    $('#quiz-container').hide(); // Quiz ekranını başta gizle
    $('#result').hide();         // Sonuç kısmı da gizli başlasın

    // Başlat butonuna tıklanırsa
    $('#start-btn').click(function () {
        const difficulty = $('#difficulty-select').val(); // Seviye seçimini al
        selectedQuizData = quizData[difficulty]; // Seçilen seviye sorularını al

        // Ekran geçişleri
        $('#start-screen').hide();
        $('#quiz-screen').show();
        $('#quiz-container').show();

        loadQuestion(); // İlk soruyu yükle
        startTimer(); // Zamanlayıcıyı başlat
    });

    // Cevap butonlarından birine tıklanırsa
    $('#options').on('click', '.option-btn', function () {
        clearInterval(timerInterval); // Timer'ı durdur
        $('.option-btn').prop('disabled', true); // butonları devre dışı bırak

        const selected = $(this).data('index'); // Seçilen cevabın index'i
        const correct = selectedQuizData[currentQuestion].correct; // Doğru cevabın index'i

        // Kullanıcının verdiği cevabı userAnswers dizisine ekleyin
        userAnswers.push({
            question: selectedQuizData[currentQuestion].question,
            options: selectedQuizData[currentQuestion].options,
            correct: correct,
            selected: selected !== undefined ? selected : null
        });

        const isCorrect = selected === correct;

        if (isCorrect) {
            $(this).removeClass('btn-outline-primary').addClass('btn-success'); // Doğru cevap yeşil renk olur
            $('#quiz-container').addClass('correct-flash'); // Doğru cevap efekti(konteyner yeşil olur)
            score++;
        } else {
            $(this).removeClass('btn-outline-primary').addClass('btn-danger'); // Yanlış cevap kırmızı olur

            $('.option-btn').each(function () {
                if ($(this).data('index') == correct) {
                    $(this).removeClass('btn-outline-primary').addClass('btn-success'); // Doğru cevap yeşil ile gösterilir
                }
            });

            $('#quiz-container').addClass('wrong-shake'); // Yanlış cevap sallanma efekti
        }

        // Kullanıcı cevap verdikten 1 saniye sonra sonraki soruya geç
        setTimeout(() => {
            $('#quiz-container').removeClass('correct-flash wrong-shake');
            currentQuestion++;
            if (currentQuestion < selectedQuizData.length) {
                loadQuestion();
            } else {
                finishQuiz(); // Quiz bitince finishQuiz fonksiyonunu çağır
            }
        }, 1000);
    });

    // Tekrar dene butonuna tıklanırsa
    $('#result').on('click', '#retry-btn', function () {
        // Değişkenleri sıfırla
        currentQuestion = 0;
        score = 0;
        userAnswers = []; // önceki sonuçları sıfırlamak için
        clearInterval(timerInterval); // Ekstra güvenlik için

        $('#result').hide();
        $('#start-screen').show(); // tekrar dene deyince yeniden seviye seçilsin
        $('#quiz-screen').hide();  // Quiz ekranını gizle
        $('#quiz-container').hide(); // Soruları gizle
    });
});
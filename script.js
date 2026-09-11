// script.js file ka content:

document.addEventListener("DOMContentLoaded", function() {
    const featureBoxes = document.querySelectorAll('.point-box');
    const featureImages = document.querySelectorAll('.mockup-img');
    let currentIdx = 0;
    let autoPlay;

    // Function jo image aur highlight ko update karega
    function updateDisplay(index) {
        // Pehle sab boxes se grey background aur images se visibility khatam karo
        featureBoxes.forEach(box => box.classList.remove('active-feature'));
        featureImages.forEach(img => img.classList.remove('active'));

        // Ab jo index pass hua hai usko active karo
        if(featureBoxes[index]) {
            featureBoxes[index].classList.add('active-feature');
        }
        if(featureImages[index]) {
            featureImages[index].classList.add('active');
        }
        
        currentIdx = index;
    }

    // Automatic chalne wala function (3 seconds ka gap)
    function startRotation() {
        autoPlay = setInterval(() => {
            let next = (currentIdx + 1) % featureBoxes.length;
            updateDisplay(next);
        }, 3000);
    }

    // Har box par mouse le jane ka effect
    featureBoxes.forEach((box, i) => {
        box.addEventListener('mouseenter', () => {
            clearInterval(autoPlay); // Jab mouse upar ho to automatic ruk jaye
            updateDisplay(i);        // Wahi image dikhaye jidher mouse hai
        });

        box.addEventListener('mouseleave', () => {
            startRotation();         // Mouse hatne par dobara auto shuru ho jaye
        });
    });

    // Pehli baar rotation shuru karne ke liye
    startRotation();


});



function initLiveTinyCounter() {
    const counterEl = document.getElementById('live-tiny-counter');
    if (!counterEl) return;

    let baseCount = 30606131800;

    setInterval(() => {
        // Har adhay second mein 2-8 numbers barhenge
        let increment = Math.floor(Math.random() * 7) + 2;
        baseCount += increment;
        
        // Format with commas
        counterEl.innerText = baseCount.toLocaleString();
    }, 800);
}

// Start once page loads
document.addEventListener('DOMContentLoaded', initLiveTinyCounter);



document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        
        // Agar pehle se koi khula hai toh usay band karein (Optional)
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) item.classList.remove('active');
        });

        // Current item ko toggle karein
        faqItem.classList.toggle('active');
    });
});

// Railway Backend API Integration
const shortenBtn = document.getElementById('shorten-btn');
const longUrlInput = document.getElementById('long-url-input');
const resultBox = document.getElementById('result-box');

const RAILWAY_URL = "https://tinybackend-production-fe37.up.railway.app"; 

if (shortenBtn) {
    shortenBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        let originalUrl = longUrlInput.value.trim();

        if (!originalUrl) {
            alert("Pehle URL paste karein!");
            return;
        }

        // Auto-fix missing http/https in user input
        if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
            originalUrl = 'https://' + originalUrl;
        }

        resultBox.innerText = "Shortening link...";

        try {
            const response = await fetch(`${RAILWAY_URL}/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ longUrl: originalUrl }) // Key match: longUrl
            });

            const data = await response.json();

            if (response.ok && data.ok) {
                // Display generated Short Link directly from Backend
                resultBox.innerHTML = `Short Link: <a href="${data.shortURL}" target="_blank" style="color: #007bff; text-decoration: underline;">${data.shortURL}</a>`;
            } else {
                resultBox.innerText = data.err || "Link shorten nahi ho saka!";
            }
        } catch (err) {
            console.error(err);
            resultBox.innerText = "Backend se connection fail ho gaya!";
        }
    });
}










/* // Railway Backend API Integration
const shortenBtn = document.getElementById('shorten-btn');
const longUrlInput = document.getElementById('long-url-input');
const resultBox = document.getElementById('result-box');

// Yahan Apna Railway Domain Paste Karein
const RAILWAY_URL = "https://tinybackend-production-fe37.up.railway.app"; 

if (shortenBtn) {
    shortenBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const originalUrl = longUrlInput.value.trim();

        if (!originalUrl) {
            alert("Pehle URL paste karein!");
            return;
        }

        resultBox.innerText = "Shortening link...";

        try {
            const response = await fetch(`${RAILWAY_URL}/save`, { // Apne backend route ke hisab se path set karein (/urls ya /short)
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: originalUrl })
            });

            const data = await response.json();

            if (response.ok) {
                // Short URL screen par dikhane ke liye
                const shortUrl = `${RAILWAY_URL}/${data.shortId || data.shortUrl}`;
                resultBox.innerHTML = `Short Link: <a href="${shortUrl}" target="_blank" style="color: #007bff;">${shortUrl}</a>`;
            } else {
                resultBox.innerText = data.message || "Link shorten nahi ho saka!";
            }
        } catch (err) {
            console.error(err);
            resultBox.innerText = "Backend se connection fail ho gaya!";
        }
    });
} */
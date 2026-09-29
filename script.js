document.addEventListener("DOMContentLoaded", function () {
    const featureBoxes = document.querySelectorAll(".point-box");
    const featureImages = document.querySelectorAll(".mockup-img");

    let currentIdx = 0;
    let autoPlay;

    // ==================== FEATURE ROTATION ====================

    function updateDisplay(index) {
        featureBoxes.forEach((box) => {
            box.classList.remove("active-feature");
        });

        featureImages.forEach((img) => {
            img.classList.remove("active");
        });

        if (featureBoxes[index]) {
            featureBoxes[index].classList.add("active-feature");
        }

        if (featureImages[index]) {
            featureImages[index].classList.add("active");
        }

        currentIdx = index;
    }

    function startRotation() {
        clearInterval(autoPlay);

        autoPlay = setInterval(() => {
            let next = (currentIdx + 1) % featureBoxes.length;
            updateDisplay(next);
        }, 3000);
    }

    featureBoxes.forEach((box, i) => {
        box.addEventListener("mouseenter", () => {
            clearInterval(autoPlay);
            updateDisplay(i);
        });

        box.addEventListener("mouseleave", () => {
            startRotation();
        });
    });

    if (featureBoxes.length > 0) {
        startRotation();
    }
});


// ==================== LIVE TINY COUNTER ====================

function initLiveTinyCounter() {
    const counterEl = document.getElementById("live-tiny-counter");

    if (!counterEl) return;

    let baseCount = 30606131800;

    setInterval(() => {
        let increment = Math.floor(Math.random() * 7) + 2;

        baseCount += increment;

        counterEl.innerText = baseCount.toLocaleString();
    }, 800);
}

document.addEventListener(
    "DOMContentLoaded",
    initLiveTinyCounter
);


// ==================== FAQ ====================

document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
        const faqItem = button.parentElement;

        document.querySelectorAll(".faq-item").forEach((item) => {
            if (item !== faqItem) {
                item.classList.remove("active");
            }
        });

        faqItem.classList.toggle("active");
    });
});


// ==================== BACKEND + URL SHORTENER ====================

const shortenBtn = document.getElementById("shorten-btn");
const longUrlInput = document.getElementById("long-url-input");
const resultBox = document.getElementById("result-box");
const copyLinkBtn = document.getElementById("copy-link-btn");
const recentLinksBox = document.getElementById("recent-links-box");

// Your deployed Vercel backend
const BACKEND_URL = "https://tiny-backend-pink.vercel.app";


// ==================== RECENT LINKS ====================

function getRecentLinks() {
    try {
        return JSON.parse(
            localStorage.getItem("tinyurl_recent_links")
        ) || [];
    } catch (error) {
        return [];
    }
}


function saveRecentLink(shortURL) {
    let links = getRecentLinks();

    // Same link duplicate na ho
    links = links.filter((link) => link !== shortURL);

    // Newest link sab se upar
    links.unshift(shortURL);

    // Sirf last 5 links save honge
    links = links.slice(0, 5);

    localStorage.setItem(
        "tinyurl_recent_links",
        JSON.stringify(links)
    );

    displayRecentLinks();
}


function displayRecentLinks() {
    const box = document.getElementById("recent-links-box");

    if (!box) {
        return;
    }

    const links = getRecentLinks();

    // Agar koi link nahi hai
    if (links.length === 0) {
        box.innerHTML = `
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>No links yet in your history</span>
        `;

        return;
    }

    // Recent shortened links
    box.innerHTML = links.map((link) => `
        <div style="
            width: 100%;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        ">
            <a
                href="${link}"
                target="_blank"
                rel="noopener noreferrer"
                style="
                    color: #007bff;
                    text-decoration: underline;
                    word-break: break-all;
                "
            >
                ${link}
            </a>
        </div>
    `).join("");
}


// Page load par recent links show karein
document.addEventListener(
    "DOMContentLoaded",
    displayRecentLinks
);


// ==================== SHORTEN LINK ====================

if (shortenBtn) {

    shortenBtn.addEventListener("click", async (e) => {

        e.preventDefault();

        // URL input
        let originalUrl = longUrlInput.value
            .trim()
            .replace(/^"|"$/g, "");

        // Empty URL
        if (!originalUrl) {

            alert("Pehle URL paste karein!");

            return;
        }

        // http/https automatically add
        if (
            !originalUrl.startsWith("http://") &&
            !originalUrl.startsWith("https://")
        ) {
            originalUrl = "https://" + originalUrl;
        }

        // Loading message
        resultBox.innerText = "Shortening link...";

        // Copy button hide
        if (copyLinkBtn) {
            copyLinkBtn.style.display = "none";
        }

        try {

            // Send URL to Vercel backend
            const response = await fetch(
                `${BACKEND_URL}/save`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        longUrl: originalUrl
                    })
                }
            );


            const data = await response.json();


            // ==================== SUCCESS ====================

            if (response.ok && data.ok) {

                const shortURL = data.shortURL;


                // Display shortened URL
                resultBox.innerHTML = `
                    Short Link:
                    <a
                        href="${shortURL}"
                        target="_blank"
                        rel="noopener noreferrer"
                        style="
                            color: #007bff;
                            text-decoration: underline;
                        "
                    >
                        ${shortURL}
                    </a>
                `;


                // ==================== COPY BUTTON ====================

                if (copyLinkBtn) {

                    copyLinkBtn.style.display = "block";


                    copyLinkBtn.onclick = async () => {

                        try {

                            await navigator.clipboard.writeText(
                                shortURL
                            );


                            copyLinkBtn.innerHTML = `
                                <i class="fa-solid fa-check"></i>
                                Copied!
                            `;


                            setTimeout(() => {

                                copyLinkBtn.innerHTML = `
                                    <i class="fa-regular fa-copy"></i>
                                    Copy Link
                                `;

                            }, 1500);


                        } catch (error) {

                            console.error(
                                "Copy Error:",
                                error
                            );

                            alert(
                                "Link copy nahi ho saka!"
                            );
                        }
                    };
                }


                // ==================== RECENT LINKS ====================

                saveRecentLink(shortURL);

            }


            // ==================== ERROR ====================

            else {

                const errorMsg =
                    (
                        data.err &&
                        typeof data.err === "object"
                    )
                        ? (
                            data.err.message ||
                            "Invalid URL format"
                        )
                        : (
                            data.err ||
                            "Link shorten nahi ho saka!"
                        );


                resultBox.innerText = errorMsg;
            }


        } catch (err) {

            console.error(
                "Backend Error:",
                err
            );

            resultBox.innerText =
                "Backend connection failed!";
        }
    });
}
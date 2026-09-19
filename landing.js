const slides = [
  {
    image: "feature-1.webp",
    title: "Shorten Long URLs in Seconds",
    description:
      "Turn long and complicated URLs into short, simple and easy-to-share links."
  },
  {
    image: "feature-2 (1).webp",
    title: "Share Links With Ease",
    description:
      "Create clean short links that are easy to copy, remember and share anywhere."
  },
  {
    image: "feature-3.webp",
    title: "Make Every Link Simple",
    description:
      "Give your long URLs a shorter and more professional look with TinyURL."
  },
  {
    image: "feature-4.webp",
    title: "Your Links. One Simple Solution.",
    description:
      "Shorten, organize and manage your links from one simple and powerful platform."
  }
];

let currentSlide = 0;

const background = document.querySelector(".landing-background");
const title = document.getElementById("landing-title");
const description = document.getElementById("landing-description");
const slideNumber = document.getElementById("landing-slide");

function showSlide(index) {
  const slide = slides[index];

  background.style.backgroundImage = `url("${slide.image}")`;

  title.textContent = slide.title;
  description.textContent = slide.description;

  slideNumber.textContent = String(index + 1).padStart(2, "0");
}

showSlide(currentSlide);

setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, 4000);
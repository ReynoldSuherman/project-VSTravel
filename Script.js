document.addEventListener("DOMContentLoaded", () => {
  console.log("Script.js DOMContentLoaded event fired");

  class Slideshow {
    constructor(destinations, slideshowElement, greetingsMap) {
      this.destinations = destinations;
      this.slideshowElement = slideshowElement;
      this.greetingsMap = greetingsMap;
      this.slideIndex = 0;
      this.animationFrameId = null;
      // Cari greeting-animated di seluruh dokumen (bukan hanya di slideshow)
      this.greetingElements = document.querySelectorAll(".greeting-animated");
      this.debounceTimeout = null;
      this.greetingAnimationIntervals = new Map();
      this.greetingAnimationFrameIds = new Map();
      this.isGreetingAnimating = false;
      if (this.slideshowElement) {
        this.initSlideshow();
      }
      this.startGreetingAnimations(); // Selalu jalankan greeting animasi
    }

    initSlideshow() {
      // Inisialisasi slideshow saja
      this.prevBtn = this.slideshowElement.querySelector(".prev");
      this.nextBtn = this.slideshowElement.querySelector(".next");
      this.slidesContainer = this.slideshowElement.querySelector(
        ".slideshow-container"
      );
      // Hapus isi slidesContainer sebelum render
      this.slidesContainer.innerHTML = "";
      this.destinations.forEach((dest, index) => {
        const slideWrapper = document.createElement("div");
        slideWrapper.classList.add("slide-wrapper");
        if (index === 0) slideWrapper.classList.add("active");

        const img = document.createElement("img");
        img.src = dest.image;
        img.alt = dest.name;
        img.classList.add("slide");
        slideWrapper.appendChild(img);

        const caption = document.createElement("div");
        caption.classList.add("caption");
        caption.textContent = dest.name;
        slideWrapper.appendChild(caption);

        this.slidesContainer.appendChild(slideWrapper);
      });

      this.prevBtn.addEventListener("click", () =>
        this.debounce(() => this.prevSlide(), 300)
      );
      this.nextBtn.addEventListener("click", () =>
        this.debounce(() => this.nextSlide(), 300)
      );

      this.autoSlideInterval = setInterval(() => this.nextSlide(), 5000);

      this.showSlide(this.slideIndex);
    }

    debounce(func, delay) {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(func, delay);
    }

    showSlide(index) {
      console.log("Showing slide index:", index);
      const slideWrappers =
        this.slidesContainer.querySelectorAll(".slide-wrapper");
      slideWrappers.forEach((wrapper, i) => {
        const img = wrapper.querySelector(".slide");
        const caption = wrapper.querySelector(".caption");
        if (img) img.classList.toggle("active", i === index);
        if (caption) caption.style.display = i === index ? "block" : "none";
      });
      this.stopAllGreetingAnimations(); // Stop animasi sebelum update
      this.updateGreeting();
      this.startGreetingAnimations(); // Mulai ulang animasi greeting
    }

    stopAllGreetingAnimations() {
      // Hentikan semua animasi greeting yang sedang berjalan
      this.greetingElements.forEach((el) => {
        // Hapus semua requestAnimationFrame
        if (this.greetingAnimationFrameIds.has(el)) {
          cancelAnimationFrame(this.greetingAnimationFrameIds.get(el));
          this.greetingAnimationFrameIds.delete(el);
        }
        // Hapus semua timeout
        if (this.greetingAnimationIntervals.has(el)) {
          clearTimeout(this.greetingAnimationIntervals.get(el));
          this.greetingAnimationIntervals.delete(el);
        }
        // Hapus semua child node (bukan hanya textContent)
        while (el.firstChild) {
          el.removeChild(el.firstChild);
        }
      });
      this.isGreetingAnimating = false;
    }

    typeGreetingComplex(element, text, callback) {
      // Animasi greeting dengan efek typing dan blinking cursor
      let i = 0;
      // Hapus semua child node agar tidak ada cursor tertinggal
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      const cursor = document.createElement("span");
      cursor.className = "blinking-cursor";
      cursor.textContent = "|";
      element.appendChild(cursor);
      const typeNextChar = () => {
        if (i < text.length) {
          // Cek apakah cursor masih child dari element
          if (cursor.parentNode !== element) return; // Stop jika sudah dihapus
          element.insertBefore(document.createTextNode(text.charAt(i)), cursor);
          i++;
          this.greetingAnimationFrameIds.set(
            element,
            requestAnimationFrame(typeNextChar)
          );
        } else {
          if (cursor.parentNode === element) cursor.remove();
          this.greetingAnimationFrameIds.delete(element);
          setTimeout(() => {
            if (typeof callback === "function") callback();
          }, 1500);
        }
      };
      this.greetingAnimationFrameIds.set(
        element,
        requestAnimationFrame(typeNextChar)
      );
    }

    startGreetingAnimations() {
      this.greetingElements.forEach((el) => {
        // Pastikan semua animasi dan timeout dibersihkan sebelum mulai baru
        if (this.greetingAnimationIntervals.has(el)) {
          clearTimeout(this.greetingAnimationIntervals.get(el));
          this.greetingAnimationIntervals.delete(el);
        }
        if (this.greetingAnimationFrameIds.has(el)) {
          cancelAnimationFrame(this.greetingAnimationFrameIds.get(el));
          this.greetingAnimationFrameIds.delete(el);
        }
        // Hapus semua child node agar tidak ada glitch
        while (el.firstChild) {
          el.removeChild(el.firstChild);
        }
        const animateGreeting = () => {
          const currentDestination = this.getCurrentDestinationName();
          const greetingsArr = this.greetingsMap[currentDestination] || [
            "Hello",
          ];
          let greetIdx = 0;
          const showNextGreeting = () => {
            if (greetIdx >= greetingsArr.length) greetIdx = 0;
            this.typeGreetingComplex(el, greetingsArr[greetIdx], () => {
              greetIdx++;
              const timeoutId = setTimeout(showNextGreeting, 1800);
              this.greetingAnimationIntervals.set(el, timeoutId);
            });
          };
          showNextGreeting();
        };
        animateGreeting();
      });
      this.isGreetingAnimating = true;
    }

    updateGreeting() {
      const currentDestination = this.getCurrentDestinationName();
      this.greetingElements.forEach((el) => {
        el.textContent = this.greetingsMap[currentDestination] || "Hello";
      });
    }

    nextSlide() {
      this.slideIndex = (this.slideIndex + 1) % this.destinations.length;
      this.showSlide(this.slideIndex);
    }

    prevSlide() {
      this.slideIndex =
        (this.slideIndex - 1 + this.destinations.length) %
        this.destinations.length;
      this.showSlide(this.slideIndex);
    }

    getCurrentDestinationName() {
      if (this.slideshowElement) {
        return this.destinations[this.slideIndex]?.name || null;
      }
      const path = window.location.pathname;
      const page = path.substring(path.lastIndexOf("/") + 1).toLowerCase();
      for (const dest of this.destinations) {
        if (dest.link.toLowerCase().endsWith(page)) {
          return dest.name;
        }
      }
      return null;
    }
  }

  // Destination data for slideshow and greetings
  const destinations = [
    {
      name: "Dubai",
      image: "assets/Images/dubai.jpg",
      link: "destinations/dubai.html",
    },
    {
      name: "Paris",
      image: "assets/Images/paris.jpg",
      link: "destinations/paris.html",
    },
    {
      name: "Santorini",
      image: "assets/Images/santorini.jpg",
      link: "destinations/santorini.html",
    },
    {
      name: "Tokyo",
      image: "assets/Images/tokyo.jpg",
      link: "destinations/tokyo.html",
    },
    {
      name: "Mekah",
      image: "assets/Images/622aef6626cd2-mekah-kabah_1265_711.jpg",
      link: "destinations/mekah.html",
    },
    {
      name: "Bali",
      image: "assets/Images/Bali.jpg",
      link: "destinations/bali.html",
    },
    {
      name: "New York",
      image: "assets/Images/New york.jpeg",
      link: "destinations/newyork.html",
    },
    {
      name: "London",
      image: "assets/Images/London.jpg",
      link: "destinations/london.html",
    },
    {
      name: "Sydney",
      image: "assets/Images/Sydney.jpg",
      link: "destinations/sydney.html",
    },
    {
      name: "Cape Town",
      image: "assets/Images/Cape Town.jpg",
      link: "destinations/capetown.html",
    },
  ];

  // Greeting animation data with language codes matching destinations
  const greetingsMap = {
    Dubai: ["مرحبا", "Marhaban", "Hello"], // Arabic, translit, English
    Paris: ["Bonjour", "Hello"], // French, English
    Santorini: ["Γειά σου", "Geia sou", "Hello"], // Greek, translit, English
    Tokyo: ["こんにちは", "Konnichiwa", "Hello"], // Japanese, translit, English
    Mekah: ["السلام عليكم", "Assalamu'alaikum", "Hello"], // Arabic, translit, English
    Bali: ["Halo", "Hello", "こんにちは"], // Indonesian, English, Japanese
    "New York": ["Hello", "Hola", "你好"], // English, Spanish, Chinese
    London: ["Hello", "Bonjour", "Hallo"], // English, French, German
    Sydney: ["Hello", "G'day", "こんにちは"], // English, Australian, Japanese
    "Cape Town": ["Hallo", "Hello", "Sawubona"], // Afrikaans, English, Zulu
    Bangkok: ["สวัสดี", "Sawasdee", "Hello"], // Thai, translit, English
    Jakarta: ["Halo", "Selamat Datang", "Hello"], // Indonesian, formal, English
    Singapore: ["Hello", "你好", "வணக்கம்"], // English, Chinese, Tamil
    Rome: ["Ciao", "Hello", "Salve"], // Italian, English, Latin
    Yogyakarta: ["Halo", "Sugeng Rawuh", "Hello"], // Indonesian, Javanese, English
  };

  const slideshowElement = document.getElementById("slideshow");
  const slideshow = new Slideshow(destinations, slideshowElement, greetingsMap);

  // Debug
  console.log(
    "Current slide destination:",
    slideshow.getCurrentDestinationName()
  );

  // --- SLIDESHOW FIX ---
  // Ambil elemen slideshow
  const slideshowContainer = slideshowElement.querySelector(
    ".slideshow-container"
  );
  const prevBtn = slideshowElement.querySelector(".prev");
  const nextBtn = slideshowElement.querySelector(".next");
  const indicators = slideshowElement.querySelector(".slideshow-indicators");

  // Data destinasi untuk slideshow
  const slidesData = [
    { image: "assets/Images/Bali.jpg", caption: "Bali - Pulau Dewata" },
    { image: "assets/Images/Bali1.jpg", caption: "Bali - Alam & Budaya" },
    { image: "assets/Images/Bali2.jpg", caption: "Bali - Tradisi & Pantai" },
    { image: "assets/Images/Paris.jpg", caption: "Paris - Kota Cahaya" },
    { image: "assets/Images/paris2.jpg", caption: "Paris - Romantis" },
    { image: "assets/Images/Paris3.jpg", caption: "Paris - Ikon Dunia" },
    { image: "assets/Images/Tokyo.jpg", caption: "Tokyo - Modern & Tradisi" },
    { image: "assets/Images/tokyo1.jpg", caption: "Tokyo - Kota Futuristik" },
    { image: "assets/Images/tokyo2.jpeg", caption: "Tokyo - Budaya Jepang" },
    { image: "assets/Images/Dubai.jpg", caption: "Dubai - Kota Mewah" },
    { image: "assets/Images/Dubai1.jpg", caption: "Dubai - Arsitektur Ikonik" },
    { image: "assets/Images/Dubai2.png", caption: "Dubai - Surga Belanja" },
    { image: "assets/Images/Sydney.jpg", caption: "Sydney - Kota Pelabuhan" },
    { image: "assets/Images/Sydney1.jpg", caption: "Sydney - Opera House" },
    { image: "assets/Images/Sydney2.jpg", caption: "Sydney - Pantai Bondi" },
    {
      image: "assets/Images/Cape Town.jpg",
      caption: "Cape Town - Afrika Selatan",
    },
    {
      image: "assets/Images/cape-town1.jpg",
      caption: "Cape Town - Table Mountain",
    },
    { image: "assets/Images/cape-town2.jpg", caption: "Cape Town - Pesisir" },
    {
      image: "assets/Images/Bangkok.jpg",
      caption: "Bangkok - Kota Seribu Wihara",
    },
    {
      image: "assets/Images/Bangkok1.jpg",
      caption: "Bangkok - Budaya Buddhis yang Kuat",
    },
    { image: "assets/Images/Bangkok2.jpg", caption: "Bangkok - Pasar Malam" },
    {
      image: "assets/Images/Jakarta.jpg",
      caption: "Jakarta - Ibukota Indonesia",
    },
    {
      image: "assets/Images/Jakarta1.jpg",
      caption: "Jakarta - Kota Metropolitan",
    },
    { image: "assets/Images/jakarta2.jpg", caption: "Jakarta - Budaya Betawi" },
    { image: "assets/Images/London.jpg", caption: "London - Kota Bersejarah" },
    { image: "assets/Images/London1.jpg", caption: "London - Big Ben" },
    { image: "assets/Images/London2.jpg", caption: "London - Sungai Thames" },
    { image: "assets/Images/Mekah.jpg", caption: "Mekah - Kota Suci" },
    { image: "assets/Images/Mekah1.jpg", caption: "Mekah - Masjidil Haram" },
    { image: "assets/Images/Mekah2.jpg", caption: "Mekah - Ibadah Haji" },
    { image: "assets/Images/New york.jpeg", caption: "New York - Liberty" },
    { image: "assets/Images/Newyork1.jpg", caption: "New York - Manhattan" },
    { image: "assets/Images/Newyork2.jpg", caption: "New York - Kota Impian" },
    { image: "assets/Images/rome1.jpg", caption: "Rome - Kota Abadi" },
    { image: "assets/Images/Rome2.jpg", caption: "Rome - Colosseum" },
    { image: "assets/Images/Rome.jpg", caption: "Rome - Sejarah & Seni" },
    { image: "assets/Images/santorini.jpg", caption: "Santorini - Yunani" },
    {
      image: "assets/Images/Santorini2.jpg",
      caption: "Santorini - Laut Aegea",
    },
    { image: "assets/Images/Satorini1.jpg", caption: "Santorini - Sunset" },
    { image: "assets/Images/Singapore.jpg", caption: "Singapore - Kota Singa" },
    {
      image: "assets/Images/Singapore1.jpeg",
      caption: "Singapore - Marina Bay",
    },
    {
      image: "assets/Images/Singapore2.jpeg",
      caption: "Singapore - Gardens by the Bay",
    },
    {
      image: "assets/Images/Yogyakarta.jpg",
      caption: "Yogyakarta - Kota Budaya",
    },
    {
      image: "assets/Images/Yogyakarta1.jpg",
      caption: "Yogyakarta - Candi Borobudur",
    },
    {
      image: "assets/Images/Yogyakarta2.jpg",
      caption: "Yogyakarta - Malioboro",
    },
  ];

  let slideIndex = 0;
  let autoSlideInterval;

  function renderSlides() {
    slideshowContainer.innerHTML = "";
    slidesData.forEach((slide, i) => {
      const slideDiv = document.createElement("div");
      slideDiv.className =
        "slide-wrapper" + (i === slideIndex ? " active" : "");
      slideDiv.innerHTML = `
        <img src="${slide.image}" alt="${slide.caption}" />
        <div class="slide-caption">${slide.caption}</div>
      `;
      slideshowContainer.appendChild(slideDiv);
    });
  }

  function updateSlideshow() {
    renderSlides();
  }

  function nextSlide() {
    slideIndex = (slideIndex + 1) % slidesData.length;
    updateSlideshow();
  }
  function prevSlide() {
    slideIndex = (slideIndex - 1 + slidesData.length) % slidesData.length;
    updateSlideshow();
  }
  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  // Inisialisasi slideshow
  if (
    slideshowElement &&
    slideshowContainer &&
    prevBtn &&
    nextBtn /* && indicators */
  ) {
    renderSlides();
    // renderIndicators();
    prevBtn.onclick = () => {
      prevSlide();
      resetAutoSlide();
    };
    nextBtn.onclick = () => {
      nextSlide();
      resetAutoSlide();
    };
    autoSlideInterval = setInterval(nextSlide, 5000);
  }
});

/* Tambahkan CSS untuk blinking cursor jika belum ada:
.blinking-cursor {
  animation: blink 1s steps(2, start) infinite;
}
@keyframes blink {
  to {
    visibility: hidden;
  }
}
*/

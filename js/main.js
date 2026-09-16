document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       Smart Time-Aware Mystical Greeting (Feature 7)
       ========================================================================== */
    const greetings = {
        dawn: [
            "شروق شمس جديد.. وطاقة جديدة مستعدة لإرشادك اليوم.",
            "في هدوء هذا الصباح.. هناك إجابة تنتظر أن تُكشف لك.",
            "نور الفجر يزيح ظلام الشك.. خذ نفساً عميقاً واستعد.",
            "بداية يومك تحمل معها رسائل خفية.. هل أنت مستعد لقراءتها؟",
            "طاقة الصباح هي طاقة البدايات.. افتح قلبك لما سيأتيك الآن."
        ],
        day: [
            "وسط صخب يومك.. حدسك قادك إلى هنا لسبب.",
            "طاقة الشمس في أوجها.. وكل مسار غامض يمكن أن يُضاء الآن.",
            "توقف للحظة في زحام يومك.. هناك رسالة حقيقية تحتاج لسماعها.",
            "نور النهار يكشف ما خفي في الظلام.. دعنا نرى ما تخبئه أوراقك.",
            "كل خطوة خطوتها اليوم قادتك لهذه اللحظة.. استمع لروحك."
        ],
        dusk: [
            "مع غروب الشمس، تتضح الرؤى وتتصل الأرواح.",
            "هدوء المساء يحمل لك طمأنينة وإجابات طال انتظارها.",
            "بين النور والظلام.. تتجلى الحقائق وتنكشف الأسرار.",
            "يومك يشارف على الانتهاء.. لكن رسالتك الحقيقية تبدأ هنا.",
            "طاقة التاروت تزداد قوة في هذا الوقت.. هل أنت جاهز؟"
        ],
        midnight: [
            "في عتمة هذا الليل وسكونه، الأرواح تتحدث بصوت أوضح.",
            "أنت مستيقظ الآن لسبب.. هناك إجابة تبحث عنك في هذا الظلام.",
            "طاقة القمر الليلة قوية جداً.. دعه يرشدك لما هو مخفي.",
            "الأسرار لا تكشف نفسها إلا لمن يسهر بحثاً عنها...",
            "في هذا الوقت المتأخر، حدسك في أعلى مراحله.. استمع إليه."
        ]
    };

    function setSmartGreeting() {
        const hour = new Date().getHours();
        let period = 'day';

        if (hour >= 4 && hour < 9) {
            period = 'dawn';
        } else if (hour >= 9 && hour < 17) {
            period = 'day';
        } else if (hour >= 17 && hour < 21) {
            period = 'dusk';
        } else {
            period = 'midnight';
        }

        const messages = greetings[period];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        const greetingEl = document.getElementById('dynamic-greeting');
        if (greetingEl) {
            greetingEl.textContent = randomMessage;
        }
    }
    setSmartGreeting();

    
    /* ==========================================================================
       Daily Tarot Card Feature
       ========================================================================== */
    const dailyCardWrapper = document.getElementById('daily-card-wrapper');
    const dailyReadingContainer = document.getElementById('daily-reading-container');
    const dailyReadingTitle = document.getElementById('daily-reading-title');
    const dailyReadingText = document.getElementById('daily-reading-text');
    let hasDrawnCard = false;

    if (dailyCardWrapper && typeof tarotCardsData !== 'undefined') {
        const today = new Date().toLocaleDateString();
        let savedDate = localStorage.getItem('tarotDrawDate');
        let savedCard = localStorage.getItem('tarotDailyCard');
        let randomKey;

        if (savedDate === today && savedCard) {
            randomKey = parseInt(savedCard);
        } else {
            randomKey = Math.floor(Math.random() * 20) + 1;
            localStorage.setItem('tarotDrawDate', today);
            localStorage.setItem('tarotDailyCard', randomKey);
        }

        const cardData = tarotCardsData[randomKey];
        
        // Generate 5 cards for the fan
        for(let i=0; i<5; i++) {
            const cardEl = document.createElement('div');
            cardEl.className = 'fan-card tarot-card-3d';
            cardEl.innerHTML = `
                <div class="card-face card-back">
                    <div class="card-back-design">
                        <div class="mystic-circle"></div>
                        <span>Oracle</span>
                    </div>
                    <div class="card-glare"></div>
                </div>
                <div class="card-face card-front">
                    <img src="" alt="بطاقة تاروت مجانية يومية" class="daily-card-img">
                    <div class="card-glare"></div>
                </div>
            `;
            // Set rotation for the fan effect
            const rotation = (i - 2) * 15; // -30, -15, 0, 15, 30
            cardEl.style.transform = `rotateZ(${rotation}deg) translateY(${Math.abs(rotation)*2}px)`;

            cardEl.addEventListener('click', function() {
                if (hasDrawnCard) return;
                hasDrawnCard = true;
                
                // Smoothly hide other cards
                document.querySelectorAll('.fan-card').forEach(c => {
                    if(c !== this) {
                        c.classList.add('discarded');
                    }
                });
                
                // Set front image
                this.querySelector('.daily-card-img').src = 'cards/' + randomKey + '.jpg';
                
                this.classList.add('drawn');
                
                setTimeout(() => {
                    this.classList.add('flipped');
                    
                    setTimeout(() => {
                        if (dailyReadingTitle) dailyReadingTitle.textContent = cardData.name;
                        dailyReadingContainer.classList.add('visible');

                        const rect = dailyReadingContainer.getBoundingClientRect();
                        if (rect.bottom > window.innerHeight) {
                            window.scrollBy({ top: rect.bottom - window.innerHeight + 20, behavior: 'smooth' });
                        }

                        // Typewriter effect for reading text
                        if (dailyReadingText) {
                            dailyReadingText.innerHTML = ''; // Clear initially
                            
                            let i = 0;
                            let isTag = false;
                            let currentHTML = '';
                            const htmlString = cardData.text;
                            
                            function typeWriter() {
                                if (i < htmlString.length) {
                                    let char = htmlString.charAt(i);
                                    currentHTML += char;
                                    
                                    if (char === '<') isTag = true;
                                    if (char === '>') isTag = false;
                                    
                                    dailyReadingText.innerHTML = currentHTML;
                                    i++;
                                    
                                    if (isTag) {
                                        typeWriter(); // Skip delays for HTML tags
                                    } else {
                                        setTimeout(typeWriter, 15); // Fast typing speed
                                    }
                                }
                            }
                            typeWriter();
                        }
                    }, 1200);
                }, 1500);
            });
            dailyCardWrapper.appendChild(cardEl);
        }
    }

    /* ==========================================================================
       Set Current Year
       ========================================================================== */
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /* ==========================================================================
       Background Audio Controller
       ========================================================================== */
    const audio = document.getElementById('bg-audio');
    const audioBtn = document.getElementById('audio-toggle');
    const audioText = document.getElementById('audio-text');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');

    if (audio && audioBtn) {
        audio.volume = 0.4; // Set a relaxing default volume
        
        audioBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play().then(() => {
                    audioBtn.classList.add('playing');
                    audioText.textContent = 'إطفاء الصوت';
                    iconPlay.style.display = 'none';
                    iconPause.style.display = 'block';
                }).catch(err => console.log('Audio play failed:', err));
            } else {
                audio.pause();
                audioBtn.classList.remove('playing');
                audioText.textContent = 'تشغيل الصوت';
                iconPlay.style.display = 'block';
                iconPause.style.display = 'none';
            }
        });
    }

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ==========================================================================
       1. Cinematic Preloader
       ========================================================================== */
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Show the preloader for 2.5 seconds then fade out
        const hidePreloader = () => {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
            // Trigger smooth reveal animation for main content
            setTimeout(() => {
                document.body.classList.add('loaded');
            }, 100);
        };

        // Prevent scroll while preloader is active
        document.body.style.overflow = 'hidden';

        if (prefersReducedMotion) {
            // Skip preloader animation entirely
            hidePreloader();
        } else {
            setTimeout(hidePreloader, 2500);
        }
    }

    /* ==========================================================================
       2. Real-time Moon Phase Calculator
       ========================================================================== */
    function calculateMoonPhase() {
        const now = new Date();
        // Known new moon reference: Jan 6, 2000 18:14 UTC
        const knownNewMoon = new Date(2000, 0, 6, 18, 14, 0);
        const synodicMonth = 29.53058770576; // days

        const daysSinceKnown = (now.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
        const currentCycle = daysSinceKnown / synodicMonth;
        const phase = currentCycle - Math.floor(currentCycle); // 0 to 1

        return phase;
    }

    function getMoonPhaseName(phase) {
        if (phase < 0.03 || phase >= 0.97)  return 'محاق';          // New Moon
        if (phase < 0.22)                    return 'هلال متزايد';    // Waxing Crescent
        if (phase < 0.28)                    return 'تربيع أول';     // First Quarter
        if (phase < 0.47)                    return 'أحدب متزايد';   // Waxing Gibbous
        if (phase < 0.53)                    return 'بدر';           // Full Moon
        if (phase < 0.72)                    return 'أحدب متناقص';   // Waning Gibbous
        if (phase < 0.78)                    return 'تربيع أخير';    // Last Quarter
        return 'هلال متناقص';                                        // Waning Crescent
    }

    function drawMoonSVG(phase) {
        const shadow = document.getElementById('moon-shadow');
        if (!shadow) return;

        const cx = 16, cy = 16, r = 14;

        // phase: 0 = new moon (all dark), 0.5 = full moon (all bright)
        let d;

        if (phase < 0.5) {
            // Waxing: shadow shrinks from left side
            const sweep = 1 - (phase * 4 - 1); // controls the curve
            const curveX = cx + r * Math.cos(Math.PI * phase * 2 - Math.PI);

            if (phase < 0.25) {
                // More than half dark
                const bulge = r * (1 - phase * 4);
                d = `M ${cx} ${cy - r}
                     A ${r} ${r} 0 1 0 ${cx} ${cy + r}
                     A ${bulge} ${r} 0 0 1 ${cx} ${cy - r} Z`;
            } else {
                // Less than half dark
                const bulge = r * ((phase - 0.25) * 4);
                d = `M ${cx} ${cy - r}
                     A ${r} ${r} 0 1 0 ${cx} ${cy + r}
                     A ${bulge} ${r} 0 0 0 ${cx} ${cy - r} Z`;
            }
        } else {
            // Waning: shadow grows from right side
            const wane = phase - 0.5;

            if (wane < 0.25) {
                const bulge = r * (wane * 4);
                d = `M ${cx} ${cy - r}
                     A ${r} ${r} 0 1 1 ${cx} ${cy + r}
                     A ${bulge} ${r} 0 0 0 ${cx} ${cy - r} Z`;
            } else {
                const bulge = r * (1 - (wane - 0.25) * 4);
                d = `M ${cx} ${cy - r}
                     A ${r} ${r} 0 1 1 ${cx} ${cy + r}
                     A ${bulge} ${r} 0 0 1 ${cx} ${cy - r} Z`;
            }
        }

        shadow.setAttribute('d', d);
    }

    function getMoonPhaseMeaning(phaseName) {
        const meanings = {
            'محاق': 'بداية جديدة، طاقة مثالية لتحديد النوايا والبدء بمشاريع جديدة.',
            'هلال متزايد': 'طاقة نمو، ركز على بناء أهدافك ووضع خطط واضحة.',
            'تربيع أول': 'وقت اتخاذ القرارات ومواجهة التحديات بقوة وإرادة.',
            'أحدب متزايد': 'طاقة التعديل والتحسين، اقترب أكثر من أهدافك.',
            'بدر': 'اكتمال ووضوح، طاقة قوية جداً لجني الثمار واكتشاف الحقائق.',
            'أحدب متناقص': 'وقت للتأمل والمراجعة، تقبل ما حدث وابدأ بالتنظيف الطاقي.',
            'تربيع أخير': 'طاقة التحرر والتخلص من ما لم يعد يخدمك.',
            'هلال متناقص': 'فترة راحة واستشفاء قبل بداية دورة قمرية جديدة.'
        };
        return meanings[phaseName] || 'طاقة متجددة.';
    }

    // Initialize Moon Phase
    const moonLabel = document.getElementById('moon-label');
    const moonMeaning = document.getElementById('moon-meaning');
    const phase = calculateMoonPhase();
    const phaseName = getMoonPhaseName(phase);

    if (moonLabel) {
        moonLabel.textContent = phaseName;
    }
    if (moonMeaning) {
        moonMeaning.textContent = getMoonPhaseMeaning(phaseName);
    }
    drawMoonSVG(phase);

    // Update tooltip
    const moonPhaseEl = document.getElementById('moon-phase');
    if (moonPhaseEl) {
        moonPhaseEl.removeAttribute('title'); // Removed default title for custom dropdown
    }

    /* ==========================================================================
       3. Universal Touch & Mouse 3D Tilt Effect
       ========================================================================== */
    const tiltCards = document.querySelectorAll('[data-gyro]');

    if (tiltCards.length > 0 && !prefersReducedMotion) {
        tiltCards.forEach(card => {
            const handleMove = (e) => {
                let clientX = e.clientX;
                let clientY = e.clientY;

                if (e.type === 'touchmove' || e.type === 'touchstart') {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                }

                const rect = card.getBoundingClientRect();
                const x = clientX - rect.left;
                const y = clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -10; // max 10deg
                const rotateY = ((x - centerX) / centerX) * 10;

                // Move the glare
                const glareAngle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 90;

                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                card.classList.add('gyro-active');

                if (card.style) {
                    card.style.setProperty('--glare-angle', `${glareAngle}deg`);
                }
            };

            const handleLeave = () => {
                card.style.transform = '';
                card.classList.remove('gyro-active');
            };

            // Desktop events
            card.addEventListener('mousemove', handleMove);
            card.addEventListener('mouseleave', handleLeave);
            
            // Mobile events (Touch)
            card.addEventListener('touchmove', handleMove, { passive: true });
            card.addEventListener('touchstart', handleMove, { passive: true });
            card.addEventListener('touchend', handleLeave);
        });
    }

    /* ==========================================================================
       Navbar Scroll Effect
       ========================================================================== */
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       Mobile Menu Toggle
       ========================================================================== */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            const isActive = mobileMenu.classList.contains('active');

            if (isActive) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    function openMenu() {
        mobileToggle.classList.add('active');
        mobileToggle.setAttribute('aria-expanded', 'true');
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    /* ==========================================================================
       Scroll Reveal Animation
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const revealOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.15
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, revealOptions);

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    } else {
        revealElements.forEach(el => {
            el.classList.add('is-visible');
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }

    /* ==========================================================================
       Energy Aura Glow (Feature 5)
       ========================================================================== */
    const servicesSection = document.getElementById('services');
    const screenAura = document.getElementById('screen-aura');
    
    if (servicesSection && screenAura && !prefersReducedMotion && 'IntersectionObserver' in window) {
        const auraOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2 // Trigger when 20% of the services section is visible
        };

        const auraObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    screenAura.classList.add('active');
                } else {
                    screenAura.classList.remove('active');
                }
            });
        }, auraOptions);

        auraObserver.observe(servicesSection);
    }

    /* ==========================================================================
       Ambient Scroll Lights & Deep Space Parallax
       ========================================================================== */
    const orbs = document.querySelectorAll('.ambient-orb');
    const farElements = document.querySelectorAll('.parallax-far');
    
    if ((orbs.length > 0 || farElements.length > 0) && !prefersReducedMotion) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            if (orbs.length > 0) {
                // Orb 1: Moves down slowly and pulses opacity
                orbs[0].style.transform = `translateY(${scrollY * 0.15}px) translateX(${scrollY * 0.05}px)`;
                orbs[0].style.opacity = Math.max(0.1, 0.4 - scrollY * 0.0003);
                
                // Orb 2: Moves up, scales, and increases opacity initially
                orbs[1].style.transform = `translateY(${scrollY * -0.12}px) translateX(${scrollY * -0.05}px) scale(${1 + scrollY * 0.0001})`;
                orbs[1].style.opacity = Math.min(0.5, 0.15 + scrollY * 0.0004);
                
                // Orb 3: Slowly floats left
                orbs[2].style.transform = `translateY(${scrollY * 0.08}px) translateX(${scrollY * -0.1}px) scale(${1 - scrollY * 0.0001})`;
                orbs[2].style.opacity = 0.6 - (scrollY * 0.0002);
            }

            // Deep space parallax (moves extremely slowly because it's far away)
            farElements.forEach((el, index) => {
                const speed = 0.03 + (index * 0.01); // Subtle speed variance
                const direction = index % 2 === 0 ? 1 : -1;
                el.style.transform = `translateY(${scrollY * speed}px) translateX(${scrollY * speed * 0.5 * direction}px)`;
            });
            
        }, { passive: true });
    }

    /* ==========================================================================
       Canvas Atmospheric Background
       ========================================================================== */
    const canvas = document.getElementById('atmosphere');

    if (canvas && !prefersReducedMotion) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 30 : 80;

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.2;
                this.speedY = (Math.random() - 0.5) * 0.2;
                const colors = ['rgba(212, 175, 55, 0.4)', 'rgba(244, 240, 230, 0.3)', 'rgba(170, 140, 44, 0.2)'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        let touchParticles = [];

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        /* Feature 3: Magic Touch Dust */
        class TouchParticle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 2 + 0.5;
                const angle = Math.random() * Math.PI * 2;
                const velocity = Math.random() * 1.5 + 0.2;
                this.speedX = Math.cos(angle) * velocity;
                this.speedY = Math.sin(angle) * velocity;
                this.life = 1.0;
                this.decay = Math.random() * 0.02 + 0.015;
                this.color = '212, 175, 55'; // Gold base color
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life -= this.decay;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.life})`;
                ctx.fill();
            }
        }

        function addTouchBurst(x, y) {
            for (let i = 0; i < 15; i++) {
                touchParticles.push(new TouchParticle(x, y));
            }
        }

        window.addEventListener('click', (e) => {
            addTouchBurst(e.clientX, e.clientY);
        });

        window.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                addTouchBurst(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        let isCanvasVisible = true;
        
        function animate() {
            if (isCanvasVisible) {
                ctx.clearRect(0, 0, width, height);
                
                // Draw ambient particles
                for (let i = 0; i < particles.length; i++) {
                    particles[i].update();
                    particles[i].draw();
                }
                
                // Draw touch burst particles
                for (let i = touchParticles.length - 1; i >= 0; i--) {
                    touchParticles[i].update();
                    if (touchParticles[i].life <= 0) {
                        touchParticles.splice(i, 1);
                    } else {
                        touchParticles[i].draw();
                    }
                }
            }
            
            requestAnimationFrame(animate);
        }

        // Performance Optimization: Pause canvas when out of view
        const canvasObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isCanvasVisible = entry.isIntersecting;
            });
        }, { threshold: 0 });
        
        // Observe the main container or body, but since canvas is fixed, we observe a hero section
        const heroSection = document.getElementById('home');
        if (heroSection) {
            canvasObserver.observe(heroSection);
        }

        window.addEventListener('resize', () => {
            resize();
            if (Math.abs(width - window.innerWidth) > 100) {
                initParticles();
            }
        });

        resize();
        initParticles();
        animate();
    }

    /* ==========================================================================
       Crystal Ball Logic
       ========================================================================== */
    const cbInput = document.getElementById('cb-question-input');
    const cbBtn = document.getElementById('cb-ask-btn');
    const cbBall = document.getElementById('the-crystal-ball');
    const cbAnswer = document.getElementById('cb-answer');
    
    let isThinking = false;
    
    const magicalAnswers = [
        "الطاقة لصالحك بقوة",
        "الرؤية ضبابية الآن، اسأل لاحقاً",
        "تحلّ بالصبر، الوقت لم يحن بعد",
        "نعم، ولكن احذر من التسرع",
        "طاقة قوية جداً تدعمك",
        "الجواب في قلبك.. وهو نعم",
        "الكون يخبئ لك مفاجأة أفضل",
        "لا تتردد، امضِ قُدماً",
        "الأرواح تشير إلى التروي",
        "العلامات كلها تقول نعم",
        "ليس الآن.. طهر طاقتك وحاول غداً"
    ];

    function askCrystalBall() {
        if (isThinking) return;
        
        // Check local storage for daily limit
        const lastQuestionDate = localStorage.getItem('last_cb_question_date');
        const today = new Date().toDateString();
        
        if (lastQuestionDate === today) {
            // Already asked today
            cbBall.classList.remove('is-thinking');
            cbBall.classList.add('has-answer');
            cbAnswer.textContent = "لقد سألت سؤالك اليوم، طهر طاقتك وعد غداً!";
            // Flash red on input border or just change placeholder text
            cbInput.value = "";
            cbInput.placeholder = "مسموح بسؤال واحد يومياً";
            cbInput.style.borderColor = "red";
            setTimeout(() => cbInput.style.borderColor = "", 1000);
            return;
        }

        const question = cbInput.value.trim();
        if (question === "") {
            cbInput.style.borderColor = "red";
            setTimeout(() => cbInput.style.borderColor = "", 1000);
            return;
        }

        isThinking = true;
        
        // Reset state
        cbBall.classList.remove('has-answer');
        cbBall.classList.add('is-thinking');
        
        // Save today's date so they can't ask again
        localStorage.setItem('last_cb_question_date', today);

        // Send question to PHP log script in the background
        fetch('save_question.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `question=${encodeURIComponent(question)}&screen_width=${window.innerWidth}&screen_height=${window.innerHeight}&language=${navigator.language}`
        }).catch(err => console.log('Error saving question:', err));

        // Simulate reading energy for 2.5 seconds
        setTimeout(() => {
            const randomAnswer = magicalAnswers[Math.floor(Math.random() * magicalAnswers.length)];
            cbAnswer.textContent = randomAnswer;
            
            cbBall.classList.remove('is-thinking');
            cbBall.classList.add('has-answer');
            isThinking = false;
        }, 2500);
    }

    if (cbBtn && cbBall) {
        cbBtn.addEventListener('click', askCrystalBall);
        
        // Also allow clicking the ball itself
        cbBall.addEventListener('click', askCrystalBall);
        
        // Allow Enter key
        cbInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                askCrystalBall();
            }
        });
    }

    /* ==========================================================================
       Quiz Section Logic
       ========================================================================== */
    const quizOptions = document.querySelectorAll('.quiz-btn');
    const quizQuestionContainer = document.getElementById('quiz-question-container');
    const quizResultContainer = document.getElementById('quiz-result-container');
    const quizResultName = document.getElementById('quiz-result-name');
    const quizResultDesc = document.getElementById('quiz-result-desc');
    const quizReset = document.getElementById('quiz-reset');

    const quizResultsMap = {
        'عاطفية': {
            name: 'قراءة تاروت عاطفية',
            desc: 'بما أن تفكيرك مشغول بشخص معين أو علاقة، فهذه القراءة هي الأنسب لك لكشف النوايا ومسار العلاقة المستقبلي.'
        },
        'شاملة': {
            name: 'قراءة تاروت شاملة',
            desc: 'لأنك تبحث عن الخطوة القادمة ونظرة لمستقبلك، القراءة الشاملة ستعطيك إجابات في الجوانب العاطفية، العملية والمادية.'
        },
        'سؤال': {
            name: 'قراءة لسؤال واحد أو 3 أسئلة',
            desc: 'إذا كان لديك موضوع محدد وتنتظر قراراً بشأنه، فإن قراءة الأسئلة المحددة ستعطيك إجابة مباشرة وواضحة.'
        },
        'شهرية': {
            name: 'قراءة تاروت شهرية',
            desc: 'هذه القراءة ممتازة لتجهيز نفسك للطاقات والفرص التي يحملها الشهر القادم لك في مختلف الجوانب.'
        }
    };

    quizOptions.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const resultKey = e.target.getAttribute('data-result');
            const resultData = quizResultsMap[resultKey];
            
            quizQuestionContainer.classList.add('hidden');
            quizResultContainer.classList.remove('hidden');
            
            quizResultName.textContent = resultData.name;
            quizResultDesc.textContent = resultData.desc;
        });
    });

    if(quizReset) {
        quizReset.addEventListener('click', () => {
            quizResultContainer.classList.add('hidden');
            quizQuestionContainer.classList.remove('hidden');
        });
    }

    /* ==========================================================================
       FAQ Accordion Logic
       ========================================================================== */
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isActive = question.classList.contains('active');
            
            // Close all
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.style.maxHeight = null;
            });
            
            // If it wasn't active, open it
            if (!isActive) {
                question.classList.add('active');
                const answer = question.nextElementSibling;
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
});









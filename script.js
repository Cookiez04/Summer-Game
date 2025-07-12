// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initSyncPopup();
    initFAQ();
    initSmoothScrolling();
    initAudioPlayer();
    initScrollEffects();
    initParticleEffects();
    initBattlePass();
});

// Sync Popup Functionality
function initSyncPopup() {
    const syncBtn = document.getElementById('syncBtn');
    const popup = document.getElementById('syncPopup');
    const closeBtn = popup.querySelector('.close-btn');
    const syncStatus = popup.querySelector('.sync-status');
    const completeBtn = popup.querySelector('.sync-complete-btn');
    
    const statusMessages = [
        'Establishing neural link...',
        'Calibrating edge threshold...',
        'Synchronizing with the Orb...',
        'Loading summer protocols...',
        'Initializing loop state...',
        'Connection established!'
    ];
    
    syncBtn.addEventListener('click', function() {
        popup.classList.add('active');
        startSyncSequence();
    });
    
    closeBtn.addEventListener('click', function() {
        popup.classList.remove('active');
        resetSyncPopup();
    });
    
    // Close popup when clicking outside
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            popup.classList.remove('active');
            resetSyncPopup();
        }
    });
    
    function startSyncSequence() {
        let currentMessage = 0;
        completeBtn.style.display = 'none';
        
        const messageInterval = setInterval(() => {
            if (currentMessage < statusMessages.length) {
                syncStatus.textContent = statusMessages[currentMessage];
                currentMessage++;
            } else {
                clearInterval(messageInterval);
                syncStatus.textContent = 'Sync complete! Welcome to the Loop.';
                completeBtn.style.display = 'inline-flex';
                
                completeBtn.addEventListener('click', function() {
                    popup.classList.remove('active');
                    showEnterLoopMessage();
                });
            }
        }, 500);
    }
    
    function resetSyncPopup() {
        syncStatus.textContent = 'Establishing neural link...';
        completeBtn.style.display = 'none';
    }
    
    function showEnterLoopMessage() {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #00ffff, #ff0080);
            color: #0a0a0a;
            padding: 1rem 2rem;
            border-radius: 8px;
            font-family: 'Orbitron', monospace;
            font-weight: 600;
            z-index: 10001;
            animation: slideInRight 0.5s ease, fadeOut 0.5s ease 2.5s forwards;
        `;
        notification.textContent = 'Loop sync successful! Welcome, Seeker.';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// FAQ Accordion Functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
}

// Smooth Scrolling for Navigation
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Audio Player Functionality
function initAudioPlayer() {
    const playBtn = document.querySelector('.play-btn');
    const tracks = document.querySelectorAll('.track');
    const playerHeader = document.querySelector('.now-playing');
    const progressBar = document.querySelector('.progress');
    const timeDisplay = document.querySelector('.time');
    const audioPlayer = document.getElementById('audioPlayer');
    
    let isPlaying = false;
    let currentTrack = 0;
    
    const trackNames = [
        'Loopstate Lullaby',
        'Edge Engine Warmup'
    ];
    
    // Play/Pause button functionality
    playBtn.addEventListener('click', function() {
        if (isPlaying) {
            audioPlayer.pause();
            this.innerHTML = '<i class="fas fa-play"></i>';
            isPlaying = false;
        } else {
            audioPlayer.play();
            this.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
        }
    });
    
    // Track selection functionality
    tracks.forEach((track, index) => {
        track.addEventListener('click', function() {
            // Remove active class from all tracks
            tracks.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked track
            this.classList.add('active');
            
            // Update player header
            playerHeader.textContent = `Now Playing: ${trackNames[index]}`;
            currentTrack = index;
            
            // Change audio source
            const audioSrc = this.getAttribute('data-src');
            audioPlayer.src = audioSrc;
            
            // Reset progress
            progressBar.style.width = '0%';
            
            // If currently playing, play the new track
            if (isPlaying) {
                audioPlayer.play();
            }
        });
    });
    
    // Audio player event listeners
    audioPlayer.addEventListener('loadedmetadata', function() {
        updateTime();
    });
    
    audioPlayer.addEventListener('timeupdate', function() {
        updateProgress();
        updateTime();
    });
    
    audioPlayer.addEventListener('ended', function() {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        isPlaying = false;
        progressBar.style.width = '0%';
    });
    
    // Update progress bar
    function updateProgress() {
        if (audioPlayer.duration) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.style.width = progress + '%';
        }
    }
    
    // Update time display
    function updateTime() {
        const currentTime = formatTime(audioPlayer.currentTime || 0);
        const duration = formatTime(audioPlayer.duration || 0);
        timeDisplay.textContent = `${currentTime} / ${duration}`;
    }
    
    // Format time to MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    // Click on progress bar to seek
    document.querySelector('.progress-bar').addEventListener('click', function(e) {
        if (audioPlayer.duration) {
            const rect = this.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const clickPercent = clickX / width;
            
            audioPlayer.currentTime = clickPercent * audioPlayer.duration;
        }
    });
}

// Scroll Effects
function initScrollEffects() {
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    });
    
    // Fade in animations for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections for fade-in effect
    const sections = document.querySelectorAll('.game-description, .features, .trailer, .gallery, .soundtrack, .faq');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
}

// Particle Effects for Hero Section
function initParticleEffects() {
    const heroParticles = document.querySelector('.hero-particles');
    
    // Create floating particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: ${Math.random() > 0.5 ? '#00ffff' : '#ff0080'};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.2};
            animation: float ${Math.random() * 3 + 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        heroParticles.appendChild(particle);
    }
}

// Gallery Image Click Effects
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Create a simple fullscreen overlay effect
            const overlay = document.createElement('div');
            const img = this.querySelector('img').cloneNode();
            const caption = this.querySelector('.gallery-overlay').cloneNode(true);
            
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10002;
                animation: fadeIn 0.3s ease;
                cursor: pointer;
            `;
            
            img.style.cssText = `
                width: 90%;
                height: 90%;
                object-fit: cover;
                object-position: center;
                border-radius: 12px;
                box-shadow: 0 0 50px rgba(0, 255, 255, 0.3);
            `;
            
            caption.style.cssText = `
                position: absolute;
                bottom: 50px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                padding: 1rem 2rem;
                border-radius: 8px;
                border: 1px solid #00ffff;
            `;
            
            overlay.appendChild(img);
            overlay.appendChild(caption);
            document.body.appendChild(overlay);
            
            // Close on click
            overlay.addEventListener('click', function() {
                overlay.remove();
            });
            
            // Close on escape key
            const closeOnEscape = function(e) {
                if (e.key === 'Escape') {
                    overlay.remove();
                    document.removeEventListener('keydown', closeOnEscape);
                }
            };
            document.addEventListener('keydown', closeOnEscape);
        });
    });
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Easter Egg: Konami Code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    // Create special effect
    const body = document.body;
    body.style.animation = 'pulse 0.5s ease-in-out 3';
    
    // Show secret message
    const secretMessage = document.createElement('div');
    secretMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #00ffff, #ff0080);
        color: #0a0a0a;
        padding: 2rem;
        border-radius: 12px;
        font-family: 'Orbitron', monospace;
        font-weight: 600;
        text-align: center;
        z-index: 10003;
        box-shadow: 0 0 50px rgba(0, 255, 255, 0.5);
        animation: pulse 1s ease-in-out infinite;
    `;
    secretMessage.innerHTML = `
        <h3>🎮 CHEAT CODE ACTIVATED 🎮</h3>
        <p>You have unlocked the secret Goon Mode!</p>
        <p>Your edge meter is now infinite.</p>
        <button onclick="this.parentElement.remove()" style="
            background: #0a0a0a;
            color: #00ffff;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            margin-top: 1rem;
            cursor: pointer;
        ">Close</button>
    `;
    
    document.body.appendChild(secretMessage);
    
    setTimeout(() => {
        if (secretMessage.parentElement) {
            secretMessage.remove();
        }
    }, 5000);
}

// Typing effect for hero subtitle
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    const text = subtitle.textContent;
    subtitle.textContent = '';
    
    let i = 0;
    const typeInterval = setInterval(() => {
        subtitle.textContent += text.charAt(i);
        i++;
        
        if (i >= text.length) {
            clearInterval(typeInterval);
        }
    }, 100);
}

// Initialize typing effect after a delay
setTimeout(initTypingEffect, 1000); 

// Battle Pass Functionality
function initBattlePass() {
    initXPProgress();
    initCountdown();
    initRewardCards();
    initBattlePassButtons();
}

// XP Progress Animation
function initXPProgress() {
    const xpFill = document.querySelector('.xp-fill');
    if (!xpFill) return;
    
    const progress = xpFill.getAttribute('data-progress');
    
    // Animate progress bar on load
    setTimeout(() => {
        xpFill.style.width = progress + '%';
    }, 500);
    
    // Add pulse effect when near completion
    if (progress >= 90) {
        xpFill.style.animation = 'pulse 1.5s infinite';
    }
}

// Countdown Timer
function initCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;
    
    // Set target time (4 hours, 21 minutes, 37 seconds from now)
    const targetTime = new Date();
    targetTime.setHours(targetTime.getHours() + 4);
    targetTime.setMinutes(targetTime.getMinutes() + 21);
    targetTime.setSeconds(targetTime.getSeconds() + 37);
    
    function updateCountdown() {
        const now = new Date();
        const difference = targetTime - now;
        
        if (difference <= 0) {
            countdownElement.textContent = "00:00:00";
            countdownElement.style.animation = 'countdown-pulse 0.5s infinite';
            return;
        }
        
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        const formatted = 
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');
        
        countdownElement.textContent = formatted;
        
        // Add urgency effect when under 1 hour
        if (difference < 3600000) {
            countdownElement.style.animation = 'countdown-pulse 1s infinite';
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Reward Cards Interaction
function initRewardCards() {
    const rewardCards = document.querySelectorAll('.reward-card');
    const previewItems = document.querySelectorAll('.preview-item');
    
    // Add hover animations to reward cards
    rewardCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(-5px)';
        });
    });
    
    // Add click interactions to preview items
    previewItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const label = item.querySelector('.preview-label').textContent;
            
            // Create preview modal
            showRewardPreview(img.src, label, img.alt);
            
            // Click animation
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
                item.style.transform = '';
            }, 150);
        });
    });
}

// Battle Pass Button Interactions
function initBattlePassButtons() {
    const purchaseBtn = document.querySelector('.battlepass-purchase');
    const learnBtn = document.querySelector('.battlepass-learn');
    
    if (purchaseBtn) {
        purchaseBtn.addEventListener('click', () => {
            showPurchaseDialog();
        });
    }
    
    if (learnBtn) {
        learnBtn.addEventListener('click', () => {
            showLearnMoreDialog();
        });
    }
}

// Helper Functions
function showRewardPreview(imageSrc, title, description) {
    const modal = document.createElement('div');
    modal.className = 'popup-overlay';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="popup">
            <div class="popup-header">
                <h3>🎁 ${title}</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="popup-content" style="text-align: center;">
                <div style="
                    width: 100%;
                    max-width: 400px;
                    aspect-ratio: 16/9;
                    margin: 1rem auto;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 2px solid var(--primary-color);
                    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
                ">
                    <img src="${imageSrc}" alt="${description}" style="
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                        background: rgba(0, 255, 255, 0.05);
                    ">
                </div>
                <h4 style="color: var(--primary-color); margin: 1rem 0;">${title}</h4>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                    Unlock this exclusive reward by purchasing the Blisswave Ascent Battle Pass!
                </p>
                <div style="background: var(--bg-card); padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <p style="font-size: 0.9rem; color: var(--text-muted);">
                        💡 This is a preview. Actual rewards may vary in the final release.
                    </p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close handlers
    modal.querySelector('.close-btn').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

function showPurchaseDialog() {
    const modal = document.createElement('div');
    modal.className = 'popup-overlay';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="popup">
            <div class="popup-header">
                <h3>🌟 Unlock Premium Pass</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="popup-content" style="text-align: center;">
                <div style="font-size: 3rem; margin: 1rem 0;">💳</div>
                <h4>Blisswave Ascent Premium</h4>
                <p style="color: var(--text-secondary); margin: 1rem 0;">
                    Unlock all premium rewards, exclusive skins, and accelerated progression.
                </p>
                <div style="font-size: 2rem; color: var(--accent-color); margin: 1rem 0; font-family: var(--font-primary);">
                    $9.99
                </div>
                <div style="background: var(--bg-card); padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <p style="font-size: 0.9rem; color: var(--text-muted);">
                        ⚠️ This is a demo site. No real purchases can be made.
                    </p>
                </div>
                <button class="btn btn-primary" onclick="this.closest('.popup-overlay').remove();">
                    <i class="fas fa-star"></i>
                    Demo Purchase
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-btn').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

function showLearnMoreDialog() {
    const modal = document.createElement('div');
    modal.className = 'popup-overlay';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="popup">
            <div class="popup-header">
                <h3>📖 Battle Pass Guide</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="popup-content">
                <h4>How It Works</h4>
                <ul style="text-align: left; color: var(--text-secondary); line-height: 1.6;">
                    <li>🎯 Complete daily Blissquests to earn XP</li>
                    <li>📈 Level up to unlock new tiers (1-20)</li>
                    <li>🆓 Free tiers available to all players</li>
                    <li>⭐ Premium tiers require Battle Pass purchase</li>
                    <li>🏆 Exclusive rewards including skins, emotes, and boosters</li>
                    <li>⏰ Season lasts 75 days before reset</li>
                </ul>
                <h4 style="margin-top: 2rem;">Reward Types</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
                    <div style="background: var(--bg-card); padding: 1rem; border-radius: 8px;">
                        <strong>Cosmetics</strong><br>
                        <small style="color: var(--text-muted);">Skins, emotes, trails</small>
                    </div>
                    <div style="background: var(--bg-card); padding: 1rem; border-radius: 8px;">
                        <strong>Boosters</strong><br>
                        <small style="color: var(--text-muted);">XP & sock durability</small>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-btn').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
} 
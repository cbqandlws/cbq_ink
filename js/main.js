// DOM Elements
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mainNav = document.querySelector('.main-nav');
const header = document.querySelector('.main-header');

// Mobile Menu Toggle
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Header Scroll Effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scroll Down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scroll Up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        }
    });
});

// Animate on Scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .case-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('visible');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Form Validation (if contact form exists)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('invalid');
            } else {
                field.classList.remove('invalid');
            }
            
            // Email validation
            if (field.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    isValid = false;
                    field.classList.add('invalid');
                }
            }
        });
        
        if (isValid) {
            // Here you would typically send the form data to your server
            const formData = new FormData(contactForm);
            // Example AJAX request (replace with your actual endpoint)
            fetch('/submit-contact', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showMessage('消息已发送，我们会尽快回复您！', 'success');
                    contactForm.reset();
                } else {
                    showMessage('发送失败，请稍后重试。', 'error');
                }
            })
            .catch(error => {
                showMessage('发送失败，请稍后重试。', 'error');
                console.error('Error:', error);
            });
        }
    });
}

// Helper function to show messages
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    const form = document.querySelector('.contact-form');
    form.insertBefore(messageDiv, form.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Lazy Loading Images
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => lazyImageObserver.observe(img));
    }
});

// 语言切换功能
let currentLang = localStorage.getItem('language') || 'zh-CN';
const i18n = {
    'zh-CN': {
        // Add your Chinese translations here
    },
    'en-US': {
        // Add your English translations here
    }
};

// 初始化语言
function initLanguage() {
    // 设置HTML lang属性
    document.documentElement.lang = currentLang;
    
    // 更新所有需要翻译的元素
    updatePageLanguage();
    
    // 更新语言切换按钮状态
    updateLanguageToggle();
}

// 更新页面语言
function updatePageLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (i18n[currentLang][key]) {
            // 检查是否是输入框的placeholder
            if (element.hasAttribute('placeholder')) {
                element.placeholder = i18n[currentLang][key];
            } else {
                element.textContent = i18n[currentLang][key];
            }
        }
    });
}

// 更新语言切换按钮状态
function updateLanguageToggle() {
    const toggle = document.querySelector('.language-toggle');
    if (toggle) {
        toggle.textContent = currentLang === 'zh-CN' ? 'EN' : '中';
    }
}

// 切换语言
function toggleLanguage() {
    currentLang = currentLang === 'zh-CN' ? 'en-US' : 'zh-CN';
    localStorage.setItem('language', currentLang);
    initLanguage();
}

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化语言
    initLanguage();
    
    // 语言切换按钮事件监听
    const languageToggle = document.querySelector('.language-toggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', toggleLanguage);
    }
});

// 返回顶部按钮
const backToTopButton = document.createElement('button');
backToTopButton.className = 'back-to-top';
backToTopButton.innerHTML = '↑';
document.body.appendChild(backToTopButton);

// 控制返回顶部按钮的显示和隐藏
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 图片预览功能
const images = document.querySelectorAll('.content img:not(.no-preview)');
images.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
        const overlay = document.createElement('div');
        overlay.className = 'image-preview-overlay';
        
        const previewImage = document.createElement('img');
        previewImage.src = img.src;
        previewImage.className = 'preview-image';
        
        overlay.appendChild(previewImage);
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', () => {
            overlay.remove();
        });
    });
});

// 页面加载动画优化
document.addEventListener('DOMContentLoaded', () => {
    const pageLoader = document.createElement('div');
    pageLoader.className = 'page-loader';
    pageLoader.innerHTML = '<div class="loader-spinner"></div>';
    document.body.appendChild(pageLoader);
    
    // 确保所有内容加载完成后再隐藏加载动画
    window.addEventListener('load', () => {
        pageLoader.style.opacity = '0';
        setTimeout(() => {
            pageLoader.remove();
        }, 500);
        
        // 添加内容显示动画
        document.body.classList.add('content-loaded');
    });
});

// 优化滚动动画
const scrollAnimations = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;
        
        if(elementPosition < screenPosition * 0.85) {
            element.classList.add('animated');
        }
    });
}

window.addEventListener('scroll', scrollAnimations);
window.addEventListener('load', scrollAnimations);

// 页面过渡动画
document.addEventListener('DOMContentLoaded', () => {
    const transitionElements = document.querySelectorAll('.page-transition');
    transitionElements.forEach(el => {
        setTimeout(() => el.classList.add('visible'), 100);
    });
});

// 滚动进度条
(() => {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
})();

// 图片懒加载
const lazyImages = document.querySelectorAll('.img-lazy');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.onload = () => img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// 按钮波纹效果
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', e => {
        const rect = button.getBoundingClientRect();
        const ripple = button.querySelector('.ripple');
        
        if (ripple) {
            ripple.remove();
        }
        
        const circle = document.createElement('span');
        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;
        circle.classList.add('ripple');
        
        button.appendChild(circle);
    });
});

// 错误消息显示
function showError(message, duration = 3000) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    requestAnimationFrame(() => {
        errorDiv.classList.add('show');
        setTimeout(() => {
            errorDiv.classList.remove('show');
            setTimeout(() => errorDiv.remove(), 300);
        }, duration);
    });
}

// 成功消息显示
function showSuccess(message, duration = 3000) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    requestAnimationFrame(() => {
        successDiv.classList.add('show');
        setTimeout(() => {
            successDiv.classList.remove('show');
            setTimeout(() => successDiv.remove(), 300);
        }, duration);
    });
}

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

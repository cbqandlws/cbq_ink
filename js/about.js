// 统计数字动画
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 2000; // 动画持续2秒
        const step = target / (duration / 16); // 假设60fps
        let current = 0;
        
        const updateNumber = () => {
            current = Math.min(current + step, target);
            stat.textContent = Math.round(current);
            
            if (current < target) {
                requestAnimationFrame(updateNumber);
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateNumber();
                observer.disconnect();
            }
        });
        
        observer.observe(stat);
    });
}

// 团队成员卡片交互
function initTeamCards() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', () => {
            member.querySelector('.social-links')?.classList.add('visible');
        });
        
        member.addEventListener('mouseleave', () => {
            member.querySelector('.social-links')?.classList.remove('visible');
        });
    });
}

// 时间线动画
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.5
    });
    
    timelineItems.forEach(item => observer.observe(item));
}

// 视差滚动效果
function initParallax() {
    const parallaxSections = document.querySelectorAll('.parallax-section');
    
    window.addEventListener('scroll', () => {
        parallaxSections.forEach(section => {
            const distance = window.pageYOffset;
            const speed = section.dataset.speed || 0.5;
            section.style.transform = `translateY(${distance * speed}px)`;
        });
    });
}

// 联系方式悬浮效果
function initContactItems() {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.classList.add('hover');
            const icon = item.querySelector('.icon');
            icon.style.transform = 'scale(1.2) rotate(5deg)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.classList.remove('hover');
            const icon = item.querySelector('.icon');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// 页面过渡动画
function initPageTransitions() {
    const sections = document.querySelectorAll('.page-transition');
    sections.forEach(section => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1
        });
        
        observer.observe(section);
    });
}

// 初始化所有页面功能
function initAboutPage() {
    animateStats();
    initTeamCards();
    initTimeline();
    initParallax();
    initContactItems();
    initPageTransitions();
}

// 页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', initAboutPage);

// 在线客服功能
class CustomerService {
    constructor() {
        this.button = document.querySelector('.cs-button');
        this.panel = document.querySelector('.cs-panel');
        this.closeBtn = document.querySelector('.cs-close');
        this.init();
    }

    init() {
        // 点击客服按钮
        this.button.addEventListener('click', () => this.togglePanel());
        
        // 点击关闭按钮
        this.closeBtn.addEventListener('click', () => this.hidePanel());
        
        // 点击面板外部关闭
        document.addEventListener('click', (e) => {
            if (!this.panel.contains(e.target) && !this.button.contains(e.target)) {
                this.hidePanel();
            }
        });

        // 处理工作时间
        this.updateWorkingStatus();
        setInterval(() => this.updateWorkingStatus(), 60000); // 每分钟更新一次
    }

    togglePanel() {
        this.panel.classList.toggle('active');
    }

    hidePanel() {
        this.panel.classList.remove('active');
    }

    updateWorkingStatus() {
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay();
        
        // 工作时间：周一至周五 9:00-18:00
        const isWorkingHours = hour >= 9 && hour < 18;
        const isWorkingDay = day >= 1 && day <= 5;
        
        const statusElement = document.querySelector('.cs-status');
        if (statusElement) {
            if (isWorkingDay && isWorkingHours) {
                statusElement.textContent = '在线';
                statusElement.classList.add('online');
                statusElement.classList.remove('offline');
            } else {
                statusElement.textContent = '离线';
                statusElement.classList.add('offline');
                statusElement.classList.remove('online');
            }
        }
    }
}

// 社交媒体分享功能
class SocialShare {
    constructor() {
        this.initShareButtons();
    }

    initShareButtons() {
        const shareButtons = document.querySelectorAll('.social-share');
        shareButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const type = button.dataset.type;
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent(document.title);
                
                let shareUrl = '';
                switch(type) {
                    case 'weibo':
                        shareUrl = `http://service.weibo.com/share/share.php?url=${url}&title=${title}`;
                        break;
                    case 'qq':
                        shareUrl = `http://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${title}`;
                        break;
                    case 'wechat':
                        // 微信分享需要调用微信JS-SDK，这里只显示二维码
                        return;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=500');
                }
            });
        });
    }
}

// 表单验证功能增强
class ContactForm {
    constructor() {
        this.form = document.querySelector('#contact-form');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.setupRealTimeValidation();
    }

    setupRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.validateField(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch(field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                errorMessage = '请输入有效的电子邮件地址';
                break;
            case 'tel':
                const phoneRegex = /^1[3-9]\d{9}$/;
                isValid = phoneRegex.test(value);
                errorMessage = '请输入有效的手机号码';
                break;
            default:
                isValid = value.length > 0;
                errorMessage = '此字段不能为空';
        }

        this.showFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    showFieldValidation(field, isValid, errorMessage) {
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = isValid ? '' : errorMessage;
        }
        
        field.classList.toggle('invalid', !isValid);
        field.classList.toggle('valid', isValid);
    }

    async handleSubmit(e) {
        e.preventDefault();

        // 验证所有字段
        const inputs = this.form.querySelectorAll('input, textarea');
        let isValid = true;
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) return;

        // 验证reCAPTCHA
        if (typeof grecaptcha !== 'undefined') {
            const recaptchaResponse = grecaptcha.getResponse();
            if (!recaptchaResponse) {
                alert('请完成人机验证');
                return;
            }
        }

        try {
            const formData = new FormData(this.form);
            const response = await fetch('/api/contact', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('消息发送成功！我们会尽快回复您。');
                this.form.reset();
                if (typeof grecaptcha !== 'undefined') {
                    grecaptcha.reset();
                }
            } else {
                throw new Error('提交失败');
            }
        } catch (error) {
            alert('抱歉，提交失败。请稍后重试或通过其他方式联系我们。');
            console.error('Form submission error:', error);
        }
    }
}

// FAQ手风琴效果
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        header.addEventListener('click', () => {
            const currentlyActive = document.querySelector('.faq-item.active');
            if (currentlyActive && currentlyActive !== item) {
                currentlyActive.classList.remove('active');
            }
            item.classList.toggle('active');
        });
    });
}

// 在线客服聊天功能
class ChatWidget {
    constructor() {
        this.widget = document.getElementById('chatWidget');
        this.messagesContainer = this.widget.querySelector('.chat-messages');
        this.input = this.widget.querySelector('input');
        this.sendButton = this.widget.querySelector('.send-message');
        this.closeButton = this.widget.querySelector('.close-chat');
        
        this.initEventListeners();
        this.botResponses = {
            greeting: '您好！很高兴为您服务。请问有什么可以帮助您的？',
            default: '感谢您的咨询。我们的客服人员会尽快回复您的问题。',
            keywords: {
                '价格': '我们提供多种套餐选择，具体价格请联系销售团队。',
                '时间': '我们提供7x24小时服务支持。',
                '联系': '您可以通过电话、邮件或在线聊天与我们联系。',
                '问题': '请详细描述您遇到的问题，我们会尽快为您解决。'
            }
        };
    }
    
    initEventListeners() {
        document.getElementById('startChat').addEventListener('click', () => this.open());
        this.closeButton.addEventListener('click', () => this.close());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }
    
    open() {
        this.widget.classList.add('active');
        if (this.messagesContainer.children.length === 0) {
            this.addMessage(this.botResponses.greeting, 'bot');
        }
        this.input.focus();
    }
    
    close() {
        this.widget.classList.remove('active');
    }
    
    sendMessage() {
        const message = this.input.value.trim();
        if (message) {
            this.addMessage(message, 'user');
            this.input.value = '';
            this.generateBotResponse(message);
        }
    }
    
    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        messageDiv.textContent = text;
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    generateBotResponse(userMessage) {
        setTimeout(() => {
            let response = this.botResponses.default;
            
            // 检查关键词匹配
            for (let keyword in this.botResponses.keywords) {
                if (userMessage.toLowerCase().includes(keyword)) {
                    response = this.botResponses.keywords[keyword];
                    break;
                }
            }
            
            this.addMessage(response, 'bot');
        }, 1000);
    }
}

// 满意度调查表单处理
function initSurveyForm() {
    const form = document.getElementById('surveyForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const satisfaction = form.querySelector('input[name="satisfaction"]:checked');
            const feedback = form.querySelector('#feedback').value;
            
            if (!satisfaction) {
                showError('请选择满意度评分');
                return;
            }
            
            // 这里可以添加表单提交逻辑
            console.log({
                satisfaction: satisfaction.value,
                feedback: feedback
            });
            
            showSuccess('感谢您的反馈！');
            form.reset();
        });
    }
}

// 服务流程动画
function initProcessAnimation() {
    const processItems = document.querySelectorAll('.process-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // 添加数字计数动画
                const number = entry.target.querySelector('.process-number');
                if (number) {
                    number.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        number.style.transform = 'scale(1)';
                    }, 300);
                }
            }
        });
    }, {
        threshold: 0.5
    });
    
    processItems.forEach(item => observer.observe(item));
}

// 页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    new CustomerService();
    new SocialShare();
    new ContactForm();
    initFAQ();
    const chatWidget = new ChatWidget();
    initSurveyForm();
    initProcessAnimation();
    
    // 添加页面过渡动画
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
});

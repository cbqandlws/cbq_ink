// 表单验证和提交
class ContactForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.formData = {};
        this.setupValidation();
        this.setupAutoSave();
        this.setupFileUpload();
        this.loadSavedData();
        
        // 防抖
        this.debounceTimeout = null;
    }

    setupValidation() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.submitFormWithDebounce();
            }
        });

        // 实时验证
        this.form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                this.debouncedValidateField(input);
            });
            
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }

    setupAutoSave() {
        // 自动保存表单数据
        this.form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                this.saveFormData();
            });
        });
    }

    setupFileUpload() {
        const fileInput = this.form.querySelector('input[type="file"]');
        if (fileInput) {
            const previewContainer = document.createElement('div');
            previewContainer.className = 'file-preview';
            fileInput.parentNode.insertBefore(previewContainer, fileInput.nextSibling);

            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e, previewContainer);
            });
        }
    }

    handleFileUpload(e, previewContainer) {
        const files = e.target.files;
        previewContainer.innerHTML = '';

        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const preview = document.createElement('div');
                    preview.className = 'file-preview-item';
                    preview.innerHTML = `
                        <img src="${e.target.result}" alt="${file.name}">
                        <span>${file.name}</span>
                        <button type="button" class="remove-file">&times;</button>
                    `;
                    previewContainer.appendChild(preview);

                    preview.querySelector('.remove-file').addEventListener('click', () => {
                        preview.remove();
                        // 清除文件输入
                        e.target.value = '';
                    });
                };
                reader.readAsDataURL(file);
            } else {
                const preview = document.createElement('div');
                preview.className = 'file-preview-item document';
                preview.innerHTML = `
                    <span>${file.name}</span>
                    <button type="button" class="remove-file">&times;</button>
                `;
                previewContainer.appendChild(preview);
            }
        });
    }

    debouncedValidateField(field) {
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
            this.validateField(field);
        }, 300);
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                errorMessage = this.getLocalizedError('email');
                break;
            case 'tel':
                if (value) {
                    const phoneRegex = /^1[3-9]\d{9}$/;
                    isValid = phoneRegex.test(value);
                    errorMessage = this.getLocalizedError('phone');
                }
                break;
            case 'file':
                const files = field.files;
                if (files.length > 0) {
                    const maxSize = 5 * 1024 * 1024; // 5MB
                    isValid = Array.from(files).every(file => file.size <= maxSize);
                    errorMessage = this.getLocalizedError('file');
                }
                break;
            default:
                isValid = value.length > 0;
                errorMessage = this.getLocalizedError('required');
        }

        this.showFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    getLocalizedError(type) {
        const currentLang = localStorage.getItem('language') || 'zh-CN';
        const errors = {
            'zh-CN': {
                email: '请输入有效的邮箱地址',
                phone: '请输入有效的手机号码',
                required: '此字段不能为空',
                file: '文件大小不能超过5MB'
            },
            'en-US': {
                email: 'Please enter a valid email address',
                phone: 'Please enter a valid phone number',
                required: 'This field is required',
                file: 'File size cannot exceed 5MB'
            }
        };
        return errors[currentLang][type];
    }

    showFieldValidation(field, isValid, errorMessage) {
        const container = field.parentElement;
        const errorDiv = container.querySelector('.error-message') || document.createElement('div');
        errorDiv.className = 'error-message';
        
        if (!isValid && errorMessage) {
            errorDiv.textContent = errorMessage;
            container.appendChild(errorDiv);
            field.classList.add('invalid');
            field.classList.remove('valid');
        } else {
            errorDiv.remove();
            field.classList.remove('invalid');
            field.classList.add('valid');
        }
    }

    validateForm() {
        let isValid = true;
        this.form.querySelectorAll('input, textarea').forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        return isValid;
    }

    submitFormWithDebounce() {
        if (this.isSubmitting) return;
        
        this.isSubmitting = true;
        this.submitButton.disabled = true;
        this.submitButton.classList.add('loading');
        
        // 模拟提交
        setTimeout(() => {
            this.submitForm();
        }, 1000);
    }

    async submitForm() {
        try {
            const formData = new FormData(this.form);
            // 这里添加实际的表单提交逻辑
            // const response = await fetch('/api/contact', {
            //     method: 'POST',
            //     body: formData
            // });
            
            // 模拟成功响应
            this.showSuccess();
            this.clearForm();
            this.clearSavedData();
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.isSubmitting = false;
            this.submitButton.disabled = false;
            this.submitButton.classList.remove('loading');
        }
    }

    showSuccess() {
        const message = localStorage.getItem('language') === 'en-US' 
            ? 'Form submitted successfully!'
            : '表单提交成功！';
        this.showMessage(message, 'success');
    }

    showError(error) {
        const message = localStorage.getItem('language') === 'en-US'
            ? 'An error occurred. Please try again.'
            : '发生错误，请重试。';
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        
        this.form.insertBefore(messageDiv, this.form.firstChild);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    saveFormData() {
        const formData = {};
        this.form.querySelectorAll('input, textarea').forEach(field => {
            if (field.type !== 'file' && field.type !== 'password') {
                formData[field.name] = field.value;
            }
        });
        localStorage.setItem('contactFormData', JSON.stringify(formData));
    }

    loadSavedData() {
        const savedData = localStorage.getItem('contactFormData');
        if (savedData) {
            const formData = JSON.parse(savedData);
            Object.entries(formData).forEach(([name, value]) => {
                const field = this.form.querySelector(`[name="${name}"]`);
                if (field) {
                    field.value = value;
                }
            });
        }
    }

    clearForm() {
        this.form.reset();
        const previewContainer = this.form.querySelector('.file-preview');
        if (previewContainer) {
            previewContainer.innerHTML = '';
        }
    }

    clearSavedData() {
        localStorage.removeItem('contactFormData');
    }
}

// 百度地图初始化和配置
class BaiduMap {
    constructor(containerId) {
        this.containerId = containerId;
        this.loadBaiduMapScript();
    }

    loadBaiduMapScript() {
        // 替换为您的百度地图API密钥
        const API_KEY = 'YOUR_BAIDU_MAP_KEY';
        const script = document.createElement('script');
        script.src = `https://api.map.baidu.com/api?v=3.0&ak=${API_KEY}&callback=initMap`;
        document.body.appendChild(script);

        // 定义全局回调函数
        window.initMap = () => this.initializeMap();
    }

    initializeMap() {
        // 替换为您的实际地址坐标
        const lat = 39.915;
        const lng = 116.404;
        
        const map = new BMap.Map(this.containerId);
        const point = new BMap.Point(lng, lat);
        map.centerAndZoom(point, 15);
        map.enableScrollWheelZoom();
        
        // 添加控件
        map.addControl(new BMap.NavigationControl());
        map.addControl(new BMap.ScaleControl());
        
        // 添加标记
        const marker = new BMap.Marker(point);
        map.addOverlay(marker);
        
        // 添加信息窗口
        const infoWindow = new BMap.InfoWindow(`
            <div class="map-info">
                <h3>公司名称</h3>
                <p>详细地址信息</p>
                <p>联系电话：xxx-xxxx-xxxx</p>
            </div>
        `);
        
        marker.addEventListener('click', () => {
            map.openInfoWindow(infoWindow, point);
        });
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm('contactForm');
    new BaiduMap('map');
});

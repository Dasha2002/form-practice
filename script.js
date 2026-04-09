document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('form-success');
    const errorMessage = document.getElementById('form-error');

    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorDiv = formGroup.querySelector('.error-message');
        errorDiv.textContent = message;
        input.classList.add('input-error');
    }

    function clearError(input) {
        const formGroup = input.parentElement;
        const errorDiv = formGroup.querySelector('.error-message');
        errorDiv.textContent = '';
        input.classList.remove('input-error');
    }
    
    function validateField(input) {
        clearError(input); 

        if (input.hasAttribute('required') && !input.value.trim()) {
            showError(input, 'Это поле обязательно для заполнения.');
            return false;
        }

        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                showError(input, 'Пожалуйста, введите корректный email.');
                return false;
            }
        }
        
        if (input.id === 'phone' && input.value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(input.value)) {
                showError(input, 'Пожалуйста, введите корректный номер телефона.');
                return false;
            }
        }

        return true; 
    }

    async function handleSubmit(event) {
        event.preventDefault(); 

        // Валидация всех полей
        const isNameValid = validateField(nameInput);
        const isEmailValid = validateField(emailInput);
        const isPhoneValid = validateField(phoneInput);  
        const isMessageValid = validateField(messageInput); 

        // Прерыв отправки, если хоть одно поле невалидно
        if (!isNameValid || !isEmailValid || !isPhoneValid || !isMessageValid) {
            console.log('Форма содержит ошибки.');
            return;
        }

        // Состояние загругки
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        // Имитация отправки на сервер
        console.log('Отправка данных на сервер...');
        
        try {
            // Имитация сетевого запроса с задержкой в 2 секунды
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Имитация случайной ошибки сервера 
            if (Math.random() < 0.1) { //(10% шанс)
                throw new Error('Серверная ошибка');
            }

            // Обработка успешного ответа
            console.log('Успешно отправлено!');
            form.reset(); 
            successMessage.style.display = 'block'; 

        } catch (error) {
            // Обработка ошибки
            console.error('Ошибка отправки:', error);
            errorMessage.style.display = 'block'; 
        } finally {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    }

    form.addEventListener('submit', handleSubmit);

    [nameInput, emailInput, phoneInput, messageInput].forEach(input => {
        input.addEventListener('blur', () => validateField(input));
    });
});
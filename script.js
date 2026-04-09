document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('form-success');
    const errorMessage = document.getElementById('form-error');


phoneInput.addEventListener("input", function (e) {
    let initialValue = this.value;
    let initialCursorPos = this.selectionStart;
    let digits = this.value.replace(/\D/g, "");

    if (digits.startsWith("7") || digits.startsWith("8")) {
        digits = digits.slice(1);
    }

    let formattedValue = "+7";
    if (digits.length > 0) {
        formattedValue += " (" + digits.substring(0, 3);
    }
    if (digits.length >= 4) {
        formattedValue += ") " + digits.substring(3, 6);
    }
    if (digits.length >= 7) {
        formattedValue += "-" + digits.substring(6, 8);
    }
    if (digits.length >= 9) {
        formattedValue += "-" + digits.substring(8, 10);
    }

    this.value = formattedValue;

    let newCursorPos = initialCursorPos;
    if (formattedValue.length > initialValue.length && initialCursorPos > 2) {
        newCursorPos += formattedValue.length - initialValue.length;
    }
    this.setSelectionRange(newCursorPos, newCursorPos);
});

phoneInput.addEventListener("keydown", function (e) {
    const cursorPos = this.selectionStart;

    if (e.key === "Backspace" && cursorPos <= 2) {
        e.preventDefault();
    }
    if (e.key === "Delete" && cursorPos < 2) {
        e.preventDefault();
    }
});

phoneInput.addEventListener("focus", function () {
    if (this.value === "") {
        this.value = "+7";
        this.setSelectionRange(2, 2);
    }
});

phoneInput.addEventListener("blur", function () {
    if (this.value === "+7") {
        this.value = "";
    }
});


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
            const digitsOnly = input.value.replace(/\D/g, '');
            if (digitsOnly.length !== 11) {
                showError(input, 'Пожалуйста, введите корректный номер телефона из 11 цифр.');
                return false;
            }
        }

        return true; 
    }

    async function handleSubmit(event) {
    event.preventDefault();

    const isNameValid = validateField(nameInput);
    const isEmailValid = validateField(emailInput);
    const isPhoneValid = validateField(phoneInput);
    const isMessageValid = validateField(messageInput);

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isMessageValid) {
        return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    const formData = new FormData(form);

    try {
        const response = await fetch("submit.php", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Server error");
        }

        const result = await response.json();

        if (result.success) {
            form.reset();
            successMessage.style.display = "block";
            errorMessage.style.display = "none";
        } else {
            throw new Error("PHP returned false");
        }

    } catch (error) {
        console.error(error);
        errorMessage.style.display = "block";
        successMessage.style.display = "none";
    }

    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
}

    form.addEventListener('submit', handleSubmit);

    [nameInput, emailInput, phoneInput, messageInput].forEach(input => {
        input.addEventListener('blur', () => validateField(input));
    });
});
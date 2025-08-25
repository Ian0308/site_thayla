document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Scrolling ---
    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            // Ignore auth link for scrolling
            if (targetId === '#') return;
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- Modal Logic ---
    const modal = document.getElementById('paymentModal');
    const closeButton = document.querySelector('.close-button');
    const comprarButtons = document.querySelectorAll('.btn-comprar');
    const paymentForm = document.getElementById('payment-form');
    const userInfoFields = document.getElementById('user-info-fields');
    const modalProductInfo = document.getElementById('modal-product-info');
    const successMessage = document.getElementById('success-message');
    const modalFormView = document.getElementById('modal-view-form');

    // --- Auth Simulation ---
    const authLink = document.getElementById('auth-link');
    let isLoggedIn = false;

    authLink.addEventListener('click', (e) => {
        e.preventDefault();
        isLoggedIn = !isLoggedIn;
        updateAuthLink();
        alert(isLoggedIn ? 'Você fez login com sucesso!' : 'Você saiu da sua conta.');
    });

    const updateAuthLink = () => {
        authLink.textContent = isLoggedIn ? 'Logout' : 'Login';
    };

    // Function to open the modal
    const openModal = (productName, productPrice) => {
        modalProductInfo.textContent = `Produto: ${productName} - Preço: R$${productPrice}`;
        
        // Reset modal to its initial state
        successMessage.style.display = 'none';
        modalFormView.style.display = 'block';
        paymentForm.reset();
        clearErrors();

        if (isLoggedIn) {
            userInfoFields.style.display = 'none';
        } else {
            userInfoFields.style.display = 'block';
        }
        modal.style.display = 'block';
    };

    // Function to close the modal
    const closeModal = () => {
        modal.style.display = 'none';
    };

    // Event Listeners for "Comprar" buttons
    comprarButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.dataset.product;
            const productPrice = button.dataset.price;
            openModal(productName, productPrice);
        });
    });

    // Event Listener for the close button
    closeButton.addEventListener('click', closeModal);

    // Close modal if user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // --- Form Validation ---
    const showError = (fieldId, message) => {
        const field = document.getElementById(fieldId);
        const errorField = document.getElementById(`${fieldId}-error`);
        field.classList.add('invalid');
        errorField.textContent = message;
    };

    const clearErrors = () => {
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('#payment-form input').forEach(el => el.classList.remove('invalid'));
    };

    const validateForm = () => {
        clearErrors();
        let isValid = true;

        // Card Number Validation
        const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
        if (!/^\d{16}$/.test(cardNumber)) {
            showError('card-number', 'Número do cartão inválido (deve ter 16 dígitos).');
            isValid = false;
        }

        // Card Name Validation
        if (document.getElementById('card-name').value.trim().length < 3) {
            showError('card-name', 'Nome no cartão é obrigatório.');
            isValid = false;
        }

        // Expiry Date Validation
        const expiry = document.getElementById('card-expiry').value;
        const [month, year] = expiry.split('/').map(num => parseInt(num, 10));
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;
        if (!/^\d{2}\/\d{2}$/.test(expiry) || month < 1 || month > 12 || year < currentYear || (year === currentYear && month < currentMonth)) {
            showError('card-expiry', 'Data de validade inválida ou expirada.');
            isValid = false;
        }

        // CVC Validation
        if (!/^\d{3,4}$/.test(document.getElementById('card-cvc').value)) {
            showError('card-cvc', 'CVC inválido (3 ou 4 dígitos).');
            isValid = false;
        }

        return isValid;
    };

    // Handle form submission
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const payButton = document.querySelector('.btn-pagar');
        payButton.textContent = 'Processando...';
        payButton.disabled = true;
        payButton.classList.add('loading');

        // Simulate payment processing
        setTimeout(() => {
            modalFormView.style.display = 'none';
            successMessage.style.display = 'block';

            // Simulate login if a new user just paid
            if (!isLoggedIn) {
                isLoggedIn = true;
                updateAuthLink();
            }

            // Reset button and close modal after a delay
            setTimeout(() => {
                closeModal();
                payButton.textContent = 'Pagar Agora';
                payButton.disabled = false;
                payButton.classList.remove('loading');
            }, 3000);

        }, 2000);
    });

});
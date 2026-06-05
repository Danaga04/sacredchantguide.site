document.addEventListener('DOMContentLoaded', function() {
    // Card images
    const cardImages = [
    'https://i.postimg.cc/pXGsBJSd/images.jpg',
    'https://i.postimg.cc/kX4cDtgY/51-7BOVBl-RL-AC-UF1000-1000-QL80.jpg',
    'https://i.postimg.cc/rpSG71fW/513v-j2EBt-L-AC-UF1000-1000-QL80.jpg'
];
    
    // Shuffle the card images
    const shuffledImages = [...cardImages].sort(() => Math.random() - 0.5);
    
    // Check if cards were already selected
    function checkCardsSelected() {
        return localStorage.getItem('cardsSelected') === 'true';
    }

    function setCardsSelectedFlag() {
        localStorage.setItem('cardsSelected', 'true');
    }

    function getAllUrlParams() {
        return window.location.search;
    }
    
    // Game state variables
    let selectedCards = 0;
    const maxSelections = 3;
    let selectedCardElements = [];
    
    // Determine number of cards (9 on mobile, 7 on desktop)
    const isMobile = window.innerWidth <= 768;
    const numCards = isMobile ? 9 : 7;
    
    // Get DOM elements
    const cardsContainer = document.getElementById('cardsContainer');
    const ctaButton = document.getElementById('ctaButton');
    const readingMessage = document.getElementById('readingMessage');
    
    // Check if elements exist to prevent errors
    if (!cardsContainer || !ctaButton || !readingMessage) {
        console.error('Required DOM elements not found');
        return;
    }

    // Check if cards were already selected
    if (checkCardsSelected()) {
        showFinalState();
        return;
    }

    // Initialize the game
    createCards();
    updateProgressBar();
    updateSelectionCounter();

    // Function to show final state
    function showFinalState() {
        document.querySelector('.instruction-text').innerHTML = 'Connection established - receive your message!';
        
        // Set progress to complete state
        selectedCards = 3;
        updateProgressBar();
        
        const finalCardsContainer = document.createElement('div');
        finalCardsContainer.className = 'final-cards-container';
        
        for (let i = 0; i < 3; i++) {
            const card = createFinalCard(i);
            finalCardsContainer.appendChild(card);
        }
        
        cardsContainer.innerHTML = '';
        cardsContainer.appendChild(finalCardsContainer);
        
        readingMessage.classList.remove('hidden');
        readingMessage.classList.add('visible');
        
        ctaButton.classList.remove('hidden');
        ctaButton.classList.add('flex', 'justify-center');
    }

    // Function to create final card
    function createFinalCard(index) {
        const card = document.createElement('div');
        card.className = 'card flipped selected selected-final';
        if (index === 1) card.classList.add('middle-card');
        
        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';
        
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        
        const frontImg = document.createElement('img');
        frontImg.src = cardImages[index];
        frontImg.alt = 'Carta do Tarô';
        cardFront.appendChild(frontImg);
        
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        
        const backImg = document.createElement('img');
        backImg.src = 'https://i.postimg.cc/dVWcrC2k/card-back.png';
        backImg.alt = 'Verso da Carta';
        cardBack.appendChild(backImg);
        
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        
        return card;
    }
    
    // Function to update progress bar
    function updateProgressBar() {
        const progressSegments = [
            document.getElementById('segment1'),
            document.getElementById('segment2'),
            document.getElementById('segment3')
        ];
        
        // Update progress bar based on selected cards
        for (let i = 0; i < selectedCards && i < progressSegments.length; i++) {
            if (progressSegments[i]) {
                progressSegments[i].classList.add('active');
            }
        }
        
        // Update aria-valuenow for accessibility
        const progressContainer = document.querySelector('.progress-container');
        if (progressContainer) {
            progressContainer.setAttribute('aria-valuenow', selectedCards);
        }
    }
    
    // Function to create cards
    function createCards() {
        for (let i = 0; i < numCards; i++) {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = i;
            card.setAttribute('tabindex', '0');
            
            const cardInner = document.createElement('div');
            cardInner.className = 'card-inner';
            
            const cardFront = document.createElement('div');
            cardFront.className = 'card-front';
            
            const cardBack = document.createElement('div');
            cardBack.className = 'card-back';
            
            const backImg = document.createElement('img');
            backImg.src = '../../global_images/cards/card_back.png';
            backImg.alt = 'Verso da Carta';
            cardBack.appendChild(backImg);
            
            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            card.appendChild(cardInner);
            
            card.addEventListener('click', handleCardClick);
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick.call(this);
                }
            });
            
            cardsContainer.appendChild(card);
        }
    }
    
    // Function to handle card click
    function handleCardClick() {
        if (selectedCards < maxSelections && !this.classList.contains('flipped')) {
            const imageIndex = selectedCards % shuffledImages.length;
            const frontImg = document.createElement('img');
            frontImg.src = shuffledImages[imageIndex];
            frontImg.alt = 'Carta do Tarô';
            
            const frontDiv = this.querySelector('.card-front');
            frontDiv.innerHTML = '';
            frontDiv.appendChild(frontImg);
            
            this.classList.add('flipped', 'selected');
            selectedCards++;
            selectedCardElements.push(this);
            
            updateProgressBar();
            updateSelectionCounter();
            
            if (selectedCards === maxSelections) {
                setCardsSelectedFlag();
                setTimeout(() => {
                    showFinalCards();
                }, 500);
            }
        }
    }

    // Function to show final cards arrangement
    function showFinalCards() {
        const nonSelectedCards = document.querySelectorAll('.card:not(.selected)');
        
        nonSelectedCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
        });
        
        setTimeout(() => {
            nonSelectedCards.forEach(card => card.remove());
            
            const finalCardsContainer = document.createElement('div');
            finalCardsContainer.className = 'final-cards-container';
            
            selectedCardElements.forEach((card, index) => {
                const clone = card.cloneNode(true);
                clone.classList.add('selected-final');
                if (index === 1) clone.classList.add('middle-card');
                finalCardsContainer.appendChild(clone);
            });
            
            cardsContainer.innerHTML = '';
            cardsContainer.appendChild(finalCardsContainer);
            
            setTimeout(() => {
                if (readingMessage) {
                    readingMessage.classList.remove('hidden');
                    readingMessage.classList.add('visible');
                }
                
                setTimeout(() => {
                    if (ctaButton) {
                        ctaButton.classList.remove('hidden');
                        ctaButton.classList.add('flex', 'justify-center');
                    }
                }, 800);
            }, 300);
        }, 500);
    }
    
    // Function to update selection counter
    function updateSelectionCounter() {
        const remainingSelections = maxSelections - selectedCards;
        const counterText = document.querySelector('.instruction-text');
        
        if (remainingSelections > 0) {
            counterText.innerHTML = `✨ Still need ${remainingSelections} card${remainingSelections > 1 ? 's' : ''} for the complete message ✨`;
        } else {
            counterText.innerHTML = 'Connection established - receive your message!';
        }
    }

    // Modify CTA button to include URL parameters
    if (ctaButton) {
        const ctaLink = ctaButton.querySelector('a');
        if (ctaLink) {
            ctaLink.addEventListener('click', function(e) {
                e.preventDefault();
                const baseUrl = this.href;
                const urlParams = getAllUrlParams();
                const finalUrl = baseUrl + urlParams;
                
                // Check if we're inside an iframe
                if (window.parent !== window) {
                    // We're in iframe, redirect parent window
                    window.parent.location.href = finalUrl;
                } else {
                    // Normal navigation
                    window.location.href = finalUrl;
                }
            });
        }
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        const wasMobile = numCards === 9;
        const isMobileNow = window.innerWidth <= 768;
        
        if (wasMobile !== isMobileNow && selectedCards === 0) {
            location.reload();
        }
    });
});

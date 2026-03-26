document.addEventListener('DOMContentLoaded', () => {
    const deck = document.getElementById('deck');
    const cards = document.querySelectorAll('.card');
    let isDrawn = false;

    // Handle deck click to deal cards
    deck.addEventListener('click', () => {
        if (isDrawn) return;
        isDrawn = true;

        // Fade out screen elements logically
        document.body.classList.add('game-active');
        deck.classList.add('hidden');

        // We want the cards to go to the center of the screen
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Initial center of the deck/cards (defined as bottom:50, right:50 in CSS)
        // With a card width of 220 and height of 320:
        const cardWidth = 220;
        const cardHeight = 320;
        const startX = window.innerWidth - 50 - (cardWidth / 2);
        const startY = window.innerHeight - 50 - (cardHeight / 2);

        cards.forEach((card, index) => {
            // Find relative position for the fan arc (-2, -1, 0, 1, 2)
            const offset = index - 2;
            
            // X and Y displacements for standard fanning
            const targetX = centerX + (offset * 150); // Spread them horizontally
            const targetY = centerY + (Math.abs(offset) * 25); // Push outer cards slightly lower for arc
            const targetRotation = offset * 6; // Slight rotation

            // Distance to translate from bottom-right (startX) to destination (targetX)
            // CSS has form: translate(-var(--x), -var(--y)) so positive vals mean left and up.
            const dx = startX - targetX;
            const dy = startY - targetY;

            card.style.setProperty('--x', `${dx}px`);
            card.style.setProperty('--y', `${dy}px`);
            card.style.setProperty('--r', `${targetRotation}deg`);
            
            // Add z-index staggered by iteration so right-most are on top initially
            card.style.zIndex = index + 10;

            // Stagger the movement
            setTimeout(() => {
                card.classList.add('drawn');

                // Reveal the card after the movement finishes (CSS transition is ~0.8s)
                setTimeout(() => {
                    card.classList.add('revealed');
                }, 750);

            }, index * 200 + 100);
        });
    });

    // WIP cards shouldn't redirect anywhere
    document.querySelectorAll('.wip-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Optional: minimal wobble feedback on click to show it's interactive but locked
            card.style.transform = `translate(calc(-1 * var(--x)), calc(-1 * var(--y) - 20px)) rotate(calc(var(--r) * 0.5)) scale(1.05) translateX(5px)`;
            setTimeout(() => {
                card.style.transform = `translate(calc(-1 * var(--x)), calc(-1 * var(--y) - 20px)) rotate(calc(var(--r) * 0.5)) scale(1.05) translateX(-5px)`;
                setTimeout(() => {
                    // Reset to hover state logic
                    card.style.transform = `translate(calc(-1 * var(--x)), calc(-1 * var(--y) - 20px)) rotate(calc(var(--r) * 0.5)) scale(1.05)`;
                }, 100);
            }, 100);
        });
    });

    // Optional: Resizing the window will recalculate their positions if already drawn
    // (This is advanced but makes it perfectly responsive)
    window.addEventListener('resize', () => {
        if (!isDrawn) return;
        
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const startX = window.innerWidth - 50 - (220 / 2);
        const startY = window.innerHeight - 50 - (320 / 2);

        cards.forEach((card, index) => {
            const offset = index - 2;
            const targetX = centerX + (offset * 150); 
            const targetY = centerY + (Math.abs(offset) * 25); 

            const dx = startX - targetX;
            const dy = startY - targetY;

            card.style.setProperty('--x', `${dx}px`);
            card.style.setProperty('--y', `${dy}px`);
        });
    });
});

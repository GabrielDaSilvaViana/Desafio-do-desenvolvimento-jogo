document.addEventListener('DOMContentLoaded', () => {
  // Pares de cartas separados por nível (Tags HTML corrigidas com entidades)
  const allCardPairs = {
    facil: [ // 6 Pares / 12 Cartas -> Layout 4x3
      { id: 1, text: "Cor do Texto" }, { id: 1, text: "color" },
      { id: 2, text: "Parágrafo" }, { id: 2, text: "&lt;p&gt;" },
      { id: 3, text: "Maior Título" }, { id: 3, text: "&lt;h1&gt;" },
      { id: 4, text: "Fundo" }, { id: 4, text: "background" },
      { id: 5, text: "Link" }, { id: 5, text: "&lt;a&gt;" },
      { id: 6, text: "Largura" }, { id: 6, text: "width" }
    ],
    medio: [ // 10 Pares / 20 Cartas -> Layout 5x4
      { id: 1, text: "Imagem" }, { id: 1, text: "&lt;img&gt;" },
      { id: 2, text: "Lista (Não Ord.)" }, { id: 2, text: "&lt;ul&gt;" },
      { id: 3, text: "Borda" }, { id: 3, text: "border" },
      { id: 4, text: "Espaçamento Interno" }, { id: 4, text: "padding" },
      { id: 5, text: "Negrito" }, { id: 5, text: "&lt;b&gt;" },
      { id: 6, text: "Alinhamento Flex" }, { id: 6, text: "justify-content" },
      { id: 7, text: "Corpo da Página" }, { id: 7, text: "&lt;body&gt;" },
      { id: 8, text: "Elemento de Bloco" }, { id: 8, text: "&lt;div&gt;" },
      { id: 9, text: "Fonte do Texto" }, { id: 9, text: "font-family" },
      { id: 10, text: "Quebra de Linha" }, { id: 10, text: "&lt;br&gt;" }
    ],
    dificil: [ // 16 Pares / 32 Cartas -> Layout 8x4
      { id: 1, text: "Altura Viewport" }, { id: 1, text: "vh" },
      { id: 2, text: "Mouse Over" }, { id: 2, text: ":hover" },
      { id: 3, text: "Área Externa" }, { id: 3, text: "margin" },
      { id: 4, text: "Sombra Box" }, { id: 4, text: "box-shadow" },
      { id: 5, text: "Layout Grid" }, { id: 5, text: "CSS Grid" },
      { id: 6, text: "Tag JS" }, { id: 6, text: "&lt;script&gt;" },
      { id: 7, text: "Fonte Imagem" }, { id: 7, text: "src" },
      { id: 8, text: "Input Texto" }, { id: 8, text: "&lt;input&gt;" },
      { id: 9, text: "Escala Fonte" }, { id: 9, text: "rem" },
      { id: 10, text: "Transição" }, { id: 10, text: "transition" },
      { id: 11, text: "Variável CSS" }, { id: 11, text: "--var-name" },
      { id: 12, text: "Lista Ordenada" }, { id: 12, text: "&lt;ol&gt;" },
      { id: 13, text: "Oculta Excesso" }, { id: 13, text: "overflow: hidden" },
      { id: 14, text: "Box Model" }, { id: 14, text: "Box Model" },
      { id: 15, text: "Alerta Pop-up" }, { id: 15, text: "alert()" },
      { id: 16, text: "Responsividade" }, { id: 16, text: "viewport meta tag" }
    ]
  };

  // Elementos
  const gameBoard = document.getElementById('gameBoard');
  const scoreBoard = document.getElementById('scoreboard');
  const timerDisplay = document.getElementById('timer');
  
  // Telas
  const startScreen = document.getElementById('startScreen');
  const endGameScreen = document.getElementById('endGameScreen');
  const finalMessage = document.getElementById('finalMessage');

  // Controles
  const startBtn = document.getElementById('startBtn');
  const restartBtn = document.getElementById('restartBtn');
  const playerNameInput = document.getElementById('playerName');
  
  // NOVOS ELEMENTOS DO DROPDOWN CUSTOMIZADO
  const customSelectTrigger = document.getElementById('customSelect');
  const customOptionsList = document.getElementById('customOptions');
  const customOptions = customOptionsList.querySelectorAll('li');

  // Áudios (VERIFIQUE SE OS IDs NO SEU HTML ESTÃO CORRETOS)
  const matchSound = document.getElementById('pontoSound'); 
  const errorSound = document.getElementById('errouSound');
  const victoryMusic = document.getElementById('EstagioWinSound');
  const backgroundMusic = document.getElementById('musicatemaSound');

  // Variáveis de estado
  const INITIAL_TIME = 300; // 5 minutos
  const BONUS_TIME = 5; // 5 segundos de bônus
  let cardPairs = allCardPairs.facil; // DEFINIÇÃO PADRÃO INICIAL (Para 4x3)
  let timeRemaining = INITIAL_TIME;
  let timerInterval;
  let score = 0;
  let playerName = 'Jogador';
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let matchedCount = 0;
  
  // --- INICIALIZAÇÃO DA TELA DE START ---
  updateScore(); 
  updateTimerDisplay();

  // --- LÓGICA DO DROPDOWN CUSTOMIZADO ---
  
  customSelectTrigger.addEventListener('click', () => {
    customOptionsList.classList.toggle('hidden');
    customSelectTrigger.classList.toggle('active');
  });

  customOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      const selectedValue = e.target.getAttribute('data-value');
      const selectedText = e.target.textContent;

      customSelectTrigger.textContent = selectedText;
      customSelectTrigger.setAttribute('data-value', selectedValue);
      
      customOptions.forEach(li => li.classList.remove('selected'));
      e.target.classList.add('selected');

      customOptionsList.classList.add('hidden');
      customSelectTrigger.classList.remove('active');
    });
  });
  
  document.addEventListener('click', (e) => {
    const isClickInside = customSelectTrigger.contains(e.target) || customOptionsList.contains(e.target);
    if (!isClickInside) {
      customOptionsList.classList.add('hidden');
      customSelectTrigger.classList.remove('active');
    }
  });

  // Lógica de Start
  startBtn.addEventListener('click', () => {
    playerName = playerNameInput.value.trim() || 'Jogador';
    
    const selectedLevel = customSelectTrigger.getAttribute('data-value');
    cardPairs = allCardPairs[selectedLevel];
    
    startScreen.classList.add('hidden');
    endGameScreen.classList.add('hidden');
    resetGame();
  });
  
  // Lógica de Restart (após o jogo)
  restartBtn.addEventListener('click', () => {
    endGameScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    score = 0;
    matchedCount = 0;
    playerNameInput.value = '';
  });

  // --- FUNÇÕES DE CRONÔMETRO ---
  function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timerDisplay.textContent = `Tempo: ${formattedTime}`;

    if (timeRemaining <= 30 && timeRemaining > 0) {
      timerDisplay.style.color = '#ff007f'; 
    } else if (timeRemaining > 30) {
      timerDisplay.style.color = '#00d2ff';
    }
  }

  function startTimer() {
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
      timeRemaining--;
      updateTimerDisplay();

      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        timeOver();
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }
  
  function timeOver() {
    lockBoard = true;
    if (backgroundMusic) backgroundMusic.pause();
    if (errorSound) {
      errorSound.currentTime = 0;
      errorSound.play().catch(e => console.log("Erro ao tocar som: " + e));
    }
    
    setTimeout(() => {
      endGame(false, 'O tempo acabou! Você perdeu.'); 
    }, 500);
  }

  // --- FUNÇÕES DO JOGO ---

  function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while(currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  function updateScore() {
    scoreBoard.textContent = `Pontuação: ${score}`;
  }

  function createBoard() {
    gameBoard.innerHTML = '';
    const shuffledCards = shuffle(cardPairs.slice());

    // --- Lógica do CSS Grid SIMPLES E CONTROLE DE TAMANHO PELO JS ---
    
    let columns;
    let maxWidth;
    const totalCards = cardPairs.length;
    
    // Define a largura total do tabuleiro (max-width) com base na dificuldade:
    if (totalCards === 12) { 
        // Fácil (4x3): Cards Maiores (Tabuleiro menor = 550px)
        columns = 4;
        maxWidth = '550px'; 
    } else if (totalCards === 20) { 
        // Médio (5x4): Cards Médios (Tabuleiro intermediário = 650px)
        columns = 5;
        maxWidth = '650px'; 
    } else if (totalCards === 32) { 
        // Difícil (8x4): Cards Menores (Tabuleiro maior = 750px)
        columns = 8; 
        maxWidth = '750px'; 
    }
    
    // Aplica a largura máxima, forçando os cards a se ajustarem
    gameBoard.style.maxWidth = maxWidth;

    // 2. Aplica o Grid CSS ao tabuleiro.
    gameBoard.style.display = 'grid'; 
    gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`; 

    shuffledCards.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');
      cardElement.dataset.id = card.id;
      
      cardElement.style.width = '100%'; 
      
      cardElement.innerHTML = `
        <div class="card-inner">
          <div class="front">?</div>
          <div class="back">${card.text}</div>
        </div>`;
      gameBoard.appendChild(cardElement);

      cardElement.addEventListener('click', () => {
        if (lockBoard || cardElement === firstCard) return;
        if (cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) return;
        flipCard(cardElement);
      });
    });
  }

  function flipCard(card) {
    card.classList.add('flipped');
    if (!firstCard) {
      firstCard = card;
      return;
    }
    secondCard = card;
    lockBoard = true;
    checkForMatch();
  }

  function checkForMatch() {
    const isMatch = firstCard.dataset.id === secondCard.dataset.id;
    if (isMatch) {
      score += 10;
      updateScore();
      
      timeRemaining += BONUS_TIME;
      updateTimerDisplay();

      if (matchSound) {
        matchSound.currentTime = 0;
        matchSound.play().catch(e => console.log("Erro ao tocar som: " + e));
      }
      
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      matchedCount += 2;
      resetTurn();

      if (matchedCount === cardPairs.length) {
        endGame(true, '🎉 Parabéns! Você encontrou todos os pares!'); 
      }
    } else {
      if (errorSound) {
        errorSound.currentTime = 0;
        errorSound.play().catch(e => console.log("Erro ao tocar som: " + e));
      }
      setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetTurn();
      }, 1200);
    }
  }

  function endGame(isVictory, message) {
    stopTimer();
    lockBoard = true;
    if (backgroundMusic) backgroundMusic.pause();
    
    const finalMsg = `${message}<br><br>
                      **${playerName}**, sua pontuação total foi: **${score}**`;

    if (isVictory) {
      if (typeof confetti !== 'undefined') {
        confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
      }
      
      if (victoryMusic) {
        victoryMusic.currentTime = 0;
        victoryMusic.play().catch(e => console.log("Erro ao tocar som: " + e));
      }
      
      setTimeout(() => {
        finalMessage.innerHTML = finalMsg;
        endGameScreen.classList.remove('hidden');
      }, 2500);
    } else {
        finalMessage.innerHTML = finalMsg;
        endGameScreen.classList.remove('hidden');
    }
  }

  function resetTurn() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
  }

  function resetGame() {
    score = 0;
    timeRemaining = INITIAL_TIME;
    matchedCount = 0;
    updateScore();
    updateTimerDisplay();
    
    // Controles de áudio mais seguros
    if (victoryMusic) {
      victoryMusic.pause(); 
      victoryMusic.currentTime = 0;
    }
    if (backgroundMusic) {
      backgroundMusic.currentTime = 0;
      backgroundMusic.volume = 0.3;
      backgroundMusic.play().catch(e => console.log("Interação necessária para áudio"));
    }

    createBoard();
    showInitialCards();
  }

  function showInitialCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.classList.add('flipped'));
    lockBoard = true;
    
    setTimeout(() => {
      cards.forEach(card => card.classList.remove('flipped'));
      lockBoard = false;
      startTimer(); 
    }, 5000);
  }
});
// Инициализация Telegram WebApp
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.expand(); // Растягиваем на весь экран
}

// Данные игры
const gameState = {
    character: {
        name: "",
        avatar: "",
        xp: 0,
        level: 1
    },
    quests: [
        { id: 1, name: "10 отжиманий", xp: 10, completed: false },
        { id: 2, name: "Прочитать 15 минут", xp: 7, completed: false }
    ]
};

// DOM-элементы
const elements = {
    characterCreation: document.getElementById('character-creation'),
    gameInterface: document.getElementById('game-interface'),
    nameInput: document.getElementById('character-name'),
    startButton: document.getElementById('start-game'),
    avatarOptions: document.querySelectorAll('.avatar-option'),
    characterNameDisplay: document.getElementById('character-name-display'),
    characterAvatar: document.getElementById('character-avatar'),
    xpProgress: document.getElementById('xp-progress'),
    levelDisplay: document.getElementById('level'),
    questsContainer: document.getElementById('quests-container')
};

// Выбор аватара
elements.avatarOptions.forEach(avatar => {
    avatar.addEventListener('click', function() {
        // Удаляем выделение у всех аватаров
        elements.avatarOptions.forEach(el => el.classList.remove('selected'));
        
        // Добавляем выделение выбранному
        this.classList.add('selected');
        gameState.character.avatar = this.getAttribute('data-avatar');
    });
});

// Начало игры
elements.startButton.addEventListener('click', () => {
    const name = elements.nameInput.value.trim();
    
    if (name.length < 2) {
        alert("Имя должно быть не короче 2 символов!");
        return;
    }
    
    if (!gameState.character.avatar) {
        alert("Выберите аватар!");
        return;
    }
    
    // Сохраняем данные
    gameState.character.name = name;
    
    // Переключаем экраны
    elements.characterCreation.classList.add('hidden');
    elements.gameInterface.classList.remove('hidden');
    
    // Обновляем интерфейс
    updateGameInterface();
    
    // Загружаем квесты
    loadQuests();
});

// Обновление игрового интерфейса
function updateGameInterface() {
    elements.characterNameDisplay.textContent = gameState.character.name;
    elements.characterAvatar.src = `assets/images/avatar${gameState.character.avatar}.png`;
    elements.xpProgress.style.width = `${gameState.character.xp}%`;
    elements.levelDisplay.textContent = gameState.character.level;
}

// Загрузка квестов
function loadQuests() {
    elements.questsContainer.innerHTML = '';
    
    gameState.quests.forEach(quest => {
        const questElement = document.createElement('div');
        questElement.className = 'quest';
        questElement.innerHTML = `
            <span>${quest.name}</span>
            <button data-id="${quest.id}">+${quest.xp} XP</button>
        `;
        
        questElement.querySelector('button').addEventListener('click', () => completeQuest(quest.id));
        elements.questsContainer.appendChild(questElement);
    });
}

// Завершение квеста
function completeQuest(questId) {
    const quest = gameState.quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;
    
    quest.completed = true;
    gameState.character.xp += quest.xp;
    
    // Проверка уровня
    if (gameState.character.xp >= 100) {
        gameState.character.level++;
        gameState.character.xp = 0;
        alert(`🎉 Уровень UP! Теперь вы уровня ${gameState.character.level}`);
    }
    
    updateGameInterface();
}
// Отправка данных боту при создании персонажа
Telegram.WebApp.sendData(JSON.stringify({
    action: "create_character",
    name: "ИмяПерсонажа",
    avatar: "1"
}));

// При завершении квеста
Telegram.WebApp.sendData(JSON.stringify({
    action: "complete_quest",
    questId: 1,
    xp: 10
}));

// Variáveis globais (declaradas no escopo global para serem acessíveis em qualquer lugar)
let accountsData = [];
let allCountries = new Set();
let statusPopupTimeout;
let currentRating = 0;
let appSettings = {};
let selectedCreationPlatformForEdit = null;
let selectedDeviceForEdit = null;
let importedFileContent = null; // Variável para armazenar o conteúdo do arquivo JSON importado temporariamente

// Para o seletor de ícones
let currentIconTargetInput = null; // Para saber qual input (creationPlatformIconInput ou deviceIconInput) está ativo
let selectedIconClass = null; // O ícone selecionado no modal
// Lista de ícones Font Awesome comuns (você pode expandir esta lista manualmente
// ou carregar de um arquivo JSON se tiver acesso a uma lista completa)
const FONT_AWESOME_ICONS = [
    // Marcas (fab)
    { name: "Google", class: "fab fa-google" },
    { name: "Facebook", class: "fab fa-facebook" },
    { name: "Twitter", class: "fab fa-twitter" },
    { name: "Apple", class: "fab fa-apple" },
    { name: "Windows", class: "fab fa-windows" },
    { name: "Android", class: "fab fa-android" },
    { name: "Amazon", class: "fab fa-amazon" },
    { name: "Microsoft", class: "fab fa-microsoft" },
    { name: "Paypal", class: "fab fa-paypal" },
    { name: "Whatsapp", class: "fab fa-whatsapp" },
    { name: "Instagram", class: "fab fa-instagram" },
    { name: "LinkedIn", class: "fab fa-linkedin" },
    { name: "Github", class: "fab fa-github" },
    { name: "Discord", class: "fab fa-discord" },
    { name: "Spotify", class: "fab fa-spotify" },
    { name: "Chrome", class: "fab fa-chrome" },
    { name: "Firefox", class: "fab fa-firefox" },
    { name: "Edge", class: "fab fa-edge" },
    { name: "Safari", class: "fab fa-safari" },
    // Sólidos (fas)
    { name: "Email (Envelope)", class: "fas fa-envelope" },
    { name: "Email (Circle Check)", class: "fa-solid fa-envelope-circle-check" }, // Outlook
    { name: "Telefone", class: "fas fa-phone" },
    { name: "Computador", class: "fas fa-desktop" },
    { name: "Celular", class: "fas fa-mobile-alt" },
    { name: "Globo (Navegador)", class: "fas fa-globe" },
    { name: "Secreto (Antidetect)", class: "fas fa-user-secret" },
    { name: "Usuário", class: "fas fa-user" },
    { name: "Usuários", class: "fas fa-users" },
    { name: "Configurações", class: "fas fa-cog" },
    { name: "Importar", class: "fas fa-file-import" },
    { name: "Exportar", class: "fas fa-file-export" },
    { name: "Lixo", class: "fas fa-trash-alt" },
    { name: "Editar", class: "fas fa-edit" },
    { name: "Adicionar", class: "fas fa-plus-circle" },
    { name: "Verificado", class: "fas fa-check-circle" },
    { name: "Alerta", class: "fas fa-exclamation-triangle" },
    { name: "Informação", class: "fas fa-info-circle" },
    { name: "Casa", class: "fas fa-home" },
    { name: "Estrela", class: "fas fa-star" },
    { name: "Câmera", class: "fas fa-camera" },
    { name: "Cadeado", class: "fas fa-lock" },
    { name: "Gráfico", class: "fas fa-chart-line" },
    { name: "Olho", class: "fas fa-eye" },
    { name: "Fogo", class: "fas fa-fire" },
    { name: "Semente", class: "fas fa-seedling" },
    { name: "Inseto", class: "fas fa-bug" },
    { name: "Termômetro", class: "fas fa-thermometer-empty" },
    { name: "Pausa", class: "fas fa-pause-circle" },
    { name: "Arquivo", class: "fas fa-archive" },
    { name: "Escudo", class: "fas fa-shield-alt" },
    { name: "Seta para Cima", class: "fas fa-arrow-up" },
    { name: "Seta para Baixo", class: "fas fa-arrow-down" },
    { name: "Lápis", class: "fas fa-pencil-alt" },
    { name: "Caixa", class: "fas fa-box" },
    { name: "Carrinho", class: "fas fa-shopping-cart" }
];


// --- Dicionário de Status com Descrições ---
const STATUS_DESCRIPTIONS = {
    'RECÉM-CRIADA': 'Conta recém-registrada na plataforma, em fase inicial de "aquecimento" e validação.',
    'EM OBSERVAÇÃO': 'Conta sob monitoramento intensificado devido a anomalias de comportamento, alertas de segurança ou denúncias.',
    'PROBLEMÁTICA': 'Conta que violou os Termos de Serviço da plataforma ou demonstrou comportamento prejudicial/abusivo, em risco de suspensão.',
    'EM CRESCIMENTO': 'Conta que está expandindo sua base de seguidores/alcance/engajamento de forma consistente e positiva.',
    'CONTA BUGADA': 'Conta que apresenta falhas técnicas persistentes na funcionalidade da plataforma (ex: impossibilidade de postar).',
    'CONTA RESTRITA': 'Conta que teve funcionalidades específicas limitadas pela plataforma como uma medida deliberada (penalidade).',
    'CONTA ESFRIOU': 'Conta que demonstrou uma diminuição significativa e prolongada na atividade, perdendo relevância e alcance.',
    'EM AQUECIMENTO': 'Conta que está em um processo gradual e controlado de aumento de atividade e interações para prepará-la para uso intenso.',
    'ATIVA/SAUDÁVEL': 'Conta operando normalmente, com bom desempenho e sem problemas aparentes ou alertas da plataforma.',
    'PAUSA TEMPORÁRIA': 'Conta que foi intencionalmente desativada ou com atividades suspensas por um período definido.',
    'BATEU OS REQUISITOS': 'Contas que atingiram os critérios e estão prontas para o próximo estágio.',
    'TIKTOK SHOP ATIVO': 'Contas que possuem a funcionalidade TikTok Shop totalmente ativa e operacional.',
    'DEFAULT': 'Status da conta não definido ou desconhecido.'
};

// Lista de todos os status possíveis em ordem desejada
const ALL_POSSIBLE_STATUSES = [
    'RECÉM-CRIADA',
    'EM OBSERVAÇÃO',
    'PROBLEMÁTICA',
    'EM CRESCIMENTO',
    'CONTA BUGADA',
    'CONTA RESTRITA',
    'CONTA ESFRIOU',
    'EM AQUECIMENTO',
    'ATIVA/SAUDÁVEL',
    'PAUSA TEMPORÁRIA',
    'BATEU OS REQUISITOS',
    'TIKTOK SHOP ATIVO'
];

// Elementos do DOM (obtidos ao final do script, dentro do DOMContentLoaded ou window.onload)
let toggleThemeBtn, addAccountBtn, importAccountsBtn, exportAccountsBtn, deleteAllAccountsBtn, confirmImportBtn, importFileInput;
let accountModal, accountModalTitle, closeAccountModalBtn, cancelAccountBtn, accountForm, accountIdInput, accountNameInput, accountEmailInput, accountPasswordInput, accountCountryInput, accountStatusInput, accountNotesInput, accountRatingInput;
let accountCreationPlatformInput, accountCreationDeviceInput; // Novos inputs para o modal de conta
let whatsappNumberInput, saveWhatsappNumberBtn, clearWhatsappNumberBtn;
let creationPlatformNameInput, creationPlatformIconInput, addCreationPlatformBtn, editCreationPlatformBtn, removeCreationPlatformBtn, creationPlatformList, removeAllCreationPlatformsBtn;
let deviceNameInput, deviceIconInput, addDeviceBtn, editDeviceBtn, removeDeviceBtn, deviceList, removeAllDevicesBtn;
let confirmationModal, confirmationModalTitle, confirmationModalMessage, confirmActionBtn, cancelActionBtn;
let messageModal, messageModalTitle, messageModalContent, closeMessageModalBtn, okMessageModalBtn;
let accountsGrid, noAccountsMessage, searchInput, clearSearchBtn, countryFilter, statusFilter;
let totalAccountsCount, heatingAccountsCount, newAccountsCount, observingAccountsCount, growingAccountsCount, buggedAccountsCount, restrictedAccountsCount, cooledAccountsCount, problematicAccountsCount, activeHealthyAccountsCount, pausedAccountsCount;
let archivedAccountsCount, verifiedAccountsCount; // Referências para os elementos do dashboard
let accountsByCreationPlatformList, accountsByCreationDeviceList; // IDs para as novas listas separadas
let currentUserIdSpan, loadingOverlay;
let goToTopBtn, goToBottomBtn;
// Novos elementos para o modal de opções de importação
let importOptionsModal, closeImportOptionsModalBtn, importAccountsCheckbox, importSettingsCheckbox, importCreationPlatformsCheckbox, importDevicesCheckbox, startImportProcessBtn, cancelImportOptionsBtn;
// Novos elementos para o modal de seleção de ícones
let iconPickerModal, closeIconPickerModalBtn, iconSearchInput, iconGrid, selectIconBtn, cancelIconPickerBtn;


// --- Funções Utilitárias ---

function showLoading() {
    loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    loadingOverlay.classList.add('hidden');
}

function showMessageModal(title, message) {
    messageModalTitle.textContent = title;
    messageModalContent.innerHTML = message;
    messageModal.classList.remove('hidden');
}

function hideMessageModal() {
    messageModal.classList.add('hidden');
}

function showConfirmationModal(title, message) {
    return new Promise((resolve) => {
        confirmationModalTitle.textContent = title;
        confirmationModalMessage.textContent = message;
        confirmationModal.classList.remove('hidden');

        const onConfirm = () => {
            confirmationModal.classList.add('hidden');
            confirmActionBtn.removeEventListener('click', onConfirm);
            cancelActionBtn.removeEventListener('click', onCancel);
            resolve(true);
        };

        const onCancel = () => {
            confirmationModal.classList.add('hidden');
            confirmActionBtn.removeEventListener('click', onConfirm);
            cancelActionBtn.removeEventListener('click', onCancel);
            resolve(false);
        };

        confirmActionBtn.addEventListener('click', onConfirm);
        cancelActionBtn.addEventListener('click', onCancel);
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    toggleThemeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i> Tema' : '<i class="fas fa-moon"></i> Tema';
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(savedTheme);
    toggleThemeBtn.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i> Tema' : '<i class="fas fa-moon"></i> Tema';
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showMessageModal('Sucesso!', 'Texto copiado para a área de transferência.');
    } catch (err) {
        showMessageModal('Erro', 'Falha ao copiar texto. Por favor, tente manualmente.');
        console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(textarea);
}

window.copyToClipboard = copyToClipboard;

function formatPhoneNumber(phoneNumberString) {
    let value = String(phoneNumberString);
    value = value.replace(/\D/g, ''); // Remove tudo que não for dígito

    if (value.length > 2 && value.startsWith('0') && !value.startsWith('00') && !value.startsWith('041')) {
        value = value.substring(1);
    }

    return value;
}

function sendWhatsAppMessage(phoneNumber, message) {
    if (!phoneNumber) {
        showMessageModal('Erro de WhatsApp', 'O número de telefone para envio não foi configurado. Por favor, defina-o nas Configurações.');
        return;
    }

    if (!message) {
        showMessageModal('Erro de Mensagem', 'Não foi possível gerar a mensagem da conta.');
        return;
    }

    const cleanedPhoneNumber = formatPhoneNumber(phoneNumber);
    const encodedMessage = encodeURIComponent(message);

    const whatsappUrl = `https://wa.me/${cleanedPhoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
}

function updateScrollButtonsVisibility() {
    if (window.scrollY > 200) {
        goToTopBtn.classList.remove('hidden');
    } else {
        goToTopBtn.classList.add('hidden');
    }

    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const currentScroll = window.scrollY;

    if (scrollHeight - (currentScroll + clientHeight) > 200) {
        goToBottomBtn.classList.remove('hidden');
    } else {
        goToBottomBtn.classList.add('hidden');
    }
}

// --- Funções de Persistência Local ---

function loadAccountsFromLocalStorage() {
    try {
        const storedAccounts = localStorage.getItem('tiktok_accounts');
        accountsData = storedAccounts ? JSON.parse(storedAccounts) : [];
        console.log("Contas carregadas do localStorage:", accountsData);
        allCountries = new Set(accountsData.map(acc => acc.country));
    } catch (e) {
        console.error("Erro ao carregar contas do localStorage:", e);
        accountsData = [];
        showMessageModal('Erro de Carregamento', 'Não foi possível carregar as contas salvas. Os dados podem estar corrompidos.');
    }
}

function saveAccountsToLocalStorage() {
    try {
        localStorage.setItem('tiktok_accounts', JSON.stringify(accountsData));
        console.log("Contas salvas no localStorage.");
    }
    catch (e) {
        console.error("Erro ao salvar contas no localStorage:", e);
        showMessageModal('Erro de Salvamento', 'Não foi possível salvar as contas. O armazenamento local pode estar cheio.');
    }
}

function loadAppSettings() {
    try {
        const storedSettings = localStorage.getItem('app_settings');
        appSettings = storedSettings ? JSON.parse(storedSettings) : {};

        // Valores padrão se não existirem
        if (typeof appSettings.whatsappNumber === 'undefined') {
            appSettings.whatsappNumber = '';
        }
        if (typeof appSettings.customPlatforms === 'undefined' || !Array.isArray(appSettings.customPlatforms)) {
            appSettings.customPlatforms = []; // Não haverá plataformas customizadas se a seção for removida
        }

        // Novas configurações para Plataformas de Criação
        if (typeof appSettings.creationPlatforms === 'undefined' || !Array.isArray(appSettings.creationPlatforms) || appSettings.creationPlatforms.length === 0) {
            appSettings.creationPlatforms = [
                { name: "Gmail", icon: "fab fa-google" },
                { name: "Outlook", icon: "fa-solid fa-envelope-circle-check" },
                { name: "Número de Telefone", icon: "fas fa-phone" },
                { name: "Facebook", icon: "fab fa-facebook" }
            ];
        }
        // Novas configurações para Dispositivos de Criação
        if (typeof appSettings.creationDevices === 'undefined' || !Array.isArray(appSettings.creationDevices) || appSettings.creationDevices.length === 0) {
            appSettings.creationDevices = [
                { name: "PC", icon: "fas fa-desktop" },
                { name: "Celular", icon: "fas fa-mobile-alt" },
                { name: "Navegador Normal", icon: "fas fa-globe" },
                { name: "Antidetect", icon: "fas fa-user-secret" }
            ];
        }


        console.log("Configurações do aplicativo carregadas:", appSettings);
    } catch (e) {
        console.error("Erro ao carregar configurações do aplicativo do localStorage:", e);
        // Fallback robusto para todas as configurações em caso de erro
        appSettings = {
            whatsappNumber: '',
            customPlatforms: [],
            creationPlatforms: [
                { name: "Gmail", icon: "fab fa-google" },
                { name: "Outlook", icon: "fa-solid fa-envelope-circle-check" },
                { name: "Número de Telefone", icon: "fas fa-phone" },
                { name: "Facebook", icon: "fab fa-facebook" }
            ],
            creationDevices: [
                { name: "PC", icon: "fas fa-desktop" },
                { name: "Celular", icon: "fas fa-mobile-alt" },
                { name: "Navegador Normal", icon: "fas fa-globe" },
                { name: "Antidetect", icon: "fas fa-user-secret" }
            ]
        };
    }
}

function saveAppSettings() {
    try {
        localStorage.setItem('app_settings', JSON.stringify(appSettings));
        console.log("Configurações do aplicativo salvas.");
    } catch (e) {
        console.error("Erro ao salvar configurações do aplicativo no localStorage:", e);
        showMessageModal('Erro de Salvamento', 'Não foi possível salvar as configurações. O armazenamento local pode estar cheio.');
    }
}

function applyAppSettings() {
    if (whatsappNumberInput) {
        whatsappNumberInput.value = appSettings.whatsappNumber;
    }
    renderCreationPlatformList();
    populateCreationPlatformDropdown();
    renderDeviceList();
    populateDeviceDropdown();
}

async function loadAccountsFromJson() {
    showLoading();
    try {
        const response = await fetch('accounts.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonContent = await response.json();

        if (Array.isArray(jsonContent)) {
            accountsData = jsonContent;
            accountsData.forEach(account => {
                if (typeof account.id !== 'string') account.id = String(account.id);
                if (typeof account.rating === 'undefined' || account.rating === null) account.rating = 0;
                if (typeof account.platform === 'undefined') account.platform = 'TikTok Shop'; // Padrão se não existir
                if (typeof account.creationPlatform === 'undefined') account.creationPlatform = '';
                if (typeof account.creationDevice === 'undefined') account.creationDevice = '';
            });
            allCountries = new Set(accountsData.map(acc => acc.country));
            saveAccountsToLocalStorage();
            console.log("Contas carregadas do accounts.json (formato antigo):", accountsData);
        } else if (jsonContent && typeof jsonContent === 'object' && jsonContent.accounts) {
            accountsData = jsonContent.accounts;
            accountsData.forEach(account => {
                if (typeof account.id !== 'string') account.id = String(account.id);
                if (typeof account.rating === 'undefined' || account.rating === null) account.rating = 0;
                if (typeof account.platform === 'undefined') account.platform = 'TikTok Shop'; // Padrão se não existir
                if (typeof account.creationPlatform === 'undefined') account.creationPlatform = '';
                if (typeof account.creationDevice === 'undefined') account.creationDevice = '';
            });
            allCountries = new Set(accountsData.map(acc => acc.country));
            saveAccountsToLocalStorage();

            if (jsonContent.settings) {
                appSettings = { ...appSettings, ...jsonContent.settings };
                if (typeof appSettings.whatsappNumber === 'undefined') appSettings.whatsappNumber = '';
                if (typeof appSettings.customPlatforms === 'undefined' || !Array.isArray(appSettings.customPlatforms)) {
                    appSettings.customPlatforms = [];
                }
                if (typeof appSettings.creationPlatforms === 'undefined' || !Array.isArray(appSettings.creationPlatforms)) {
                     appSettings.creationPlatforms = [];
                }
                if (typeof appSettings.creationDevices === 'undefined' || !Array.isArray(appSettings.creationDevices)) {
                     appSettings.creationDevices = [];
                }
                saveAppSettings();
                applyAppSettings();
            }
            console.log("Dados carregados do accounts.json (formato novo):", jsonContent);
        } else {
            throw new Error("Formato de accounts.json inválido.");
        }
    } catch (e) {
        console.warn("Não foi possível carregar accounts.json ou ocorreu um erro. Carregando do localStorage como fallback.", e);
        loadAccountsFromLocalStorage();
    } finally {
        updateCountryFilterOptions();
        updateStatusFilterOptions();
        applyFilters();
        hideLoading();
    }
}

// --- Funções de Gerenciamento de Plataformas (Antigas) foram removidas. ---

// --- Funções de Gerenciamento de Plataformas de Criação ---

function renderCreationPlatformList() {
    creationPlatformList.innerHTML = '';
    appSettings.creationPlatforms.forEach(platform => {
        const li = document.createElement('li');
        li.dataset.name = platform.name;
        li.dataset.icon = platform.icon;
        li.innerHTML = `
            <span><i class="${platform.icon}"></i> ${platform.name}</span>
            <div class="actions">
                <button class="app-button secondary-button select-creation-platform-btn">Selecionar</button>
                <button class="app-button delete-button remove-creation-platform-btn">Remover</button>
            </div>
        `;
        creationPlatformList.appendChild(li);
    });
    addCreationPlatformListListeners();
}

function addCreationPlatformListListeners() {
    document.querySelectorAll('#creationPlatformList .select-creation-platform-btn').forEach(button => {
        button.removeEventListener('click', handleSelectCreationPlatformClick);
    });
    document.querySelectorAll('#creationPlatformList .remove-creation-platform-btn').forEach(button => {
        button.removeEventListener('click', handleRemoveCreationPlatformClick);
    });

    document.querySelectorAll('#creationPlatformList .select-creation-platform-btn').forEach(button => {
        button.addEventListener('click', handleSelectCreationPlatformClick);
    });
    document.querySelectorAll('#creationPlatformList .remove-creation-platform-btn').forEach(button => {
        button.addEventListener('click', handleRemoveCreationPlatformClick);
    });
}

function handleSelectCreationPlatformClick(e) {
    const listItem = e.target.closest('li');
    creationPlatformNameInput.value = listItem.dataset.name;
    creationPlatformIconInput.value = listItem.dataset.icon;
    selectedCreationPlatformForEdit = { name: listItem.dataset.name, icon: listItem.dataset.icon };
    document.querySelectorAll('#creationPlatformList li').forEach(item => item.classList.remove('selected'));
    listItem.classList.add('selected');
}

async function handleRemoveCreationPlatformClick(e) {
    const platformToRemoveName = e.target.closest('li').dataset.name;
    const confirmed = await showConfirmationModal('Remover Plataforma de Criação', `Tem certeza que deseja remover a plataforma de criação "${platformToRemoveName}"? Contas que a utilizam não serão alteradas.`);
    if (confirmed) {
        const initialLength = appSettings.creationPlatforms.length;
        appSettings.creationPlatforms = appSettings.creationPlatforms.filter(p => p.name !== platformToRemoveName);
        if (appSettings.creationPlatforms.length < initialLength) {
            saveAppSettings();
            applyAppSettings();
            showMessageModal('Sucesso!', `Plataforma de criação "${platformToRemoveName}" removida.`);
            if (selectedCreationPlatformForEdit && selectedCreationPlatformForEdit.name === platformToRemoveName) {
                creationPlatformNameInput.value = '';
                creationPlatformIconInput.value = '';
                selectedCreationPlatformForEdit = null;
            }
        } else {
            showMessageModal('Erro', 'Plataforma de criação não encontrada.');
        }
    }
}

function populateCreationPlatformDropdown() {
    accountCreationPlatformInput.innerHTML = '<option value="">Selecione a Plataforma de Criação</option>';
    appSettings.creationPlatforms.sort((a, b) => a.name.localeCompare(b.name)).forEach(platform => {
        const option = document.createElement('option');
        option.value = platform.name; // Salva apenas o nome como valor
        option.innerHTML = `<i class="${platform.icon}"></i> ${platform.name}`;
        accountCreationPlatformInput.appendChild(option);
    });
}

async function handleAddCreationPlatform() {
    const newName = creationPlatformNameInput.value.trim();
    const newIcon = creationPlatformIconInput.value.trim();
    if (!newName) {
        showMessageModal('Erro', 'O nome da plataforma de criação não pode ser vazio.');
        return;
    }
    if (!newIcon) {
        showMessageModal('Erro', 'O ícone da plataforma de criação não pode ser vazio.');
        return;
    }
    if (appSettings.creationPlatforms.some(p => p.name === newName)) {
        showMessageModal('Erro', `A plataforma de criação "${newName}" já existe.`);
        return;
    }

    appSettings.creationPlatforms.push({ name: newName, icon: newIcon });
    saveAppSettings();
    applyAppSettings();
    showMessageModal('Sucesso!', `Plataforma de criação "${newName}" adicionada.`);
    creationPlatformNameInput.value = '';
    creationPlatformIconInput.value = '';
}

async function handleEditCreationPlatform() {
    if (!selectedCreationPlatformForEdit) {
        showMessageModal('Erro', 'Por favor, selecione uma plataforma de criação na lista para editar.');
        return;
    }
    const updatedName = creationPlatformNameInput.value.trim();
    const updatedIcon = creationPlatformIconInput.value.trim();
    if (!updatedName) {
        showMessageModal('Erro', 'O novo nome da plataforma de criação não pode ser vazio.');
        return;
    }
    if (!updatedIcon) {
        showMessageModal('Erro', 'O novo ícone da plataforma de criação não pode ser vazio.');
        return;
    }
    if (appSettings.creationPlatforms.some(p => p.name === updatedName) && updatedName !== selectedCreationPlatformForEdit.name) {
        showMessageModal('Erro', `A plataforma de criação "${updatedName}" já existe.`);
        return;
    }

    const index = appSettings.creationPlatforms.findIndex(p => p.name === selectedCreationPlatformForEdit.name);
    if (index > -1) {
        appSettings.creationPlatforms[index] = { name: updatedName, icon: updatedIcon };
        saveAppSettings();
        applyAppSettings();
        showMessageModal('Sucesso!', `Plataforma de criação "${selectedCreationPlatformForEdit.name}" editada para "${updatedName}".`);

        accountsData.forEach(account => {
            if (account.creationPlatform === selectedCreationPlatformForEdit.name) {
                account.creationPlatform = updatedName;
            }
        });
        saveAccountsToLocalStorage();
        applyFilters(); // Atualiza a exibição se houver ícones ou texto de criação

        creationPlatformNameInput.value = '';
        creationPlatformIconInput.value = '';
        selectedCreationPlatformForEdit = null;
    }
}

async function handleRemoveAllCreationPlatforms() {
    const confirmed = await showConfirmationModal('Remover Todas as Plataformas de Criação', 'Tem certeza de que deseja remover TODAS as plataformas de criação personalizadas? Contas que as utilizam ficarão sem uma plataforma de criação selecionada.');
    if (!confirmed) {
        return;
    }

    showLoading();
    try {
        appSettings.creationPlatforms = [];
        saveAppSettings();
        applyAppSettings();
        showMessageModal('Sucesso!', 'Todas as plataformas de criação personalizadas foram removidas.');
    } catch (e) {
        console.error("Erro ao remover todas as plataformas de criação: ", e);
        showMessageModal('Erro', 'Não foi possível remover todas as plataformas de criação. Detalhes: ' + e.message);
    } finally {
        hideLoading();
    }
}


// --- Funções de Gerenciamento de Dispositivos de Criação ---

function renderDeviceList() {
    deviceList.innerHTML = '';
    appSettings.creationDevices.forEach(device => {
        const li = document.createElement('li');
        li.dataset.name = device.name;
        li.dataset.icon = device.icon;
        li.innerHTML = `
            <span><i class="${device.icon}"></i> ${device.name}</span>
            <div class="actions">
                <button class="app-button secondary-button select-device-btn">Selecionar</button>
                <button class="app-button delete-button remove-device-btn">Remover</button>
            </div>
        `;
        deviceList.appendChild(li);
    });
    addDeviceListListeners();
}

function addDeviceListListeners() {
    document.querySelectorAll('#deviceList .select-device-btn').forEach(button => {
        button.removeEventListener('click', handleSelectDeviceClick);
    });
    document.querySelectorAll('#deviceList .remove-device-btn').forEach(button => {
        button.removeEventListener('click', handleRemoveDeviceClick);
    });

    document.querySelectorAll('#deviceList .select-device-btn').forEach(button => {
        button.addEventListener('click', handleSelectDeviceClick);
    });
    document.querySelectorAll('#deviceList .remove-device-btn').forEach(button => {
        button.addEventListener('click', handleRemoveDeviceClick);
    });
}

function handleSelectDeviceClick(e) {
    const listItem = e.target.closest('li');
    deviceNameInput.value = listItem.dataset.name;
    deviceIconInput.value = listItem.dataset.icon;
    selectedDeviceForEdit = { name: listItem.dataset.name, icon: listItem.dataset.icon };
    document.querySelectorAll('#deviceList li').forEach(item => item.classList.remove('selected'));
    listItem.classList.add('selected');
}

async function handleRemoveDeviceClick(e) {
    const deviceToRemoveName = e.target.closest('li').dataset.name;
    const confirmed = await showConfirmationModal('Remover Dispositivo de Criação', `Tem certeza que deseja remover o dispositivo de criação "${deviceToRemoveName}"? Contas que o utilizam não serão alteradas.`);
    if (confirmed) {
        const initialLength = appSettings.creationDevices.length;
        appSettings.creationDevices = appSettings.creationDevices.filter(d => d.name !== deviceToRemoveName);
        if (appSettings.creationDevices.length < initialLength) {
            saveAppSettings();
            applyAppSettings();
            showMessageModal('Sucesso!', `Dispositivo de criação "${deviceToRemoveName}" removido.`);
            if (selectedDeviceForEdit && selectedDeviceForEdit.name === deviceToRemoveName) {
                deviceNameInput.value = '';
                deviceIconInput.value = '';
                selectedDeviceForEdit = null;
            }
        } else {
            showMessageModal('Erro', 'Dispositivo de criação não encontrado.');
        }
    }
}

function populateDeviceDropdown() {
    accountCreationDeviceInput.innerHTML = '<option value="">Selecione o Dispositivo de Criação</option>';
    appSettings.creationDevices.sort((a, b) => a.name.localeCompare(b.name)).forEach(device => {
        const option = document.createElement('option');
        option.value = device.name; // Salva apenas o nome como valor
        option.innerHTML = `<i class="${device.icon}"></i> ${device.name}`;
        accountCreationDeviceInput.appendChild(option);
    });
}

async function handleAddDevice() {
    const newName = deviceNameInput.value.trim();
    const newIcon = deviceIconInput.value.trim();
    if (!newName) {
        showMessageModal('Erro', 'O nome do dispositivo não pode ser vazio.');
        return;
    }
    if (!newIcon) {
        showMessageModal('Erro', 'O ícone do dispositivo não pode ser vazio.');
        return;
    }
    if (appSettings.creationDevices.some(d => d.name === newName)) {
        showMessageModal('Erro', `O dispositivo "${newName}" já existe.`);
        return;
    }

    appSettings.creationDevices.push({ name: newName, icon: newIcon });
    saveAppSettings();
    applyAppSettings();
    showMessageModal('Sucesso!', `Dispositivo "${newName}" adicionado.`);
    deviceNameInput.value = '';
    deviceIconInput.value = '';
}

async function handleEditDevice() {
    if (!selectedDeviceForEdit) {
        showMessageModal('Erro', 'Por favor, selecione um dispositivo na lista para editar.');
        return;
    }
    const updatedName = deviceNameInput.value.trim();
    const updatedIcon = deviceIconInput.value.trim();
    if (!updatedName) {
        showMessageModal('Erro', 'O novo nome do dispositivo não pode ser vazio.');
        return;
    }
    if (!updatedIcon) {
        showMessageModal('Erro', 'O novo ícone do dispositivo não pode ser vazio.');
        return;
    }
    if (appSettings.creationDevices.some(d => d.name === updatedName) && updatedName !== selectedDeviceForEdit.name) {
        showMessageModal('Erro', `O dispositivo "${updatedName}" já existe.`);
        return;
    }

    const index = appSettings.creationDevices.findIndex(d => d.name === selectedDeviceForEdit.name);
    if (index > -1) {
        appSettings.creationDevices[index] = { name: updatedName, icon: updatedIcon };
        saveAppSettings();
        applyAppSettings();
        showMessageModal('Sucesso!', `Dispositivo "${selectedDeviceForEdit.name}" editado para "${updatedName}".`);

        accountsData.forEach(account => {
            if (account.creationDevice === selectedDeviceForEdit.name) {
                account.creationDevice = updatedName;
            }
        });
        saveAccountsToLocalStorage();
        applyFilters(); // Atualiza a exibição se houver ícones ou texto de dispositivo

        deviceNameInput.value = '';
        deviceIconInput.value = '';
        selectedDeviceForEdit = null;
    }
}

async function handleRemoveAllDevices() {
    const confirmed = await showConfirmationModal('Remover Todos os Dispositivos de Criação', 'Tem certeza de que deseja remover TODAS os dispositivos de criação personalizados? Contas que os utilizam ficarão sem um dispositivo selecionado.');
    if (!confirmed) {
        return;
    }

    showLoading();
    try {
        appSettings.creationDevices = [];
        saveAppSettings();
        applyAppSettings();
        showMessageModal('Sucesso!', 'Todos os dispositivos de criação personalizados foram removidos.');
    } catch (e) {
        console.error("Erro ao remover todos os dispositivos de criação: ", e);
        showMessageModal('Erro', 'Não foi possível remover todos os dispositivos de criação. Detalhes: ' + e.message);
    } finally {
        hideLoading();
    }
}


// --- Funções de Renderização de Cards e Detalhes ---

function getStatusClass(status) {
    switch (status) {
        case 'RECÉM-CRIADA': return 'status-new';
        case 'EM OBSERVAÇÃO': return 'status-observing';
        case 'PROBLEMÁTICA': return 'status-problematic';
        case 'EM CRESCIMENTO': return 'status-growing';
        case 'CONTA BUGADA': return 'status-bugged';
        case 'CONTA RESTRITA': return 'status-restricted';
        case 'CONTA ESFRIOU': return 'status-cooled';
        case 'EM AQUECIMENTO': return 'status-heating';
        case 'ATIVA/SAUDÁVEL': return 'status-active';
        case 'PAUSA TEMPORÁRIA': return 'status-paused';
        case 'BATEU OS REQUISITOS': return 'status-archived'; // Mapeia para a classe visual 'archived'
        case 'TIKTOK SHOP ATIVO': return 'status-verified'; // Mapeia para a classe visual 'verified'
        default: return 'status-default';
    }
}

function renderStars(rating) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        starsHtml += `<i class="${i <= rating ? 'fas' : 'far'} fa-star star-display"></i>`;
    }
    return starsHtml;
}

function renderAccountCard(account) {
    const statusClass = getStatusClass(account.status);
    const statusText = account.status;
    const statusDescription = STATUS_DESCRIPTIONS[account.status] || STATUS_DESCRIPTIONS['DEFAULT'];
    const starsHtml = renderStars(account.rating);

    // Obter ícone da plataforma de criação
    const creationPlatformObj = appSettings.creationPlatforms.find(p => p.name === account.creationPlatform);
    const creationPlatformIcon = creationPlatformObj ? `<i class="${creationPlatformObj.icon}"></i>` : '';
    const creationPlatformDisplayName = account.creationPlatform ? `${creationPlatformIcon} ${account.creationPlatform}` : 'N/A';

    // Obter ícone do dispositivo de criação
    const creationDeviceObj = appSettings.creationDevices.find(d => d.name === account.creationDevice);
    const creationDeviceIcon = creationDeviceObj ? `<i class="${creationDeviceObj.icon}"></i>` : '';
    const creationDeviceDisplayName = account.creationDevice ? `${creationDeviceIcon} ${account.creationDevice}` : 'N/A';

    // A plataforma principal agora será apenas o valor salvo, sem a lista customizável
    const mainPlatformDisplayName = account.platform || 'N/A';

    return `
        <div class="account-card glass-effect" data-id="${account.id}">
            <div class="item-thumbnail-img">
                <i class="fas fa-user-circle"></i>
            </div>
            <h3 class="item-title">${account.name}</h3>
            <p class="item-url-short">${account.email}</p>
            <p class="item-added-date">País: ${account.country}</p>
            <p class="item-meta">Plataforma: ${mainPlatformDisplayName}</p>
            <p class="item-meta">Plat. Criação: ${creationPlatformDisplayName}</p>
            <p class="item-meta">Dispositivo: ${creationDeviceDisplayName}</p>
            <div class="status-and-rating">
                <span class="status-badge ${statusClass}"
                    data-status-description="${statusDescription}"
                    onmouseover="showStatusPopup(event)"
                    onmouseout="hideStatusPopup()"
                    onclick="showStatusPopup(event, true)">${statusText}</span>
                <div class="account-card-stars">
                    ${starsHtml}
                </div>
            </div>
            <div class="item-actions-bottom">
                <button class="app-button secondary-button view-details-btn" data-id="${account.id}">
                    <i class="fas fa-eye"></i> Detalhes
                </button>
                <button class="app-button primary-button edit-account-btn" data-id="${account.id}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="app-button delete-button delete-account-btn" data-id="${account.id}">
                    <i class="fas fa-trash-alt"></i> Excluir
                </button>
            </div>
        </div>
    `;
}

function renderAccounts(accounts) {
    accountsGrid.innerHTML = '';
    if (accounts.length === 0) {
        noAccountsMessage.classList.remove('hidden');
    } else {
        noAccountsMessage.classList.add('hidden');
        accounts.forEach(account => {
            accountsGrid.innerHTML += renderAccountCard(account);
        });
    }
    addAccountCardListeners();
}

function updateCountryFilterOptions() {
    countryFilter.innerHTML = '<option value="">Todos os Países</option>';

    const countryCounts = {};
    accountsData.forEach(account => {
        const country = account.country;
        countryCounts[country] = (countryCounts[country] || 0) + 1;
    });

    Array.from(allCountries).sort().forEach(country => {
        const count = countryCounts[country] || 0;
        const option = document.createElement('option');
        option.value = country;
        option.textContent = `${country} (${count})`;
        countryFilter.appendChild(option);
    });
}

function updateStatusFilterOptions() {
    const currentSelectedValue = statusFilter.value;

    statusFilter.innerHTML = '<option value="">Todos os Status</option>';

    const statusCounts = {};
    accountsData.forEach(account => {
        const status = account.status;
        statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    ALL_POSSIBLE_STATUSES.forEach(status => {
        const count = statusCounts[status] || 0;
        const option = document.createElement('option');
        option.value = status;
        option.textContent = `${status} (${count})`;
        statusFilter.appendChild(option);
    });

    statusFilter.value = currentSelectedValue;
}

function addAccountCardListeners() {
    document.querySelectorAll('.edit-account-btn').forEach(button => {
        button.onclick = (e) => openAccountModalForEdit(e.target.dataset.id);
    });
    document.querySelectorAll('.delete-account-btn').forEach(button => {
        button.onclick = (e) => handleDeleteAccount(e.target.dataset.id);
    });
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.onclick = (e) => showAccountDetails(e.target.dataset.id);
    });
}

function updateDashboard() {
    const total = accountsData.length;
    totalAccountsCount.textContent = total;

    heatingAccountsCount.textContent = accountsData.filter(acc => acc.status === 'EM AQUECIMENTO').length;
    newAccountsCount.textContent = accountsData.filter(acc => acc.status === 'RECÉM-CRIADA').length;
    observingAccountsCount.textContent = accountsData.filter(acc => acc.status === 'EM OBSERVAÇÃO').length;
    growingAccountsCount.textContent = accountsData.filter(acc => acc.status === 'EM CRESCIMENTO').length;
    buggedAccountsCount.textContent = accountsData.filter(acc => acc.status === 'CONTA BUGADA').length;
    restrictedAccountsCount.textContent = accountsData.filter(acc => acc.status === 'CONTA RESTRITA').length;
    cooledAccountsCount.textContent = accountsData.filter(acc => acc.status === 'CONTA ESFRIOU').length;
    problematicAccountsCount.textContent = accountsData.filter(acc => acc.status === 'PROBLEMÁTICA').length;
    activeHealthyAccountsCount.textContent = accountsData.filter(acc => acc.status === 'ATIVA/SAUDÁVEL').length;
    pausedAccountsCount.textContent = accountsData.filter(acc => acc.status === 'PAUSA TEMPORÁRIA').length;
    
    archivedAccountsCount.textContent = accountsData.filter(acc => acc.status === 'BATEU OS REQUISITOS').length;
    verifiedAccountsCount.textContent = accountsData.filter(acc => acc.status === 'TIKTOK SHOP ATIVO').length;


    // Contagem por Plataforma de Criação
    const accountsByCreationPlatform = accountsData.reduce((acc, account) => {
        const platformName = account.creationPlatform || 'Não Definido';
        acc[platformName] = (acc[platformName] || 0) + 1;
        return acc;
    }, {});

    // Contagem por Dispositivo de Criação
    const accountsByCreationDevice = accountsData.reduce((acc, account) => {
        const deviceName = account.creationDevice || 'Não Definido';
        acc[deviceName] = (acc[deviceName] || 0) + 1;
        return acc;
    }, {});

    // Limpa o conteúdo dos cards específicos
    accountsByCreationPlatformList.innerHTML = '';
    accountsByCreationDeviceList.innerHTML = '';

    // Preenche o card de Plataforma de Criação
    if (Object.keys(accountsByCreationPlatform).length === 0) {
        accountsByCreationPlatformList.innerHTML = `<li>Nenhum dado de plataforma de criação disponível.</li>`;
    } else {
        Object.entries(accountsByCreationPlatform).sort((a, b) => b[1] - a[1]).forEach(([platform, count]) => {
            const platformObj = appSettings.creationPlatforms.find(p => p.name === platform);
            const iconHtml = platformObj ? `<i class="${platformObj.icon}"></i>` : `<i class="fas fa-question-circle"></i>`;
            accountsByCreationPlatformList.innerHTML += `
                <li>
                    <div class="item-info-row">
                        <span class="item-thumbnail">${iconHtml}</span>
                        <span>${platform}</span>
                    </div>
                    <span>${count}</span>
                </li>
            `;
        });
    }

    // Preenche o card de Dispositivo de Criação
    if (Object.keys(accountsByCreationDevice).length === 0) {
        accountsByCreationDeviceList.innerHTML = `<li>Nenhum dado de dispositivo de criação disponível.</li>`;
    } else {
        Object.entries(accountsByCreationDevice).sort((a, b) => b[1] - a[1]).forEach(([device, count]) => {
            const deviceObj = appSettings.creationDevices.find(d => d.name === device);
            const iconHtml = deviceObj ? `<i class="${deviceObj.icon}"></i>` : `<i class="fas fa-question-circle"></i>`;
            accountsByCreationDeviceList.innerHTML += `
                <li>
                    <div class="item-info-row">
                        <span class="item-thumbnail">${iconHtml}</span>
                        <span>${device}</span>
                    </div>
                    <span>${count}</span>
                </li>
            `;
        });
    }
}

function showAccountDetails(id) {
    const account = accountsData.find(acc => acc.id === id);
    if (!account) {
        showMessageModal('Erro', 'Conta não encontrada.');
        return;
    }

    const statusClass = getStatusClass(account.status);
    const statusDescription = STATUS_DESCRIPTIONS[account.status] || STATUS_DESCRIPTIONS['DEFAULT'];
    const starsHtml = renderStars(account.rating);

    const creationPlatformObj = appSettings.creationPlatforms.find(p => p.name === account.creationPlatform);
    const creationPlatformIcon = creationPlatformObj ? `<i class="${creationPlatformObj.icon}"></i>` : '';
    const creationPlatformDisplayName = account.creationPlatform ? `${creationPlatformIcon} ${account.creationPlatform}` : 'N/A';

    const creationDeviceObj = appSettings.creationDevices.find(d => d.name === account.creationDevice);
    const creationDeviceIcon = creationDeviceObj ? `<i class="${creationDeviceObj.icon}"></i>` : '';
    const creationDeviceDisplayName = account.creationDevice ? `${creationDeviceIcon} ${account.creationDevice}` : 'N/A';

    const mainPlatformDisplayName = account.platform || 'N/A';

    const whatsappMessageBasic = `*Dados da Conta:*\n\n` +
                                 `*Nome:* ${account.name}\n` +
                                 `*Email:* ${account.email}\n` +
                                 `*Senha:* ${account.password}\n\n` +
                                 `_Gerenciado pelo TikTok Shop Account Manager_`;

    const whatsappMessageDetailed = `*Detalhes da Conta TikTok Shop:*\n\n` +
                                    `*Nome:* ${account.name}\n` +
                                    `*Plataforma:* ${mainPlatformDisplayName}\n` +
                                    `*Plataforma de Criação:* ${account.creationPlatform || 'N/A'}\n` +
                                    `*Dispositivo de Criação:* ${account.creationDevice || 'N/A'}\n` +
                                    `*Email:* ${account.email}\n` +
                                    `*Senha:* ${account.password}\n` +
                                    `*País:* ${account.country}\n` +
                                    `*Status:* ${account.status} (${statusDescription})\n` +
                                    `*Avaliação:* ${account.rating} estrelas\n` +
                                    `*Notas:* ${account.notes || 'N/A'}\n\n` +
                                    `_Gerenciado pelo TikTok Shop Account Manager_`;

    showMessageModal(
        `Detalhes da Conta: ${account.name}`,
        `
        <p><strong>Nome:</strong> ${account.name}</p>
        <p><strong>Plataforma:</strong> ${mainPlatformDisplayName}</p>
        <p><strong>Plataforma de Criação:</strong> ${creationPlatformDisplayName}</p>
        <p><strong>Dispositivo de Criação:</strong> ${creationDeviceDisplayName}</p>
        <p><strong>Email:</strong> ${account.email}</p>
        <p><strong>Senha:</strong> ${account.password}</p>
        <p><strong>País:</strong> ${account.country}</p>
        <p>
            <strong>Status:</strong>
            <span class="status-badge ${statusClass}"
                  title="${statusDescription}"
                  data-status-description="${statusDescription}">${account.status}</span>
        </p>
        <p><strong>Avaliação:</strong> <div class="account-card-stars">${starsHtml}</div></p>
        <p><strong>Notas:</strong> ${account.notes || 'N/A'}</p>
        <p style="margin-top: var(--spacing-md);">
            <button class="app-button secondary-button" onclick="copyToClipboard('${account.email}')">Copiar Email</button>
            <button class="app-button secondary-button" onclick="copyToClipboard('${account.password}')">Copiar Senha</button>
        </p>
        <div class="modal-actions" style="margin-top: var(--spacing-md);">
            <button class="app-button primary-button" onclick="sendWhatsAppMessage('${appSettings.whatsappNumber}', \`${whatsappMessageBasic}\`)">
                <i class="fab fa-whatsapp"></i> Enviar Conta
            </button>
            <button class="app-button secondary-button" onclick="sendWhatsAppMessage('${appSettings.whatsappNumber}', \`${whatsappMessageDetailed}\`)">
                <i class="fab fa-whatsapp"></i> Enviar Detalhado
            </button>
        </div>
        `
    );
}

// --- Funções do Modal de Adicionar/Editar Conta ---

function updateStarDisplay(rating) {
    const stars = accountRatingInput.querySelectorAll('.star-rating i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
    currentRating = rating;
}

function handleStarClick(event) {
    const clickedStarValue = parseInt(event.target.dataset.value);
    updateStarDisplay(clickedStarValue);
}

function handleStarHover(event) {
    const hoverStarValue = parseInt(event.target.dataset.value);
    const stars = accountRatingInput.querySelectorAll('.star-rating i');
    stars.forEach((star, index) => {
        if (index < hoverStarValue) {
            star.classList.add('fas');
            star.classList.remove('far');
        } else {
            star.classList.add('far');
            star.classList.remove('fas');
        }
    });
}

function handleStarMouseOut() {
    updateStarDisplay(currentRating);
}

function openAccountModalForAdd() {
    accountForm.reset();
    accountIdInput.value = '';
    accountModalTitle.textContent = 'Adicionar Nova Conta';
    accountStatusInput.value = 'RECÉM-CRIADA';
    updateStarDisplay(0);
    
    populateCreationPlatformDropdown();
    populateDeviceDropdown();
    accountModal.classList.remove('hidden');

    accountRatingInput.addEventListener('click', handleStarClick);
    accountRatingInput.addEventListener('mouseover', handleStarHover);
    accountRatingInput.addEventListener('mouseout', handleStarMouseOut);
}

function openAccountModalForEdit(id) {
    const account = accountsData.find(acc => acc.id === id);
    if (!account) {
        showMessageModal('Erro', 'Conta não encontrada para edição.');
        return;
    }
    accountIdInput.value = account.id;
    accountNameInput.value = account.name;
    
    accountCreationPlatformInput.value = account.creationPlatform || '';
    accountCreationDeviceInput.value = account.creationDevice || '';
    accountEmailInput.value = account.email;
    accountPasswordInput.value = account.password;
    accountCountryInput.value = account.country;
    accountStatusInput.value = account.status;
    accountNotesInput.value = account.notes;
    updateStarDisplay(account.rating || 0);
    populateCreationPlatformDropdown(account.creationPlatform);
    populateDeviceDropdown(account.creationDevice);
    accountModalTitle.textContent = 'Editar Conta';
    accountModal.classList.remove('hidden');

    accountRatingInput.addEventListener('click', handleStarClick);
    accountRatingInput.addEventListener('mouseover', handleStarHover);
    accountRatingInput.addEventListener('mouseout', handleStarMouseOut);
}

function closeAccountModal() {
    accountModal.classList.add('hidden');
    accountForm.reset();
    accountRatingInput.removeEventListener('click', handleStarClick);
    accountRatingInput.removeEventListener('mouseover', handleStarHover);
    accountRatingInput.removeEventListener('mouseout', handleStarMouseOut);
}

async function handleAccountFormSubmit(event) {
    event.preventDefault();
    showLoading();

    const account = {
        name: accountNameInput.value,
        platform: 'TikTok Shop', // Definido como fixo
        creationPlatform: accountCreationPlatformInput.value,
        creationDevice: accountCreationDeviceInput.value,
        email: accountEmailInput.value,
        password: accountPasswordInput.value,
        country: accountCountryInput.value,
        status: accountStatusInput.value,
        rating: currentRating,
        notes: accountNotesInput.value || ''
    };

    try {
        if (accountIdInput.value) {
            const index = accountsData.findIndex(acc => acc.id === accountIdInput.value);
            if (index !== -1) {
                accountsData[index] = { ...accountsData[index], ...account };
            }
            showMessageModal('Sucesso!', 'Conta atualizada com sucesso!');
        } else {
            account.id = Date.now().toString();
            accountsData.push(account);
            showMessageModal('Sucesso!', 'Conta adicionada com sucesso!');
        }
        saveAccountsToLocalStorage();
        allCountries.add(account.country);
        updateCountryFilterOptions();
        updateStatusFilterOptions();
        applyFilters();
        closeAccountModal();
    } catch (e) {
        console.error("Erro ao salvar conta: ", e);
        showMessageModal('Erro', 'Não foi possível salvar a conta. Tente novamente. Detalhes: ' + e.message);
    } finally {
        hideLoading();
    }
}

async function handleDeleteAccount(id) {
    const confirmed = await showConfirmationModal('Confirmar Exclusão', 'Tem certeza de que deseja excluir esta conta? Esta ação é irreversível.');
    if (!confirmed) {
        return;
    }

    showLoading();
    try {
        accountsData = accountsData.filter(acc => acc.id !== id);
        saveAccountsToLocalStorage();
        allCountries = new Set(accountsData.map(acc => acc.country));
        updateCountryFilterOptions();
        updateStatusFilterOptions();
        applyFilters();
        showMessageModal('Sucesso!', 'Conta excluída com sucesso!');
    } catch (e) {
        console.error("Erro ao excluir conta: ", e);
        showMessageModal('Erro', 'Não foi possível excluir a conta. Tente novamente. Detalhes: ' + e.message);
    } finally {
        hideLoading();
    }
}

async function handleDeleteAllAccounts() {
    const confirmed = await showConfirmationModal('Confirmar Exclusão Massiva', 'Tem certeza de que deseja EXCLUIR TODAS as suas contas? Esta ação é irreversível e apagará todos os seus dados de conta.');
    if (!confirmed) {
        return;
    }

    showLoading();
    try {
        accountsData = [];
        saveAccountsToLocalStorage();
        allCountries.clear();
        updateCountryFilterOptions();
        updateStatusFilterOptions();
        applyFilters();
        showMessageModal('Sucesso!', 'Todas as contas foram excluídas com sucesso!');
    } catch (e) {
        console.error("Erro ao excluir todas as contas: ", e);
        showMessageModal('Erro', 'Não foi possível excluir todas as contas. Tente novamente. Detalhes: ' + e.message);
    } finally {
        hideLoading();
    }
}


// --- Funções de Importação/Exportação ---

function handleExportAccounts() {
    if (accountsData.length === 0 && appSettings.creationPlatforms.length === 0 && appSettings.creationDevices.length === 0 && !appSettings.whatsappNumber) {
        showMessageModal('Nada para Exportar', 'Não há dados (contas, plataformas de criação, dispositivos, número de WhatsApp) salvos para exportar.');
        return;
    }
    const exportData = {
        accounts: accountsData,
        settings: appSettings,
        statusDescriptions: STATUS_DESCRIPTIONS
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tiktok_shop_manager_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showMessageModal('Sucesso!', 'Dados exportados para tiktok_shop_manager_data.json');
}

async function handleImportAccounts() {
    const file = importFileInput.files[0];
    if (!file) {
        showMessageModal('Erro de Importação', 'Por favor, selecione um arquivo JSON para importar.');
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            importedFileContent = JSON.parse(e.target.result);
            if (typeof importedFileContent !== 'object' || importedFileContent === null) {
                throw new Error('O arquivo JSON não contém um objeto válido.');
            }
            showImportOptionsModal();
        } catch (error) {
            console.error("Erro ao ler ou parsear arquivo JSON: ", error);
            showMessageModal('Erro de Importação', `Falha ao ler o arquivo: ${error.message}`);
            importFileInput.value = ''; // Limpa o input do arquivo
        }
    };
    reader.readAsText(file);
}

function showImportOptionsModal() {
    importOptionsModal.classList.remove('hidden');
}

function hideImportOptionsModal() {
    importOptionsModal.classList.add('hidden');
    importedFileContent = null; // Limpa o conteúdo do arquivo após fechar o modal
    importFileInput.value = ''; // Limpa o input do arquivo
}

async function handleSelectedImportOptions() {
    showLoading();

    try {
        const importAccounts = importAccountsCheckbox.checked;
        const importSettings = importSettingsCheckbox.checked;
        const importCreationPlatforms = importCreationPlatformsCheckbox.checked;
        const importDevices = importDevicesCheckbox.checked;

        let importedCount = 0;

        if (importAccounts && importedFileContent.accounts) {
            const newAccounts = importedFileContent.accounts;
            if (!Array.isArray(newAccounts)) {
                throw new Error('Dados de contas no arquivo não são um array válido.');
            }
            newAccounts.forEach(newAccount => {
                if (typeof newAccount.id !== 'string') newAccount.id = String(newAccount.id);
                if (typeof newAccount.rating === 'undefined' || newAccount.rating === null) newAccount.rating = 0;
                if (typeof newAccount.platform === 'undefined') newAccount.platform = 'TikTok Shop';
                if (typeof newAccount.creationPlatform === 'undefined') newAccount.creationPlatform = '';
                if (typeof newAccount.creationDevice === 'undefined') newAccount.creationDevice = '';

                const existingIndex = accountsData.findIndex(acc => acc.id === newAccount.id);
                if (existingIndex !== -1) {
                    accountsData[existingIndex] = { ...accountsData[existingIndex], ...newAccount };
                } else {
                    if (!newAccount.id) newAccount.id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
                    accountsData.push(newAccount);
                }
                allCountries.add(newAccount.country);
            });
            importedCount += newAccounts.length;
            saveAccountsToLocalStorage();
            updateCountryFilterOptions();
            updateStatusFilterOptions();
        }

        if (importSettings && importedFileContent.settings) {
            if (importedFileContent.settings.whatsappNumber !== undefined) {
                appSettings.whatsappNumber = importedFileContent.settings.whatsappNumber;
            }
            appSettings.customPlatforms = [];

            saveAppSettings();
            applyAppSettings();
            importedCount++;
        }

        if (importCreationPlatforms && importedFileContent.settings && Array.isArray(importedFileContent.settings.creationPlatforms)) {
            const newCreationPlatforms = importedFileContent.settings.creationPlatforms;
            const mergedCreationPlatformsMap = new Map();
            appSettings.creationPlatforms.forEach(p => mergedCreationPlatformsMap.set(p.name, p));
            newCreationPlatforms.forEach(p => mergedCreationPlatformsMap.set(p.name, p));
            appSettings.creationPlatforms = Array.from(mergedCreationPlatformsMap.values());
            appSettings.creationPlatforms.sort((a, b) => a.name.localeCompare(b.name));
            saveAppSettings();
            applyAppSettings();
            importedCount++;
        }

        if (importDevices && importedFileContent.settings && Array.isArray(importedFileContent.settings.creationDevices)) {
            const newDevices = importedFileContent.settings.creationDevices;
            const mergedDevicesMap = new Map();
            appSettings.creationDevices.forEach(d => mergedDevicesMap.set(d.name, d));
            newDevices.forEach(d => mergedDevicesMap.set(d.name, d));
            appSettings.creationDevices = Array.from(mergedDevicesMap.values());
            appSettings.creationDevices.sort((a, b) => a.name.localeCompare(b.name));
            saveAppSettings();
            applyAppSettings();
            importedCount++;
        }

        applyFilters();
        showMessageModal('Sucesso!', `Importação concluída. ${importedCount} tipos de dados processados.`);

    } catch (error) {
        console.error("Erro durante o processo de importação: ", error);
        showMessageModal('Erro de Importação', `Falha ao importar dados: ${error.message}`);
    } finally {
        hideLoading();
        hideImportOptionsModal();
    }
}


// --- Funções de Filtragem e Pesquisa ---

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCountry = countryFilter.value;
    const selectedStatus = statusFilter.value;

    const filteredAccounts = accountsData.filter(account => {
        const matchesSearch = (
            account.name.toLowerCase().includes(searchTerm) ||
            account.email.toLowerCase().includes(searchTerm) ||
            account.country.toLowerCase().includes(searchTerm) ||
            (account.platform && account.platform.toLowerCase().includes(searchTerm)) ||
            (account.creationPlatform && account.creationPlatform.toLowerCase().includes(searchTerm)) ||
            (account.creationDevice && account.creationDevice.toLowerCase().includes(searchTerm)) ||
            (account.notes && account.notes.toLowerCase().includes(searchTerm))
        );
        const matchesCountry = selectedCountry === '' || account.country === selectedCountry;
        const matchesStatus = selectedStatus === '' || account.status === selectedStatus;

        return matchesSearch && matchesCountry && matchesStatus;
    });

    renderAccounts(filteredAccounts);
    updateDashboard();
}

// --- Funções do Pop-up de Status ---

function showStatusPopup(event, persist = false) {
    clearTimeout(statusPopupTimeout);

    const existingPopup = document.querySelector('.status-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    const targetElement = event.currentTarget;
    const description = targetElement.dataset.statusDescription;

    if (!description) return;

    const popup = document.createElement('div');
    popup.className = 'status-popup';
    popup.textContent = description;
    document.body.appendChild(popup);

    const rect = targetElement.getBoundingClientRect();

    let popupLeft = rect.left + (rect.width / 2) - (popup.offsetWidth / 2);
    let popupTop = rect.bottom + 10;

    if (popupLeft < 0) {
        popupLeft = 10;
    }
    if (popupLeft + popup.offsetWidth > window.innerWidth) {
        popupLeft = window.innerWidth - popup.offsetWidth - 10;
    }

    if (popupTop + popup.offsetHeight > window.innerHeight) {
        popupTop = rect.top - popup.offsetHeight - 10;
        if (popupTop < 0) {
            popupTop = 10;
        }
    }

    popup.style.left = `${popupLeft}px`;
    popup.style.top = `${popupTop}px`;

    popup.classList.add('visible');

    if (!persist) {
        statusPopupTimeout = setTimeout(() => {
            hideStatusPopup();
        }, 3000);
    }
}

function hideStatusPopup() {
    clearTimeout(statusPopupTimeout);
    const popup = document.querySelector('.status-popup');
    if (popup) {
        popup.classList.remove('visible');
        popup.addEventListener('transitionend', () => {
            if (!popup.classList.contains('visible')) {
                popup.remove();
            }
        }, { once: true });
    }
}

window.showStatusPopup = showStatusPopup;
window.hideStatusPopup = hideStatusPopup;


// --- Funções do Seletor de Ícones ---

function openIconPicker(targetInputId) {
    currentIconTargetInput = document.getElementById(targetInputId);
    if (!currentIconTargetInput) {
        console.error("Input de destino não encontrado para o seletor de ícones:", targetInputId);
        return;
    }
    iconPickerModal.classList.remove('hidden');
    iconSearchInput.value = ''; // Limpa a pesquisa anterior
    renderIconGrid(FONT_AWESOME_ICONS); // Renderiza todos os ícones no início
    selectedIconClass = null; // Reseta a seleção
}

function renderIconGrid(iconsToRender) {
    iconGrid.innerHTML = '';
    if (iconsToRender.length === 0) {
        iconGrid.innerHTML = '<p style="text-align: center; color: var(--color-text-dark);">Nenhum ícone encontrado.</p>';
        return;
    }
    iconsToRender.forEach(icon => {
        const iconItem = document.createElement('div');
        iconItem.className = 'icon-item';
        iconItem.dataset.iconClass = icon.class;
        iconItem.innerHTML = `<i class="${icon.class}"></i><span>${icon.name}</span>`;
        iconItem.addEventListener('click', () => {
            document.querySelectorAll('.icon-item').forEach(item => item.classList.remove('selected'));
            iconItem.classList.add('selected');
            selectedIconClass = icon.class;
        });
        iconGrid.appendChild(iconItem);
    });
}

function filterIcons() {
    const searchTerm = iconSearchInput.value.toLowerCase();
    const filtered = FONT_AWESOME_ICONS.filter(icon => 
        icon.name.toLowerCase().includes(searchTerm) || 
        icon.class.toLowerCase().includes(searchTerm)
    );
    renderIconGrid(filtered);
}

function selectChosenIcon() {
    if (currentIconTargetInput && selectedIconClass) {
        currentIconTargetInput.value = selectedIconClass;
    }
    hideIconPickerModal();
}

function hideIconPickerModal() {
    iconPickerModal.classList.add('hidden');
    currentIconTargetInput = null;
    selectedIconClass = null;
    iconSearchInput.value = '';
    iconGrid.innerHTML = ''; // Limpa a grade ao fechar
}

// --- Inicialização da Aplicação ---

document.addEventListener('DOMContentLoaded', () => {
    // Obtenção de referências aos elementos do DOM
    toggleThemeBtn = document.getElementById('toggleThemeBtn');
    addAccountBtn = document.getElementById('addAccountBtn');
    importAccountsBtn = document.getElementById('importAccountsBtn');
    exportAccountsBtn = document.getElementById('exportAccountsBtn');
    deleteAllAccountsBtn = document.getElementById('deleteAllAccountsBtn');
    confirmImportBtn = document.getElementById('confirmImportBtn');
    importFileInput = document.getElementById('importFile');

    accountModal = document.getElementById('accountModal');
    accountModalTitle = document.getElementById('accountModalTitle');
    closeAccountModalBtn = document.getElementById('closeAccountModalBtn');
    cancelAccountBtn = document.getElementById('cancelAccountBtn');
    accountForm = document.getElementById('accountForm');
    accountIdInput = document.getElementById('accountId');
    accountNameInput = document.getElementById('accountName');
    accountCreationPlatformInput = document.getElementById('accountCreationPlatform');
    accountCreationDeviceInput = document.getElementById('accountCreationDevice');
    accountEmailInput = document.getElementById('accountEmail');
    accountPasswordInput = document.getElementById('accountPassword');
    accountCountryInput = document.getElementById('accountCountry');
    accountStatusInput = document.getElementById('accountStatus');
    accountNotesInput = document.getElementById('accountNotes');
    accountRatingInput = document.getElementById('accountRating');

    whatsappNumberInput = document.getElementById('whatsappNumberInput');
    saveWhatsappNumberBtn = document.getElementById('saveWhatsappNumberBtn');
    clearWhatsappNumberBtn = document.getElementById('clearWhatsappNumberBtn');

    creationPlatformNameInput = document.getElementById('creationPlatformNameInput');
    creationPlatformIconInput = document.getElementById('creationPlatformIconInput');
    addCreationPlatformBtn = document.getElementById('addCreationPlatformBtn');
    editCreationPlatformBtn = document.getElementById('editCreationPlatformBtn');
    removeCreationPlatformBtn = document.getElementById('removeCreationPlatformBtn');
    creationPlatformList = document.getElementById('creationPlatformList');
    removeAllCreationPlatformsBtn = document.getElementById('removeAllCreationPlatformsBtn');

    deviceNameInput = document.getElementById('deviceNameInput');
    deviceIconInput = document.getElementById('deviceIconInput');
    addDeviceBtn = document.getElementById('addDeviceBtn');
    editDeviceBtn = document.getElementById('editDeviceBtn');
    removeDeviceBtn = document.getElementById('removeDeviceBtn');
    deviceList = document.getElementById('deviceList');
    removeAllDevicesBtn = document.getElementById('removeAllDevicesBtn');

    confirmationModal = document.getElementById('confirmationModal');
    confirmationModalTitle = document.getElementById('confirmationModalTitle');
    confirmationModalMessage = document.getElementById('confirmationModalMessage');
    confirmActionBtn = document.getElementById('confirmActionBtn');
    cancelActionBtn = document.getElementById('cancelActionBtn');

    messageModal = document.getElementById('messageModal');
    messageModalTitle = document.getElementById('messageModalTitle');
    messageModalContent = document.getElementById('messageModalContent');
    closeMessageModalBtn = document.getElementById('closeMessageModalBtn');
    okMessageModalBtn = document.getElementById('okMessageModalBtn');

    accountsGrid = document.getElementById('accountsGrid');
    noAccountsMessage = document.getElementById('noAccountsMessage');
    searchInput = document.getElementById('searchInput');
    clearSearchBtn = document.getElementById('clearSearchBtn');
    countryFilter = document.getElementById('countryFilter');
    statusFilter = document.getElementById('statusFilter');

    totalAccountsCount = document.getElementById('totalAccountsCount');
    heatingAccountsCount = document.getElementById('heatingAccountsCount');
    newAccountsCount = document.getElementById('newAccountsCount');
    observingAccountsCount = document.getElementById('observingAccountsCount');
    growingAccountsCount = document.getElementById('growingAccountsCount');
    buggedAccountsCount = document.getElementById('buggedAccountsCount');
    restrictedAccountsCount = document.getElementById('restrictedAccountsCount');
    cooledAccountsCount = document.getElementById('cooledAccountsCount');
    problematicAccountsCount = document.getElementById('problematicAccountsCount');
    activeHealthyAccountsCount = document.getElementById('activeHealthyAccountsCount');
    pausedAccountsCount = document.getElementById('pausedAccountsCount');
    
    archivedAccountsCount = document.getElementById('archivedAccountsCount'); // Este terá o texto para 'Bateu os Requisitos'
    verifiedAccountsCount = document.getElementById('verifiedAccountsCount'); // Este terá o texto para 'TikTok Shop Ativo'

    // NOVOS IDs para as listas separadas no dashboard
    accountsByCreationPlatformList = document.getElementById('accountsByCreationPlatformList');
    accountsByCreationDeviceList = document.getElementById('accountsByCreationDeviceList');

    currentUserIdSpan = document.getElementById('currentUserId');
    loadingOverlay = document.getElementById('loadingOverlay');

    goToTopBtn = document.getElementById('go-to-top-btn');
    goToBottomBtn = document.getElementById('go-to-bottom-btn');

    // Novos elementos para o modal de opções de importação
    importOptionsModal = document.getElementById('importOptionsModal');
    closeImportOptionsModalBtn = document.getElementById('closeImportOptionsModalBtn');
    importAccountsCheckbox = document.getElementById('importAccountsCheckbox');
    importSettingsCheckbox = document.getElementById('importSettingsCheckbox');
    importCreationPlatformsCheckbox = document.getElementById('importCreationPlatformsCheckbox');
    importDevicesCheckbox = document.getElementById('importDevicesCheckbox');
    startImportProcessBtn = document.getElementById('startImportProcessBtn');
    cancelImportOptionsBtn = document.getElementById('cancelImportOptionsBtn');

    // Referências para o novo modal de seleção de ícones
    iconPickerModal = document.getElementById('iconPickerModal');
    closeIconPickerModalBtn = document.getElementById('closeIconPickerModalBtn');
    iconSearchInput = document.getElementById('iconSearchInput');
    iconGrid = document.getElementById('iconGrid');
    selectIconBtn = document.getElementById('selectIconBtn');
    cancelIconPickerBtn = document.getElementById('cancelIconPickerBtn');


    // Agora que todos os elementos estão referenciados, podemos chamar funções que os utilizam
    initializeApp();
});


async function initializeApp() {
    showLoading();
    applySavedTheme();

    currentUserIdSpan.textContent = 'TikTok Shop';

    loadAppSettings();
    applyAppSettings(); // Aplica as configurações iniciais (inclui número WhatsApp e plataformas)

    await loadAccountsFromJson(); // Carrega dados do accounts.json ou localStorage

    hideLoading(); // Garante que o loading seja escondido após o carregamento inicial

    goToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    goToBottomBtn.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    window.addEventListener('scroll', updateScrollButtonsVisibility);
    updateScrollButtonsVisibility();

    toggleThemeBtn.addEventListener('click', toggleTheme);
    addAccountBtn.addEventListener('click', openAccountModalForAdd);
    exportAccountsBtn.addEventListener('click', handleExportAccounts);
    deleteAllAccountsBtn.addEventListener('click', handleDeleteAllAccounts);

    closeAccountModalBtn.addEventListener('click', closeAccountModal);
    cancelAccountBtn.addEventListener('click', closeAccountModal);
    accountForm.addEventListener('submit', handleAccountFormSubmit);

    closeMessageModalBtn.addEventListener('click', hideMessageModal);
    okMessageModalBtn.addEventListener('click', hideMessageModal);

    searchInput.addEventListener('input', applyFilters);
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        applyFilters();
    });
    countryFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);

    // Listener para auto-ajuste do número do WhatsApp ao colar/digitar
    whatsappNumberInput.addEventListener('input', (event) => {
        event.target.value = formatPhoneNumber(event.target.value);
    });

    // Listeners para Configurações do WhatsApp
    saveWhatsappNumberBtn.addEventListener('click', () => {
        const number = whatsappNumberInput.value.trim();
        appSettings.whatsappNumber = formatPhoneNumber(number);
        saveAppSettings();
        showMessageModal('Sucesso!', `Número do WhatsApp salvo: ${appSettings.whatsappNumber || 'Nenhum'}`);
    });

    clearWhatsappNumberBtn.addEventListener('click', async () => {
        const confirmed = await showConfirmationModal('Limpar Número', 'Tem certeza que deseja limpar o número do WhatsApp salvo?');
        if (confirmed) {
            appSettings.whatsappNumber = '';
            saveAppSettings();
            whatsappNumberInput.value = '';
            showMessageModal('Sucesso!', 'Número do WhatsApp limpo.');
        }
    });

    importAccountsBtn.addEventListener('click', () => {
        document.querySelector('.tab-button[data-tab="settings"]').click();
        setTimeout(() => importFileInput.focus(), 100);
    });
    confirmImportBtn.addEventListener('click', handleImportAccounts); // Este botão agora abre o modal de opções

    // Listeners para o novo modal de opções de importação
    closeImportOptionsModalBtn.addEventListener('click', hideImportOptionsModal);
    cancelImportOptionsBtn.addEventListener('click', hideImportOptionsModal);
    startImportProcessBtn.addEventListener('click', handleSelectedImportOptions);

    // Listeners para Gerenciar Plataformas de Criação
    addCreationPlatformBtn.addEventListener('click', handleAddCreationPlatform);
    editCreationPlatformBtn.addEventListener('click', handleEditCreationPlatform);
    removeCreationPlatformBtn.addEventListener('click', handleRemoveCreationPlatformClick);
    removeAllCreationPlatformsBtn.addEventListener('click', handleRemoveAllCreationPlatforms);

    creationPlatformList.addEventListener('click', (e) => {
        const listItem = e.target.closest('li');
        if (listItem && !e.target.closest('button')) {
            document.querySelectorAll('#creationPlatformList li').forEach(item => item.classList.remove('selected'));
            listItem.classList.add('selected');
            creationPlatformNameInput.value = listItem.dataset.name;
            creationPlatformIconInput.value = listItem.dataset.icon;
            selectedCreationPlatformForEdit = { name: listItem.dataset.name, icon: listItem.dataset.icon };
        }
    });

    // Listeners para Gerenciar Dispositivos de Criação
    addDeviceBtn.addEventListener('click', handleAddDevice);
    editDeviceBtn.addEventListener('click', handleEditDevice);
    removeDeviceBtn.addEventListener('click', handleRemoveDeviceClick);
    removeAllDevicesBtn.addEventListener('click', handleRemoveAllDevices);

    deviceList.addEventListener('click', (e) => {
        const listItem = e.target.closest('li');
        if (listItem && !e.target.closest('button')) {
            document.querySelectorAll('#deviceList li').forEach(item => item.classList.remove('selected'));
            listItem.classList.add('selected');
            deviceNameInput.value = listItem.dataset.name;
            deviceIconInput.value = listItem.dataset.icon;
            selectedDeviceForEdit = { name: listItem.dataset.name, icon: listItem.dataset.icon };
        }
    });

    // LISTENERS PARA O NOVO SELETOR DE ÍCONES
    document.querySelectorAll('.icon-picker-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const targetInputId = e.target.closest('.icon-picker-btn').dataset.targetInput;
            openIconPicker(targetInputId);
        });
    });
    closeIconPickerModalBtn.addEventListener('click', hideIconPickerModal);
    cancelIconPickerBtn.addEventListener('click', hideIconPickerModal);
    iconSearchInput.addEventListener('input', filterIcons);
    selectIconBtn.addEventListener('click', selectChosenIcon);


    // Listeners para navegação por abas
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active', 'animate-fade-in'));
            const targetTab = document.getElementById(e.target.dataset.tab);
            if (targetTab) {
                targetTab.classList.add('active', 'animate-fade-in');
            }
        });
    });
}
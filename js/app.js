// ===========================
// APP INITIALIZATION
// ===========================
console.log('🚀 SituationTracker App v2.0 gestartet');

// App State
const App = {
    situations: [],
    categories: [],
    currentView: 'list',
    currentSituation: null,
    filters: {
        category: '',
        rating: '',
        dateRange: '',
        mood: '',
        customDateFrom: '',
        customDateTo: ''
    }
};

// ===========================
// LOCAL STORAGE MANAGEMENT
// ===========================
const Storage = {
    SITUATIONS_KEY: 'situationtracker_situations',
    CATEGORIES_KEY: 'situationtracker_categories',

    loadSituations() {
        try {
            const data = localStorage.getItem(this.SITUATIONS_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('❌ Fehler beim Laden der Situationen:', error);
            return [];
        }
    },

    saveSituations(situations) {
        try {
            localStorage.setItem(this.SITUATIONS_KEY, JSON.stringify(situations));
            console.log('✅ Situationen gespeichert:', situations.length);
            return true;
        } catch (error) {
            console.error('❌ Fehler beim Speichern:', error);
            showToast('Fehler beim Speichern der Daten', 'error');
            return false;
        }
    },

    loadCategories() {
        try {
            const data = localStorage.getItem(this.CATEGORIES_KEY);
            const categories = data ? JSON.parse(data) : [];
            
            if (categories.length === 0) {
                return this.getDefaultCategories();
            }
            return categories;
        } catch (error) {
            console.error('❌ Fehler beim Laden der Kategorien:', error);
            return this.getDefaultCategories();
        }
    },

    saveCategories(categories) {
        try {
            localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
            console.log('✅ Kategorien gespeichert:', categories.length);
            return true;
        } catch (error) {
            console.error('❌ Fehler beim Speichern:', error);
            return false;
        }
    },

    getDefaultCategories() {
        return [
            { id: generateId(), name: 'Sprachkenntnisse', color: '#6366f1' },
            { id: generateId(), name: 'Zeitmanagement', color: '#8b5cf6' },
            { id: generateId(), name: 'Kommunikation', color: '#10b981' },
            { id: generateId(), name: 'Vertrieb', color: '#f59e0b' },
            { id: generateId(), name: 'Technik', color: '#3b82f6' }
        ];
    }
};

// ===========================
// UTILITY FUNCTIONS
// ===========================
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}

function formatDateTime(dateString, timeString) {
    if (!timeString) return formatDate(dateString);
    return `${formatDate(dateString)} ${timeString}`;
}

function getStarRating(rating) {
    return '⭐'.repeat(rating);
}

function getMoodEmoji(mood) {
    const moods = {
        5: '😊',
        4: '🙂',
        3: '😐',
        2: '😟',
        1: '😞'
    };
    return moods[mood] || '😐';
}

function getMoodLabel(mood) {
    const labels = {
        5: 'Sehr gut',
        4: 'Gut',
        3: 'Neutral',
        2: 'Schlecht',
        1: 'Sehr schlecht'
    };
    return labels[mood] || 'Neutral';
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===========================
// DATE FILTER FUNCTIONS
// ===========================
function isInDateRange(dateString, range) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch(range) {
        case 'today':
            return date.toDateString() === today.toDateString();
        
        case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return date >= weekAgo && date <= today;
        
        case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return date >= monthAgo && date <= today;
        
        case 'year':
            const yearAgo = new Date(today);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            return date >= yearAgo && date <= today;
        
        case 'custom':
            if (!App.filters.customDateFrom || !App.filters.customDateTo) return true;
            const from = new Date(App.filters.customDateFrom);
            const to = new Date(App.filters.customDateTo);
            return date >= from && date <= to;
        
        default:
            return true;
    }
}

// ===========================
// NAVIGATION
// ===========================
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            switchView(view);
        });
    });
}

function switchView(viewName) {
    console.log('📱 Wechsle zu View:', viewName);
    
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    const targetView = document.getElementById(`${viewName}View`);
    if (targetView) {
        targetView.classList.add('active');
    }
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
    
    App.currentView = viewName;
    
    if (viewName === 'dashboard') {
        renderDashboard();
    } else if (viewName === 'categories') {
        renderCategoriesList();
    } else if (viewName === 'list') {
        renderSituationsList();
    }
}

// ===========================
// SITUATIONS CRUD
// ===========================
function renderSituationsList() {
    const container = document.getElementById('situationsList');
    const emptyState = document.getElementById('emptyState');
    
    let situations = App.situations.filter(s => {
        if (App.filters.category && !s.categories.includes(App.filters.category)) {
            return false;
        }
        if (App.filters.rating && s.rating !== parseInt(App.filters.rating)) {
            return false;
        }
        if (App.filters.mood && s.mood !== parseInt(App.filters.mood)) {
            return false;
        }
        if (App.filters.dateRange && !isInDateRange(s.date, App.filters.dateRange)) {
            return false;
        }
        return true;
    });
    
    situations.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (situations.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    container.innerHTML = situations.map(situation => {
        const categories = situation.categories
            .map(catId => {
                const cat = App.categories.find(c => c.id === catId);
                return cat ? `<span class="category-badge" style="background: ${cat.color}">${cat.name}</span>` : '';
            })
            .join('');
        
        const solved = situation.solved || 0;
        let solutionClass = 'not-solved';
        let solutionText = '⚠ Nicht gelöst';
        
        if (solved >= 100) {
            solutionClass = 'fully-solved';
            solutionText = '✓ Gelöst';
        } else if (solved > 0) {
            solutionClass = 'partially-solved';
            solutionText = `${solved}% gelöst`;
        }
        
        const mood = situation.mood || 3;
        const moodEmoji = getMoodEmoji(mood);
        
        return `
            <div class="situation-card" data-id="${situation.id}">
                <div class="mood-indicator">${moodEmoji}</div>
                <div class="situation-header">
                    <div>
                        <div class="situation-title">${situation.title}</div>
                        <div class="situation-date">${formatDateTime(situation.date, situation.time)}</div>
                    </div>
                    <div class="situation-rating">${getStarRating(situation.rating)}</div>
                </div>
                <div class="situation-problem">${situation.problem}</div>
                <div class="situation-footer">
                    <div class="situation-categories">${categories}</div>
                    <span class="solution-indicator ${solutionClass}">${solutionText}</span>
                </div>
            </div>
        `;
    }).join('');
    
    container.querySelectorAll('.situation-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            const situation = App.situations.find(s => s.id === id);
            if (situation) {
                showSituationDetails(situation);
            }
        });
    });
}

function showSituationDetails(situation) {
    App.currentSituation = situation;
    
    const modal = document.getElementById('viewModal');
    const title = document.getElementById('viewTitle');
    const content = document.getElementById('viewContent');
    
    const categories = situation.categories
        .map(catId => {
            const cat = App.categories.find(c => c.id === catId);
            return cat ? `<span class="category-badge" style="background: ${cat.color}">${cat.name}</span>` : '';
        })
        .join('');
    
    const mood = situation.mood || 3;
    const solved = situation.solved || 0;
    
    title.textContent = situation.title;
    content.innerHTML = `
        <div class="form-group">
            <label>Datum & Zeit</label>
            <p>${formatDateTime(situation.date, situation.time)}</p>
        </div>
        <div class="form-group">
            <label>Das Problem</label>
            <p style="white-space: pre-wrap;">${situation.problem}</p>
        </div>
        <div class="form-group">
            <label>Die Lösung</label>
            <p style="white-space: pre-wrap;">${situation.solution || '<em style="color: var(--text-secondary);">Keine Lösung erfasst</em>'}</p>
        </div>
        <div class="form-group">
            <label>Reflexion & Notizen</label>
            <p style="white-space: pre-wrap;">${situation.notes || '<em style="color: var(--text-secondary);">Keine Notizen</em>'}</p>
        </div>
        <div class="form-group">
            <label>Stimmung</label>
            <div style="font-size: 2rem;">${getMoodEmoji(mood)} ${getMoodLabel(mood)}</div>
        </div>
        <div class="form-group">
            <label>Lösungsgrad</label>
            <div style="font-size: 1.5rem; color: var(--primary); font-weight: 600;">${solved}%</div>
        </div>
        <div class="form-group">
            <label>Kategorien</label>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
                ${categories || '<em style="color: var(--text-secondary);">Keine Kategorien</em>'}
            </div>
        </div>
        <div class="form-group">
            <label>Bewertung</label>
            <div>${getStarRating(situation.rating)}</div>
        </div>
    `;
    
    modal.classList.add('active');
}

function openSituationModal(situation = null) {
    const modal = document.getElementById('situationModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('situationForm');
    
    form.reset();
    
    if (situation) {
        title.textContent = 'Situation bearbeiten';
        document.getElementById('situationId').value = situation.id;
        document.getElementById('situationTitle').value = situation.title;
        document.getElementById('situationProblem').value = situation.problem;
        document.getElementById('situationSolution').value = situation.solution || '';
        document.getElementById('situationNotes').value = situation.notes || '';
        document.getElementById('situationDate').value = situation.date;
        document.getElementById('situationTime').value = situation.time || '';
        document.getElementById('situationRating').value = situation.rating;
        document.getElementById('situationMood').value = situation.mood || 3;
        document.getElementById('situationSolved').value = situation.solved || 50;
        
        situation.categories.forEach(catId => {
            const checkbox = document.getElementById(`cat_${catId}`);
            if (checkbox) checkbox.checked = true;
        });
        
        updateStarRating(situation.rating);
        updateMoodSelector(situation.mood || 3);
        updateSolvedSlider(situation.solved || 50);
    } else {
        title.textContent = 'Neue Situation';
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('situationDate').value = today;
        updateStarRating(3);
        updateMoodSelector(3);
        updateSolvedSlider(50);
    }
    
    renderCategoryCheckboxes();
    modal.classList.add('active');
}

function renderCategoryCheckboxes() {
    const container = document.getElementById('categoryCheckboxes');
    
    if (App.categories.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.9rem;">Keine Kategorien vorhanden. Erstelle zuerst Kategorien.</p>';
        return;
    }
    
    container.innerHTML = App.categories.map(cat => `
        <input type="checkbox" id="cat_${cat.id}" value="${cat.id}" class="category-checkbox">
        <label for="cat_${cat.id}" class="category-checkbox-label" style="background: ${cat.color}; border-color: ${cat.color};">
            ${cat.name}
        </label>
    `).join('');
}

function updateStarRating(rating) {
    const stars = document.querySelectorAll('#starRating .star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    document.getElementById('situationRating').value = rating;
}

function updateMoodSelector(mood) {
    const buttons = document.querySelectorAll('#moodSelector .mood-btn');
    buttons.forEach(btn => {
        if (parseInt(btn.dataset.mood) === parseInt(mood)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    document.getElementById('situationMood').value = mood;
}

function updateSolvedSlider(value) {
    document.getElementById('situationSolved').value = value;
    document.getElementById('solvedPercentLabel').textContent = value + '%';
}

function initStarRating() {
    const stars = document.querySelectorAll('#starRating .star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.rating);
            updateStarRating(rating);
        });
    });
}

function initMoodSelector() {
    const buttons = document.querySelectorAll('#moodSelector .mood-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mood = parseInt(btn.dataset.mood);
            updateMoodSelector(mood);
        });
    });
}

function initSolvedSlider() {
    const slider = document.getElementById('situationSolved');
    slider.addEventListener('input', (e) => {
        updateSolvedSlider(e.target.value);
    });
}

function saveSituation(event) {
    event.preventDefault();
    
    const id = document.getElementById('situationId').value;
    const title = document.getElementById('situationTitle').value.trim();
    const problem = document.getElementById('situationProblem').value.trim();
    const solution = document.getElementById('situationSolution').value.trim();
    const notes = document.getElementById('situationNotes').value.trim();
    const date = document.getElementById('situationDate').value;
    const time = document.getElementById('situationTime').value;
    const rating = parseInt(document.getElementById('situationRating').value);
    const mood = parseInt(document.getElementById('situationMood').value);
    const solved = parseInt(document.getElementById('situationSolved').value);
    
    const categories = Array.from(document.querySelectorAll('.category-checkbox:checked'))
        .map(cb => cb.value);
    
    const situationData = {
        id: id || generateId(),
        title,
        problem,
        solution,
        notes,
        date,
        time,
        rating,
        mood,
        solved,
        categories,
        createdAt: id ? App.situations.find(s => s.id === id).createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    if (id) {
        const index = App.situations.findIndex(s => s.id === id);
        if (index !== -1) {
            App.situations[index] = situationData;
            showToast('Situation aktualisiert');
        }
    } else {
        App.situations.push(situationData);
        showToast('Situation erstellt');
    }
    
    Storage.saveSituations(App.situations);
    renderSituationsList();
    updateFilterOptions();
    closeSituationModal();
}

function deleteSituation() {
    if (!App.currentSituation) return;
    
    if (confirm('Möchtest du diese Situation wirklich löschen?')) {
        App.situations = App.situations.filter(s => s.id !== App.currentSituation.id);
        Storage.saveSituations(App.situations);
        showToast('Situation gelöscht');
        renderSituationsList();
        closeViewModal();
    }
}

function closeSituationModal() {
    document.getElementById('situationModal').classList.remove('active');
}

function closeViewModal() {
    document.getElementById('viewModal').classList.remove('active');
    App.currentSituation = null;
}

// ===========================
// EXPORT / IMPORT
// ===========================
function exportData() {
    const data = {
        version: '2.0',
        exportDate: new Date().toISOString(),
        situations: App.situations,
        categories: App.categories
    };
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `situationtracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('✅ Daten erfolgreich exportiert!');
    console.log('📥 Export:', data);
}

function importData() {
    document.getElementById('importFileInput').click();
}

function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            if (!data.situations || !data.categories) {
                throw new Error('Ungültiges Datenformat');
            }
            
            if (confirm('Möchtest du die importierten Daten mit den vorhandenen zusammenführen?\n\nJA = Zusammenführen\nNEIN = Vorhandene Daten ersetzen')) {
                // Merge
                const existingIds = new Set(App.situations.map(s => s.id));
                const newSituations = data.situations.filter(s => !existingIds.has(s.id));
                App.situations = [...App.situations, ...newSituations];
                
                const existingCatIds = new Set(App.categories.map(c => c.id));
                const newCategories = data.categories.filter(c => !existingCatIds.has(c.id));
                App.categories = [...App.categories, ...newCategories];
                
                showToast(`✅ ${newSituations.length} Situationen und ${newCategories.length} Kategorien importiert!`);
            } else {
                // Replace
                App.situations = data.situations;
                App.categories = data.categories;
                showToast('✅ Daten ersetzt!');
            }
            
            Storage.saveSituations(App.situations);
            Storage.saveCategories(App.categories);
            renderSituationsList();
            updateFilterOptions();
            
            console.log('📤 Import erfolgreich:', data);
        } catch (error) {
            console.error('❌ Import-Fehler:', error);
            showToast('❌ Fehler beim Importieren der Datei');
        }
    };
    
    reader.readAsText(file);
    event.target.value = '';
}

// ===========================
// CATEGORIES CRUD
// ===========================
function renderCategoriesList() {
    const container = document.getElementById('categoriesList');
    
    if (App.categories.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Keine Kategorien vorhanden.</p></div>';
        return;
    }
    
    container.innerHTML = App.categories.map(cat => {
        const count = App.situations.filter(s => s.categories.includes(cat.id)).length;
        
        return `
            <div class="category-item">
                <div class="category-info">
                    <div class="category-color-box" style="background: ${cat.color}">
                        ${cat.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="category-details">
                        <h3>${cat.name}</h3>
                        <div class="category-count">${count} Situationen</div>
                    </div>
                </div>
                <div class="category-actions">
                    <button class="btn-icon btn-secondary" onclick="editCategory('${cat.id}')" title="Bearbeiten">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="btn-icon btn-danger" onclick="deleteCategory('${cat.id}')" title="Löschen">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function openCategoryModal(category = null) {
    const modal = document.getElementById('categoryModal');
    const title = document.getElementById('categoryModalTitle');
    const form = document.getElementById('categoryForm');
    
    form.reset();
    
    if (category) {
        title.textContent = 'Kategorie bearbeiten';
        document.getElementById('categoryId').value = category.id;
        document.getElementById('categoryName').value = category.name;
        document.getElementById('categoryColor').value = category.color;
        document.getElementById('categoryColorHex').value = category.color;
    } else {
        title.textContent = 'Neue Kategorie';
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        document.getElementById('categoryColor').value = randomColor;
        document.getElementById('categoryColorHex').value = randomColor;
    }
    
    modal.classList.add('active');
}

function editCategory(categoryId) {
    const category = App.categories.find(c => c.id === categoryId);
    if (category) {
        openCategoryModal(category);
    }
}

function saveCategory(event) {
    event.preventDefault();
    
    const id = document.getElementById('categoryId').value;
    const name = document.getElementById('categoryName').value.trim();
    const color = document.getElementById('categoryColor').value;
    
    if (!name) {
        showToast('Bitte gib einen Namen ein', 'error');
        return;
    }
    
    const categoryData = {
        id: id || generateId(),
        name,
        color
    };
    
    if (id) {
        const index = App.categories.findIndex(c => c.id === id);
        if (index !== -1) {
            App.categories[index] = categoryData;
            showToast('Kategorie aktualisiert');
        }
    } else {
        App.categories.push(categoryData);
        showToast('Kategorie erstellt');
    }
    
    Storage.saveCategories(App.categories);
    renderCategoriesList();
    updateFilterOptions();
    closeCategoryModal();
}

function deleteCategory(categoryId) {
    const category = App.categories.find(c => c.id === categoryId);
    if (!category) return;
    
    const usageCount = App.situations.filter(s => s.categories.includes(categoryId)).length;
    
    let message = `Möchtest du die Kategorie "${category.name}" wirklich löschen?`;
    if (usageCount > 0) {
        message += `\n\nSie wird in ${usageCount} Situation(en) verwendet und wird daraus entfernt.`;
    }
    
    if (confirm(message)) {
        App.situations.forEach(situation => {
            situation.categories = situation.categories.filter(id => id !== categoryId);
        });
        
        App.categories = App.categories.filter(c => c.id !== categoryId);
        
        Storage.saveCategories(App.categories);
        Storage.saveSituations(App.situations);
        
        showToast('Kategorie gelöscht');
        renderCategoriesList();
        updateFilterOptions();
    }
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('active');
}

function initColorPicker() {
    const colorInput = document.getElementById('categoryColor');
    const hexInput = document.getElementById('categoryColorHex');
    
    colorInput.addEventListener('input', (e) => {
        hexInput.value = e.target.value;
    });
    
    hexInput.addEventListener('input', (e) => {
        const value = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(value)) {
            colorInput.value = value;
        }
    });
}

// ===========================
// FILTERS
// ===========================
function initFilters() {
    const categoryFilter = document.getElementById('filterCategory');
    const ratingFilter = document.getElementById('filterRating');
    const dateRangeFilter = document.getElementById('filterDateRange');
    const moodFilter = document.getElementById('filterMood');
    const customDateRange = document.getElementById('customDateRange');
    const applyCustomBtn = document.getElementById('applyCustomDate');
    
    categoryFilter.addEventListener('change', (e) => {
        App.filters.category = e.target.value;
        renderSituationsList();
    });
    
    ratingFilter.addEventListener('change', (e) => {
        App.filters.rating = e.target.value;
        renderSituationsList();
    });
    
    dateRangeFilter.addEventListener('change', (e) => {
        App.filters.dateRange = e.target.value;
        if (e.target.value === 'custom') {
            customDateRange.style.display = 'flex';
        } else {
            customDateRange.style.display = 'none';
            renderSituationsList();
        }
    });
    
    moodFilter.addEventListener('change', (e) => {
        App.filters.mood = e.target.value;
        renderSituationsList();
    });
    
    applyCustomBtn.addEventListener('click', () => {
        App.filters.customDateFrom = document.getElementById('filterDateFrom').value;
        App.filters.customDateTo = document.getElementById('filterDateTo').value;
        renderSituationsList();
    });
    
    updateFilterOptions();
}

function updateFilterOptions() {
    const categoryFilter = document.getElementById('filterCategory');
    const currentValue = categoryFilter.value;
    
    categoryFilter.innerHTML = '<option value="">Alle Kategorien</option>' +
        App.categories.map(cat => 
            `<option value="${cat.id}">${cat.name}</option>`
        ).join('');
    
    categoryFilter.value = currentValue;
}

// ===========================
// DASHBOARD & ANALYTICS
// ===========================
function renderDashboard() {
    renderStats();
    renderCategoryChart();
    renderTimelineChart();
    renderMoodChart();
}

function renderStats() {
    const total = App.situations.length;
    const categoriesCount = App.categories.length;
    
    const avgRating = total > 0
        ? (App.situations.reduce((sum, s) => sum + s.rating, 0) / total).toFixed(1)
        : 0;
    
    const avgSolved = total > 0
        ? Math.round(App.situations.reduce((sum, s) => sum + (s.solved || 0), 0) / total)
        : 0;
    
    const avgMood = total > 0
        ? (App.situations.reduce((sum, s) => sum + (s.mood || 3), 0) / total).toFixed(1)
        : 0;
    
    document.getElementById('totalSituations').textContent = total;
    document.getElementById('totalCategories').textContent = categoriesCount;
    document.getElementById('avgRating').textContent = avgRating;
    document.getElementById('avgSolved').textContent = avgSolved + '%';
    document.getElementById('avgMood').textContent = avgMood > 0 ? getMoodEmoji(Math.round(avgMood)) : '-';
}

function renderCategoryChart() {
    const container = document.getElementById('categoryChart');
    
    const categoryCount = {};
    App.situations.forEach(situation => {
        situation.categories.forEach(catId => {
            categoryCount[catId] = (categoryCount[catId] || 0) + 1;
        });
    });
    
    const sorted = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    if (sorted.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Keine Daten vorhanden</p>';
        return;
    }
    
    const maxCount = sorted[0][1];
    
    container.innerHTML = sorted.map(([catId, count]) => {
        const cat = App.categories.find(c => c.id === catId);
        if (!cat) return '';
        
        const percentage = (count / maxCount) * 100;
        
        return `
            <div class="chart-bar">
                <div class="chart-label">${cat.name}</div>
                <div class="chart-bar-container">
                    <div class="chart-bar-fill" style="width: ${percentage}%; background: ${cat.color};">
                        ${count}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderTimelineChart() {
    const container = document.getElementById('timelineChart');
    
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const count = App.situations.filter(s => s.date === dateStr).length;
        
        days.push({
            date: dateStr,
            label: new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit' }).format(date),
            count
        });
    }
    
    const activeDays = days.filter(d => d.count > 0);
    
    if (activeDays.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Keine Daten in den letzten 30 Tagen</p>';
        return;
    }
    
    container.innerHTML = activeDays.map(day => `
        <div class="timeline-day">
            <div class="timeline-date">${day.label}</div>
            <div class="timeline-dots">
                ${Array(day.count).fill('<div class="timeline-dot"></div>').join('')}
            </div>
        </div>
    `).join('');
}

function renderMoodChart() {
    const container = document.getElementById('moodChart');
    
    const moodCount = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
    
    App.situations.forEach(s => {
        const mood = s.mood || 3;
        moodCount[mood]++;
    });
    
    const total = App.situations.length;
    
    if (total === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Keine Daten vorhanden</p>';
        return;
    }
    
    container.innerHTML = Object.entries(moodCount)
        .reverse()
        .map(([mood, count]) => {
            const percentage = (count / total) * 100;
            
            return `
                <div class="mood-bar">
                    <div class="mood-emoji">${getMoodEmoji(parseInt(mood))}</div>
                    <div class="chart-label">${getMoodLabel(parseInt(mood))}</div>
                    <div class="chart-bar-container">
                        <div class="chart-bar-fill" style="width: ${percentage}%;">
                            ${count}
                        </div>
                    </div>
                </div>
            `;
        })
        .join('');
}

// ===========================
// EVENT LISTENERS
// ===========================
function initEventListeners() {
    document.getElementById('addSituationBtn').addEventListener('click', () => {
        openSituationModal();
    });
    
    document.getElementById('situationForm').addEventListener('submit', saveSituation);
    document.getElementById('closeSituationModal').addEventListener('click', closeSituationModal);
    document.getElementById('cancelSituation').addEventListener('click', closeSituationModal);
    
    document.getElementById('closeViewModal').addEventListener('click', closeViewModal);
    document.getElementById('closeView').addEventListener('click', closeViewModal);
    document.getElementById('editSituation').addEventListener('click', () => {
        closeViewModal();
        openSituationModal(App.currentSituation);
    });
    document.getElementById('deleteSituation').addEventListener('click', deleteSituation);
    
    document.getElementById('addCategoryBtn').addEventListener('click', () => {
        openCategoryModal();
    });
    document.getElementById('categoryForm').addEventListener('submit', saveCategory);
    document.getElementById('closeCategoryModal').addEventListener('click', closeCategoryModal);
    document.getElementById('cancelCategory').addEventListener('click', closeCategoryModal);
    
    document.getElementById('exportDataBtn').addEventListener('click', exportData);
    document.getElementById('importDataBtn').addEventListener('click', importData);
    document.getElementById('importFileInput').addEventListener('change', handleImportFile);
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// ===========================
// APP INITIALIZATION
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOM geladen, initialisiere App v2.0...');
    
    App.situations = Storage.loadSituations();
    App.categories = Storage.loadCategories();
    
    if (App.categories.length > 0 && !localStorage.getItem(Storage.CATEGORIES_KEY)) {
        Storage.saveCategories(App.categories);
    }
    
    console.log('📊 Situationen geladen:', App.situations.length);
    console.log('🏷️ Kategorien geladen:', App.categories.length);
    
    initNavigation();
    initEventListeners();
    initStarRating();
    initMoodSelector();
    initSolvedSlider();
    initColorPicker();
    initFilters();
    
    renderSituationsList();
    
    console.log('✅ App erfolgreich initialisiert! (v2.0 mit Notizen, Stimmung, Lösungsgrad & Export/Import)');
});

# 📝 SituationTracker v2.0

**Progressive Web App mit erweiterten Features: Notizen, Stimmungs-Tracking, Lösungsgrad und Export/Import**

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![PWA](https://img.shields.io/badge/PWA-ready-green.svg)
![Offline](https://img.shields.io/badge/offline-capable-orange.svg)

## 🎉 NEU in Version 2.0!

### ✨ Neue Features

- **📝 Reflexion & Notizen** - "Was habe ich gelernt?" Feld für tiefere Reflexion
- **😊 Stimmungs-Tracker** - 5 Stimmungsstufen (Sehr gut bis Sehr schlecht)
- **📊 Lösungsgrad in %** - Slider von 0-100% statt Ja/Nein
- **📅 Erweiterte Datumsfilter** - Heute, Letzte 7 Tage, Monat, Jahr, Benutzerdefiniert
- **💾 Export/Import** - Daten als JSON sichern und wiederherstellen
- **😊 Stimmungs-Dashboard** - Neuer Chart für Stimmungsverlauf
- **🎨 Verbesserte UI** - Stimmungs-Emoji auf Karten sichtbar

### 🗑️ Entfernt

- ❌ Erfolgsquote-Chart (auf Kundenwunsch entfernt)

## 🎯 Features

### ✅ Situations-Erfassung
- **Was ist passiert?** – Titel der Situation
- **Das Problem** – Detaillierte Beschreibung
- **Die Lösung** – Wie wurde es gelöst?
- **Reflexion & Notizen** – Was habe ich gelernt? ⭐ NEU!
- **Datum & Uhrzeit** – Automatisch oder manuell
- **Stimmung** – Wie hast du dich gefühlt? ⭐ NEU!
- **Lösungsgrad** – 0-100% Slider ⭐ NEU!
- **Kategorien** – Mehrfach-Zuordnung möglich
- **Bewertung** – 1-5 Sterne

### 🏷️ Kategorien-Verwaltung
- Kategorien erstellen, bearbeiten und löschen
- Farbcodierung mit Color Picker
- Mehrfach-Zuordnung möglich
- Verwendungszähler

### 📊 Dashboard & Analyse
- **Statistiken:**
  - Gesamt-Situationen
  - Gesamt-Kategorien
  - Durchschnittliche Bewertung
  - Durchschnittlicher Lösungsgrad ⭐ NEU!
  - Durchschnittliche Stimmung ⭐ NEU!

- **Visualisierungen:**
  - Top-10 Kategorien (Horizontal Bar Chart)
  - 30-Tage Timeline (Dot Chart)
  - Stimmungsverlauf (Bar Chart) ⭐ NEU!

### 🔍 Erweiterte Filter ⭐ NEU!
- Nach Kategorie filtern
- Nach Bewertung filtern
- Nach Stimmung filtern ⭐ NEU!
- Nach Datumsbereich filtern ⭐ NEU!
  - Heute
  - Letzte 7 Tage
  - Letzter Monat
  - Letztes Jahr
  - Benutzerdefiniert (von-bis)

### 💾 Daten-Management ⭐ NEU!
- **Export als JSON** - Komplettes Backup aller Daten
- **Import von JSON** - Daten wiederherstellen
- **Merge oder Replace** - Beim Import wählbar
- **Versionierung** - Backup-Dateien mit Datum im Namen

### 🔒 Datenschutz & Sicherheit
- **100% Lokal** – Alle Daten bleiben auf deinem Gerät
- **Keine Cloud** – Keine Server, keine Registrierung
- **Offline-fähig** – Funktioniert komplett ohne Internet
- **Backup-fähig** – Exportiere deine Daten regelmäßig! ⭐ NEU!

## 🚀 Installation & Deployment

### Lokale Entwicklung

```bash
cd situationtracker
python3 -m http.server 8000
# Dann öffne: http://localhost:8000
```

### GitHub Pages Deployment

1. **Repository auf GitHub pushen:**
```bash
git init
git add .
git commit -m "SituationTracker v2.0"
git branch -M main
git remote add origin https://github.com/DEIN-USERNAME/situationtracker.git
git push -u origin main
```

2. **GitHub Pages aktivieren:**
   - Settings → Pages
   - Source: "main" branch, "/ (root)"
   - Save

3. **App ist online:**
```
https://DEIN-USERNAME.github.io/situationtracker/
```

## 📁 Projektstruktur

```
situationtracker/
├── index.html              # Haupt-HTML (v2.0)
├── manifest.json           # PWA Manifest (v2.0)
├── service-worker.js       # Service Worker (v2.0)
├── css/
│   └── styles.css          # Komplettes Styling (v2.0)
├── js/
│   ├── app.js              # Hauptlogik (v2.0 - 1000+ Zeilen)
│   └── register-sw.js      # Service Worker Registrierung
├── images/
│   └── [8 Icons]           # 72px bis 512px
├── .gitignore
├── LICENSE
└── README.md
```

## 🛠️ Technologie-Stack

- **HTML5** – Semantisches Markup
- **CSS3** – Moderne Layouts mit Flexbox & Grid
- **Vanilla JavaScript** – Keine Frameworks (1000+ Zeilen)
- **Service Worker** – Offline & Caching (v2.0.0)
- **LocalStorage** – Persistente Datenspeicherung
- **PWA Manifest** – Installierbarkeit

## 💾 Backup & Datenwiederherstellung

### Regelmäßiges Backup erstellen

1. **In der App:** Klicke auf das Download-Icon (⬇️) oben rechts
2. **JSON-Datei wird heruntergeladen:** `situationtracker-backup-2026-01-22.json`
3. **Speichere in Cloud:** Google Drive, Dropbox, etc.

**Empfehlung:** Wöchentliches Backup!

### Daten wiederherstellen

1. **Klicke auf Upload-Icon (⬆️)** oben rechts
2. **Wähle JSON-Datei** aus
3. **Wähle:**
   - **Zusammenführen** → Importierte Daten werden hinzugefügt
   - **Ersetzen** → Vorhandene Daten werden ersetzt
4. **Fertig!** Daten sind wiederhergestellt

### Backup-Datei Format

```json
{
  "version": "2.0",
  "exportDate": "2026-01-22T14:30:00.000Z",
  "situations": [...],
  "categories": [...]
}
```

## 🧪 Testing & Debugging

### Chrome DevTools Checkliste

1. **Application Tab → Manifest**
   - Version: 2.0.0 ✅
   - Alle Icons sichtbar ✅

2. **Application Tab → Service Workers**
   - Cache: `situationtracker-v2.0.0` ✅
   - Status: "activated and running" ✅

3. **Application Tab → Local Storage**
   - `situationtracker_situations` vorhanden ✅
   - `situationtracker_categories` vorhanden ✅

4. **Lighthouse Audit**
   - PWA Score >90 ✅

### Debug-Befehle (Console)

```javascript
// Cache leeren
clearCache()

// Service Worker neu laden
reloadServiceWorker()

// Daten anzeigen
console.log('Situations:', localStorage.getItem('situationtracker_situations'))

// Export-Test
App.situations // Zeigt alle Situationen
```

### Häufige Probleme v2.0

#### ❌ Export-Button funktioniert nicht
**Lösung:**
- Browser erlaubt Downloads? (Popup-Blocker)
- Console-Fehler? (F12 → Console)

#### ❌ Import schlägt fehl
**Lösung:**
- JSON-Datei gültig? (In JSON-Validator prüfen)
- Version kompatibel? (v1.0 Daten funktionieren!)

#### ❌ Alte Daten nicht sichtbar
**Lösung:**
- LocalStorage nicht gelöscht? (F12 → Application → Local Storage)
- Hard Refresh: Strg+Shift+R

## 📊 Performance v2.0

- **First Contentful Paint:** < 1s
- **Time to Interactive:** < 2s
- **Bundle Size:** ~70 KB (ohne Icons)
- **Lines of Code:** 2500+ Zeilen
- **Features:** 25+ Funktionen

## 🔄 Migration von v1.0 → v2.0

**Deine Daten bleiben erhalten!** ✅

Beim Update von v1.0 auf v2.0:
- ✅ Alle Situationen bleiben erhalten
- ✅ Alle Kategorien bleiben erhalten
- ✅ Neue Felder bekommen Standard-Werte:
  - `mood`: 3 (Neutral)
  - `solved`: 50 (Teilweise gelöst)
  - `notes`: "" (Leer)

**Kein Datenverlust!**

## 🎨 Anpassungen

### Farben ändern

```css
/* In css/styles.css */
:root {
    --primary: #6366f1;      /* Hauptfarbe */
    --secondary: #8b5cf6;    /* Sekundärfarbe */
    --success: #10b981;      /* Erfolg */
    --danger: #ef4444;       /* Fehler */
}
```

### Standard-Kategorien ändern

```javascript
/* In js/app.js */
getDefaultCategories() {
    return [
        { id: generateId(), name: 'Deine Kategorie', color: '#6366f1' },
        // Weitere...
    ];
}
```

## 📱 Browser-Kompatibilität

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | ≥80 | ✅ Vollständig |
| Firefox | ≥75 | ✅ Vollständig |
| Safari | ≥13 | ✅ Vollständig |
| Edge | ≥80 | ✅ Vollständig |

**PWA-Installation:**
- ✅ Android (Chrome, Firefox, Edge)
- ✅ iOS/iPadOS 13+ (Safari)
- ✅ Windows 10+
- ✅ macOS
- ✅ Linux

## 🔮 Geplante Features v3.0

- [ ] Bilder/Fotos anhängen
- [ ] Tags zusätzlich zu Kategorien
- [ ] Volltextsuche
- [ ] Dark Mode
- [ ] PDF-Export
- [ ] Erweiterte Statistiken
- [ ] Cloud-Sync (optional)
- [ ] Erinnerungen (Desktop)

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei

## 🤝 Contributing

Contributions willkommen!

1. Fork das Repository
2. Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Pull Request öffnen

## 📞 Support

Bei Fragen:
- GitHub Issues: [Issues](https://github.com/dein-username/situationtracker/issues)

## 🎯 Changelog

### Version 2.0.0 (2026-01-22)

**Neue Features:**
- ✅ Reflexion & Notizen-Feld
- ✅ Stimmungs-Tracker (5 Stufen)
- ✅ Lösungsgrad in Prozent (0-100%)
- ✅ Erweiterte Datumsfilter
- ✅ Export/Import Funktion
- ✅ Stimmungs-Dashboard
- ✅ Stimmungs-Emoji auf Karten

**Entfernt:**
- ❌ Erfolgsquote-Chart

**Verbessert:**
- 🔧 Code-Optimierungen
- 🎨 UI-Verbesserungen
- 📱 Besseres Mobile Layout

### Version 1.0.0 (2026-01-20)

- 🎉 Initial Release

---

**Made with ❤️ - Version 2.0.0**

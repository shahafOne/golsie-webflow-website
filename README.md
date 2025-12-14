# Golsie Music Website Scripts

Complete JavaScript for the Golsie music website with hybrid GitHub + Webflow deployment.

## 🏗️ Architecture

This project uses a **hybrid deployment strategy**:
- **Primary:** GitHub CDN (fast, unlimited size, easy updates)
- **Fallback:** Webflow-hosted (reliable, always available)
- **Auto-switching:** Seamless fallback if GitHub fails

## 📦 Repository Files

### Main Script
- **golsie-full.js** - Complete unminified script (58KB, hosted on GitHub)

### Webflow Integration Files
- **webflow-loader.html** - CDN loader script (goes in Custom Code → Head)
- **webflow-fallback-minified.html** - Minified fallback (goes in Custom Code → Footer)
- **IMPLEMENTATION-GUIDE.md** - Complete setup instructions

## 🚀 Deployment

### GitHub CDN (Primary)
The site loads from jsDelivr CDN automatically:
```
https://cdn.jsdelivr.net/gh/Shahaf1/golsie-webflow-website@main/golsie-full.js
```

**Benefits:**
- ⚡ Fast global delivery (~50-200ms)
- 📦 No file size limits
- 🔄 Easy updates (just push to GitHub)
- 🌍 99.9% uptime
- 💾 Automatic caching

### Webflow Fallback
If GitHub CDN fails (network issues, CDN down, timeout), the site automatically loads a minified version from Webflow's servers.

**Fallback triggers:**
- CDN network error
- Load timeout (>5 seconds)
- Script initialization failure

## 🧪 Testing

### Normal Mode
```
https://golsie-music.design.webflow.com
```
→ Loads from GitHub CDN  
→ Body class: `git-js`

### Test Fallback Mode
```
https://golsie-music.design.webflow.com?fallback
```
→ Forces Webflow fallback  
→ Body class: `webflow-js`

### Console Monitoring

**GitHub Success:**
```
[Golsie] Attempting to load from GitHub CDN...
[Golsie] ✓ GitHub CDN loaded successfully (150ms)
[Golsie] ✓ Script initialized successfully
```

**Fallback Success:**
```
[Golsie] ✗ GitHub CDN failed to load
[Golsie] → Loading fallback from Webflow...
[Golsie] ✓ Fallback loaded successfully
```

**Test Mode:**
```
[Golsie] 🧪 TEST MODE: Fallback forced via ?fallback parameter
[Golsie] Skipping GitHub CDN, loading Webflow fallback...
```

## 🎯 Body Classes

The loader automatically adds classes to track which version is active:

- **`.git-js`** - GitHub CDN version (primary, 99%+ of traffic)
- **`.webflow-js`** - Webflow fallback version (rare, <1% of traffic)

Use these for debugging or conditional styling:
```css
.git-js .debug-badge::before {
  content: "CDN Active";
}

.webflow-js .debug-badge::before {
  content: "Fallback Active";
}
```

## 🔄 Updating the Script

### Quick Updates (No Webflow Changes)
1. Edit `golsie-full.js` locally
2. Commit and push to GitHub
3. Changes live in 1-5 minutes (CDN cache refresh)
4. **No Webflow republish needed!**

### Version Management
```bash
# Tag a release
git tag v1.0.1
git push origin v1.0.1

# Use specific version in CDN URL
https://cdn.jsdelivr.net/gh/Shahaf1/golsie-webflow-website@v1.0.1/golsie-full.js
```

## ✨ Features

### Core Systems
- Mobile menu with scroll lock
- Navigation active state detection (with parent page support)
- Background video keep-alive system
- Hash URL cleanup

### Product Gallery
- Swipe navigation (mobile)
- Keyboard navigation (desktop)
- Arrow controls
- Thumbnail selection
- Image preloading with fade transitions

### Shows System (Bandsintown API)
- Live show data fetching
- Client-side caching (2 API calls per session)
- Filter system: All / Golsie / Other / Previous
- Address toggle with Google Maps integration
- Description popup modal
- Date/time formatting

### Modal System
- Songlink integration (multi-platform music links)
- YouTube video embeds
- Spotify oEmbed with iOS fallback
- Loading states with smooth transitions
- Glassmorphic backdrop with animations

### Browser Compatibility
- iOS Safari backdrop-filter fixes
- Mobile touch event handling
- Passive event listeners
- Cross-browser transitions

## 📊 File Sizes

| File | Size | Location | Limit |
|------|------|----------|-------|
| golsie-full.js | ~58KB | GitHub | None |
| webflow-loader.html | ~2KB | Webflow Head | 50KB |
| webflow-fallback-minified.html | ~33KB | Webflow Footer | 50KB |
| **Total in Webflow** | **~35KB** | **Both sections** | **100KB** |

✅ **Well under Webflow's limits with 65KB headroom**

## 🛠️ Configuration

All settings centralized in `Config` object:

```javascript
var Config = {
  // Timing
  menuAnimationDuration: 250,
  modalAnimationDuration: 300,
  modalLoadingMinTime: 700,
  
  // Bandsintown API
  bandsintownApiKey: '******',
  bandsintownArtistName: 'Golsie',
  showsMaxDisplay: 100,
  showsDefaultFilter: 'all',
  
  // Gallery
  galleryComponentLoadDelay: 500
};
```

## 🌐 Public APIs

Exposed global objects for external control:

```javascript
// Modals
window.GolsieModals.open('songlink', {...});
window.GolsieModals.close();
window.GolsieModals.isOpen();

// Menu
window.GolsieMenu.open();
window.GolsieMenu.close();
window.GolsieMenu.isOpen();

// Gallery
window.GolsieGallery.next();
window.GolsieGallery.prev();
window.GolsieGallery.goTo(index);

// Navigation
window.GolsieNav.update();

// Shows
window.GolsieShows.refresh();
window.GolsieShows.getShows();
```

## 📝 Version

**Current:** 1.0.0  
**Last Updated:** December 10, 2025  
**Repository:** https://github.com/Shahaf1/golsie-webflow-website

## 🔗 Links

- **Production Site:** https://golsie-music.design.webflow.com - www.golsiemusic.com
- **GitHub Repo:** https://github.com/Shahaf1/golsie-webflow-website
- **CDN URL:** https://cdn.jsdelivr.net/gh/Shahaf1/golsie-webflow-website@main/golsie-full.js

## 📄 License

Proprietary - Golsie Music  
© 2025 All Rights Reserved
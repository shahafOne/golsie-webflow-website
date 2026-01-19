document.addEventListener("DOMContentLoaded", function() {
  
  var Config = {
    menuAnimationDuration: 250,
    menuToModalCloseDelay: 300,
    modalAnimationDuration: 300,
    modalLoadingMinTime: 700,
    modalLoadingTimeout: 3000,
    contentFadeInDelay: 100,
    songlinkExtraDelay: 300,
    spotifyTimeoutDesktop: 3000,
    spotifyTimeoutIOS: 2000,
    videoKeepAliveInterval: 90000,
    hashRemovalDelay: 400,
    galleryComponentLoadDelay: 500,

    bandsintownApiKey: '43aa4e2b7dc992c34f1bf8503a4d9667',
    bandsintownArtistName: 'Golsie',
    bandsintownOtherArtists: [
      {
        name: 'One: FortyFive Band',         
        apiKey: '9cbab9f2cdfcee8711eefe84b54035d8'  
      }
    ],
    showsMaxDisplay: 100,
    showsLoadingMinTime: 500,
    showsDefaultFilter: 'all',

    carouselAnimationDuration: 300,
    carouselSelectors: {
      section: '.musiccarouselsection',
      container: '.carouselcontainer',
      track: '.carouseltrack',
      item: '.musicitem',
      arrowLeft: '.arrowleft',
      arrowRight: '.arrowright',
      centerClass: 'item-center',
      sideClass: 'item-side',
      farClass: 'item-far'
    }
  };
  
  // Iframe Refresh Helper
  var IframeRefreshHelper = {
    createRefreshButton: function(onRefresh) {
      var button = document.createElement('button');
      button.className = 'iframe-refresh-icon';
      button.style.cssText = 'background:transparent;border:none;padding:0;cursor:pointer;display:flex;align-items:center;justify-content:center;width:30px;height:30px;opacity:0.6;transition:opacity 0.2s ease;';
      button.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#fff;"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>';
      
      button.onmouseover = function() {
        this.style.opacity = '1';
      };
      button.onmouseout = function() {
        this.style.opacity = '0.6';
      };
      
      button.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        // Show loading indicator
        button.style.opacity = '0.3';
        button.style.pointerEvents = 'none';
        if (onRefresh) onRefresh();
      };
      
      return button;
    },
    
    showError: function(container, iframe, onRefresh) {
      if (!container) return;
      
      // Hide iframe instead of deleting it
      if (iframe) {
        iframe.style.display = 'none';
      }
      
      // Remove any existing refresh button first
      var existingBtn = container.querySelector('.iframe-refresh-icon');
      if (existingBtn) {
        existingBtn.remove();
      }
      
      container.style.display = 'flex';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';
      container.style.opacity = '1';
      container.style.visibility = 'visible';
      
      var refreshBtn = this.createRefreshButton(onRefresh);
      container.appendChild(refreshBtn);
    },
    
    hideError: function(container, iframe) {
      if (!container) return;
      
      // Remove refresh button
      var existingBtn = container.querySelector('.iframe-refresh-icon');
      if (existingBtn) {
        existingBtn.remove();
      }
      
      // Show iframe again
      if (iframe) {
        iframe.style.display = 'block';
      }
    }
  };
  
  var ModalSelectors = {
    songlink: {
      thumbnail: '.modalsongthumbnail',
      title: '.modaltitletext',
      spotifyContainer: '.spotify-iframe-modal',
      songlinkIframe: '.songlink-iframe-modal iframe', 
      songlinkIframeContainer: '.songlink-iframe-modal', 
      dynamicContent: '.modaldynamiccontent',  
      loadingIndicator: '.modalloading',  
      spotifyiframe_height: '82',
    },
    youtube: {
      title: '.modaltitletextyoutube',
      contentClass: '.modalcontentyoutubelink',
      dynamicContent: '.modalcontentyoutubelink .modaldynamiccontent',
      loadingIndicator: '.modalloading',
      videoWrapper: '.modalyoutubewrapper',
      youtubeElement: '.modalyoutubewrapper iframe'
    },
    custom: {
      contentClass: '.modalcontentcustom',
      dynamicContent: '.modalcontentcustom .modaldynamiccontentcustom',
      title: '.modalcontentcustom .modaltitletext',
      loadingIndicator: '.modalloading'
    }
  };

  var MenuSystem = {
    config: {
      hamburgerSelector: '.hamburgerwrapper',
      headerSelector: '.headersection',
      whiteBorderClass: 'header--white-border'
    },
    state: {
      isAnimating: false,
      menuOpen: false,
      scrollY: 0,
      modalWasOpen: false
    },
    getAllHamburgers: function() {
      return document.querySelectorAll(this.config.hamburgerSelector);
    },
    getAllHeaders: function() {
      return document.querySelectorAll(this.config.headerSelector);
    },
    preventScroll: function(e) {
      if (MenuSystem.state.menuOpen) e.preventDefault();
    },
    addWhiteBorder: function() {
      var headers = this.getAllHeaders();
      headers.forEach(function(header) {
        if (header) header.classList.add(MenuSystem.config.whiteBorderClass);
      });
    },
    removeWhiteBorder: function() {
      var headers = this.getAllHeaders();
      headers.forEach(function(header) {
        if (header) header.classList.remove(MenuSystem.config.whiteBorderClass);
      });
    },
    openMenu: function() {
      this.state.modalWasOpen = modalReady && ModalSystem.isModalOpen();
      if (!this.state.modalWasOpen) {
        this.state.scrollY = window.scrollY;
        document.body.style.top = -this.state.scrollY + 'px';
      }
      document.body.classList.add('no-scroll');
      var self = this;
      setTimeout(function() {
        self.addWhiteBorder();
      }, Config.menuAnimationDuration);
      this.state.menuOpen = true;
      setTimeout(function() {
        if (modalReady && ModalSystem.isModalOpen()) {
          ModalSystem.close();
        }
      }, Config.menuAnimationDuration + Config.menuToModalCloseDelay);
    },
    closeMenu: function() {
      document.body.classList.remove('no-scroll');
      if (!this.state.modalWasOpen) {
        var top = parseInt(document.body.style.top || '0', 10);
        document.body.style.top = '';
        window.scrollTo(0, -top);
      }
      this.removeWhiteBorder();
      this.state.menuOpen = false;
      this.state.modalWasOpen = false;
    },
    toggle: function() {
      if (this.state.isAnimating) return;
      this.state.isAnimating = true;
      if (!this.state.menuOpen) {
        this.openMenu();
      } else {
        this.closeMenu();
      }
      var self = this;
      setTimeout(function() {
        self.state.isAnimating = false;
      }, Config.menuAnimationDuration);
    },
    init: function() {
      var self = this;
      document.addEventListener('touchmove', this.preventScroll, { passive: false });
      document.addEventListener('wheel', this.preventScroll, { passive: false });
      var hamburgers = this.getAllHamburgers();
      if (hamburgers.length > 0) {
        hamburgers.forEach(function(hamburger) {
          hamburger.addEventListener('click', function() {
            self.toggle();
          });
        });
      }
    }
  };
  MenuSystem.init();

  var video = document.querySelector('.homepagebgvideo video');
  if (video) {
    function keepPlaying() {
      if (document.hidden) return;
      if (video.paused || video.readyState < 3) video.play().catch(function(){});
      if (video.ended) {
        video.currentTime = 0;
        video.play().catch(function(){});
      }
    }
    setInterval(keepPlaying, Config.videoKeepAliveInterval);
    document.addEventListener('visibilitychange', function() {
      if (!document.hidden && video.paused) video.play().catch(function(){});
    });
  }

  ['.morelinkswrapperlink','.footerdesktop .footerlogo .footerlogowrapperlink','.footermobile .footerlogo .footerlogowrapperlink'].forEach(function(selector) {
    var el = document.querySelector(selector);
    if (el) {
      el.addEventListener('click', function() {
        setTimeout(function() {
          history.replaceState(null, document.title, window.location.pathname + window.location.search);
        }, Config.hashRemovalDelay);
      });
    }
  });

  var NavigationHelper = {
    config: {
      navLinkSelector: '[data-page]',
      activeClass: 'activepage',
      parentPages: ['shop', 'music', 'shows', 'memories']
    },
    getCurrentPage: function() {
      var path = window.location.pathname;
      var segments = path.split('/').filter(Boolean);
      if (segments.length === 0) return 'home';
      var firstSegment = segments[0];
      if (segments.length > 1 && this.config.parentPages.indexOf(firstSegment) !== -1) {
        return firstSegment;
      }
      return segments[segments.length - 1];
    },
    updateActiveState: function() {
      var currentPage = this.getCurrentPage();
      var navLinks = document.querySelectorAll(this.config.navLinkSelector);
      navLinks.forEach(function(link) {
        var linkPage = link.getAttribute('data-page');
        if (linkPage === currentPage || (currentPage === 'home' && (linkPage === '' || linkPage === 'home')) || (window.location.pathname === '/' && (linkPage === 'home' || linkPage === ''))) {
          link.classList.add(NavigationHelper.config.activeClass);
        } else {
          link.classList.remove(NavigationHelper.config.activeClass);
        }
      });
    },
    init: function() {
      this.updateActiveState();
    }
  };
  NavigationHelper.init();

  var GallerySystem = {
    galleries: [],
    createGallery: function(config) {
      return {
        config: config || {
          mainImageSelector: '[data-gallery-main]',
          thumbnailSelector: '[data-gallery-thumb]',
          prevArrowSelector: '[data-gallery-prev]',
          nextArrowSelector: '[data-gallery-next]',
          activeClass: 'activethumbnail'
        },
        state: {
          currentIndex: 0,
          images: [],
          isLoading: false
        },
        init: function() {
          var self = this;
          this.mainImage = document.querySelector(this.config.mainImageSelector);
          this.thumbnails = document.querySelectorAll(this.config.thumbnailSelector);
          this.prevArrow = document.querySelector(this.config.prevArrowSelector);
          this.nextArrow = document.querySelector(this.config.nextArrowSelector);
          if (!this.mainImage || this.thumbnails.length === 0) return false;
          this.thumbnails.forEach(function(thumb) {
            var img = thumb.querySelector('img');
            if (img) {
              self.state.images.push({
                src: thumb.getAttribute('data-image-src') || img.src,
                srcset: thumb.getAttribute('data-image-srcset') || img.srcset || '',
                sizes: img.getAttribute('sizes') || ''
              });
            }
          });
          if (this.thumbnails[0]) {
            this.thumbnails[0].classList.add(this.config.activeClass);
          }
          this.mainImage.style.transition = 'opacity 0.3s ease';
          this.thumbnails.forEach(function(thumb, index) {
            thumb.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              self.goToImage(index);
            });
            thumb.style.cursor = 'pointer';
          });
          if (this.prevArrow) {
            this.prevArrow.addEventListener('click', function(e) {
              e.preventDefault();
              self.prev();
            });
            this.prevArrow.style.cursor = 'pointer';
          }
          if (this.nextArrow) {
            this.nextArrow.addEventListener('click', function(e) {
              e.preventDefault();
              self.next();
            });
            this.nextArrow.style.cursor = 'pointer';
          }
          document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') self.prev();
            if (e.key === 'ArrowRight') self.next();
          });
          this.setupTouchEvents();
          return true;
        },
        setupTouchEvents: function() {
          var self = this;
          var touchStartX = 0;
          var touchEndX = 0;
          var touchStartY = 0;
          var touchEndY = 0;
          var minSwipeDistance = 50;
          var swipeContainer = this.mainImage.parentElement || this.mainImage;
          swipeContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
          }, { passive: true });
          swipeContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            self.handleSwipe(touchStartX, touchEndX, touchStartY, touchEndY, minSwipeDistance);
          }, { passive: true });
        },
        handleSwipe: function(startX, endX, startY, endY, minDistance) {
          var deltaX = endX - startX;
          var deltaY = endY - startY;
          if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minDistance) {
            if (deltaX > 0) {
              this.prev();
            } else {
              this.next();
            }
          }
        },
        goToImage: function(index) {
          if (index < 0 || index >= this.state.images.length || this.state.isLoading) return;
          this.state.isLoading = true;
          var imageData = this.state.images[index];
          var self = this;
          this.mainImage.style.opacity = '0.3';
          var preloader = new Image();
          preloader.onload = function() {
            self.mainImage.src = imageData.src;
            self.mainImage.srcset = imageData.srcset || imageData.src;
            if (imageData.sizes) self.mainImage.setAttribute('sizes', imageData.sizes);
            setTimeout(function() {
              self.mainImage.style.opacity = '1';
              self.state.isLoading = false;
            }, 50);
          };
          preloader.onerror = function() {
            self.mainImage.style.opacity = '1';
            self.state.isLoading = false;
          };
          preloader.src = imageData.src;
          this.thumbnails.forEach(function(thumb, i) {
            if (i === index) {
              thumb.classList.add(self.config.activeClass);
            } else {
              thumb.classList.remove(self.config.activeClass);
            }
          });
          this.state.currentIndex = index;
        },
        next: function() {
          var nextIndex = (this.state.currentIndex + 1) % this.state.images.length;
          this.goToImage(nextIndex);
        },
        prev: function() {
          var prevIndex = (this.state.currentIndex - 1 + this.state.images.length) % this.state.images.length;
          this.goToImage(prevIndex);
        }
      };
    },
    init: function(customConfig) {
      var gallery = this.createGallery(customConfig);
      var initialized = gallery.init();
      if (initialized) {
        this.galleries.push(gallery);
      }
      return gallery;
    },
    initAll: function() {
      this.init();
    }
  };
  setTimeout(function() {
    GallerySystem.initAll();
  }, Config.galleryComponentLoadDelay);

  var ShowsSystem = {
    config: {
      templateSelector: '[data-event-type="template"]',
      containerSelector: '[data-shows-container]',
      loadingSelector: '[data-shows-state="loading"]',
      emptySelector: '[data-shows-state="empty"]'
    },
    state: {
      allShows: [],
      upcomingShows: [],
      pastShows: [],
      filteredShows: [],
      currentFilter: 'all',
      isLoading: false,
      isCached: false
    },
    init: function() {
      var template = document.querySelector(this.config.templateSelector);
      var container = document.querySelector(this.config.containerSelector);
      if (!template || !container) return;
      template.style.display = 'none';
      this.template = template;
      this.container = container;
      this.showLoading();
      this.setupFilterButtons();
      var urlParams = new URLSearchParams(window.location.search);
      var filterParam = urlParams.get('filter');      
      this.fetchShows(filterParam);
    },
    showLoading: function() {
      this.hideAllShows();
      var loading = document.querySelector(this.config.loadingSelector);
      if (loading) loading.style.display = 'flex';
      var empty = document.querySelector(this.config.emptySelector);
      if (empty) empty.style.display = 'none';
    },
    hideLoading: function() {
      var loading = document.querySelector(this.config.loadingSelector);
      if (loading) loading.style.display = 'none';
    },
    showEmpty: function() {
      this.hideAllShows();
      var empty = document.querySelector(this.config.emptySelector);
      if (empty) empty.style.display = 'block';
    },
    hideAllShows: function() {
      if (!this.container) return;     
      var children = Array.from(this.container.children);
      children.forEach(function(child) {
        if (child.getAttribute('data-event-type') === 'generated') {
          child.style.display = 'none'; 
        }
      });
    },
    fetchShows: function(initialFilter) {
      var self = this;
      var fetchPromises = [];
      
      var golsieUpcomingUrl = 'https://rest.bandsintown.com/artists/' + 
        Config.bandsintownArtistName + '/events?app_id=' + 
        Config.bandsintownApiKey + '&date=upcoming'; 
      var golsiePastUrl = 'https://rest.bandsintown.com/artists/' + 
        Config.bandsintownArtistName + '/events?app_id=' + 
        Config.bandsintownApiKey + '&date=past';
      
      fetchPromises.push(
        fetch(golsieUpcomingUrl).then(function(r) { return r.json(); }),
        fetch(golsiePastUrl).then(function(r) { return r.json(); })
      );
      
      if (Config.bandsintownOtherArtists && Config.bandsintownOtherArtists.length > 0) {
        Config.bandsintownOtherArtists.forEach(function(artist) {
          var upcomingUrl = 'https://rest.bandsintown.com/artists/' + 
            artist.name + '/events?app_id=' + 
            artist.apiKey + '&date=upcoming';
          
          var pastUrl = 'https://rest.bandsintown.com/artists/' + 
            artist.name + '/events?app_id=' + 
            artist.apiKey + '&date=past';
          
          fetchPromises.push(
            fetch(upcomingUrl).then(function(r) { return r.json(); }),
            fetch(pastUrl).then(function(r) { return r.json(); })
          );
        });
      }
      
      Promise.all(fetchPromises)
        .then(function(results) {
          var golsieUpcoming = results[0] || [];
          var golsiePast = results[1] || [];
          
          golsieUpcoming.forEach(function(show) {
            show.isGolsie = true;
          });
          golsiePast.forEach(function(show) {
            show.isGolsie = true;
          });
          
          var otherUpcoming = [];
          var otherPast = [];
          
          for (var i = 2; i < results.length; i += 2) {
            var upcoming = results[i] || [];
            var past = results[i + 1] || [];
            
            upcoming.forEach(function(show) {
              show.isGolsie = false;
            });
            past.forEach(function(show) {
              show.isGolsie = false;
            });
            
            otherUpcoming = otherUpcoming.concat(upcoming);
            otherPast = otherPast.concat(past);
          }
          
          self.state.golsieShows = golsieUpcoming.concat(golsiePast);
          self.state.otherShows = otherUpcoming.concat(otherPast);
          self.state.upcomingShows = golsieUpcoming.concat(otherUpcoming);
          self.state.pastShows = golsiePast.concat(otherPast);
          self.state.allShows = self.state.upcomingShows.concat(self.state.pastShows);
          
          self.state.isCached = true;
          var filterToApply = initialFilter || Config.showsDefaultFilter;
          var validFilters = ['all', 'golsie', 'other', 'previous'];
          if (validFilters.indexOf(filterToApply) === -1) {
            filterToApply = Config.showsDefaultFilter;
          }
          self.applyFilter(filterToApply);        
        })
        .catch(function(error) {
          console.error('[Golsie] Shows fetch error:', error);
          self.hideLoading();
          self.showEmpty();
        });
    },
    applyFilter: function(filterType) {
      var self = this;
      self.state.currentFilter = filterType;
      var showsToDisplay = [];
      
      switch(filterType) {
        case 'all':
          showsToDisplay = self.state.upcomingShows;
          break;
          
        case 'golsie':
          showsToDisplay = self.state.upcomingShows.filter(function(show) {
            return show.isGolsie === true;
          });
          break;
          
        case 'other':
          showsToDisplay = self.state.upcomingShows.filter(function(show) {
            return show.isGolsie === false;
          });
          break;
          
        case 'previous':
          showsToDisplay = self.state.pastShows;
          break;
          
        default:
          showsToDisplay = self.state.upcomingShows;
      }
      
      self.state.filteredShows = showsToDisplay;
      self.renderShows(showsToDisplay);
      self.updateFilterButtons(filterType);
      self.updateCategoryTagVisibility(filterType);
    },
    updateFilterButtons: function(activeFilter) {
      var buttons = document.querySelectorAll('[data-filter]');
      buttons.forEach(function(button) {
        var filterType = button.getAttribute('data-filter');
        if (filterType === activeFilter) {
          button.classList.add('active');
        } else {
          button.classList.remove('active');
        }
      });
    },
    setupFilterButtons: function() {
      var self = this;
      var buttons = document.querySelectorAll('[data-filter]');
      buttons.forEach(function(button) {
        button.addEventListener('click', function() {
          var filterType = this.getAttribute('data-filter');
          self.showLoading();
          setTimeout(function() {
            self.applyFilter(filterType);
          }, 200);
        });
      });
      self.updateFilterButtons(Config.showsDefaultFilter);
    },
    updateCategoryTagVisibility: function(filterType) {
      if (!this.container) return;
      
      var allTags = this.container.querySelectorAll('[data-target="category-tag"]');
      
      allTags.forEach(function(tag) {
        // Show tags only on "ALL" filter
        if (filterType === 'all') {
          tag.style.display = 'flex';
        } else {
          tag.style.display = 'none';
        }
      });
    },
    renderShows: function(shows) {
      var self = this;
      this.hideAllShows();
      var children = Array.from(self.container.children);
      children.forEach(function(child) {
        if (child !== self.template && child.getAttribute('data-event-type') === 'generated') {
          self.container.removeChild(child);
        }
      });
      
      setTimeout(function() {
        self.hideLoading();
        
        if (shows.length === 0) {
          self.showEmpty();
          return;
        }        
        var sortedShows;
        if (self.state.currentFilter === 'previous') {
          sortedShows = shows.sort(function(a, b) {
            return new Date(b.datetime) - new Date(a.datetime);
          });
        } else {
          sortedShows = shows.sort(function(a, b) {
            return new Date(a.datetime) - new Date(b.datetime);
          });
        } 
        var displayShows = sortedShows.slice(0, Config.showsMaxDisplay);
        displayShows.forEach(function(show) {
          self.createShowItem(show);
        });
      }, Config.showsLoadingMinTime);
    },
    createShowItem: function(show) {
      var item = this.template.cloneNode(true);
      item.style.display = 'grid';
      item.setAttribute('data-event-type', 'generated');
      item.setAttribute('data-event-id', show.id);
      if (show.isGolsie) {
        item.setAttribute('data-event-artist-type', 'golsie');
      } else {
        item.setAttribute('data-event-artist-type', 'other');
      }
      var date = new Date(show.datetime);
      var dateFormatted = this.formatDate(date);
      var timeFormatted = this.formatTime(date);
      var manualDate = item.getAttribute('data-event-date');
      var manualTime = item.getAttribute('data-event-time');
      var manualVenue = item.getAttribute('data-event-venue');
      var manualLocation = item.getAttribute('data-event-location');
      var dateEl = item.querySelector('[data-target="date"]');
      if (dateEl) dateEl.textContent = manualDate || dateFormatted;
      var timeEl = item.querySelector('[data-target="time"]');
      if (timeEl) timeEl.textContent = manualTime || timeFormatted;
      var venueEl = item.querySelector('[data-target="venue"]');
      if (venueEl) venueEl.textContent = manualVenue || show.venue.name;
      var locationEl = item.querySelector('[data-target="location"]');
      if (locationEl) {
        var apiLocation = show.venue.city + ', ' + show.venue.country;
        locationEl.textContent = manualLocation || apiLocation;
      }
      var manualTicketUrl = item.getAttribute('data-event-ticket-url');
      var manualTicketText = item.getAttribute('data-event-ticket-text');
      var ticketBtn = item.querySelector('[data-target="ticket-button"]');
      if (ticketBtn) {
        var ticketText = item.querySelector('[data-target="ticket-text"]');
        var ticketUrl = manualTicketUrl;
        if (!ticketUrl) {
          if (show.offers && show.offers.length > 0 && show.offers[0].url) {
            ticketUrl = show.offers[0].url;
          } else {
            ticketUrl = show.url;
          }
        }
        var buttonText = manualTicketText;
        if (!buttonText) {
          if (show.offers && show.offers.length > 0 && show.offers[0].url) {
            buttonText = 'Tickets';
          } else if (show.free) {
            buttonText = 'Free';
          } else {
            buttonText = 'Tickets';
          }
        }
        if (this.state.currentFilter === 'previous') {
          buttonText = 'Ended';
          ticketBtn.style.opacity = '0.6';
        }
        ticketBtn.href = ticketUrl;
        ticketBtn.target = '_blank';
        if (ticketText) ticketText.textContent = buttonText;
      }
      var manualAddress = item.getAttribute('data-event-address');
      var apiAddress = this.getFullAddress(show.venue);
      var fullAddress = manualAddress || apiAddress;
      var addressText = item.querySelector('[data-target="address-text"]');
      if (addressText) addressText.textContent = fullAddress;
      var mapsLink = item.querySelector('[data-target="maps-link"]');
      if (mapsLink) {
        var fullAddressForMaps = this.getFullAddressForMaps(show.venue);
        if (fullAddressForMaps) {
          var mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(fullAddressForMaps);
          mapsLink.href = mapsUrl;
          mapsLink.target = '_blank';
        } else if (show.venue.latitude && show.venue.longitude) {
          var mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + show.venue.latitude + ',' + show.venue.longitude;
          mapsLink.href = mapsUrl;
          mapsLink.target = '_blank';
        } else {
          mapsLink.style.display = 'none';
        }
      }
      var manualDescription = item.getAttribute('data-event-description');
      var apiDescription = show.description || 'No description available';
      var fullDescription = manualDescription || apiDescription;
      var descText = item.querySelector('[data-target="description-text"]');
      if (descText) descText.textContent = fullDescription;
      var categoryTag = item.querySelector('[data-target="category-tag"]');
      if (categoryTag) {
        var tagText = categoryTag.querySelector('[data-target="category-tag-text"]');
        var otherTagColor = item.getAttribute('data-other-tag-color') || '#FF6B00';
        if (show.isGolsie) {
          if (tagText) tagText.textContent = 'GOLSIE';
        } else {
          if (tagText) tagText.textContent = 'OTHER';
          categoryTag.style.backgroundColor = otherTagColor;
        }
        if (this.state.currentFilter === 'all') {
          categoryTag.style.display = 'flex';
        } else {
          categoryTag.style.display = 'none';
        }
      }
      this.attachToggleHandlers(item);
      this.container.appendChild(item);
    },
    formatDate: function(date) {
      var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      var days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      var month = months[date.getMonth()];
      var day = date.getDate();
      var dayName = days[date.getDay()];
      return month + ' ' + day + ' ' + dayName;
    },
    formatTime: function(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      return hours + ':' + minutes + ' ' + ampm;
    },
    getFullAddress: function(venue) {
      var parts = [];
      if (venue.street_address) parts.push(venue.street_address);
      return parts.length > 0 ? parts.join(', ') : 'Address not available';
    },
    getFullAddressForMaps: function(venue) {
      var parts = [];
      if (venue.street_address) parts.push(venue.street_address);
      if (venue.city) parts.push(venue.city);
      if (venue.region) parts.push(venue.region);
      if (venue.country) parts.push(venue.country);
      return parts.length > 0 ? parts.join(', ') : '';
    },
    attachToggleHandlers: function(item) {
      var self = this;
      var addressBtn = item.querySelector('[data-action="toggle-address"]');
      var addressContent = item.querySelector('[data-target="address-content"]');
      if (addressBtn && addressContent) {
        addressBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          document.querySelectorAll('[data-action="toggle-address"]').forEach(function(otherBtn) {
            if (otherBtn !== addressBtn) {
              var otherContent = otherBtn.parentElement.querySelector('[data-target="address-content"]');
              if (otherContent && otherContent.getAttribute('data-expanded') === 'true') {
                otherBtn.style.display = 'block';
                otherContent.style.display = 'none';
                otherContent.setAttribute('data-expanded', 'false');
              }
            }
          });
          addressBtn.style.display = 'none';
          addressContent.style.display = 'flex';
          addressContent.setAttribute('data-expanded', 'true');
        });
      }
      var descBtn = item.querySelector('[data-action="toggle-description"]');
      var descPopup = item.querySelector('[data-target="description-popup"]');
      var descClose = item.querySelector('[data-action="close-description"]');
      if (descBtn && descPopup) {
        descBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          document.querySelectorAll('[data-action="toggle-address"]').forEach(function(addrBtn) {
            var addrContent = addrBtn.parentElement.querySelector('[data-target="address-content"]');
            if (addrContent && addrContent.getAttribute('data-expanded') === 'true') {
              addrBtn.style.display = 'block';
              addrContent.style.display = 'none';
              addrContent.setAttribute('data-expanded', 'false');
            }
          });
          document.querySelectorAll('[data-target="description-popup"]').forEach(function(popup) {
            if (popup !== descPopup) {
              popup.style.display = 'none';
              popup.setAttribute('data-visible', 'false');
            }
          });
          var isVisible = descPopup.getAttribute('data-visible') === 'true';
          if (isVisible) {
            descPopup.style.display = 'none';
            descPopup.setAttribute('data-visible', 'false');
          } else {
            descPopup.style.display = 'block';
            descPopup.setAttribute('data-visible', 'true');
          }
        });
        if (descClose) {
          descClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            descPopup.style.display = 'none';
            descPopup.setAttribute('data-visible', 'false');
          });
        }
        document.addEventListener('click', function(e) {
          if (!descPopup.contains(e.target) && !descBtn.contains(e.target)) {
            descPopup.style.display = 'none';
            descPopup.setAttribute('data-visible', 'false');
          }
        });
      }
    }
  };
  setTimeout(function() {
    ShowsSystem.init();
  }, Config.galleryComponentLoadDelay);

  var CarouselSystem = {
    carousel: null,
    
    createCarousel: function(customConfig) {
      return {
        config: customConfig || Config.carouselSelectors,
        animationDuration: Config.carouselAnimationDuration,
        track: null,
        container: null,
        items: [],
        originalCount: 0,
        currentIndex: 0,
        isAnimating: false,
        isMobile: window.innerWidth <= 768,
        touchStartX: 0,
        touchEndX: 0,
        touchStartY: 0,
        touchEndY: 0,
        
        init: function() {
          this.track = document.querySelector(this.config.track);
          this.container = document.querySelector(this.config.container);
          
          if (!this.track || !this.container) return false;
          
          var originalItems = Array.from(this.track.querySelectorAll(this.config.item));
          if (originalItems.length === 0) return false;
          
          this.originalCount = originalItems.length;
          
          // Clone items for infinite loop
          for (var i = 0; i < 2; i++) {
            var clone = originalItems[i].cloneNode(true);
            clone.classList.add('clone');
            this.track.appendChild(clone);
          }
          
          for (var i = originalItems.length - 1; i >= originalItems.length - 2; i--) {
            var clone = originalItems[i].cloneNode(true);
            clone.classList.add('clone');
            this.track.insertBefore(clone, this.track.firstChild);
          }
          
          this.items = Array.from(this.track.querySelectorAll(this.config.item));
          this.currentIndex = 2;
          
          this.setupWheel();
          this.setupArrows();
          this.setupTouch();
          this.setupClicks();
          
          var self = this;
          window.addEventListener('resize', function() {
            self.isMobile = window.innerWidth <= 768;
            self.goTo(self.currentIndex, false);
          });
          
          this.goTo(this.currentIndex, false);
          var self = this;
            setTimeout(function() {
              self.container.classList.add('carousel-ready');
            }, 50);
            
          return true;
        },
        
        setupWheel: function() {
          var self = this;
          var section = document.querySelector(this.config.section);
          if (!section) return;
          
          section.addEventListener('wheel', function(e) {
            if (self.isMobile) return;
            e.preventDefault();
            if (self.isAnimating) return;
            
            if (e.deltaY > 0) {
              self.next();
            } else {
              self.prev();
            }
          }, { passive: false });
        },
        
        setupTouch: function() {
          var self = this;
          
          this.container.addEventListener('touchstart', function(e) {
            if (!self.isMobile) return;
            self.touchStartX = e.changedTouches[0].screenX;
            self.touchStartY = e.changedTouches[0].screenY;
          }, { passive: true });
          
          this.container.addEventListener('touchend', function(e) {
            if (!self.isMobile) return;
            self.touchEndX = e.changedTouches[0].screenX;
            self.touchEndY = e.changedTouches[0].screenY;
            self.handleSwipe();
          }, { passive: true });
        },
        
        handleSwipe: function() {
          var deltaX = this.touchEndX - this.touchStartX;
          var deltaY = this.touchEndY - this.touchStartY;
          var minSwipeDistance = 50;
          
          if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
              this.prev();
            } else {
              this.next();
            }
          }
        },
        
        setupArrows: function() {
          var self = this;
          var left = document.querySelector(this.config.arrowLeft);
          var right = document.querySelector(this.config.arrowRight);
          
          if (left) left.onclick = function() { self.prev(); };
          if (right) right.onclick = function() { self.next(); };
        },
        
        setupClicks: function() {
          var self = this;
          
          this.items.forEach(function(item, itemIndex) {
            item.onclick = function(e) {
              if (itemIndex !== self.currentIndex) {
                e.preventDefault();
                e.stopPropagation();
                
                var distance = itemIndex - self.currentIndex;
                var shouldOpenModal = item.getAttribute('data-modal-type');
                
                if (Math.abs(distance) === 1) {
                  if (distance > 0) {
                    self.next();
                  } else {
                    self.prev();
                  }
                } else {
                  self.currentIndex = itemIndex;
                  self.goTo(itemIndex, true);
                  self.scheduleLoopCheck();
                }
                
                // After centering, trigger modal on the NEW centered item (not the clone)
                if (shouldOpenModal) {
                  setTimeout(function() {
                    // Click the item that's NOW in center (after loop swap)
                    self.items[self.currentIndex].click();
                  }, self.animationDuration + 50);
                }
                return;
              }
            };
          });
        },
        
        next: function() {
          if (!this.isMobile && this.isAnimating) return;
          
          this.currentIndex++;
          
          if (this.currentIndex >= this.items.length) {
            this.currentIndex = 2;
          }
          
          this.goTo(this.currentIndex, true);
          this.scheduleLoopCheck();
        },
        
        prev: function() {
          if (!this.isMobile && this.isAnimating) return;
          
          this.currentIndex--;
          
          if (this.currentIndex < 0) {
            this.currentIndex = this.items.length - 3;
          }
          
          this.goTo(this.currentIndex, true);
          this.scheduleLoopCheck();
        },
        
        goTo: function(index, animate) {
          var self = this;
          
          if (index < 0 || index >= this.items.length) {
            index = Math.max(0, Math.min(index, this.items.length - 1));
          }
          
          this.currentIndex = index;
          
          var item = this.items[index];
          if (!item) return;
          
          var itemLeft = item.offsetLeft;
          var itemWidth = item.offsetWidth;
          var itemCenter = itemLeft + (itemWidth / 2);
          
          var containerWidth = this.container.offsetWidth;
          var containerCenter = containerWidth / 2;
          
          var offset = containerCenter - itemCenter;
          
          if (animate) {
            this.isAnimating = true;
            this.track.style.transition = 'transform ' + this.animationDuration + 'ms ease';
            setTimeout(function() {
              self.isAnimating = false;
            }, this.animationDuration);
          } else {
            this.track.style.transition = 'none';
          }
          
          this.track.style.transform = 'translateX(' + offset + 'px)';
          this.updateStates();
        },
        
        scheduleLoopCheck: function() {
          var self = this;
          
          setTimeout(function() {
            if (self.currentIndex >= self.originalCount + 2) {
              self.track.style.transition = 'none';
              self.currentIndex = 2;
              self.goTo(self.currentIndex, false);
              void self.track.offsetWidth;
            }
            
            if (self.currentIndex < 2) {
              self.track.style.transition = 'none';
              self.currentIndex = self.originalCount + 1;
              self.goTo(self.currentIndex, false);
              void self.track.offsetWidth;
            }
          }, this.animationDuration + 20);
        },
        
        updateStates: function() {
          var self = this;
          
          this.items.forEach(function(item, i) {
            var distance = Math.abs(i - self.currentIndex);
            
            item.classList.remove(self.config.centerClass, self.config.sideClass, self.config.farClass);
            
            if (distance === 0) {
              item.classList.add(self.config.centerClass);
              item.style.opacity = '1';
            } else if (distance === 1) {
              item.classList.add(self.config.sideClass);
              item.style.opacity = '0.6';
            } else if (distance === 2) {
              item.classList.add(self.config.farClass);
              item.style.opacity = '0.4';
            } else {
              item.style.opacity = '0.2';
            }
            
            item.style.transition = 'opacity ' + self.animationDuration + 'ms ease';
          });
        }
      };
    },
    
    init: function(customConfig) {
      var carousel = this.createCarousel(customConfig);
      var initialized = carousel.init();
      if (initialized) {
        this.carousel = carousel;
      }
      return carousel;
    }
  };

  // Carousel Filter System
  var CarouselFilterSystem = {
    musicCarousel: null,
    videoCarousel: null,
    
    init: function() {
      var self = this;
      var filterButtons = document.querySelectorAll('[data-carousel-filter]');
      
      if (filterButtons.length === 0) {
        CarouselSystem.init();
        return;
      }
      
      // Show both carousels initially for proper initialization
      var musicSection = document.querySelector('[data-carousel-type="music"]');
      var videoSection = document.querySelector('[data-carousel-type="video"]');
      
      if (musicSection) musicSection.style.display = 'flex';
      if (videoSection) videoSection.style.display = 'flex';
      
      // Initialize music carousel
      if (musicSection) {
       this.musicCarousel = CarouselSystem.createCarousel({
          section: '.musiccarouselsection',
          container: '[data-carousel-type="music"]',
          track: '[data-carousel-type="music"] .carouseltrack',
          item: '[data-carousel-type="music"] .musicitem',
          arrowLeft: '.arrowleft',
          arrowRight: '.arrowright',
          centerClass: 'item-center',
          sideClass: 'item-side',
          farClass: 'item-far'
        });
        var musicInit = this.musicCarousel.init();
      }

      // Initialize video carousel  
      if (videoSection) {
        this.videoCarousel = CarouselSystem.createCarousel({
          section: '.musiccarouselsection',
          container: '[data-carousel-type="video"]',
          track: '[data-carousel-type="video"] .carouseltrack',
          item: '[data-carousel-type="video"] .musicitem',
          arrowLeft: '.arrowleft',
          arrowRight: '.arrowright',
          centerClass: 'item-center',
          sideClass: 'item-side',
          farClass: 'item-far'
        });
        var videoInit = this.videoCarousel.init();
        console.log('[Carousel] Video init:', videoInit);
      }

      // Setup filter button clicks
      filterButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          var filterType = this.getAttribute('data-carousel-filter');
          self.switchCarousel(filterType);
        });
      });

      // Wait for both to fully initialize, THEN hide video
      setTimeout(function() {
        if (self.musicCarousel) self.musicCarousel.goTo(2, false);
        if (self.videoCarousel) self.videoCarousel.goTo(2, false);
        
        self.switchCarousel('music');
        self.setupSharedArrows('music'); // Attach arrows to music initially
      }, 200);
    },
    
    switchCarousel: function(type) {
      var self = this;
      var musicSection = document.querySelector('[data-carousel-type="music"]');
      var videoSection = document.querySelector('[data-carousel-type="video"]');
      var filterButtons = document.querySelectorAll('[data-carousel-filter]');
      
      // Update button states
      filterButtons.forEach(function(button) {
        var btnType = button.getAttribute('data-carousel-filter');
        if (btnType === type) {
          button.classList.add('activecarouselfilter');
        } else {
          button.classList.remove('activecarouselfilter');
        }
      });
      
      // Show/hide carousels and reset to first item
      if (type === 'music') {
        if (musicSection) musicSection.style.display = 'flex';
        if (videoSection) videoSection.style.display = 'none';
        
        setTimeout(function() {
          if (self.musicCarousel) {
            self.musicCarousel.currentIndex = 2; // Reset to first real item
            self.musicCarousel.goTo(2, false);
          }
        }, 50);
        
      } else if (type === 'video') {
        if (musicSection) musicSection.style.display = 'none';
        if (videoSection) videoSection.style.display = 'flex';
        
        setTimeout(function() {
          if (self.videoCarousel) {
            self.videoCarousel.currentIndex = 2; // Reset to first real item
            self.videoCarousel.goTo(2, false);
          }
        }, 50);
      }
      
      // Re-attach arrow handlers for active carousel
      this.setupSharedArrows(type);
    },

    setupSharedArrows: function(activeType) {
      var self = this;
      var leftArrow = document.querySelector('.arrowleft');
      var rightArrow = document.querySelector('.arrowright');
      
      if (!leftArrow || !rightArrow) return;
      
      // Remove old handlers by cloning
      var newLeft = leftArrow.cloneNode(true);
      var newRight = rightArrow.cloneNode(true);
      leftArrow.parentNode.replaceChild(newLeft, leftArrow);
      rightArrow.parentNode.replaceChild(newRight, rightArrow);
      
      // Attach new handlers for active carousel
      if (activeType === 'music' && self.musicCarousel) {
        newLeft.onclick = function() { self.musicCarousel.prev(); };
        newRight.onclick = function() { self.musicCarousel.next(); };
      } else if (activeType === 'video' && self.videoCarousel) {
        newLeft.onclick = function() { self.videoCarousel.prev(); };
        newRight.onclick = function() { self.videoCarousel.next(); };
      }
    }
  };

  setTimeout(function() {
    CarouselFilterSystem.init();
  }, Config.galleryComponentLoadDelay);

  var SpotifyHelper = {
    fetchOEmbed: function(spotifyUrl, callback) {
      fetch('https://open.spotify.com/oembed?url=' + encodeURIComponent(spotifyUrl))
        .then(function(response) {
          if (!response.ok) throw new Error('Spotify oEmbed failed');
          return response.json();
        })
        .then(function(data) { callback(null, data); })
        .catch(function(error) { callback(error, null); });
    }
  };
  
  var DeviceHelper = {
    isMobile: function() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    isIOS: function() {
      return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
  };

  var ModalSystem = {
    overlay: null,
    container: null,
    isOpen: false,
    scrollPosition: 0,
    currentModalType: null,
    currentContent: null,
    modalTypes: {},
    config: {
      overlayClass: 'modaloverlay',
      containerClass: 'modalcontainer',
      activeClass: 'modal-active',
      animationDuration: Config.modalAnimationDuration
    },
    init: function() {
      this.overlay = document.querySelector('.' + this.config.overlayClass);
      if (!this.overlay) return false;
      this.container = this.overlay.querySelector('.' + this.config.containerClass);
      if (!this.container) return false;
      this.overlay.style.display = 'none';
      this.setupEventListeners();
      return true;
    },
    registerModalType: function(typeName, config) {
      this.modalTypes[typeName] = {
        contentClass: config.contentClass || null,
        onClose: config.onClose || null,
        afterClose: config.afterClose || null,
        updateContent: config.updateContent || null
      };
    },
    setupEventListeners: function() {
      var self = this;
      this.overlay.addEventListener('click', function(e) {
        if (e.target === self.overlay) self.close();
      });
      this.overlay.addEventListener('click', function(e) {
        if (e.target.classList.contains('modalclose') || e.target.closest('.modalclose')) {
          e.preventDefault();
          e.stopPropagation();
          self.close();
        }
      });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && self.isOpen) self.close();
      });
    },
    open: function(modalType, data) {
      if (!this.overlay || this.isOpen) return;
      var typeConfig = this.modalTypes[modalType];
      if (!typeConfig) return;
      var content = this.container.querySelector('.' + typeConfig.contentClass);
      if (!content) return;
      this.currentModalType = modalType;
      this.currentContent = content;
      content.style.display = 'flex';
      if (typeConfig.updateContent) {
        typeConfig.updateContent.call(this, content, data);
      }
      this.scrollPosition = window.scrollY;
      document.body.classList.add('no-scroll');
      document.body.style.top = -this.scrollPosition + 'px';
      this.overlay.style.display = 'flex';
      void this.overlay.offsetWidth;
      this.overlay.classList.add(this.config.activeClass);
      this.isOpen = true;
    },
    close: function() {
      if (!this.overlay || !this.isOpen) return;
      var self = this;
      var typeConfig = this.modalTypes[this.currentModalType];
      if (typeConfig && typeConfig.onClose) {
        typeConfig.onClose.call(this, this.currentContent);
      }
      this.overlay.classList.remove(this.config.activeClass);
      setTimeout(function() {
        self.overlay.style.display = 'none';
        document.body.classList.remove('no-scroll');
        document.body.style.top = '';
        window.scrollTo(0, self.scrollPosition);
        self.isOpen = false;
        if (typeConfig && typeConfig.afterClose) {
          typeConfig.afterClose.call(self);
        }
        if (self.currentContent) {
          self.currentContent.style.display = 'none';
        }
        self.currentModalType = null;
        self.currentContent = null;
      }, this.config.animationDuration);
    },
    isModalOpen: function() {
      return this.isOpen;
    }
  };
  
  var modalReady = ModalSystem.init();

  if (modalReady) {
    ModalSystem.registerModalType('songlink', {
      contentClass: 'modalcontentsonglink',
      updateContent: function(content, data) {
        var self = this;
        var s = ModalSelectors.songlink;
        var dynamicContent = content.querySelector(s.dynamicContent);
        var loadingIndicator = self.container.querySelector(s.loadingIndicator);
        var thumbnail = content.querySelector(s.thumbnail);
        var titleElement = content.querySelector(s.title);
        var spotifyContainer = content.querySelector(s.spotifyContainer);
        var songlinkIframe = content.querySelector(s.songlinkIframe);
        var songlinkIframeContainer = content.querySelector(s.songlinkIframeContainer);
        
        var loadingState = {thumbnail: false, spotify: false, songlink: false, minimumTimeElapsed: false, timeout: false};
        var errorState = {spotify: false, songlink: false};
        var loadingStartTime = Date.now();
        
        // Helper functions for loading Spotify and Songlink
        function loadSpotifyPlayer(oembedData) {
          if (!spotifyContainer || !oembedData || !oembedData.iframe_url) {
            loadingState.spotify = true;
            return;
          }
          
          // Check if iframe already exists (retry scenario)
          var spotifyIframe = spotifyContainer.querySelector('iframe');
          
          if (!spotifyIframe) {
            // First load - create new iframe
            spotifyContainer.innerHTML = '';
            spotifyContainer.style.display = 'block';
            spotifyIframe = document.createElement('iframe');
            spotifyIframe.style.width = '100%';
            spotifyIframe.style.height = s.spotifyiframe_height + 'px';
            spotifyIframe.style.border = 'none';
            spotifyIframe.style.borderRadius = '12px';
            spotifyIframe.setAttribute('frameborder', '0');
            spotifyIframe.setAttribute('allowfullscreen', '');
            spotifyIframe.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
            spotifyIframe.setAttribute('loading', 'lazy');
            spotifyContainer.appendChild(spotifyIframe);
          } else {
            // Retry or reopen - hide refresh button, show iframe
            IframeRefreshHelper.hideError(spotifyContainer, spotifyIframe);
            spotifyIframe.style.display = 'block';
          }
          
          spotifyIframe.src = oembedData.iframe_url;
          
          spotifyIframe.onload = function() {
            setTimeout(function() {
              spotifyContainer.style.transition = 'opacity 0.4s ease';
              spotifyContainer.style.opacity = '1';
            }, 150);
            loadingState.spotify = true;
            errorState.spotify = false;
            checkAllReady();
          };
          
          spotifyIframe.onerror = function() {
            console.warn('[Golsie] Spotify iframe failed to load');
            errorState.spotify = true;
            loadingState.spotify = true;
            // Only show refresh if we have a valid URL
            if (oembedData && oembedData.iframe_url) {
              IframeRefreshHelper.showError(spotifyContainer, spotifyIframe, function() {
                console.log('[Golsie] Retrying Spotify iframe...');
                errorState.spotify = false;
                loadingState.spotify = false;
                loadSpotifyPlayer(oembedData);
              });
            } else {
              spotifyContainer.style.display = 'none';
            }
            checkAllReady();
          };
          
          var spotifyTimeout = DeviceHelper.isIOS() ? Config.spotifyTimeoutIOS : Config.spotifyTimeoutDesktop;
          setTimeout(function() {
            if (!loadingState.spotify && !errorState.spotify) {
              if (DeviceHelper.isIOS()) {
                console.warn('[Golsie] Spotify timeout on iOS - hiding player');
                spotifyContainer.style.display = 'none';
                loadingState.spotify = true;
              } else {
                console.warn('[Golsie] Spotify timeout - showing error');
                errorState.spotify = true;
                // Only show refresh if we have a valid URL
                if (oembedData && oembedData.iframe_url) {
                  IframeRefreshHelper.showError(spotifyContainer, spotifyIframe, function() {
                    console.log('[Golsie] Retrying Spotify iframe after timeout...');
                    errorState.spotify = false;
                    loadingState.spotify = false;
                    loadSpotifyPlayer(oembedData);
                  });
                } else {
                  spotifyContainer.style.display = 'none';
                }
              }
              loadingState.spotify = true;
              checkAllReady();
            }
          }, spotifyTimeout);
        }
        
        function loadSonglinkIframe(songUrl) {
          if (!songlinkIframe || !songUrl) {
            loadingState.songlink = true;
            return;
          }
          
          // Hide refresh button if exists, show iframe
          IframeRefreshHelper.hideError(songlinkIframeContainer, songlinkIframe);
          
          // Make sure iframe is visible (in case it was hidden on close)
          songlinkIframe.style.display = 'block';
          
          var embedUrl = 'https://song.link/embed?url=' + encodeURIComponent(songUrl);
          songlinkIframe.src = embedUrl;
          
          songlinkIframe.onload = function() {
            setTimeout(function() {
              songlinkIframe.style.transition = 'opacity 0.4s ease';
              songlinkIframe.style.opacity = '1';
              if (songlinkIframeContainer) {
                songlinkIframeContainer.style.transition = 'opacity 0.4s ease';
                songlinkIframeContainer.style.opacity = '1';
              }
            }, 400);
            loadingState.songlink = true;
            errorState.songlink = false;
            checkAllReady();
          };
          
          songlinkIframe.onerror = function() {
            console.warn('[Golsie] Songlink iframe failed to load');
            errorState.songlink = true;
            loadingState.songlink = true;
            // Only show refresh if we have a valid URL
            if (songlinkIframeContainer && songUrl) {
              IframeRefreshHelper.showError(songlinkIframeContainer, songlinkIframe, function() {
                console.log('[Golsie] Retrying Songlink iframe...');
                errorState.songlink = false;
                loadingState.songlink = false;
                loadSonglinkIframe(songUrl);
              });
            } else if (songlinkIframeContainer) {
              songlinkIframeContainer.style.display = 'none';
            }
            checkAllReady();
          };
          
          setTimeout(function() {
            if (!loadingState.songlink && !errorState.songlink) {
              console.warn('[Golsie] Songlink timeout - showing error');
              errorState.songlink = true;
              // Only show refresh if we have a valid URL
              if (songlinkIframeContainer && songUrl) {
                IframeRefreshHelper.showError(songlinkIframeContainer, songlinkIframe, function() {
                  console.log('[Golsie] Retrying Songlink iframe after timeout...');
                  errorState.songlink = false;
                  loadingState.songlink = false;
                  loadSonglinkIframe(songUrl);
                });
              } else if (songlinkIframeContainer) {
                songlinkIframeContainer.style.display = 'none';
              }
              loadingState.songlink = true;
              checkAllReady();
            }
          }, Config.modalLoadingTimeout);
        }
        
        if (dynamicContent) {
          dynamicContent.style.visibility = 'visible';
          dynamicContent.style.opacity = '1';
        }
        if (loadingIndicator) {
          loadingIndicator.style.display = 'block';
          loadingIndicator.style.opacity = '1';
          loadingIndicator.style.visibility = 'visible';
          loadingIndicator.style.zIndex = '999';
        }
        [thumbnail, titleElement, spotifyContainer, songlinkIframeContainer].forEach(function(el) {
          if (el) {
            el.style.opacity = '0';
            el.style.visibility = 'hidden';
          }
        });
        
        setTimeout(function() {
          loadingState.minimumTimeElapsed = true;
          checkAllReady();
        }, Config.modalLoadingMinTime);
        
        function checkAllReady() {
          var isSpotify = data.songUrl && data.songUrl.includes('spotify.com');
          var allReady = loadingState.minimumTimeElapsed && loadingState.songlink && (!isSpotify || (loadingState.thumbnail && loadingState.spotify));
          if (allReady || loadingState.timeout) {
            var elapsedTime = Date.now() - loadingStartTime;
            var remainingTime = Math.max(0, Config.modalLoadingMinTime - elapsedTime);
            setTimeout(function() {
              if (loadingIndicator) {
                loadingIndicator.style.transition = 'opacity 0.3s ease';
                loadingIndicator.style.opacity = '0';
                setTimeout(function() { loadingIndicator.style.display = 'none'; }, 300);
              }
              [thumbnail, titleElement, spotifyContainer].forEach(function(el) {
                if (el && !el.style.display.includes('none') && !errorState.spotify) {
                  el.style.visibility = 'visible';
                  el.style.transition = 'opacity 0.4s ease';
                  el.style.opacity = '1';
                }
              });
              if (songlinkIframeContainer && !errorState.songlink) {
                setTimeout(function() {
                  songlinkIframeContainer.style.visibility = 'visible';
                  songlinkIframeContainer.style.transition = 'opacity 0.6s ease';
                  songlinkIframeContainer.style.opacity = '1';
                }, Config.songlinkExtraDelay);
              }
            }, remainingTime);
          }
        }
        
        setTimeout(function() {
          loadingState.timeout = true;
          checkAllReady();
        }, Config.modalLoadingTimeout);
        
        if (thumbnail) {
          thumbnail.style.opacity = '0';
          thumbnail.style.display = 'block';
        }
        if (titleElement) titleElement.style.opacity = '0';
        if (spotifyContainer) {
          spotifyContainer.style.opacity = '0';
          spotifyContainer.style.display = 'block';
        }
        if (songlinkIframe) songlinkIframe.style.opacity = '0';
        if (songlinkIframeContainer) songlinkIframeContainer.style.opacity = '0';
        
        // Load Songlink iframe
        if (data.songUrl) {
          loadSonglinkIframe(data.songUrl);
        }
        
        // Load Spotify content if applicable
        if (data.songUrl && data.songUrl.includes('spotify.com')) {
          SpotifyHelper.fetchOEmbed(data.songUrl, function(error, oembedData) {
            if (error || !oembedData) {
              if (titleElement && data.songTitle) {
                titleElement.textContent = data.songTitle;
                setTimeout(function() {
                  titleElement.style.transition = 'opacity 0.4s ease';
                  titleElement.style.opacity = '1';
                }, Config.contentFadeInDelay);
              }
              loadingState.thumbnail = true;
              loadingState.spotify = true;
              checkAllReady();
              return;
            }
            if (thumbnail && oembedData.thumbnail_url) {
              thumbnail.src = oembedData.thumbnail_url;
              thumbnail.alt = oembedData.title || 'Album artwork';
              thumbnail.onload = function() {
                setTimeout(function() {
                  thumbnail.style.transition = 'opacity 0.4s ease';
                  thumbnail.style.opacity = '1';
                }, Config.contentFadeInDelay);
                loadingState.thumbnail = true;
                checkAllReady();
              };
              thumbnail.onerror = function() {
                thumbnail.style.display = 'none';
                loadingState.thumbnail = true;
                checkAllReady();
              };
            } else {
              loadingState.thumbnail = true;
            }
            if (titleElement && oembedData.title) {
              titleElement.textContent = oembedData.title;
              setTimeout(function() {
                titleElement.style.transition = 'opacity 0.4s ease';
                titleElement.style.opacity = '1';
              }, 150);
            }
            loadSpotifyPlayer(oembedData);
          });
        } else {
          if (titleElement && data.songTitle) {
            titleElement.textContent = data.songTitle;
            setTimeout(function() {
              titleElement.style.transition = 'opacity 0.4s ease';
              titleElement.style.opacity = '1';
            }, Config.contentFadeInDelay);
          }
          if (thumbnail) thumbnail.style.display = 'none';
          if (spotifyContainer) spotifyContainer.style.display = 'none';
          loadingState.thumbnail = true;
          loadingState.spotify = true;
        }
      },
      onClose: function(content) {},
      afterClose: function() {
        var content = this.container.querySelector('.modalcontent');
        if (!content) return;
        var s = ModalSelectors.songlink;
        
        // Reset Songlink iframe but don't delete it
        var songlinkIframe = content.querySelector(s.songlinkIframe);
        var songlinkIframeContainer = content.querySelector(s.songlinkIframeContainer);
        if (songlinkIframe) {
          songlinkIframe.src = 'about:blank';
          songlinkIframe.style.opacity = '0';
          songlinkIframe.style.display = 'none';
        }
        if (songlinkIframeContainer) {
          // Remove any refresh button
          var refreshBtn = songlinkIframeContainer.querySelector('.iframe-refresh-icon');
          if (refreshBtn) refreshBtn.remove();
          songlinkIframeContainer.style.opacity = '0';
        }
        
        // Reset Spotify iframe but don't delete it
        var spotifyContainer = content.querySelector(s.spotifyContainer);
        if (spotifyContainer) {
          var spotifyIframe = spotifyContainer.querySelector('iframe');
          if (spotifyIframe) {
            spotifyIframe.src = 'about:blank';
            spotifyIframe.style.display = 'none';
          }
          // Remove any refresh button
          var refreshBtn = spotifyContainer.querySelector('.iframe-refresh-icon');
          if (refreshBtn) refreshBtn.remove();
          spotifyContainer.style.opacity = '0';
        }
        
        var thumbnail = content.querySelector(s.thumbnail);
        if (thumbnail) {
          thumbnail.src = '';
          thumbnail.style.opacity = '0';
        }
        var titleElement = content.querySelector(s.title);
        if (titleElement) titleElement.style.opacity = '0';
      }
    });
    document.querySelectorAll('[data-song-url]').forEach(function(button) {
      button.addEventListener('click', function(e) {
        var modalType = this.getAttribute('data-modal-type');
        if (modalType && modalType !== 'songlink') {
          return; // Don't handle custom modals
        }
        e.preventDefault();
        var songUrl = this.getAttribute('data-song-url');
        var songTitle = this.getAttribute('data-song-title') || 'Golsie';
        if (!songUrl) return;
        ModalSystem.open('songlink', { songUrl: songUrl, songTitle: songTitle });
      });
    });
  }

  if (modalReady) {
    ModalSystem.registerModalType('youtube', {
      contentClass: 'modalcontentyoutubelink',
      updateContent: function(content, data) {
        var self = this;
        var s = ModalSelectors.youtube;
        var dynamicContent = content.querySelector(s.dynamicContent);
        var loadingIndicator = self.container.querySelector(s.loadingIndicator);
        var titleElement = content.querySelector(s.title);
        var videoWrapper = content.querySelector(s.videoWrapper);
        var youtubeIframe = content.querySelector(s.youtubeElement);
        
        var loadingState = { videoReady: false, minimumTimeElapsed: false, timeout: false };
        var errorState = { youtube: false };
        var loadingStartTime = Date.now();
        
        // Helper function for loading YouTube iframe
        function loadYouTubeIframe(videoUrl) {
          if (!youtubeIframe || !videoUrl) {
            loadingState.videoReady = true;
            return;
          }
          
          var videoId = videoUrl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
          if (!videoId || videoId[2].length !== 11) {
            console.warn('[Golsie] Invalid YouTube URL');
            errorState.youtube = true;
            loadingState.videoReady = true;
            // Only show refresh if we have some URL (even if invalid, user might want to retry)
            if (videoWrapper && videoUrl) {
              IframeRefreshHelper.showError(videoWrapper, youtubeIframe, function() {
                console.log('[Golsie] Retrying YouTube iframe...');
                errorState.youtube = false;
                loadingState.videoReady = false;
                loadYouTubeIframe(videoUrl);
              });
            } else if (videoWrapper) {
              videoWrapper.style.display = 'none';
            }
            checkReady();
            return;
          }
          
          // Hide refresh button if exists, show iframe
          IframeRefreshHelper.hideError(videoWrapper, youtubeIframe);
          
          // Make sure iframe is visible (in case it was hidden on close)
          youtubeIframe.style.display = 'block';
          
          youtubeIframe.src = 'https://www.youtube.com/embed/' + videoId[2] + '?autoplay=0&rel=0';
          
          youtubeIframe.onload = function() {
            loadingState.videoReady = true;
            errorState.youtube = false;
            checkReady();
          };
          
          youtubeIframe.onerror = function() {
            console.warn('[Golsie] YouTube iframe failed to load');
            errorState.youtube = true;
            loadingState.videoReady = true;
            // Only show refresh if we have a valid URL
            if (videoWrapper && videoUrl) {
              IframeRefreshHelper.showError(videoWrapper, youtubeIframe, function() {
                console.log('[Golsie] Retrying YouTube iframe...');
                errorState.youtube = false;
                loadingState.videoReady = false;
                loadYouTubeIframe(videoUrl);
              });
            } else if (videoWrapper) {
              videoWrapper.style.display = 'none';
            }
            checkReady();
          };
          
          setTimeout(function() {
            if (!loadingState.videoReady && !errorState.youtube) {
              console.warn('[Golsie] YouTube timeout - showing error');
              errorState.youtube = true;
              loadingState.videoReady = true;
              // Only show refresh if we have a valid URL
              if (videoWrapper && videoUrl) {
                IframeRefreshHelper.showError(videoWrapper, youtubeIframe, function() {
                  console.log('[Golsie] Retrying YouTube iframe after timeout...');
                  errorState.youtube = false;
                  loadingState.videoReady = false;
                  loadYouTubeIframe(videoUrl);
                });
              } else if (videoWrapper) {
                videoWrapper.style.display = 'none';
              }
              checkReady();
            }
          }, 3000);
        }
        
        if (dynamicContent) {
          dynamicContent.style.visibility = 'visible';
          dynamicContent.style.opacity = '1';
        }
        if (loadingIndicator) {
          loadingIndicator.style.display = 'block';
          loadingIndicator.style.opacity = '1';
          loadingIndicator.style.visibility = 'visible';
          loadingIndicator.style.zIndex = '999';
        }
        if (videoWrapper) {
          videoWrapper.style.opacity = '0';
          videoWrapper.style.visibility = 'hidden';
        }
        
        setTimeout(function() {
          loadingState.minimumTimeElapsed = true;
          checkReady();
        }, Config.modalLoadingMinTime);
        
        function checkReady() {
          if ((loadingState.minimumTimeElapsed && loadingState.videoReady) || loadingState.timeout) {
            var elapsedTime = Date.now() - loadingStartTime;
            var remainingTime = Math.max(0, Config.modalLoadingMinTime - elapsedTime);
            setTimeout(function() {
              if (loadingIndicator) {
                loadingIndicator.style.transition = 'opacity 0.3s ease';
                loadingIndicator.style.opacity = '0';
                setTimeout(function() { loadingIndicator.style.display = 'none'; }, 300);
              }
              if (videoWrapper && !errorState.youtube) {
                videoWrapper.style.visibility = 'visible';
                videoWrapper.style.transition = 'opacity 0.5s ease';
                videoWrapper.style.opacity = '1';
              }
            }, remainingTime);
          }
        }
        
        setTimeout(function() {
          loadingState.timeout = true;
          checkReady();
        }, Config.modalLoadingTimeout);
        
        if (titleElement && data.videoTitle) titleElement.textContent = data.videoTitle;
        
        if (data.videoUrl) {
          loadYouTubeIframe(data.videoUrl);
        }
      },
      onClose: function(content) {},
      afterClose: function() {
        var s = ModalSelectors.youtube;
        var content = this.container.querySelector(s.contentClass);
        if (!content) return;
        var loadingIndicator = content.querySelector(s.loadingIndicator);
        if (loadingIndicator) {
          loadingIndicator.style.display = 'none';
          loadingIndicator.style.opacity = '0';
        }
        var videoWrapper = content.querySelector(s.videoWrapper);
        var youtubeIframe = content.querySelector(s.youtubeElement);
        
        // Don't delete iframe! Just reset and hide it
        if (youtubeIframe) {
          youtubeIframe.src = 'about:blank';
          youtubeIframe.style.display = 'none';
        }
        
        // Remove any refresh button
        if (videoWrapper) {
          var refreshBtn = videoWrapper.querySelector('.iframe-refresh-icon');
          if (refreshBtn) refreshBtn.remove();
          videoWrapper.style.opacity = '0';
          videoWrapper.style.visibility = 'hidden';
        }
        
        var titleElement = content.querySelector(s.title);
        if (titleElement) titleElement.textContent = 'Watch Video';
      }
    });
    document.querySelectorAll('[data-video-url]').forEach(function(button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        var videoUrl = this.getAttribute('data-video-url');
        var videoTitle = this.getAttribute('data-video-title');
        if (!videoTitle) {
          var textElement = this.querySelector('.linkbuttonstext');
          videoTitle = textElement ? textElement.textContent.trim() : 'Watch Video';
        }
        if (!videoUrl) return;
        ModalSystem.open('youtube', { videoUrl: videoUrl, videoTitle: videoTitle });
      });
    });
  }
  
  // Custom Content Modal
  if (modalReady) {
    ModalSystem.registerModalType('custom', {
      contentClass: 'modalcontentcustom',
      updateContent: function(content, data) {
        var s = ModalSelectors.custom;
        var dynamicContent = content.querySelector(s.dynamicContent);
        var titleElement = content.querySelector(s.title);
        var loadingIndicator = this.container.querySelector(s.loadingIndicator);
        
        if (!dynamicContent) {
          console.error('[Golsie] Custom modal: dynamic content container not found');
          return;
        }
        
        // This sequence is required for proper modal overlay rendering
        if (dynamicContent) {
          dynamicContent.style.visibility = 'visible';
          dynamicContent.style.opacity = '1';
        }

        if (loadingIndicator) {
          loadingIndicator.style.display = 'block';
          loadingIndicator.style.opacity = '1';
          loadingIndicator.style.visibility = 'visible';
          loadingIndicator.style.zIndex = '999';
        }

        // NOW hide dynamic content initially (will be shown after loading)
        dynamicContent.style.opacity = '0';
        dynamicContent.style.visibility = 'hidden';

        // Set title if provided
        if (titleElement && data.title) {
          titleElement.textContent = data.title;
          titleElement.style.opacity = '0';
        }
        
        // Find source element by selector
        var sourceSelector = data.sourceSelector || (data.sourceClass ? '.' + data.sourceClass : null);
        if (!sourceSelector) {
          console.error('[Golsie] Custom modal: no sourceSelector or sourceClass provided');
          if (loadingIndicator) loadingIndicator.style.display = 'none';
          return;
        }

        var savedScrollY = window.scrollY;
        
        var sourceElement = document.querySelector(sourceSelector);
        if (!sourceElement) {
          console.error('[Golsie] Custom modal: source element not found:', sourceSelector);
          if (loadingIndicator) loadingIndicator.style.display = 'none';
          return;
        }
        
        // Store reference to source container for moving back on close
        var sourceContainer = sourceElement;
        var contentToMove;

        // Determine what to move:
        // If source element itself is the content (has children), move its children
        // Otherwise, move the source element itself
        if (sourceElement.children.length > 0) {
          // Move all children from source to a document fragment first
          contentToMove = document.createDocumentFragment();
          while (sourceElement.firstChild) {
            contentToMove.appendChild(sourceElement.firstChild);
          }
        } else {
          // Source element itself is the content
          contentToMove = sourceElement;
          sourceContainer = sourceElement.parentElement;
        }

        // Store source container reference on the modal content for retrieval on close
        dynamicContent.setAttribute('data-source-selector', sourceSelector);

        // Make content visible (in case source was hidden)
        if (contentToMove.style) {
          contentToMove.style.display = 'block';
          contentToMove.style.opacity = '1';
          contentToMove.style.visibility = 'visible';
        }

        // If it's a fragment, apply styles to all children
        if (contentToMove instanceof DocumentFragment) {
          Array.from(contentToMove.children).forEach(function(child) {
            child.style.display = 'block';
            child.style.opacity = '1';
            child.style.visibility = 'visible';
          });
        }

        // Clear modal content and MOVE (not clone) the content
        dynamicContent.innerHTML = '';
        dynamicContent.appendChild(contentToMove);

        window.scrollTo(0, savedScrollY);
        document.body.style.top = -savedScrollY + 'px';
        // FIX: Remove disabled attribute from submit buttons after moving
        // Webflow adds this in hidden forms, but we want it enabled in modal
        setTimeout(function() {
          var submitButtons = dynamicContent.querySelectorAll('input[type="submit"], button[type="submit"]');
          submitButtons.forEach(function(btn) {
            btn.removeAttribute('disabled');
          });
          
          // Add HTML5 validation listeners to re-enable proper button behavior
          var forms = dynamicContent.querySelectorAll('form');
          forms.forEach(function(form) {
            var inputs = form.querySelectorAll('input, textarea, select');
            var buttons = form.querySelectorAll('input[type="submit"], button[type="submit"]');
            
            function updateButtonState() {
              var isValid = form.checkValidity();
              buttons.forEach(function(btn) {
                if (isValid) {
                  btn.removeAttribute('disabled');
                } else {
                  btn.setAttribute('disabled', 'disabled');
                }
              });
            }
            
            // Listen to form changes
            inputs.forEach(function(input) {
              input.addEventListener('input', updateButtonState);
              input.addEventListener('change', updateButtonState);
            });
            // RE-INITIALIZE WEBFLOW FORMS (CRITICAL!)
            // This tells Webflow about the moved form so submissions work
            setTimeout(function() {
              if (window.Webflow && typeof window.Webflow.destroy === 'function') {
                try {
                  console.log('[Golsie] Re-initializing Webflow for moved form...');
                  window.Webflow.destroy();
                  window.Webflow.ready();
                  if (window.Webflow.require) {
                    window.Webflow.require('ix2').init();
                    console.log('[Golsie] Webflow re-initialized successfully');
                  }
                } catch (e) {
                  console.warn('[Golsie] Webflow re-init failed:', e.message);
                }
              }
            }, 150);
            // Initial check
            updateButtonState();
          });
        }, 50);
        
        // Show content with fade in
        setTimeout(function() {
          if (loadingIndicator) {
            loadingIndicator.style.transition = 'opacity 0.3s ease';
            loadingIndicator.style.opacity = '0';
            setTimeout(function() { 
              loadingIndicator.style.display = 'none'; 
            }, 300);
          }
          
          dynamicContent.style.visibility = 'visible';
          dynamicContent.style.transition = 'opacity 0.4s ease';
          dynamicContent.style.opacity = '1';
        }, Config.modalLoadingMinTime);
      },
      onClose: function(content) {
        // Optional: add any close logic here
      },
      afterClose: function() {
        var s = ModalSelectors.custom;
        var content = this.container.querySelector(s.contentClass);
        if (!content) return;
        
        var dynamicContent = content.querySelector(s.dynamicContent);
        if (dynamicContent) {
          // MOVE content back to original location (restore)
          var sourceSelector = dynamicContent.getAttribute('data-source-selector');
          
          if (sourceSelector) {
            var originalContainer = document.querySelector(sourceSelector);
            
            if (originalContainer) {
              // Move all children from modal back to original container
              while (dynamicContent.firstChild) {
                originalContainer.appendChild(dynamicContent.firstChild);
              }
            }
          }
          
          // Clean up
          dynamicContent.innerHTML = '';
          dynamicContent.style.opacity = '0';
          dynamicContent.style.visibility = 'hidden';
          dynamicContent.removeAttribute('data-source-selector');
        }
        
        var titleElement = content.querySelector(s.title);
        if (titleElement) {
          titleElement.textContent = '';
        }
        
        var loadingIndicator = content.querySelector(s.loadingIndicator);
        if (loadingIndicator) {
          loadingIndicator.style.display = 'none';
          loadingIndicator.style.opacity = '0';
        }
      }
    });
    
    // Setup event listeners for custom modal triggers
    document.querySelectorAll('[data-custom-modal]').forEach(function(button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        var sourceSelector = this.getAttribute('data-custom-modal');
        var modalTitle = this.getAttribute('data-modal-title');
        
        if (!sourceSelector) {
          console.error('[Golsie] Custom modal button missing data-custom-modal attribute');
          return;
        }
        
        ModalSystem.open('custom', { 
          sourceSelector: sourceSelector,
          title: modalTitle || ''
        });
      });
    });
  }

  window.GolsieModals = {
    open: function(modalType, data) {
      if (modalReady) ModalSystem.open(modalType, data);
    },
    close: function() {
      if (modalReady) ModalSystem.close();
    },
    isOpen: function() {
      return modalReady ? ModalSystem.isModalOpen() : false;
    }
  };
  
  window.ModalSystem = ModalSystem;

  window.GolsieMenu = {
    open: function() {
      if (!MenuSystem.state.menuOpen) MenuSystem.toggle();
    },
    close: function() {
      if (MenuSystem.state.menuOpen) MenuSystem.toggle();
    },
    isOpen: function() {
      return MenuSystem.state.menuOpen;
    }
  };
  
  window.GolsieGallery = {
    goTo: function(index) {
      if (GallerySystem.galleries[0]) {
        GallerySystem.galleries[0].goToImage(index);
      }
    },
    next: function() {
      if (GallerySystem.galleries[0]) {
        GallerySystem.galleries[0].next();
      }
    },
    prev: function() {
      if (GallerySystem.galleries[0]) {
        GallerySystem.galleries[0].prev();
      }
    },
    create: function(config) {
      return GallerySystem.init(config);
    }
  };
  
  window.GolsieNav = {
    update: function() {
      NavigationHelper.updateActiveState();
    }
  };
  
  window.GolsieShows = {
    refresh: function() {
      ShowsSystem.fetchShows();
    },
    getShows: function() {
      return ShowsSystem.state.shows;
    }
  };

  window.GolsieCarousel = {
    next: function() {
      if (CarouselSystem.carousel) {
        CarouselSystem.carousel.next();
      }
    },
    prev: function() {
      if (CarouselSystem.carousel) {
        CarouselSystem.carousel.prev();
      }
    },
    goTo: function(index) {
      if (CarouselSystem.carousel) {
        CarouselSystem.carousel.goTo(index, true);
      }
    }
  };
  
  window.GolsieScriptLoaded = true;
  document.body.classList.add('git-js');
  console.log('[Golsie] GitHub script v1.0.0 loaded');

});

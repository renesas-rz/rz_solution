let controller;

document$.subscribe(function() {
  // Abort previous listeners before binding new ones
  if (controller) controller.abort();
  controller = new AbortController();

  // Helper
  async function checkLinkExists(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      // response.ok returns true if the status code is 200-299
      return response.ok;
    } catch (error) {
      // Returns false if there is a network error or the domain doesn't exist
      return false;
    }
  }

  async function getJsonData(url) {
    try {
      const response = await fetch(url);

      // Check if the request succeeded (status 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return null
    }
  }

  function cleanPathSimple(path) {
    return path
      .split('/')
      .reduce((acc, part) => {
        if (part === '..') {
          acc.pop(); // Go up a directory
        } else if (part !== '.' && part !== '') {
          acc.push(part);
        }
        return acc;
      }, [])
      .join('/');
  }

  function _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function trimNonAlphanumeric(str) {
    // support CJK
    return str.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
  }

  function insertTextKeyword(link, markedTextwithPrefix, keyword) {
    // Chromium based browser highlight on first match (will scroll to)
    if (link.href.includes(":~:text=")) {
      // do nothing
    } else if (link.href.includes("rzv_ai_sdk")) {
      const _keyword = markedTextwithPrefix;
      var _highlight = "#:~:";
      var _added = [];
      if (link.href.includes("#")) {
        // do nothing
      } else {
        _keyword.forEach(_key => {
          const prev_key = _key.split("-,");
          let prev = prev_key.at(0);
          let __key = prev_key.at(1);
          // should not use - , and + on text keyword nor prefix
          // however its okay if convert to hexadecimal codes (as url)
          prev = prev.replaceAll('+', '%2b').replaceAll(',', '%2c').replaceAll('-', '%2d');
          __key = __key.replaceAll('+', '%2b').replaceAll(',', '%2c').replaceAll('-', '%2d');
          __key.split(' ').forEach((___key, i) => {
            if (!_added.includes(___key.toLowerCase()) && ___key !== "") {
              if (i == 0) {
                if (prev.at(-1) == "." && ___key.at(-1) == ".") {
                  _highlight += "text=" + prev.slice(0,-1) + "-," + ___key.toLowerCase().slice(0,-1) + "&";
                } else if (prev.at(-1) == ".") {
                  _highlight += "text=" + prev.slice(0,-1) + "-," + ___key.toLowerCase() + "&";
                } else if (___key.at(-1) == ".") {
                  _highlight += "text=" + prev + "-," + ___key.toLowerCase().slice(0,-1) + "&";
                }
                // just in case, doubled it
                _highlight += "text=" + prev + "-," + ___key.toLowerCase() + "&";
              } else {
                _highlight += "text=" + ___key.toLowerCase() + "&";
              }
              _added.push(___key.toLowerCase());
            }
          });
        });
        if (_keyword.length == 0) {
          keyword.replace(/[-+]/g, ' ').split(' ').forEach(__key => {
            if (!_added.includes(__key.toLowerCase()) && __key !== "") {
              _highlight += "text=" + __key.toLowerCase() + "&";
              _added.push(__key.toLowerCase());
            }
          });
        }
        link.href += _highlight.slice(0, -1);
      }
    }
  }

  function insertHighlightQuery(link, markedText, keyword) {
    // Highlight for MkDocs Material bases sites
    if (link.href.includes("?h=")) {
      // do nothing
    } else {
      const _keyword = markedText;
      var _uniqueKeyword = "";
      var _added = [];
      const _link = link.href.split("#");
      _keyword.forEach(_key => {
        const __candidate = trimNonAlphanumeric(_key.textContent.toLowerCase());
        if (!_added.includes(__candidate) && _key !== "") {
          _uniqueKeyword += __candidate + " ";
          _added.push(__candidate);
        }
      });
      if (_keyword.length > 0) {
        link.href = _link[0] + "?h=" + _uniqueKeyword.split(' ').sort((a, b) => b.length - a.length).join(' ');
      } else {
        link.href = _link[0] + "?h=" + trimNonAlphanumeric(keyword.toLowerCase());
      }
      if (_link.length > 1) {
        link.href += "#" + _link[1];
      }
    }
  }

  function insertHighlightQuery_v2(link, markedText, keyword) {
    // Highlight for MkDocs Material bases sites
    if (link.href.includes("?h=")) {
      // do nothing
    } else {
      const _keyword = markedText;
      var _uniqueKeyword = "";
      var _added = [];
      const _link = link.href.split("#");
      _keyword.forEach(_key => {
        const __candidate = trimNonAlphanumeric(_key.textContent.toLowerCase());
        if (!_added.includes(__candidate) && _key !== "") {
          _uniqueKeyword += __candidate + " ";
          _added.push(__candidate);
        }
      });
      if (_keyword.length > 0) {
        link.href = _link[0] + "?h=" + _uniqueKeyword.split(' ').sort((a, b) => b.length - a.length).join('&h=');
      } else {
        link.href = _link[0] + "?h=" + trimNonAlphanumeric(keyword.toLowerCase());
      }
      if (link.href.slice(-3) == "&h=") {
        link.href = link.href.slice(0, -3);
      }
      if (_link.length > 1) {
        link.href += "#" + _link[1];
      }
    }
  }

  function setTargetLinkAndTitle(link, search_link, __markedText) {
    if (!link.closest('p').hasAttribute('data-tooltip')) {
      var __matches = false;
      let _title = "";

      // compare to all base links of others sites
      search_link.forEach(base => {
        if (link.href.includes(base.link)) {
          __matches = true;

          link.target = "_blank";
          link.rel = "noopener noreferrer"; // Good security practice for new tabs

          var matches = false;
          has_versions.forEach(site => {
            if (link.href.includes(site) && !matches) {
              matches = true;
            }
          });
          if (matches) {
            const _ver = link.href.replace(base.link,'').replace(/\/.*/g, "").toLowerCase().replace('v.', 'v');
            _title = "[" + base.name + " (" + (_ver[0] == 'v' ? _ver : 'v' + _ver) + ")] ";
          } else {
            _title = "[" + base.name + "] ";
          }
        }

        // main site
        if (!__matches) {
          _title = "[RZ Linux Solutions] ";

          // legal notices page is special case
          if (link.href.includes("legal_notices")) {
            link.target = "_blank";
            link.rel = "noopener noreferrer"; // Good security practice for new tabs
          }
        }

        // set title
        if (!__markedText) {
          link.setAttribute('data-before-text', _title);
          link.closest('p').setAttribute('data-tooltip', "Go to '" + _title + link.text + "' page");
        } else {
          link.closest('p').setAttribute('data-tooltip', "Go to '" + link.text + "' section");
        }
      });
    }
  }

  function setLinkListener(link) {
    link.addEventListener('click', async (e) => {
      e.stopPropagation(); // Stops the click from hitting the parent container
      if (!link.hasAttribute('data-link-clicked')) {
        overlay.click();
        link.setAttribute('data-link-clicked', "true");
        link.classList.add("__visited");
        await _sleep(500);
        link.removeAttribute('data-link-clicked');
      } else {
        await _sleep(100);
        e.preventDefault();
      }
    });
  }

  function setResultAreaListener(result) {
    const link = result.querySelector('.pagefind-ui__result-link');
    const page_title = result.querySelector('.pagefind-ui__result-title');

    page_title.addEventListener('click', async (event) => {
      if (!!link) {
        if (!result.hasAttribute('data-li-clicked')) {
          link.click();
          result.setAttribute('data-li-clicked', "true");
          result.classList.add("__visited");
          await _sleep(500);
          overlay.click();
          result.removeAttribute('data-li-clicked');
        }
      }
    });

    const nested_results = result.querySelectorAll('.pagefind-ui__result-nested');

    nested_results.forEach(res => {
      const nested_link = res.querySelector('.pagefind-ui__result-link');
      res.addEventListener('click', async (event) => {
        if (!!nested_link) {
          if (!result.hasAttribute('data-li-clicked')) {
            nested_link.click();
            result.setAttribute('data-li-clicked', "true");
            result.classList.add("__visited");
            await _sleep(500);
            overlay.click();
            result.removeAttribute('data-li-clicked');
          }
        }
      });
    });

    result.addEventListener('click', async (event) => {
      if (!!link) {
        if (!result.hasAttribute('data-li-clicked')) {
          link.click();
          result.setAttribute('data-li-clicked', "true");
          result.classList.add("__visited");
          await _sleep(500);
          overlay.click();
          result.removeAttribute('data-li-clicked');
        }
      }
    });
  }

  function enableSwipe() {
    // Target the Pagefind UI container or drawer element
    const drawer = document.querySelector('.pagefind-ui__results-area');

    if (drawer) {
      let touchStartY = 0;
      let touchEndY = 0;
      drawer.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      drawer.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
      }, { passive: true });

      function handleSwipe() {
        const swipeDistance = touchEndY - touchStartY;

        drawer.scrollBy({
          top: swipeDistance *-3,
          behavior: 'smooth' // 'smooth' for smooth transitions, 'auto' for instant jumps
        });
      }
    }
  }

  function buttonToRenesasSearch(parent, keyword) {
    var button = document.querySelector("#renesasSearchBtn");

    if (!button) {
      button = document.createElement('a');
      button.id = "renesasSearchBtn";

      button.textContent = '';
      button.type = 'button';
      button.target = '_blank';

      button.addEventListener('click', (e) => {
        overlay.click();
      });

      parent.appendChild(button);
    }

    button.setAttribute('data-before-text', 'Or search \'' + keyword + '\' on Renesas.com');
    button.href = 'https://www.renesas.com/en/search?keywords=' + keyword;
    if (keyword.length > 0 && keyword !== "") {
      button.style.display = 'block';
    } else {
      button.style.display = 'none';
    }
  }

  function typeToSearch(parent, keyword) {
    const button = document.querySelector("#renesasSearchBtn");
    var area = document.querySelector("#typeToSearch");

    if (!area) {
      area = document.createElement('div');
      area.id = "typeToSearch";

      const text = document.createElement('p');
      text.textContent = 'Type to start searching';
      // text.innerHTML = 'Type to start searching. <kbd>↑↓</kbd> navigate, <kbd>↵</kbd> select, <kbd>⌫</kbd> delete, <kbd>esc</kbd> close';

      area.appendChild(text);

      parent.appendChild(area);
    }

    if (!!button && button.style.display !== 'none' && keyword.length === 0) {
      area.style.display = 'block';
    } else {
      area.style.display = 'none';
    }
  }

  function handleKeyboard(searchContainer, esc=false) {
    searchContainer.addEventListener('keydown', async (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Enter' && e.key !== 'Backspace' && e.key !== 'Tab' && e.key !== 'Escape') return;
      if (!esc && e.key === 'Escape') return;

      const input = searchContainer.querySelector('.pagefind-ui__search-input');
      const renesasSearchBtn = searchContainer.querySelector('#renesasSearchBtn');

      // Select main result links and sub-result links
      let links = Array.from(
        searchContainer.querySelectorAll('.pagefind-ui__result-link, .pagefind-ui__result-nested .pagefind-ui__result-link, .pagefind-ui__button, #renesasSearchBtn')
      );
      if (!links.length) return;

      const currentIndex = links.indexOf(document.activeElement);
      if (e.key === 'Enter') {
        if (!!links[currentIndex] && links[currentIndex].classList.contains("pagefind-ui__button")) {
          const curLength = links.length;
          do {
            await _sleep(100);
            links = Array.from(
              searchContainer.querySelectorAll('.pagefind-ui__result-link, .pagefind-ui__result-nested .pagefind-ui__result-link, .pagefind-ui__button, #renesasSearchBtn')
            );
          } while(curLength === links.length);
          links[currentIndex].focus();
        }
        // default -> click link / button
        return;
      }

      if (e.key === 'Backspace' || e.key === 'Escape') {
        if (currentIndex >= 0 || document.activeElement === renesasSearchBtn) {
          input.focus();
        } else {
          // default -> delete last characters of search keyword
          return;
        }
      }

      e.preventDefault(); // Prevent cursor movement in input or page scrolling
      if (e.key === 'ArrowDown') {
        if (document.activeElement === input || currentIndex === -1) {
          links[0].focus();
        } else if (currentIndex < links.length - 1) {
          links[currentIndex + 1].focus();
        }
      } else if (e.key === 'ArrowUp') {
        if (currentIndex === 0) {
          input.focus();
        } else if (currentIndex > 0) {
          links[currentIndex - 1].focus();
        }
      } else if (e.key === 'Tab') {
        if (document.activeElement === input || currentIndex === -1) {
          links[0].focus();
        } else if (document.activeElement === renesasSearchBtn) {
          input.focus(); // make sure only focus to search container area
        } else if (currentIndex < links.length - 1) {
          links[currentIndex + 1].focus();
        } else {
          input.focus(); // make sure only focus to search container area
        }
      }

      // make mouse hover update/move focus
      // TODO: fix me, buggy; disabled
      // links.forEach((item, idx) => {
      //   item.closest('div').addEventListener('mouseenter', () => {
      //     item.focus();
      //     currentIndex = idx;
      //   });
      // });
    },{ signal: controller.signal });
  }

  // common search -------------------------------------------------------------

  var lunjr = {};

  var has_versions = [];

  window.addEventListener('DOMContentLoaded', async (event) => {
    var target_links = [];

    var _local_entry = await getJsonData(local_base.replace('ext/', 'pagefind/pagefind-entry.json'));

    search_link.forEach(async (link) => {
      // makesure target site has their own materialx pagefind index (target url /search)
      var _link = link.link + 'search/';
      var entry = await getJsonData(_link + "pagefind-entry.json");
      if (!!entry && _local_entry['version'] == entry['version']) {
        target_links.push({baseUrl: _link, bundlePath: _link, indexWeight: link.weight});
      } else {
        // makesure target site has their own custom pagefind index (target url /pagefind)
        _link = link.link + 'pagefind/';
        entry = await getJsonData(_link + "pagefind-entry.json");
        if (!!entry && _local_entry['version'] == entry['version']) {
          target_links.push({baseUrl: _link, bundlePath: _link, indexWeight: link.weight});
        } else {
          // makesure target site indexed on main site (main url /ext/<target>/pagefind)
          const _local_link = _link.replace('https://renesas-rz.github.io/', local_base);
          const local_exist = await checkLinkExists(_local_link + 'pagefind.js');
          if (local_exist) {
            target_links.push({bundlePath: _local_link, indexWeight: link.weight});
          }
        }
      }

      if (link.versioned) {
        const site = link.link.replace('https://renesas-rz.github.io/', '').replace('/', '');
        if (link.lunjr) {
          lunjr[site] = link.lunjr;
        }
        has_versions.push(site);
      }
    });

    new PagefindUI({
      element: "#pagefind_search",
      showSubResults: true,
      showImages: false,
      pageSize: 10,
      resetStyles: false, // Prevents Pagefind from overriding Material's default styling
      mergeIndex: target_links,
      indexWeight: 1,
      translations: {
        clear_search: "✕"
      },
    });
  });

  const searchContainer = document.querySelector("#pagefind_search");
  const overlay = document.querySelector(".md-search__overlay");

  const _url = local_base.replace(window.location.protocol + '//','');
  const _local_base = window.location.protocol + '//' + cleanPathSimple(_url) + "/";

  const searchToggle = document.querySelector("#__search");
  const searchBack = document.querySelector("#__my_back_search button");

  const myLabel = document.querySelector('label[for="__search"]');

  if (searchContainer) {
    const observer = new MutationObserver(() => {
      // Find all result links generated by Pagefind
      const links = searchContainer.querySelectorAll(".pagefind-ui__result-link");
      const searchInputEl = document.querySelector(".pagefind-ui__search-input");
      const keyword = document.querySelector(".pagefind-ui__search-input").value;
      const searchResultsContainer = document.querySelector(".pagefind-ui__drawer");
      const searchInput = document.querySelector(".pagefind-ui__form");
      const searchResults = document.querySelectorAll(".pagefind-ui__result");
      const clearBtn = document.querySelector(".pagefind-ui__search-clear");

      links.forEach(link => {
        const markedText = link.closest('li').querySelectorAll('mark');
        var __markedText = link.closest('.pagefind-ui__result-nested')
        if (__markedText) {
          __markedText = __markedText.querySelectorAll('mark');
        }

        const searchExcerpt = link.closest('li').querySelectorAll(".pagefind-ui__result-excerpt");
        var markedTextwithPrefix = [];
        if (searchExcerpt) {
          searchExcerpt.forEach((_searchExcerpt) => {
            const _excerpts = _searchExcerpt.innerHTML.split("</mark>");
            _excerpts.forEach((_excerpt) => {
              const __excerpt = _excerpt.split("<mark>");
              if (__excerpt.length > 1) {

                markedTextwithPrefix.push(__excerpt.at(0).split(' ').at(-2) + "-," + __excerpt.at(1));
              }
            });
          });
        }

        // Add serach keyword to link
        insertTextKeyword(link, markedTextwithPrefix, keyword);

        // revert to original links
        if (link.href.includes(_local_base)) {
          link.href = link.href.replace(_local_base, 'https://renesas-rz.github.io/');
        }

        // Update title
        const _lunjr = link.href.replace('https://renesas-rz.github.io/', '').replace(/\/.*/g, '');
        if (link.href.includes('/search')) {
          // remove /search from base link
          link.href = link.href.replace('/search', '');
          insertHighlightQuery_v2(link, !!__markedText ? __markedText : markedText, keyword);
        } else if (!!lunjr[_lunjr] && link.href.includes(_lunjr)) {
          var matches = false;
          lunjr[_lunjr].forEach(version => {
            if (link.href.includes(version) && !matches) {
              matches = true;
            }
          })
          if (matches) {
            insertHighlightQuery(link, !!__markedText ? __markedText : markedText, keyword);
          } else {
            /* newer engine -> pagefind */
            insertHighlightQuery_v2(link, !!__markedText ? __markedText : markedText, keyword);
          }
        } else {
          insertHighlightQuery(link, !!__markedText ? __markedText : markedText, keyword);
        }

        // Modify link to add target and title
        setTargetLinkAndTitle(link, search_link, __markedText);

        // Prevent duplication
        setLinkListener(link);
      });

      searchResults.forEach(result => {
        // Handle click from outer link
        setResultAreaListener(result);
      });

      const hideResults = () => {
        document.body.removeAttribute('data-md-scrolllock');
        document.body.style.cssText = '';

        searchToggle.checked = false;
        searchResultsContainer.style.display = "none";
        clearBtn.classList.add("pagefind-ui__suppressed");

        const area = document.querySelector("#typeToSearch");
        area.style.display = 'none';

        const button = document.querySelector("#renesasSearchBtn");
        button.style.display = 'none';

        // work around when still loading search results but esc called
        button.style.opacity = '0';
      }

      const unHideResults = async () => {
        searchToggle.checked = true;
        searchResultsContainer.style.cssText = '';

        const _keyword = document.querySelector(".pagefind-ui__search-input").value;
        const button = document.querySelector("#renesasSearchBtn");
        const area = document.querySelector("#typeToSearch");

        // work around when still loading search results but esc called
        button.style.opacity = '1';

        if (clearBtn.classList.contains('pagefind-ui__suppressed') && _keyword.length > 0) {
          button.style.display = 'block';
          await _sleep(250);
          clearBtn.classList.remove("pagefind-ui__suppressed");
        } else if (_keyword.length === 0) {
          area.style.display = 'block';
        }
      }

      if (!clearBtn.classList.contains('pagefind-ui__suppressed')
        && keyword.length > 0
        && searchResultsContainer.style.display === "none") {
        unHideResults();
      }

      overlay.addEventListener('click', (event) => {
        event.preventDefault();
        hideResults();
      });

      searchBack.addEventListener('click', (event) => {
        hideResults();
      });

      searchInput.addEventListener('click', (event) => {
        unHideResults();
      });

      myLabel.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        document.body.setAttribute('data-md-scrolllock', 'true');
        unHideResults();
      });

      window.addEventListener('resize', async () => {
        if (window.innerWidth < 1217.5 && searchToggle.checked == true) {
          // work-around
          await _sleep(500);
          if (!document.body.hasAttribute('data-md-scrolllock')) {
            document.body.setAttribute('data-md-scrolllock', 'true');
            document.body.style.top = '0px';
          }
        }
      });

      // work-around when force to hide by toc hash update
      searchToggle.addEventListener('change', (event) => {
        const isChecked = event.target.checked;

        if (isChecked) {
          unHideResults();
        } else {
          hideResults();
        }
      });

      searchInputEl.addEventListener('input', (event) => {
        const value = event.target.value;
        const area = document.querySelector("#typeToSearch");

        if (value.length === 0) {
          area.style.display = 'block';
        }
      });

      // if we want to keep focus on search box
      // searchInputEl.addEventListener('keydown', (event) => {
      //   // Ignore if the event was already handled by another listener
      //   if (event.defaultPrevented) return;
      //
      //   if (event.key === 'Escape') {
      //     const area = document.querySelector("#typeToSearch");
      //     area.style.display = 'block';
      //     searchInputEl.focus();
      //   }
      // });

      // if we want to close search box when esc, but kept search results
      window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          // Check if focus is inside a Pagefind component or modal
          const isPagefind = event.target.closest(
            "#pagefind_search"
          );

          if (isPagefind) {
            event.stopPropagation();
            event.preventDefault();

            hideResults();
            searchInputEl.blur();
          }
        }
      }, { capture: true });

      // work-around to support (fake) swipe on mobile site
      enableSwipe();

      buttonToRenesasSearch(searchContainer, keyword);
      typeToSearch(searchContainer, keyword);
    });

    // Observe changes inside the search container to capture dynamic results
    observer.observe(searchContainer, { childList: true, subtree: true });
  }

  overlay.addEventListener('click', (event) => {
    event.preventDefault();

    searchToggle.checked = false;
  });

  searchBack.addEventListener('click', (event) => {
    searchToggle.checked = false;
  });

  handleKeyboard(searchContainer);

  // knowledge_base search -----------------------------------------------------

  function __search_init() {
    new PagefindUI({
      element: "#kb_search",
      showSubResults: true,
      showImages: false,
      pageSize: 10,
      bundlePath: window.location.href.replace(/\#.*/g, "").replace(/\?.*/g, "") + "./pagefind/",
      translations: {
        placeholder: "Search Knowledge Base",
        clear_search: "✕"
      }
    });

    const __searchContainer = document.querySelector("#kb_search");

    if (__searchContainer) {
      const observer = new MutationObserver(() => {
        // Find all result links generated by Pagefind
        const links = __searchContainer.querySelectorAll(".pagefind-ui__result-link");
        const searchResults = __searchContainer.querySelectorAll(".pagefind-ui__result");
        const keyword = __searchContainer.querySelector(".pagefind-ui__search-input").value.replace(/[^a-zA-Z0-9\s\/]/g, '');

        links.forEach(link => {
          const markedText = link.closest('li').querySelectorAll('mark');
          var __markedText = link.closest('.pagefind-ui__result-nested')
          if (__markedText) {
            __markedText = __markedText.querySelectorAll('mark');
          }

          // Add serach keyword to link
          insertHighlightQuery_v2(link, !!__markedText ? __markedText : markedText, keyword);

          // Prevent duplication
          setLinkListener(link);
        });

        searchResults.forEach(result => {
          // Handle click from outer link
          setResultAreaListener(result);
        });
      });

      // Observe changes inside the search container to capture dynamic results
      observer.observe(__searchContainer, { childList: true, subtree: true });
    }

    handleKeyboard(__searchContainer, true);
  }

  if (window.location.href.includes("knowledge_base") &&
      window.location.href.replace(/.*knowledge_base/g, "").replace(/\#.*/g, "").replace(/\?.*/g, "").length === 1) {
    if (document.readyState === "loading") {
      // Loading hasn't finished yet, wait for the event
      document.addEventListener("DOMContentLoaded", __search_init);
    } else {
      // DOMContentLoaded has already fired, run right away
      __search_init();
    }
  }

  // highlighter using mark.js -------------------------------------------------

  function mark() {
    const queries = window.location.href.replace(/\#.*/g, "").replace(/.*\?/g, "").split("&");

    let keys = [];
    queries.forEach(query => {
      if (query.length > 2) {
        const el = query.split("=");
        if (el[0] === "h") {
          keys = el[1].split("%20")
        }
      }
    });

    const context = document.querySelector(".md-content");
    const instance = new Mark(context);
    instance.mark(keys, {
      "exclude": [
        "svg *" // Ignores all matches inside SVG tags
      ]
    });
  }

  if (document.readyState === "loading") {
    // Loading hasn't finished yet, wait for the event
    document.addEventListener("DOMContentLoaded", mark);
  } else {
    // DOMContentLoaded has already fired, run right away
    mark();
  }

  // load pagefind database at first time --------------------------------------

  window.addEventListener('DOMContentLoaded', async () => {
    const searchQuery = "renesas rz";

    // Import the Pagefind API library
    const pagefind = await import(local_base.replace('ext/', 'pagefind/pagefind.js'));

    // Run the search immediately on load
    const searchResults = await pagefind.search(searchQuery);
  });
})

document$.subscribe(function() {
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
    return str.replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, '');
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

  function setTargetLinkAndTitle(link, search_link, __markedText) {
    // legal notices page is special case
    if (link.href.includes("legal_notices")) {
      link.target = "_blank";
      link.rel = "noopener noreferrer"; // Good security practice for new tabs
    } else if (link.title.length === 0) {
      // compare to all base links of others sites
      search_link.forEach(base => {
        if (link.href.includes(base.link)) {
          link.target = "_blank";
          link.rel = "noopener noreferrer"; // Good security practice for new tabs

          let _title = "";
          if (link.href.includes("rzv_ai_sdk") || link.href.includes("rzg_hmi_sdk")) {
            const _ver = link.href.replace(base.link,'').replace(/\/.*/g, "");
            _title = base.name + " (" + _ver + ")";
          } else {
            _title = base.name;
          }

          if (!__markedText) {
            link.setAttribute('data-before-text', "[" + _title + "] ");
          }
          link.title = _title;
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

  // common search -------------------------------------------------------------

  window.addEventListener('DOMContentLoaded', (event) => {
    var target_links = [];

    search_link.forEach(async (link) => {
      const _link = link.link + 'pagefind/'
      const exist = await checkLinkExists(_link + 'pagefind.js');
      if (exist) {
        target_links.push({bundlePath: _link, indexWeight: link.weight});
      } else {
        const _local_link = _link.replace('https://renesas-rz.github.io/', local_base);
        const local_exist = await checkLinkExists(_local_link + 'pagefind.js');
        if (local_exist) {
          target_links.push({bundlePath: _local_link, indexWeight: link.weight});
        }
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
        insertHighlightQuery(link, !!__markedText ? __markedText : markedText, keyword);

        // revert to original links
        if (link.href.includes(_local_base)) {
          link.href = link.href.replace(_local_base, 'https://renesas-rz.github.io/');
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
      }

      const unHideResults = () => {
        searchToggle.checked = true;
        searchResultsContainer.style.cssText = '';

        if (clearBtn.classList.contains('pagefind-ui__suppressed') && keyword.length > 0) {
          clearBtn.classList.remove("pagefind-ui__suppressed");
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

  // knowledge_base search -----------------------------------------------------

  function __search_init() {
    new PagefindUI({
      element: "#kb_search",
      showSubResults: true,
      showImages: false,
      pageSize: 10,
      bundlePath: window.location.href.replace(/\#.*/g, "").replace(/\?.*/g, "") + "./pagefind/",
      translations: {
        placeholder: "Search Knowledge Base"
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
          insertHighlightQuery(link, !!__markedText ? __markedText : markedText, keyword);

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
    const pagefind = await import(window.location.href.replace(/\#.*/g, "").replace(/\?.*/g, "") + "./pagefind/pagefind.js");

    // Run the search immediately on load
    const searchResults = await pagefind.search(searchQuery);
  });
})

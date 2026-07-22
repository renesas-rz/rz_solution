document$.subscribe(function() {
  function __sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function set_toc() {
    const navLinks = document.querySelectorAll(".inline-toc .toc a");
    if (!navLinks) return;

    const hash = window.location.hash;

    let passed = true;
    navLinks.forEach((link) => {
      link.classList.remove("active");
      link.classList.remove("passed");
      if (passed) {
        link.classList.add("passed");
      }
      if (hash === link.hash) {
        passed = false;
        link.classList.remove("passed");
        link.classList.add("active");
      }
    });
  }

  function calc_toc_top(is_need_to_set_toc=false) {
    if (window.innerWidth > 1217.5) { // in px
      // nav area top + header
      const navArea = document.querySelector('.md-sidebar__scrollwrap');
      const currentAreaForToc = navArea.getBoundingClientRect().top + navArea.getBoundingClientRect().height;

      // nav top + height
      const nav = document.querySelector('.md-sidebar__inner');
      const currentTopForToc = nav.getBoundingClientRect().top + nav.getBoundingClientRect().height;

      // toc
      const toc = document.querySelector('.inline-toc .toc');
      if (!!toc) {
        toc.style.top = currentTopForToc + 20 + "px"; // px
        toc.style.maxHeight = currentAreaForToc - (currentTopForToc + 20) + "px";

        if (is_need_to_set_toc) set_toc();

        const link = document.querySelector(".inline-toc .toc a.active");
        if (!!link) {
          link.scrollIntoView({ block: "nearest" });
        }
      }
    } else {
      // toc
      const toc = document.querySelector('.inline-toc .toc');
      if (!!toc) {
        toc.style.cssText = '';
      }
    }
  }

  function toc_watcher() {
    // 1. Select all sections and TOC links
    const sections = document.querySelectorAll("h1[id], h2[id], h3[id]");
    const navLinks = document.querySelectorAll(".inline-toc .toc a");
    if (!!navLinks) {
      // 2. Options for the observer (tweak rootMargin to adjust when the highlight triggers)
      const observerOptions = {
        root: null,
        rootMargin: "0px 0px -85% 0px",
        threshold: 0
      };

      // 3. Create the observer
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Find the ID of the currently visible section
            const activeId = entry.target.getAttribute("id");

            // 4. Toggle the 'active' class on the links
            let passed = true;
            navLinks.forEach((link) => {
              link.classList.remove("active");
              if (passed) {
                link.classList.add("passed");
              }
              if (link.getAttribute("href").replace(/.*\#/g, "#") === `#${activeId}`) {
                link.classList.add("active");
                link.classList.remove("passed");
                passed = false;
                // Optional: scroll the active link into view if the TOC is long
                if (window.innerWidth > 1217.5) { // in px
                  link.scrollIntoView({ block: "nearest" });
                  calc_toc_top();
                }
                window.location.hash = `${activeId}`;
              }
            });
          }
        });
      }, observerOptions);

      navLinks.forEach((link) => {
        // work-around when link not intersect
        link.addEventListener('click', async (e) => {
          await __sleep(100);
          let passed = true;
          navLinks.forEach((_link) => {
            _link.classList.remove("active");
            _link.classList.remove("passed");
            if (passed) {
              _link.classList.add("passed");
            }
            if (link.hash === _link.hash) {
              passed = false;
              _link.classList.remove("passed");
            }
          });
          link.classList.add("active");
          window.location.hash = link.getAttribute("href").replace(/.*\#/g, "");
          calc_toc_top();
        });
      });

      // 5. Observe each section
      sections.forEach((section) => observer.observe(section));
    }
  }

  // Listen for scroll events
  window.addEventListener('scroll', () => {
    calc_toc_top();
  });

  // Listen for window resize events
  window.addEventListener('resize', () => {
    calc_toc_top();
  });

  calc_toc_top(true);

  if (window.location.href.includes("knowledge_base") &&
    window.location.href.replace(/.*knowledge_base/g, "").replace(/\#.*/g, "").replace(/\?.*/g, "").length > 1) {
    toc_watcher();
  }
})

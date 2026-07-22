document$.subscribe(function() {
  // banner svg modifier -------------------------------------------------------

  function banner_svg_image_fill() {
    const svg_images = document.querySelectorAll(".custom-bg .banner-hover-effect svg image");
    if (!svg_images) return;

    svg_images.forEach(imageNode => {
      imageNode.setAttribute("href", "home/images/Click_BK.png");

      const li = imageNode.closest('li');
      const a = imageNode.closest('a');

      li.addEventListener('click', event => {
        a.click();
      });
    });
  }

  banner_svg_image_fill();

  function banner_svg_text_to_tspan() {
    const svg_texts = document.querySelectorAll(".custom-bg .banner-hover-effect svg text");
    if (!svg_texts) return;

    svg_texts.forEach(textNode => {
      // 1. Get the original text content and clear the element
      const originalText = textNode.textContent.trim();
      textNode.textContent = '';

      // 2. Split the text into an array of words
      const words = originalText.split(/\s+/);

      // 3. Create a <tspan> for each word
      words.forEach((word, index) => {
        // Crucial: Use the SVG namespace for creating elements
        const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        tspan.textContent = word;

        // Add custom classes or data attributes if you need to style/animate them
        tspan.setAttribute("class", "word-span");
        tspan.setAttribute("data-word-index", index);

        // Append the tspan to the text element
        textNode.appendChild(tspan);

        // 4. Add a text node space after each word except the last one
        if (index < words.length - 1) {
          textNode.appendChild(document.createTextNode(" "));
        }
      });
    });
  }

  banner_svg_text_to_tspan();

  // svg highlighter -----------------------------------------------------------

  function banner_svg_tspan_highlight(padding = 0) {
    const svg_texts = document.querySelectorAll(".custom-bg .banner-hover-effect svg text tspan");
    if (!svg_texts) return;

    svg_texts.forEach(async tspanNode => {
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

      await keys.forEach(key => {
        const index = tspanNode.textContent.toLowerCase().indexOf(key.toLowerCase());
        if (index > -1) {
          // 1. Calculate the exact bounding coordinates of the text element
          let bbox = tspanNode.getBBox();

          // 2. Generate a new SVG rectangle element
          const svgNamespace = "http://www.w3.org/2000/svg";
          const rect = document.createElementNS(svgNamespace, "rect");

          // 2~3. Check if just partial match, generated temp bbox for calculate
          if (tspanNode.textContent.length != key.length) {
            const tspanSubNode = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            tspanSubNode.textContent = tspanNode.textContent.slice(index, index + key.length);
            tspanNode.appendChild(tspanSubNode);

            const bboxSub = tspanSubNode.getBBox();
            bbox.width = bboxSub.width;

            if (index > 0) {
              const tspanSubNodeF = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
              tspanSubNodeF.textContent = tspanNode.textContent.slice(0, index + key.length);
              tspanNode.appendChild(tspanSubNodeF);

              const bboxSubF = tspanSubNodeF.getBBox();
              bbox.x = bbox.x + bboxSubF.width - bboxSub.width;
              bbox.width = bboxSub.width;

              tspanNode.removeChild(tspanSubNodeF);
            }

            tspanNode.removeChild(tspanSubNode);
          }

          // 3. Map bounding box dimensions to the rectangle while adding padding
          rect.setAttribute("x", bbox.x - padding);
          rect.setAttribute("y", bbox.y - padding);
          rect.setAttribute("width", bbox.width + (padding * 2));
          rect.setAttribute("height", bbox.height + (padding * 2));

          // 4. Assign an external style class and round the edges
          rect.setAttribute("class", "svg-tspan-highlight");
          rect.setAttribute("rx", "4");

          // 5. Ingress the rectangle into the DOM directly in front of the text
          const textNode = tspanNode.closest('text');
          textNode.parentNode.insertBefore(rect, textNode);
        }
      });
    });
  }

  banner_svg_tspan_highlight();
})

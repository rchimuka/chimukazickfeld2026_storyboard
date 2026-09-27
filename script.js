/* ==========================================================
   SCROLL REVEALS
   ========================================================== */

const revealElements =
  document.querySelectorAll(".reveal");


const revealObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add("visible");

        }

      });

    },

    {
      threshold: 0.18
    }
  );


revealElements.forEach((element) => {

  revealObserver.observe(element);

});



/* ==========================================================
   GENERIC LAYERED SCROLLYTELLING ENGINE

   Powers every .layered-scrolly section: the CO2 trace, the
   temperature trace (+ mirror + shade), and both bar-chart
   asymmetry reveals. Each .scroll-step declares which named
   layers should be visible via data-show="a,b,c"; matching
   elements (SVG paths, bar fills, bar values, labels — anything
   with a data-layer attribute) get a "visible" class toggled on.
   ========================================================== */

function initLayeredScrolly(section) {

  const steps =
    section.querySelectorAll(
      ".scroll-step[data-step]"
    );


  const layers =
    section.querySelectorAll(
      "[data-layer]"
    );


  const caption =
    section.querySelector(
      "[data-caption]"
    );


  if (!steps.length) {

    return;

  }


  // prep any SVG paths that should "draw" via stroke-dashoffset
  section
    .querySelectorAll(".draw-path")
    .forEach((path) => {

      if (typeof path.getTotalLength === "function") {

        const length =
          path.getTotalLength();


        path.style.setProperty(
          "--len",
          length
        );

      }

    });



  function setStep(index, showList, captionText) {

    steps.forEach((step) => {

      step.classList.remove("active");

    });


    const current =
      section.querySelector(
        `[data-step="${index}"]`
      );


    if (current) {

      current.classList.add("active");

    }



    layers.forEach((layer) => {

      const name =
        layer.dataset.layer;


      layer.classList.toggle(
        "visible",
        showList.includes(name)
      );

    });



    if (caption && captionText) {

      caption.textContent = captionText;

    }

  }



  const stepObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            const index =
              entry.target.dataset.step;


            const showList =
              (entry.target.dataset.show || "")
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);


            const captionText =
              entry.target.dataset.captionText;


            setStep(index, showList, captionText);

          }

        });

      },

      {
        rootMargin:
          "-35% 0px -35% 0px",

        threshold: 0
      }
    );


  steps.forEach((step) => {

    stepObserver.observe(step);

  });



  // initial state
  const first = steps[0];

  setStep(
    first.dataset.step,
    (first.dataset.show || "").split(",").map((s) => s.trim()).filter(Boolean),
    first.dataset.captionText
  );

}



document
  .querySelectorAll(".layered-scrolly")
  .forEach((section) => {

    initLayeredScrolly(section);

  });



/* ==========================================================
   PLAIN SCROLL-STEP FOCUS (for sections like the TCRE scrolly
   that don't drive a diagram, just want the "active" highlight)
   ========================================================== */

document
  .querySelectorAll(".scrolly:not(.layered-scrolly) .scroll-step")
  .forEach((step) => {

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            entry.target.classList.toggle(
              "active",
              entry.isIntersecting
            );

          });

        },

        {
          rootMargin:
            "-35% 0px -35% 0px",

          threshold: 0
        }
      );


    observer.observe(step);

  });



/* ==========================================================
   TYPEWRITER — research question
   ========================================================== */

function initTypewriter(el) {

  const text =
    el.textContent.trim();


  const words =
    text.split(/\s+/);


  el.innerHTML =
    words
      .map(
        (word, i) =>
          `<span class="word" style="animation-delay:${i * 0.09}s">${word}</span>`
      )
      .join(" ");


  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            el.classList.add("started");

            observer.disconnect();

          }

        });

      },

      {
        threshold: 0.4
      }
    );


  observer.observe(el);

}



const researchQuestion =
  document.getElementById("researchQuestion");


if (researchQuestion) {

  initTypewriter(researchQuestion);

}



/* ==========================================================
   GLOSSARY — chip visibility + panel toggle + term triggers
   ========================================================== */

const glossaryZone =
  document.querySelector(".glossary-zone");


const glossaryChip =
  document.getElementById("glossaryChip");


const glossaryPanel =
  document.getElementById("glossaryPanel");


const glossaryClose =
  document.getElementById("glossaryClose");



if (glossaryZone && glossaryChip) {

  const zoneObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          glossaryChip.classList.toggle(
            "visible",
            entry.isIntersecting
          );

        });

      },

      {
        threshold: 0.02
      }
    );


  zoneObserver.observe(glossaryZone);

}



function openGlossary(highlightTerm) {

  glossaryPanel.classList.add("open");

  glossaryChip.setAttribute("aria-expanded", "true");


  document
    .querySelectorAll(".glossary-list > div")
    .forEach((entry) => {

      const match =
        highlightTerm &&
        entry.dataset.termDef === highlightTerm;


      entry.classList.toggle("highlight", Boolean(match));


      if (match) {

        entry.scrollIntoView({
          block: "nearest",
          behavior: "smooth"
        });

      }

    });

}


function closeGlossary() {

  glossaryPanel.classList.remove("open");

  glossaryChip.setAttribute("aria-expanded", "false");

}



if (glossaryChip && glossaryPanel) {

  glossaryChip.addEventListener("click", () => {

    if (glossaryPanel.classList.contains("open")) {

      closeGlossary();

    } else {

      openGlossary(null);

    }

  });


  glossaryClose.addEventListener("click", closeGlossary);


  document
    .querySelectorAll(".term")
    .forEach((term) => {

      term.addEventListener("click", () => {

        openGlossary(term.dataset.term);

      });

    });

}

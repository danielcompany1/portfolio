"use strict";

const CONTACT_ENDPOINT = "YOUR_N8N_WEBHOOK_URL";
const portfolioStats = {
  yearsExperience: null,
  projectsDelivered: null,
  businessesSupported: null,
  peopleTrained: null
};

const html = document.documentElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function applyTheme(preference) {
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const resolvedTheme = preference === "system" ? (prefersLight ? "light" : "dark") : preference;
  html.dataset.theme = resolvedTheme;
  try {
    localStorage.setItem("portfolio-theme", preference);
  } catch (error) {
    // The site still works when browser storage is unavailable.
  }
  document.querySelectorAll(".theme-label").forEach((label) => {
    label.textContent = preference.charAt(0).toUpperCase() + preference.slice(1);
  });
  document.querySelectorAll(".theme-toggle").forEach((button) => {
    button.setAttribute("aria-label", "Color theme is " + preference + ". Activate to change theme.");
  });
}

let themePreference = "dark";
try {
  themePreference = localStorage.getItem("portfolio-theme") || "dark";
} catch (error) {
  themePreference = "dark";
}
applyTheme(themePreference);

document.querySelectorAll(".theme-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const next = { dark: "light", light: "system", system: "dark" };
    themePreference = next[themePreference] || "dark";
    applyTheme(themePreference);
  });
});

window.matchMedia("(prefers-color-scheme: light)").addEventListener?.("change", () => {
  if (themePreference === "system") applyTheme("system");
});

const siteHeader = document.querySelector(".site-header");
function updateHeader() {
  if (siteHeader) siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
}
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const pageName = document.body.dataset.page;
document.querySelectorAll(".nav-links a[data-route]").forEach((link) => {
  if (link.dataset.route === pageName) link.setAttribute("aria-current", "page");
});
if (pageName === "contact") {
  const contactCta = document.querySelector(".nav-cta");
  if (contactCta) contactCta.setAttribute("aria-current", "page");
}

const menuToggle = document.querySelector(".menu-toggle");
const primaryMenu = document.querySelector(".primary-menu");
function closeMenu() {
  if (!menuToggle || !primaryMenu) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  primaryMenu.classList.remove("is-open");
}
if (menuToggle && primaryMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
    primaryMenu.classList.toggle("is-open", !isOpen);
  });
  primaryMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("click", (event) => {
    if (!primaryMenu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

document.querySelectorAll("[data-current-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -24px 0px" });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const filterButtons = document.querySelectorAll("[data-project-filter]");
const projectCards = document.querySelectorAll("[data-project-category]");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.projectFilter;
    filterButtons.forEach((filter) => filter.setAttribute("aria-pressed", String(filter === button)));
    projectCards.forEach((card) => {
      const visible = selectedFilter === "all" || card.dataset.projectCategory === selectedFilter;
      card.hidden = !visible;
      card.setAttribute("aria-hidden", String(!visible));
      if (visible && !reducedMotion) {
        card.classList.remove("filter-enter");
        void card.offsetWidth;
        card.classList.add("filter-enter");
      }
    });
  });
});

const statsSection = document.querySelector("#stats-section");
const statsGrid = document.querySelector("#stats-grid");
if (statsSection && statsGrid) {
  const labels = {
    yearsExperience: "Years experience",
    projectsDelivered: "Projects and solutions",
    businessesSupported: "Businesses supported",
    peopleTrained: "People trained"
  };
  const availableStats = Object.entries(portfolioStats).filter(([, value]) => Number.isFinite(value) && value > 0);
  if (availableStats.length) {
    statsSection.hidden = false;
    statsGrid.innerHTML = availableStats.map(([key, value]) => (
      '<article class="stat-card"><strong>' + String(value) + (key === "yearsExperience" ? "+" : "+") +
      '</strong><span>' + labels[key] + '</span></article>'
    )).join("");
  }
}

const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  const formStatus = contactForm.querySelector("[data-form-status]");
  const urlParams = new URLSearchParams(window.location.search);
  const requestedProject = urlParams.get("project");
  const projectSelect = contactForm.querySelector('[name="projectType"]');
  if (requestedProject && projectSelect) {
    const matchingOption = Array.from(projectSelect.options).find((option) => (
      option.value.toLowerCase() === requestedProject.toLowerCase()
    ));
    if (matchingOption) projectSelect.value = matchingOption.value;
  }

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const submitButton = contactForm.querySelector('[type="submit"]');
    const originalButtonText = submitButton ? submitButton.innerHTML : "Send message";
    const formData = new FormData(contactForm);
    const payload = {
      fullName: String(formData.get("fullName") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      projectType: String(formData.get("projectType") || "").trim(),
      budget: String(formData.get("budget") || "").trim(),
      message: String(formData.get("message") || "").trim()
    };

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending…";
    }
    if (formStatus) {
      formStatus.textContent = "Sending…";
      formStatus.dataset.state = "sending";
    }

    if (!CONTACT_ENDPOINT || CONTACT_ENDPOINT === "YOUR_N8N_WEBHOOK_URL") {
      const subject = encodeURIComponent("Portfolio inquiry — " + payload.projectType);
      const body = encodeURIComponent(
        "Name: " + payload.fullName + "\nEmail: " + payload.email +
        "\nPhone: " + payload.phone + "\nProject type: " + payload.projectType +
        "\nBudget: " + payload.budget + "\n\n" + payload.message
      );
      if (formStatus) {
        formStatus.innerHTML = 'Your email app is opening. If it does not open, email <a href="mailto:danielcompany176@gmail.com">danielcompany176@gmail.com</a>.';
        formStatus.dataset.state = "success";
      }
      window.location.href = "mailto:danielcompany176@gmail.com?subject=" + subject + "&body=" + body;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
      return;
    }

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("The contact service returned an error.");
      if (formStatus) {
        formStatus.textContent = "Message sent successfully. Thanks for reaching out.";
        formStatus.dataset.state = "success";
      }
      contactForm.reset();
    } catch (error) {
      if (formStatus) {
        formStatus.textContent = "Something went wrong. Please try again or email Daniel directly.";
        formStatus.dataset.state = "error";
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    }
  });
}

const commandDialog = document.querySelector(".command-dialog");
const commandInput = document.querySelector("#command-input");
const commandItems = Array.from(document.querySelectorAll("[data-command-item]"));
const commandOpeners = document.querySelectorAll("[data-command-open]");
function openCommandPalette() {
  if (!commandDialog || typeof commandDialog.showModal !== "function") return;
  if (!commandDialog.open) commandDialog.showModal();
  if (commandInput) {
    commandInput.value = "";
    commandInput.focus();
    commandItems.forEach((item) => { item.hidden = false; });
  }
}
commandOpeners.forEach((button) => button.addEventListener("click", openCommandPalette));
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openCommandPalette();
  }
});
if (commandInput) {
  commandInput.addEventListener("input", () => {
    const query = commandInput.value.trim().toLowerCase();
    commandItems.forEach((item) => {
      const terms = (item.dataset.keys || "") + " " + item.textContent;
      item.hidden = !terms.toLowerCase().includes(query);
    });
  });
}
commandItems.forEach((item) => item.addEventListener("click", () => {
  if (commandDialog && commandDialog.open) commandDialog.close();
}));
if (commandDialog) {
  commandDialog.addEventListener("click", (event) => {
    if (event.target === commandDialog) commandDialog.close();
  });
  commandDialog.addEventListener("close", () => {
    const opener = document.querySelector("[data-command-open]");
    if (opener) opener.focus();
  });
}

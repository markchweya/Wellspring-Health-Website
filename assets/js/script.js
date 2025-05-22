'use strict';

/**
 * Utility function to add event listeners on multiple elements.
 * @param {NodeListOf<HTMLElement>} elements - A NodeList of HTML elements.
 * @param {string} eventType - The type of event to listen for (e.g., "click", "scroll").
 * @param {Function} callback - The function to execute when the event occurs.
 */
const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}

/**
 * PRELOADER
 * The preloader will be visible until the document and its resources are fully loaded.
 */
const preloader = document.querySelector("[data-preloader]");

window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});

/**
 * MOBILE NAVBAR
 * Toggles the visibility of the mobile navigation menu and an overlay.
 * The mobile navbar appears when the menu button is clicked and hides when
 * the close button or overlay is clicked. It also prevents body scrolling
 * when the navbar is active.
 */
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNav = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNav);

/**
 * HEADER & BACK TO TOP BUTTON
 * Adds/removes an 'active' class to the header and a back-to-top button
 * when the window scrolls down past 100 pixels. This typically changes
 * the header's appearance (e.g., adds a background color, shadow) and
 * makes the back-to-top button visible.
 *
 * NEW FEATURE: Header hides on scroll down, shows on scroll up.
 */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrollY = 0; // To track the previous scroll position

const activeElementOnScroll = function () {
  const currentScrollY = window.scrollY;

  // Logic for Back Top Button: Appears when scrolled down past 100px
  if (currentScrollY > 100) {
    backTopBtn.classList.add("active");
  } else {
    backTopBtn.classList.remove("active");
  }

  // Logic for Header: Hides on scroll down, shows on scroll up
  // Also, ensures header is always visible when at the very top
  // `header.offsetHeight` is used to ensure the header doesn't hide immediately
  // on a small scroll, giving a smoother experience.
  if (currentScrollY > lastScrollY && currentScrollY > header.offsetHeight) {
    // Scrolling down and past the header's initial height
    header.classList.add("header-hide"); // Add a class to hide the header
  } else if (currentScrollY < lastScrollY || currentScrollY <= 0) {
    // Scrolling up or at the very top of the page
    header.classList.remove("header-hide"); // Remove the class to show the header
  }

  // Update last scroll position for the next check
  lastScrollY = currentScrollY;

  // Existing header active class for background/shadow when scrolled
  // This ensures the header still gets its 'active' styling (e.g., background color)
  // when it's visible and the user has scrolled down past 100px.
  if (currentScrollY > 100) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
}

window.addEventListener("scroll", activeElementOnScroll);

/**
 * SCROLL REVEAL ANIMATION
 * Applies a "revealed" class to elements with `data-reveal` attribute
 * when they enter the viewport, triggering CSS animations.
 * It also removes the class when the element scrolls out of view.
 */
const revealElements = document.querySelectorAll("[data-reveal]");

const revealElementOnScroll = function () {
  for (let i = 0, len = revealElements.length; i < len; i++) {
    // Check if the element's top edge is within 1.15 times the viewport height
    if (revealElements[i].getBoundingClientRect().top < window.innerHeight / 1.15) {
      revealElements[i].classList.add("revealed");
    } else {
      revealElements[i].classList.remove("revealed"); // Remove class when scrolled out
    }
  }
}

window.addEventListener("scroll", revealElementOnScroll);
window.addEventListener("load", revealElementOnScroll); // Trigger on load for elements already in view

/**
 * TAB FUNCTIONALITY FOR ABOUT SECTION
 * Manages the display of content within the "About Us" section based on tab clicks.
 * When a tab button is clicked, its corresponding content is shown, and other content is hidden.
 *
 * NOTE: For this to work, ensure your HTML for the "About" section is structured as follows:
 * - A container for tab buttons with `data-tab-buttons`.
 * - Each tab button has a `data-tab-target="#[content-id]"`.
 * - A container for tab content.
 * - Each tab content div has an `id` matching a `data-tab-target` and a `tab-content` class.
 * - The initially active tab button and content should have the `active` class.
 *
 * Example HTML structure for tabs:
 * <div class="tab-container">
 * <ul class="tab-list" data-tab-buttons>
 * <li><button class="tab-btn active" data-tab-target="#vision">Our Vision</button></li>
 * <li><button class="tab-btn" data-tab-target="#mission">Our Mission</button></li>
 * <li><button class="tab-btn" data-tab-target="#approach">Our Approach</button></li>
 * </ul>
 * <div class="tab-content-container">
 * <div id="vision" class="tab-content active">
 * <p class="tab-text">Our Vision content...</p>
 * </div>
 * <div id="mission" class="tab-content">
 * <p class="tab-text">Our Mission content...</p>
 * </div>
 * <div id="approach" class="tab-content">
 * <p class="tab-text">Our Approach content...</p>
 * </div>
 * </div>
 * </div>
 */
const tabButtons = document.querySelectorAll("[data-tab-buttons] .tab-btn");
const tabContents = document.querySelectorAll(".tab-content-container .tab-content");

const activateTab = function (clickedButton) {
  // Deactivate all tab buttons and content
  tabButtons.forEach(button => button.classList.remove("active"));
  tabContents.forEach(content => content.classList.remove("active"));

  // Activate the clicked button
  clickedButton.classList.add("active");

  // Get the target content ID from the data-tab-target attribute
  const targetContentId = clickedButton.dataset.tabTarget;
  const targetContent = document.querySelector(targetContentId);

  // Activate the corresponding content
  if (targetContent) {
    targetContent.classList.add("active");
  }
};

// Add click event listeners to all tab buttons
tabButtons.forEach(button => {
  button.addEventListener("click", () => activateTab(button));
});


/**
 * NEWSLETTER FORM SUBMISSION HANDLING
 * Prevents the default form submission and simulates a successful subscription.
 * In a real application, this would send data to a server.
 * A simple message is displayed to the user upon "submission".
 */
const newsletterForm = document.querySelector(".footer-form");
const newsletterInputField = newsletterForm ? newsletterForm.querySelector(".input-field") : null;

if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Display a simple success message (replace with a proper message box if needed)
    if (newsletterInputField) {
      console.log(`Subscribed with email: ${newsletterInputField.value}`);
      // For a more visible message, you might add a temporary div near the form
      const messageDiv = document.createElement('p');
      messageDiv.textContent = "Thank you for subscribing!";
      messageDiv.style.color = "var(--primary-teal)";
      messageDiv.style.marginTop = "10px";
      messageDiv.style.fontWeight = "bold";
      newsletterForm.appendChild(messageDiv);

      // Remove the message after a few seconds
      setTimeout(() => {
        newsletterForm.removeChild(messageDiv);
      }, 3000);

      newsletterInputField.value = ""; // Clear the input field
    }
  });
}

/**
 * DYNAMIC COPYRIGHT YEAR
 * Automatically updates the copyright year in the footer to the current year.
 */
const copyrightElement = document.querySelector(".copyright");
if (copyrightElement) {
  const currentYear = new Date().getFullYear();
  copyrightElement.textContent = `© ${currentYear} Wellspring Health | All Rights Reserved`;
}

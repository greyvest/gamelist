// checkbox-persist.js
// Saves and restores checkbox state across page loads using localStorage.
// Add this file to your Quartz project at: quartz/static/checkbox-persist.js
// Then reference it in quartz.layout.ts or quartz/components/Head.tsx as:
//   <script src="/checkbox-persist.js"></script>

(function () {
  function getKey(checkbox) {
    // Build a stable key from the page path + the checkbox's associated label text
    const label = checkbox.closest("li")?.innerText?.trim() || "";
    return "checkbox:" + location.pathname + ":" + label;
  }

  function restoreCheckboxes() {
    document.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      const key = getKey(cb);
      const saved = localStorage.getItem(key);
      if (saved === "true") {
        cb.checked = true;
        cb.closest("li")?.classList.add("checked");
      }
      // Remove the disabled attribute Quartz sets on task-list checkboxes
      cb.removeAttribute("disabled");
    });
  }

  function attachListeners() {
    document.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.addEventListener("change", function () {
        const key = getKey(this);
        localStorage.setItem(key, this.checked);
        this.closest("li")?.classList.toggle("checked", this.checked);
      });
    });
  }

  function init() {
    restoreCheckboxes();
    attachListeners();
  }

  // Quartz uses client-side navigation (SPA-style), so re-run on each navigation
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Re-run after Quartz's SPA navigations
  document.addEventListener("nav", init);
})();

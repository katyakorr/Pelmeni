document.body.classList.add("page-entering");

requestAnimationFrame(() => {
  document.body.classList.add("page-transition-ready");
  document.body.classList.remove("page-entering");
});

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");

  if (!link) {
    return;
  }

  const rawHref = link.getAttribute("href") || "";
  const url = new URL(link.href, window.location.href);
  const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  const isSamePageHash = url.pathname === window.location.pathname && url.hash;
  const isExternal = url.origin !== window.location.origin;

  if (
    rawHref.startsWith("#") ||
    isModifiedClick ||
    link.target ||
    link.hasAttribute("download") ||
    isExternal ||
    isSamePageHash ||
    url.href === window.location.href
  ) {
    return;
  }

  event.preventDefault();
  document.body.classList.add("page-leaving");

  window.setTimeout(() => {
    window.location.href = url.href;
  }, 500);
});

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

const feedbackMarkup = `
  <div class="feedback-overlay" data-feedback-overlay hidden>
    <section class="feedback-dialog" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
      <button class="feedback-close" type="button" data-feedback-close aria-label="Закрыть форму отзыва"></button>
      <h2 id="feedback-title">Поделитесь впечатлениями</h2>

      <form class="feedback-form" data-feedback-form novalidate>
        <div class="feedback-rating" data-feedback-rating>
          <span class="feedback-rating__label">Ваша оценка от 1 до 5 * :</span>
          <div class="feedback-rating__stars" aria-label="Оценка">
            <button class="feedback-star is-active" type="button" data-rating-value="1" aria-label="1 из 5">
              <img class="feedback-star__icon" src="images/vectors/Star.svg" alt="" aria-hidden="true" />
            </button>
            <button class="feedback-star" type="button" data-rating-value="2" aria-label="2 из 5">
              <img class="feedback-star__icon" src="images/vectors/Star.svg" alt="" aria-hidden="true" />
            </button>
            <button class="feedback-star" type="button" data-rating-value="3" aria-label="3 из 5">
              <img class="feedback-star__icon" src="images/vectors/Star.svg" alt="" aria-hidden="true" />
            </button>
            <button class="feedback-star" type="button" data-rating-value="4" aria-label="4 из 5">
              <img class="feedback-star__icon" src="images/vectors/Star.svg" alt="" aria-hidden="true" />
            </button>
            <button class="feedback-star" type="button" data-rating-value="5" aria-label="5 из 5">
              <img class="feedback-star__icon" src="images/vectors/Star.svg" alt="" aria-hidden="true" />
            </button>
          </div>
          <div class="feedback-rating__numbers" aria-hidden="true">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
          <input type="hidden" name="rating" value="1" data-feedback-rating-input />
        </div>

        <label class="feedback-field feedback-field--review">
          <span>Ваш отзыв:</span>
          <textarea name="review" placeholder="Текст отзыва"></textarea>
        </label>

        <label class="feedback-field" data-feedback-field="name">
          <span>Ваше имя * :</span>
          <input name="name" type="text" placeholder="Имя" autocomplete="name" data-feedback-name />
          <span class="feedback-error" data-feedback-error="name" aria-live="polite"></span>
        </label>

        <label class="feedback-field" data-feedback-field="phone">
          <span>Ваш номер телефона * :</span>
          <input name="phone" type="tel" value="+7 " autocomplete="tel" inputmode="tel" data-feedback-phone />
          <span class="feedback-error" data-feedback-error="phone" aria-live="polite"></span>
        </label>

        <p class="feedback-required-note">* пункт обязателен для заполнения</p>
        <p class="feedback-consent">Нажимая кнопку «Отправить», вы соглашаетесь на обработку персональных данных.</p>

        <button class="button button--green feedback-submit" type="submit">
          <span>Отправить</span>
          <img src="images/vectors/arrow.svg" alt="" />
        </button>

        <img class="feedback-flower" src="images/vectors/цветочек.svg" alt="" />
        <img class="feedback-hippo" src="images/hippos/WritingHippo.png" alt="" />
      </form>
    </section>
  </div>
  <div class="feedback-toast" data-feedback-toast role="status" aria-live="polite"></div>
`;

document.body.insertAdjacentHTML("beforeend", feedbackMarkup);

const feedbackOverlay = document.querySelector("[data-feedback-overlay]");
const feedbackForm = document.querySelector("[data-feedback-form]");
const feedbackToast = document.querySelector("[data-feedback-toast]");
const feedbackName = document.querySelector("[data-feedback-name]");
const feedbackPhone = document.querySelector("[data-feedback-phone]");
const feedbackRatingInput = document.querySelector("[data-feedback-rating-input]");
const feedbackStars = Array.from(document.querySelectorAll("[data-rating-value]"));
let feedbackToastTimer;

const openFeedback = () => {
  feedbackOverlay.hidden = false;
  document.body.classList.add("feedback-open");
  feedbackOverlay.scrollTop = 0;
  window.setTimeout(() => feedbackOverlay.querySelector("textarea").focus(), 0);
};

const closeFeedback = () => {
  feedbackOverlay.hidden = true;
  document.body.classList.remove("feedback-open");
};

const showFeedbackToast = (message) => {
  window.clearTimeout(feedbackToastTimer);
  feedbackToast.textContent = message;
  feedbackToast.classList.add("is-visible");
  feedbackToastTimer = window.setTimeout(() => {
    feedbackToast.classList.remove("is-visible");
  }, 3500);
};

const setFeedbackError = (name, message) => {
  const field = document.querySelector(`[data-feedback-field="${name}"]`);
  const error = document.querySelector(`[data-feedback-error="${name}"]`);
  field.classList.toggle("is-invalid", Boolean(message));
  error.textContent = message;
};

const validateFeedbackName = () => {
  const value = feedbackName.value.trim();

  if (!value) {
    setFeedbackError("name", "Введите имя");
    return false;
  }

  if (!/^[А-Яа-яЁёA-Za-z\s-]{2,}$/u.test(value)) {
    setFeedbackError("name", "Используйте только буквы, пробел или дефис");
    return false;
  }

  setFeedbackError("name", "");
  return true;
};

const getPhoneDigits = () => feedbackPhone.value.replace(/\D/g, "");

const formatFeedbackPhone = () => {
  let digits = getPhoneDigits();

  if (digits.startsWith("8")) {
    digits = `7${digits.slice(1)}`;
  }

  if (!digits.startsWith("7")) {
    digits = `7${digits}`;
  }

  digits = digits.slice(0, 11);
  const parts = [
    "+7",
    digits.slice(1, 4),
    digits.slice(4, 7),
    digits.slice(7, 9),
    digits.slice(9, 11),
  ].filter(Boolean);

  let formatted = parts[0];

  if (parts[1]) {
    formatted += ` ${parts[1]}`;
  }

  if (parts[2]) {
    formatted += ` ${parts[2]}`;
  }

  if (parts[3]) {
    formatted += `-${parts[3]}`;
  }

  if (parts[4]) {
    formatted += `-${parts[4]}`;
  }

  feedbackPhone.value = formatted.length > 2 ? formatted : "+7 ";
};

const validateFeedbackPhone = () => {
  const digits = getPhoneDigits();

  if (digits.length <= 1) {
    setFeedbackError("phone", "Введите номер телефона");
    return false;
  }

  if (!/^7\d{10}$/.test(digits)) {
    setFeedbackError("phone", "Введите номер в формате +7 999 123-45-67");
    return false;
  }

  setFeedbackError("phone", "");
  return true;
};

const setFeedbackRating = (value) => {
  feedbackRatingInput.value = value;
  feedbackStars.forEach((star) => {
    star.classList.toggle("is-active", Number(star.dataset.ratingValue) <= Number(value));
  });
};

document.querySelectorAll("[data-feedback-open]").forEach((button) => {
  button.addEventListener("click", openFeedback);
});

document.querySelectorAll("[data-feedback-close]").forEach((button) => {
  button.addEventListener("click", closeFeedback);
});

feedbackOverlay.addEventListener("click", (event) => {
  if (event.target === feedbackOverlay) {
    closeFeedback();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !feedbackOverlay.hidden) {
    closeFeedback();
  }
});

feedbackStars.forEach((star) => {
  star.addEventListener("click", () => setFeedbackRating(star.dataset.ratingValue));
});

feedbackName.addEventListener("input", validateFeedbackName);
feedbackPhone.addEventListener("focus", formatFeedbackPhone);
feedbackPhone.addEventListener("input", () => {
  formatFeedbackPhone();
  validateFeedbackPhone();
});

feedbackForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const isNameValid = validateFeedbackName();
  const isPhoneValid = validateFeedbackPhone();

  if (!isNameValid || !isPhoneValid) {
    return;
  }

  feedbackForm.reset();
  feedbackPhone.value = "+7 ";
  setFeedbackRating("1");
  setFeedbackError("name", "");
  setFeedbackError("phone", "");
  closeFeedback();
  showFeedbackToast("Отзыв отправлен. Спасибо за вашу обратную связь!");
});

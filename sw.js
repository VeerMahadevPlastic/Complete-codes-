<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
  />

  <!-- FONT (CUSTOMIZE IF NEEDED) -->
  <!-- To change font: Visit https://fonts.google.com, select a font, copy the <link> tags, and update font-family in CSS -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
    rel="stylesheet"
  />

  <style>
    :root {
      /* === TYPOGRAPHY === */
      --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
        Roboto, 'Helvetica Neue', Arial, sans-serif;

      --font-size-title: 1.7rem;
      --font-size-body: 0.95rem;
      --font-size-button: 1rem;

      /* === COLORS === */
      --overlay-bg: rgba(0, 0, 0, 0.35);
      --card-bg: #ffffff;
      --title-color: #1d1d1f;
      --text-color: #333333;

      --primary-bg: #006cff;
      --primary-text: #ffffff;

      --secondary-bg: #ffffff;
      --secondary-border: #d0d0d5;
      --secondary-text: #1d1d1f;

      --close-bg: rgba(0, 0, 0, 0.35);
      --close-icon: #ffffff;

      /* === SHAPE & DEPTH === */
      --card-radius: 20px;
      --button-radius: 12px;
      --card-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);

      /* === LAYOUT === */
      --card-max-width: 420px;
      --card-padding: 24px;
      --header-height: 180px;
      --button-height: 52px;
      --button-gap: 12px;

      /* === HEADER BACKGROUND IMAGE (replace with URL of your choice) */
      --header-bg-image: url("https://img.onesignal.com/i/4722d713-821f-405d-b639-55c53037b512/WwNBOUFSOWhjZ2WsDejQ_4c786f1e99fb7f8f7905a51550ee07fdfea207a0%201.png");
    }

    /* ========================================
       CORE / MOBILE SAFE STYLES
       ======================================== */

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }

    html,
    body {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    body {
      font-family: var(--font-family);
      background: var(--overlay-bg);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .iam-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
    }

    .iam-card {
      width: 100%;
      max-width: var(--card-max-width);
      background: var(--card-bg);
      border-radius: var(--card-radius);
      box-shadow: var(--card-shadow);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    /* === HEADER WITH BACKGROUND PATTERN === */
    .iam-header {
      height: var(--header-height);
      background-image: var(--header-bg-image);
      background-size: cover;
      background-position: center;
      position: relative;
    }

    /* Close button */
    .close-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--close-bg);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .close-btn svg {
      width: 16px;
      height: 16px;
      stroke: var(--close-icon);
      stroke-width: 2;
      stroke-linecap: round;
    }

    .close-btn:active {
      transform: scale(0.96);
    }

    /* === CONTENT === */
    .iam-body {
      padding: var(--card-padding);
      padding-bottom: 0;
      color: var(--text-color);
    }

    .iam-title {
      font-size: var(--font-size-title);
      font-weight: 600;
      color: var(--title-color);
      margin-bottom: 16px;
    }

    .iam-list {
      list-style: disc;
      padding-left: 20px;
      font-size: var(--font-size-body);
      line-height: 1.45;
    }

    .iam-list li + li {
      margin-top: 12px;
    }

    /* === BUTTONS === */
    .iam-footer {
      padding: var(--card-padding);
      display: flex;
      gap: var(--button-gap);
    }

    .iam-btn {
      flex: 1;
      height: var(--button-height);
      min-height: 44px;
      border-radius: var(--button-radius);
      font-size: var(--font-size-button);
      font-weight: 600;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.1s ease, opacity 0.15s ease;
    }

    .iam-btn:active {
      transform: scale(0.97);
      opacity: 0.9;
    }

    .btn-secondary {
      background: var(--secondary-bg);
      border: 1px solid var(--secondary-border);
      color: var(--secondary-text);
    }

    .btn-primary {
      background: var(--primary-bg);
      color: var(--primary-text);
    }
  </style>
</head>

<body>
  <div class="iam-wrapper">
    <div class="iam-card">
      <!-- HEADER -->
      <div class="iam-header">
        <button
          id="close-btn"
          class="close-btn"
          aria-label="Close"
          data-onesignal-unique-label="permission-close"
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <!-- CONTENT -->
      <div class="iam-body">
        <h1 class="iam-title">Enable Notifications</h1>
        <ul class="iam-list">
          <li>Get recaps of what you did in the past week, how much you achieved.</li>
          <li>Get notified when you receive feedback or grades.</li>
          <li>Get reminders to meet your goals and weekly objectives.</li>
        </ul>
      </div>

      <!-- ACTIONS -->
      <div class="iam-footer">
        <button
          id="maybe-later-btn"
          class="iam-btn btn-secondary"
          data-onesignal-unique-label="permission-maybe-later"
        >
          Maybe Later
        </button>

        <button
          id="allow-btn"
          class="iam-btn btn-primary"
          data-onesignal-unique-label="permission-allow"
        >
          Allow
        </button>
      </div>
    </div>
  </div>

  <script>
    document.addEventListener("DOMContentLoaded", function () {
      var closeBtn = document.getElementById("close-btn");
      var maybeLaterBtn = document.getElementById("maybe-later-btn");
      var allowBtn = document.getElementById("allow-btn");
      var iamApi = window.OneSignalIamApi;

      function safeClose(event) {
        if (iamApi && typeof iamApi.close === "function") {
          iamApi.close(event);
        }
      }

      function safeTagUser(event, payload) {
        if (iamApi && typeof iamApi.tagUser === "function") {
          iamApi.tagUser(event, payload);
        }
      }

      function safeTriggerPushPrompt(event) {
        if (iamApi && typeof iamApi.triggerPushPrompt === "function") {
          iamApi.triggerPushPrompt(event);
        }
      }

      // Close (X)
      closeBtn.addEventListener("click", function (e) {
        safeClose(e);
      });

      // Maybe Later
      maybeLaterBtn.addEventListener("click", function (e) {
        safeTagUser(e, { permission_prompt: "delayed" });
        safeClose(e);
      });

      // Allow
      allowBtn.addEventListener("click", function (e) {
        safeTriggerPushPrompt(e);
        safeTagUser(e, { permission_prompt: "accepted" });
        safeClose(e);
      });
    });
  </script>
</body>
</html>

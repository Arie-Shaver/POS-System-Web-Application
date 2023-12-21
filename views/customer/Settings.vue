<template>
  <div>
    <div class="titleDiv">
      <p class="settingsTitle">Settings</p>
    </div>

    <div class="settingsDiv">
      <div class="setting">
        <label class="settingLabel">Dark Mode: </label>
        <label class="switch">
          <input type="checkbox" id="darkModeOn" @change="switchTheme($event)">
          <span class="slider round"></span>
        </label>
      </div>
      <div class="setting">
        <span>Font Size: </span>
        <button @click="decreaseFontSize" class="action-button"> - </button>
        <span>{{ selectedFontSize }}px</span>
        <button @click="increaseFontSize" class="action-button"> + </button>
      </div>
    </div>

    <!-- Google Translate Button -->
    <div class="setting google-translate-container">
      <label class="settingLabel language-label">Language: </label>
      <div class="google-translate-dropdown" id="google_translate_element"></div>
    </div>
  </div>
</template>

<script>
//@group Customer
//Allows user to select text size and website theme (light and dark mode)
export default {
name: 'Settings',
mounted() {
  const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.head.appendChild(script);

      // Initialize Google Translate dropdown
      window.googleTranslateElementInit = this.googleTranslateElementInit;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
  this.updateToggleSwitch(); // Initial update

  const observer = new MutationObserver(this.updateToggleSwitch);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
},
watch: {
  '$root.$data.theme': 'updateToggleSwitch',
},
data() {
return {
selectedFontSize: parseInt(localStorage.getItem('selectedFontSize')) || 24, 
textZoomEnabled: false,
};
},
methods: {
//@vuese
// Change theme (light and dark modes)
// @arg e -- event object
switchTheme(e) {
  const toggleSwitch = document.querySelector('input#darkModeOn[type="checkbox"]');
  if (e.target.checked) {
    localStorage.setItem('theme', 'dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
    document.documentElement.setAttribute('data-theme', 'light');
  }
},
//@vuese
// Switch to toggle between light and dark mode, shows current setting
updateToggleSwitch() {
const toggleSwitch = document.querySelector('input#darkModeOn[type="checkbox"]');
if (document.documentElement.getAttribute('data-theme') === 'dark') {
  toggleSwitch.checked = true;
} else {
  toggleSwitch.checked = false;
}
},
//@vuese
//Changes font size and sets it in local storage
handleFontSizeChange() {
localStorage.setItem('selectedFontSize', this.selectedFontSize);
document.body.style.fontSize = `${this.selectedFontSize}px`;
},
//@vuese
//Increases the font size to 34px
increaseFontSize() {
const maxFontSize = 34;
this.selectedFontSize = Math.min(this.selectedFontSize + 4, maxFontSize);
this.handleFontSizeChange();
},
//@vuese
//Decreases the font size to 28px
decreaseFontSize() {
const minFontSize = 28;
this.selectedFontSize = Math.max(minFontSize, this.selectedFontSize - 4);
this.handleFontSizeChange();
},
// Google Translate initialization function
  googleTranslateElementInit() {
    new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
  },
},
};
</script>

<style>
:root {
  /* light mode */
  --main-font-color: #000;
  --sub-font-color: white;
  --bg-color: white;
  --title-color: #EA0B43;
  --hover-color: #EA0B43;
  --selected-color: #EA0B43;
  --navbar-color: black;
}

[data-theme="dark"] {
  --main-font-color: #8b8b8b;
  --sub-font-color: white;
  --bg-color: black;
  --title-color: #FF9291;
  --hover-color: #FF9291;
  --selected-color: #FF9291;
  --navbar-color: #282828;
}

.settingsTitle{
  font-family: levitation;
  font-size: 40px;
  color: var(--title-color);
}

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: var(--hover-color);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--hover-color);
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.settingLabel{
  font-family: 'Concert One', sans-serif;
  align-items: center;
  vertical-align: middle;
  color: var(--main-font-color);
}

.setting{
  font-family: 'Concert One', sans-serif;
  margin-top: 30px;
  margin-bottom: 25px;
  color: var(--main-font-color);
}

.action-button {
  background-color: var(--main-font-color);
  color: var(--sub-font-color);
  font-family: 'Concert One', sans-serif;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  margin-right: 10px;
}
 .google-translate-container {
    text-align: left; /* Align to the left */
    margin-top: 30px; 
  }

  .settingLabel.language-label {
    margin-left: 600px;
  }

  .google-translate-dropdown {
    margin-left: 735px;
    margin-top: -20px;
  }
</style>

<template>
  <div id="menuEditor">
    <div id="titleDiv">
      <h1 class="title">
        Menu Editor
      </h1>
    </div>
    <div class="menu-grid">
      <div class="itemEditorDiv" v-for="(menuItem, index) in menu" :key="index">
        <div class="menu-item" @click="openEditDialog(index)">
          <div class="menu-image-container">
            <img class="menu-image" :src="`/assets/${menuItem.image}`" :alt="getAltText(menuItem.image)" />
          </div>
          <div class="item-details">
            <h3>{{ menuItem.tea_type }}</h3>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <h3>Edit Item</h3>
        <input class="modalName" v-model="editedItem.tea_type" placeholder="Menu Item" />
        <img class="modalImg" :src="`/assets/${editedItem.image}`" :alt="getAltText(editedItem.image)" />
        <input class="imgUpload" type="file" @change="handleImageUpload" accept="image/*" />
        <textarea class="descText" v-model="editedItem.description" placeholder="Description" />
        <button class='menuEditorBtns' @click="applyEdit(index)">Apply</button>
        <button class='menuEditorBtns' @click="closeEditDialog">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
//@group Manager
// Displays all menu items from the database in a grid. Each menu item is clickable, and allows managers to edit the name, description & upload their own images to the database.
export default {
  data() {
    return {
      apiBaseUrl: 'https://scad.onrender.com',
      menu: [],
      isModalOpen: false,
      editedItem: { tea_type: '', description: '', image: '' },
      originalItem: { tea_type: '', description: '', image: '' },
      selectedImage: null,
      altText: [],
      uploadedImage: null,
    };
  },
  created() {
    // Fetch menu data from the server
    this.fetchMenu();
  },
  methods: {
    fetchMenu() {
      fetch(`${this.apiBaseUrl}/menu/display`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          this.menu = data;
          this.fetchAltText();
        })
        .catch((error) => {
          console.error('Error fetching menu data:', error);
        });
    },
    fetchAltText() {
      fetch(`${this.apiBaseUrl}/allimageAltText`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          this.altText = data;
        })
        .catch((error) => {
          console.error('Error fetching menu data:', error);
        });
    },
    getAltText(image) {
      const altTextEntry = this.altText.find(entry => entry.image.trim() === image.trim());
      return altTextEntry ? altTextEntry.alt_text : '';
    },
    openEditDialog(index) {
      // Open the edit dialog and populate it with the item's data
      this.isModalOpen = true;
      this.editedItem = { ...this.menu[index] };
      this.originalItem = { ...this.menu[index] };
    },
    applyEdit(index) {

      console.log('In the editing diologue function');

      let changesMade = false;
      const editedItem = this.editedItem;
      const originalItem = this.originalItem;

      if (editedItem.tea_type !== originalItem.tea_type || editedItem.description !== originalItem.description || editedItem.image !== originalItem.image){
        changesMade = true;
      }

      if (changesMade == true){
        console.log('Changes Made function');
        this.updateMenuNameDesc(this.editedItem.tea_type, this.editedItem.description, this.editedItem.image, this.originalItem.tea_type).then(() => {
          this.menu[index] = {...this.editedItem};
        });
      }
      
      this.isModalOpen = false;
      
      if (this.uploadedImage) {
        // Download the image to the public folder
        this.downloadImage(this.uploadedImage, this.editedItem.image);
      }
    },

    closeEditDialog() {
      // Close the edit dialog
      this.isModalOpen = false;
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.uploadedImage = URL.createObjectURL(file);
        this.editedItem.image = file.name;
      }
    },

    async updateMenuNameDesc(newTeaType, newDescription, newImage, currTeaType) {
      const requestData = {
        newTeaType,
        newDescription,
        newImage,
        currTeaType,
      };

      console.log(newTeaType);
      console.log(newDescription);
      console.log(newImage);
      console.log(currTeaType);

      try {
        const apiUrl = "https://scad.onrender.com";
        const updateMenuUrl = `${apiUrl}/updateMenu`;

        const response = await fetch(updateMenuUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Menu item updated:', data);
      } catch (error) {
        console.error('Failed to update menu item:', error);
      }
    },
  },
};
</script>

<style scoped>
.menu-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  justify-content: center; /* Center the grid horizontally */
  padding: 20px; /* Add padding to all sides of the grid */
}


.itemEditorDiv {
  text-align: center; /* Center the content */
  padding-top: 20px;
  border: 1px solid black; /* Add a border around the item divs */
  background-color: black;
  color: #EA0B43;
  font-family: 'Concert One', sans-serif;
  font-size: 17px;
  max-width: 280px;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center items horizontally */
}

.menu-image-container {
  width: 200px; /* Set a fixed size for the image container */
  height: 267px;
  overflow: hidden; /* Clip the image if it's larger */
  background-color: pink;
}

.menu-image {
  width: 100%; /* Set the image to fill the container */
  height: 100%; /* Set the image to fill the container */
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex; /* Change display to flex */
  flex-direction: column; /* Stack components on top of each other */
  font-family: 'Concert One', sans-serif;
  font-size: 17px;
  align-items: center;
}

.modalImg {
  width: 200px; /* Set a fixed size for the uploaded image */
  height: 267px;
  object-fit: cover; /* Maintain image aspect ratio and fill the container */
  margin-left: auto;
  margin-right: auto;
  padding-top: 10px;
  padding-bottom: 10px;
}

.descText{
  margin-left: auto;
  margin-right: auto;
  width: 80%;
  padding-top: 5px;
  padding-bottom: 5px;
  text-align: justify;
  font-family: 'Concert One', sans-serif;
  font-size: 17px;
}

.imgUpload{
  padding-top: 5px;
  padding-bottom: 5px;
  font-family: 'Concert One', sans-serif;
  font-size: 17px;
  width: 80%;
}

.modalName{
  text-align: center;
  font-family: 'Concert One', sans-serif;
  font-size: 17px;
  width: 80%;
}

.menuEditorBtns{
  margin-right: 5px;
  font-family: 'Concert One', sans-serif;
  font-size: 20px;
  background-color: white;
  border-radius: 8px;
  border-color: black;
  margin-bottom: 5px;
  margin-top: 5px;
}

</style>
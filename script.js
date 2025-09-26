// load recipes from localStorage
let recipes = JSON.parse(localStorage.getItem("recipes") || "[]");

/*==========================| PART 1: ADDING RECIPES |===============================*/
// close/open new recipe form
const modal = document.getElementById("modal");
const addBtn = document.getElementById("addBtn"); // open form for new recipe
addBtn.addEventListener("click", () => modal.classList.add("show"));

/* find the button to close the form (cancel) */ // close form for new recipe

addBtn.addEventListener("click", () => modal.classList.add("show"));

const cancelBtn = document.getElementById("cancelBtn");
cancelBtn.addEventListener("click", () => modal.classList.remove("show"));

/* when the cancel button is clicked, what should happen to the modal? */

// upload button
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("recipeImage");
uploadBtn.addEventListener("click", () => {
  fileInput.click();
});

// upload status (is there already a photo loaded or not?)
const uploadStatus = document.getElementById("uploadStatus");
fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    uploadStatus.style.display = "inline";
  } else {
    uploadStatus.style.display = "none";
  }
});

// clear image
const clearImageBtn = document.getElementById("clearImage");
clearImageBtn.addEventListener("click", () => {
  fileInput.value = "";
  uploadStatus.style.display = "none";
})
/* how can we clear the image if we want a new one? is there an element for it? */
/* add an event listener to set everything back to null */

// new recipe form
const form = document.getElementById("addForm");
/* find the element that corresponds to the form */
form.addEventListener("submit", e => {
  e.preventDefault();
  const data = new FormData(form);

  const newRecipe = {
    title: data.get("title"),
    subtitle: data.get("subtitle"),
    ingredients: data.get("ingredients").split("\n"),
    steps: data.get("steps").split("\n"),
    image: null
  };

  // read image if provided
  const file = data.get("image");
  if (file) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      newRecipe.image = evt.target.result;
      recipes.unshift(newRecipe);
      localStorage.setItem("recipes", JSON.stringify(recipes));
      renderList(recipes);
    };
    reader.readAsDataURL(file);
  } else {
    recipes.unshift(newRecipe);
    localStorage.setItem("recipes", JSON.stringify(recipes));
    renderList(recipes);
  }

  form.reset(); // empty form
  uploadStatus.style.display = "none"; // remove img message
  modal.classList.remove("show"); // hide form
});

/*===================================================================================*/

/*==========================| PART 2: DISPLAY RECIPES |==============================*/
const container = document.getElementById("recipes"); // part of the page where the cards are
const emptyState = document.getElementById("emptyState"); // what to display if there are no cards

function renderList(list) {
  container.innerHTML = ""; // set to empty for now
  
  // check to display empty message
  /* check if we need to display an empty message. if we do, which element is it? */

  // use the list to fill in the template html
  const template = document.getElementById("recipe-template");
  list.forEach((recipe, index) => {
    // every time we have a new recipe, we want to create a new copy of the card
    const card = template.content.cloneNode(true);

    // thumbnail with first initial
    const thumb = card.querySelector(".thumbnail")
    thumb.textContent = recipe.title[0];

    // name of recipe
    const name = card.querySelector(".name");
    name.textContent = recipe.title;

    // description of recipe (optional)
    const desc = card.querySelector(".desc");
    desc.textContent = recipe.subtitle || "";

    // image of recipe (optional)
    const imgContainer = card.querySelector(".recipe-image");
    if (recipe.image) {
      const img = document.createElement("img");
      img.src = recipe.image;
      imgContainer.appendChild(img);
    }

    // ingredients
    const ingList = card.querySelector(".ing-list");
    recipe.ingredients.forEach(i => {
      const li = document.createElement("li");
      li.textContent = i;
      ingList.appendChild(li);
    });

    // steps
    const stepsList = card.querySelector(".steps-list");
    recipe.steps.forEach(i => {
      const li = document.createElement("li");
      li.textContent = i;
      stepsList.appendChild(li);
    });

    // close/open card
    const body = card.querySelector(".card-body");
    const arrow = card.querySelector(".arrow");

    arrow.addEventListener("click", (e) => {
      if (body.style.maxHeight) { // if open, close
        body.style.maxHeight = null;
        arrow.classList.remove("rotate");
      } else { // if close, open!
        body.style.maxHeight = body.scrollHeight + "px";
        arrow.classList.add("rotate");
      }
    });

    // delete recipe
    card.querySelector(".delete-btn").addEventListener("click", (e) => {
      recipes.splice(index, 1);
      localStorage.setItem("recipes", JSON.stringify(recipes));
      renderList(recipes);
    });

    container.appendChild(card); // add new recipe when fully completed
  });
}

renderList(recipes);

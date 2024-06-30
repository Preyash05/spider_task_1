document.addEventListener('DOMContentLoaded', () => {
  
  const ingredientForm = document.getElementById('ingredient-form');
  const cuisineFilter = document.getElementById('cuisine-filter');
  const prepTimeFilter = document.getElementById('prep-time-filter');
  const dietaryFilter = document.getElementById('dietary-filter');
  const recipesContainer = document.getElementById('recipes-container');
  const savedRecipesContainer = document.getElementById('saved-recipes-container');
  const publishRecipeForm = document.getElementById('publish-recipe-form');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginModal = document.getElementById('login-modal');
  const loginButton = document.getElementById('login-button');
  const logoutButton = document.getElementById('logout-button');
  const welcomeMessage = document.getElementById('welcome-message');
  const usernameDisplay = document.getElementById('username');

  
  const showLoginModal = () => {
    loginModal.style.display = 'block';
  };

  
  const hideLoginModal = () => {
    loginModal.style.display = 'none';
  };

 
  loginButton.addEventListener('click', () => {
    showLoginModal();
  });

 
  document.getElementsByClassName('close')[0].addEventListener('click', () => {
    hideLoginModal();
  });

 
  window.addEventListener('click', (event) => {
    if (event.target == loginModal) {
      hideLoginModal();
    }
  });

  
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    logoutButton.style.display = 'none';
    loginButton.style.display = 'block';
    welcomeMessage.style.display = 'none';
    usernameDisplay.textContent = '';
   
    savedRecipesContainer.innerHTML = '';
  });

 
  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = registerForm.elements['register-username'].value;
    const password = registerForm.elements['register-password'].value;
    if (localStorage.getItem(username) === null) {
      localStorage.setItem(username, password);
      alert('Registration successful!');
      registerForm.reset();
    } else {
      alert('Username already exists. Please choose a different username.');
    }
  });

  
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = loginForm.elements['login-username'].value;
    const password = loginForm.elements['login-password'].value;
    if (localStorage.getItem(username) === password) {
      localStorage.setItem('currentUser', username);
      loginForm.reset();
      hideLoginModal();
      loginButton.style.display = 'none';
      logoutButton.style.display = 'block';
      welcomeMessage.style.display = 'inline';
      usernameDisplay.textContent = username;
      alert('Login successful!');
      loadSavedRecipes();
    } else {
      alert('Invalid username or password.');
    }
  });

 
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    loginButton.style.display = 'none';
    logoutButton.style.display = 'block';
    welcomeMessage.style.display = 'inline';
    usernameDisplay.textContent = currentUser;
    loadSavedRecipes();
  }
  ingredientForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const selectedIngredients = Array.from(ingredientForm.querySelectorAll('input[type="checkbox"]:checked'))
                                     .map(checkbox => checkbox.value);
    const selectedCuisine = cuisineFilter.value;
    const selectedPrepTime = prepTimeFilter.value;
    const selectedDietary = dietaryFilter.value;

   
    const filteredRecipes = recipes.filter(recipe => {
      let includeRecipe = true;
      if (selectedIngredients.length > 0) {
        includeRecipe = selectedIngredients.every(ingredient =>
          recipe.ingredients.includes(ingredient)
        );
      }
      if (includeRecipe && selectedCuisine) {
        includeRecipe = recipe.cuisine === selectedCuisine;
      }
      if (includeRecipe && selectedPrepTime) {
        includeRecipe = recipe.prepTime <= parseInt(selectedPrepTime);
      }
      if (includeRecipe && selectedDietary) {
        includeRecipe = recipe.dietary.includes(selectedDietary);
      }
      return includeRecipe;
    });

    displayRecipes(filteredRecipes);
  });

 
  let recipes = [
    {
      id: '1',
      name: 'Chicken Gravy',
      image: 'https://th.bing.com/th/id/OIP.sD3RSC9cjMj5TlTLi2HdIgHaEK?w=202&h=113&c=7&r=0&o=5&dpr=1.3&pid=1.7',
      ingredients: ['chicken','onion','tomato'],
      instructions: 'Cook chicken according to package instructions and add onion, tomato',
      cuisine: 'International',
      prepTime: 30,
      dietary: ['Gluten-free']
    },
    {
      id: '2',
      name: 'Chicken Stir Fry',
      image: 'https://th.bing.com/th?id=OSK.5b2ab17d84fb7056802475baab6dbf13&w=228&h=128&rs=2&qlt=80&o=6&cdv=1&dpr=1.3&pid=16.1',
      ingredients: ['chicken', 'soya'],
      instructions: 'Slice chicken into strips and stir-fry in a hot pan until cooked through.',
      cuisine: 'Asian',
      prepTime: 25,
      dietary: ['Dairy-free']
    },
    {
      id: '3',
      name: 'Soya Veggie Stir Fry',
      image: 'https://th.bing.com/th?id=OSK.e309a29e880bfb6bf57409e733beea14&w=228&h=152&rs=2&qlt=80&o=6&cdv=1&dpr=1.3&pid=16.1',
      ingredients: ['soya', 'carrot', 'onion', 'garlic'],
      instructions: 'Cook soya chunks according to package instructions. Stir-fry chopped carrots, onions, and garlic until tender. Add cooked soya chunks and stir well. Serve hot.',
      cuisine: 'Asian',
      prepTime: 20,
      dietary: ['Vegan', 'Gluten-free']
    }
  ];

  
  displayRecipes(recipes);

  function displayRecipes(recipesArray) {
    recipesContainer.innerHTML = '';
    recipesArray.forEach(recipe => {
      const recipeElement = document.createElement('div');
      recipeElement.classList.add('recipe');
      recipeElement.innerHTML = `
        <h3>${recipe.name}</h3>
        <img src="${recipe.image}" alt="${recipe.name}">
        <p>Preparation Time: ${recipe.prepTime} mins</p>
        <p>Cuisine: ${recipe.cuisine}</p>
        <p>Dietary Restrictions: ${recipe.dietary.join(', ')}</p>
        <p>Ingredients: ${recipe.ingredients.join(', ')}</p>
        <p>Instructions: ${recipe.instructions}</p>
        <div class="reviews">
          ${recipe.reviews ? recipe.reviews.map(review => `<p>${review.rating} stars: ${review.reviewText}</p>`).join('') : '<p>No reviews yet.</p>'}
        </div>
        <textarea class="review-text" placeholder="Write your review"></textarea>
        <select class="review-rating">
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </select>
        <button class="review-submit" data-id="${recipe.id}">Submit Review</button>
        <button class="voiceover">Read Instructions</button>
        <button class="save-recipe" data-id="${recipe.id}">Save Recipe</button>
      `;
      recipesContainer.appendChild(recipeElement);

      
      recipeElement.querySelector('.save-recipe').addEventListener('click', () => {
        saveRecipe(recipe);
      });

      
      recipeElement.querySelector('.review-submit').addEventListener('click', (event) => {
        const reviewText = recipeElement.querySelector('.review-text').value;
        const rating = recipeElement.querySelector('.review-rating').value;
        submitReview(recipe.id, reviewText, rating);
      });

     
     
    });
  }

  
  function saveRecipe(recipe) {
    let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    savedRecipes.push(recipe);
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    alert('Recipe saved successfully!');
  }

 
  function loadSavedRecipes() {
    savedRecipesContainer.innerHTML = '';
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    savedRecipes.forEach(recipe => {
      const recipeElement = document.createElement('div');
      recipeElement.classList.add('recipe');
      recipeElement.innerHTML = `
        <h3>${recipe.name}</h3>
        <img src="${recipe.image}" alt="${recipe.name}">
        <p>Preparation Time: ${recipe.prepTime} mins</p>
        <p>Cuisine: ${recipe.cuisine}</p>
        <p>Dietary Restrictions: ${recipe.dietary.join(', ')}</p>
        <p>Ingredients: ${recipe.ingredients.join(', ')}</p>
        <p>Instructions: ${recipe.instructions}</p>
        <div class="reviews">
          ${recipe.reviews ? recipe.reviews.map(review => `<p>${review.rating} stars: ${review.reviewText}</p>`).join('') : '<p>No reviews yet.</p>'}
        </div>
        <textarea class="review-text" placeholder="Write your review"></textarea>
        <select class="review-rating">
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </select>
        <button class="review-submit" data-id="${recipe.id}">Submit Review</button>
        <button class="voiceover">Read Instructions</button>
      `;
      savedRecipesContainer.appendChild(recipeElement);

     
      recipeElement.querySelector('.review-submit').addEventListener('click', (event) => {
        const reviewText = recipeElement.querySelector('.review-text').value;
        const rating = recipeElement.querySelector('.review-rating').value;
        submitReview(recipe.id, reviewText, rating);
      });

      
      recipeElement.querySelector('.voiceover').addEventListener('click', () => {
        const instructions = recipeElement.querySelector('p:nth-of-type(6)').textContent;
        
      });
    });
  }

  
  function submitReview(recipeId, reviewText, rating) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe.reviews) {
      recipe.reviews = [];
    }
    recipe.reviews.push({ reviewText, rating });
    displayRecipes(recipes);
    saveRecipe(recipe);
  }

  
  publishRecipeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newRecipe = {
      id: Date.now().toString(),
      name: publishRecipeForm.elements['name'].value,
      image: publishRecipeForm.elements['image'].value,
      ingredients: publishRecipeForm.elements['ingredients'].value.split(','),
      instructions: publishRecipeForm.elements['instructions'].value,
      cuisine: publishRecipeForm.elements['cuisine'].value,
      prepTime: parseInt(publishRecipeForm.elements['prep-time'].value),
      dietary: publishRecipeForm.elements['dietary'].value.split(',')
    };
    recipes.push(newRecipe);
    publishRecipeForm.reset();
    displayRecipes(recipes);
  });
});

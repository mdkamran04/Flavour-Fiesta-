const searchbox = document.querySelector('.searchbox');

const searchbutton = document.querySelector('.searchbutton');

const recipeContainer = document.querySelector('.recipe-container');

const recipeContent = document.querySelector('.recipe-content');

const recipeCloseBtn = document.querySelector('.recipe-closeBtn');


// Function to get recipe
const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = " <h2>Getting your recipes super soon...</h2>";
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();

        recipeContainer.innerHTML = "";


        response.meals.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipeBox');
            recipeDiv.innerHTML = `
       <img src="${meal.strMealThumb}">
       <h3>${meal.strMeal}</h3>
       <p><span>${meal.strArea}</span> Cuisine</p>
       <p>Category:<span>${meal.strCategory}</span></p>
       `
            const button = document.createElement('button');
            button.textContent = "Get Recipe";
            recipeDiv.appendChild(button);

            // Now adding event listener on get recipe button
            button.addEventListener('click', () => {
                openRecipePopUp(meal);
            });

            recipeContainer.appendChild(recipeDiv);
        });
    }

    catch (error) {
        recipeContainer.innerHTML = " <h2>Please enter a valid dish name!</h2>";
    }
}
//Funtion for get ingredients

const fetchIng = (meal) => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`
        }
        else {
            break;
        }
    }
    return ingredientsList;

}

const openRecipePopUp = (meal) => {
    recipeContent.innerHTML = `
<h3 class="recipeName">${meal.strMeal}</h3>
<h4>Ingredients:</h4>
<ul class="ingredientsList">${fetchIng(meal)}</ul>

<div class="recipeInstructions">
    <h4>Instructions: </h4>
   <p > ${meal.strInstructions}</p>
</div> 

`
    recipeContent.parentElement.style.display = "block";

}


recipeCloseBtn.addEventListener('click', () => {
    recipeContent.parentElement.style.display = "none";
})

searchbutton.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchbox.value.trim();
    if (!searchInput) {
        recipeContainer.innerHTML = " Please Type the meal in the search box";
        return;
    }

    fetchRecipes(searchInput);
});


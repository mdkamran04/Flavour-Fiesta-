const searchbox = document.querySelector('.searchbox');
const searchbutton = document.querySelector('.searchbutton');
const recipeContainer = document.querySelector('.recipe-container');
const recipeContent = document.querySelector('.recipe-content');
const recipeCloseBtn = document.querySelector('.recipe-closeBtn');
const recipeDetails = document.querySelector('.recipe-details');
const overlay = document.querySelector('.overlay');


searchbox.addEventListener('focus', () => {
    searchbox.parentElement.classList.add('focused');
});

searchbox.addEventListener('blur', () => {
    searchbox.parentElement.classList.remove('focused');
});


const ctaButtons = document.querySelectorAll('.cta-button');
ctaButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-5px)';
    });
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
    });
});



const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<div class='loading'><i class='fas fa-spinner fa-spin'></i><h3>Getting your recipes...</h3></div>";
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();

        recipeContainer.innerHTML = "";

        if (!response.meals) {
            recipeContainer.innerHTML = "<div class='no-results'><i class='fas fa-exclamation-circle'></i><h3>No recipes found. Try another search!</h3></div>";
            return;
        }

        response.meals.forEach((meal, index) => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipeBox');

            recipeDiv.style.animationDelay = `${index * 0.1}s`;
            
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}" loading="lazy" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea}</span> Cuisine</p>
                <p>Category: <span>${meal.strCategory}</span></p>
            `;
            
            const button = document.createElement('button');
            button.innerHTML = "<i class='fas fa-utensils'></i> Get Recipe";
            recipeDiv.appendChild(button);


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
            <p>${meal.strInstructions}</p>
        </div>
        
        ${meal.strYoutube ? `
        <div class="recipe-video">
            <h4>Video Tutorial:</h4>
            <a href="${meal.strYoutube}" target="_blank" class="video-link">
                <i class="fab fa-youtube"></i> Watch on YouTube
            </a>
        </div>` : ''}
    `;
    

    overlay.style.display = 'block';
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);
    

    recipeDetails.style.display = 'block';
    setTimeout(() => {
        recipeDetails.classList.add('active');
    }, 10);
}


recipeCloseBtn.addEventListener('click', () => {

    recipeDetails.classList.remove('active');
    overlay.style.opacity = '0';
    
    setTimeout(() => {
        recipeDetails.style.display = 'none';
        overlay.style.display = 'none';
    }, 300);
});


overlay.addEventListener('click', () => {
    recipeCloseBtn.click();
});

searchbutton.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchbox.value.trim();
    if (!searchInput) {
        recipeContainer.innerHTML = " Please Type the meal in the search box";
        return;
    }

    fetchRecipes(searchInput);
});


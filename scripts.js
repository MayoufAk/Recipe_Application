const mealPopup = document.getElementById("meal-popup");
const mealInfoEl = document.getElementById("meal-info");
const popupCloseBtn = document.getElementById("close-popup");
 const mealsEL=document.getElementById("meals")
 const favoriteContainer=document.getElementById("fav-meals")
const  searchTerm =document.getElementById("search-term")
const  searchBtn=document.getElementById("search")
getRandomMeal()
fetchFavMEals()

async function getRandomMeal(){ 
   const response= await fetch("https://www.themealdb.com/api/json/v1/1/random.php")
   const respData= await response.json()
 
  const randomMeal=respData.meals[0]
  // console.log(randomMeal)

   addMeal(randomMeal,true) 

}
async function getMealById(id){
   const resp= await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+id)
  //  console.log(resp)
     const respData= await resp.json()
     const meal=await respData.meals[0]
     return meal
   }
async function getMealsBySearch(term){
  const resp= await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term)
  const respData=await resp.json()
  const meals=respData.meals
  return meals
}

function addMeal(mealData,random=false){
  console.log(mealData)
     const meal=document.createElement("div")
     meal.classList.add("meal")
     meal.innerHTML=`
        <div class="meal-header">
            ${random ? `<span class="random">
            Random Recipes 
        </span>`:"" }
            <img src=${mealData.strMealThumb}
            alt="${mealData.strMeal}">
        </div>
    <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn">
            <i class="fa fa-heart"></i>
            </button>
    </div>`
  const btn=meal.querySelector(".meal-body .fav-btn")
   btn.addEventListener("click",()=>{
    if( btn.classList.contains("active")){
       removeMealLS(mealData.idMeal)
       btn.classList.remove("active")
    }else{
    addMealLS(mealData.idMeal)
     btn.classList.toggle("active")
    }
    fetchFavMEals()
    })
    meal.addEventListener("click", () => {
      showMealInfo(mealData);
  });
    mealsEL.appendChild(meal)
}

function addMealLS(mealId){
 const mealIds=getMealFromLS( )

 localStorage.setItem("mealIds",JSON.stringify([...mealIds, mealId]))
}
function removeMealLS(mealId){
  const mealIds=getMealFromLS( )
  localStorage.setItem("mealIds",JSON.stringify(mealIds.filter((id)=>id !== mealId)))
}

function getMealFromLS(){
  const mealIds=JSON.parse(localStorage.getItem("mealIds"))
  return mealIds===null?[]:mealIds
}
async function fetchFavMEals(){
   // clean the container
   favoriteContainer.innerHTML=""
   const mealIds=getMealFromLS()

   const meals=[]
  for(let i=0;i<mealIds.length;i++){
    const mealId=mealIds[i]
   const  meal=await getMealById(mealId)
    addMealFav(meal)
  }
}
function addMealFav(mealData){
    
     const favMeal=document.createElement("li")
   
     favMeal.innerHTML=`
     <img 
     src="${mealData.strMealThumb}"
      alt="${mealData.strMeal}"><span>${mealData.strMeal}</span>
      <button class="clear"><i class="fa-solid fa-rectangle-xmark"></i></button>
      `
      const btn =favMeal.querySelector(".clear")
      btn.addEventListener("click",()=>{
        removeMealLS(mealData.idMeal)
        fetchFavMEals()

      })
      favMeal.addEventListener("click", () => {
        showMealInfo(mealData);
    });
    favoriteContainer.appendChild(favMeal)
}

searchBtn.addEventListener("click",async ()=>{
  //clean container
  mealsEL.innerHTML=" "
 const search= searchTerm.value
 const meals =await getMealsBySearch(search)
 if(meals){
      meals.forEach((meal) => {
      addMeal(meal)
  });
 }
})
function showMealInfo(mealData) {
  // clean it up
  mealInfoEl.innerHTML = "";

  // update the Meal info
  const mealEl = document.createElement("div");

  const ingredients = [];

  // get ingredients and measures
  for (let i = 1; i <= 20; i++) {
      if (mealData["strIngredient" + i]) {
          ingredients.push(
              `${mealData["strIngredient" + i]} - ${
                  mealData["strMeasure" + i]
              }`
          );
      } else {
          break;
      }
  }

  mealEl.innerHTML = `
      <h1>${mealData.strMeal}</h1>
      <img
          src="${mealData.strMealThumb}"
          alt="${mealData.strMeal}"
      />
      <p>
      ${mealData.strInstructions}
      </p>
      <h3>Ingredients:</h3>
      <ul>
          ${ingredients
              .map(
                  (ing) => `
          <li>${ing}</li>
          `
              )
              .join("")}
      </ul>
  `;

  mealInfoEl.appendChild(mealEl);

  // show the popup
  mealPopup.classList.remove("hidden");
}

popupCloseBtn.addEventListener("click",()=>{
  mealPopup.classList.add("hidden")
})
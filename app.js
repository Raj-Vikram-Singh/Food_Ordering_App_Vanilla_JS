const content = document.getElementById("content");
const cuisine = document.getElementById('cuisine');
const sortDrpDwn = document.getElementById('sort');
const _url = '/mockData.json' ;

const fav = "fa-heart";
const notFav =  "fa-heart-o";
let favClass;

let jsonData = [];
let favoriteList=[];
let cuisineFilteredList=[];
let sortByLabelList = [];

// ajax call to fetch data from the API(here from locally created json file)
function getDataService(){

      return  fetch(_url)
        .then(resp => resp.json())
        .then(data => {           
            jsonData = data;
            return jsonData;
        });
            
}

// create the individual cell view.
function createGrid(viewObject){
        favClass = viewObject.favorite? fav :notFav;
        let individualRestaurant = ` <div class = "restaurant" id = ${viewObject.id}  >
        <i class="fa ${favClass} heart"  title = "heart"></i>
        <img src="${viewObject.photos}">
        ${viewObject.rating} <i class="fa fa-star" aria-hidden="true"></i>
        <p>${viewObject.name}</p>
        <p>place : ${viewObject.place}</p>
        <p>Usually Delivers in : ${viewObject.ETA} minutes</p>

        </div>`

        content.insertAdjacentHTML("beforeend", individualRestaurant) ;
    
}

// take array of restaurants and call createGrid for each of them.
function renderView(viewArray){

        viewArray.forEach(item => createGrid(item) );

};


// Mark the restaurants as favorite and also store it in to local storage.
function markAsFavorite(element){
    
         for(i=0; i< jsonData.length; i++)
         if( jsonData[i].id == element.parentNode.id){

            jsonData[i].favorite = jsonData[i].favorite ? false :true;            
            element.classList.toggle(fav);
            element.classList.toggle(notFav);
             
             setLocalStorage(jsonData);
             return;          
         }
   
}

// using event delegation to identify click event on heart icon and then calling marskAsFavorite func.
content.addEventListener('click', function(event){
    
    let element = event.target;
   
    if(element.title ==="heart"){
        markAsFavorite(element);
    }  
});

// this is called when the application bootstraps and after every refresh.
 function onLoad(){
     let localStoredData = getLocalStorage();  //if local storage is present get data from it, else take data from the API call.
     if(localStoredData){
         jsonData = localStoredData;
         renderView(jsonData);
         return;
     }
     getDataService().then(data => {
         renderView(data);
     } );
 };

 onLoad();

//  Search using input text box.
  let searchHotel = function (input){

    cuisine.selectedIndex = 0;  // unsetting the filter dropdowns and also clearing all the filtered lists. 
    sortDrpDwn.selectedIndex=0;
    cuisineFilteredList=[];
    sortByLabelList = [];

    let filteredList=[];
    
    filteredList = jsonData.filter(item => item.name.toUpperCase().includes(input.trim().toUpperCase()) ); //makes a search from entire jsonData that we get from the API call.
    document.querySelectorAll('.restaurant').forEach(function(el) {
        el.parentNode.removeChild(el);
     });

     if(document.querySelectorAll(".filterMessage")[0]){
        document.querySelectorAll('.filterMessage').forEach(function(el) {  //removing message that comes on absence of favorite.
            el.parentNode.removeChild(el); });
    }

     renderView(filteredList);

 };
   
//  debounce function which takes hotelSearch function as input and triggers it after 'limit' time, when the user stops typing.
   function debounce(heavyFunct, limit){
       let timer;

       return function(input){

        clearTimeout(timer);
        timer = setTimeout(heavyFunct, limit, input);
        
       };

   }

//    this function is called from UI on keyup.
   debouncedSearchFuncton = debounce(searchHotel, 500);  //calling debounce; with limit 500 mili sec. 


//    filter by type of cuisine.
 function cuisineFilter(input){

    if(document.querySelectorAll(".filterMessage")[0]){
        document.querySelectorAll('.filterMessage').forEach(function(el) {  //removing message that comes on absence of favorite.
            el.parentNode.removeChild(el); });
    }

    sortDrpDwn.selectedIndex = 0;
    cuisineFilteredList=[];
    cuisineFilteredList = jsonData.filter(item => item.tags.includes(input) );
    document.querySelectorAll('.restaurant').forEach(function(el) {
        el.parentNode.removeChild(el);
     });
   
     
    renderView(cuisineFilteredList);
    
    

 }


//  sort by ETA, Rating and Favorite.
 function sort(input){

    if(document.querySelectorAll(".filterMessage")[0]){
        document.querySelectorAll('.filterMessage').forEach(function(el) {
            el.parentNode.removeChild(el); });
    }

    if(cuisineFilteredList[0]){
        sortByLabelList = cuisineFilteredList;   // sort the list w.r.t the cuisine filter if it is applied.
    }

    else{
        sortByLabelList = jsonData.slice(0);
    }

    document.querySelectorAll('.restaurant').forEach(function(el) {
        el.parentNode.removeChild(el);
     });

     if(input === 'rating'){

        sortByLabelList = sortByLabelList.sort((a,b) =>{
           return b.rating - a.rating;
        });

        renderView(sortByLabelList);
     }

     else if(input === 'ETA'){
        sortByLabelList = sortByLabelList.sort((a,b) =>{
            return a.ETA - b.ETA;
         });

         renderView(sortByLabelList);

     }

    else if(input === 'favorite'){
        favoriteList =[];
        favoriteList = sortByLabelList.filter(item => item.favorite === true);

         if(!favoriteList[0]){  //render message if no favorite marked.
            
            content.insertAdjacentHTML("beforeend", "<div class = 'filterMessage' style = 'padding-left: 12px; color: green;'> There are no favorite Restaurants saved</div>");
            return;
         }

         renderView(favoriteList);
     }    
 }


//  to set the local storage
 function setLocalStorage(storeData){

    localStorage.setItem('hotelList', JSON.stringify(storeData)); //localStorage.setItem stores string key value pair, threfore convert the data in to string first.
 }

//  to get the local storage.
 function getLocalStorage(){
    return JSON.parse(localStorage.getItem('hotelList'));  // parse the stored data in string in to json format.
 }
 
//  clears the local storage and refreshes the page.
 function refresh(){
    localStorage.clear();
    location.reload();
}

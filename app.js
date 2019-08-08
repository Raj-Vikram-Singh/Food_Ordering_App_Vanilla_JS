
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


function getDataService(){

      return  fetch(_url)
        .then(resp => resp.json())
        .then(data => {           
            jsonData = data;
            return jsonData;
        });
            
};

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

function renderView(viewArray){

        viewArray.forEach(item => createGrid(item) );

};



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


content.addEventListener('click', function(event){
    
    let element = event.target;
   
    if(element.title ==="heart"){
        markAsFavorite(element);
    }  
});


 function onLoad(){
     let localStoredData = getLocalStorage();
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

 function searchHotel(input){

    cuisine.selectedIndex = 0;
    sortDrpDwn.selectedIndex=0;
    cuisineFilteredList=[];
    sortByLabelList = [];

    let filteredList=[];
    
    filteredList = jsonData.filter(item => item.name.toUpperCase().includes(input.trim().toUpperCase()) );
    document.querySelectorAll('.restaurant').forEach(function(el) {
        el.parentNode.removeChild(el);
     });

     if(document.querySelectorAll(".filterMessage")[0]){
        document.querySelectorAll('.filterMessage').forEach(function(el) {
            el.parentNode.removeChild(el); });
    }

     renderView(filteredList);

 }

 function cuisineFilter(input){

    if(document.querySelectorAll(".filterMessage")[0]){
        document.querySelectorAll('.filterMessage').forEach(function(el) {
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

 function sort(input){

    if(document.querySelectorAll(".filterMessage")[0]){
        document.querySelectorAll('.filterMessage').forEach(function(el) {
            el.parentNode.removeChild(el); });
    }

    if(cuisineFilteredList[0]){
        sortByLabelList = cuisineFilteredList;
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

         if(!favoriteList[0]){
            
            content.insertAdjacentHTML("beforeend", "<div class = 'filterMessage' style = 'padding-left: 12px; color: green;'> There are no favorite Restaurants saved</div>");
            return;
         }

         renderView(favoriteList);
     }    
 }

 function setLocalStorage(storeData){

    localStorage.setItem('hotelList', JSON.stringify(storeData));
 }

 function getLocalStorage(){
    return JSON.parse(localStorage.getItem('hotelList'));
 }
 
 function refresh(){
    localStorage.clear();
    location.reload();
}
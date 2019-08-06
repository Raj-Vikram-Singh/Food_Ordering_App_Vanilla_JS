
const content = document.getElementById("content");
const _url = '/mockData.json' ;

const fav = "fa-heart";
const notFav =  "fa-heart-o";
let favClass;

let jsonData = [];
let favoriteList=[];


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

            //  document.getElementById(elementId).querySelector(".heart").classList.toggle(fav);
            //  document.getElementById(elementId).querySelector(".heart").classList.toggle(notFav);
            element.classList.toggle(fav);
            element.classList.toggle(notFav);
             
             setLocalStorage(jsonData);

             return;
            //  break;
           
         }
   
}


content.addEventListener('click', function(event){
    
    let element = event.target;
    let elementId;
    if(element.title ==="heart"){
      //  elementId= element.parentNode.id;
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

    let filteredList=[];

   
    filteredList = jsonData.filter(item => item.name.toUpperCase().includes(input.toUpperCase()) );
    document.querySelectorAll('.restaurant').forEach(function(el) {
        el.style.display = 'none';
     });

     filteredList.forEach(item =>{
        document.getElementById(item.id).style.display = "block";
     });

 }

 function cuisineFilter(input){
    let filteredList=[];
    filteredList = jsonData.filter(item => item.tags.includes(input) );
    document.querySelectorAll('.restaurant').forEach(function(el) {
        el.style.display = 'none';
     });

     filteredList.forEach(item =>{
        document.getElementById(item.id).style.display = "block";
     });

 }

 function sort(input){
    
    

    if(document.getElementById("filterMessage")){
        document.getElementById("filterMessage").style.display = "none"; 
    }

    document.querySelectorAll('.restaurant').forEach(function(el) {
        el.style.display = 'none';
     });

     if(input === 'rating'){

        jsonData = jsonData.sort((a,b) =>{
           return b.rating - a.rating;
        });

        renderView(jsonData);
     }

     else if(input === 'ETA'){
        jsonData = jsonData.sort((a,b) =>{
            return a.ETA - b.ETA;
         });

         renderView(jsonData);

     }

    else if(input === 'favorite'){
        favoriteList = jsonData.filter(item => item.favorite === true);

         if(!favoriteList[0]){
            content.insertAdjacentHTML("beforeend", "<div id = 'filterMessage'> There are no Favorites Restaurants saved</div>");
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
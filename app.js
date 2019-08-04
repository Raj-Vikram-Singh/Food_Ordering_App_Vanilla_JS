
const content = document.getElementById("content");
const _url = '/mockData.json' ;

const fav = "fa-heart";
const notFav =  "fa-heart-o";
let favClass;

let jsonData = [];

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



function markAsFavorite(elementId){
    
         for(i=0; i< jsonData.length; i++)
         if( jsonData[i].id == elementId){

             jsonData[i].favorite = true;

             document.getElementById(elementId).querySelector(".heart").classList.toggle(fav);
             document.getElementById(elementId).querySelector(".heart").classList.toggle(notFav);
             
             break;
           
         }
   
}


content.addEventListener('click', function(event){
    
    let element = event.target;
    let elementId;
    if(element.title ==="heart"){
        elementId= element.parentNode.id;
        markAsFavorite(elementId);
    }  
});


 function onLoad(){
     getDataService().then(data => {
         renderView(data);
     } );
 };

 onLoad();

 
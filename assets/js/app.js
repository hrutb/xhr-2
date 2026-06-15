


let base_url ="https://jsonplaceholder.typicode.com" ;  

let post_url  = `${base_url}/posts` ; 

//local state management 
   let postArr =[] ; 



const titleControl= document.getElementById("title");
const bodyControl= document.getElementById("body");
const postForm= document.getElementById('postForm');
const postContainer= document.getElementById('postContainer');
const userIdControl =document.getElementById('userId');
const addPost= document.getElementById('addPost');
const updatePost= document.getElementById('updatePost');



const spinner =document.getElementById('spinner');




function snackbar(msg,icon){
      swal.fire({ 
          title:msg,
          icon:icon ,
          timer:3000
      })
}


function createCard(arr){ 
      let res = " "; 
      
      arr.forEach(ele=> {
            res +=`<div class="col-md-4 mb-4" id="${ele.id}">
                    
                  <div class="card h-100 " >
                      <div class="card-header">
                      <h3>
                       ${ele.title}
                       </h3>
                     </div>
                    <div class="card-body">
                      <p>
                        ${ele.body}
                     </p>
                    </div>
                    <div class="card-footer d-flex justify-content-between align-items-center">
                           <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-primary ">Edit</button>
                           <button onclick="onRemove(this)" class="btn btn-inline-block btn-outline-danger ">Delete</button>
                    </div>
                </div>
            </div>`
      });
   postContainer.innerHTML= res;
}


function fetchPost(){ 
       let xhr = new XMLHttpRequest() ; 

       xhr.open('GET', post_url,true);
       xhr.send(null); 

       xhr.onload= function(){  
         
        if(xhr.status>=200 && xhr.status<=200 ){ 
                 console.log(xhr.response)
               postArr= JSON.parse(xhr.response);
 
               createCard(postArr)
          
        }else{ 
               snackbar('Api failed to load....!!!' , 'error')      
        }
     }
  

}  
fetchPost();





function onSubmit(eve){
         eve.preventDefault();
         
    let postObj= { 
            title:titleControl.value,
            body:bodyControl.value ,
            userId:userIdControl.value        
         }

      let xhr=  new XMLHttpRequest();
          xhr.open('POST', post_url);
          xhr.send(JSON.stringify(postObj));
   
          spinner.classList.remove('d-none')
      xhr.onload = function(){ 
          if(xhr.status>=200 && xhr.status<=299){ 
                let res = JSON.parse(xhr.response); //this will give me id
               
                postForm.reset(); 

               let col= document.createElement('div') ;
                   col.className ='col-md-4 mb-4'; 
                   col.id= res.id;
                   col.innerHTML= `<div class="card h-100 ">
                                    <div class="card-header">
                                    <h3>
                                        ${postObj.title}
                                     </h3>
                                    </div>
                                    <div class="card-body">
                                    <p>
                                        ${postObj.body}
                                    </p>
                                    </div>
                                    <div class="card-footer d-flex justify-content-between align-items-center">
                                        <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-primary">Edit</button>
                                        <button onclick="onRemove(this)"  class="btn btn-inline-block btn-outline-danger">Delete</button>
                                    </div>
                                </div>`

            postContainer.prepend(col);
            spinner.classList.add('d-none')
            snackbar(`${res.id} is add successfully...` ,'success');

          }else{ 
                snackbar('Post is not able to add...!', 'error')
          }
      }
 }







function onRemove(ele){
      let removeId = ele.closest('.col-md-4').id; 

      let removeUrl = `${base_url}/posts/${removeId}`;
  
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
           
           }).then((result) => {
            
         if (result.isConfirmed){ 
                 let xhr= new XMLHttpRequest(); 
                xhr.open('DELETE', removeUrl);
                xhr.send(null); 
                xhr.onload= function(){ 
             if(xhr.status>=200 && xhr.status<=299){ 
                 ele.closest('.col-md-4').remove();
               }
            }

          } 
        });

      
}

function onEdit(ele){
       let editId= ele.closest('.col-md-4').id; 
       localStorage.setItem('EditId', editId);
     
       let editUrl = `${base_url}/posts/${editId}`;
       
        let xhr=  new XMLHttpRequest();
         
            xhr.open('GET', editUrl);
            
            xhr.setRequestHeader('content-type', 'application/json') ;
            xhr.setRequestHeader('Autho','Get token from');
            
            xhr.send(null);
        
            spinner.classList.remove('d-none')
          
            xhr.onload =function(){
               if(xhr.status>=200 && xhr.status<=299 ){ 
                  let editObj = JSON.parse(xhr.response); 
                 
                  titleControl.value=editObj.title ;
                  userIdControl.value=editObj.userId ;  
                  bodyControl.value=editObj.body ;  
                
                  addPost.classList.add('d-none')
                  updatePost.classList.remove("d-none")
                
                  spinner.classList.add('d-none')
                  
              }else{ 
                   snackbar('Data patch failed...!!', 'error')
                  spinner.classList.add('d-none')
                   
                }    
          }

}

 function onUpdate(){ 
       let updateId= localStorage.getItem('EditId');
       let updateUrl = `${base_url}/posts/${updateId}`; 
       let updatedObj ={
          title:titleControl.value ,
          body:bodyControl.value,
          userId:userIdControl.value
         }
      
         
       let xhr= new XMLHttpRequest() ;
       xhr.open('PATCH', updateUrl);
       xhr.send(JSON.stringify(updatedObj));

       xhr.onload =function(){ 
          if(xhr.status>=200 && xhr.status<=299){ 
             let col= document.getElementById(updateId); 
                  col.innerHTML= `
                  <div class="card h-100 " >
                      <div class="card-header">
                      <h3>
                       ${updatedObj.title}
                       </h3>
                     </div>
                    <div class="card-body">
                      <p>
                        ${updatedObj.body}
                     </p>
                    </div>
                    <div class="card-footer d-flex justify-content-between align-items-center">
                           <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-primary ">Edit</button>
                           <button onclick="onRemove(this)" class="btn btn-inline-block btn-outline-danger ">Delete</button>
                    </div>
                </div>`
                   addPost.classList.add('d-none')
                  updatePost.classList.remove("d-none")
                    postForm.reset();
              snackbar('Data updated successfully', 'success');
                  
                         
          }else{ 
              snackbar('Failed update data', 'error');
          }
       }

}

postForm.addEventListener('submit', onSubmit) 

updatePost.addEventListener('click', onUpdate);



window.addEventListener('DOMContentLoaded',displaycontent());

function displaycontent(){
    const token = localStorage.getItem('token');

    const profile_container = document.getElementById('profile_container');

    const sign_in_container = document.getElementById('sign_in_container');

    if(!token){
        profile_container.classList.add('active')// remove this container
        sign_in_container.classList.add('active');
    }
    else{
        if(sign_in_container.classList.contains('active')){
            sign_in_container.classList.remove('active')
        }
        // displays the profile container   
        if(profile_container.classList.contains('active')){
            profile_container.classList.remove('active')
        }
    }
}



//document.getElementById('expenses_main_container').classList.add('active');
const sign_in = document.getElementById('sign_in');

sign_in.addEventListener('click', (e) =>{
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log('cllicked');
    const obj ={
        mail:email,
        password:password
    }
    
    if(email && password){
        console.log(obj)
        axios.post(`http://localhost:4000/sign-in`,obj)   // if we try to send the obj through get, we need to stringify that obj. then only we can parse that object and use it.
        .then(result =>{
            if(result.data.msg){
                console.log(result);
                window.alert(result.data.msg);
                // store the token in the local storage for further refences
                localStorage.setItem('token',result.data.token);
                displaycontent();
            }
        }).catch(err => console.log(err));  
    }else{
        window.alert('pls check your credentials');
    }
})

// adding expenses
document.getElementById('add_expenses_btn').addEventListener('click',(e)=>{
    e.preventDefault();
    const event = document.getElementById('event').value;
    const price = document.getElementById('price').value;

    const obj = {
        event:event,
        price:price
    };

    const token = localStorage.getItem('token');
    console.log(token)
    // send this data to backend
    axios.post(`http://localhost:4000/add-expenses`,obj,{headers:{"authorization":token} })
    .then(result =>{
        window.alert(result.data.msg)
    })
    .catch(err => console.log(err));
    
})


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
        axios.post(`http://localhost:4000/sign-in`,obj)   // if we try to send the obj through get, we need to stringify that obj. then only we can parse that object and use it.
        .then(result =>{
            if(result.data.msg){
                console.log(result);
                window.alert(result.data.msg);
            }
        }).catch(err => console.log(err));  
    }else{
        window.alert('pls check your credentials');
    }
})
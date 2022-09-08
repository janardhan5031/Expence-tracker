
const sign_in = document.getElementById('sign_in');

sign_in.addEventListener('click', (e) =>{
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const obj ={
        email:email,
        password:password
    }

    if(email && password){
        axios.get(`http://localhost:4000/sign-in/${JSON.stringify(obj)}`)   // if we try to send the obj through get, we need to stringify that obj. then only we can parse that object and use it.
        .then(result =>{
            if(result.data.msg){
                window.alert(result.data.msg);
            }
        }).catch(err => console.log(err));  
    }
})
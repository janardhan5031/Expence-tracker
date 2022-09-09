
const signUp = document.getElementById('sign_up');

signUp.addEventListener('click',(e)=> {
    e.preventDefault();
    const name =document.getElementById('name').value;
    const number =document.getElementById('Number').value;
    const email =document.getElementById('email').value;
    const password =document.getElementById('password').value;

    const obj = {
        name:name,
        number:number,
        mail:email,
        password:password
    };

    if(name && number && email && password){
        axios.post(`http://localhost:4000/signup`,obj)
        .then(res =>{
            console.log(res)
            if(res.data.msg){
                window.alert(res.data.msg)
            }else{
                window.alert('unable to create new user')
            }
        })
        .catch(err => console.log(err));
    }else{
        window.alert('please enter all fields')
    }
    
    
})  
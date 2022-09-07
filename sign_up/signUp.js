
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
        email:email,
        password:password
    };

    if(name && number && email && password){
        axios.post(`http://localhost:4000/signup`,obj)
        .then(res =>{
            if(res.data.msg){
                window.alert('User already exists, Please Login')
            }else{
                window.alert('Successfuly signed up')
            }
        })
        .catch(err => console.log(err));
    }else{
        window.alert('please enter all fields')
    }
    
    
})  



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

        const membeship = localStorage.getItem('membership');
        console.log(membeship);
        if(membeship){
            profile_container.style.backgroundColor = "rgba(0,0,0,0.2)"
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
                localStorage.setItem('membership',result.data.membership);

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

// paying the money
document.getElementById('pay_btn').onclick = async function(e){
    e.preventDefault();

    const token = localStorage.getItem('token');
    console.log(token);
    let response;
    await axios.get(`http://localhost:4000/purchase/membership`,{headers:{"authorization":token}})
    .then(res=> response=res)
    .catch(err => console.log(err));    
    console.log(response);
            

    const options = {
        "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
        "name": "Acme Corp",
        "description": "Test Transaction",
        "order_id": response.data.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "prefill": {
                        "name": "Test User",
                        "email": "test.user@example.com",
                        "contact": "7003442036"
                    },
        "theme": {
            "color": "#3399cc"
        },
        // post the payment id on payment success event in server
        "handler": function (pymnt_success){
            alert(pymnt_success.razorpay_payment_id);
            alert(pymnt_success.razorpay_order_id);
            alert(pymnt_success.razorpay_signature);

            // posting the payment id in server
            axios.post('http://localhost:4000/purchase/membershipStatus',{
                orderId:options.order_id,
                payment_id: pymnt_success.razorpay_payment_id
            },{
                headers:{"authorization":token}
            })
            .then(() =>{
                window.alert('you are premium user now');
            }).catch(err =>alert('something went wrong'));
        }
    }

    // initialize payment process with options
    const rzpy = new Razorpay(options);    // declearing and initialze the razorpay instance 
    rzpy.open()                     // starting the payment process

    // handle the payment failure scenarios
    rzpy.on('payment.failed', function (response){
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
    });

}

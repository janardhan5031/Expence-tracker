
// user sign in action
const sign_in = document.getElementById('sign_in');

sign_in.addEventListener('click', (e) =>{
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    //console.log('cllicked');
    const obj ={
        mail:email,
        password:password
    }
    
    if(email && password){
        //console.log(obj)
        axios.post(`http://localhost:4000/sign-in`,obj)   // if we try to send the obj through get, we need to stringify that obj. then only we can parse that object and use it.
        .then(result =>{
            if(result.data.msg && result.status ===201){
                //console.log(result);
                window.alert(result.data.msg);
                // store the token in the local storage for further refences
                localStorage.setItem('token',result.data.token);
                localStorage.setItem('membership',result.data.membership);

                displaycontent();
            }
            else{
                window.alert(result.data.msg);
            }
        }).catch(err => console.log(err));  
    }else{
        window.alert('pls check your credentials');
    }
})

// user forget password action


// dom content loaded
window.addEventListener('DOMContentLoaded',displaycontent());

function displaycontent(){
    const token = localStorage.getItem('token');

    const profile_container = document.getElementById('profile_container');

    const sign_in_container = document.getElementById('sign_in_container');

    // sign in action to get token to enter into their profile
    if(!token){
        window.alert('sorry your are not login. pls login')
        profile_container.classList.add('active')// remove this container
        sign_in_container.classList.add('active');
        // user clicked on forget password, deactivate -sign in  & activate forget password containers
        const forget_pswd = document.getElementById('signIn_frgt_btn');
        forget_pswd.addEventListener('click',(e)=>{
            //console.log(forget_pswd)
            e.preventDefault();

            // de-activate sign in container
            sign_in_container.classList.remove('active');
            //activate forget-password container
            //console.log(document.getElementById('forget_pswd_container'))
            document.getElementById('forget_pswd_container').classList.add('active');
            forgetPassword();
        })
    }
    else{
        if(sign_in_container.classList.contains('active')){
            sign_in_container.classList.remove('active')
        }
        // displays the profile container   
        if(profile_container.classList.contains('active' )){
            profile_container.classList.remove('active')    
        }
         
        // change the background color for premium users
        const membership = JSON.parse(localStorage.getItem('membership'));          
        const color = membership? "rgba(0,0,0,0.2)" : "white";
        profile_container.style.backgroundColor = color;

        const expense_track_hdr = document.getElementById('expense_tracker');

        let active_container;
        expense_track_hdr.addEventListener('click',(event)=>{

            //daily expenses
            const expenses_main_container = document.getElementById('expenses_main_container').classList;
            const adding_expenses = document.getElementById('adding_expenses').classList;
            const view_expenses = document.getElementById('view_all_expenses_container').classList;

            
            //console.log(event.target.id)
            // activate expenses main container and de-activate add active contaniner if it exists
            if(event.target.id === 'daily_btn'){
                expenses_main_container.add('active');
                
                if(active_container){
                    active_container.remove('active');
                    // storing the current active container after de-activate previous active container
                }
                active_container=expenses_main_container;
                display_daily_expenses();
                display_leadership_board();
            }
            // activate expenses add expenses container and de-activate expenses main contaniner
            else if(event.target.id==='add_expense'){
                if(active_container){
                    active_container.remove('active');
                }
                active_container=adding_expenses;
                adding_expenses.add('active');
                
                // for premioum users only, download button will be active
            }
            
            else if(event.target.id==='view_expenses'){
                
                if(active_container){
                    active_container.remove('active');
                }
                active_container=view_expenses;
                view_expenses.add('active')
                // disabling the downlod button for non-prime user
                document.getElementById('download_btn').disabled = membership? false : true;
                getAllPreviousFiles();
            }   
            
        })
    }
}

function getAllPreviousFiles(){
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:4000/files/getAllFiles`,{headers:{"authorization":token}})
    .then(result=>{
        //console.log(result);

        let list_of_files = document.getElementById('list_of_files');
        list_of_files.innerHTML ='';

        result.data.forEach(file =>{
            const name=file.fileName;
            //console.log(name)
            let fileName;
            let ptr=0;
            while(ptr<name.length){
                if(name[ptr]==='G' && name[ptr+1]==='M' && name[ptr+2]==='T'){
                    fileName = name.slice(0,ptr);
                    //console.log(fileName);
                }
                ptr++;
            }

            const ele = `<li>${fileName}<button type="button" id=${file.id} class="this_file_download">download </button></li>`;
            list_of_files.innerHTML += ele;

        })
    })
    .catch(err => console.log(err));
}

// download previous downloaded files
document.getElementById('list_of_files').addEventListener('click',(event)=>{
    event.preventDefault();
    if(event.target.className==='this_file_download'){
        const token = localStorage.getItem('token');
        const fileId = event.target.id;
        axios.get(`http://localhost:4000/files/getOneFile/${fileId}`,{headers:{"authorization":token}})
        .then(result =>{    
            //console.log(result);
            if(result.status === 200){
                var a = document.createElement('a');
                a.href = result.data.url;
                
                a.click();
            }else{
                throw new Error('something went wrong');
            }
        })
        .catch(err => console.log(err))
    }
})

// downoading all expenses by clicking on download btn
document.getElementById('download_btn').addEventListener('click',()=>{
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:4000/expenses/download`,{headers:{"authorization":token}})
    .then(result =>{    
        if(result.status === 200){
            var a = document.createElement('a');
            a.href = result.data.url;
            
            a.click();
        }else{
            throw new Error('something went wrong');
        }
    })
    .catch(err => console.log(err))
})

// forget password fucntion
function forgetPassword(){
    document.getElementById('forget_pswd').addEventListener('click',(e)=>{
        e.preventDefault();
        const email = document.getElementById('rcvry_email').value;
        axios.post('http://localhost:4000/password/forgetpassword',{email:email})
        .then((result)=>{
            console.log(result)
            window.alert(result.data.msg);
            if(result.data.resetUrl){
                window.location.href=result.data.resetUrl;
            }
        })
        .catch(err => console.log(err));
    })
}

// displaying the daily expenses handler
function display_daily_expenses(){
    // get all the expense events stored in database
    const expenses_parent =document.getElementById('expenses_container');

    const prev = document.getElementById('prev');   // previous button
    const next = document.getElementById('next');   // next button

    const token = localStorage.getItem('token');

    function expense(page_num){
        axios.get('http://localhost:4000/expenses/get-all?page=0',{headers:{"authorization":token}})
        .then((res)=>{
            //console.log(res);
            const list = res.data.data;
            adding_to_page(list);
            prev.disabled=!res.data.prev;
            next.disabled=!res.data.next;
        })
        .catch(err => console.log(err));
    };
    expense(0);

    function adding_to_page(list){
        expenses_parent.innerHTML ='';

        list.forEach(expense =>{
            const date = expense.createdAt.toString().slice(0,10);
            //console.log(date);
            const ele=`
            <div class="expense" id=${expense.id}>
                <p>${date}</p>
                <p>${expense.event}</p>
                <p>${expense.price}</p>
                <button type="button" id="remove">-</button>
            </div>`
            expenses_parent.innerHTML += ele;
        })
    }
        
    // when user click on expense element, that expense will be deleted 
    expenses_parent.addEventListener('click', (event)=>{

        //removing the element by click on delete button
        if(event.target.id==='remove' && event.target.parentElement.parentElement){
            const elementId = event.target.parentElement.id;
            //console.log(elementId);
            deleteExpense(elementId);

            expenses_parent.removeChild(event.target.parentElement);
        }
    })

    // when the use clicked on next or previous buttons, pages will be changed

    // listening the next and previous btn action from pagination div block
    document.getElementById('pagination').addEventListener('click',(e)=>{

        //console.log(curr_page-1)
        
        // if user click prev btn, the previous page will be called from backend 
        if(e.target.id ==='prev' && !prev.disabled  ){

            const curr_page = Number(document.getElementById('curr_page').value);

            // calling backend for previous page, if prev btn is active 
            axios.get(`http://localhost:4000/expenses/get-all?page=${curr_page-1}`,{headers:{"authorization":token}})
            .then((res)=>{
                adding_to_page(res.data.data);
                prev.disabled=!res.data.prev;
                next.disabled=!res.data.next;

                // updating the page number in hidden input tag
                document.getElementById('curr_page').value =curr_page-1;
            })
            .catch(err => console.log(err));  

        }

        // if clicked on next button
        if(e.target.id === 'next' && !next.disabled){

            const curr_page = Number(document.getElementById('curr_page').value);

            axios.get(`http://localhost:4000/expenses/get-all?page=${curr_page+1}`,{headers:{"authorization":token}})
            .then((res)=>{
                adding_to_page(res.data.data);
                prev.disabled=!res.data.prev;
                next.disabled=!res.data.next;

                document.getElementById('curr_page').value =curr_page+1;
            })
            .catch(err => console.log(err));  
        }
    })
    
}

// displaying the leadership board handler
function display_leadership_board(){
    const leadership_container = document.getElementById('leadership_container');
    leadership_container.innerHTML='';
    const token = localStorage.getItem('token');
    axios.get('http://localhost:4000/getLeadership',{headers:{"authorization":token}})
    .then((result)=>{
        //console.log(result);
        const length = result.data.data.length;
        result.data.data.forEach((user,index)=>{
            const ele =`
            <div class="members" id=${user.id}>
                <p>${user.name}</p>
                <p id=${user.id}_expense></p>
                <p>${index+1}/${length}</p>
            </div>`
            leadership_container.innerHTML+= ele;
            if(result.data.curUsr === user.id){
                document.getElementById(user.id).style.border =' 1px solid rebeccapurple'
            }
        })
        
    })
    .catch(err =>console.log(err));

}

// showing other user's expenses for premium users only by click
const all_users = document.getElementById('leadership_container');
all_users.addEventListener('click',(event)=>{

    // if user is not premium user, then they will not allowed to see other user's expenses
    if(JSON.parse(localStorage.getItem('membership')) === false){
        return window.alert('sorry you are not premium use!');
    }

    let target_ele;
    // get the etire row element when click on entire ele or its child elements
    if(event.target.className==='members'){
        target_ele = event.target.id;
    }else if(event.target.parentElement.className==='members'){
        target_ele = event.target.parentElement.id;
    }
    //console.log(target_ele)
    // get the expense child element in the target element found
    const expense_ele = document.getElementById(`${target_ele}_expense`);

    //get the selected user expense from backend
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:4000/get_user/${target_ele}`,{headers:{"authorization":token}})
    .then(result =>{
        //console.log(result)
        expense_ele.innerText=result.data.expense;
        setTimeout(()=>{
            expense_ele.innerText='';
        },3000)
    }).catch(err => console.log(err));
    
})


// adding expenses through the form
document.getElementById('add_expenses_btn').addEventListener('click',(e)=>{
    e.preventDefault();
   
    let event = document.getElementById('event').value;
    let price = document.getElementById('price').value;

    const obj = {
        event:event,
        price:price
    };

    const token = localStorage.getItem('token');
    console.log(token)
    // send this data to backend
    axios.post(`http://localhost:4000/expenses/add`,obj,{headers:{"authorization":token} })
    .then(result =>{
        window.alert(result.data.msg)
    })
    .catch(err => console.log(err));
})

// delete expenses from server
async function deleteExpense(id){
    const token = localStorage.getItem('token');
    await axios.post(`http://localhost:4000/expenses/delete`,{id:id},{headers:{"authorization":token} })
    .then(result=>{
        //console.log(result);
        window.alert('successfully deleted the expense')
    })
    .catch(err => console.log(err));
}


// paying the money to get premium membership
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
                localStorage.removeItem('membership');
                localStorage.setItem('membership',true);
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

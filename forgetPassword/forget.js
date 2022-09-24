
document.getElementById('reset_btn').addEventListener('click',(e)=>{
    e.preventDefault();
    const new_pswd = document.getElementById('new_pswd').value;
    const confirm_pswd = document.getElementById('confirm_pswd').value;

    console.log(new_pswd,confirm_pswd)
})


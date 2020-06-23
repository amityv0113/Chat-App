//templates

const message_template = document.querySelector('#message-template').innerHTML
const location_message_template = document.querySelector('#location-message-template').innerHTML
const sidebartemplate = document.querySelector('#sidebar-template').innerHTML

//////////////////////

///options

const {username,room} =Qs.parse(location.search,{ignoreQueryPrefix:true})

const socket =io()
const val = document.querySelector('#message-value').value

/////////////////////////////

const autoscroll = ()=>{
    //new message element  
    const $Newmessage =  document.getElementById('message-in-screen').lastElementChild

    //height of new message 
    const Newmessagestyle = getComputedStyle($Newmessage)
    const Newmessagemargin = parseInt(Newmessagestyle.marginBottom)
    const Newmessageheight = $Newmessage.offsetHeight+Newmessagemargin

    //visible height 
    const visibleheight = document.getElementById('message-in-screen').offsetHeight

    //height of message container 

    const containerHeight = document.getElementById('message-in-screen').scrollHeight


    //how far have I scrolled 

    const scrolloffset =document.getElementById('message-in-screen').scrollTop+visibleheight

    if ((containerHeight-Newmessageheight)<=scrolloffset)
    {
        document.getElementById('message-in-screen').scrollTop = document.getElementById('message-in-screen').scrollHeight
    }

}

//////////////////////////

socket.on('message',(val)=>{
    console.log(val)
    const html = Mustache.render(message_template,{
        username:val.username,
        message_in_page:val.text,
        createdAt:moment(val.createdAt).format('h:mm a')
    })
    document.getElementById('message-in-screen').insertAdjacentHTML('beforeend',html)
    autoscroll()
})




socket.on('location_message',(val)=>{
    const html = Mustache.render(location_message_template,{
        username:val.username,
        url:val.url,
        createdAt:moment(val.createdAt).format('h:mm a')
    })
    document.getElementById('message-in-screen').insertAdjacentHTML('beforeend',html)
    autoscroll()
})


socket.on('roomData',({room,users})=>{

    const html = Mustache.render(sidebartemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html

})


document.getElementById('message-form').addEventListener('submit',(event)=>{
    event.preventDefault()
    document.getElementById('p-1').setAttribute('disabled','disabled')

    const val = document.getElementById('message-value').value
    socket.emit('send-message',val,(info)=>{

        document.getElementById('p-1').removeAttribute('disabled')

        document.getElementById('message-value').value=''
        document.getElementById('message-value').focus()
        console.log('message delivered'+info)
    })
})




document.getElementById('geo-location').addEventListener('click',()=>{
    // alert('i am working ')

    if(!navigator.geolocation)
    {
        alert('!navigator')
        return alert('geolocation is not supported in your browser')
    }
    else
    {

        // alert('navigator')
        document.getElementById('geo-location').setAttribute('disabled','disabled')
        navigator.geolocation.getCurrentPosition((val)=>{
            console.log(val)
            socket.emit('send_location',{
                latitude:val.coords.latitude,
                longitude:val.coords.longitude
            },()=>{
                document.getElementById('geo-location').removeAttribute('disabled')
            })
        })
    }
    


})




socket.emit('join',{username,room},(error)=>{

    if (error)
    {
        alert(error)
        location.href ='/'
    }

})
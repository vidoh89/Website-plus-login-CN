const navbarMenu = document.querySelector(".navbar .links");
const hamburgerBtn = document.querySelector(".hamburger-btn");
const hideMenuBtn = navbarMenu.querySelector(".close-btn");
const showPopupBtn = document.querySelector(".login-btn");
const formPopup = document.querySelector(".form-popup");
const hidePopupBtn = formPopup.querySelector(".close-btn");
const signupLoginLink = formPopup.querySelectorAll(".bottom-link a");
// chatbot variables
const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage =null;//stores user message
const API_KEY = "PASTE-YOUR-API-KEY";// Paste API key
const inputInitHeight = chatInput.scrollHeight;
// 

// NAVIGATION and form
//show mobile menu
hamburgerBtn.addEventListener("click",() =>{
    navbarMenu.classList.toggle("show-menu");
});
//hide mobile menu
hideMenuBtn.addEventListener("click",()=> hamburgerBtn.click());
//Show login popup
showPopupBtn.addEventListener("click",()=>{
    document.body.classList.toggle("show-popup");
});
//Hide login popup
hidePopupBtn.addEventListener("click",()=> showPopupBtn.click());
//Show or hide signup form
signupLoginLink.forEach(link =>{
    link.addEventListener("click",(e)=>{
        e.preventDefault();
        formPopup.classList[link.id==='signup-link'? 'add':'remove']("show-signup");
       });
    });
// 
// chatbot
const createChatLi = (message,className) =>{
    //create a cha <li> element with passed parameters message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent =className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined>smart_toy</span></span>
    <p></p>`;
      chatLi.innerHTML =chatContent;
      chatLi.classList.querySelector("p").textContent = message;
      return chatLi;//return chat<li> element
}
const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");
    // Define the properties and message for the API
        const requestOptions = {
            method:"POST",
            header:{
                "Content-Type":"application/json",
                "Authorization": 'Bearer ${API_KEY}'
            },
            body: JSON.stringify({
                model:"gpt-3.5-turbo",
                messages: [{role: "user",content:userMessage}],
            })
        }
        //send POST request to API, get response and set the response as paragraph
        fetch(API_URL,requestOptions).then(res => res.json()).then(data =>{
            messageElement.textContent = data.choices[0].message.content.trim();
        }).catch(()=>{
            messageElement.classList.add("error");
            messageElement.textContent ="Oops! Something went wrong. Please try again."
        }).finally(()=>chatElement.scrollTo(0,chatbox.scrollHeight));
}
//
const handleChat = () =>{
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    //Clear the input textarea and set its height to default
    chatInput.value ="";
    chatInput.style.height =  `${inputInitHeight}px`;
    //Append the user message
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTop(0,chatbox.scrollHeight);
    setTimeout(()=>{
        //Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("Thinking...","incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTop(0,chatbox.scrollHeight);
        generateResponse(incomingChatLi)
    },600);
} 
chatInput.addEventListener("input",()=>{
    //Adjust the height of the input textarea based on ites content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});
chatInput.addEventListener("keydown",(e)=>{
//If Enter key is pressed without shift key and the window
//width is grteater than 800px , handle the chat
if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
    e.preventDefault();
    handleChat();
}
});
sendChatBtn.addEventListener("click",handleChat);
closeBtn.addEventListener("click",()=> document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));


let sourceKey = "utm_src";
let ipInfoToken = "e5b3b4fe1037e4";

function buttonChange(clsName = "", btnValue = "", disabled = false){
    document.getElementsByClassName(clsName)[0].innerHTML = btnValue;
    document.getElementsByClassName(clsName)[0].innerText = btnValue;
    document.getElementsByClassName(clsName)[0].disabled = disabled;
}

function validateEntryUser() {
    var u = getCurrentUser();
    // console.log(u);
    // u.then( (i) => {
    // })
    console.log("validateentryuser", u);
    if(!u){
        // window.location.href = "./login.html";
        console.log("redirected");
        return ;
    }
    return ;
}

function validateLoggedUser() {
    var u = getCurrentUser();
    console.log("validateloggeduser",u);
    // u.then( (i) => {
    // })
    if(u){
        window.location.href = "./entries.html";
        return ;
    }
    return ;
}

function triggerMail(payload) {
    let payl = payload;
    buttonChange("send", "sent", true);
    $('#myModal').modal("show");
    sendEmail(payl.email, payl.name, payl.phone, payl.message);
}

function validateEntry(){
    var name = document.getElementsByName("fname")[0].value;
    var phone = document.getElementsByName("phone")[0].value;
    var email = document.getElementsByName("email")[0].value;
    var message = document.getElementsByName("message")[0].value;
    var track = "contact-form";

    if(email == "")
        alert("Email ID Required");
    else if(phone == "")
        alert("Phone Number required.");
    else if(name == "")
        alert("Name Required");
    else{
        let payload = { name, email, phone, message, track };
        buttonChange("send", "sending...", true);
        writeUserData('/entries', payload, () => triggerMail(payload));
    }
        
}

function validateLogin() {
    var email = document.getElementsByName("email")[0].value;
    var password = document.getElementsByName("password")[0].value;

    if(email == "")
        alert("Email ID Required");
    else if(password == "")
        alert("Phone Number required.");
    else {
        buttonChange("login-btn", "validating...", true);
        login(email, password);
    }
}

function toggleAccordion(elementId = ""){
    let d = document.getElementById(elementId).style.display;

    if(d == "" || d == "none"){
        document.getElementById(elementId).style.display = "block";
        document.getElementsByClassName("fa-"+elementId)[0].style.transform = "rotate(180deg)";
    }
    else{
        document.getElementById(elementId).style.display = "none";
        document.getElementsByClassName("fa-"+elementId)[0].style.transform = "rotate(0deg)";
    }
}

function renderLists( data = {}){
    var jkkk = "";
    if(data != null){
        let keys = Object.keys(data);
        if(keys.length != 0){
            keys = keys.reverse();
            for(let i = 0; i < keys.length;  i++){
                let keyA = 'accordion-'+i;
                var kk = "";
                kk += "<div class=\"accordion\" ><div class=\"list\" ><div class=\"user-contact-name\"><i class=\"fa fa-user\"></i>";
                kk += "<h5>"+( data[keys[i]].name || "NA" )+"</h5></div><div class=\"user-contact\"><div class=\"contact-right\">";
                kk += "<a href=\"tel:"+data[keys[i]].phone+"\"><i class=\"fa fa-phone\"></i>"+( data[keys[i]].phone || "NA" )+"</a></div>";
                kk += "<div class=\"contact-right\"><a href=\"mailto:"+ data[keys[i]].email+"\"><i class=\"fa fa-envelope\"></i>"+( data[keys[i]].email || "NA" )+"</a></div>";
                kk += "</div><div class=\"user-contact-arrow\"><div onclick=\"deleteData(\'/entries/"+keys[i]+"\');\"><i class=\"fa fa-trash \"></i></div>"
                kk += "<div class = \"arrow\" onclick=\"toggleAccordion(\'"+keyA+"\');\"><i class=\"fa fa-chevron-down fa-"+keyA+"\"></i></div></div></div>";
                kk += "<div class=\"panel\" id =\""+keyA+"\">"
                kk +=   "<div class=\"list\"><div><h6><b>Posted At: </b></h6><p>"+( new Date(data[keys[i]].timestamp) || "NA" ) +"</p></div>"
                kk +=   "<div><h6><b>Track from: </b></h6><p>"+( data[keys[i]].track || "NA" ) +"</p></div></div>"
                kk +=   "<div class=\"message\"><h6><b>Message</b></h6><p>"+( data[keys[i]].message || "NA" ) +"</p></div></div></div>";
                jkkk += kk;
            }
        }
    }
    else
        jkkk += "<div class=\"no-data\">No user form entries</div>";
    document.getElementById("form-entries").innerHTML = jkkk;
}

function renderVisitorsLists(data = {}) {
    var ikkk = "";
    var lkkk = "";
    let pageVisitors = {};
    if(data){
        let keys = Object.keys(data);
        if(keys.length != 0){
            keys = keys.reverse();
            for(let i = 0; i < keys.length;  i++){
                let keyA = 'accordion-'+keys[i];
                let kk = "";
                kk += "<div class=\"accordion\" ><div class=\"list\" ><div class=\"details\">";
                kk += "<div class=\"contact-right\"><i class=\"fa fa-location-arrow\"></i>  <b> Source : </b>"+( data[keys[i]]?.source || "NA" )+"</div>";
                kk += "<div class=\"contact-right\"><i class=\"fa fa-calendar\"></i>"+( new Date(data[keys[i]].timestamp) || "NA" )+"</div>";
                kk += "</div>"//<div class=\"user-contact-arrow\"><div onclick=\"deleteData(\'/visitors/"+keys[i]+"\');\"><i class=\"fa fa-trash \"></i></div>"
                kk += "<div class = \"arrow\" onclick=\"toggleAccordion(\'"+keyA+"\');\"><i class=\"fa fa-chevron-down fa-"+keyA+"\"></i></div></div></div>";
                kk += "<div class=\"panel\" id =\""+keyA+"\"><div class=\"user-info-list\">"
                let kkeys = Object.keys(data[keys[i]]);
                kkeys = kkeys.filter(f => !['source', 'timestamp'].includes(f));
                kkeys.forEach(eachKey => {
                    kk +=  "<div><h6><b>" + eachKey + ": </b> </h6><p>" + data[keys[i]][eachKey] + "</p></div>"
                })
                ikkk += (kk + "</div></div></div>");

                if(data[keys[i]]['page']) {
                    pageVisitors = { 
                        ...pageVisitors, 
                        [data[keys[i]]['page']]: (pageVisitors[data[keys[i]]?.['page']] || 0) + 1
                    }
                }
            }
        }
        lkkk += "<div class=\"analytics\">"
        Object.keys(pageVisitors).length &&
        Object.keys(pageVisitors).forEach(e => {
            lkkk += `<div style="margin-right: 8px;"><b> ${e} : </b> ${pageVisitors[e]}</div>`
        })
        lkkk += "</div>"
    }
    else
        ikkk += "<div class=\"no-data\">0 user(s) visited</div>";

    document.getElementById("visitors").innerHTML = ikkk;
    document.getElementById("visitors-count").innerHTML = lkkk;
}

async function getUserInformation() {
    let details = {};
    await fetch("https://ipinfo.io/json?token="+ipInfoToken)
          .then((response) => response.json())
          .then((data) => { if(!data.error) details = data; })
    return details;
}

async function updateUserSource(page = 'unknown') {
    let userDetails = {};
    let source = "Unknown";
    let loc = window.location;
    let params = getDataFromUrl(loc.search);
    let isMobile = navigator?.userAgentData?.mobile;
    if(params[sourceKey]) source = params[sourceKey];
    let payload = {
        source,
        page,
        vendor: navigator?.vendor || "unknown",
        language: navigator?.language || "unknown",
        userAgent: navigator?.userAgent || "unknown",
        userAgentPlatform: navigator?.userAgentData?.platform || "unknown",
        isUserAgentMobile: typeof isMobile === 'boolean' ? isMobile : "unknown",
    }
    userDetails = await getUserInformation();
    if(userDetails) payload = { ...payload, ...userDetails };
    writeUserData('/visitors', payload, () => null);
}

function getDataFromUrl(paramString) {
    let searchParams = new URLSearchParams(paramString);
    let data = {};
  
    for (let p of searchParams) {
      let key = p[0];
      let value = p[1];
      data = {
          ...data,
          [key] : value
      }
    }
  
    return data;
  }
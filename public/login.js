//delete one tile of form pasrameter - button element
function deleteOption(element){
    //count .options elements
    var options = document.getElementsByClassName("option").length;
    //if its last return 
    if(options <= 1){
        return false;
    }
    element.parentElement.remove();
}


function signUp(){
    var login = document.getElementById("login_r").value;
    var password = document.getElementById("password_r").value;
    var login_error = document.getElementById("login_error_r");

    if(login.length < 5 || password < 7){
        login_error.style = "display: grid;"
        login_error.innerHTML = "Zbyt krótki login/hasło";
        return false;
    }

    var url = new URL(fixedUrl() + "signup");
    url.searchParams.append('login', login);
    url.searchParams.append('password', password);
    var req = new XMLHttpRequest();
    req.open('GET', url, false);
    req.send(null);
    if(req.status == 200){
        console.log(req.responseText);
        if (req.responseText == 'true'){
            login_error.innerHTML = "Zarejestowano pomyślnie";
            login_error.style = "color: green; display: grid;";
        }
    }
}

function login(){
    var login = document.getElementById("login").value;
    var password = document.getElementById("password").value;
    var login_error = document.getElementById("login_error");

    if(login.length < 4 || password < 4){
        login_error.style = "display: grid;"
        login_error.innerHTML = "Zbyt krótki login/hasło";
        return false;
    }

    var url = new URL(fixedUrl() + "login");
    url.searchParams.append('login', login);
    url.searchParams.append('password', password);
    var req = new XMLHttpRequest();
    req.open('GET', url, false);
    req.send(null);
    if(req.status == 200){
        if(req.responseText == 'false'){
            login_error.style = "display: grid;"
            login_error.innerHTML = "Błędne dane logowania";
        }
        else{
            changeContainer("add_training");
            document.getElementById("sidenav").style = "display: flex;"
            document.getElementById("sidenav_btn").style = "display: flex;"
        }
    }
    
}


function validateData(inputs){
    var isValidated = true;
    for(var i = 0; i < inputs.length; i++){
        if(inputs[i].value == "" || inputs[i].value.startsWith(' ') == true){
            inputs[i].style = "border-bottom: 1px solid red";
            isValidated = false;
        }
        else{
            inputs[i].style = "border-bottom: 1px solid hsl(215, 32%, 27%)";
        }
    }
    return isValidated;
}

function openNav() {
    document.getElementById("sidenav").style.width = "200px";
  }


  //create fixed url
function fixedUrl(){
    //get adress
    url = document.location.href;
    //if last charactes id # slice it
    if(document.location.href[document.location.href.length-1] == "#"){
        url = document.location.href.slice(0, -1);
    }
    //returning fixed url
    return url;
}


//reseting form to default
function reserAddTrainingForm(element){
    //setting inside to default
    element.parentElement.parentElement.innerHTML = `<div style="width: 95%; margin-bottom: -20px;"><button class="img-button" style="float: left;" onclick="changeContainer('load_last_training'); getTreningTables()"><img src="icons8-time-machine-24.png" alt=""></button>
    <button class="img-button" style="float: right;" onclick="reserAddTrainingForm(this)"><img src="icons8-reset-24.png" alt=""></button></div>
<h2>Dodaj trening</h2>
<input type="text" name="" id="training_name" placeholder="Nazwa treningu">
<div class="option">
    <div id="added2">
    <h4></h4>
    <input type="text" class="exercise_name" name="" id="" placeholder="Nazwa ćwiczenia">
    <select onchange="changeExerciseType(this)" name="" class="type">
        <option value="strenght">siłowy</option>
        <option value="time">czasowy</option>
    </select>
    <input type="number" class="series strenght" name="" id="" placeholder="Ilość serii">
    <input type="number" class="reps strenght" name="" id="" placeholder="Ilość powtórzeń">
    <input type="number" class="weight strenght" name="" id="" placeholder="Ciężar (kg)">
    </div>
    <button style="margin-top: 10px;" onclick="addNewPart(this, 'strenght')"><img src="icons8-plus-48.png" alt="icons8-plus-48.png"></button>
    <button onclick="deleteNewestPart(this, 'strenght')"><img src="icons8-minus-48.png" alt=""></button>
    <button onclick="deleteOption(this)"><img src="icons8-trash-24.png" alt=""></button>
</div>
<div id="added"></div>
<input type="button" class="add-exercise-btn" style="font-size: 16px; margin-bottom: 10px; margin-top: 20px;" onclick="addNewExercise()" value="DODAJ ĆWICZENIE">
<input type="button" class="add-exercise-btn"  onclick="addExercises()" value="DODAJ TRENING">`;
}
  
  /* Set the width of the side navigation to 0 */
  function closeNav() {
    document.getElementById("sidenav").style.width = "0";
  }

  function showExercise(name, element)
  {
    console.log(element);
        if(element.children.length != 0){
            element.children[0].remove();
            element.innerHTML = name.split(":")[0];
            return false;
        }
        var url = new URL(fixedUrl() + "getexercise");
        url.searchParams.append('name', name);
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.send(null);
        element.innerHTML += ' ✖';
        //element.innerHTML += "<button>x</button>";
        $(element).append("<div style='margin-top: 0px; width: 90%; color: white; text-align: center'></div>");
        if(req.status == 200){
            element.children[0].innerHTML = '';
            //console.log(req.responseText);
            var data = JSON.parse(req.responseText);          
            for(var record in data){
                element.children[0].innerHTML += "<br>" + data[record][1] + "<br>";             
                var data1 = data[record][0];
                data1 = data1.split(",");
                //console.log(data1);
                if(name.split(":")[1] == "strenght") {
                for(var i = 0; i < data1.length; i+=3){
                    element.children[0].innerHTML += `<div style='color: hsl(215, 51%, 70%); border-bottom: 1px solid rgba(194, 194, 194, 0.1); width: 100%; font-size: 12px; display: grid; grid-template-columns: 32% 36% 32%;'><div style='text-align: left'>Serie: ${data1[i]}</div><div style='text-align: center'>Powtórzenia: ${data1[i+1]}</div><div style='text-align: right'>Ciężar: ${data1[i+2]}kg</div></div>`;
                }  
            }
            else{
                for(var i = 0; i < data1.length; i+=2){
                    element.children[0].innerHTML += `<div style='color: hsl(215, 51%, 70%); border-bottom: 1px solid rgba(194, 194, 194, 0.1); width: 100%; font-size: 12px; display: grid; grid-template-columns: 50% 50%;'><div style='text-align: left'>Czas: ${data1[i]}</div><div style='text-align: right'>Dane: ${data1[i+1]}</div></div>`;
                }
            }
            element.children[0].innerHTML += "<br>";           
            }
        }
  }


  function getAllExercises(){
    var container = document.getElementById("all_exercises");
    var url = new URL(fixedUrl() + "getexercises");
    var req = new XMLHttpRequest();
    req.open('GET', url, false);
    req.send(null);
    container.innerHTML = "<h2>Twoje ćwiczenia</h2>"
    if(req.status == 200){
        //console.log(req.responseText);
        var data = JSON.parse(req.responseText);
        //data.replace('[', '');
        //data.replace(']', '');
        //data.split(",");
        for(var element in data){
            container.innerHTML += `<div onclick="showExercise('${data[element].split(0, 1)[0]}', this)" style='font-weight: 400; font-size: 18px; display: flex; align-items: center; flex-direction: column; justify-content: center; color: white;' data-name='${data[element].split(0, 1)}' class='record-shortcut'>${data[element].split(":")[0]}</div>`;
        }
    }
}


  //changing screen container
function changeContainer(id){
    var containers = document.getElementsByClassName('container');
    for(var container in containers){
        containers[container].style = 'display: none';
    }
    //if change to all_tables refresh data
    if(id == 'all_tables'){
        getTreningTables();
    }
    //if change to load_last_training set header
    if(id == "load_last_training"){
        document.getElementById(id).innerHTML = `<div style="width: 95%; height:25px; margin-bottom: -5px;"><button onclick="changeContainer('add_training')" class="img-button" style="float: left;"><img src="icons8-left-24.png" alt=""></button></div>
        <h2>Wybierz trening</h2>
        <div class="scroll" style="margin-top: 0px;"></div>`;
    }
    if(id == 'all_exercises'){
        getAllExercises();
    }
    //show this container
    document.getElementById(id).style = 'display: flex';
    //close navbar
    closeNav();
}



//changing inputs to exercise type
function changeExerciseType(element){
    // -------------------------- declaring inputs --------------------------------
    var type = element.parentElement.getElementsByClassName("type")[0].value;
    var strenght_elements = element.parentElement.querySelectorAll('.strenght');
    var time_elements = element.parentElement.querySelectorAll('.time');
    // -------------------------------------------------------------------------------
    // if setting type to time exercise
    if(type == 'time'){
        element.parentElement.parentElement.children[1].setAttribute("onclick", "addNewPart(this, 'time')");
        element.parentElement.parentElement.children[2].setAttribute("onclick", "deleteNewestPart(this, 'time')");
        //set dropdown to oposite
        element.innerHTML = "<option value='strenght'>siłowy</option><option value='time' selected>czasowy</option>";
        //delete previous inputs
        strenght_elements.forEach(element => {
            element.remove();
        });
        // adding new inputs
        element.parentElement.innerHTML += `<input type='text' class='time duration' placeholder='Długość trwania'><input type='text' class='exercise_data time' placeholder='Dane'>`;
    }
    else{
        element.parentElement.parentElement.children[1].setAttribute("onclick", "addNewPart(this, 'strenght')");
        element.parentElement.parentElement.children[2].setAttribute("onclick", "deleteNewestPart(this, 'strenght')");
        //set dropdown to oposite
        element.innerHTML = "<option value='strenght' selected>siłowy</option><option value='time'>czasowy</option>";
        //delete previous inputs
        time_elements.forEach(element => {
            element.remove();
        });
        // adding new inputs
        element.parentElement.innerHTML += `<input type="number" class="series strenght" name="" id="" placeholder="Ilość serii">
        <input type="number" class="reps strenght" name="" id="" placeholder="Ilość powtórzeń">
        <input type="number" class="weight strenght" name="" id="" placeholder="Ciężar (kg)">`;
    }
}

function loadTraining(data, date, name){
    var add_training = document.getElementById("add_training");
    add_training.innerHTML = `<div style="width: 95%; margin-bottom: -20px;"><button class="img-button" style="float: left;" onclick="changeContainer('load_last_training'); getTreningTables()"><img src="icons8-time-machine-24.png" alt=""></button>
    <button class="img-button" style="float: right;" onclick="reserAddTrainingForm(this)"><img src="icons8-reset-24.png" alt=""></button></div>
    <h2>Dodaj trening</h2>
    <input type="text" name="" id="training_name" value=${name} placeholder="nazwa treningu">`;
    data = JSON.parse(data.slice(1, data.length-1));
    var html = '';
    for(var exercise in data){
        //template for strenght exercise
        if(exercise.split(":")[1] == 'strenght')
        {
            html += `<div class="option">
            <div id="added2">
            <h4></h4>
            <input type="text" class="exercise_name" name="" id="" value="${exercise.split(":")[0]}" placeholder="Nazwa ćwiczenia">
            <select onchange="changeExerciseType(this)" name="" class="type">
                <option value="strenght" selected>siłowy</option>
                <option value="time">czasowy</option>
            </select>`;
            var exercise_data = data[exercise].split(',');
            for(var i = 0; i < exercise_data.length; i+=3){
                html += `<input type='number' class='series strenght' value='${exercise_data[i]}' placeholder='Ilość serii'><input type='number' value='${exercise_data[i+1]}' class='reps strenght' placeholder='Ilość powtórzeń'><input type='number' value='${exercise_data[i+2]}' class='weight strenght' placeholder='Ciężar'>`;
            }
            html += `</div>
            <button style="margin-top: 10px;" onclick="addNewPart(this, 'strenght')"><img src="icons8-plus-48.png" alt="icons8-plus-48.png"></button>
            <button onclick="deleteNewestPart(this, 'strenght')"><img src="icons8-minus-48.png" alt=""></button>
            <button onclick="deleteOption(this)"><img src="icons8-trash-24.png" alt=""></button>
            </div>`;

            add_training.innerHTML += html;
            
        }
        //template for time exercise
        else
        {
            html += `<div class="option">
            <div id="added2">
            <h4></h4>
            <input type="text" class="exercise_name" value="${exercise.split(":")[0]}" id="" placeholder="Nazwa ćwiczenia">
            <select onchange="changeExerciseType(this)" name="" class="type">
                <option value="strenght">siłowy</option>
                <option value="time" selected>czasowy</option>
            </select>`;
            var exercise_data = data[exercise].split(',');
            for(var i = 0; i < exercise_data.length; i+=2){
                html += `<input type='text' class='time duration' value="${exercise_data[i]}" placeholder='Długość trwania'><input type='text' value="${exercise_data[i+1]}" class='exercise_data time' placeholder='Dane'>`;
            }
            html += `</div>
            <button style="margin-top: 10px;" onclick="addNewPart(this, 'time')"><img src="icons8-plus-48.png" alt="icons8-plus-48.png"></button>
            <button onclick="deleteNewestPart(this, 'time')"><img src="icons8-minus-48.png" alt=""></button>
            <button onclick="deleteOption(this)"><img src="icons8-trash-24.png" alt=""></button>
            </div>`;

            add_training.innerHTML += html;
        }
        html = '';
    }
    add_training.innerHTML += `<div id="added"></div>
    <input type="button" class="add-exercise-btn" style="font-size: 16px; margin-bottom: 10px; margin-top: 20px;" onclick="addNewExercise()" value="DODAJ ĆWICZENIE">
    <input type="button" class="add-exercise-btn"  onclick="addExercises()" value="DODAJ TRENING">`;


    changeContainer('add_training');
}



//getting specific table
function getTraningTableData(element, forLoad){
    var url = new URL(fixedUrl() + "gettraningtable");
    url.searchParams.append('id', element.getAttribute('data-id'));
    var req = new XMLHttpRequest();
    req.open('GET', url, false);
    req.send(null);
    if(req.status == 200){
        if(forLoad == true){
            loadTraining(req.responseText, element.getAttribute('data-date'), element.getAttribute('data-name'));
            return false;
        }
        showTrainingTable(req.responseText, element.getAttribute('data-date'), element.getAttribute('data-name'));
    }
}

//change container and show training info
function showTrainingTable(data, date, name){
    var container = document.getElementById("training_info");
    data = JSON.parse(data.slice(1, data.length-1));
    //clearing from past 
    container.innerHTML = `<div style="width: 95%; height:25px; margin-bottom: -5px;"><button onclick="changeContainer('all_tables')" class="img-button" style="float: left;"><img src="icons8-left-24.png" alt=""></button></div>`;
    //showing title
    container.innerHTML+= "<div class='title'>" + name + "</div>";
    //showing date
    container.innerHTML+= "<div class='date'>" + date + "</div>";
    //looping through elements
    for (var x in data){
        container.innerHTML += `<div class='exercise_name'>${x.split(":")[0]}</div>`; //showing name of exercise
        var exercise_data = data[x].split(",");
        if(x.split(":")[1] == "time")
        {
            for(var i = 0; i < exercise_data.length; i+=2){
                //exercise_data[i]; <-series
                //exercise_data[i+1] <- reps
                //exercise_data[i+2] <-weight
                container.innerHTML+= `<div class='row' style='grid-template-columns: 50% 50%'><div style='text-align: center'>Czas: ${exercise_data[i]}</div><div style='text-align: center'>Dane: ${exercise_data[i+1]}</div></div>`;
        }
    }
        else{
        for(var i = 0; i < exercise_data.length; i+=3){
            //exercise_data[i]; <-series
            //exercise_data[i+1] <- reps
            //exercise_data[i+2] <-weight
            container.innerHTML+= `<div class='row'><div>Serii: ${exercise_data[i]}</div><div style='text-align: center'>Powtórzeń: ${exercise_data[i+1]}</div><div style='text-align: right'>Ciężar: ${exercise_data[i+2]}kg</div></div>`;
        }
    }
    }
    //changing main container
    changeContainer("training_info");
}



//getting data from "shortcuts" table
function getTreningTables(){
    var req = new XMLHttpRequest();
    req.open('GET', '/getalltrainingtables', false);
    req.send(null);
    document.getElementById("all_tables").children[1].innerHTML = '';
    if(req.status == 200){
        var data = JSON.parse(req.responseText);
        for (var i in data){
            document.getElementById("all_tables").children[1].innerHTML += `<button onclick='getTraningTableData(this, false)' class='record-shortcut' data-name='${data[i]['name']}' data-date='${data[i]['date']}' data-id='${data[i]['id']}'><div class='date'>${data[i]['date']}</div><div class='name'>${data[i]['name']}</div></button>`;
            document.getElementById("load_last_training").children[2].innerHTML += `<div onclick='getTraningTableData(this, true)' class='record-shortcut load' data-name='${data[i]['name']}' data-date='${data[i]['date']}' data-id='${data[i]['id']}'><div class='date'>${data[i]['date']}</div><div style='font-weight: 400' class='name'>${data[i]['name']}</div></div>`;
        }
    } 
}

//adding exercises (sending to backend)
function addExercises(){
    // --------------------- declaring inputs -----------------------
    var training_name = document.getElementById("training_name");
    var exercises = document.getElementsByClassName('option');
    var exercises_name = document.getElementsByClassName('exercise_name');
    var series = document.getElementsByClassName('series');
    var reps = document.getElementsByClassName('reps');
    var weights = document.getElementsByClassName('weight');
    // ---------------------------------------------------------------

    var data=[]; // <- main data to send
    var row_data = []; // <- temp data

    //looping through .option elements
    for (var x = 0; x < exercises.length; x++){
        if(exercises[x].children[0].children[2].value == 'strenght'){
        //looping through their children
        for(var i = 3; i < exercises[x].children[0].children.length; i+=3){
            //setting name of exercise
            if(i == 3){
                if(!validateData([exercises[x].children[0].children[i-2]])){
                    validateData([exercises[x].children[0].children[i], exercises[x].children[0].children[i+1], exercises[x].children[0].children[i+2]]);
                    return false;
                }
                row_data.push(exercises[x].children[0].children[i-2].value + ":strenght", [exercises[x].children[0].children[i].value, exercises[x].children[0].children[i+1].value, exercises[x].children[0].children[i+2].value]);
            }
            //just adding data
            else{
                row_data.push([exercises[x].children[0].children[i].value, exercises[x].children[0].children[i+1].value, exercises[x].children[0].children[i+2].value]);
            }     
            if(validateData([exercises[x].children[0].children[i], exercises[x].children[0].children[i+1], exercises[x].children[0].children[i+2]]) == false){
                return false;
            }   
        }
        //pushing temp to final var
        data.push(row_data);
        //clearing temp
        row_data=[];
    }
    else{
        for(var i = 3; i < exercises[x].children[0].children.length; i+=2){
            //setting name of exercise
            if(i == 3){
                if(!validateData([exercises[x].children[0].children[i-2]])){
                    validateData([exercises[x].children[0].children[i], exercises[x].children[0].children[i+1]]);
                    return false;
                }
                row_data.push(exercises[x].children[0].children[i-2].value + ":time", [exercises[x].children[0].children[i].value, exercises[x].children[0].children[i+1].value]);
            }
            //just adding data
            else{
                row_data.push([exercises[x].children[0].children[i].value, exercises[x].children[0].children[i+1].value]);
            }   
            if(validateData([exercises[x].children[0].children[i], exercises[x].children[0].children[i+1]]) == false){
                return false;
            }         
        }
        //pushing temp to final var
        data.push(row_data);
        //clearing temp
        row_data=[];
    }
}
    //creating url with params
 //   var url = new URL(fixedUrl() + "createtrainingtable");
 //   url.searchParams.append('data', JSON.stringify(data));
  //  url.searchParams.append('name', training_name.value);
    //http request
    //UNCOMMENT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! vvvvv
  //  var req = new XMLHttpRequest();
  //  req.open('GET', url.href);
  //  req.send(null);  
  //  alert("dodano trening");
  //  reserAddTrainingForm(document.getElementById("reset_btn"));
    var url = new URL(fixedUrl() + "createtrainingtable");
    var req = new XMLHttpRequest();
    req.open("POST", url.href);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify([JSON.stringify(data), training_name.value]));
}

//dynamically adding new inputs to adding exercses' form
function addNewExercise(){ 
    $('#added').append(
        $('<div>').prop({
            innerHTML: `<div id="added2">
            <h4></h4>
            <input type="text" class="exercise_name" name="" id="" placeholder="Nazwa ćwiczenia">
            <select onchange="changeExerciseType(this)" name="" class="type">
                <option value="strenght">siłowy</option>
                <option value="time">czasowy</option>
            </select>
            <input type="number" class="series strenght" name="" id="" placeholder="Ilość serii">
            <input type="number" class="reps strenght" name="" id="" placeholder="Ilość powtórzeń">
            <input type="number" class="weight strenght" name="" id="" placeholder="Ciężar (kg)">
            </div>
            <button style="margin-top: 10px;" onclick="addNewPart(this, 'strenght')"><img src="icons8-plus-48.png" alt="icons8-plus-48.png"></button>
            <button onclick="deleteNewestPart(this, 'strenght')"><img src="icons8-minus-48.png" alt=""></button>
            <button onclick="deleteOption(this)"><img src="icons8-trash-24.png" alt=""></button>
            </div>`,
            className: 'option'
        })
    );
}

// adding new part of exercise dynamically
function addNewPart(element, type){
    if(type=='strenght'){
        $(element).parent().children().first().append("<input type='number' class='series strenght' placeholder='Ilość serii'>");
        $(element).parent().children().first().append("<input type='number' class='reps strenght' placeholder='Ilość powtórzeń'>");
        $(element).parent().children().first().append("<input type='number' class='weight strenght' placeholder='Ciężar (kg)'>");
    }
    else{   
        $(element).parent().children().first().append("<input type='text' class='time duration' placeholder='Długość trwania'>");
        $(element).parent().children().first().append("<input type='text' class='exercise_data time' placeholder='Dane'>");
    } 
}

function deleteNewestPart(element, type){
    if(element.parentNode.children[0].children.length <= 6)
    {
        return false;
    }
    if(type=='strenght'){
        //console.log(Array.from(element.parentNode.children).indexOf(element));
        element.parentNode.children[0].removeChild(element.parentNode.children[0].lastChild);
        element.parentNode.children[0].removeChild(element.parentNode.children[0].lastChild);
        element.parentNode.children[0].removeChild(element.parentNode.children[0].lastChild);
    }
    else{
        element.parentNode.children[0].removeChild(element.parentNode.children[0].lastChild);
        element.parentNode.children[0].removeChild(element.parentNode.children[0].lastChild);
    }
}




$( document ).ready(function() {
   //getTreningTables();

});

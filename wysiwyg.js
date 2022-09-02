const editor = document.getElementById("wysiwyg");
const toolbar = document.getElementById("toolbar");
const buttons = toolbar.querySelectorAll("span");
const contentArea = document.getElementById("content-area");
const visualView = document.getElementById("visualview");
const htmlView = document.getElementById("htmlview");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modaltitle");
const modalBody = document.getElementById("modalbody");
const modalFooter = document.getElementById("modalfooter");

for(let i = 0; i < buttons.length; i++){
    let button = buttons[i];
    button.addEventListener('click', function(e){
        let action = this.dataset.action;

        switch(action){
            case 'createLink':CreateLink();
            break;
            default:Dummy();
        }
    });
}

function CreateLink(){
    console.log("Not fully functional");
    $("#modal").modal('show');
}

function Dummy(){
    console.log("NEED TO IMPLEMENT!!!");
}

//LogTesting Not really needed.
console.log(editor);
console.log(toolbar);
console.log(buttons);
console.log(buttons.length);

for(i=0; i < buttons.length; i++){

    console.log(buttons[i].title);
}
console.log(contentArea);
console.log(visualView);
console.log(htmlView);
//console.log(modal);
//console.log(modalTitle);
//console.log(modalBody);
//console.log(modalFooter);



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
    button.addEventListener('click', function(){
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
    //modalTitle.textContent("Insert Link");
    let selection = SaveSelection();
    console.log("selection: " + selection);
    //Create the Modal
    modalTitle.innerText = "Insert Link";
    modalBody.innerHTML = `<div class="mb-3">
                                <label for="displaytext" class="form-label">Text to display.</label>
                                <input id="displaytext" class="form-control" type="text">
                            </div>
                            <div class="mb-3">
                                <label for="url" class="form-label">Where should this URL go to?</label>
                                <input id="url" class="form-control" type="text">
                            </div>`;
    modalFooter.innerHTML = `<button id=insertlink type="button" class="btn btn-primary">Insert Link</button>`;
    let displayText = document.getElementById("displaytext");
    console.log(selection + " DIT IS MIJN SELECTIE");
    
    if(selection != ""){
        console.log("ik heb een selectie")
        displayText.value = selection;
    }
    let url = document.getElementById("url");
    let insertLinkButton = document.getElementById("insertlink");
    insertLinkButton.addEventListener('click', function(e){
        console.log("Ik fire de insert link");
        e.preventDefault();
        //IF We have a selection, replace the selection with the final values.


        RestoreSelection(selection);

        if(window.getSelection().toString()){
            let a = document.createElement('a');
            a.href = url.value;
            window.getSelection().getRangeAt(0).surroundContents(a);
        }
        $('#modal').modal('hide');
        //IF We dont have a selection but we do have a cursor position.
        //Enter the link at the position the cursor was at.
        
        //DO SHIT

        //IF we dont have a selection and we do not have a cursor position
        //Place it at the end in within the latest p tag.
        
        //IF there is no p tag at all. Then surround it with a p tag.
    
    });


    console.log(displayText + "text gevonden");
    console.log(url + "url gevonden");
    //console.log(modal.firstChild);
    $("#modal").modal('show');
}

function SaveSelection(){
    if(window.getSelection){
        console.log("Ik krijg een true");
        sel = window.getSelection();
        if(sel.getRangeAt && sel.rangeCount){
            let ranges = [];
            let len = sel.rangeCount;
            for(let i=0; i < len; i++){
                ranges.push(sel.getRangeAt(i));
            }
            console.log(ranges.toString());
            return ranges;
        }
        else if(document.selection && document.selection.createRange){
            console.log(document.selection.toString());
            console.log(document.selection.createRange().toString());
            return document.selection.createRange();
        }
    }   
    return null;  
}

function RestoreSelection(savedSel){
    if(savedSel){
        if(window.getSelection){
            sel = window.getSelection();
            sel.removeAllRanges();
            let len = savedSel.length;
            for(let i = 0; i < len; i++){
                sel.addRange(savedSel[i]);
            }
        }
        else if(document.selection && savedSel.select){
            savedSel.select();
        }
    }
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



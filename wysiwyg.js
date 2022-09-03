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

const isSupported = typeof window.getSelection !== "undefined";

for(let i = 0; i < buttons.length; i++){
    let button = buttons[i];
    button.addEventListener('click', function(e){
        let action = this.dataset.action;

        switch(action){
            case 'createLink':CreateLink(e,visualview);
            break;
            default:Dummy();
        }
    });
}

document.addEventListener('click', (e) => updateIndex(e, visualview));
document.addEventListener('keyup', (e) => updateIndex(e, visualview));
document.addEventListener('click', (e) => UpdateStoredSelection(e, visualView));
document.addEventListener('keyup', (e) => UpdateStoredSelection(e, visualView));

let selectedText = "";
let isInside = false;
let selection = null;

function getCaretIndex(element){
    let position = 0;
    const selection = window.getSelection();
    if(selection.rangeCount !== 0){
        const range = window.getSelection().getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        position = preCaretRange.toString().length;
    }
    return position;
}

function updateIndex(event, element) {
    const textPosition = document.getElementById("caretIndex");
    if (element.contains(event.target)) {
        textPosition.innerText = getCaretIndex(element).toString();
        isInside = true;
    } else {
        console.log(element.contains(event.target));
        textPosition.innerText = "–";
        isInside = false;
    }
}

function UpdateStoredSelection(event, element){
    if(element.contains(event.target)){
        let sel = window.getSelection();
        if(sel.getRangeAt && sel.rangeCount){
            let ranges = [];
            for(let i=0; i < sel.rangeCount; i++){
                ranges.push(sel.getRangeAt(i));
            }
            selectedText = ranges;
        }
        else{
            selectedText = "";
        } 
    }
    else{
        selectedText = "";
    }
}

function CreateLink(event, element){
    //Give an alert they don't support the feature and break out.
    if(!isSupported){
        alert("Your browser doesn't support window.getSelection() but this is required for Create Link to work.");
        return;
    } 
    console.log("Not fully functional");
    //modalTitle.textContent("Insert Link");
    
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
    
    if(selectedText == ""){
        //We have no selection.
        displayText.value = "No Selection.";
        if(!isInside){
            displayText.value = "Out of bounds cursor.";
        }
        else{
            displayText.value = "In of bounds cursor";
        }
    }
    else{
        //Cursor in elk geval in de edit box.
        displayText.value = "We got selection";
    }


   
    
    let url = document.getElementById("url");
    let insertLinkButton = document.getElementById("insertlink");
    insertLinkButton.addEventListener('click', function(e){
        console.log("Ik fire de insert link");
        e.preventDefault();
        //IF We have a selection, replace the selection with the final values.


        RestoreSelection(selectedText);

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



function RestoreSelection(savedSel){
    console.log(savedSel + " savedSELSHIT");
    if(savedSel){
        sel = window.getSelection();
        sel.removeAllRanges();
        let len = savedSel.length;
        for(let i = 0; i < len; i++){
            sel.addRange(savedSel[i]);
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



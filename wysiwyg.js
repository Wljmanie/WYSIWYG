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

//Adds the events for the buttons.
for(let i = 0; i < buttons.length; i++){
    let button = buttons[i];
    button.addEventListener('click', function(e){
        let action = this.dataset.action;

        switch(action){
            case 'createLink':CreateLink(e);
            break;
            default:Dummy();
        }
    });
}

document.addEventListener('click', (e) => updateIndex(e, visualview));
document.addEventListener('keydown', (e) => updateIndex(e, visualview));
document.addEventListener('click', (e) => UpdateSelection(e, visualView));
document.addEventListener('keydown', (e) => UpdateSelection(e, visualView));

visualView.addEventListener('keydown', function(e){
    
        HandleEnter(e)
    
});
    

function HandleEnter(e){

    //if the last character is a zero-width space, remove it
  
  let lastCharCode = visualView.charCodeAt(visualView.length - 1);
  if (lastCharCode == 8203) {
    contentEditableHTML.html(contentEditableHTML.slice(0, -1));
  }

    if(e.key === "Enter" && e.shiftKey){
        //Insert <BR>
        e.preventDefault();
        
        let br = document.createElement("br");
        let zwsp = document.createTextNode("\u200B");
        let range = selection.getRangeAt(0);
        let textNodeParent = document.getSelection().anchorNode.parentNode;
        let inSpan = textNodeParent.nodeName == "SPAN";
        var span = document.createElement("span");

        if(inSpan){
            range.setStartAfter(textNodeParent);
            range.setEndAfter(textNodeParent);
        }

        range.deleteContents();
        range.insertNode(br);
        range.setStartAfter(br);
        range.setEndAfter(br);

        if(inSpan){
            range.insertNode(span);
            range.setStartAfter(span, 0);
            range.setEnd(span,0);
        }

        range.insertNode(zwsp);
        range.setStartBefore(zwsp);
        range.setEndBefore(zwsp);
        selection.removeAllRanges();
        selection.addRange(range);

    
        
    
    
    }
    if(e.key === "Enter"){
        //Insert <p>    </p>
        e.preventDefault();


    }
    




}

let selection = null;

//This can be removed later on.
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
//this can be removed later on.
function updateIndex(event, element) {
    const textPosition = document.getElementById("caretIndex");
    if (element.contains(event.target)) {
        textPosition.innerText = getCaretIndex(element).toString();
        //This update needs to be gone or places somewhere else in the future.
        htmlView.innerText = visualView.innerHTML + "";
    } else {
        textPosition.innerText = "–";
    }
}

//This function keeps track of what is selected.
function UpdateSelection(event, element){
    if(element.contains(event.target)){
        let sel = window.getSelection();
        let ranges = [];
        if(sel.getRangeAt && sel.rangeCount){         
            for(let i=0; i < sel.rangeCount; i++){
                ranges.push(sel.getRangeAt(i));
            }
            selection = ranges;     
        }
        selection = ranges; 
    }
    else{
        selection = null;
    }
}

let storedSelection

function CreateLink(e){
    //Give an alert they don't support the feature and break out.
    if(!isSupported){
        alert("Your browser doesn't support window.getSelection() but this is required for Create Link to work.");
        return;
    } 

    storedSelection = selection;
    
    //Set up the Modal
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
    if(selection != null){
        if(selection == ""){
            //Text Selected.
            displayText.value = "LinkText";
        }
        else{
            //Cursor in the box.
            displayText.value = selection.toString();
        }   
    }
    else{      
        //Cursor not in the box.
        displayText.value = "LinkText";
    }
    
    let url = document.getElementById("url");
    let insertLinkButton = document.getElementById("insertlink");

    //Add enter button to make the button work.
    insertLinkButton.addEventListener('click', function(){
        InsertLink(e, displayText,url);
    });
    
    insertLinkButton.addEventListener("keydown", function(e){
        if(e.key === "Enter"){
            InsertLink(e, displayText,url);
        }
    });
    displayText.addEventListener("keydown", function(e){
        if(e.key === "Enter"){
            InsertLink(e, displayText,url);
        }
    });
    url.addEventListener("keydown", function(e){
        if(e.key === "Enter"){
            InsertLink(e, displayText,url);
        }
    });
    
    $("#modal").modal('show');

    //Not sure if this is needed, but I guess it can't really harm either.
    //Removes the eventListeners from the modal.
    modal.addEventListener('hide.bs.modal', function(e){
        insertLinkButton.removeEventListener('click', arguments.callee);
        insertLinkButton.removeEventListener('keydown', arguments.callee);
        displayText.removeEventListener('keydown', arguments.callee);
        url.removeEventListener('keydown', arguments.callee);
        modal.removeEventListener('hide.bs.modal', arguments.callee);
    });
}

function InsertLink(e, displayText, url){
    if(url.value == ""){
        alert("URL can't be empty.");
        return;
    }
    if(displayText.value == ""){
        alert("The display text can't be empty.");
        return;
    }

    e.preventDefault();
    RestoreSelection(storedSelection);
    
    if(storedSelection != null){
        
        replaceSelectedText(displayText.value);
        let a = document.createElement('a');
        a.href = url.value;
        window.getSelection().getRangeAt(0).surroundContents(a);
    }
    else{
        let range = document.createRange();
        range.selectNodeContents(visualView);
        range.collapse(false);
        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        visualView.focus();
        replaceSelectedText(displayText.value);
        let a = document.createElement('a');
        a.href = url.value;
        window.getSelection().getRangeAt(0).surroundContents(a);
    }

    $('#modal').modal('hide');
}

function RestoreSelection(savedSel){
    if(savedSel){
        sel = window.getSelection();
        sel.removeAllRanges();
        let len = savedSel.length;
        for(let i = 0; i < len; i++){
            sel.addRange(savedSel[i]);
        }       
    }
}

function replaceSelectedText(replacementText){
    let sel, range;
    sel = window.getSelection();
    if(sel.rangeCount){
        range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(replacementText));
    }
}
function Dummy(){
    console.log("NEED TO IMPLEMENT!!!");
}


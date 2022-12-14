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

//TODO on string cleaning remove the &zerowidthwhitespace
//TODO replacing text for links, when stuff is selected over more then one element like a P it destroys the stuff.
//TODO disable drag and drop or fix it.

//TODO FOR NEXT TIME
//Make Bold work.
//Make Italic work.
//Make Underline work.
//Make strikethrough work.
//Insert a code block.


//Adds the events for the buttons.
for(let i = 0; i < buttons.length; i++){
    let button = buttons[i];
    button.addEventListener('click', function(e){
        let action = this.dataset.action;

        switch(action){
            case 'createLink':CreateLink(e);
            break;
            case `bold`:MakeBold(e);
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

function MakeBold(e){
    //Check if the cursor is inside.
    let sel = window.getSelection();
    if(sel.containsNode(visualView, true)){
        //Stuff is selected inside.
        //Only the cursor is inside
        if(sel == ""){
            //We create the span tag in here and put the cursor in the middle.
            console.log("called this shit");
            CreateElementAtCursor("bold", sel);

        }
        else{
            //WE HAVE BIG SELECTION
            //MAYBE NEED TO DITCH STUFF THAT IS OUTSIDE. NEED TO TEST
            console.log("Selection: " + sel);
        
            console.log("selection len: " + sel.rangeCount);
            console.log("anchorNode: " + sel.anchorNode);
            console.log("parentNode: " + sel.parentNode);
            console.log("focusNode: " + sel.focusNode); //this is the end node.
            console.log("nextNode: " + sel.anchorNode.nextSibling);
        
            let ranges = [];
            

            //Check if the selection is backwards.

            console.log(isSelectionBackwards(sel));

            if(isSelectionBackwards(sel)){
                destinationNode = sel.anchorNode;
                currentNode = sel.focusNode;
            }
            else{
                currentNode = sel.anchorNode;
                destinationNode = sel.focusNode;
            }

            while(!currentNode.isSameNode(destinationNode)){
                console.log("Loop currentNode: " + currentNode);
                console.log("Loop currentNodeName: " + currentNode.nodeName);
                console.log("Loop currentNodeType: " + currentNode.nodeType);
                //If it is inside visualview add it to our ranges.
                if(visualView.contains(currentNode)){
                    console.log("IM INSIDE");
                    let tempRange;
                    tempRange.createRange();
                    tempRange.selectNode(currentNode);
                    ranges.push(tempRange);
                }

                if(currentNode.firstChild != null){
                    currentNode = currentNode.firstChild;
                }
                else if (currentNode.nextSibling != null){
                    
                    currentNode = currentNode.nextSibling;
                }
                else if(currentNode.parentNode.nextSibling != null){
                    currentNode = currentNode.parentNode.nextSibling;
                }
            }

            //loop through are nodes in the new range.
            //create a span in each P element that covers it whole.
            
            console.log("Finished loop");
            console.log("RANGE LENGTH: " + ranges.length);
            for(i=0; i < ranges.length; i++){
                console.log("In RANGES: " + ranges[i].nodeName);
            }
            
        }

        

    }
    else{
        //Shit is not inside.
        CreateElementAtTheEnd("bold", sel);
    }

    
    
    //If cursor is inside.
    //Check if there is more selection then ""
    //if "" create a span with bold, put the cursor inside

    //If there is more, place a span tag around it with bold for each text node.

}

function isSelectionBackwards(sel){
    let backwards = false;
    if(!sel.Collapsed){
        let range = document.createRange();
        range.setStart(sel.anchorNode, sel.anchorOffSet);
        range.setEnd(sel.focusNode, sel.focusOffset);
        
        backwards = range.collapsed;
        range.detach();
    }
    return backwards;
}
function CreateElementAtCursor(elementclass, sel){
    let zwsp = document.createTextNode("\u200B");
    let range = sel.getRangeAt(0);
    let element = document.createElement('span');
    
    switch(elementclass){
        case 'bold' : element.classList.add("fw-bold");
        break;
        case 'italic' : element.classList.add("fst-italic");
        break;
        default : console.log("ElementClass not recognized.");
    }
    range.insertNode(element);
    element.appendChild(zwsp);
    range.selectNode(zwsp);
    sel.removeAllRanges();
    sel.addRange(range);
}

function CreateElementAtTheEnd(elementclass, sel){
    let zwsp = document.createTextNode("\u200B");
    let range = document.createRange();
    range.selectNodeContents(visualView);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
    visualView.focus();
    let element = document.createElement('span');
    
    switch(elementclass){
        case 'bold' : element.classList.add("fw-bold");
        break;
        case 'italic' : element.classList.add("fst-italic");
        break;
        default : console.log("ElementClass not recognized.");
    }
    range.insertNode(element);
    p = document.createElement('p');
    range.surroundContents(p);
    element.appendChild(zwsp);
    range.selectNode(zwsp);
    sel.removeAllRanges();
    sel.addRange(range);
}
    
document.addEventListener('selectionchange',(e) => selectionChange(e, visualView));

function selectionChange(e, element){
    //I can use this for activating and deactivating buttons.
    let sel = window.getSelection();
    if(sel.containsNode(element, true)){
        console.log("I am a child of the thingy and therefore inside.");
    }

   
    
}

function HandleEnter(e){

    //if the last character is a zero-width space, remove it
  let contentEditableHTML = visualView.innerHTML;
  
  let lastCharCode = contentEditableHTML.charCodeAt(contentEditableHTML.length - 1);
  if (lastCharCode == 8203) {
    contentEditableHTML.html(contentEditableHTML.slice(0, -1));
  }

    if(e.key === "Enter" && e.shiftKey){
        //Insert <BR>
        //NEED TO TEST IN SPAN HOW IT WORKS
        e.preventDefault();
        let br = document.createElement("br");
        let zwsp = document.createTextNode("\u200B");      
        let sel = window.getSelection();
        let range = sel.getRangeAt(0);
        let textNodeParent = document.getSelection().anchorNode.parentNode;
        let inSpan = textNodeParent.nodeName == "SPAN";
        var span = document.createElement("span");

        if(inSpan){
            console.log("Im span when creating a br.");
            range.setStartAfter(textNodeParent);
            range.setEndAfter(textNodeParent);
        }

        range.deleteContents();
        range.insertNode(br);
        range.setStartAfter(br);
        range.setEndAfter(br);

        if(inSpan){
            //TODO need to copy the span classlist.
            range.insertNode(span);
            range.setStartAfter(span, 0);
            range.setEnd(span,0);
        }

        range.insertNode(zwsp);
        range.setStartBefore(zwsp);
        range.setEndBefore(zwsp);
        sel.removeAllRanges();
        sel.addRange(range); 
    }
    if(e.key === "Enter" && !e.shiftKey){
        //Insert <p>    </p>
        e.preventDefault();
        let p = document.createElement("p");
        let sel = window.getSelection();
        let range = sel.getRangeAt(0);
        textNodeParent = document.getSelection().anchorNode.parentNode;
        myCurrentNode = document.getSelection().anchorNode;
        //console.log("NodeParent: " + textNodeParent);
        //console.log("Current Node: " + myCurrentNode);  
        if(textNodeParent.nodeName == "P"){
            range.setStartAfter(textNodeParent);
            range.setEndAfter(textNodeParent);
        }
        else if(myCurrentNode.nodeName == "P"){
            range.setStartAfter(myCurrentNode);
            range.setEndAfter(myCurrentNode);
        }
        //TODO NEED TO CHECK TILL I GET OUT OF ALL THE SPANS.
        else if(textNodeParent.nodeName == "SPAN"){
            let tempNode = document.getSelection().anchorNode.parentNode.parentNode;
            if( tempNode.nodeName == "P"){
                range.setStartAfter(tempNode);
                range.setEndAfter(tempNode);
            }
            else{
                console.log("Something went wrong.");
            }
        }

        range.deleteContents();
        range.insertNode(p);
        let zwsp = document.createTextNode("\u200B");    
        p.appendChild(zwsp);
        range.selectNode(zwsp);
        sel.removeAllRanges();
        sel.addRange(range);
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
        textPosition.innerText = "???";
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


//How the content should look like.
/*
<div id=visualview contenteditable="true">
    <p>
        <span class="">
            TEXT <br>
            TEXT
        </span>
        <span class="">
            TEXT
        </span>
    </p>
    <p>
        <span class="">
            TEXT <br>
            TEXT
        </span>
        <span class="">
            TEXT
        </span>
    </p>
    <code>
        THE CODE INSERT
    </code>
</div>
*/

/*TODO
    Enter Fucntionaility
        on default
            create a new paragraph.
        shift enter
            create a br
        ctrl enter
            create horizontal ruler
            outside the p.
        
    Cases selection is collapsed.
     if the selection is at the end just break out and create it.
     if it is in the middle, split paragraph.
     if it is at the start, break out and create one in front of it.
    
    Case selection of a bigger part.
        delete the current selection and does as above.

    Drag and drop. Disable it.

    Bold functionality
        collapsed
            if already in a bold span, it should present the unbold one instead.
            split the span and create a new one with bold.
        selected.
            check if the whole span is selected
                if everything is already bold, then it should give the unbold button.
                if so, just add bold.
                if not, split the remaining.
        Can a ruler be selected?
*/

//Makes sure they don't run an ancient browser.
const isSupported = typeof window.getSelection !== "undefined";
if(!isSupported){
    alert("Your browser doesn't support window.getSelection(). This page requires it to work.");   
} 
//Grab the variable we need from the DOM.
const visualView = document.getElementById("visualview");
const htmlView = document.getElementById("htmlview");
const boldButton = document.getElementById("boldbutton");

//This is where we handle keyboard inputs.
visualView.addEventListener('keydown', function(e){
    HandleEnter(e);
});



//Makes it so we can see what happens currently.
visualView.addEventListener("keyup", function(e){
    htmlView.innerText = visualView.innerHTML;
});


function HandleEnter(e){
    //Make sure we have the Enter key.
    if(e.key === "Enter"){
        e.preventDefault();
        if(e.shiftKey){
            console.log("SHIFT ENTER");
            //For comments I don't want this to do anything special.
        }
        else if(e.ctrlKey){
            console.log("CONTROL ENTER");
            //HR moet buiten de P tag.
            //For comments I don't think I want this to do anything.
        }
        else{
            console.log("ENTER");
            let selection = window.getSelection();
            let range = selection.getRangeAt(0);
            //We moeten nog even kijken of er meerdere spans in de P tag zitten.


            //We should always be in a text node, so lets check for it.
            let node = selection.anchorNode;
            console.log(node.nodeName);
            if(node.nodeName == "#text"){
                console.log("We zitten in een text node.");
                if(range.collapsed){
                    console.log("Niks geselecteerd.");
                    //Check waar we in de text node zitten om te zien wat we doen.
                    let position = range.startOffset;
                    console.log("Position offset: " + position);
                    console.log("LENGTH NODE: " + node.length);
                    if(position == 0){
                        console.log("We zitten helemaal aan het begin van de text node.");
                        if(node.parentNode.nodeName == "SPAN"){
                            console.log("Our parent is a span.");
                            console.log("ervoor?" + node.parentNode.previousSibling);
                            if(node.parentNode.previousSibling == null){
                                if(node.parentNode.parentNode.nodeName == "P"){
                                    console.log("We hebben onze P tag.");
                                    range.setStartBefore(node.parentNode.parentNode);
                                    range.setEndBefore(node.parentNode.parentNode);
                                    p = document.createElement("P");
                                    span = document.createElement("SPAN");
                                    zwsp = document.createTextNode("\u200B");
                                    range.insertNode(p);
                                    p.appendChild(span);
                                    span.appendChild(zwsp);
                                    range.selectNode(zwsp);
                                    selection.removeAllRanges();
                                    selection.addRange(range);
                                    range.detach();
                                    console.log("Created the new P.");
                                }
                                else{
                                    console.log("We hebben onze P tag niet gevonden!");
                                }
                            }
                        }
                        //node.parentNode.previousSibling
                    }
                    else if(position == node.length){
                        console.log("We zitten helemaal aan het eind van de text node.");
                        if(node.parentNode.nodeName == "SPAN"){
                            console.log("Our parent is a span.");
                            console.log("erna?" + node.parentNode.nextSibling);
                            if(node.parentNode.nextSibling == null){
                                //We create a p and a span tag in it, then put the cursor focus in the span.
                                //We create it after our current P
                                if(node.parentNode.parentNode.nodeName == "P"){
                                    console.log("We hebben onze P tag.");
                                    range.setStartAfter(node.parentNode.parentNode);
                                    range.setEndAfter(node.parentNode.parentNode);
                                    p = document.createElement("P");
                                    span = document.createElement("SPAN");
                                    zwsp = document.createTextNode("\u200B");
                                    range.insertNode(p);
                                    p.appendChild(span);
                                    span.appendChild(zwsp);
                                    range.selectNode(zwsp);
                                    selection.removeAllRanges();
                                    selection.addRange(range);                            
                                    range.detach();
                                    console.log("Created the new P.");
                                }
                                else{
                                    console.log("We hebben onze P tag niet gevonden!");
                                }
                            }
                        }
                    }
                    else if(position > 0 && position < node.length){
                        console.log("We zitten ergens in het midden van de text node.");
                        //kijk of we nog andere dingen achter ons hebben.
                        //Zo ja nemen we die ook mee naar de nieuwe P.
                        //split de huidige span in 2 spans die hetzelfde zijn.
                        
                        if(node.parentNode.nodeName == "SPAN"){
                            console.log("Our parent is a span.");
                            //console.log("erna?" + node.parentNode.nextSibling);
                            if(node.parentNode.nextSibling == null){
                                //We create a p and a span tag in it, then put the cursor focus in the span.
                                //We create it after our current P
                                if(node.parentNode.parentNode.nodeName == "P"){
                                    console.log("We hebben onze P tag.");
                                    range.setEnd(node, node.length);
                                    let content = range.extractContents();
                                    range.setStartAfter(node.parentNode.parentNode);
                                    range.setEndAfter(node.parentNode.parentNode);
                                    p = document.createElement("P");
                                    span = document.createElement("SPAN");
                                    contentToTake = document.createTextNode(content.tostring);
                                    range.insertNode(p);
                                    p.appendChild(span);
                                    span.appendChild(content);
                                    //console.log("SPAN CHILD: " + span.firstChild.nodeName);
                                    range.setStartBefore(span.firstChild);
                                    range.setEndBefore(span.firstChild);
                                    selection.removeAllRanges();
                                    selection.addRange(range);                            
                                    range.detach();
                                    console.log("Created the new P.");
                                }
                                else{
                                    console.log("We hebben onze P tag niet gevonden!");
                                }
                            }
                            else{
                                if(node.parentNode.parentNode.nodeName == "P"){
                                    //We need to grab our next sibling spans.
                                    



                                    console.log("We hebben onze P tag.");
                                    range.setEnd(node, node.length);
                                    let content = range.extractContents();
                                    range.setStartAfter(node.parentNode.parentNode);
                                    range.setEndAfter(node.parentNode.parentNode);
                                    p = document.createElement("P");
                                    span = document.createElement("SPAN");
                                    contentToTake = document.createTextNode(content.tostring);
                                    range.insertNode(p);
                                    p.appendChild(span);
                                    span.appendChild(content);

                                    let finalSiblingNode = node.parentNode;
                                    let spansToMove = [];
                                    while(finalSiblingNode.nextSibling != null){
                                        
                                        finalSiblingNode = finalSiblingNode.nextSibling;
                                        spansToMove.push(finalSiblingNode);
                                        console.log("Size:" + spansToMove.length);
                                        console.log("nextSIb: " + finalSiblingNode);
                                        //p.appendChild(finalSiblingNode);
                                    }
                                    for(i = 0; i < spansToMove.length; i++){
                                        console.log("MoveChild");
                                        let nodeMove = spansToMove[i];
                                        p.appendChild(nodeMove);
                                    }
                                    

                                    //console.log("SPAN CHILD: " + span.firstChild.nodeName);
                                    range.setStartBefore(span.firstChild);
                                    range.setEndBefore(span.firstChild);
                                    selection.removeAllRanges();
                                    selection.addRange(range);                            
                                    range.detach();
                                    console.log("Created the new P.");
                                }
                                else{
                                    console.log("We hebben onze P tag niet gevonden!");
                                }
                            }
                        }




                    }
                    else{
                        console.log("Er is iets mis gegaan.");
                    }

                }
                else{
                    console.log("We hebben wat geselecteerd.");
                    //Delete wat we hebben geselecteerd. We moeten uitkijken wat we precies geselecteerd hebben.
                }
            }
            else{
                //IT CAN HIT A SPAN, We need to check if the text node only contains a wszp.
                //if thats the case we can still make a new P
                if(node.firstChild.nodeName == "#text"){
                    console.log("We hebben onze text");
                    //lastCharCode == 8203
                    if(node.firstChild.textContent.charCodeAt(0) == 8203){
                        console.log("Het is een whitespace.");

                        //switch the node to the correct text node.
                        node = node.firstChild;

                        if(node.parentNode.nodeName == "SPAN"){
                            console.log("Our parent is a span.");
                            console.log("erna?" + node.parentNode.nextSibling);
                            if(node.parentNode.nextSibling == null){
                                //We create a p and a span tag in it, then put the cursor focus in the span.
                                //We create it after our current P
                                if(node.parentNode.parentNode.nodeName == "P"){
                                    console.log("We hebben onze P tag.");
                                    range.setStartAfter(node.parentNode.parentNode);
                                    range.setEndAfter(node.parentNode.parentNode);
                                    p = document.createElement("P");
                                    span = document.createElement("SPAN");
                                    zwsp = document.createTextNode("\u200B");
                                    range.insertNode(p);
                                    p.appendChild(span);
                                    span.appendChild(zwsp);
                                    range.selectNode(zwsp);
                                    selection.removeAllRanges();
                                    selection.addRange(range);                            
                                    range.detach();
                                    console.log("Created the new P.");
                                }
                                else{
                                    console.log("We hebben onze P tag niet gevonden!");
                                }
                            }
                        }







                    }

                }
                
                console.log("Something went wrong, we try to push enter outside of a text node");
                //If everything is deleted it can hit P without span, or div. without p.
                //Need to fix those two edge cases.

                console.log("NODENAME: " + node.nodeName);
            }

/*
            
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
        sel.addRange(range);*/
        }












    }
}
//function sleep(ms) {
   // return new Promise(resolve => setTimeout(resolve, ms));
  //}
  //sleep(100).then(() => { range.deleteContents(); });
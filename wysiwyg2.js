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
        Can a ruler be selected? I don't think I add rules for comments.

    On empty text
        When there are no tags and there is text or space or a character inserted.
        Create a P tag and a SPAN tag for them.
    
    Backspace functionality
        auto delete white spaces
        auto delete tags when a node is gone.
        move cursor to the right spot.
    delete functionality
        auto delete white spaces
        auto delete tags when a node is gone.
        move cursor to the right spot.
    
    Code block might need some markup for padding/margin.

    Add default comment class to the spans.
    

    MULTIPLESELECTION IN FIREFOX IS NOT SUPPORTED AT THIS MOMENT, IT WILL ONLY TAKE THE FIRST!
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
document.addEventListener('selectionchange', () => {
    let selection = window.getSelection();
    //console.log("BADSELECTION?: " + isBadSelection(selection));
    isBadSelection(selection);
    console.log("We finished loop;");
  });
//END OF TEMP SHIT

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
                            else{
                                

                                
                                
                                if(node.parentNode.parentNode.nodeName == "P"){
                                    //We need to grab our next sibling spans.
                                    console.log("We hebben onze P tag.");
                                    
                                    
                                    range.setStartAfter(node.parentNode.parentNode);
                                    range.setEndAfter(node.parentNode.parentNode);
                                    p = document.createElement("P");
                                    
                                    
                                    range.insertNode(p);
                                    
                                    
                                    
                                   

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
                                    //console.log("heb ik dit?: " + spansToMove[0].firstChild);
                                    range.setStartBefore(spansToMove[0].firstChild);
                                    range.setEndBefore(spansToMove[0].firstChild);
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
                                    if(node.parentNode.getAttributeNode("class") != null){

                                        span.className = node.parentNode.getAttributeNode("class").value;
                                    }
                                    
                                    //span.setAttribute('class', node.parentNode.attributes);
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
                                    //Dit kan null geven.
                                    if(node.parentNode.getAttributeNode("class") != null){

                                        span.className = node.parentNode.getAttributeNode("class").value;
                                    }

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
                    //Wat hebben we geselecteerd?
                        //We hebben een gedeeltelijke node.
                        //We hebben een volledige node.
                        //We hebben twee gedeeltelijke nodes
                        //we hebben een gedeeltelijke node en een volledige node.
                        //we hebben een gedeeltelijke node en meerdere volledige nodes.
                        //we hebben meerdere gedeeltelijke nodes.

                        //Ik denk dat we alle nodes moeten pakken.
                        //Dan loopen we door elke node.
                            //We handelen een volledige node.
                                //als het de laatste node was. Delete de P ook.
                            //We handelen een gedeelte node.
                    
                    //We select something bad. This should never trigger.
                    if(isBadSelection(selection)){
                        alert("Your selection is containing things outside the input box.");
                        return; 
                    }
                    let textNodes = [];
                    let currentNode;
                    let startingNode;
                    let destinationNode;
                    let startingNodeOffset;
                    let destinationNodeOffset;
    
                    if(isSelectionBackwards(selection)){
                        currentNode = selection.focusNode;
                        startingNode = selection.focusNode;
                        destinationNode = selection.anchorNode;
                        startingNodeOffset = selection.focusOffset;
                        destinationNodeOffset = selection.anchorOffset;
                    }
                    //This might be redundant.
                    else{
                        currentNode = selection.anchorNode;
                        startingNode = selection.anchorNode;
                        destinationNode = selection.focusNode;
                        startingNodeOffset = selection.anchorOffset;
                        destinationNodeOffset = selection.focusOffset;
                    }
                    console.log("DestinationNode what is it?: " + destinationNode);

                    while(!currentNode.isSameNode(destinationNode)){
                        //console.log("Loop currentNode: " + currentNode);
                        //console.log("Loop currentNodeName: " + currentNode.nodeName);
                        //console.log("Loop currentNodeType: " + currentNode.nodeType);
                        //If it is inside visualview add it to our ranges.
                        if(currentNode.nodeName == "#text"){
                            console.log("We have a text node.");
                            textNodes.push(currentNode);
                        }
                        else{
                            console.log("We have a non text node: " + currentNode.nodeName);
                            //we ignore it.
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
                        else if(currentNode.parentNode.parentNode.nextSibling != null){
                            currentNode = currentNode.parentNode.parentNode.nextSibling;
                        }
                        else{
                            console.warn("We are going to loop since we don't change the current node. WE NEED TO FIX THIS.");
                            //IF THIS STILL OCCURS, we have to fix it in a different way.
                            return;
                        }

                    }
                    //We need to grab the last one as well.
                    if(currentNode.isSameNode(destinationNode)){
                        textNodes.push(currentNode);
                    }
                    console.log("We hebben text nodes gevonden en wel: " + textNodes.length);
                    
                    //We only have one node so handle it differently.
                    if(startingNode == destinationNode){
                        console.log("We only have one node.");
                        console.log("STARTOFFSET: " + startingNodeOffset);
                            console.log("DESTOFFSET: " + destinationNodeOffset);
                            console.log("Length: " + textNodes[0].length);

                        if(textNodes[0].length == destinationNodeOffset && startingNodeOffset == 0){
                            //We have the full node.
                            console.log("Full node selected.");
                            let parent = textNodes[0].parentNode;
                            if(parent.nodeName == "SPAN"){
                                if(parent.previousSibling == null && parent.nextSibling == null){
                                    //We are the last span, so delete the p as well.
                                    console.log("We are the last span.");
                                    //we grab the one above p and delete the child.
                                   
                                    if(parent.parentNode.nodeName == "P"){
                                        
                                        //We need to create the P object.
                                        if(parent.parentNode.nextSibling.nodeName == "P"){
                                            //We have a next sibling put it in front.
                                            //TODO CLEAN UP the .parent.parent stuff.
                                                //this might get a null?
                                                range.setStartBefore(parent.parentNode.nextSibling);
                                                range.setEndBefore(parent.parentNode.nextSibling);
    
    
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
                                                parent.parentNode.parentNode.removeChild(parent.parentNode);
                                            
                                        }
                                        else if(parent.parentNode.previousSibling.nodeName == "P"){
                                            
                                                range.setStartAfter(parent.parentNode.previousSibling);
                                                range.setEndAfter(parent.parentNode.previousSibling);
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
                                                parent.parentNode.parentNode.removeChild(parent.parentNode);
                                            
                                        }
                                        else{
                                                console.warn("This should never happen.")  ;
                                                //We are the last span and fully selected the node.
                                                let zwsp = document.createTextNode("\u200B");
                                                parent.replaceChild(zwsp,startingNode);
                                                range.selectNode(zwsp);
                                                selection.removeAllRanges();
                                                selection.addRange(range);                            
                                                range.detach();
                                        }
                                        
                                    }
                                    else{
                                        console.warn("We expected a P here.");
                                        
                                    }
                                }
                                else{
                                    console.log("We still have other spans.");
                                    //We need to see if there are spans behind us and grab those, to take them with us.
                                    let siblingsToTakeWith = [];
                                    let nextSibling = parent.nextSibling;
                                    if(nextSibling == null){
                                        console.log("We don't have more siblings.");
                                            if(parent.parentNode.nodeName == "P"){
                                                range.setStartAfter(parent.parentNode);
                                                range.setEndAfter(parent.parentNode);
                                                let p = document.createElement("P");
                                                let span = document.createElement("SPAN");
                                                let zwsp = document.createTextNode("\u200B");
                                                range.insertNode(p);
                                                p.appendChild(span);
                                                span.appendChild(zwsp);
                                                range.selectNode(zwsp);
                                                selection.removeAllRanges();
                                                selection.addRange(range);                            
                                                range.detach();
                                                console.log("Created the new P.");
                                                parent.parentNode.removeChild(parent);

                                            }
                                            else{
                                                console.warn("We expected a P tag here.");
                                            }

                                    }
                                    else{
                                        console.log("We do have more siblings.");

                                        while(nextSibling != null && nextSibling.nodeName == "SPAN"){
                                            siblingsToTakeWith.push(nextSibling);
                                            nextSibling = nextSibling.nextSibling;
                                        }
                                        console.log("We take siblings amount with: " + siblingsToTakeWith.length);

                                        range.setStartAfter(parent.parentNode);
                                        range.setEndAfter(parent.parentNode);
                                        p = document.createElement("P");
                                        
                                        
                                        range.insertNode(p);

                                        for(i=0; i < siblingsToTakeWith.length; i++){
                                            p.appendChild(siblingsToTakeWith[i]);
                                            
                                        }
                                        
                                        
                                        



                                        
                                        console.log("Created the new P.");
                                        //if we don't have a previous sibling, create an empty p before us.
                                        if(parent.previousSibling == null){
                                            console.log("We don't have a previous sibling.");
                                            

                                            range.setStartBefore(parent.parentNode);
                                            range.setEndBefore(parent.parentNode);
                                            let p = document.createElement("P");
                                            let span = document.createElement("SPAN");
                                            let zwsp = document.createTextNode("\u200B");
                                            range.insertNode(p);
                                            p.appendChild(span);
                                            span.appendChild(zwsp);
                                    
                                    
                                            console.log("Created the new P.");
                                            parent.parentNode.parentNode.removeChild(parent.parentNode);

                                        }
                                        else{
                                            parent.parentNode.removeChild(parent);
                                        }
                                        //parent.parentNode.parentNode.removeChild(parent.parentNode);
                                        range.setStartBefore(siblingsToTakeWith[0].firstChild);
                                        range.setEndBefore(siblingsToTakeWith[0].firstChild);
                                        selection.removeAllRanges();
                                        selection.addRange(range);
                                        range.detach();
                                    }
                                    


                                    //parent.parentNode.removeChild(parent);


                                }
                            }
                            else{
                                console.warn("We were expecting a SPAN here.");
                            }
                           

                        }
                        else{
                            //We have a partial node.
                            console.log("Partial node selected.");
                            //delete the partial stuff. check if there are more spans behind us. create p.
                            let tempLen = textNodes[0].length;
                            range.extractContents();
                            //let content = range.extractContents();
                            //console.log("Content: " + content);
                            //we have it from the start
                            
                            
                            if(startingNodeOffset == 0){
                                console.log("Partial from the start.");
                                //check if we are the very first one.
                                //console.log("Wat is onze parent hier dan?: " + startingNode.parent);
                                if(startingNode.parentNode.nodeName == "SPAN"){
                                    if(startingNode.parentNode.previousSibling == null){
                                        console.log("We are the first span.");
                                        if(startingNode.parentNode.parentNode.nodeName == "P"){
                                            let parent = startingNode.parentNode.parentNode;
                                            range.setStartBefore(parent);
                                            range.setEndBefore(parent);
                                            let p = document.createElement("P");
                                            let span = document.createElement("SPAN");
                                            let zwsp = document.createTextNode("\u200B");
                                            
                                            //if(startingNode.parentElement.getAttributeNode("class") != null){

                                              //  span.className = startingNode.parentElement.getAttributeNode("class").value;
                                            //}
                                            range.insertNode(p);
                                            p.appendChild(span);
                                            span.appendChild(zwsp);

                                            range.setStartBefore(startingNode);
                                            range.setEndBefore(startingNode);
                                            selection.removeAllRanges();
                                            selection.addRange(range);
                                            range.detach();


                                        }
                                        else{
                                            console.warn("We expected a P tag here.");
                                        }



                                    }
                                    else{
                                        console.log("We are not the first span.");
                                        if(startingNode.parentNode.nextSibling == null){
                                            console.log("We are the last span.");
                                            if(startingNode.parentNode.parentNode.nodeName == "P"){
                                                let parent = startingNode.parentNode.parentNode;
                                                range.setStartAfter(parent);
                                                range.setEndAfter(parent);
                                                let p = document.createElement("P");
                                                
                                                
                                                
                                                //if(startingNode.parentElement.getAttributeNode("class") != null){
    
                                                  //  span.className = startingNode.parentElement.getAttributeNode("class").value;
                                                //}
                                                range.insertNode(p);

                                                p.appendChild(startingNode.parentNode);
                                                
    
                                                range.setStartBefore(startingNode);
                                                range.setEndBefore(startingNode);
                                                selection.removeAllRanges();
                                                selection.addRange(range);
                                                range.detach();
    
    
                                            }
                                            else{
                                                console.warn("We expected a P tag here.");
                                            }
                                        }
                                        else{
                                            //We are somewhere in the middle.
                                            //and we have to take multiple ones with us.
                                            let siblingsToTakeWith = [];
                                            let nextSibling = startingNode.parentNode.nextSibling;

                                            while(nextSibling != null && nextSibling.nodeName == "SPAN"){
                                                siblingsToTakeWith.push(nextSibling);
                                                nextSibling = nextSibling.nextSibling;
                                            }
                                            console.log("We take siblings amount with: " + siblingsToTakeWith.length);


                                            if(startingNode.parentNode.parentNode.nodeName == "P"){
                                                range.setStartAfter(startingNode.parentNode.parentNode);
                                                range.setEndAfter(startingNode.parentNode.parentNode);

                                            }
                                            else{
                                                console.warn("We are expecting a P element here.");
                                            }
                                            let p = document.createElement("P");
                                        
                                        
                                            range.insertNode(p);
                                            p.appendChild(startingNode.parentNode);

                                            for(i=0; i < siblingsToTakeWith.length; i++){
                                                p.appendChild(siblingsToTakeWith[i]);
                                            
                                            }

                                            range.setStartBefore(startingNode);
                                            range.setEndBefore(startingNode);
                                            selection.removeAllRanges();
                                            selection.addRange(range);
                                            range.detach();

                                        }
                                    }
                                }
                                else{
                                    console.warn("We were expecting a span.");
                                }
                                
                            }   
                            else if(tempLen == destinationNodeOffset ){
                                console.log("Partial till the end.");

                                if(startingNode.parentNode.nodeName == "SPAN"){
                                    
                                    
                                        
                                        if(startingNode.parentNode.nextSibling == null){
                                            console.log("We are the last span.");
                                            if(startingNode.parentNode.parentNode.nodeName == "P"){
                                                let parent = startingNode.parentNode.parentNode;
                                                range.setStartAfter(parent);
                                                range.setEndAfter(parent);
                                                let p = document.createElement("P");
                                                let span = document.createElement("SPAN");
                                                let zwsp = document.createTextNode("\u200B");
                                                
                                                
                                                
                                                //if(startingNode.parentElement.getAttributeNode("class") != null){
    
                                                  //  span.className = startingNode.parentElement.getAttributeNode("class").value;
                                                //}
                                                range.insertNode(p);
                                                p.appendChild(span);
                                                span.appendChild(zwsp);

                                                //p.appendChild(startingNode.parentNode);
                                                
    
                                                range.setStartBefore(zwsp);
                                                range.setEndBefore(zwsp);
                                                selection.removeAllRanges();
                                                selection.addRange(range);
                                                range.detach();
    
    
                                            }
                                            else{
                                                console.warn("We expected a P tag here.");
                                            }
                                        }
                                        else{
                                            //We are somewhere in the middle.
                                            //and we have to take multiple ones with us.
                                            let siblingsToTakeWith = [];
                                            let nextSibling = startingNode.parentNode.nextSibling;

                                            while(nextSibling != null && nextSibling.nodeName == "SPAN"){
                                                siblingsToTakeWith.push(nextSibling);
                                                nextSibling = nextSibling.nextSibling;
                                            }
                                            console.log("We take siblings amount with: " + siblingsToTakeWith.length);


                                            if(startingNode.parentNode.parentNode.nodeName == "P"){
                                                range.setStartAfter(startingNode.parentNode.parentNode);
                                                range.setEndAfter(startingNode.parentNode.parentNode);

                                            }
                                            else{
                                                console.warn("We are expecting a P element here.");
                                            }
                                            let p = document.createElement("P");
                                        
                                        
                                            range.insertNode(p);
                                            //p.appendChild(startingNode.parentNode);

                                            for(i=0; i < siblingsToTakeWith.length; i++){
                                                p.appendChild(siblingsToTakeWith[i]);
                                            
                                            }

                                            range.setStartBefore(siblingsToTakeWith[0]);
                                            range.setEndBefore(siblingsToTakeWith[0]);
                                            selection.removeAllRanges();
                                            selection.addRange(range);
                                            range.detach();

                                        }
                                    
                                }
                                else{
                                    console.warn("We were expecting a span.");
                                }

                                
                                //check if we are the last one.
                                    //create a new empty p behind.
                                //otherwise take the others with.
                            }
                            else{
                                console.log("Partial in the middle");
                                //take everything behind us with us in a new p.
                                
                                //check if we are the very first one.
                                //console.log("Wat is onze parent hier dan?: " + startingNode.parent);
                                if(startingNode.parentNode.nodeName == "SPAN"){
                                    



                                    
                                        
                                        if(startingNode.parentNode.nextSibling == null){
                                            console.log("We are the last span.");
                                            if(startingNode.parentNode.parentNode.nodeName == "P"){
                                                let parent = startingNode.parentNode.parentNode;
                                                range.setStart(startingNode,startingNodeOffset);
                                                range.setEndAfter(startingNode);
                                                let content = range.extractContents();
                                                console.log(content.textContent);


                                                range.setStartAfter(parent);
                                                range.setEndAfter(parent);
                                                let p = document.createElement("P");
                                                let span = document.createElement("SPAN");
                                                if(startingNode.parentNode.getAttributeNode("class") != null){
                                                    span.className = startingNode.parentNode.getAttributeNode("class").value;
                                                }

                                                let text = document.createTextNode(content.textContent);
                                                
                                                
                                                //if(startingNode.parentElement.getAttributeNode("class") != null){
    
                                                  //  span.className = startingNode.parentElement.getAttributeNode("class").value;
                                                //}
                                                range.insertNode(p);


                                                p.appendChild(span);
                                                span.appendChild(text);
                                                
    
                                                range.setStartBefore(span.firstChild);
                                                range.setEndBefore(span.firstChild);
                                                selection.removeAllRanges();
                                                selection.addRange(range);
                                                range.detach();
    
    
                                            }
                                            else{
                                                console.warn("We expected a P tag here.");
                                            }
                                        }
                                        else{
                                            //We are somewhere in the middle.
                                            //and we have to take multiple ones with us.
                                            let siblingsToTakeWith = [];
                                            let nextSibling = startingNode.parentNode.nextSibling;

                                            while(nextSibling != null && nextSibling.nodeName == "SPAN"){
                                                siblingsToTakeWith.push(nextSibling);
                                                nextSibling = nextSibling.nextSibling;
                                            }
                                            console.log("We take siblings amount with: " + siblingsToTakeWith.length);


                                            if(startingNode.parentNode.parentNode.nodeName == "P"){
                                                range.setStartAfter(startingNode.parentNode.parentNode);
                                                range.setEndAfter(startingNode.parentNode.parentNode);

                                            }
                                            else{
                                                console.warn("We are expecting a P element here.");
                                            }
                                            let p = document.createElement("P");
                                        
                                        
                                            range.insertNode(p);
                                            range.setStart(startingNode,startingNodeOffset);
                                            range.setEndAfter(startingNode);
                                            let content = range.extractContents();
                                            console.log(content.textContent);
                                            let span = document.createElement("SPAN");
                                            if(startingNode.parentNode.getAttributeNode("class") != null){
                                                span.className = startingNode.parentNode.getAttributeNode("class").value;
                                            }

                                            let text = document.createTextNode(content.textContent);
                                            

                                            p.appendChild(span);
                                            span.appendChild(text);

                                            for(i=0; i < siblingsToTakeWith.length; i++){
                                                p.appendChild(siblingsToTakeWith[i]);
                                            
                                            }

                                            range.setStartBefore(text);
                                            range.setEndBefore(text);
                                            selection.removeAllRanges();
                                            selection.addRange(range);
                                            range.detach();

                                        }
                                    
                                }
                                else{
                                    console.warn("We were expecting a span.");
                                }



                            }


                            






                        }



                    }
                    else{
                        //Check if the node is the last one in the p.
                        //if fully selected create empty p.
                        //otherwise take the rest of the p with.
                        let finalRange = document.createRange();

                        if(destinationNode.nextSibling == null){
                            if(destinationNodeOffset == destinationNode.textContent.length){
                                let p = document.createElement("P");
                                let span = document.createElement("SPAN");
                                let zwsp = document.createTextNode("\u200B");
    
                                finalRange.setStartAfter(destinationNode.parentNode.parentNode);
                                finalRange.setEndAfter(destinationNode.parentNode.parentNode);
                                finalRange.insertNode(p);
                                p.appendChild(span);
                                span.appendChild(zwsp);
                                finalRange.selectNode(zwsp);
                            }
                            else{
                                let p = document.createElement("P");
                                let span = document.createElement("Span");
                                if(destinationNode.parentNode.getAttributeNode("class") != null){
                                    span.className = destinationNode.parentNode.getAttributeNode("class").value;
                                }
                                //we still need to take our siblings.

                                let siblingsToTakeWith = [];
                                            let nextSibling = destinationNode.parentNode.nextSibling;

                                            while(nextSibling != null && nextSibling.nodeName == "SPAN"){
                                                siblingsToTakeWith.push(nextSibling);
                                                nextSibling = nextSibling.nextSibling;
                                            }
                                            console.log("We take siblings amount with: " + siblingsToTakeWith.length);


                                finalRange.setStartAfter(destinationNode.parentNode.parentNode);
                                finalRange.setEndAfter(destinationNode.parentNode.parentNode);
                                finalRange.insertNode(p);
                                p.appendChild(span);
                                finalRange.setStart(destinationNode, destinationNodeOffset);
                                finalRange.setEnd(destinationNode, destinationNode.textContent.length);
                                let content = finalRange.extractContents();
                                let text = document.createTextNode(content.textContent);
                                span.appendChild(text);

                                for(i=0; i < siblingsToTakeWith.length; i++){
                                                p.appendChild(siblingsToTakeWith[i]);
                                            
                                            }

                                finalRange.setStart(text, 0);
                                finalRange.setEnd(text, 0);

                            }
                        }
                       

                        for(i=0; i < textNodes.length; i++){
                        if(textNodes[i] == startingNode){
                            //We handle the starting node.
                            console.log("HANDLE STARTING NODE");
                            console.log("STARTOFFSET: " + startingNodeOffset);
                            console.log("DESTOFFSET: " + destinationNodeOffset);



                            if(startingNodeOffset == 0){
                                //We have the full node.
                                //just delete

                                if(startingNode.parentNode.previousSibling == null && startingNode.parentNode.nextSibling == null){
                                    startingNode.parentNode.parentNode.parentNode.removeChild(startingNode.parentNode.parentNode);
                                }
                                else{
                                    startingNode.parentNode.parentNode.removeChild(startingNode.parentNode);
                                }

                            }
                            else{
                                range.setStart(startingNode, startingNodeOffset);
                                range.setEnd(startingNode, startingNode.textContent.length);
                                range.extractContents();
                            }

                        }
                        
                        else{
                            //We handle the node in the middle.
                            console.log("HANDLE MIDDLE NODE");
                            if(textNodes[i].parentNode.previousSibling == null && textNodes[i].parentNode.nextSibling == null){
                                textNodes[i].parentNode.parentNode.parentNode.removeChild(textNodes[i].parentNode.parentNode);
                            }
                            else{
                                textNodes[i].parentNode.parentNode.removeChild(textNodes[i].parentNode);
                            }

                        }



                        }

                        selection.removeAllRanges();
                        selection.addRange(finalRange);
                        range.detach();
                        finalRange.detach();


                    }



                    



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
                        if(node.firstChild.textContent.length == 1){
                            console.log("Het is alleen een whitespace!");
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
                            else{
                                console.log("Het is een whitespace, maar er zijn meerdere characters.");
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

//HELPER FUNCTIONS FOR SELECTION
function isSelectionBackwards(selection){
    let backwards = false;
    if(selection == null){
        console.log("This is happening?!");
        return backwards;
    }
    if(!selection.Collapsed){
        let range = document.createRange();
        range.setStart(selection.anchorNode, selection.anchorOffset);
        range.setEnd(selection.focusNode, selection.focusOffset);
        backwards = range.collapsed;  
        range.detach();  
    }
    return backwards;
}

function isBadSelection(selection){
    
    let currentNode;
    let destinationNode;
    
    if(isSelectionBackwards(selection)){
        currentNode = selection.focusNode;
        destinationNode = selection.anchorNode;
    }
    //This might be redundant.
    else{
        currentNode = selection.anchorNode;
        destinationNode = selection.focusNode;
    }

    while(!currentNode.isSameNode(destinationNode)){
        //console.log("Loop currentNode: " + currentNode);
        //console.log("Loop currentNodeName: " + currentNode.nodeName);
        //console.log("Loop currentNodeType: " + currentNode.nodeType);
        //If it is inside visualview add it to our ranges.
        if(!visualView.contains(currentNode)){
            console.log("IM NOT INSIDE, so bad selection");
            return true;
            //let tempRange = document.createRange();
            //tempRange.createRange();
            //tempRange.selectNode(currentNode);
            //ranges.push(tempRange);
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
        else if(currentNode.parentNode.parentNode.nextSibling != null){
            currentNode = currentNode.parentNode.parentNode.nextSibling;
        }
        else{
            console.warn("We are going to loop since we don't change the current node. WE NEED TO FIX THIS.");
            //IF THIS STILL OCCURS, we have to fix it in a different way.
            return true;
        }
    }
    return false;

}

//function sleep(ms) {
   // return new Promise(resolve => setTimeout(resolve, ms));
  //}
  //sleep(100).then(() => { range.deleteContents(); });
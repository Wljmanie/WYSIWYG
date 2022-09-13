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

import { Util } from './utils.js';

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
//document.addEventListener('selectionchange', () => {
//    let selection = window.getSelection();
//    //console.log("BADSELECTION?: " + isBadSelection(selection));
//    isBadSelection(selection);
 //   console.log("We finished loop;");
//  });
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
            let node = selection.anchorNode;
            //We should always be in a text node, so lets check for it.
            if(node.nodeName == "#text"){
                //We got nothing selected.
                if(range.collapsed){
                    //We check if we are at the beginning of the Text Node.
                    if(range.startOffset == 0){
                        //We check if we are the beginning of the Paragraph.
                        if(node.parentNode.previousSibling == null){                                    
                            Util.InsertBeforeP(node.parentNode.parentNode);
                            range.detach();
                            return;   
                        }   
                    }
                    //We check if we are at the very end of the Text Node.
                    else if(range.startOffset == node.length){
                        //We check if we are the very end of the Paragraph.
                        if(node.parentNode.nextSibling == null){                    
                            let cursorNode = Util.InsertBeforeP(node.parentNode.parentNode.nextSibling);
                            range.setStart(cursorNode, 0);
                            range.setEnd(cursorNode, 0); 
                            selection.removeAllRanges();
                            selection.addRange(range);                            
                            range.detach();
                            return;          
                        }
                        else{ 
                            let cursorNode = Util.InsertBeforeP(node.parentNode.parentNode.nextSibling, node);
                            range.setStart(cursorNode, 0);
                            range.setEnd(cursorNode, 0);                       
                            selection.removeAllRanges();
                            selection.addRange(range);                            
                            range.detach();
                        }
                    }
                    //We are in the middle of a text node.
                    else{           
                            //We don't have any nodes to move to the new Paragraph.
                        if(node.parentNode.nextSibling == null){                         
                            range.setEnd(node, node.length);
                            let cursorNode = Util.InsertBeforePWithContent(node.parentNode.parentNode.nextSibling, node, range.extractContents());
                            range.setStart(cursorNode, 0);
                            range.setEnd(cursorNode, 0);                       
                            selection.removeAllRanges();
                            selection.addRange(range);                            
                            range.detach();                             
                        }
                            //We have nodes to move to the new Paragraph.
                        else{                              
                            range.setEnd(node, node.length);
                            let cursorNode = Util.InsertBeforePWithContent(node.parentNode.parentNode.nextSibling, node, range.extractContents(), true);                             
                            range.setStart(cursorNode, 0);
                            range.setEnd(cursorNode, 0);
                            selection.removeAllRanges();
                            selection.addRange(range);                            
                            range.detach(); 
                        }       
                    }            
                }
                //We got something selected.
                else{
                    //We select something bad.
                    if(Util.isBadSelection(selection)){
                        alert("Your selection is containing things outside the input box.");
                        return; 
                    }

                    let textNodes = [];
                    let currentNode;
                    let startingNode;
                    let destinationNode;
                    let startingNodeOffset;
                    let destinationNodeOffset;
                    
                    //We check if the selection is from end to start.
                    if(Util.isSelectionBackwards(selection)){
                        currentNode = selection.focusNode;
                        startingNode = selection.focusNode;
                        destinationNode = selection.anchorNode;
                        startingNodeOffset = selection.focusOffset;
                        destinationNodeOffset = selection.anchorOffset;
                    }
                    else{
                        currentNode = selection.anchorNode;
                        startingNode = selection.anchorNode;
                        destinationNode = selection.focusNode;
                        startingNodeOffset = selection.anchorOffset;
                        destinationNodeOffset = selection.focusOffset;
                    }
                    //We grab all the nodes.
                    while(!currentNode.isSameNode(destinationNode)){
                        if(currentNode.nodeName == "#text"){
                            textNodes.push(currentNode);
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
                            return;
                        }
                    }
                    //We need to grab the last node.
                    textNodes.push(currentNode);

                    //We are at the end of the paragraph.
                    if(destinationNode.length == destinationNodeOffset && destinationNode.parentNode.nextSibling == null){
                        let newNode = Util.InsertBeforeP(destinationNode.parentNode.parentNode.nextSibling);                  
                        range.selectNode(newNode);                           
                        selection.removeAllRanges();
                        selection.addRange(range);                            
                        range.detach();                                 
                    }
                    //We have content to move to the new Paragraph.
                    else {
                        if(destinationNode.parentNode.nextSibling == null){
                            //range.extractContents();
                            range.setStart(destinationNode, destinationNodeOffset);
                            range.setEnd(destinationNode, destinationNode.length);
                            let cursorNode = Util.InsertBeforePWithContent(destinationNode.parentNode.parentNode.nextSibling, destinationNode, range.extractContents());                             
                            cursorNode = Util.InsertBeforeP(currentNode.parentNode.parentNode.nextSibling);
                            range.setStart(cursorNode, 0);
                            range.setEnd(cursorNode, 0);
                            selection.removeAllRanges();
                            selection.addRange(range);                            
                            range.detach();     
                        }
                        else{
                            range.setStart(destinationNode, destinationNodeOffset);
                            range.setEnd(destinationNode, destinationNode.length);
                            let cursorNode = Util.InsertBeforePWithContent(destinationNode.parentNode.parentNode.nextSibling, destinationNode, range.extractContents(), true);                             
                            cursorNode = Util.InsertBeforeP(currentNode.parentNode.parentNode.nextSibling);
                            range.setStart(cursorNode, 0);
                            range.setEnd(cursorNode, 0);
                            selection.removeAllRanges();
                            selection.addRange(range);                            
                            range.detach(); 
                        }    
                    }
                    if(textNodes.length == 1){
                        if(startingNodeOffset == 0 && destinationNodeOffset == destinationNode.length){
                            Util.DeleteNode(startingNode);
                        }
                        else{
                            let deleteRange = document.createRange();
                            deleteRange.setStart(startingNode, startingNodeOffset);
                            deleteRange.setEnd(destinationNode, destinationNodeOffset);
                            deleteRange.extractContents();
                            deleteRange.detach();
                        }
                    }
                    else{
                        for(let i = textNodes.length; i > 0; i-- ){
                            //We have our starting node that doesn't need to be deleted comepletly.
                            if(i-1 == 0 && startingNodeOffset != 0){
                                let deleteRange = document.createRange();
                                deleteRange.setStart(startingNode, startingNodeOffset);
                                deleteRange.setEnd(startingNode, startingNode.length);
                                deleteRange.extractContents();
                                deleteRange.detach();
                            }
                            else{
                                Util.DeleteNode(textNodes[i-1]);
                            }  
                        }    
                    }
                }
            }
            else{
                console.warn("Huston we got a problem!");                        
            }
        }
    }
}

//function sleep(ms) {
   // return new Promise(resolve => setTimeout(resolve, ms));
  //}
  //sleep(100).then(() => { range.deleteContents(); });
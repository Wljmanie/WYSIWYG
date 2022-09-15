export class Util{
     
    static visualView = document.getElementById("visualview");

    static CreateP(content = null){
        let p = document.createElement("P");
        let span = document.createElement("SPAN");
        span.classList.add("comment");
        if(content == null){
            let zwsp = document.createTextNode("\u200B");
            span.appendChild(zwsp);
        }
        else{
            let contentNode = document.createTextNode(content.textContent);
            span.appendChild(contentNode);
        }
        p.appendChild(span);
        return p;
    }

    static InsertBeforeP(target, node = null){
        let p = this.CreateP();
        this.visualView.insertBefore(p,target);

        if(node != null){          
            this.MoveNodes(p,node);   
        }  
        //We return the first text node of the newly formed paragraph.
        return p.firstChild.firstChild;
    }

    static InsertBeforePWithContent(target, node, content, doMoveNodes = false){
        let p = this.CreateP(content);
        this.visualView.insertBefore(p, target);
        
        node.parentNode.classList.forEach(function (c){
            if(!p.firstChild.classList.contains(c)){
                p.firstChild.classList.add(c);
            }
        });
        
        if(doMoveNodes){
            this.MoveNodes(p,node);      
        }
        return p.firstChild.firstChild;
    }

    static MoveNodes(p, node){
        let nextSibling = node.parentNode.nextSibling;
        let nodesToMove = [];
        while(nextSibling != null && nextSibling.nodeName == "SPAN"){
            nodesToMove.push(nextSibling);
            nextSibling = nextSibling.nextSibling;
        }
        for(let i=0; i < nodesToMove.length; i++){
            p.appendChild(nodesToMove[i]);
        }
    }

    static DeleteNode(node){
        if(node.parentNode.nextSibling == null && node.parentNode.previousSibling == null){
            console.log("WE ARE LAST SPAN.");
            if(node.parentNode.parentNode.previousSibling == null && node.parentNode.parentNode.nextSibling == null  ){
                console.log("We are last P");
                console.warn("We still have to implement this//Should never been the case.");
                let p = this.CreateP();
                node.parentNode.parentNode.parentNode.appendChild(p);
                node.parentNode.parentNode.parentNode.removeChild(node.parentNode.parentNode);
                //Maybe we need to fix out selection to test.
            }
            else{
                
                console.log("We are not the last P");
                
                node.parentNode.parentNode.parentNode.removeChild(node.parentNode.parentNode);
                
                
            }

        }
        else{
            console.log("We are not the last SPAN");
                

                node.parentNode.parentNode.removeChild(node.parentNode);
        }
    }

    static CheckForMergingSpans(node1, node2){
        console.log("We check.");
        let weMerge = true;
        if(node1 != null && node2 != null){
            if(node1.classList.length == node2.classList.length){
                node1.classList.forEach(function (c){
                    if(!node2.classList.contains(c)){
                        weMerge = false;
                    }
                });
            }
            else{
                weMerge = false;
            }
        }
        else{
            weMerge = false;
        }
        if(weMerge){
            node1.firstChild.textContent += node2.firstChild.textContent;
            this.DeleteNode(node2.firstChild);
        }  
    }

    static MergeP(node1, node2){
        let nextSibling = node2.firstChild;
        let nodesToMove = [];
        while(nextSibling != null && nextSibling.nodeName == "SPAN"){
            nodesToMove.push(nextSibling);
            nextSibling = nextSibling.nextSibling;
        }
        for(let i=0; i < nodesToMove.length; i++){
            node1.appendChild(nodesToMove[i]);
        }
        node2.parentNode.removeChild(node2);
    }

    static isBadSelection(selection){
    
        let currentNode;
        let destinationNode;
        
        if(this.isSelectionBackwards(selection)){
            currentNode = selection.focusNode;
            destinationNode = selection.anchorNode;
        }
        else{
            currentNode = selection.anchorNode;
            destinationNode = selection.focusNode;
        }
    
        while(!currentNode.isSameNode(destinationNode)){
            if(!this.visualView.contains(currentNode)){
                return true;       
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
                return true;
            }
        }
        return false;
    }

    static isSelectionBackwards(selection){
        let backwards = false;
        if(selection == null){
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
}

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

    static InsertBeforeP(target){
        this.visualView.insertBefore(this.CreateP(),target);
    }

    static InsertAfterP(target, node = null){
        let p = this.CreateP();
        this.visualView.insertBefore(p,target);

        if(node != null){          
            this.MoveNodes(p,node);   
        }  
        //We return the first text node of the newly formed paragraph.
        return p.firstChild.firstChild;
    }

    static InsertAfterPWithContent(target, node, content, doMoveNodes = false){
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
}

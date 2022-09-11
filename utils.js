export class Util{
     
    static visualView = document.getElementById("visualview");

    static CreateEmptyP(){
        let p = document.createElement("P");
        let span = document.createElement("SPAN");
        span.classList.add("comment");
        let zwsp = document.createTextNode("\u200B");
        p.appendChild(span);
        span.appendChild(zwsp);
        return p;
    }

    static InsertBeforeP(target){
        this.visualView.insertBefore(this.CreateEmptyP(),target);
    }

    static InsertAfterP(target, textNode = null, moveNodes = false){
        let p = this.CreateEmptyP();
        this.visualView.insertBefore(p,target);

        if(!moveNodes){          
            //We return the text node of the empty white space.
            return p.firstChild.firstChild;
        }
        else{
            let nextSibling = textNode.parentNode.nextSibling;
            let nodesToMove = [];
            while(nextSibling != null && nextSibling.nodeName == "SPAN"){
                nodesToMove.push(nextSibling);
                nextSibling = nextSibling.nextSibling;
            }
            for(let i=0; i < nodesToMove.length; i++){
                p.appendChild(nodesToMove[i]);
            }
            //We return the first text node of the newly formed paragraph.
            return p.firstChild.firstChild;
        }
    }
}

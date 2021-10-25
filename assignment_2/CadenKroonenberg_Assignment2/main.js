// Author: Caden Kroonenberg
// Date: 08-31-21

class Group {
    constructor() {
        // Store elements in array. Initialize as empty array
        this.elements = [];
    }
    add(element) {
        if(!this.has(element)) { // check if element already exists in group
            this.elements.push(element); // add element to elements array
        }
    }
    delete(element) {
        if (this.has(element)) { // check if element exists in group
            for (var i = 0; i < this.elements.length; i++) { // iterate through array to find element
                if (this.elements[i] === element) { // only remove parameter element
                    this.elements.splice(i, 1); 
                    return; // end iteration after removing element
                }
            }
        }
    }
    has(element) {
        return this.elements.includes(element); // return true if element is in elements array
    }
    union(group) {
        let union = new Group();
        for(var i = 0; i < this.elements.length; i++) { // add all elements from this group's elements
            union.add(this.elements[i]);
        }
        for (var i = 0; i < group.elements.length; i++) { // iterate through parameter group
            if (!union.has(group.elements[i])) { // only add elements if they aren't already in union
                union.add(group.elements[i]); // add element to union
            }
        }
        return union;
    }
    intersection(group) {
        let intersection = new Group();
        for(let i = 0; i < this.elements.length; i++) { // iterate through this group's elements
            if(group.has(this.elements[i])) { // check if parameter group has elements in this group's elements array
                intersection.add(this.elements[i]); // add element to intersection
            }
        }
        return intersection;
    }
    difference (group) {
        let difference = new Group()
        for(let i = 0; i < this.elements.length; i++) { // iterate through this group's elements
            if(!group.has(this.elements[i])) { // check if parameter group doesn't have elements in this group's elements array
                difference.add(this.elements[i]); // add element to difference
            }
        }
        return difference;
    }
}

let group1 = new Group();
let group2 = new Group();
group1.add(1);
group1.add(2);
group1.add(3);
console.log(group1);
group2.add(2);
group2.add(3);
group2.add(5);
group2.add(2);
console.log(group2);
console.log(group1.has(5));
console.log(group2.has(3));
console.log(group1.union(group2));
console.log(group1.intersection(group2));
console.log(group1.difference(group2));
group1.delete(1);
console.log(group1);
group2.delete(1);
console.log(group2);
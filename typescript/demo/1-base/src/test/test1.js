class Person {
  //name;

  constructor(name) {
    this.name = name;
  }

  print() {
    console.log(this.name);
  }
}

let p1 = new Person("haha");
p1.print();

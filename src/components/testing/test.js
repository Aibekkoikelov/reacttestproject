

const arr = [1, 3, 5, 12, 43];   

for (let i = 0; i < 100; i++){
   if (arr[i] > 5) {
      console.log(arr[i]);
      
   }
   else {
      console.log("не то число");
      
   }
   
}



arr.forEach((item, i) => {
   if (item > 5) {
     console.log(item, i);
     
  }
   
})

const obj = {
   name: "aibek"
}


///  имя массива.forEach(item => { происходит действие})

// () => {}




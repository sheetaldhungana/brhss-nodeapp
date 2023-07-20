//file system
const fs= require('fs') //importing file system package from node25
const { mainModule } = require('process')
fs.readFile('./docs/datAa.text',(error,data)=>{
    if(error){
        console.log(error)
        return
    }
    console.log(data.toString())
})
//Write file to storage
fs.writeFile('./docs/example.txt', 'This is written fromn node js.',()=>{
    console.log('success.....')
})

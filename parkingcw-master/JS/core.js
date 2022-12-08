
class Entry{
    constructor(owner,car,licensePlate,entryDate,exitDate){
        this.owner = owner;
        this.car = car;
        this.licensePlate = licensePlate;
        this.entryDate = entryDate;
        this.exitDate = exitDate;
    }
}

class UI{
    static displayEntries(){
   
        const entries = Store.getEntries();
        entries.forEach((entry) => UI.addEntryToTable(entry));
    }
    static addEntryToTable(entry){
        const tableBody=document.querySelector('#tableBody');
        const row = document.createElement('tr');
        row.innerHTML = `   <td>${entry.owner}</td>
                            <td>${entry.car}</td>
                            <td>${entry.licensePlate}</td>
                            <td>${entry.entryDate}</td>
                            <td>${entry.exitDate}</td>
                            <td><button class="btn btn-info delete">X</button></td>
                        `;
        tableBody.appendChild(row);
    }
    static clearInput(){
   
        const inputs = document.querySelectorAll('.form-control');
      
        inputs.forEach((input)=>input.value="");
    }
    static deleteEntry(target){
        if(target.classList.contains('delete')){
            target.parentElement.parentElement.remove();
        }
    }
    static showAlert(message,className){
        const div = document.createElement('div');
        div.className=`alert alert-${className} w-50 mx-auto`;
        div.appendChild(document.createTextNode(message));
        const formContainer = document.querySelector('.form-container');
        const form = document.querySelector('#entryForm');
        formContainer.insertBefore(div,form);
        setTimeout(() => document.querySelector('.alert').remove(),3000);
    }
    static validateInputs(){
        const owner = document.querySelector('#owner').value;
        const car = document.querySelector('#car').value;
        const licensePlate = document.querySelector('#licensePlate').value;
        const entryDate = document.querySelector('#entryDate').value;
        const exitDate = document.querySelector('#exitDate').value;        
        var licensePlateRegex = /^(?:[A-Z]{2}-\d{2}-\d{2})|(?:\d{2}-[A-Z]{2}-\d{2})|(?:\d{2}-\d{2}-[A-Z]{2})$/;
        if(owner === '' || car === '' || licensePlate === '' || entryDate === '' || exitDate === ''){
            UI.showAlert('Todos los campos deben ser completados!','danger');
            return false;
        }
        if(exitDate < entryDate){
            UI.showAlert('La fecha de salida no puede ser inferior a la fecha de entrada','danger');
            return false;
        }
           
        return true;
    }
}

class Store{
    static getEntries(){
        let entries;
        if(localStorage.getItem('entries') === null){
            entries = [];
        }
        else{
            entries = JSON.parse(localStorage.getItem('entries'));
        }
        return entries;
    }
    static addEntries(entry){
        const entries = Store.getEntries();
        entries.push(entry);
        localStorage.setItem('entries', JSON.stringify(entries));
    }
    static removeEntries(licensePlate){
        const entries = Store.getEntries();
        entries.forEach((entry,index) => {
            if(entry.licensePlate === licensePlate){
                entries.splice(index, 1);
            }
        });
        localStorage.setItem('entries', JSON.stringify(entries));
    }
}
    document.addEventListener('DOMContentLoaded',UI.displayEntries);

    document.querySelector('#entryForm').addEventListener('submit',(e)=>{
        e.preventDefault();
        
        
        const owner = document.querySelector('#owner').value;
        const car = document.querySelector('#car').value;
        const licensePlate = document.querySelector('#licensePlate').value;
        const entryDate = document.querySelector('#entryDate').value;
        const exitDate = document.querySelector('#exitDate').value;
        if(!UI.validateInputs()){
            return;
        }
      
        const entry = new Entry(owner, car, licensePlate, entryDate, exitDate);
        
        UI.addEntryToTable(entry);
        Store.addEntries(entry);
        
        UI.clearInput();

        UI.showAlert('Coche agregado con éxito al estacionamiento','success');

    });

    document.querySelector('#tableBody').addEventListener('click',(e)=>{
        
        UI.deleteEntry(e.target);
    
        var licensePlate = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
        
        Store.removeEntries(licensePlate);
        
        UI.showAlert('Coche eliminado con éxito de la lista de estacionamiento','success');
    })


    document.querySelector('#searchInput').addEventListener('keyup', function searchTable(){
        
        const searchValue = document.querySelector('#searchInput').value.toUpperCase();
       
        const tableLine = (document.querySelector('#tableBody')).querySelectorAll('tr');
       
        for(let i = 0; i < tableLine.length; i++){
            var count = 0;
           
            const lineValues = tableLine[i].querySelectorAll('td');
            
            for(let j = 0; j < lineValues.length - 1; j++){
              
                if((lineValues[j].innerHTML.toUpperCase()).startsWith(searchValue)){
                    count++;
                }
            }
            if(count > 0){
                //Si alguna columna contiene el valor de búsqueda, el bloque de visualización
                tableLine[i].style.display = '';
            }else{
                //De lo contrario mostrar ninguno 
                tableLine[i].style.display = 'none';
            }
        }
    });
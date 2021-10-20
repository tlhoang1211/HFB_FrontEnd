

var listStudent = document.querySelector('#list-student');
var studentAPI = 'http://localhost:8080/api/v1/students';
function start(){
    getStudent(function(students){
        renderStudent(students);
    });

    // handleCreateForm();
};
start();


// GET
function getStudent(callback){
    fetch(studentAPI)
        .then(response => response.json())
        .then(callback)
        .catch(function(error){
            console.log(error);
        });
};


function renderStudent(students){
    
    var htmls = students.map(function(student){
        return `
            
                    <tr class="student-item-${student.rollNumber}">
                        <td>${student.rollNumber}</td>
                        <td>${student.fullName}</td>
                        <td>${student.email}</td>
                        <td>${student.createdAt}</td>
                        <td>${student.status}</td>
                        <td><button onclick="handleUpdateForm('${student.rollNumber}')">Edit</button></td>
                        <td><button onclick="handleDeleteStudent('${student.rollNumber}')">Delete</button></td>
                    </tr>
        `
    })
    listStudent.innerHTML = htmls.join('');
}
                
// CREATE
// function handleCreateForm(){
//     var createBtn = document.querySelector('#create');

//     createBtn.onclick = function(){
//         var rollNumber = document.querySelector('input[name="rollNumber"]').value;
//         var fullName = document.querySelector('input[name="fullName"]').value;
//         var address = document.querySelector('input[name="address"]').value;
//         var email = document.querySelector('input[name="email"]').value;
//         var password = document.querySelector('input[name="password"]').value;
//         var phone = document.querySelector('input[name="phone"]').value;
//         var introduction = document.querySelector('input[name="introduction"]').value;
        
//         var formData = {
//             'rollNumber': rollNumber,
//             'fullName': fullName,
//             'address': address,
//             'email': email,
//             'password': password,
//             'phone': phone,
//             'introduction': introduction
//         }
//         // Load list again
//         createStudent(formData, function(){
//             getStudent(renderStudent);
//         });
//     }
// }

// function createStudent(data, callback){
//     var options = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     };
//     fetch(studentAPI, options)
//         .then(response => response.json())
//         .then(callback)
//         .catch(function(error){
//             console.log(error);
//             getStudent(renderStudent);
//         });
// }

// //DELETE
// function handleDeleteStudent(rollNumber){
//     var options = {
//         method: 'DELETE',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     };
//     fetch(studentAPI + '/' + rollNumber, options)
//         .then(function(response){
//             return response.json();
//         })
//         .then(function(){
//             console.log("da den day");
//             getStudent(renderStudent);
//         })
//         .catch(function(error){
//             getStudent(renderStudent);
//             console.log(error);
//         });
// }

// //UPDATE
// function handleUpdateForm(rollNumber){
//     var rollnumber = document.querySelector('input[name="rollNumber"]');
//     var fullName = document.querySelector('input[name="fullName"]');
//     var address = document.querySelector('input[name="address"]');
//     var email = document.querySelector('input[name="email"]');
//     var password = document.querySelector('input[name="password"]');
//     var phone = document.querySelector('input[name="phone"]');
//     var introduction = document.querySelector('input[name="introduction"]');

//     var createBtn = document.querySelector('#create');

//     // Get data in input & rename button
//     getStudent(function(students){
//         students.map(function(student){
//             if(student.rollNumber === rollNumber){
//                 rollnumber.value = student.rollNumber;
//                 fullName.value = student.fullName;
//                 address.value = student.address;
//                 email.value = student.email;
//                 password.value = student.password;
//                 phone.value = student.phone;
//                 introduction = student.introduction;
//             }
//         })
//     })
    
//     createBtn.innerHTML = 'Update';
    
//     // Update data
//     createBtn.onclick = function(){
        
//         var formData = {
//             'rollNumber': rollnumber.value,
//             'fullName': fullName.value,
//             'address': address.value,
//             'email': email.value,
//             'password': password.value,
//             'phone': phone.value,
//             'introduction': introduction.value
//         }

//         rollnumber.value = '';
//         fullName.value = '';
//         address.value = '';
//         email.value = '';
//         password.value = '';
//         phone.value = '';
//         introduction.value = '';
//         createBtn.innerHTML = 'Create';
//         // Load list again
//         updateStudent(rollNumber, formData, function(){
//             getStudent(renderStudent);
//         });
//     }
// }

// function updateStudent(rollNumber, data, callback){
//     var options = {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     };
//     fetch(studentAPI + '/' + rollNumber, options)
//         .then(response => response.json())
//         .then(callback)
//         .catch(function(error){
//             getStudent(renderStudent);
//             console.log(error);
//         });
// }


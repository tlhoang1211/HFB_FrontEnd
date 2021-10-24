"use strict";
var cookie = document.cookie;
console.log(document.cookie);
// Validator register
Validator({
  form: "#addneworder",
  formGroupSelector: ".form-group",
  errorSelector: ".form-message",
  rules: [
    Validator.isRequired("#nameFood", "Food name is required!"),
    // Validator.isRequired('#imageFoods', 'Image is required!'),
    Validator.isRequired("#category", "Category is required!"),
    Validator.isRequired("#manufactureDate", "Manufacture Date is required!"),
    Validator.isRequired("#expirationDate", "Expiration Date is required!"),
    Validator.isRequired("#description", "Description is required!"),
  ]
});

document.getElementById("newFood").addEventListener("click", function(){
    var nameFood = document.getElementById("nameFood").value;
    var category = document.getElementById("category").value;
    var manufactureDate = document.getElementById("manufactureDate").value;
    
    var expirationDate = document.getElementById("expirationDate").value;
    if (manufactureDate){
        manufactureDate = getTimeFromString(manufactureDate);
    }
    if (expirationDate){
        expirationDate = getTimeFromString(manufactureDate);
    } else {
        $('.alert-danger').alert();
        return false;
    }
    if (expirationDate && manufactureDate) {
        if (manufactureDate > expirationDate) {
            $('.alert-danger').alert();
            return false;
        }
    }
    var description = document.getElementById("description").value;
    var dataPost = {
        name: nameFood || '',
        avatar: "v1633966671/hanoi_food_bank_project/uploaded_food/Rice/fried_rice_xhdufj.jpg",
        images: "v1633966671/hanoi_food_bank_project/uploaded_food/Rice/fried_rice_xhdufj.jpg",
        manufactureDate: document.getElementById("manufactureDate").value,
        expirationDate: document.getElementById("expirationDate").value,
        createdBy: 2,
        categoryId: parseInt(category),
        description: description
    }
        fetch('https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${cookie}`
            },
            body: JSON.stringify(dataPost)
        })
        .then(response => response.json())
        .then(function(data){
            console.log(data)
        })
        .catch(function(error){
            console.log(error);
        });
}, false);

var myWidget = cloudinary.createUploadWidget(
  {
    cloudName: "vernom",
    uploadPreset: "fn5rpymu",
    form: "#edit-account-form",
    folder: "hanoi_food_bank_project/users_avatar",
    fieldName: "thumbnails[]",
    thumbnails: ".thumbnails",
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      var arrayThumnailInputs = document.querySelectorAll(
        'input[name="thumbnails[]"]'
      );
      for (let i = 0; i < arrayThumnailInputs.length; i++) {
        arrayThumnailInputs[i].value = arrayThumnailInputs[i].getAttribute(
          "data-cloudinary-public-id"
        );
      }
    }
  }
);

document.getElementById("upload_widget").addEventListener("click", function () {
    myWidget.open();
  },
  false
);

$("body").on("click", ".cloudinary-delete", function () {
  var splittedImg = $(this).parent().find("img").attr("src").split("/");
  var imgName =
    splittedImg[splittedImg.length - 3] +
    "/" +
    splittedImg[splittedImg.length - 2] +
    "/" +
    splittedImg[splittedImg.length - 1];
  var publicId = $(this).parent().attr("data-cloudinary");
  $(this).parent().remove();
  $(`input[data-cloudinary-public-id="${imgName}"]`).remove();
});

// hiennv 24/10

function onAddClassActive(e, className, parent){
  var listAction = document.getElementsByClassName(className);
  if (listAction && listAction.length > 0) {
    for (let index = 0, len = listAction.length; index < len; index++) {
      var element = listAction[index];
      element.classList.remove('active');
    }
  }
  if (parent) {
    e.parentElement.classList.add("active");
  } else {
    e.classList.add("active");
  }
}
function showTabPanel(e) {
  var listAction = document.getElementsByClassName('tab-account');
  if (listAction && listAction.length > 0) {
    for (var index = 0, len = listAction.length; index < len; index++) {
      var element = listAction[index];
      element.classList.add('d-none');
      element.classList.remove('active');
    }
  }
  var listPanel = document.getElementsByClassName('tab-pane');
  if (listPanel && listPanel.length > 0) {
    for (var index = 0, len = listPanel.length; index < len; index++) {
      var element = listPanel[index];
      element.classList.remove('active');
    }
  }
  switch (e){
    case 'myaccount':
      document.getElementsByClassName('profile')[0].classList.add('active');
      document.getElementById('profile').classList.add('active');
      document.getElementsByClassName('profile')[0].classList.remove('d-none');
      break;
    case 'myfood':
      document.getElementsByClassName('addFood')[0].classList.add('active');
      document.getElementById('addFood').classList.add('active');
      document.getElementsByClassName('addFood')[0].classList.remove('d-none');
      document.getElementsByClassName('listFood')[0].classList.remove('d-none');
      break;
    case 'myrequest':
      document.getElementsByClassName('listRequest')[0].classList.add('active');
      document.getElementById('listRequest').classList.add('active');
      document.getElementsByClassName('listRequest')[0].classList.remove('d-none');
      document.getElementsByClassName('detailRequest')[0].classList.remove('d-none');
      break;
    case 'myfeedback':
      document.getElementsByClassName('feedback')[0].classList.add('active');
      document.getElementById('feedback').classList.add('active');
      document.getElementsByClassName('feedback')[0].classList.remove('d-none');
      break;
    default:
      break;
  }
}


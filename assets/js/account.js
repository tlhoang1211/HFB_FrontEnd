"use strict"
var cookie = document.cookie;
console.log(document.cookie)

// Validator register
Validator({
    form: '#addneworder',
    formGroupSelector: '.form-group',
    errorSelector: '.form-message',
    rules: [
        Validator.isRequired('#nameFood', 'Food name is required!'),
        // Validator.isRequired('#imageFoods', 'Image is required!'),
        Validator.isRequired('#category', 'Category is required!'),
        Validator.isRequired('#manufactureDate', 'Manufacture Date is required!'),
        Validator.isRequired('#expirationDate', 'Expiration Date is required!'),
        Validator.isRequired('#description', 'Description is required!')
    ],
    // onSubmit: function(data){
    //     // Call API
    //     console.log(data);
    // }
});

document.getElementById("newFood").addEventListener("click", function(){
    console.log(document.getElementById("nameFood").value)
    var nameFood = document.getElementById("nameFood").value;
    var category = document.getElementById("category").value;
    var manufactureDate = document.getElementById("manufactureDate").value;
    manufactureDate
    var expirationDate = document.getElementById("expirationDate").value;
    if (expirationDate) {

    } else {

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
      console.log("Done! Here is the image info: ", result.info.url);
      var arrayThumnailInputs = document.querySelectorAll(
        'input[name="thumbnails[]"]'
      );
      for (let i = 0; i < arrayThumnailInputs.length; i++) {
        arrayThumnailInputs[i].value = arrayThumnailInputs[i].getAttribute(
          "data-cloudinary-public-id"
        );
      }
      console.log(arrayThumnailInputs);
    }
  }
);

document.getElementById("upload_widget").addEventListener(
  "click",
  function () {
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
  console.log(imgName);
  var publicId = $(this).parent().attr("data-cloudinary");
  $(this).parent().remove();
  $(`input[data-cloudinary-public-id="${imgName}"]`).remove();
});

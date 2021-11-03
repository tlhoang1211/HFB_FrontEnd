$(document).ready(function () {
    Notification.config();
});
var listImageFood = [];
// food
var myWidgetFood = cloudinary.createUploadWidget(
    {
        cloudName: "vernom",
        uploadPreset: "fn5rpymu",
        form: "#new-food-form",
        folder: "hanoi_food_bank_project/uploaded_food",
        fieldName: "thumbnails[]",
        thumbnails: ".thumbnails",
    },
    (error, result) => {
        if (!error && result && result.event === "success") {
            listImageFood.push(result.info.path);
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
  
document.getElementById("upload_image_food").addEventListener("click", function () {
        myWidgetFood.open();
    },
    false
);
  
  // delete image
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

// save food
function saveFood(){
    var name = document.getElementById("nameFood").value;
    var categoryId = document.getElementById("category").value;
    var expirationDate = document.getElementById("expirationDate").value;
    var description = document.getElementById("description").value;
    if (!expirationDate) {
        $(".alert-danger").alert();
        return false;
      }
      if (listImageFood.length == 0) {
        $(".alert-danger").alert();
        return false;
      }
    
    var dataPost = {
        name: name,
        avatar: listImageFood[0],
        images: listImageFood.join(","),
        expirationDate: expirationDate,
        createdBy: objAccount.id,
        categoryId: categoryId,
        description: description
    }
    getConnectAPI('POST', 'https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods', JSON.stringify(dataPost), function(result){
        if (result && result.status == 200) {
            goBack('food', 'food');
        }
    },
        function(errorThrown){}
    );
}
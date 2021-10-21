// var cloudinary_url = 'https://api.cloudinary.com/v1_1/vernom/image/upload';
// var cloudinary_upload = 'ml_default';
// var imgPreview = document.getElementById('avatar_account');
// var fileUpload = document.getElementById('upload_widget');

// fileUpload.addEventListener("change", function(e){
//     var file = e.target.files[0];
//     var formData = new FormData();
//     formData.append("file", file);
//     console.log(formData)
//     formData.append("upload_preset", cloudinary_upload);
//     console.log(formData)
//     $.ajax({
//         url : cloudinary_url,
//         type : "post",
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             'Access-Control-Allow-Origin': '*'
//         },
//         crossDomain: true,
//         dataType:"json",
//         contentType: false,
//         processData: false,
//         data : formData,
//         success : function (result){
//             console.log(result)
//         }
//     });
// }, false);


var myWidget = cloudinary.createUploadWidget({	
    cloudName: 'vernom',
    uploadPreset: 'fn5rpymu'
    },
    (error, result) => {
        if (!error && result && result.event === "success") {
            var imgPreview = document.getElementById('avatar_account');
            imgPreview.src = result.info.secure_url;
        }
    }
)

document.getElementById("upload_widget").addEventListener("click", function(){
    myWidget.open();
}, false);

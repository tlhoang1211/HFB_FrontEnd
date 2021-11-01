// hoangtl2 - 01/11/2021 - food list pagination on account page
// start
var foodCount = 0;
var requestCount = 0;

var objAccount = null;

function initPageAccount() {
  getAccount();
}
initPageAccount();

// get data user
function getAccount() {
  fetch(`https://hfb-t1098e.herokuapp.com/api/v1/hfb/users/${currentName}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${isToken}`,
    },
  })
    .then((response) => response.json())
    .then((account) => {
      if (account && account.data) {
        objAccount = account.data;
        getListRequest(objAccount.id);
        // console.log(objAccount.id);
        bindDataAccount(account.data);
      }
    })
    .catch((error) => console.log(error));
}

function bindDataAccount(data) {
  document.querySelector("#account_id").value = data.id;
  document.querySelector("#account_name").value = data.name;
  document.querySelector("#account_phone").value = data.phone;
  document.querySelector("#account_email").value = data.email;
  document.querySelector("#account_address").value = data.address;
  document.querySelector(".name-account").innerHTML = data.name;
  document.querySelector("#avatar_account").src =
    data.avatar ||
    "https://thumbs.dreamstime.com/b/user-icon-trendy-flat-style-isolated-grey-background-user-symbol-user-icon-trendy-flat-style-isolated-grey-background-123663211.jpg";
  document.querySelector("#avatar_account").parentElement.href =
    data.avatar ||
    "https://thumbs.dreamstime.com/b/user-icon-trendy-flat-style-isolated-grey-background-user-symbol-user-icon-trendy-flat-style-isolated-grey-background-123663211.jpg";
}

var foodDataTable = document.getElementById("food-data-table");

var foodListAPI =
  "https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/search?status=2";

function getListFood() {
  fetch(foodListAPI, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((listItems) => {
      renderListFood(listItems.data.content);
    })
    .catch((error) => console.log(error));
}
getListFood();

function renderListFood(listFood) {
  let container = $(".pagination1");
  container.pagination({
    dataSource: listFood,
    pageSize: 5,
    showGoInput: true,
    showGoButton: true,
    formatGoInput: "go to <%= input %>",
    callback: function (data, pagination) {
      var dataHtml = "<div>";
      $.each(data, function (index, e) {
        foodCount++;
        dataHtml +=
          `<tr id="food-row-${e.id}">
        <td>${e.id}</td>
        <td>${e.name || ""}</td>
        <td><img src="https://res.cloudinary.com/vernom/image/upload/${
          e.avatar
        }" style="width: 30px;height: 30px;"/></td>
        <td>${formatCategory(e.categoryId)}</td>
        <td>${e.expirationDate}</td>
        <td>${e.createdAt}</td>
        <td>${
          e.status == 0 ? "deactive" : e.status == 1 ? "pending" : "active"
        }</td>
        <td onclick="formUpdateFood(${e.id})"><i class="fa fa-pencil-square-o"></i></td>` +
          `<td onclick=confirmDeleteFood(${e.id})><i class="fa fa-trash-o"></i></td></tr>`;
      });

      dataHtml += "</div>";
      $("#list-food").html(dataHtml);
    },
  });

  if (foodCount == 0) {
    foodDataTable.style.display = "none";
    document.getElementById("no-food-noti").removeAttribute("style");
    document
      .getElementById("center-noti")
      .setAttribute("style", "text-align: center;");
  }
}
//end

// hoangtl2 - 01/11/2021 - food list pagination on account page
// start
// update food

var editImageFood = document.querySelector('.view-image-product');
var editInfoFood = document.querySelector('.view-info-product');
var editContentDesFood = document.querySelector('.view-info-des-content');
var editUser = document.querySelector('.editUser');
var listFood = document.querySelector('.listFood');
var listFoodPagination = document.querySelector('.listFoodPagination');
editUser.style.display = 'none';
function formUpdateFood(id) {
  editUser.style.display = 'block';
  listFood.style.display = 'none';
  listFoodPagination.style.display = 'none';
  var getDetailFood = `https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/${id}`;
  fetch(getDetailFood, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then(response => response.json())
  .then(foodInfo => {
    var htmls = `
      <div class="row multi-columns-row" >
        <div class="slider-image">
          <div class="slider-info-food">
            <img src="https://res.cloudinary.com/vernom/image/upload/${foodInfo.data.avatar}" style="width:100%; max-height: 450px">
          </div>
        </div>
      </div>
    `;

    var htmlsInfoProduct = `
      <div class="row">
        <div class="col-sm-12">
          <h3 class="product-title font-alt">${foodInfo.data.name}</h6>
        </div>
      </div>
      <div class="row mb-20">
        <div class="col-sm-12">
          <p style="font-size: 12px; color: #000; margin: 0;">Expiration Date: ${foodInfo.data.expirationDate}</p>
        </div>
      </div>
      <div class="row mb-20">
        <div class="col-sm-12">
          <div class="product_meta">Categories:<a href="#"> ${foodInfo.data.category}</a>
          </div>
        </div>
      </div>
    `;

    var htmlsDes = `
    <div class="row multi-columns-row" >
    <div class="col-sm-12" style="padding: 0;">
      <p>Description: ${foodInfo.data.description}</p>
    </div>
    </div>
    <div class="row multi-columns-row" >
      <div class="col-sm-12" style="padding: 0;">
        <p>Content: ${foodInfo.data.content}</p>
      </div>
    </div>
    `

    editImageFood.innerHTML = htmls;
    editInfoFood.innerHTML = htmlsInfoProduct;
    editContentDesFood.innerHTML = htmlsDes;
  })
  .catch((error) => console.log(error));
}

function backToList(){
  editUser.style.display = 'none';
  listFood.style.display = 'block';
  listFoodPagination.style.display = 'block';
}

// validate form
$("#editformEdit").validate({
  onfocusout: false,
  onkeyup: false,
  onclick: false,
  rules: {
    nameFoodEdit: {
      // name element not id
      required: true,
    },
    categoryEdit: {
      required: true,
    },
    expirationDateEdit: {
      required: true,
    },
    descriptionEdit: {
      required: true,
    },
    contentEdit: {
      required: true,
    },
  },
  messages: {
    nameFoodEdit: {
      required: "Please provide name food.",
    },
    categoryEdit: {
      required: "Please choose category.",
    },
    expirationDateEdit: {
      required: "Please provide expiration date.",
    },
    descriptionEdit: {
      required: "Please provide description.",
    },
    contentEdit: {
      required: "Please provide content.",
    },
  },
});

function newFoodEdit(){
  var nameFood = document.getElementById("nameFoodEdit").value;
  var category = document.getElementById("categoryEdit").value;
  var expirationDate = document.getElementById("expirationDateEdit").value;
  var description = document.getElementById("descriptionEdit").value;
  var content = document.getElementById("contentEdit").value;

  if (!nameFood == false && !category == false && !expirationDate == false && !description == false && !content == false) {
    if (listImageFood.length == 0) {
      swal("Warning!", "You need more image!", "warning");
    } else if (listImageFood.length > 3) {
      swal("Warning!", "You should only add a maximum of 3 images!", "warning");
      console.log(listImageFood.length);
    } else {}
  }
}

// food
var myWidgetFood = cloudinary.createUploadWidget(
  {
    cloudName: "vernom",
    uploadPreset: "fn5rpymu",
    form: "#editformEdit",
    folder: "hanoi_food_bank_project/uploaded_food",
    fieldName: "thumbnailsFoodEdit[]",
    thumbnails: ".thumbnailsFoodEdit",
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      listImageFood.push(result.info.path);
      var arrayThumnailInputs = document.querySelectorAll(
        'input[name="thumbnailsFoodEdit[]"]'
      );
      for (let i = 0; i < arrayThumnailInputs.length; i++) {
        arrayThumnailInputs[i].value = arrayThumnailInputs[i].getAttribute(
          "data-cloudinary-public-id"
        );
      }
    }
  }
);

document.getElementById("upload_image_foodEdit").addEventListener(
  "click",
  function () {
    myWidgetFood.open();
  },
  false
);

$("body").on("click", ".cloudinary-delete-edit", function () {
  var splittedImg = $(this).parent().find("img").attr("src").split("/");
  var imgName =
    splittedImg[splittedImg.length - 3] +
    "/" +
    splittedImg[splittedImg.length - 2] +
    "/" +
    splittedImg[splittedImg.length - 1];
  var publicId = $(this).parent().attr("data-cloudinary");
  $(this).parent().remove();
  var imgName2 =
    splittedImg[splittedImg.length - 4] +
    "/" +
    splittedImg[splittedImg.length - 3] +
    "/" +
    splittedImg[splittedImg.length - 2] +
    "/" +
    splittedImg[splittedImg.length - 1];

  for (let i = 0; i < listImageFood.length; i++) {
    if (listImageFood[i] == imgName2) {
      listImageFood.splice(i, 1);
    }
  }
  $(`input[data-cloudinary-public-id="${imgName}"]`).remove();
});

function formatCategory(id) {
  var text = "";
  switch (id) {
    case 1:
      text = "Drinks";
      break;
    case 2:
      text = "Noodle";
      break;
    case 3:
      text = "Bread";
      break;
    case 4:
      text = "Rice";
      break;
    case 5:
      text = "Meat";
      break;
    case 6:
      text = "Seafood";
      break;
    case 7:
      text = "Vegetables";
      break;
    case 8:
      text = "Vegetarian Food";
      break;
    case 9:
      text = "Fruit";
      break;
    case 10:
      text = "Fast Food";
      break;
    case 11:
      text = "Snacks";
      break;
    case 12:
      text = "Others";
      break;
  }
  return text;
}



// display donate modal on click delete button
var modal3 = document.querySelector(".modal-account-confirm-delete");
function confirmDeleteFood(id) {
  modal3.style.display = "flex";
  var buttonValue = document.getElementById("accept-button");
  // console.log(id);
  buttonValue.setAttribute("onclick", "deleteFood(" + id + ")");
}

// delete food
function deleteFood(id) {
  var dataPost = {
    status: 0,
  };
  fetch(`https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/status/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${isToken}`,
    },
    body: JSON.stringify(dataPost),
  })
    .then((response) => response.json())
    .then((food) => {
      if (food) {
        document.getElementById("food-row-" + id).style.display = "none";
        modal3.style.display = "none";
        swal("Success!", "Delete success!", "success");
        getListFood();
      }
    })
    .catch((error) => console.log(error));
}

// Close Modal by clicking "close" button
function cancelModal() {
  modal3.style.display = "none";
}

// Close Modal by clicking "esc" button
$(document).keydown(function (event) {
  if (event.keyCode == 27) {
    modal3.style.display = "none";
    event.preventDefault();
  }
});
// end

// hoangtl2 - 01/11/2021 - request list pagination on account page
// start
var requestItem = document.querySelector("#list-request");

function getListRequest(userID) {
  // console.log(userID);
  var requestListAPI = `https://hfb-t1098e.herokuapp.com/api/v1/hfb/requests?userId=${userID}&status=1`;

  fetch(requestListAPI, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${isToken}`,
    },
  })
    .then((response) => response.json())
    .then((food) => {
      if (
        food &&
        food.data &&
        food.data.content &&
        food.data.content.length > 0
      ) {
        document.querySelector("#list-request").innerHTML = renderListRequest(
          food.data.content
        );

        console.log(food.data.content);
      }
    })
    .catch((error) => console.log(error));
}

function renderListRequest(listRequest) {
  let requestContainer = $(".pagination2");
  requestContainer.pagination({
    dataSource: listRequest,
    pageSize: 5,
    showGoInput: true,
    showGoButton: true,
    formatGoInput: "go to <%= input %>",
    callback: function (data, pagination) {
      var dataHtml1 = "<div>";
      $.each(data, function (index, e) {
        requestCount++;
        dataHtml1 +=
          `<tr><td>${e.id}</td><td>${e.foodName || ""}</td><td>${
            e.message
          }</td><td>${e.supplierName}</td>` +
          "<td onclick=\"formDetailRequest('" +
          e.foodId +
          '\')"><i class="fa fa-pencil-square-o"></i></td><td onclick="deleteRequest(this, \'' +
          e.foodId +
          "', '" +
          e.message +
          "', '" +
          e.supplierId +
          "', '" +
          e.supplierName +
          '\')"><i class="fa fa-trash-o"></i></td></tr>';
      });

      dataHtml1 += "</div>";

      $("#list-request").html(dataHtml1);
    },
  });
}
// end

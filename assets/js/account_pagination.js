// hoangtl2 - 01/11/2021 - food list pagination on account page
// start

var dataAccount = null;
var foodListAPI =
  "https://hfb-t1098e.herokuapp.com/api/v1/hfb/foods/search?status=2";
var shopItem = document.querySelector(".list-food-item");
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
  let container = $(".pagination");
  container.pagination({
    dataSource: listFood,
    pageSize: 5,
    showGoInput: true,
    showGoButton: true,
    formatGoInput: "go to <%= input %>",
    callback: function (data, pagination) {
      var dataHtml = "<div>";
      var count = 0;
      $.each(data, function (index, e) {
        count++;
        // console.log(e.name);
        dataHtml +=
          `<tr>
        <td>${count}</td>
        <td>${e.name || ""}</td>
        <td><img src="https://res.cloudinary.com/vernom/image/upload/${
          e.avatar
        }" style="width: 30px;height: 30px;"/></td>
        <td>${formatCategory(e.categoryId)}</td>
        <td>${e.expirationDate}</td>
        <td>${
          e.status == 0 ? "deactive" : e.status == 1 ? "pending" : "active"
        }</td>
        <td>${e.createdAt}</td>
        <td onclick="formUpdateFood()"><i class="fa fa-pencil-square-o"></i></td>` +
          `<td onclick=confirmDeleteFood()><i class="fa fa-trash-o"></i></td></tr>`;
      });

      dataHtml += "</div>";

      $("#list-food").html(dataHtml);
    },
  });
}
//end

// hoangtl2 - 01/11/2021 - food list pagination on account page
// start
// update food
function formUpdateFood() {}

// display donate modal on click delete button
var modal3 = document.querySelector(".modal-account-confirm-delete");
function confirmDeleteFood() {
  modal3.style.display = "flex";
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
        e.parentElement.remove();
      }
    })
    .catch((error) => console.log(error));
}

// Close Modal by clicking "close" button
function closeModal() {
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

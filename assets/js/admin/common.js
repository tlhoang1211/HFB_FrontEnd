// function createElement(element){
//   return document.createElement(element);
// }
// var loadScript = function(url){
//   return new Promise((resolve, reject) => {
//     const script = createElement('script');
//     script.type = 'text/javascript'
//     script.onload = resolve
//     script.onerror = reject
//     script.src = src
//     document.body.append(script)
//   })
// }
// // var header = document.createElement('header');
// // document.querySelector("header").outerHTML = ;
// // console.log()
// function initHeader(url){
//   fetch(url)
//     .then(function(response){
//       console.log(response)
//       return response.text()
//     })
//     .then(function (html){
//       console.log(html)
//       // var header = document.createElement('header');
//       // console.log(header)
//       document.body.innerHTML = html;
//     })
//     .catch(error => console.log(console.log(error)));
// }
// $(function (){
//   initHeader('../../../inc/layout/admin/head.html');
// })


// DOM manipulation
// get the data from Wiki

// function summonJeeves() {
//   const body = document.getElementsByTagName('body');
//   const cover = document.createElement('div');
//   cover.style.height = '100%';
//   cover.style.width = '100%';
//   cover.backgroundColor = 'black';
//   body.append(cover);
// }

// $(document).ready(function(){
 
//   chrome.browserAction.onClicked.addListener(function(tab) {
//     $.ajax({
//         type: "GET",
//         url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=Pizza&callback=?",
//         contentType: "application/json; charset=utf-8",
//         async: false,
//         dataType: "json",
//         success: function (data, textStatus, jqXHR) {
//             alert(data);
//         },
//         error: function (errorMessage) {
//         }
//     });
//   });
// });

chrome.browserAction.onClicked.addListener(function(tab) {
  alert('Hi Lee, this is your worst nightmare...');
});

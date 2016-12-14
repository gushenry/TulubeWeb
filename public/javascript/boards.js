window.onload = function() {

  $(".createNewBoard").click(function() {
    $("#createNewBoardModal").modal('toggle');
  })
  
  $(".clickable-row").click(function() {
    window.document.location = $(this).data("href");
  });

}
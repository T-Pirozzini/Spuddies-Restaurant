$(() => {
  const $submit = $(".check-out");
  const $menuContainer = $(".menu-container");

  // SUBMIT ORDER - chain of events on 'click'
  $submit.on("click", (e) => {
    //SET TIMEOUT & ADD SPINNER
    setTimeout(checkout, 4000);
    $potato = $('<p class="spinner">🥔</p>');
    $prepareOrder = $('<p class="spinner-text">Preparing your order...</p>');
    $(".check-out").text("");
    $(".check-out").append($prepareOrder, $potato);

    // REPLACE SUBMIT WITH ORDER CONFIRMATION
    function checkout() {
      $.ajax("checkout.html", { method: "GET" })
        .then(function (checkout) {
          $menuContainer.replaceWith(checkout);

          // API CALL - TWILLIO - SEND TEXT TO RESTAURANT OWNER
          $.ajax({
            url: "http://localhost:8084/api/submit",
            method: "GET",
          })
            .then((data) => {
              console.log("DATA:", data);
            })
            .catch((err) => {
              console.log("Error: ", err);
            });

          // REMOVE CURRENT ORDER BUTTONS & STOP SPINNER
          const $add = $(".add");
          const $minus = $(".minus");
          const $remove = $(".remove-btn");
          $add.hide();
          $minus.hide();
          $remove.hide();
          $submit.hide();

          // DISPLAY RECEIPT
          $orderContainer = $(".order-container");
          $orderContainer.removeClass();
          $orderContainer.addClass("order-container-receipt");

          // CHANGE ORDER TITLE TO "RECEIPT"
          $orderTitle = $(".order-title");
          $orderTitle.text("RECEIPT");

          // ADD LOADING BAR
          $stageOne = $(
            '<div class="progress"><div class="stageOne progress-bar bg-danger progress-bar-striped progress-bar-animated" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div></div>'
          );
          $received = $("<p>We have received your order</p>");
          $(".loading-text").append($received);
          $(".loading-bar").append($stageOne);

          // SEND TEXT BACK TO THE CLIENT & PAUSE LOADING BAR ANIMATION
          let something = "test";
          const scan = setInterval(() => {
            if (something !== "test") {
              clearInterval(scan);
              setTimeout(() => {
                $stageTwo = $(
                  '<div class="progress"><div class="stageTwo progress-bar bg-info progress-bar-striped progress-bar-animated" role="progressbar" style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div></div>'
                );
                $bath = $("<p>Potato sponge bath</p>");
                $(".loading-text").append($bath);
                $(".loading-bar").append($stageTwo);
                $received.hide();
                $stageOne.hide();
              }, 3000);
              setTimeout(() => {
                $stageThree = $(
                  '<div class="progress"><div class="stageThree progress-bar bg-warning progress-bar-striped progress-bar-animated" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div></div>'
                );
                $assemble = $("<p>Potato assembly</p>");
                $(".loading-text").append($assemble);
                $(".loading-bar").append($stageThree);
                $bath.hide();
                $stageTwo.hide();
              }, 7000);
              setTimeout(() => {
                $stageFour = $(
                  '<div class="progress"><div class="stageFour progress-bar bg-success progress-bar-striped progress-bar-animated" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div>'
                );
                $package = $("<p>Packaging your order</p>");
                $(".loading-text").append($package);
                $(".loading-bar").append($stageFour);
                $assemble.hide();
                $stageThree.hide();
              }, 10000);
              setTimeout(() => {
                $ready = $("<h3>Your order is ready to be picked up!</h3>");
                $(".loading-text").append($ready);
                $package.hide();
              }, 15000);
            }

            // RESUME LOADING BAR AFTER RESTAURANT ETA TEXT IS RECEIVED
            $.ajax({
              url: "http://localhost:8084/api/submit/eta",
              method: "GET",
            })
              .then((data) => {
                console.log("DATA:", data.eta);
                something = data.eta;
              })
              .catch((err) => {
                console.log("Error: ", err);
              });
          }, 1000);
        })
        .catch((err) => {
          console.log("Error: ", err);
        });
    }
  });
});

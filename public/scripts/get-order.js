$(() => {
  const $fetchOrder = $("#fetch-order");
  const $orderID = $("#fetch");
  const $orderEntries = $(".order-entries");

  const renderOrder = (order) => {
    $orderEntries.empty();

    for (const item of order) {
      // Create new jquery object newItem
      const newItem = addOrderItem(item);

      $orderEntries.append(newItem);
    }

    const date = String(order[0].order_time).slice(0, 10);
    const time = String(order[0].order_time).slice(11, 22);

    // JQUERY FOR ORDER TOTAL AND TIMESTAMP INFO
    const $total = $(`
      <tr class="restaurant">
        <td></td>
        <td>Total:</td>
        <td>$${order[0].total_price}</td>
        <td>Ordered at:</td>
        <td>${date} ${time}</td>
      </tr>
    `);

    $orderEntries.append($total);
  };

  // JQUERY FOR ORDER'S INDIVIDUAL LINE ITEM INFO
  const addOrderItem = (object) => {
    const $orderItem = $(`
      <tr class='restaurant'>
        <td>${object.item}</td>
        <td>${object.quantity}</td>
        <td>$${object.sub_total}</td>
      </tr>
    `);
    return $orderItem;
  };

  // BEHAVIOR FOR FETCH ORDER BUTTON
  $fetchOrder.on("click", (e) => {
    e.preventDefault();

    // INCLUDES ORDERID VALUE IN TWILIO TEXT SENT TO RESTAURANT
    $.ajax({
      url: `https://spuddies-food-ordering.herokuapp.com/orders/${$orderID.val()}`,
      method: "GET",
      dataType: "json",
    })
      .then((data) => {
        console.log("DATA:", data);
        renderOrder(data);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });

    console.log("Order ID:", $orderID.val());
    $orderID.val("");
  });
});

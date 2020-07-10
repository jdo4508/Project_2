console.log("loaded");

function testing() {
    // Read in the data and make promise
    d3.json("/listings").then((data) => {
        console.log(data);
    });

}
testing();
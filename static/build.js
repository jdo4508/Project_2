function testing() {
    // Read in the data and make promise
    d3.json("/getall").then((data) => {
        console.log(data)
    }
}


exports.getPayMethodOptionsViewData = function (category) {
    const titles = ['vehicles, Vehicles',
        'estate, Real Estate',
        'electronics, Electronics',
        'furniture, Furniture',
        'other, Other']



    let options = [];

    titles.forEach(title => {
        let element = title.split(', ')

        let option = {

            title: element[1],
            value: element[0],
            selected: category === element[1],
        }

        options.push(option)

    });


    console.log(options);
    return options

}
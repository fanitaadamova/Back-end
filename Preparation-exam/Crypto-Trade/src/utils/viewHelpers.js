exports.getPayMethodOptionsViewData = function (platform) {
    const titles = [
        'Crypto Wallet',
        'Credit Card',
        'Debit Card',
        'PayPal'
    ];


    const options = titles.map((title) => ({
        title: title,
        value: title,
        selected: platform === title,
    }));

    return options

}
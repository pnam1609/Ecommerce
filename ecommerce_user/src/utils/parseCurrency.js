export const parseCurrency = currency => {
    var res = currency.replaceAll(",", "")
    res = res.splice(0, res.lenght - 2)
    return res
}
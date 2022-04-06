const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(a + b)
        }, 2000)
    })
}

const doWork = async() => {
    const sum = await add(1, 2)
    const sum1 = await add(sum, 2)
    const sum2 = await add(sum1, 2)
    return sum2
}

doWork().then((result) => {
    console.log(result)
    console.log(e)
}).catch((e) => {})